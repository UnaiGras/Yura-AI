import { ReactNode, createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';

import {
  User,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { doc, onSnapshot, serverTimestamp, setDoc, Unsubscribe } from 'firebase/firestore';

import { auth, db } from '@/firebaseConfig';

export type UserProfile = {
  email: string;
  displayName: string;
  premium: boolean;
};

type AuthContextValue = {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const profileUnsubscribe = useRef<Unsubscribe | null>(null);

  useEffect(() => {
    function cleanupProfileListener() {
      if (profileUnsubscribe.current) {
        profileUnsubscribe.current();
        profileUnsubscribe.current = null;
      }
    }

    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthReady(true);

      cleanupProfileListener();

      if (!currentUser) {
        setProfile(null);
        setProfileLoading(false);
        return;
      }

      const userDocRef = doc(db, 'users', currentUser.uid);
      setProfileLoading(true);

      profileUnsubscribe.current = onSnapshot(
        userDocRef,
        (snapshot) => {
          if (!snapshot.exists()) {
            const defaultProfile = buildDefaultProfile(currentUser);

            setDoc(
              userDocRef,
              {
                ...defaultProfile,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
              },
              { merge: true }
            ).catch((error) => {
              console.error('[AuthProvider] Failed to create user profile document', error);
            });

            setProfile(defaultProfile);
          } else {
            const data = snapshot.data() as Partial<UserProfile>;
            setProfile({
              email: typeof data.email === 'string' && data.email.length ? data.email : currentUser.email ?? '',
              displayName:
                typeof data.displayName === 'string' && data.displayName.length
                  ? data.displayName
                  : currentUser.displayName ?? '',
              premium: typeof data.premium === 'boolean' ? data.premium : !!data.premium,
            });
          }

          setProfileLoading(false);
        },
        (error) => {
          console.error('[AuthProvider] Failed to listen to user profile', error);
          setProfile(buildDefaultProfile(currentUser));
          setProfileLoading(false);
        }
      );
    });

    return () => {
      cleanupProfileListener();
      unsubscribeAuth();
    };
  }, []);

  const combinedLoading = !authReady || profileLoading;

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      profile,
      loading: combinedLoading,
      async signIn(email, password) {
        await signInWithEmailAndPassword(auth, email.trim(), password);
      },
      async signUp(email, password) {
        const credential = await createUserWithEmailAndPassword(auth, email.trim(), password);
        const createdUser = credential.user;

        if (createdUser) {
          const userDocRef = doc(db, 'users', createdUser.uid);
          const defaultProfile = buildDefaultProfile(createdUser);

          await setDoc(
            userDocRef,
            {
              ...defaultProfile,
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp(),
            },
            { merge: true }
          );
        }
      },
      async signOut() {
        await firebaseSignOut(auth);
      },
    }),
    [user, profile, combinedLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function buildDefaultProfile(currentUser: User): UserProfile {
  return {
    email: currentUser.email ?? '',
    displayName: currentUser.displayName ?? '',
    premium: false,
  };
}

export function useAuthContext() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }

  return context;
}

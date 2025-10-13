import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApp, getApps, initializeApp } from 'firebase/app';
import { connectAuthEmulator, getAuth, getReactNativePersistence, initializeAuth } from 'firebase/auth';
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore';
import { connectFunctionsEmulator, getFunctions } from 'firebase/functions';
import { Platform } from 'react-native';

const firebaseConfig = {
  apiKey: 'AIzaSyBwe350YXRJliDrRzIhF8WiMc5KMrDkg8c',
  authDomain: 'yura-5971b.firebaseapp.com',
  projectId: 'yura-5971b',
  storageBucket: 'yura-5971b.appspot.com',
  messagingSenderId: 'TU_SENDER_ID',
  appId: '1:956872186948:android:a87cd7dfe03fd9da7cf011',
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

function createAuthInstance() {
  if (Platform.OS === 'web') {
    return getAuth(app);
  }

  try {
    return initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } catch (error) {
    return getAuth(app);
  }
}

export const auth = createAuthInstance();
export const db = getFirestore(app);
export const functions = getFunctions(app);


if (__DEV__) {
  connectFunctionsEmulator(functions, '192.168.0.14', 5001);
  connectFirestoreEmulator(db, '192.168.0.14', 8080);
  connectAuthEmulator(auth, 'http://192.168.0.14:9099');
}


export { app };

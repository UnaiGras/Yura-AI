import { useEffect, useMemo, useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import { Link, useRouter } from 'expo-router';

import { Text } from '@/components/Themed';
import { AuthButton } from '@/components/auth/AuthButton';
import { AuthTextInput } from '@/components/auth/AuthTextInput';
import { useAuth } from '@/hooks/useAuth';

export default function LoginScreen() {
  const router = useRouter();
  const { user, loading, signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && user) {
      router.replace('/(tabs)/(main)');
    }
  }, [loading, user, router]);

  const disabled = useMemo(() => !email.trim() || !password.trim() || submitting, [email, password, submitting]);

  const handleSubmit = async () => {
    setError(null);

    if (!email.trim() || !password) {
      setError('Email and password are required.');
      return;
    }

    setSubmitting(true);

    try {
      await signIn(email, password);
      router.replace('/(tabs)/(main)');
    } catch (err) {
      setError(getFirebaseErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={64}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.subtitle}>Log in to continue.</Text>

        <AuthTextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          returnKeyType="next"
        />

        <AuthTextInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoComplete="password"
          returnKeyType="done"
          onSubmitEditing={handleSubmit}
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <AuthButton title="Log In" onPress={handleSubmit} loading={submitting} disabled={disabled} />

        <View style={styles.linkRow}>
          <Text style={styles.linkPrompt}>Don&apos;t have an account?</Text>
          <Link href="/(auth)/signup" replace>
            <Text style={styles.link}>Sign up</Text>
          </Link>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

function getFirebaseErrorMessage(error: unknown) {
  if (typeof error === 'object' && error && 'code' in error) {
    const code = String((error as { code: string }).code);

    switch (code) {
      case 'auth/invalid-email':
        return 'The email address is invalid.';
      case 'auth/user-not-found':
      case 'auth/wrong-password':
        return 'Incorrect email or password.';
      case 'auth/too-many-requests':
        return 'Too many attempts. Try again later.';
      default:
        return 'Unable to log in. Please try again.';
    }
  }

  return 'Unable to log in. Please try again.';
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 32,
  },
  error: {
    marginTop: 8,
    color: '#ff4d4f',
  },
  linkRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  linkPrompt: {
    fontSize: 14,
  },
  link: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
});

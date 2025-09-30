import { useEffect, useMemo, useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import { Link, useRouter } from 'expo-router';

import { Text } from '@/components/Themed';
import { AuthButton } from '@/components/auth/AuthButton';
import { AuthTextInput } from '@/components/auth/AuthTextInput';
import { useAuth } from '@/hooks/useAuth';

export default function SignupScreen() {
  const router = useRouter();
  const { user, loading, signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && user) {
      router.replace('/(tabs)/(main)');
    }
  }, [loading, user, router]);

  const disabled = useMemo(
    () =>
      !email.trim() ||
      !password.trim() ||
      !confirmPassword.trim() ||
      password !== confirmPassword ||
      submitting,
    [email, password, confirmPassword, submitting]
  );

  const handleSubmit = async () => {
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError('Email and password are required.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setSubmitting(true);

    try {
      await signUp(email, password);
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
        <Text style={styles.title}>Create an account</Text>
        <Text style={styles.subtitle}>Sign up to get started.</Text>

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
          autoComplete="password-new"
          returnKeyType="next"
        />

        <AuthTextInput
          label="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          autoComplete="password-new"
          returnKeyType="done"
          onSubmitEditing={handleSubmit}
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <AuthButton title="Sign Up" onPress={handleSubmit} loading={submitting} disabled={disabled} />

        <View style={styles.linkRow}>
          <Text style={styles.linkPrompt}>Already have an account?</Text>
          <Link href="/(auth)/login" replace>
            <Text style={styles.link}>Log in</Text>
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
      case 'auth/email-already-in-use':
        return 'This email is already registered.';
      case 'auth/invalid-email':
        return 'The email address is invalid.';
      case 'auth/operation-not-allowed':
        return 'Email/password accounts are disabled for this project.';
      case 'auth/weak-password':
        return 'Password is too weak. Use at least 6 characters.';
      default:
        return 'Unable to sign up. Please try again.';
    }
  }

  return 'Unable to sign up. Please try again.';
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

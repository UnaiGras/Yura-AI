import { Alert, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

import { Text, View } from '@/components/Themed';
import { ThemedButton } from '@/components/ThemedButton';
import { useAuth } from '@/hooks/useAuth';
import { usePurchases } from '@/hooks/usePurchases';

export default function Profile() {
  const { user, signOut } = useAuth();
  const {
    isPremium,
    activeEntitlementIds,
    restorePurchases,
    isProcessingPurchase,
    isInitializing,
  } = usePurchases();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      Alert.alert('Sign out failed', 'Please try again.');
    }
  };

  const handleRestorePurchases = async () => {
    try {
      await restorePurchases();
      Alert.alert('Purchases restored', 'Your premium access has been refreshed.');
    } catch (error) {
      Alert.alert('Restore failed', 'We could not restore purchases right now.');
    }
  };

  const handleOpenPremium = () => {
    router.push('/purchase');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      {user ? (
        <>
          <Text style={styles.subtitle}>Logged in as</Text>
          <Text style={styles.email}>{user.email}</Text>
          <View style={styles.premiumCard}>
            <Text style={styles.cardTitle}>Premium status</Text>
            <Text style={styles.statusText}>{isPremium ? 'Premium unlocked' : 'Free tier'}</Text>
            {activeEntitlementIds.length ? (
              <Text style={styles.entitlements}>Entitlements: {activeEntitlementIds.join(', ')}</Text>
            ) : null}
            <View style={styles.cardActions}>
              <ThemedButton
                title={isPremium ? 'Manage Subscription' : 'Upgrade to Premium'}
                onPress={handleOpenPremium}
                lightBackgroundColor={isPremium ? '#2e7d32' : undefined}
                disabled={isInitializing}
              />
              <ThemedButton
                title="Restore Purchases"
                onPress={handleRestorePurchases}
                disabled={isProcessingPurchase}
              />
            </View>
          </View>
          <ThemedButton title="Sign Out" onPress={handleSignOut} style={styles.button} />
        </>
      ) : (
        <Text style={styles.subtitle}>You are not signed in.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 8,
  },
  email: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 24,
  },
  button: {
    width: '100%',
  },
  premiumCard: {
    width: '100%',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    gap: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  statusText: {
    fontSize: 16,
    fontWeight: '500',
  },
  entitlements: {
    fontSize: 14,
    opacity: 0.7,
  },
  cardActions: {
    gap: 12,
  },
});

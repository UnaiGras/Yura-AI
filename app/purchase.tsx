import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';

import { Text } from '@/components/Themed';
import { ThemedButton } from '@/components/ThemedButton';
import { PackageCard } from '@/components/purchases/PackageCard';
import { usePurchases } from '@/hooks/usePurchases';

export default function PurchaseScreen() {
  const router = useRouter();
  const {
    isConfigured,
    isInitializing,
    isRefreshing,
    isProcessingPurchase,
    currentOffering,
    isPremium,
    refreshOfferings,
    purchasePackage,
    restorePurchases,
  } = usePurchases();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const availablePackages = useMemo(
    () => currentOffering?.availablePackages ?? [],
    [currentOffering?.availablePackages]
  );

  useEffect(() => {
    if (!isConfigured || isInitializing) {
      return;
    }

    if (!availablePackages.length) {
      refreshOfferings();
    }
  }, [isConfigured, isInitializing, availablePackages.length, refreshOfferings]);

  const handlePurchase = async (pkg: (typeof availablePackages)[number]) => {
    setErrorMessage(null);

    try {
      const info = await purchasePackage(pkg);

      if (info) {
        Alert.alert('Success', 'Purchase completed successfully.');
      }
    } catch (error: any) {
      const message = error?.message ?? 'Purchase failed. Please try again later.';
      setErrorMessage(message);
      Alert.alert('Purchase failed', message);
    }
  };

  const handleRestore = async () => {
    setErrorMessage(null);

    try {
      const info = await restorePurchases();

      if (info) {
        Alert.alert('Restored', 'Your purchases have been restored.');
      }
    } catch (error: any) {
      const message = error?.message ?? 'Unable to restore purchases right now.';
      setErrorMessage(message);
      Alert.alert('Restore failed', message);
    }
  };

  const handleClose = () => {
    router.back();
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={refreshOfferings} />}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Unlock Premium</Text>
        <Text style={styles.subtitle}>
          Access the full experience with unlimited relaxing sounds, exclusive ambience tracks, and
          premium wellness content.
        </Text>
      </View>

      {!isConfigured ? (
        <View style={styles.center}>
          <Text style={styles.error}>
            RevenueCat is not configured. Set your EXPO_PUBLIC_REVENUECAT_API_KEY and reload the app.
          </Text>
        </View>
      ) : null}

      {isInitializing ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" />
        </View>
      ) : null}

      {isConfigured && !isInitializing && !availablePackages.length ? (
        <View style={styles.center}>
          <Text>No products available right now. Pull to refresh.</Text>
        </View>
      ) : null}

      {availablePackages.map((pkg) => (
        <PackageCard
          key={`${pkg.identifier}`}
          pkg={pkg}
          onPress={handlePurchase}
          disabled={isProcessingPurchase}
          footer={
            isPremium ? <Text style={styles.alreadyPremium}>Already unlocked</Text> : undefined
          }
        />
      ))}

      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}

      <View style={styles.actions}>
        <ThemedButton
          title="Restore Purchases"
          onPress={handleRestore}
          disabled={isProcessingPurchase}
        />
        <ThemedButton title="Close" onPress={handleClose} />
      </View>

      {isPremium ? (
        <View style={styles.center}>
          <Text style={styles.success}>You currently have premium access.</Text>
        </View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 24,
    paddingBottom: 48,
    gap: 16,
  },
  header: {
    gap: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 22,
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
  },
  error: {
    color: '#ff4d4f',
    textAlign: 'center',
  },
  success: {
    color: '#22aa5d',
    fontWeight: '600',
  },
  alreadyPremium: {
    fontSize: 14,
    fontWeight: '500',
    color: '#22aa5d',
  },
  actions: {
    gap: 12,
  },
});

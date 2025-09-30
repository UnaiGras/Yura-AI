import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import Purchases, {
  LOG_LEVEL,
  CustomerInfo,
  PurchasesOfferings,
  PurchasesPackage,
} from 'react-native-purchases';

import { useAuth } from '@/hooks/useAuth';
import {
  HAS_REVENUECAT_KEY,
  REVENUECAT_API_KEY,
  REVENUECAT_ENTITLEMENT_ID,
} from '@/constants/revenueCat';

type PurchasesContextValue = {
  isConfigured: boolean;
  isInitializing: boolean;
  isRefreshing: boolean;
  isProcessingPurchase: boolean;
  offerings: PurchasesOfferings | null;
  currentOffering: PurchasesOfferings['current'] | null;
  customerInfo: CustomerInfo | null;
  activeEntitlementIds: string[];
  isPremium: boolean;
  refreshOfferings: () => Promise<void>;
  purchasePackage: (selectedPackage: PurchasesPackage) => Promise<CustomerInfo | null>;
  restorePurchases: () => Promise<CustomerInfo | null>;
};

const PurchasesContext = createContext<PurchasesContextValue | undefined>(undefined);

export function PurchasesProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [offerings, setOfferings] = useState<PurchasesOfferings | null>(null);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isProcessingPurchase, setIsProcessingPurchase] = useState(false);
  const isConfiguredRef = useRef(false);
  const previousUserId = useRef<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    if (!HAS_REVENUECAT_KEY) {
      console.warn(
        '[PurchasesProvider] Missing RevenueCat public SDK key. Set EXPO_PUBLIC_REVENUECAT_API_KEY or extra.revenueCatApiKey.'
      );
      setIsInitializing(false);
      return () => {
        isMounted = false;
      };
    }

    if (isConfiguredRef.current) {
      setIsInitializing(false);
      return () => {
        isMounted = false;
      };
    }

    Purchases.setLogLevel(__DEV__ ? LOG_LEVEL.DEBUG : LOG_LEVEL.ERROR);

    async function configure() {
      try {
        await Purchases.configure({
          apiKey: REVENUECAT_API_KEY,
          appUserID: undefined,
        });
        isConfiguredRef.current = true;

        const [fetchedOfferings, info] = await Promise.all([
          Purchases.getOfferings(),
          Purchases.getCustomerInfo(),
        ]);

        if (isMounted) {
          setOfferings(fetchedOfferings);
          setCustomerInfo(info);
        }
      } catch (error) {
        console.error('[PurchasesProvider] Failed to configure RevenueCat', error);
      } finally {
        if (isMounted) {
          setIsInitializing(false);
        }
      }
    }

    configure();

    const listener = (info: CustomerInfo) => {
      if (isMounted) {
        setCustomerInfo(info);
      }
    };

    Purchases.addCustomerInfoUpdateListener(listener);

    return () => {
      isMounted = false;
      Purchases.removeCustomerInfoUpdateListener(listener);
    };
  }, []);

  useEffect(() => {
    if (!isConfiguredRef.current || !HAS_REVENUECAT_KEY) {
      return;
    }

    const appUserId = user?.uid ?? null;

    if (previousUserId.current === appUserId) {
      return;
    }

    previousUserId.current = appUserId;

    let isActive = true;

    async function syncUser() {
      try {
        if (appUserId) {
          await Purchases.logIn(appUserId);
        } else {
          await Purchases.logOut();
        }

        if (isActive) {
          const info = await Purchases.getCustomerInfo();
          setCustomerInfo(info);
        }
      } catch (error) {
        console.error('[PurchasesProvider] Failed to sync RevenueCat user', error);
      }
    }

    syncUser();

    return () => {
      isActive = false;
    };
  }, [user?.uid]);

  const refreshOfferings = useCallback(async () => {
    if (!isConfiguredRef.current) {
      console.warn('[PurchasesProvider] RevenueCat is not configured.');
      return;
    }

    setIsRefreshing(true);

    try {
      const fetchedOfferings = await Purchases.getOfferings();
      setOfferings(fetchedOfferings);
    } catch (error) {
      console.error('[PurchasesProvider] Failed to refresh offerings', error);
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  const purchasePackage = useCallback(async (selectedPackage: PurchasesPackage) => {
    if (!isConfiguredRef.current) {
      console.warn('[PurchasesProvider] RevenueCat is not configured.');
      return null;
    }

    setIsProcessingPurchase(true);

    try {
      const { customerInfo: updatedCustomerInfo } = await Purchases.purchasePackage(selectedPackage);
      setCustomerInfo(updatedCustomerInfo);
      return updatedCustomerInfo;
    } catch (error: any) {
      if (error?.userCancelled) {
        return null;
      }

      console.error('[PurchasesProvider] Purchase failed', error);
      throw error;
    } finally {
      setIsProcessingPurchase(false);
    }
  }, []);

  const restorePurchases = useCallback(async () => {
    if (!isConfiguredRef.current) {
      console.warn('[PurchasesProvider] RevenueCat is not configured.');
      return null;
    }

    try {
      const restoredInfo = await Purchases.restorePurchases();
      setCustomerInfo(restoredInfo);
      return restoredInfo;
    } catch (error) {
      console.error('[PurchasesProvider] Restore purchases failed', error);
      throw error;
    }
  }, []);

  const value = useMemo<PurchasesContextValue>(() => {
    const activeEntitlementIds = customerInfo?.entitlements?.active
      ? Object.keys(customerInfo.entitlements.active)
      : [];

    const isPremium = REVENUECAT_ENTITLEMENT_ID
      ? activeEntitlementIds.includes(REVENUECAT_ENTITLEMENT_ID)
      : activeEntitlementIds.length > 0;

    return {
      isConfigured: isConfiguredRef.current,
      isInitializing,
      isRefreshing,
      isProcessingPurchase,
      offerings,
      currentOffering: offerings?.current ?? null,
      customerInfo,
      activeEntitlementIds,
      isPremium,
      refreshOfferings,
      purchasePackage,
      restorePurchases,
    };
  }, [
    customerInfo,
    offerings,
    isInitializing,
    isRefreshing,
    isProcessingPurchase,
    refreshOfferings,
    purchasePackage,
    restorePurchases,
  ]);

  return <PurchasesContext.Provider value={value}>{children}</PurchasesContext.Provider>;
}

export function usePurchasesContext() {
  const context = useContext(PurchasesContext);

  if (!context) {
    throw new Error('usePurchasesContext must be used within a PurchasesProvider');
  }

  return context;
}

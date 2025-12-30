import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

import { Text, useThemeColor, View } from '@/components/Themed';
import { getAllTests, TestDefinition } from '@/lib/tests';

export default function TestsScreen() {
  const router = useRouter();
  const [tests, setTests] = useState<TestDefinition[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cardBackground = useThemeColor(
    { light: '#f5f7ff', dark: 'rgba(255,255,255,0.05)' },
    'background'
  );
  const cardBorder = useThemeColor(
    { light: 'rgba(59, 130, 246, 0.15)', dark: 'rgba(255,255,255,0.12)' },
    'text'
  );

  useEffect(() => {
    let isActive = true;

    async function fetchTests() {
      try {
        setLoading(true);
        const definitions = await getAllTests();
        if (isActive) {
          setTests(definitions);
          setError(null);
        }
      } catch (err: any) {
        console.error('[TestsScreen] Failed to load tests', err);
        if (isActive) {
          setError('Unable to load tests. Pull to refresh.');
        }
      } finally {
        if (isActive) {
          setLoading(false);
          setRefreshing(false);
        }
      }
    }

    fetchTests();

    return () => {
      isActive = false;
    };
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const definitions = await getAllTests();
      setTests(definitions);
      setError(null);
    } catch (err: any) {
      console.error('[TestsScreen] Failed to refresh tests', err);
      setError('Unable to refresh tests right now.');
    } finally {
      setRefreshing(false);
    }
  };

  const handleOpenTest = (test: TestDefinition) => {
    router.push({
      pathname: '/(tabs)/(tests)/[testId]',
      params: { testId: test.id },
    });
  };

  return (
    <FlatList
      data={tests}
      keyExtractor={(item) => item.id}
      style={styles.list}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
      ListHeaderComponent={
        <View style={styles.header}>
          <Text style={styles.title}>Guided Tests</Text>
          <Text style={styles.subtitle}>
            Choose a reflection to explore. Answer the prompts at your own pace—your responses stay on this device.
          </Text>
        </View>
      }
      ListEmptyComponent={
        loading ? (
          <View style={styles.emptyState}>
            <ActivityIndicator size="large" />
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Text>{error ?? 'No tests available yet.'}</Text>
          </View>
        )
      }
      renderItem={({ item }) => (
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => handleOpenTest(item)}
          style={[styles.card, { backgroundColor: cardBackground, borderColor: cardBorder }]}
        >
          <Text style={styles.cardTitle}>{item.title}</Text>
          {item.description ? <Text style={styles.cardSubtitle}>{item.description}</Text> : null}
        </TouchableOpacity>
      )}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
  content: {
    paddingTop: 120,
    paddingBottom: 40,
    paddingHorizontal: 20,
    gap: 16,
  },
  header: {
    gap: 8,
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 22,
    opacity: 0.85,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
    gap: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  cardSubtitle: {
    fontSize: 14,
    opacity: 0.75,
  },
});

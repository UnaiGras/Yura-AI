import { useRouter } from "expo-router";
import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  Dimensions
} from "react-native";
import { Text, useThemeColor } from "@/components/Themed";
import Colors from "@/constants/Colors";
import { useColorScheme } from '@/components/useColorScheme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get('window');

export default function Main() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const themeColors = Colors[isDark ? 'dark' : 'light'];
  const accentColor = (themeColors as any).pastelGreen || '#D1F2D6';

  // Card Background with transparency
  const cardBg = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)';

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Hello,</Text>
          <Text style={styles.username}>The Architect</Text>
        </View>

        {/* Dashboard Grid */}
        <View style={styles.grid}>

          {/* Yura - Large Featured Card */}
          <TouchableOpacity
            style={[styles.card, styles.cardLarge, { backgroundColor: cardBg }]}
            activeOpacity={0.9}
            onPress={() => router.push('/(tabs)/(yura)')}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Talk to Yura</Text>
              <Text style={[styles.cardSubtitle, { color: accentColor }]}>AI Companion</Text>
            </View>
            <Image
              source={require('@/assets/images/yura_happy.png')}
              style={styles.yuraImage}
              resizeMode="contain"
            />
            <View style={[styles.actionButton, { backgroundColor: accentColor }]}>
              <Ionicons name="chatbubble-ellipses-outline" size={24} color="#000" />
            </View>
          </TouchableOpacity>

          <View style={styles.row}>
            {/* Relax - Medium Card */}
            <TouchableOpacity
              style={[styles.card, styles.cardHalf, { backgroundColor: cardBg }]}
              activeOpacity={0.9}
              onPress={() => router.push('/(tabs)/(relax)')}
            >
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Relax</Text>
                <Text style={styles.cardSubtitle}>Sounds</Text>
              </View>
              <View style={styles.iconContainer}>
                <Ionicons name="musical-notes-outline" size={40} color={isDark ? '#fff' : '#000'} />
              </View>
            </TouchableOpacity>

            {/* Profile/Tests - Medium Card */}
            <TouchableOpacity
              style={[styles.card, styles.cardHalf, { backgroundColor: cardBg }]}
              activeOpacity={0.9}
              onPress={() => router.push('/(tabs)/(profile)')}
            >
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Profile</Text>
                <Text style={styles.cardSubtitle}>Settings</Text>
              </View>
              <View style={styles.iconContainer}>
                <Ionicons name="person-outline" size={40} color={isDark ? '#fff' : '#000'} />
              </View>
            </TouchableOpacity>
          </View>

          {/* Extra Banner (Tests) */}
          <TouchableOpacity
            style={[styles.card, styles.cardBanner, { backgroundColor: cardBg }]}
            activeOpacity={0.9}
            onPress={() => router.push('/(tabs)/(tests)')}
          >
            <View>
              <Text style={styles.cardTitle}>Experimental</Text>
              <Text style={styles.cardSubtitle}>Test Features</Text>
            </View>
            <Ionicons name="flask-outline" size={32} color={accentColor} />
          </TouchableOpacity>

        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 100,
  },
  header: {
    marginBottom: 30,
  },
  greeting: {
    fontSize: 28,
    fontFamily: 'SpaceMono', // or default if not loaded
    opacity: 0.6,
  },
  username: {
    fontSize: 34,
    fontWeight: '700',
  },
  grid: {
    gap: 16,
  },
  row: {
    flexDirection: 'row',
    gap: 16,
  },
  card: {
    borderRadius: 24,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    position: 'relative',
    overflow: 'hidden',
  },
  cardLarge: {
    height: 300,
    justifyContent: 'space-between',
  },
  cardHalf: {
    flex: 1,
    height: 180,
    justifyContent: 'space-between',
  },
  cardBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 24,
  },
  cardHeader: {
    zIndex: 2,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  cardSubtitle: {
    fontSize: 14,
    opacity: 0.7,
    marginTop: 4,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  yuraImage: {
    position: 'absolute',
    right: -20,
    bottom: -20,
    width: 220,
    height: 250,
    zIndex: 1,
  },
  actionButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
    alignSelf: 'flex-start', // Keeps it aligned if needed, though in large card it's mostly visual
  },
  iconContainer: {
    alignSelf: 'flex-end',
    opacity: 0.8,
  }
});

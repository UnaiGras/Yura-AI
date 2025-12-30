import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Image, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { View, Text } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

export default function Profile() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const themeColors = Colors[isDark ? 'dark' : 'light'];
  // Fallback if pastelGreen isn't in light theme, though we are focusing on dark mode
  const highlightColor = (themeColors as any).pastelGreen || '#D1F2D6';

  const menuGroups = [
    {
      title: 'Account',
      items: [
        { icon: 'person-outline', label: 'Account Details', subtitle: 'Manager your Account Details' },
        { icon: 'card-outline', label: 'Payment History', subtitle: 'View your past orders' },
        { icon: 'notifications-outline', label: 'Notification' },
        { icon: 'settings-outline', label: 'Settings' },
      ],
    },
    {
      title: 'Support',
      items: [
        { icon: 'call-outline', label: 'Contact Us' },
        { icon: 'document-text-outline', label: 'Teams & condition' },
        { icon: 'shield-checkmark-outline', label: 'Privacy Policy' },
        { icon: 'help-circle-outline', label: 'Get Help' },
      ],
    },
    {
      title: 'Actions',
      items: [
        { icon: 'log-out-outline', label: 'Log out', isDestructive: false }, // Kept neutral for now
      ],
    }
  ];

  return (
    <ScrollView style={[styles.container, { backgroundColor: themeColors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          {/* Placeholder Avatar */}
          <View style={[styles.avatarCmd, { backgroundColor: '#333' }]}>
            <Image
              source={{ uri: 'https://i.pravatar.cc/150?img=11' }}
              style={styles.avatar}
            />
          </View>
          <View style={styles.userTexts}>
            <Text style={styles.userName}>Mr.Jacob</Text>
            <Text style={styles.userStatus}>Welcome to California</Text>
          </View>
        </View>
        <TouchableOpacity style={[styles.editButton, { backgroundColor: '#333' }]}>
          <Ionicons name="create-outline" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Grouped Lists */}
      <View style={styles.content}>
        {menuGroups.map((group, groupIndex) => (
          <View key={groupIndex} style={styles.menuGroup}>
            {group.items.map((item: any, index) => (
              <TouchableOpacity key={index} style={styles.menuItem}>
                <View style={styles.menuIconContainer}>
                  <Ionicons name={item.icon} size={22} color={themeColors.text} />
                </View>
                <View style={styles.menuTextContainer}>
                  <Text style={styles.menuLabel}>{item.label}</Text>
                  {item.subtitle && <Text style={styles.menuSubtitle}>{item.subtitle}</Text>}
                </View>
                <Ionicons name="chevron-forward" size={20} color="#666" />
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60, // approximate status bar space
    paddingBottom: 30,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  avatarCmd: {
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  userTexts: {
    justifyContent: 'center',
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  userStatus: {
    fontSize: 14,
    color: '#888',
    marginTop: 2,
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    paddingHorizontal: 20,
    gap: 20,
  },
  menuGroup: {
    // No background on the group itself in the dark reference, 
    // but items look cohesive. We can add a subtle background if needed.
    // The reference seems to have a grouped background or just transparent.
    // Let's assume transparent for "clean dark mode" unless requested otherwise.
    borderRadius: 16,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  menuIconContainer: {
    width: 40,
    alignItems: 'flex-start',
  },
  menuTextContainer: {
    flex: 1,
  },
  menuLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  menuSubtitle: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
});

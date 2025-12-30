import { useCallback } from 'react';
import { StyleSheet, TouchableOpacity, FlatList, Image, Dimensions } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Text, View, useThemeColor } from '@/components/Themed';
import { RELAX_CATEGORIES, RelaxSound } from '@/constants/relaxSounds';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';

const { width } = Dimensions.get('window');
const CARD_MARGIN = 20;
const CARD_WIDTH = width - CARD_MARGIN * 2; // Full width minus margins

export default function Relax() {
  const { currentTrack, isPlaying, playTrack, pause, resume } = useAudioPlayer();
  // Card background can remain, but overlay needing transparency is key
  const cardBackground = useThemeColor(
    { light: '#fff', dark: '#1f1f1f' },
    'background'
  );

  const allSounds = RELAX_CATEGORIES.flatMap(cat => cat.sounds);

  const handleSelect = useCallback(
    async (sound: RelaxSound) => {
      if (currentTrack?.id === sound.id) {
        if (isPlaying) {
          await pause();
        } else {
          await resume();
        }
        return;
      }
      await playTrack(sound);
    },
    [currentTrack?.id, isPlaying, pause, resume, playTrack]
  );

  const renderItem = ({ item }: { item: RelaxSound }) => {
    const isCurrent = currentTrack?.id === item.id;
    const isPlayingThis = isCurrent && isPlaying;

    return (
      <TouchableOpacity
        style={[styles.card, { backgroundColor: cardBackground }]}
        activeOpacity={0.9}
        onPress={() => handleSelect(item)}
      >
        <Image source={{ uri: item.imageUri }} style={styles.cardImage} />
        {/* Overlay View must NOT have a background color from theme if we want transparency */}
        <View style={styles.overlay}>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardCategory}>{item.category}</Text>
          </View>
          {isCurrent && (
            <View style={styles.playingIndicator}>
              <FontAwesome name={isPlayingThis ? "pause" : "play"} size={16} color="#fff" />
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header handled by _layout but added padding top for safety if needed */}
      <Text style={styles.headerTitle}>Relax & Focus</Text>
      <FlatList
        data={allSounds}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        // numColumns removed/default to 1
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  card: {
    width: CARD_WIDTH,
    height: 120, // Rectangular banner style
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    // Elevation/Shadow
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)', // Semi-transparent dark overlay for text readability
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
  },
  cardContent: {
    flex: 1,
    backgroundColor: 'transparent', // Explicitly transparent
  },
  cardTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  cardCategory: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  playingIndicator: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  }
});

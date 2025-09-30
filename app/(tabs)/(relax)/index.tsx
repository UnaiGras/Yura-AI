import { useCallback, useMemo } from 'react';
import { SectionList, StyleSheet, TouchableOpacity, View } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';

import { Text, useThemeColor } from '@/components/Themed';
import { RELAX_CATEGORIES, RelaxSound } from '@/constants/relaxSounds';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';

export default function Relax() {
  const { currentTrack, isPlaying, isLoading, playTrack, pause, resume, stop } = useAudioPlayer();
  const cardBackground = useThemeColor(
    { light: '#f5f9ff', dark: 'rgba(255,255,255,0.05)' },
    'background'
  );
  const cardBorder = useThemeColor(
    { light: 'rgba(15, 23, 42, 0.08)', dark: 'rgba(255,255,255,0.12)' },
    'text'
  );
  const activeBorder = useThemeColor({}, 'tint');
  const controlTint = useThemeColor({}, 'tint');
  const controlBackground = useThemeColor(
    { light: 'rgba(47, 149, 220, 0.12)', dark: 'rgba(255,255,255,0.12)' },
    'background'
  );
  const disabledControlColor = useThemeColor(
    { light: '#a0a0a0', dark: '#666666' },
    'text'
  );

  const sections = useMemo(
    () => RELAX_CATEGORIES.map((category) => ({ title: category.title, data: category.sounds })),
    []
  );

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

  const handleStop = useCallback(async () => {
    await stop();
  }, [stop]);

  return (
    <SectionList
      sections={sections}
      keyExtractor={(item) => item.id}
      style={styles.list}
      contentContainerStyle={styles.content}
      stickySectionHeadersEnabled={false}
      renderSectionHeader={({ section }) => (
        <Text style={styles.sectionTitle}>{section.title}</Text>
      )}
      renderItem={({ item }) => {
        const isCurrent = currentTrack?.id === item.id;
        const playingThis = isCurrent && isPlaying;

        return (
          <TouchableOpacity
            style={[
              styles.card,
              { backgroundColor: cardBackground, borderColor: cardBorder },
              isCurrent ? [styles.cardActive, { borderColor: activeBorder, shadowColor: activeBorder }] : null,
            ]}
            activeOpacity={0.85}
            onPress={() => handleSelect(item)}
          >
            <View style={styles.cardContent}>
              <View style={styles.cardText}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                {item.description ? <Text style={styles.cardSubtitle}>{item.description}</Text> : null}
              </View>
              <View style={styles.cardControls}>
                {isCurrent ? (
                  <>
                    <ControlButton
                      icon={playingThis ? 'pause' : 'play'}
                      onPress={() => handleSelect(item)}
                      disabled={isLoading}
                      tint={controlTint}
                      background={controlBackground}
                      disabledColor={disabledControlColor}
                    />
                    <ControlButton
                      icon="stop"
                      onPress={handleStop}
                      disabled={isLoading}
                      tint={controlTint}
                      background={controlBackground}
                      disabledColor={disabledControlColor}
                    />
                  </>
                ) : (
                  <ControlButton
                    icon="play"
                    onPress={() => handleSelect(item)}
                    disabled={isLoading}
                    tint={controlTint}
                    background={controlBackground}
                    disabledColor={disabledControlColor}
                  />
                )}
              </View>
            </View>
            {isCurrent ? (
              <View style={styles.badgeRow}>
                <Text style={styles.badgeText}>{playingThis ? 'Now playing' : 'Paused'}</Text>
              </View>
            ) : null}
          </TouchableOpacity>
        );
      }}
    />
  );
}

type ControlButtonProps = {
  icon: React.ComponentProps<typeof FontAwesome>['name'];
  onPress: () => void | Promise<void>;
  disabled?: boolean;
  tint: string;
  background: string;
  disabledColor: string;
};

function ControlButton({ icon, onPress, disabled, tint, background, disabledColor }: ControlButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.controlButton, { backgroundColor: background }]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <FontAwesome name={icon} size={20} color={disabled ? disabledColor : tint} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
  content: {
    paddingTop: 120,
    paddingBottom: 32,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
  },
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
  },
  cardActive: {
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 4,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  cardText: {
    flex: 1,
    gap: 6,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  cardSubtitle: {
    fontSize: 14,
    opacity: 0.75,
  },
  cardControls: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  controlButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeRow: {
    marginTop: 12,
  },
  badgeText: {
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: '#1f7a8c',
  },
});

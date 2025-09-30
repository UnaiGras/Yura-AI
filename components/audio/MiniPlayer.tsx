import { memo } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FontAwesome from '@expo/vector-icons/FontAwesome';

import { Text, useThemeColor } from '@/components/Themed';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';

export const MiniPlayer = memo(function MiniPlayer() {
  const { currentTrack, isPlaying, isLoading, pause, resume, stop, dismiss, showMiniPlayer } =
    useAudioPlayer();
  const insets = useSafeAreaInsets();
  const backgroundColor = useThemeColor({}, 'background');
  const tint = useThemeColor({}, 'tint');

  if (!showMiniPlayer || !currentTrack) {
    return null;
  }

  const handleTogglePlay = async () => {
    if (isLoading) return;

    if (isPlaying) {
      await pause();
    } else {
      await resume();
    }
  };

  const handleStop = async () => {
    await stop();
  };

  const handleDismiss = async () => {
    await dismiss();
  };

  return (
    <View style={[styles.wrapper, { paddingTop: insets.top + 8 }]} pointerEvents="box-none">
      <View style={[styles.container, { backgroundColor }]}>
        <View style={styles.info}>
          <Text style={styles.category}>{currentTrack.category}</Text>
          <Text style={styles.title} numberOfLines={1}>
            {currentTrack.title}
          </Text>
        </View>
        <View style={styles.controls}>
          <MiniPlayerButton
            icon={isPlaying ? 'pause' : 'play'}
            onPress={handleTogglePlay}
            tint={tint}
            disabled={isLoading}
          />
          <MiniPlayerButton icon="stop" onPress={handleStop} tint={tint} disabled={isLoading} />
          <MiniPlayerButton icon="times" onPress={handleDismiss} tint={tint} disabled={isLoading} />
        </View>
      </View>
    </View>
  );
});

type MiniPlayerButtonProps = {
  icon: React.ComponentProps<typeof FontAwesome>['name'];
  onPress: () => void | Promise<void>;
  tint: string;
  disabled?: boolean;
};

function MiniPlayerButton({ icon, onPress, tint, disabled }: MiniPlayerButtonProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled}
      style={styles.button}
    >
      <FontAwesome name={icon} size={18} color={tint} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 50,
    paddingHorizontal: 16,
  },
  container: {
    borderRadius: 16,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  info: {
    flex: 1,
  },
  category: {
    fontSize: 12,
    textTransform: 'uppercase',
    opacity: 0.6,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  button: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

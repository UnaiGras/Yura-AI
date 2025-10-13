import { Audio, AVPlaybackStatus } from 'expo-av';
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

export type AudioTrack = {
  id: string;
  title: string;
  category: string;
  uri: string;
  artwork?: string;
  description?: string;
};

type AudioProgress = {
  positionMillis: number;
  durationMillis: number;
};

type AudioPlayerContextValue = {
  currentTrack: AudioTrack | null;
  isPlaying: boolean;
  isLoading: boolean;
  showMiniPlayer: boolean;
  progress: AudioProgress;
  playTrack: (track: AudioTrack) => Promise<void>;
  pause: () => Promise<void>;
  resume: () => Promise<void>;
  stop: () => Promise<void>;
  dismiss: () => Promise<void>;
};

const AudioPlayerContext = createContext<AudioPlayerContextValue | undefined>(undefined);

export function AudioPlayerProvider({ children }: { children: ReactNode }) {
  const soundRef = useRef<InstanceType<typeof Audio.Sound> | null>(null);
  const playRequestId = useRef(0);
  const [currentTrack, setCurrentTrack] = useState<AudioTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showMiniPlayer, setShowMiniPlayer] = useState(false);
  const [progress, setProgress] = useState<AudioProgress>({ positionMillis: 0, durationMillis: 1 });

  useEffect(() => {
    let cancelled = false;

    async function configureAudioMode() {
      try {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DUCK_OTHERS,
          playsInSilentModeIOS: true,
          staysActiveInBackground: true,
          shouldDuckAndroid: true,
          interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DUCK_OTHERS,
          playThroughEarpieceAndroid: false,
        });
      } catch (error) {
        console.error('[AudioPlayer] Failed to configure audio mode', error);
      }
    }

    //configureAudioMode();

    return () => {
      cancelled = true;

      if (soundRef.current) {
        soundRef.current.unloadAsync().catch(() => null);
        soundRef.current = null;
      }
    };
  }, []);

  const unloadCurrentSound = useCallback(async () => {
    if (soundRef.current) {
      try {
        const status = await soundRef.current.getStatusAsync();
        if (status.isLoaded) {
          await soundRef.current.stopAsync();
        }
      } catch (error) {
        // ignore
      }

      try {
        await soundRef.current.unloadAsync();
      } catch (error) {
        console.error('[AudioPlayer] Failed to unload sound', error);
      }

      soundRef.current.setOnPlaybackStatusUpdate(null);
      soundRef.current = null;
    }
  }, []);

  const playTrack = useCallback(
    async (track: AudioTrack) => {
      const requestId = ++playRequestId.current;
      setIsLoading(true);
      setShowMiniPlayer(true);

      try {
        await unloadCurrentSound();

        const { sound } = await Audio.Sound.createAsync(
          { uri: track.uri },
          { shouldPlay: true, isLooping: true }
        );

        if (playRequestId.current !== requestId) {
          await sound.unloadAsync();
          return;
        }

        sound.setOnPlaybackStatusUpdate((status: AVPlaybackStatus) => {
          if (!status.isLoaded) {
            setIsPlaying(false);
            return;
          }

          setIsPlaying(status.isPlaying);
          setProgress({
            positionMillis: status.positionMillis,
            durationMillis: status.durationMillis ?? 1,
          });

          if (status.didJustFinish && !status.isLooping) {
            setIsPlaying(false);
          }
        });

        soundRef.current = sound;
        setCurrentTrack(track);
        setIsPlaying(true);
      } catch (error) {
        console.error('[AudioPlayer] Failed to play track', error);
      } finally {
        if (playRequestId.current === requestId) {
          setIsLoading(false);
        }
      }
    },
    [unloadCurrentSound]
  );

  const pause = useCallback(async () => {
    if (!soundRef.current) return;

    try {
      const status = await soundRef.current.getStatusAsync();
      if (status.isLoaded && status.isPlaying) {
        await soundRef.current.pauseAsync();
      }
    } catch (error) {
      console.error('[AudioPlayer] Failed to pause', error);
    }
  }, []);

  const resume = useCallback(async () => {
    if (!soundRef.current) return;

    try {
      const status = await soundRef.current.getStatusAsync();
      if (status.isLoaded && !status.isPlaying) {
        await soundRef.current.playAsync();
      }
    } catch (error) {
      console.error('[AudioPlayer] Failed to resume', error);
    }
  }, []);

  const stop = useCallback(async () => {
    if (!soundRef.current) return;

    try {
      const status = await soundRef.current.getStatusAsync();
      if (status.isLoaded) {
        await soundRef.current.stopAsync();
        await soundRef.current.setPositionAsync(0);
      }
    } catch (error) {
      console.error('[AudioPlayer] Failed to stop', error);
    } finally {
      setIsPlaying(false);
    }
  }, []);

  const dismiss = useCallback(async () => {
    await unloadCurrentSound();
    setCurrentTrack(null);
    setShowMiniPlayer(false);
    setIsPlaying(false);
    setProgress({ positionMillis: 0, durationMillis: 1 });
  }, [unloadCurrentSound]);

  const value = useMemo<AudioPlayerContextValue>(
    () => ({
      currentTrack,
      isPlaying,
      isLoading,
      showMiniPlayer,
      progress,
      playTrack,
      pause,
      resume,
      stop,
      dismiss,
    }),
    [currentTrack, isPlaying, isLoading, showMiniPlayer, progress, playTrack, pause, resume, stop, dismiss]
  );

  return <AudioPlayerContext.Provider value={value}>{children}</AudioPlayerContext.Provider>;
}

export function useAudioPlayerContext() {
  const context = useContext(AudioPlayerContext);

  if (!context) {
    throw new Error('useAudioPlayerContext must be used within an AudioPlayerProvider');
  }

  return context;
}

declare module 'expo-av' {
  export type AVPlaybackStatus = {
    isLoaded: boolean;
    isPlaying: boolean;
    positionMillis: number;
    durationMillis?: number;
    didJustFinish?: boolean;
    isLooping?: boolean;
  } & Record<string, unknown>;

  export type AVPlaybackStatusSuccess = AVPlaybackStatus;

  export type AudioMode = {
    allowsRecordingIOS?: boolean;
    interruptionModeIOS?: number;
    playsInSilentModeIOS?: boolean;
    staysActiveInBackground?: boolean;
    shouldDuckAndroid?: boolean;
    interruptionModeAndroid?: number;
    playThroughEarpieceAndroid?: boolean;
  };

  export class Sound {
    static createAsync(
      source: { uri: string },
      initialStatus?: { shouldPlay?: boolean; isLooping?: boolean }
    ): Promise<{ sound: Sound; status: AVPlaybackStatus }>;
    loadAsync(
      source: { uri: string },
      initialStatus?: { shouldPlay?: boolean; isLooping?: boolean }
    ): Promise<AVPlaybackStatus>;
    unloadAsync(): Promise<AVPlaybackStatus>;
    stopAsync(): Promise<AVPlaybackStatus>;
    playAsync(): Promise<AVPlaybackStatus>;
    pauseAsync(): Promise<AVPlaybackStatus>;
    getStatusAsync(): Promise<AVPlaybackStatus>;
    setOnPlaybackStatusUpdate(callback: ((status: AVPlaybackStatus) => void) | null): void;
    setPositionAsync(positionMillis: number): Promise<AVPlaybackStatus>;
  }

  export const Audio: {
    setAudioModeAsync(options: AudioMode): Promise<void>;
    Sound: typeof Sound;
    INTERRUPTION_MODE_IOS_DUCK_OTHERS: number;
    INTERRUPTION_MODE_ANDROID_DUCK_OTHERS: number;
  };
}

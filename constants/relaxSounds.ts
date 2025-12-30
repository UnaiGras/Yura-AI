import { AudioTrack } from '@/contexts/AudioPlayerContext';

export type RelaxSound = AudioTrack & {
  description?: string;
  imageUri: string;
};

export type RelaxCategory = {
  id: string;
  title: string;
  sounds: RelaxSound[];
};

export const RELAX_CATEGORIES: RelaxCategory[] = [
  {
    id: 'ambience',
    title: 'Ambience',
    sounds: [
      {
        id: 'forest-lullaby',
        title: 'Forest Lullaby',
        category: 'Ambience',
        description: 'Gentle forest ambience with soft birds and breeze.',
        uri: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_6a2d0a73c3.mp3?filename=forest-lullaby-110624.mp3',
        imageUri: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80',
      },
      {
        id: 'evening-cicadas',
        title: 'Evening Cicadas',
        category: 'Ambience',
        description: 'Nighttime insects and warm summer air.',
        uri: 'https://cdn.pixabay.com/download/audio/2022/10/24/audio_5bcacae4d7.mp3?filename=evening-crickets-ambient-124471.mp3',
        imageUri: 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=800&q=80',
      },
      {
        id: 'coastal-breeze',
        title: 'Coastal Breeze',
        category: 'Ambience',
        description: 'Rolling ocean waves on a calm shore.',
        uri: 'https://cdn.pixabay.com/download/audio/2021/09/01/audio_fd5f973ce5.mp3?filename=sea-waves-ambient-9076.mp3',
        imageUri: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
      },
    ],
  },
  {
    id: 'rain',
    title: 'Rain',
    sounds: [
      {
        id: 'gentle-rain',
        title: 'Gentle Rain',
        category: 'Rain',
        description: 'Soft rain against a windowpane.',
        uri: 'https://cdn.pixabay.com/download/audio/2021/09/15/audio_8a58dd5074.mp3?filename=rain-on-window-ambient-11479.mp3',
        imageUri: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=800&q=80',
      },
      {
        id: 'thunderstorm-calm',
        title: 'Thunderstorm Calm',
        category: 'Rain',
        description: 'Distant thunder with steady rainfall.',
        uri: 'https://cdn.pixabay.com/download/audio/2022/11/09/audio_9dd98ec605.mp3?filename=storm-thunder-rain-ambient-125075.mp3',
        imageUri: 'https://images.unsplash.com/photo-1605727216801-e27ce1d0cc28?w=800&q=80',
      },
      {
        id: 'rainforest-downpour',
        title: 'Rainforest Downpour',
        category: 'Rain',
        description: 'Lush rainforest rain with wildlife in the distance.',
        uri: 'https://cdn.pixabay.com/download/audio/2021/09/18/audio_9b16c94575.mp3?filename=rainforest-ambience-11443.mp3',
        imageUri: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55cd?w=800&q=80',
      },
    ],
  },
  {
    id: 'meditation',
    title: 'Meditation',
    sounds: [
      {
        id: 'deep-meditation',
        title: 'Deep Meditation',
        category: 'Meditation',
        description: 'Low drones for deep focus and calm breathing.',
        uri: 'https://cdn.pixabay.com/download/audio/2021/12/20/audio_8a58dd5074.mp3?filename=deep-relaxation-ambient-110498.mp3',
        imageUri: 'https://images.unsplash.com/photo-1593811167562-9cef47bfc4d7?w=800&q=80',
      },
      {
        id: 'singing-bowls',
        title: 'Singing Bowls',
        category: 'Meditation',
        description: 'Healing singing bowls with delicate overtones.',
        uri: 'https://cdn.pixabay.com/download/audio/2021/12/27/audio_7dda5e3aa2.mp3?filename=singing-bowls-ambient-110620.mp3',
        imageUri: 'https://images.unsplash.com/photo-1512438248247-f0f2a5a8b7f0?w=800&q=80',
      },
      {
        id: 'evening-wind',
        title: 'Evening Wind',
        category: 'Meditation',
        description: 'Warm wind chimes and glistening pads.',
        uri: 'https://cdn.pixabay.com/download/audio/2022/06/27/audio_093346a3b3.mp3?filename=evening-wind-112199.mp3',
        imageUri: 'https://images.unsplash.com/photo-1534237710431-e2fc698436d0?w=800&q=80',
      },
    ],
  },
];

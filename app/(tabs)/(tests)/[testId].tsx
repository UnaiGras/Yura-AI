import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Text, View, useThemeColor } from '@/components/Themed';
import { TestDefinition, getTestById } from '@/lib/tests';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

const { width } = Dimensions.get('window');

type AnswersState = Record<string, string>;

export default function TestDetailScreen() {
  const { testId } = useLocalSearchParams<{ testId?: string }>();
  const navigation = useNavigation<any>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [test, setTest] = useState<TestDefinition | null>(null);
  const [answers, setAnswers] = useState<AnswersState>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);

  const themeColors = Colors[isDark ? 'dark' : 'light'];
  const accentColor = (themeColors as any).pastelGreen || '#D1F2D6';
  // Use a darker input background for contrast or light based on theme
  const inputBg = isDark ? 'rgba(255,255,255,0.05)' : '#fff';

  useEffect(() => {
    let isMounted = true;

    async function load() {
      if (!testId || typeof testId !== 'string') {
        setError('Test not found.');
        setLoading(false);
        return;
      }

      try {
        const definition = await getTestById(testId);

        if (!definition) {
          if (isMounted) setError('We could not find that test.');
          return;
        }

        if (isMounted) {
          setTest(definition);
          setError(null);
          // Hide default header title to use custom UI
          navigation.setOptions?.({ headerTitle: '', headerTransparent: true, headerTintColor: isDark ? '#fff' : '#000' });
        }
      } catch (err: any) {
        console.error('[TestDetailScreen] Failed to load test', err);
        if (isMounted) setError('Unable to load this test right now.');
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    load();

    return () => {
      isMounted = false;
    };
  }, [navigation, testId]);

  const questions = useMemo(() => test?.questions ?? [], [test?.questions]);
  const currentQuestion = questions[currentStep];
  const totalSteps = questions.length;
  const progress = totalSteps > 0 ? ((currentStep + 1) / totalSteps) * 100 : 0;

  const handleAnswerChange = (value: string) => {
    if (!currentQuestion) return;
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: value }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Finish
      router.back();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      router.back();
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={accentColor} />
      </View>
    );
  }

  if (error || !test) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error || 'Test not available.'}</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : "padding"}
    >
      <ScrollView contentContainerStyle={[styles.container, { paddingTop: insets.top + 60 }]}>

        {/* Progress Header */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBarBackground}>
            <View style={[styles.progressBarFill, { width: `${progress}%`, backgroundColor: accentColor }]} />
          </View>
          <Text style={styles.stepText}>Question {currentStep + 1} of {totalSteps}</Text>
        </View>

        {/* Mascot & Prompt */}
        <View style={styles.mascotContainer}>
          <Image
            source={require('@/assets/images/yura_happy.png')}
            style={styles.mascotImage}
            resizeMode="contain"
          />
          <View style={[styles.bubble, { borderColor: accentColor }]}>
            <Text style={styles.questionText}>
              {currentQuestion?.prompt}
            </Text>
          </View>
        </View>

        {/* Input Area */}
        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, { backgroundColor: inputBg, color: isDark ? '#fff' : '#000' }]}
            multiline
            placeholder="Type your answer here..."
            placeholderTextColor={isDark ? '#888' : '#aaa'}
            textAlignVertical="top"
            value={answers[currentQuestion?.id] || ''}
            onChangeText={handleAnswerChange}
          />
        </View>

        {/* Navigation Actions */}
        <View style={styles.actions}>
          {currentStep > 0 && (
            <TouchableOpacity style={styles.navButtonSecondary} onPress={handleBack}>
              <Ionicons name="arrow-back" size={24} color={isDark ? '#fff' : '#000'} />
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[styles.navButtonPrimary, { backgroundColor: accentColor, flex: currentStep === 0 ? 1 : 0.8 }]}
            onPress={handleNext}
          >
            <Text style={styles.navButtonText}>
              {currentStep === totalSteps - 1 ? 'Finish Reflection' : 'Next Question'}
            </Text>
            {currentStep < totalSteps - 1 && (
              <Ionicons name="arrow-forward" size={20} color="#000" style={{ marginLeft: 8 }} />
            )}
          </TouchableOpacity>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  container: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    flexGrow: 1,
  },
  errorText: {
    fontSize: 16,
    marginBottom: 20,
    opacity: 0.7,
  },
  backButton: {
    padding: 12,
    backgroundColor: '#333',
    borderRadius: 8,
  },
  backButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  progressContainer: {
    marginBottom: 30,
    gap: 10,
  },
  progressBarBackground: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  stepText: {
    fontSize: 12,
    opacity: 0.5,
    textAlign: 'right',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  mascotContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end', // Mascot sitting at bottom of bubble roughly
    marginBottom: 30,
    gap: 16,
  },
  mascotImage: {
    width: 80,
    height: 80,
  },
  bubble: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 20,
    borderRadius: 24,
    borderTopLeftRadius: 4,
    borderWidth: 1,
    minHeight: 100,
    justifyContent: 'center',
  },
  questionText: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: '500',
  },
  inputContainer: {
    flex: 1,
    marginBottom: 20,
  },
  input: {
    flex: 1,
    minHeight: 150,
    borderRadius: 24,
    padding: 20,
    fontSize: 16,
    lineHeight: 24,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    justifyContent: 'space-between',
  },
  navButtonPrimary: {
    height: 56,
    borderRadius: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  navButtonSecondary: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  navButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
  },
});

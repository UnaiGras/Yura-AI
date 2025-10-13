import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  TextInput,
} from 'react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';

import { Text, View, useThemeColor } from '@/components/Themed';
import { TestDefinition, getTestById } from '@/lib/tests';

type AnswersState = Record<string, string>;

export default function TestDetailScreen() {
  const { testId } = useLocalSearchParams<{ testId?: string }>();
  const navigation = useNavigation<any>();
  const [test, setTest] = useState<TestDefinition | null>(null);
  const [answers, setAnswers] = useState<AnswersState>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const inputBackground = useThemeColor(
    { light: '#ffffff', dark: 'rgba(255,255,255,0.05)' },
    'background'
  );
  const inputBorder = useThemeColor(
    { light: '#e2e8f0', dark: 'rgba(255,255,255,0.12)' },
    'text'
  );
  const inputTextColor = useThemeColor({}, 'text');

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
          if (isMounted) {
            setError('We could not find that test.');
          }
          return;
        }

        if (isMounted) {
          setTest(definition);
          setError(null);
          navigation.setOptions?.({ title: definition.title });
        }
      } catch (err: any) {
        console.error('[TestDetailScreen] Failed to load test', err);
        if (isMounted) {
          setError('Unable to load this test right now.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      isMounted = false;
    };
  }, [navigation, testId]);

  const questions = useMemo(() => test?.questions ?? [], [test?.questions]);

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text>{error}</Text>
      </View>
    );
  }

  if (!test) {
    return (
      <View style={styles.centered}>
        <Text>Test not available.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>{test.title}</Text>
        {test.description ? <Text style={styles.description}>{test.description}</Text> : null}
      </View>

      {questions.map((question) => (
        <View key={question.id} style={styles.questionCard}>
          <Text style={styles.questionPrompt}>{question.prompt}</Text>
          <TextInput
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            placeholder="Type your response..."
            value={answers[question.id] ?? ''}
            onChangeText={(value) => handleAnswerChange(question.id, value)}
            style={[
              styles.input,
              {
                backgroundColor: inputBackground,
                borderColor: inputBorder,
                color: inputTextColor,
              },
            ]}
            placeholderTextColor={`${inputTextColor}99`}
          />
        </View>
      ))}

      <View style={styles.footerNote}>
        <Text style={styles.footerText}>
          Responses are not saved yet—use these prompts for personal reflection or to discuss with your care team.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  content: {
    paddingTop: 120,
    paddingBottom: 48,
    paddingHorizontal: 20,
    gap: 24,
  },
  header: {
    gap: 12,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
  },
  description: {
    fontSize: 16,
    lineHeight: 22,
    opacity: 0.85,
  },
  questionCard: {
    gap: 12,
  },
  questionPrompt: {
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 22,
  },
  input: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 16,
    minHeight: 120,
    fontSize: 15,
    lineHeight: 20,
  },
  footerNote: {
    marginTop: 16,
  },
  footerText: {
    fontSize: 13,
    lineHeight: 18,
    opacity: 0.7,
  },
});

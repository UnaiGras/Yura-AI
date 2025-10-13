import adhd from '@/assets/tests/adhd.json';
import anxiety from '@/assets/tests/anxiety.json';

export type TestQuestion = {
  id: string;
  prompt: string;
};

export type TestDefinition = {
  id: string;
  title: string;
  description?: string;
  questions: TestQuestion[];
};

const tests: Record<string, TestDefinition> = {
  [anxiety.id]: anxiety,
  [adhd.id]: adhd,
};

export async function getAllTests(): Promise<TestDefinition[]> {
  return Object.values(tests);
}

export async function getTestById(testId: string): Promise<TestDefinition | null> {
  return tests[testId] ?? null;
}

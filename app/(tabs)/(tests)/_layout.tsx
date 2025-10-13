import { Stack } from 'expo-router';

export default function TestsLayout() {
  return (
    <Stack screenOptions={{ headerTitleAlign: 'center' }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="[testId]" options={{ headerShown: false }} />
    </Stack>
  );
}

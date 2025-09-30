import { StyleSheet, TextInput, TextInputProps, View } from 'react-native';

import { Text, useThemeColor } from '../Themed';

type AuthTextInputProps = TextInputProps & {
  label: string;
};

export function AuthTextInput({ label, style, ...textInputProps }: AuthTextInputProps) {
  const textColor = useThemeColor({}, 'text');
  const borderColor = useThemeColor({}, 'tint');
  const backgroundColor = useThemeColor({}, 'background');
  const placeholderColor = useThemeColor(
    { light: 'rgba(60, 60, 67, 0.6)', dark: 'rgba(235, 235, 245, 0.6)' },
    'text'
  );

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: textColor }]}>{label}</Text>
      <TextInput
        style={[styles.input, { borderColor, color: textColor, backgroundColor }, style]}
        placeholderTextColor={placeholderColor}
        selectionColor={borderColor}
        autoCapitalize="none"
        {...textInputProps}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 6,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
  },
});

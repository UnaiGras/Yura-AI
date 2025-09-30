import { ComponentProps } from 'react';
import { PressableStateCallbackType, StyleSheet } from 'react-native';

import { ThemedButton } from '../ThemedButton';

type AuthButtonProps = ComponentProps<typeof ThemedButton>;

export function AuthButton({ style, textStyle, ...rest }: AuthButtonProps) {
  return (
    <ThemedButton
      {...rest}
      style={(state: PressableStateCallbackType) => {
        const resolvedStyle = typeof style === 'function' ? style(state) : style;

        return [styles.button, resolvedStyle];
      }}
      textStyle={[styles.text, textStyle]}
    />
  );
}

const styles = StyleSheet.create({
  button: {
    width: '100%',
    marginTop: 16,
  },
  text: {
    fontSize: 16,
  },
});

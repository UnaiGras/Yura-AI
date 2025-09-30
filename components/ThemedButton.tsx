import {
  ActivityIndicator,
  Pressable,
  PressableProps,
  PressableStateCallbackType,
  StyleProp,
  TextStyle,
} from 'react-native';

import { Text, useThemeColor } from './Themed';

type ThemedButtonProps = Omit<PressableProps, 'style'> & {
  title: string;
  lightBackgroundColor?: string;
  darkBackgroundColor?: string;
  lightTextColor?: string;
  darkTextColor?: string;
  style?: PressableProps['style'];
  textStyle?: StyleProp<TextStyle>;
  loading?: boolean;
};

export function ThemedButton({
  title,
  lightBackgroundColor,
  darkBackgroundColor,
  lightTextColor,
  darkTextColor,
  style,
  textStyle,
  disabled,
  loading = false,
  ...pressableProps
}: ThemedButtonProps) {
  const backgroundColor = useThemeColor(
    { light: lightBackgroundColor, dark: darkBackgroundColor },
    'tint'
  );
  const color = useThemeColor({ light: lightTextColor, dark: darkTextColor }, 'background');
  const isDisabled = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      disabled={isDisabled}
      style={(state: PressableStateCallbackType) => {
        const resolvedStyle = typeof style === 'function' ? style(state) : style;

        return [
          {
            backgroundColor,
            paddingVertical: 12,
            paddingHorizontal: 16,
            borderRadius: 8,
            alignItems: 'center',
            justifyContent: 'center',
            opacity: isDisabled ? 0.5 : state.pressed ? 0.8 : 1,
          },
          resolvedStyle,
        ];
      }}
      {...pressableProps}
    >
      {loading ? (
        <ActivityIndicator color={color} />
      ) : (
        <Text style={[{ color, fontWeight: '600' }, textStyle]}>{title}</Text>
      )}
    </Pressable>
  );
}

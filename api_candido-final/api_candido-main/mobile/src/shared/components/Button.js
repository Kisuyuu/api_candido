import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import { colors, radius } from '../../core/theme';

const variants = {
  primary: { bg: colors.primary, fg: '#fff', pressed: colors.primaryDark },
  secondary: { bg: colors.soft, fg: colors.primary, pressed: '#E2DCFA' },
  danger: { bg: colors.dangerSoft, fg: colors.danger, pressed: '#F9D3DB' },
  dangerSolid: { bg: colors.danger, fg: '#fff', pressed: '#B52C4A' },
  ghost: { bg: 'transparent', fg: colors.muted, pressed: colors.soft },
};

export function Button({ label, onPress, variant = 'primary', loading = false, disabled = false, style }) {
  const v = variants[variant];
  const inactive = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      disabled={inactive}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        { backgroundColor: pressed ? v.pressed : v.bg, opacity: inactive ? 0.6 : 1 },
        style,
      ]}
    >
      {loading ? <ActivityIndicator color={v.fg} /> : <Text style={[styles.label, { color: v.fg }]}>{label}</Text>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 52,
    borderRadius: radius.md,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { fontSize: 15, fontWeight: '800' },
});

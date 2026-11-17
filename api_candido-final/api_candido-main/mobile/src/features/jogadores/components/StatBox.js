import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, shadow } from '../../../core/theme';

export function StatBox({ value, label, emoji }) {
  return (
    <View style={styles.box}>
      {emoji ? <Text style={styles.emoji}>{emoji}</Text> : null}
      <Text style={styles.value} numberOfLines={1} adjustsFontSizeToFit>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    paddingVertical: 16,
    paddingHorizontal: 8,
    alignItems: 'center',
    gap: 2,
    ...shadow,
  },
  emoji: { fontSize: 20, marginBottom: 2 },
  value: { fontSize: 21, fontWeight: '900', color: colors.ink },
  label: { fontSize: 11, fontWeight: '800', color: colors.muted, textTransform: 'uppercase', letterSpacing: 0.6 },
});

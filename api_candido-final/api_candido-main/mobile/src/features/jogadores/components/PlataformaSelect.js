import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Controller } from 'react-hook-form';
import { PLATAFORMAS, colors, platformColor, radius } from '../../../core/theme';

export function PlataformaSelect({ control, name = 'plataforma' }) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value, onChange }, fieldState: { error } }) => (
        <View style={styles.wrap}>
          <Text style={styles.label}>Plataforma</Text>
          <View style={styles.row}>
            {PLATAFORMAS.map((item) => {
              const active = value === item;
              const color = platformColor(item);
              return (
                <Pressable
                  key={item}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: active }}
                  onPress={() => onChange(item)}
                  style={[styles.chip, active && { backgroundColor: color, borderColor: color }]}
                >
                  <Text style={[styles.chipText, active && styles.chipTextActive]}>{item}</Text>
                </Pressable>
              );
            })}
          </View>
          {error ? <Text style={styles.error}>{error.message}</Text> : null}
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: 16 },
  label: { fontSize: 13, fontWeight: '800', color: colors.ink, marginBottom: 9 },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  chipText: { fontSize: 13, fontWeight: '800', color: colors.muted },
  chipTextActive: { color: '#fff' },
  error: { color: colors.danger, fontSize: 12, fontWeight: '700', marginTop: 6 },
});

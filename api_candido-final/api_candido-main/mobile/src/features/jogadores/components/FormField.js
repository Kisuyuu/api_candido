import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Controller } from 'react-hook-form';
import { colors, radius } from '../../../core/theme';
import { maskDate } from '../../../shared/utils/formatters';

/** Campo de texto integrado ao react-hook-form (Controller) com label, erro e máscara de data. */
export function FormField({
  control,
  name,
  label,
  placeholder,
  keyboardType,
  autoCapitalize = 'none',
  secureTextEntry = false,
  mask,
  hint,
  half = false,
}) {
  const [hidden, setHidden] = useState(secureTextEntry);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
        <View style={[styles.wrap, half && styles.half]}>
          <Text style={styles.label}>{label}</Text>
          <View style={[styles.inputBox, error && styles.inputError]}>
            <TextInput
              style={styles.input}
              value={value}
              onChangeText={(text) => onChange(mask === 'date' ? maskDate(text) : text)}
              onBlur={onBlur}
              placeholder={placeholder}
              placeholderTextColor={colors.placeholder}
              keyboardType={mask === 'date' ? 'number-pad' : keyboardType}
              autoCapitalize={autoCapitalize}
              autoCorrect={false}
              secureTextEntry={hidden}
              maxLength={mask === 'date' ? 10 : undefined}
              accessibilityLabel={label}
            />
            {secureTextEntry ? (
              <Pressable onPress={() => setHidden((h) => !h)} hitSlop={8}>
                <Text style={styles.toggle}>{hidden ? 'Mostrar' : 'Ocultar'}</Text>
              </Pressable>
            ) : null}
          </View>
          {error ? <Text style={styles.error}>{error.message}</Text> : hint ? <Text style={styles.hint}>{hint}</Text> : null}
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: 16 },
  half: { flex: 1 },
  label: { fontSize: 13, fontWeight: '800', color: colors.ink, marginBottom: 7 },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: 14,
  },
  inputError: { borderColor: colors.danger, backgroundColor: '#FFF8F9' },
  input: { flex: 1, minHeight: 50, fontSize: 15, color: colors.ink },
  toggle: { color: colors.primary, fontWeight: '800', fontSize: 13 },
  error: { color: colors.danger, fontSize: 12, fontWeight: '700', marginTop: 6 },
  hint: { color: colors.muted, fontSize: 12, marginTop: 6 },
});

import { Image, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../core/theme';
import { initials } from '../utils/formatters';

const palette = ['#6554C0', '#0EA5A4', '#E4572E', '#3B82F6', '#D946A8', '#F59E0B', '#16A34A'];

function colorFor(name = '') {
  const sum = [...name].reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return palette[sum % palette.length];
}

export function Avatar({ uri, name, size = 52 }) {
  const box = { width: size, height: size, borderRadius: size / 2 };

  if (uri) {
    return <Image source={{ uri }} style={[styles.image, box]} accessibilityLabel={`Foto de ${name}`} />;
  }

  return (
    <View style={[styles.fallback, box, { backgroundColor: colorFor(name) }]}>
      <Text style={[styles.initials, { fontSize: size * 0.36 }]}>{initials(name)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  image: { backgroundColor: colors.soft },
  fallback: { alignItems: 'center', justifyContent: 'center' },
  initials: { color: '#fff', fontWeight: '900' },
});

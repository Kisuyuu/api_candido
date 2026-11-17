import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { colors, radius } from '../../core/theme';
import { Button } from './Button';

export function LoadingState({ label = 'Carregando...' }) {
  return (
    <View style={styles.center}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={styles.muted}>{label}</Text>
    </View>
  );
}

export function EmptyState({ emoji = '🎮', title, text, actionLabel, onAction }) {
  return (
    <View style={styles.center}>
      <View style={styles.circle}>
        <Text style={styles.emoji}>{emoji}</Text>
      </View>
      <Text style={styles.title}>{title}</Text>
      {text ? <Text style={styles.muted}>{text}</Text> : null}
      {actionLabel ? <Button label={actionLabel} onPress={onAction} style={styles.action} /> : null}
    </View>
  );
}

export function ErrorState({ message, onRetry }) {
  return (
    <View style={styles.center}>
      <View style={[styles.circle, { backgroundColor: colors.dangerSoft }]}>
        <Text style={styles.emoji}>📡</Text>
      </View>
      <Text style={styles.title}>Algo deu errado</Text>
      <Text style={styles.muted}>{message}</Text>
      {onRetry ? <Button label="Tentar novamente" onPress={onRetry} style={styles.action} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  center: { alignItems: 'center', justifyContent: 'center', paddingVertical: 48, paddingHorizontal: 24, gap: 8 },
  circle: {
    width: 84,
    height: 84,
    borderRadius: radius.pill,
    backgroundColor: colors.soft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  emoji: { fontSize: 38 },
  title: { fontSize: 18, fontWeight: '900', color: colors.ink, textAlign: 'center' },
  muted: { fontSize: 14, color: colors.muted, textAlign: 'center', lineHeight: 20 },
  action: { marginTop: 14, alignSelf: 'stretch' },
});

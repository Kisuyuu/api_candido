import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, shadow } from '../../core/theme';
import { Button } from './Button';

export function ConfirmModal({ visible, title, message, confirmLabel = 'Confirmar', loading = false, onConfirm, onCancel }) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel} statusBarTranslucent>
      <Pressable style={styles.overlay} onPress={loading ? undefined : onCancel}>
        <Pressable style={styles.card} onPress={() => {}}>
          <View style={styles.icon}>
            <Text style={styles.iconText}>🗑️</Text>
          </View>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          <View style={styles.actions}>
            <Button label="Cancelar" variant="secondary" onPress={onCancel} disabled={loading} style={styles.flex} />
            <Button label={confirmLabel} variant="dangerSolid" onPress={onConfirm} loading={loading} style={styles.flex} />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: colors.overlay, alignItems: 'center', justifyContent: 'center', padding: 24 },
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: 24,
    alignItems: 'center',
    ...shadow,
  },
  icon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.dangerSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  iconText: { fontSize: 28 },
  title: { fontSize: 20, fontWeight: '900', color: colors.ink, textAlign: 'center' },
  message: { fontSize: 14, color: colors.muted, textAlign: 'center', marginTop: 8, lineHeight: 20 },
  actions: { flexDirection: 'row', gap: 10, marginTop: 22 },
  flex: { flex: 1 },
});

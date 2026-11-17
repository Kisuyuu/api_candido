import { Pressable, StyleSheet, Text, View } from 'react-native';
import { photoUrl } from '../../../core/http';
import { colors, platformColor, radius, shadow } from '../../../core/theme';
import { Avatar } from '../../../shared/components/Avatar';
import { Badge } from '../../../shared/components/Badge';
import { formatNumber } from '../../../shared/utils/formatters';

export function JogadorCard({ jogador, onOpen, onEdit, onDelete }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Abrir ${jogador.nome_usuario}`}
      onPress={onOpen}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <Avatar uri={photoUrl(jogador.foto_perfil)} name={jogador.nome_usuario} size={56} />

      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>{jogador.nome_usuario}</Text>
        <Text style={styles.meta}>Nível {jogador.nivel} • {formatNumber(jogador.xp)} XP</Text>
        <Badge label={jogador.plataforma} color={platformColor(jogador.plataforma)} />
      </View>

      <View style={styles.actions}>
        <Pressable accessibilityLabel="Editar" onPress={onEdit} hitSlop={8} style={[styles.action, styles.edit]}>
          <Text style={styles.editIcon}>✎</Text>
        </Pressable>
        <Pressable accessibilityLabel="Excluir" onPress={onDelete} hitSlop={8} style={[styles.action, styles.del]}>
          <Text style={styles.delIcon}>🗑</Text>
        </Pressable>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: 14,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    ...shadow,
  },
  pressed: { opacity: 0.85, transform: [{ scale: 0.99 }] },
  info: { flex: 1, gap: 4 },
  name: { fontSize: 17, fontWeight: '900', color: colors.ink },
  meta: { fontSize: 13, color: colors.muted, fontWeight: '600' },
  actions: { gap: 8 },
  action: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  edit: { backgroundColor: colors.soft },
  del: { backgroundColor: colors.dangerSoft },
  editIcon: { fontSize: 17, color: colors.primary, fontWeight: '800' },
  delIcon: { fontSize: 15 },
});

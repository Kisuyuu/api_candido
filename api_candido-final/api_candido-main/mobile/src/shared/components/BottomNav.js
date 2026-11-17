import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, shadow } from '../../core/theme';
import { BOTTOM_INSET } from './Screen';

const items = [
  { route: 'home', label: 'Início', icon: '🏠' },
  { route: 'jogadores', label: 'Jogadores', icon: '🎮' },
];

export function BottomNav({ active, onNavigate, onCreate }) {
  return (
    <View style={styles.wrap}>
      <View style={styles.bar}>
        <NavItem item={items[0]} active={active === items[0].route} onPress={() => onNavigate(items[0].route)} />
        <Pressable accessibilityRole="button" accessibilityLabel="Novo jogador" onPress={onCreate} style={styles.fab}>
          <Text style={styles.fabIcon}>+</Text>
        </Pressable>
        <NavItem item={items[1]} active={active === items[1].route} onPress={() => onNavigate(items[1].route)} />
      </View>
    </View>
  );
}

function NavItem({ item, active, onPress }) {
  return (
    <Pressable accessibilityRole="tab" accessibilityState={{ selected: active }} onPress={onPress} style={styles.item}>
      <Text style={[styles.icon, !active && styles.inactive]}>{item.icon}</Text>
      <Text style={[styles.label, active && styles.labelActive]}>{item.label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', backgroundColor: colors.background },
  bar: {
    width: '100%',
    maxWidth: 560,
    height: 66 + BOTTOM_INSET,
    paddingBottom: BOTTOM_INSET,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  item: { flex: 1, alignItems: 'center', gap: 3 },
  icon: { fontSize: 21 },
  inactive: { opacity: 0.45 },
  label: { fontSize: 11, fontWeight: '700', color: colors.muted },
  labelActive: { color: colors.primary },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -26,
    borderWidth: 4,
    borderColor: colors.background,
    ...shadow,
  },
  fabIcon: { color: '#fff', fontSize: 30, lineHeight: 33, fontWeight: '500' },
});

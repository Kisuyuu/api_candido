import { Platform, Pressable, StatusBar, StyleSheet, Text, View } from 'react-native';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { colors } from '../../core/theme';

export const TOP_INSET = Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 54;
export const BOTTOM_INSET = Platform.OS === 'ios' ? 20 : 0;

/** Container padrão: fundo, status bar, largura máxima (web/tablet) e cabeçalho opcional. */
export function Screen({ title, subtitle, onBack, right, children, noPadding = false }) {
  return (
    <View style={styles.root}>
      <ExpoStatusBar style="dark" />
      <View style={styles.column}>
        <View style={styles.header}>
          {onBack ? (
            <Pressable accessibilityRole="button" accessibilityLabel="Voltar" onPress={onBack} hitSlop={10} style={styles.back}>
              <Text style={styles.backIcon}>‹</Text>
            </Pressable>
          ) : null}
          <View style={styles.titleWrap}>
            {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
            {title ? <Text style={styles.title} numberOfLines={1}>{title}</Text> : null}
          </View>
          {right}
        </View>
        <View style={[styles.body, !noPadding && styles.padded]}>{children}</View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background, alignItems: 'center' },
  column: { flex: 1, width: '100%', maxWidth: 560 },
  header: {
    paddingTop: TOP_INSET + 10,
    paddingBottom: 14,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  back: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  backIcon: { fontSize: 28, lineHeight: 32, color: colors.ink, marginTop: -2 },
  titleWrap: { flex: 1 },
  subtitle: { fontSize: 11, fontWeight: '800', letterSpacing: 1.2, color: colors.muted, textTransform: 'uppercase' },
  title: { fontSize: 26, fontWeight: '900', color: colors.ink, marginTop: 2 },
  body: { flex: 1 },
  padded: { paddingHorizontal: 20 },
});

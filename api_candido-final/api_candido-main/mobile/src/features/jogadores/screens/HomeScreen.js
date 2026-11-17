import { Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { photoUrl } from '../../../core/http';
import { colors, radius, shadow } from '../../../core/theme';
import { useNavigation } from '../../../navigation/Navigator';
import { TabScreen } from '../../../navigation/TabScreen';
import { Avatar } from '../../../shared/components/Avatar';
import { Button } from '../../../shared/components/Button';
import { EmptyState, ErrorState, LoadingState } from '../../../shared/components/States';
import { formatNumber } from '../../../shared/utils/formatters';
import { StatBox } from '../components/StatBox';
import { useJogadores } from '../hooks/useJogadores';
import { computeStats } from '../utils/stats';

const MEDALS = ['🥇', '🥈', '🥉'];

export function HomeScreen() {
  const nav = useNavigation();
  const { data, isPending, isError, error, refetch, isRefetching } = useJogadores();
  const stats = computeStats(data);

  let content;
  if (isPending) {
    content = <LoadingState label="Carregando jogadores..." />;
  } else if (isError) {
    content = <ErrorState message={error.message} onRetry={refetch} />;
  } else {
    content = (
      <>
        <View style={styles.hero}>
          <View style={styles.bubbleA} />
          <View style={styles.bubbleB} />
          <Text style={styles.heroLabel}>COMUNIDADE GAMEHUB</Text>
          <Text style={styles.heroNumber}>{formatNumber(stats.total)}</Text>
          <Text style={styles.heroText}>{stats.total === 1 ? 'jogador cadastrado' : 'jogadores cadastrados'}</Text>
        </View>

        <View style={styles.statsRow}>
          <StatBox emoji="⭐" value={String(stats.nivelMedio)} label="Nível médio" />
          <StatBox emoji="🪙" value={formatNumber(stats.totalMoedas)} label="Moedas" />
          <StatBox emoji="⚡" value={formatNumber(stats.maiorXp)} label="Maior XP" />
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Top jogadores</Text>
          <Pressable onPress={() => nav.navigate('jogadores')} hitSlop={8}>
            <Text style={styles.link}>Ver todos</Text>
          </Pressable>
        </View>

        {stats.ranking.length === 0 ? (
          <EmptyState
            title="Nenhum jogador ainda"
            text="Cadastre o primeiro jogador para começar o ranking."
            actionLabel="Cadastrar jogador"
            onAction={() => nav.push('formulario')}
          />
        ) : (
          stats.ranking.map((jogador, index) => (
            <Pressable
              key={jogador.id}
              onPress={() => nav.push('detalhe', { id: jogador.id })}
              style={({ pressed }) => [styles.rankRow, pressed && { opacity: 0.85 }]}
            >
              <Text style={styles.medal}>{MEDALS[index]}</Text>
              <Avatar uri={photoUrl(jogador.foto_perfil)} name={jogador.nome_usuario} size={46} />
              <View style={styles.rankInfo}>
                <Text style={styles.rankName} numberOfLines={1}>{jogador.nome_usuario}</Text>
                <Text style={styles.rankMeta}>Nível {jogador.nivel} • {jogador.plataforma}</Text>
              </View>
              <Text style={styles.rankXp}>{formatNumber(jogador.xp)} XP</Text>
            </Pressable>
          ))
        )}

        {stats.ranking.length > 0 && (
          <Button label="+ Cadastrar jogador" onPress={() => nav.push('formulario')} style={styles.cta} />
        )}
      </>
    );
  }

  return (
    <TabScreen active="home" subtitle="Bem-vindo ao" title="GameHub">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
        refreshControl={<RefreshControl refreshing={isRefetching && !isPending} onRefresh={refetch} tintColor={colors.primary} />}
      >
        {content}
      </ScrollView>
    </TabScreen>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingBottom: 30 },
  hero: {
    backgroundColor: colors.primary,
    borderRadius: radius.xl,
    padding: 26,
    overflow: 'hidden',
    marginBottom: 14,
    ...shadow,
  },
  bubbleA: { position: 'absolute', right: -30, top: -30, width: 140, height: 140, borderRadius: 70, backgroundColor: 'rgba(255,255,255,0.12)' },
  bubbleB: { position: 'absolute', right: 40, bottom: -50, width: 110, height: 110, borderRadius: 55, backgroundColor: 'rgba(255,255,255,0.08)' },
  heroLabel: { color: 'rgba(255,255,255,0.75)', fontSize: 11, fontWeight: '800', letterSpacing: 1.4 },
  heroNumber: { color: '#fff', fontSize: 54, fontWeight: '900', marginTop: 6, lineHeight: 60 },
  heroText: { color: 'rgba(255,255,255,0.9)', fontSize: 15, fontWeight: '700' },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 24 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 19, fontWeight: '900', color: colors.ink },
  link: { color: colors.primary, fontWeight: '800', fontSize: 14 },
  rankRow: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: 12,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    ...shadow,
  },
  medal: { fontSize: 22, width: 30, textAlign: 'center' },
  rankInfo: { flex: 1 },
  rankName: { fontSize: 15, fontWeight: '900', color: colors.ink },
  rankMeta: { fontSize: 12, color: colors.muted, fontWeight: '600', marginTop: 2 },
  rankXp: { fontSize: 13, fontWeight: '900', color: colors.primary },
  cta: { marginTop: 8 },
});

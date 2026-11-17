import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useState } from 'react';
import { photoUrl } from '../../../core/http';
import { colors, platformColor, radius, shadow } from '../../../core/theme';
import { useNavigation } from '../../../navigation/Navigator';
import { Avatar } from '../../../shared/components/Avatar';
import { Badge } from '../../../shared/components/Badge';
import { Button } from '../../../shared/components/Button';
import { ConfirmModal } from '../../../shared/components/ConfirmModal';
import { Screen } from '../../../shared/components/Screen';
import { ErrorState, LoadingState } from '../../../shared/components/States';
import { useToast } from '../../../shared/components/Toast';
import { ageFromIso, formatNumber, isoToBr, memberSince } from '../../../shared/utils/formatters';
import { StatBox } from '../components/StatBox';
import { useDeleteJogador, useJogador } from '../hooks/useJogadores';

export function JogadorDetailScreen({ params }) {
  const nav = useNavigation();
  const toast = useToast();
  const { data: jogador, isPending, isError, error, refetch, isRefetching } = useJogador(params.id);
  const remover = useDeleteJogador();
  const [confirmando, setConfirmando] = useState(false);

  function excluir() {
    remover.mutate(params.id, {
      onSuccess: () => {
        toast.show('Jogador excluído com sucesso.');
        nav.reset('jogadores');
      },
      onError: (err) => {
        setConfirmando(false);
        toast.show(err.message, 'error');
      },
    });
  }

  let body;
  if (isPending) {
    body = <LoadingState label="Carregando jogador..." />;
  } else if (isError && !jogador) {
    body = <ErrorState message={error.message} onRetry={refetch} />;
  } else {
    const idade = ageFromIso(jogador.data_nascimento);

    body = (
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={colors.primary} />}
      >
        <View style={styles.profile}>
          <Avatar uri={photoUrl(jogador.foto_perfil)} name={jogador.nome_usuario} size={112} />
          <Text style={styles.name}>{jogador.nome_usuario}</Text>
          <Text style={styles.email}>{jogador.email}</Text>
          <Badge label={jogador.plataforma} color={platformColor(jogador.plataforma)} />
        </View>

        <View style={styles.stats}>
          <StatBox emoji="⭐" value={String(jogador.nivel)} label="Nível" />
          <StatBox emoji="⚡" value={formatNumber(jogador.xp)} label="XP" />
          <StatBox emoji="🪙" value={formatNumber(jogador.moedas)} label="Moedas" />
        </View>

        <View style={styles.infoCard}>
          <InfoRow label="Data de nascimento" value={`${isoToBr(jogador.data_nascimento)}${idade != null ? ` (${idade} anos)` : ''}`} />
          <InfoRow label="Personagem favorito" value={jogador.personagem_favorito || 'Não informado'} />
          <InfoRow label="Plataforma" value={jogador.plataforma} />
          <InfoRow label="Membro desde" value={memberSince(jogador.data_criacao_conta)} last />
        </View>

        <Button label="Editar jogador" onPress={() => nav.push('formulario', { id: jogador.id })} />
        <Button label="Excluir jogador" variant="danger" onPress={() => setConfirmando(true)} style={styles.deleteBtn} />
      </ScrollView>
    );
  }

  return (
    <Screen subtitle="Perfil" title="Informações" onBack={nav.pop}>
      {body}
      <ConfirmModal
        visible={confirmando}
        title="Excluir jogador"
        message={jogador ? `Deseja realmente excluir ${jogador.nome_usuario}? Essa ação não pode ser desfeita.` : ''}
        confirmLabel="Excluir"
        loading={remover.isPending}
        onConfirm={excluir}
        onCancel={() => setConfirmando(false)}
      />
    </Screen>
  );
}

function InfoRow({ label, value, last }) {
  return (
    <View style={[styles.row, !last && styles.rowBorder]}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingBottom: 36 },
  profile: { alignItems: 'center', gap: 6, marginBottom: 20 },
  name: { fontSize: 25, fontWeight: '900', color: colors.ink, marginTop: 10 },
  email: { fontSize: 14, color: colors.muted, fontWeight: '600', marginBottom: 6 },
  stats: { flexDirection: 'row', gap: 10, marginBottom: 18 },
  infoCard: { backgroundColor: colors.surface, borderRadius: radius.lg, paddingHorizontal: 18, marginBottom: 20, ...shadow },
  row: { paddingVertical: 15 },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: colors.border },
  rowLabel: { fontSize: 11, fontWeight: '800', color: colors.muted, textTransform: 'uppercase', letterSpacing: 0.8 },
  rowValue: { fontSize: 16, fontWeight: '700', color: colors.ink, marginTop: 4 },
  deleteBtn: { marginTop: 10 },
});

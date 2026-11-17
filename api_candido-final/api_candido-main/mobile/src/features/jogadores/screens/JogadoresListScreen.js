import { useMemo, useState } from 'react';
import { FlatList, Pressable, RefreshControl, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { PLATAFORMAS, colors, radius } from '../../../core/theme';
import { useNavigation } from '../../../navigation/Navigator';
import { TabScreen } from '../../../navigation/TabScreen';
import { ConfirmModal } from '../../../shared/components/ConfirmModal';
import { EmptyState, ErrorState, LoadingState } from '../../../shared/components/States';
import { useToast } from '../../../shared/components/Toast';
import { JogadorCard } from '../components/JogadorCard';
import { useDeleteJogador, useJogadores } from '../hooks/useJogadores';

export function JogadoresListScreen() {
  const nav = useNavigation();
  const toast = useToast();
  const { data, isPending, isError, error, refetch, isRefetching } = useJogadores();
  const remover = useDeleteJogador();

  const [busca, setBusca] = useState('');
  const [plataforma, setPlataforma] = useState(null);
  const [alvo, setAlvo] = useState(null);

  const filtrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    return (data || []).filter(
      (j) =>
        (!plataforma || j.plataforma === plataforma) &&
        (!termo || j.nome_usuario.toLowerCase().includes(termo) || j.email.toLowerCase().includes(termo))
    );
  }, [data, busca, plataforma]);

  function confirmarExclusao() {
    remover.mutate(alvo.id, {
      onSuccess: () => {
        toast.show(`${alvo.nome_usuario} foi excluído.`);
        setAlvo(null);
      },
      onError: (err) => {
        toast.show(err.message, 'error');
        setAlvo(null);
      },
    });
  }

  const filtrando = busca.trim() !== '' || plataforma !== null;

  let body;
  if (isPending) {
    body = <LoadingState label="Carregando jogadores..." />;
  } else if (isError) {
    body = <ErrorState message={error.message} onRetry={refetch} />;
  } else {
    body = (
      <FlatList
        data={filtrados}
        keyExtractor={(item) => String(item.id)}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={colors.primary} />}
        ListEmptyComponent={
          filtrando ? (
            <EmptyState emoji="🔍" title="Nada encontrado" text="Tente outro nome ou remova o filtro de plataforma." />
          ) : (
            <EmptyState
              title="Nenhum jogador cadastrado"
              text="Cadastre o primeiro jogador do GameHub."
              actionLabel="Cadastrar jogador"
              onAction={() => nav.push('formulario')}
            />
          )
        }
        renderItem={({ item }) => (
          <JogadorCard
            jogador={item}
            onOpen={() => nav.push('detalhe', { id: item.id })}
            onEdit={() => nav.push('formulario', { id: item.id })}
            onDelete={() => setAlvo(item)}
          />
        )}
      />
    );
  }

  return (
    <TabScreen
      active="jogadores"
      subtitle={data ? `${data.length} cadastrados` : 'Cadastro'}
      title="Jogadores"
    >
      <View style={styles.searchBox}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.search}
          value={busca}
          onChangeText={setBusca}
          placeholder="Buscar por nome ou e-mail"
          placeholderTextColor={colors.placeholder}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
        />
        {busca ? (
          <Pressable onPress={() => setBusca('')} hitSlop={8}>
            <Text style={styles.clear}>✕</Text>
          </Pressable>
        ) : null}
      </View>

      <View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
          <Chip label="Todas" active={plataforma === null} onPress={() => setPlataforma(null)} />
          {PLATAFORMAS.map((p) => (
            <Chip key={p} label={p} active={plataforma === p} onPress={() => setPlataforma(plataforma === p ? null : p)} />
          ))}
        </ScrollView>
      </View>

      <View style={styles.flex}>{body}</View>

      <ConfirmModal
        visible={alvo !== null}
        title="Excluir jogador"
        message={alvo ? `Deseja realmente excluir ${alvo.nome_usuario}? Essa ação não pode ser desfeita.` : ''}
        confirmLabel="Excluir"
        loading={remover.isPending}
        onConfirm={confirmarExclusao}
        onCancel={() => setAlvo(null)}
      />
    </TabScreen>
  );
}

function Chip({ label, active, onPress }) {
  return (
    <Pressable onPress={onPress} style={[styles.chip, active && styles.chipActive]}>
      <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  list: { paddingTop: 4, paddingBottom: 24, flexGrow: 1 },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    paddingHorizontal: 14,
    gap: 8,
    marginBottom: 12,
  },
  searchIcon: { fontSize: 14 },
  search: { flex: 1, minHeight: 48, fontSize: 15, color: colors.ink },
  clear: { color: colors.muted, fontSize: 16, fontWeight: '800' },
  chips: { gap: 8, paddingBottom: 12 },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { fontSize: 13, fontWeight: '800', color: colors.muted },
  chipTextActive: { color: '#fff' },
});

import { useNavigation } from '../../../navigation/Navigator';
import { Screen } from '../../../shared/components/Screen';
import { ErrorState, LoadingState } from '../../../shared/components/States';
import { JogadorForm } from '../components/JogadorForm';
import { useJogador } from '../hooks/useJogadores';

export function JogadorFormScreen({ params }) {
  const nav = useNavigation();
  const id = params?.id;
  const editando = id != null;
  const { data: jogador, isPending, isError, error, refetch } = useJogador(id);

  let body;
  if (editando && isPending) {
    body = <LoadingState label="Carregando jogador..." />;
  } else if (editando && isError && !jogador) {
    body = <ErrorState message={error.message} onRetry={refetch} />;
  } else {
    body = (
      <JogadorForm
        // key garante que o formulário reinicie com os dados atualizados
        key={jogador ? `${jogador.id}-${jogador.updated_at}` : 'novo'}
        jogador={editando ? jogador : undefined}
        onSuccess={() => (editando ? nav.pop() : nav.reset('jogadores'))}
      />
    );
  }

  return (
    <Screen subtitle={editando ? 'Editar' : 'Novo'} title={editando ? 'Editar jogador' : 'Novo jogador'} onBack={nav.pop}>
      {body}
    </Screen>
  );
}

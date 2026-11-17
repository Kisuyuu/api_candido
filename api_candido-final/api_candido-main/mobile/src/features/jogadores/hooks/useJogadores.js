import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createJogador,
  deleteJogador,
  getJogador,
  listJogadores,
  updateJogador,
} from '../api/jogadores.api';

export const jogadoresKeys = {
  all: ['jogadores'],
  list: () => ['jogadores', 'list'],
  detail: (id) => ['jogadores', 'detail', String(id)],
};

export function useJogadores() {
  return useQuery({ queryKey: jogadoresKeys.list(), queryFn: listJogadores });
}

export function useJogador(id) {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: jogadoresKeys.detail(id),
    queryFn: () => getJogador(id),
    enabled: id != null,
    // Mostra instantaneamente o dado que já veio na listagem enquanto busca o atualizado.
    placeholderData: () =>
      queryClient.getQueryData(jogadoresKeys.list())?.find((j) => String(j.id) === String(id)),
  });
}

export function useCreateJogador() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createJogador,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: jogadoresKeys.all }),
  });
}

export function useUpdateJogador() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateJogador,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: jogadoresKeys.all }),
  });
}

export function useDeleteJogador() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteJogador,
    onSuccess: (_data, id) => {
      queryClient.removeQueries({ queryKey: jogadoresKeys.detail(id) });
      return queryClient.invalidateQueries({ queryKey: jogadoresKeys.list() });
    },
  });
}

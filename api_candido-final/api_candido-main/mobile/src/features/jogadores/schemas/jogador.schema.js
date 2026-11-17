import { z } from 'zod';
import { brToIso, isoToBr } from '../../../shared/utils/formatters';

const inteiro = (rotulo, minimo) =>
  z
    .string()
    .trim()
    .min(1, `Informe ${rotulo}.`)
    .regex(/^\d+$/, 'Use apenas números inteiros.')
    .transform(Number)
    .refine((n) => n >= minimo, `Valor mínimo: ${minimo}.`)
    .refine((n) => n <= 2147483647, 'Valor muito alto.');

const dataNascimento = z
  .string()
  .trim()
  .min(1, 'Informe a data de nascimento.')
  .refine((v) => brToIso(v) !== null, 'Data inválida. Use DD/MM/AAAA.')
  .transform((v) => brToIso(v))
  .refine((iso) => iso < new Date().toISOString().slice(0, 10), 'A data deve ser anterior a hoje.')
  .refine((iso) => iso >= '1900-01-01', 'Data inválida.');

/** O formulário trabalha com strings; o schema converte para os tipos que a API espera. */
export function createJogadorSchema({ editando = false } = {}) {
  return z.object({
    nome_usuario: z.string().trim().min(1, 'Informe o nome de usuário.').max(255, 'Máximo de 255 caracteres.'),
    email: z.string().trim().min(1, 'Informe o e-mail.').email('Informe um e-mail válido.').max(255, 'Máximo de 255 caracteres.'),
    senha: editando
      ? z.string().refine((v) => v === '' || v.length >= 6, 'A senha deve ter no mínimo 6 caracteres.')
      : z.string().min(1, 'Informe a senha.').min(6, 'A senha deve ter no mínimo 6 caracteres.'),
    nivel: inteiro('o nível', 1),
    xp: inteiro('o XP', 0),
    moedas: inteiro('as moedas', 0),
    data_nascimento: dataNascimento,
    personagem_favorito: z.string().trim().max(255, 'Máximo de 255 caracteres.'),
    plataforma: z.string().min(1, 'Selecione a plataforma.'),
    foto: z.any().nullable(),
  });
}

export const emptyJogadorForm = {
  nome_usuario: '',
  email: '',
  senha: '',
  nivel: '1',
  xp: '0',
  moedas: '0',
  data_nascimento: '',
  personagem_favorito: '',
  plataforma: '',
  foto: null,
};

export function jogadorToFormValues(jogador) {
  return {
    nome_usuario: jogador.nome_usuario ?? '',
    email: jogador.email ?? '',
    senha: '',
    nivel: String(jogador.nivel ?? 1),
    xp: String(jogador.xp ?? 0),
    moedas: String(jogador.moedas ?? 0),
    data_nascimento: isoToBr(jogador.data_nascimento),
    personagem_favorito: jogador.personagem_favorito ?? '',
    plataforma: jogador.plataforma ?? '',
    foto: null,
  };
}

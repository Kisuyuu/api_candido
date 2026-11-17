import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { photoUrl } from '../../../core/http';
import { colors } from '../../../core/theme';
import { Button } from '../../../shared/components/Button';
import { useToast } from '../../../shared/components/Toast';
import { useCreateJogador, useUpdateJogador } from '../hooks/useJogadores';
import { createJogadorSchema, emptyJogadorForm, jogadorToFormValues } from '../schemas/jogador.schema';
import { FormField } from './FormField';
import { FotoPicker } from './FotoPicker';
import { PlataformaSelect } from './PlataformaSelect';

/**
 * Formulário de cadastro/edição.
 * - react-hook-form controla os campos
 * - zod (via zodResolver) valida e converte os tipos
 * - react-query (mutations) envia para a API e atualiza o cache
 */
export function JogadorForm({ jogador, onSuccess }) {
  const editando = Boolean(jogador);
  const toast = useToast();
  const criar = useCreateJogador();
  const atualizar = useUpdateJogador();
  const mutation = editando ? atualizar : criar;

  const { control, handleSubmit, setError, watch } = useForm({
    resolver: zodResolver(createJogadorSchema({ editando })),
    defaultValues: editando ? jogadorToFormValues(jogador) : emptyJogadorForm,
    mode: 'onTouched',
  });

  const nome = watch('nome_usuario');

  function onSubmit(values) {
    const options = {
      onSuccess: () => {
        toast.show(editando ? 'Jogador atualizado com sucesso.' : 'Jogador cadastrado com sucesso.');
        onSuccess();
      },
      onError: (error) => {
        // Erros de validação do Laravel (422) voltam para o campo correspondente.
        const campos = Object.entries(error.fieldErrors || {});
        campos.forEach(([campo, message]) => setError(campo === 'foto_perfil' ? 'foto' : campo, { type: 'server', message }));
        toast.show(error.message, 'error');
      },
    };

    if (editando) {
      atualizar.mutate({ id: jogador.id, values }, options);
    } else {
      criar.mutate(values, options);
    }
  }

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.scroll}
      >
        <FotoPicker control={control} currentUri={photoUrl(jogador?.foto_perfil)} nome={nome} />

        <Text style={styles.section}>Conta</Text>
        <FormField control={control} name="nome_usuario" label="Nome de usuário" placeholder="Ex.: Kisuyu" />
        <FormField control={control} name="email" label="E-mail" placeholder="voce@email.com" keyboardType="email-address" />
        <FormField
          control={control}
          name="senha"
          label={editando ? 'Nova senha' : 'Senha'}
          placeholder="Mínimo de 6 caracteres"
          secureTextEntry
          hint={editando ? 'Deixe em branco para manter a senha atual.' : undefined}
        />

        <Text style={styles.section}>Progresso</Text>
        <View style={styles.row}>
          <FormField control={control} name="nivel" label="Nível" keyboardType="number-pad" half />
          <FormField control={control} name="xp" label="XP" keyboardType="number-pad" half />
          <FormField control={control} name="moedas" label="Moedas" keyboardType="number-pad" half />
        </View>

        <Text style={styles.section}>Perfil</Text>
        <FormField control={control} name="data_nascimento" label="Data de nascimento" placeholder="DD/MM/AAAA" mask="date" />
        <FormField
          control={control}
          name="personagem_favorito"
          label="Personagem favorito"
          placeholder="Opcional"
          autoCapitalize="words"
        />
        <PlataformaSelect control={control} />

        <Button
          label={editando ? 'Salvar alterações' : 'Cadastrar jogador'}
          onPress={handleSubmit(onSubmit)}
          loading={mutation.isPending}
          style={styles.submit}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scroll: { paddingBottom: 48 },
  section: {
    fontSize: 12,
    fontWeight: '900',
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 12,
    marginTop: 4,
  },
  row: { flexDirection: 'row', gap: 10 },
  submit: { marginTop: 10 },
});

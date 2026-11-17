import { Platform } from 'react-native';
import { http } from '../../../core/http';

async function appendPhoto(formData, foto) {
  if (!foto) return;
  const name = foto.name || 'foto-perfil.jpg';
  const type = foto.type || 'image/jpeg';

  if (Platform.OS === 'web') {
    // No navegador o FormData precisa de um Blob real.
    const blob = await (await fetch(foto.uri)).blob();
    formData.append('foto_perfil', blob, name);
  } else {
    formData.append('foto_perfil', { uri: foto.uri, name, type });
  }
}

async function toFormData(values, { method } = {}) {
  const formData = new FormData();
  formData.append('nome_usuario', values.nome_usuario);
  formData.append('email', values.email);
  formData.append('nivel', String(values.nivel));
  formData.append('xp', String(values.xp));
  formData.append('moedas', String(values.moedas));
  formData.append('data_nascimento', values.data_nascimento);
  formData.append('plataforma', values.plataforma);
  formData.append('personagem_favorito', values.personagem_favorito || '');

  if (values.senha) formData.append('senha', values.senha);
  if (method) formData.append('_method', method);

  await appendPhoto(formData, values.foto);
  return formData;
}

const multipart = { headers: { 'Content-Type': 'multipart/form-data' } };

export async function listJogadores() {
  const { data } = await http.get('/jogadores');
  return data;
}

export async function getJogador(id) {
  const { data } = await http.get(`/jogadores/${id}`);
  return data;
}

export async function createJogador(values) {
  const { data } = await http.post('/jogadores', await toFormData(values), multipart);
  return data;
}

// Laravel não lê multipart em PUT, então enviamos POST com _method=PUT.
export async function updateJogador({ id, values }) {
  const { data } = await http.post(`/jogadores/${id}`, await toFormData(values, { method: 'PUT' }), multipart);
  return data;
}

export async function deleteJogador(id) {
  const { data } = await http.delete(`/jogadores/${id}`);
  return data;
}

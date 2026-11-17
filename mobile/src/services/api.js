import { Platform } from 'react-native';

const configuredBaseUrl = process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, '');
const defaultHost = Platform.OS === 'android' ? 'http://10.0.2.2:8000' : 'http://127.0.0.1:8000';

export const API_ORIGIN = configuredBaseUrl || defaultHost;
export const API_BASE_URL = `${API_ORIGIN}/api`;

class ApiError extends Error {
    constructor(message, status, errors = {}) {
        super(message);
        this.status = status;
        this.errors = errors;
    }
}

async function request(path, options = {}) {
    const response = await fetch(`${API_BASE_URL}${path}`, options);
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        const validationMessage = data.errors
            ? Object.values(data.errors).flat().join(' ')
            : null;
        throw new ApiError(
            validationMessage || data.message || 'Não foi possível concluir a operação.',
            response.status,
            data.errors || {}
        );
    }

    return data;
}

function appendPlayerFields(formData, player, includePassword) {
    formData.append('nome_usuario', player.nome_usuario);
    formData.append('email', player.email);
    formData.append('nivel', String(player.nivel));
    formData.append('xp', String(player.xp));
    formData.append('moedas', String(player.moedas));
    formData.append('data_nascimento', player.data_nascimento);
    formData.append('personagem_favorito', player.personagem_favorito || '');
    formData.append('plataforma', player.plataforma);

    if (includePassword && player.senha) {
        formData.append('senha', player.senha);
    }

    if (player.photo) {
        formData.append('foto_perfil', {
            uri: player.photo.uri,
            name: player.photo.name || 'foto-perfil.jpg',
            type: player.photo.type || 'image/jpeg',
        });
    }
}

export function listPlayers() {
    return request('/jogadores', { cache: 'no-store', headers: { Accept: 'application/json' } });
}

export function getPlayer(id) {
    return request(`/jogadores/${id}`, { cache: 'no-store', headers: { Accept: 'application/json' } });
}

export function createPlayer(player) {
    const formData = new FormData();
    appendPlayerFields(formData, player, true);

    return request('/jogadores', {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: formData,
    });
}

export function updatePlayer(id, player) {
    const formData = new FormData();
    appendPlayerFields(formData, player, false);
    formData.append('_method', 'PUT');

    if (player.senha) {
        formData.append('senha', player.senha);
    }

    return request(`/jogadores/${id}`, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: formData,
    });
}

export function deletePlayer(id) {
    return request(`/jogadores/${id}`, {
        method: 'DELETE',
        headers: { Accept: 'application/json' },
    });
}

export function getPhotoUrl(photoPath) {
    if (!photoPath) {
        return null;
    }

    if (photoPath.startsWith('http://') || photoPath.startsWith('https://')) {
        return photoPath;
    }

    return `${API_ORIGIN}/storage/${photoPath.replace(/^\//, '')}`;
}

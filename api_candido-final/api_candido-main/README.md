# GameHub

Cadastro de **jogadores** com API REST em Laravel (Entrega 1) e aplicativo Expo/React Native (Entrega 2).

> Tema, atributos e integrantes da equipe: veja o arquivo de descrição do trabalho enviado junto com a entrega.

## Estrutura

```
api_candido-main/        → API Laravel 12 (SQLite)
├── app/Http/Controllers/JogadorController.php
├── app/Http/Requests/JogadorRequest.php   (validação em português)
├── app/Models/Jogador.php
├── database/migrations, factories, seeders
├── routes/api.php
├── tests/Feature/JogadorApiTest.php
└── mobile/              → App Expo
    └── src/
        ├── core/        (tema, cliente axios, QueryClient)
        ├── shared/      (componentes de UI e utilitários)
        ├── navigation/  (navegação em pilha + abas)
        └── features/jogadores/
            ├── api/         (chamadas axios)
            ├── hooks/       (react-query: queries e mutations)
            ├── schemas/     (zod)
            ├── components/  (formulário, cards, campos)
            └── screens/     (início, lista, detalhes, formulário)
```

## 1. Rodando a API

Requisitos: PHP 8.2+, Composer.

```bash
composer install
cp .env.example .env
php artisan key:generate
touch database/database.sqlite
php artisan migrate --seed      # --seed cria 8 jogadores de exemplo
php artisan storage:link        # necessário para exibir as fotos
php artisan serve --host=0.0.0.0 --port=8000
```

Testes: `php artisan test`

### Atributos de `jogadores`

| Campo | Tipo |
| --- | --- |
| nome_usuario | string |
| email | string (único) |
| senha | string (hash, nunca retornada) |
| nivel, xp, moedas | inteiros |
| data_nascimento | data |
| data_criacao_conta | data e hora |
| personagem_favorito | string (opcional) |
| plataforma | string |
| foto_perfil | imagem (jpg, png, webp até 5 MB) |

### Endpoints

| Método | Rota | Ação |
| --- | --- | --- |
| GET | `/api/jogadores` | Lista |
| POST | `/api/jogadores` | Cadastra (multipart/form-data) |
| GET | `/api/jogadores/{id}` | Consulta |
| PUT/POST | `/api/jogadores/{id}` | Atualiza (no multipart use POST + `_method=PUT`) |
| DELETE | `/api/jogadores/{id}` | Exclui (remove também a foto) |

## 2. Rodando o app

Requisitos: Node 20+ e o app **Expo Go** (ou um emulador).

```bash
cd mobile
npm install
npx expo install --check        # confirma as versões compatíveis com o SDK
npx expo start
```

O endereço da API é detectado automaticamente:

1. `EXPO_PUBLIC_API_URL` (veja `mobile/.env.example`), se definida;
2. IP do computador que roda o Metro (Expo Go no celular, mesma rede Wi-Fi);
3. `10.0.2.2:8000` no emulador Android e `127.0.0.1:8000` no iOS Simulator/web.

Se o celular não conseguir conectar, crie `mobile/.env` com `EXPO_PUBLIC_API_URL=http://SEU_IP:8000` e reinicie o `expo start`.

### Bibliotecas exigidas

`react-hook-form`, `zod`, `@hookform/resolvers`, `axios` e `@tanstack/react-query`.

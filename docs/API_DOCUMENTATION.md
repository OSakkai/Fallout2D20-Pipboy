# API Documentation - Fallout 2d20 Pip-Boy

Documentação completa da API REST do sistema Pip-Boy. Acesse a documentação interativa Swagger em `http://localhost:3000/api` para testar os endpoints diretamente.

## Base URL

```
http://localhost:3000
```

Para acesso na rede local (tablet/smartphone):
```
http://192.168.100.111:3000
```

## Autenticação

A API utiliza autenticação JWT (JSON Web Token). Após o login ou registro, você receberá um token que deve ser incluído no header de todas as requisições protegidas:

```
Authorization: Bearer <seu-token-jwt>
```

### Modos de Acesso

1. **Modo Registrado**: Crie uma conta com email e senha
2. **Modo Guest**: Acesso temporário sem cadastro (dados não salvos na nuvem)

---

## Endpoints

### 🔐 Auth (Autenticação)

#### POST /auth/register
Registra um novo usuário no sistema.

**Body:**
```json
{
  "email": "usuario@vault.com",
  "username": "vault_dweller",
  "password": "123456",
  "role": "PLAYER"  // opcional: PLAYER ou GM
}
```

**Response (201):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "usuario@vault.com",
    "username": "vault_dweller",
    "role": "PLAYER"
  }
}
```

**Errors:**
- `400`: Email já cadastrado ou dados inválidos

---

#### POST /auth/login
Autentica um usuário existente.

**Body:**
```json
{
  "email": "usuario@vault.com",
  "password": "123456"
}
```

**Response (200):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "usuario@vault.com",
    "username": "vault_dweller",
    "role": "PLAYER"
  }
}
```

**Errors:**
- `401`: Credenciais inválidas

---

#### POST /auth/guest
Gera um token temporário para acesso sem cadastro.

**Body:** (nenhum)

**Response (200):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "guest-uuid",
    "email": "guest@local",
    "role": "PLAYER",
    "isGuest": true
  }
}
```

> ⚠️ **Importante**: No modo guest, os dados não são salvos permanentemente. Use apenas para testes ou jogo local offline.

---

### 👤 Characters (Personagens)

Todos os endpoints de personagens requerem autenticação JWT.

#### POST /characters
Cria um novo personagem para o usuário autenticado.

**Headers:**
```
Authorization: Bearer <token>
```

**Body:**
```json
{
  "name": "John Vault-Tec",
  "level": 1,
  "special": {
    "strength": 5,
    "perception": 5,
    "endurance": 5,
    "charisma": 5,
    "intelligence": 5,
    "agility": 5,
    "luck": 5
  },
  "hp": 100,
  "ap": 10,
  "xp": 0,
  "caps": 0
}
```

**Response (201):**
```json
{
  "id": "uuid",
  "userId": "uuid",
  "name": "John Vault-Tec",
  "level": 1,
  "special": { ... },
  "hp": 100,
  "ap": 10,
  "xp": 0,
  "caps": 0,
  "createdAt": "2026-01-05T10:00:00.000Z",
  "updatedAt": "2026-01-05T10:00:00.000Z"
}
```

---

#### GET /characters
Lista todos os personagens do usuário autenticado.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
[
  {
    "id": "uuid",
    "name": "John Vault-Tec",
    "level": 5,
    "hp": 120,
    "ap": 12,
    "xp": 2500,
    "caps": 450
  },
  // ... mais personagens
]
```

---

#### GET /characters/:id
Busca um personagem específico por ID.

**Headers:**
```
Authorization: Bearer <token>
```

**Params:**
- `id` (UUID): ID do personagem

**Response (200):**
```json
{
  "id": "uuid",
  "name": "John Vault-Tec",
  "level": 5,
  "special": {
    "strength": 7,
    "perception": 5,
    "endurance": 6,
    "charisma": 4,
    "intelligence": 6,
    "agility": 5,
    "luck": 5
  },
  "hp": 120,
  "ap": 12,
  "xp": 2500,
  "caps": 450,
  "items": [ ... ],
  "parties": [ ... ]
}
```

**Errors:**
- `404`: Personagem não encontrado

---

#### PUT /characters/:id
Atualiza informações de um personagem (HP, AP, XP, CAPS, etc).

**Headers:**
```
Authorization: Bearer <token>
```

**Params:**
- `id` (UUID): ID do personagem

**Body:**
```json
{
  "hp": 85,
  "ap": 8,
  "xp": 2750,
  "caps": 500
}
```

**Response (200):**
```json
{
  "id": "uuid",
  "name": "John Vault-Tec",
  "hp": 85,
  "ap": 8,
  "xp": 2750,
  "caps": 500,
  "updatedAt": "2026-01-05T11:30:00.000Z"
}
```

---

#### DELETE /characters/:id
Remove permanentemente um personagem.

**Headers:**
```
Authorization: Bearer <token>
```

**Params:**
- `id` (UUID): ID do personagem

**Response (200):**
```json
{
  "message": "Character deleted successfully"
}
```

---

### 🎒 Items (Inventário)

Todos os endpoints de itens requerem autenticação JWT.

#### POST /items
Adiciona um item ao inventário de um personagem.

**Headers:**
```
Authorization: Bearer <token>
```

**Body:**
```json
{
  "characterId": "uuid",
  "name": "Stimpak",
  "type": "AID",
  "quantity": 5,
  "weight": 0.5,
  "value": 20,
  "description": "Restaura 30 HP"
}
```

**Tipos de Item:**
- `WEAPON`: Armas
- `ARMOR`: Armaduras e roupas
- `AID`: Items de cura e consumíveis
- `MISC`: Miscelânea
- `AMMO`: Munição

**Response (201):**
```json
{
  "id": "uuid",
  "characterId": "uuid",
  "name": "Stimpak",
  "type": "AID",
  "quantity": 5,
  "weight": 0.5,
  "value": 20,
  "description": "Restaura 30 HP",
  "createdAt": "2026-01-05T10:00:00.000Z"
}
```

---

#### GET /items/character/:characterId
Lista todos os itens do inventário de um personagem.

**Headers:**
```
Authorization: Bearer <token>
```

**Params:**
- `characterId` (UUID): ID do personagem

**Response (200):**
```json
[
  {
    "id": "uuid",
    "name": "Stimpak",
    "type": "AID",
    "quantity": 5,
    "weight": 0.5,
    "value": 20
  },
  {
    "id": "uuid",
    "name": "10mm Pistol",
    "type": "WEAPON",
    "quantity": 1,
    "weight": 3.5,
    "value": 150
  }
]
```

---

#### GET /items/:id
Busca um item específico por ID.

**Headers:**
```
Authorization: Bearer <token>
```

**Params:**
- `id` (UUID): ID do item

**Response (200):**
```json
{
  "id": "uuid",
  "characterId": "uuid",
  "name": "Stimpak",
  "type": "AID",
  "quantity": 5,
  "weight": 0.5,
  "value": 20,
  "description": "Restaura 30 HP"
}
```

---

#### PUT /items/:id
Atualiza um item (quantidade, peso, etc).

**Headers:**
```
Authorization: Bearer <token>
```

**Params:**
- `id` (UUID): ID do item

**Body:**
```json
{
  "quantity": 3
}
```

**Response (200):**
```json
{
  "id": "uuid",
  "name": "Stimpak",
  "quantity": 3,
  "updatedAt": "2026-01-05T11:00:00.000Z"
}
```

---

#### DELETE /items/:id
Remove um item do inventário.

**Headers:**
```
Authorization: Bearer <token>
```

**Params:**
- `id` (UUID): ID do item

**Response (200):**
```json
{
  "message": "Item deleted successfully"
}
```

---

### 🎲 Parties (Sessões/Partidas)

Sistema de criação e gerenciamento de sessões de RPG com códigos únicos para multiplayer.

#### POST /parties
Cria uma nova partida/sessão. Apenas o criador é o GM (Game Master).

**Headers:**
```
Authorization: Bearer <token>
```

**Body:**
```json
{
  "name": "Aventura no Ermo",
  "maxPlayers": 6
}
```

**Response (201):**
```json
{
  "id": "uuid",
  "code": "ABC123",
  "name": "Aventura no Ermo",
  "maxPlayers": 6,
  "gmId": "uuid",
  "status": "ACTIVE",
  "createdAt": "2026-01-05T10:00:00.000Z"
}
```

> 💡 O `code` gerado (6 caracteres) é usado pelos jogadores para entrar na partida.

---

#### GET /parties/code/:code
Busca uma partida pelo código único.

**Params:**
- `code` (string): Código da partida (6 caracteres)

**Response (200):**
```json
{
  "id": "uuid",
  "code": "ABC123",
  "name": "Aventura no Ermo",
  "maxPlayers": 6,
  "status": "ACTIVE",
  "gm": {
    "id": "uuid",
    "email": "gm@vault.com"
  },
  "players": [
    {
      "characterId": "uuid",
      "characterName": "John Vault-Tec",
      "joinedAt": "2026-01-05T10:05:00.000Z"
    }
  ]
}
```

**Errors:**
- `404`: Partida não encontrada

---

#### GET /parties/my-parties
Lista todas as partidas onde o usuário autenticado é o GM.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
[
  {
    "id": "uuid",
    "code": "ABC123",
    "name": "Aventura no Ermo",
    "status": "ACTIVE",
    "playerCount": 3,
    "maxPlayers": 6
  }
]
```

---

#### POST /parties/:code/join
Adiciona um personagem a uma partida.

**Headers:**
```
Authorization: Bearer <token>
```

**Params:**
- `code` (string): Código da partida

**Body:**
```json
{
  "characterId": "uuid"
}
```

**Response (201):**
```json
{
  "message": "Character joined party successfully",
  "party": {
    "code": "ABC123",
    "name": "Aventura no Ermo"
  }
}
```

**Errors:**
- `400`: Partida cheia ou personagem já está na partida
- `404`: Partida não encontrada

---

#### POST /parties/:code/leave
Remove um personagem de uma partida.

**Headers:**
```
Authorization: Bearer <token>
```

**Params:**
- `code` (string): Código da partida

**Body:**
```json
{
  "characterId": "uuid"
}
```

**Response (200):**
```json
{
  "message": "Character left party successfully"
}
```

---

#### PUT /parties/:code/status
Atualiza o status de uma partida (apenas GM).

**Headers:**
```
Authorization: Bearer <token>
```

**Params:**
- `code` (string): Código da partida

**Body:**
```json
{
  "status": "PAUSED"
}
```

**Status possíveis:**
- `ACTIVE`: Partida ativa
- `PAUSED`: Partida pausada
- `FINISHED`: Partida finalizada

**Response (200):**
```json
{
  "id": "uuid",
  "code": "ABC123",
  "status": "PAUSED",
  "updatedAt": "2026-01-05T12:00:00.000Z"
}
```

---

#### DELETE /parties/:code
Deleta uma partida permanentemente (apenas GM).

**Headers:**
```
Authorization: Bearer <token>
```

**Params:**
- `code` (string): Código da partida

**Response (200):**
```json
{
  "message": "Party deleted successfully"
}
```

**Errors:**
- `400`: Apenas o GM pode deletar a partida
- `404`: Partida não encontrada

---

## Códigos de Status HTTP

- `200 OK`: Requisição bem-sucedida
- `201 Created`: Recurso criado com sucesso
- `400 Bad Request`: Dados inválidos ou erro de validação
- `401 Unauthorized`: Não autenticado ou token inválido
- `403 Forbidden`: Sem permissão para acessar o recurso
- `404 Not Found`: Recurso não encontrado
- `500 Internal Server Error`: Erro interno do servidor

---

## Exemplos de Uso

### Fluxo Completo: Criar Conta → Criar Personagem → Criar Partida

```bash
# 1. Registrar novo usuário
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"jogador@vault.com","username":"vault_player","password":"123456"}'

# Resposta: { "access_token": "TOKEN_JWT", "user": {...} }

# 2. Criar personagem
curl -X POST http://localhost:3000/characters \
  -H "Authorization: Bearer TOKEN_JWT" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Vault Dweller",
    "special": {
      "strength": 6,
      "perception": 5,
      "endurance": 7,
      "charisma": 4,
      "intelligence": 6,
      "agility": 5,
      "luck": 5
    },
    "hp": 110,
    "ap": 10
  }'

# Resposta: { "id": "CHARACTER_UUID", ... }

# 3. Criar partida (como GM)
curl -X POST http://localhost:3000/parties \
  -H "Authorization: Bearer TOKEN_JWT" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Primeira Aventura",
    "maxPlayers": 4
  }'

# Resposta: { "code": "ABC123", ... }

# 4. Entrar na partida com personagem
curl -X POST http://localhost:3000/parties/ABC123/join \
  -H "Authorization: Bearer TOKEN_JWT" \
  -H "Content-Type: application/json" \
  -d '{"characterId":"CHARACTER_UUID"}'
```

---

## Swagger UI

Acesse a documentação interativa completa com interface gráfica em:

```
http://localhost:3000/api
```

Na interface Swagger você pode:
- Ver todos os endpoints disponíveis
- Testar requisições diretamente no navegador
- Ver schemas detalhados de request/response
- Autenticar com JWT token
- Exportar especificação OpenAPI

---

## WebSocket (Futuro)

O sistema possui um gateway WebSocket configurado para comunicação em tempo real entre GM e jogadores. Eventos planejados:

- `damage`: Aplicar dano a um personagem
- `heal`: Curar um personagem
- `move`: Atualizar posição no mapa
- `chat`: Mensagens entre jogadores
- `sync`: Sincronizar estado do Pip-Boy

Documentação completa será adicionada quando os eventos forem implementados.

---

🤖 Documentação gerada automaticamente a partir dos decorators Swagger

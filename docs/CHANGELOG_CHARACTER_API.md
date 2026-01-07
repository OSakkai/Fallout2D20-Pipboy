# Character Creation API - Changelog

## 📝 Resumo

Implementação completa dos endpoints para criação de personagem via wizard no backend, incluindo integração com o frontend.

## ✅ Features Implementadas

### Backend

#### 1. DTO de Criação de Personagem (`backend/src/modules/characters/dto/create-character.dto.ts`)
- **CreateCharacterDto**: DTO completo com validação para criação de personagem
- **SPECIALDto**: DTO para atributos SPECIAL com validação (min: 1, max: 10)
- **Origin enum**: Mapeamento de origens frontend → backend
- **Skill enum**: Enum completo de skills
- Validação com `class-validator`:
  - Nome obrigatório
  - Origin obrigatório (enum)
  - SPECIAL completo com limites
  - Tag skills (array de 3 skills)
  - Skill ranks (objeto com distribuição de pontos)
  - Stats derivados (maxHP, defense, initiative, meleeDamage)

#### 2. Service Atualizado (`backend/src/modules/characters/characters.service.ts`)
- **`createFromWizard()`**: Método principal para criar personagem completo
  - Valida campanha (se fornecida) ou cria campanha pessoal automática
  - Cria personagem com transação Prisma
  - Cria SPECIAL attributes
  - Cria todas as 17 skills com ranks e tags
  - Cria derived stats (HP, defense, initiative, melee damage)
  - Cria body locations (6 localizações com HP distribuído)
  - Retorna personagem completo com todas as relações

- **`mapOriginToPrisma()`**: Mapeia origins do frontend para o schema Prisma
  - `VAULT_DWELLER` → `VAULT_DWELLER`
  - `WASTELANDER` → `SURVIVOR`
  - `GHOUL` → `GHOUL`
  - `SUPER_MUTANT` → `SUPER_MUTANT`
  - `BROTHERHOOD_INITIATE` → `BROTHERHOOD`
  - `ROBOT` → `MISTER_HANDY`

- **Métodos existentes aprimorados**:
  - `findAllByUser()`: Retorna lista com attributes, derivedStats e campaign
  - `findOne()`: Retorna personagem completo com skills, perks, inventory, body locations
  - `update()`: Validação e retorno com relações
  - `delete()`: Validação antes de deletar

#### 3. Controller Atualizado (`backend/src/modules/characters/characters.controller.ts`)
- **POST `/characters/wizard`**: Endpoint principal para criação via wizard
  - Swagger documentation completa
  - Exemplo de request/response
  - Validação automática via `ValidationPipe`
  - Retorna personagem completo criado

- **Swagger API atualizada**:
  - Documentação detalhada do endpoint `/characters/wizard`
  - Exemplos de uso para todos os endpoints
  - Descrições de respostas de erro

#### 4. Main.ts Atualizado (`backend/src/main.ts`)
- Swagger description atualizada:
  - ✅ Criação completa de personagem via wizard
  - ✅ Gerenciamento de personagens com SPECIAL, Skills, Derived Stats
  - Versão 2.0

### Frontend

#### 1. Service de API (`frontend/src/services/characterApi.ts`)
- **`createCharacterFromWizard()`**: Envia dados do wizard para API
  - Headers com Authorization Bearer
  - Tratamento de erros
  - Retorna personagem criado completo

- **`getMyCharacters()`**: Lista personagens do usuário
- **`getCharacterById()`**: Busca personagem específico
- **`deleteCharacter()`**: Deleta personagem

- **TypeScript interface `CreateCharacterResponse`**: Define estrutura completa do personagem retornado

#### 2. MainMenu Atualizado (`frontend/src/components/Terminal/MainMenu.tsx`)
- **`handleCharacterCreationComplete()`** agora é async
  - Valida token JWT
  - Chama API para criar personagem
  - Mostra feedback de sucesso/erro
  - Navegação após criação

## 📡 Endpoints Criados

### POST `/characters/wizard`
**Autenticação**: Bearer Token (JWT)

**Request Body**:
```json
{
  "campaignId": "optional-campaign-id",
  "characterName": "Vault Dweller",
  "origin": "VAULT_DWELLER",
  "special": {
    "strength": 5,
    "perception": 6,
    "endurance": 5,
    "charisma": 4,
    "intelligence": 7,
    "agility": 6,
    "luck": 5
  },
  "tagSkills": ["SMALL_GUNS", "LOCKPICK", "SPEECH"],
  "skillRanks": {
    "SMALL_GUNS": 2,
    "LOCKPICK": 1,
    "SPEECH": 2
  },
  "level": 1,
  "maxHP": 60,
  "defense": 1,
  "initiative": 12,
  "meleeDamage": 1
}
```

**Response (201)**:
```json
{
  "id": "clxyz123abc",
  "name": "Vault Dweller",
  "level": 1,
  "origin": "VAULT_DWELLER",
  "attributes": {
    "strength": 5,
    "perception": 6,
    "endurance": 5,
    "charisma": 4,
    "intelligence": 7,
    "agility": 6,
    "luck": 5
  },
  "skills": [
    { "skill": "SMALL_GUNS", "rank": 2, "isTagged": true },
    { "skill": "LOCKPICK", "rank": 1, "isTagged": true },
    { "skill": "SPEECH", "rank": 2, "isTagged": true },
    ...
  ],
  "derivedStats": {
    "maxHP": 60,
    "currentHP": 60,
    "defense": 1,
    "initiative": 12,
    "meleeDamage": 1,
    "carryWeightMax": 50,
    "maxLuckPoints": 5
  },
  "bodyLocations": [
    { "location": "HEAD", "maxHP": 12, "currentHP": 12 },
    { "location": "TORSO", "maxHP": 24, "currentHP": 24 },
    { "location": "LEFT_ARM", "maxHP": 9, "currentHP": 9 },
    { "location": "RIGHT_ARM", "maxHP": 9, "currentHP": 9 },
    { "location": "LEFT_LEG", "maxHP": 12, "currentHP": 12 },
    { "location": "RIGHT_LEG", "maxHP": 12, "currentHP": 12 }
  ],
  "campaign": {
    "id": "camp123",
    "name": "Vault Dweller's Adventure",
    "description": "Personal campaign"
  }
}
```

**Errors**:
- 400: Dados inválidos
- 401: Não autenticado
- 404: Campanha não encontrada (se campaignId fornecido)

## 🔄 Fluxo Completo

1. **Frontend**: Usuário completa wizard de criação (5 steps)
2. **Frontend**: Clica em "CREATE CHARACTER" no Step 5 (Review)
3. **Frontend**: `CharacterCreation` chama `onComplete(data)`
4. **Frontend**: `MainMenu.handleCharacterCreationComplete()` é executado
5. **Frontend**: Valida token JWT no localStorage
6. **Frontend**: Chama `createCharacterFromWizard(data, token)`
7. **Backend**: Recebe POST `/characters/wizard`
8. **Backend**: Valida DTO com `class-validator`
9. **Backend**: `CharactersService.createFromWizard()` executa transação
10. **Backend**: Cria:
    - Character base
    - CharacterAttributes (SPECIAL)
    - CharacterSkill (todas 17 skills)
    - DerivedStats (HP, defense, etc.)
    - BodyLocation (6 localizações)
11. **Backend**: Retorna personagem completo
12. **Frontend**: Exibe mensagem de sucesso
13. **Frontend**: Navega para jogo

## 🗂️ Arquivos Modificados

### Backend
- ✅ `backend/src/modules/characters/dto/create-character.dto.ts` (NOVO)
- ✅ `backend/src/modules/characters/characters.service.ts` (REESCRITO)
- ✅ `backend/src/modules/characters/characters.controller.ts` (REESCRITO)
- ✅ `backend/src/main.ts` (ATUALIZADO - Swagger docs)

### Frontend
- ✅ `frontend/src/services/characterApi.ts` (NOVO)
- ✅ `frontend/src/components/Terminal/MainMenu.tsx` (ATUALIZADO)

## 📚 Documentação

A documentação completa da API está disponível em:
**http://localhost:3000/api**

Navegue até a seção "characters" para ver todos os endpoints disponíveis, incluindo:
- POST `/characters/wizard` - Criar personagem via wizard
- GET `/characters` - Listar meus personagens
- GET `/characters/:id` - Buscar personagem por ID
- PUT `/characters/:id` - Atualizar personagem
- DELETE `/characters/:id` - Deletar personagem

## 🧪 Como Testar

1. **Inicie os serviços**:
```bash
cd "c:\Users\Sakai\Desktop\projeto pipboy\Fallout2D20-Pipboy"
docker-compose up -d
```

2. **Acesse o frontend**: http://localhost:5173

3. **Faça login ou registre-se**

4. **Crie um personagem**:
   - Click em "NEW GAME"
   - Click em "CREATE A CHARACTER"
   - Complete os 5 steps do wizard
   - Click em "CREATE CHARACTER" no final
   - Personagem será criado no backend e salvo no banco de dados

5. **Verifique no Swagger**: http://localhost:3000/api
   - Teste o endpoint POST `/characters/wizard`
   - Use o token JWT obtido no login

## ⚙️ Validações Implementadas

- Nome do personagem: obrigatório, string não vazia
- Origin: obrigatório, deve ser um dos valores válidos
- SPECIAL: todos atributos obrigatórios, entre 1 e 10
- Tag Skills: exatamente 3 skills
- Skill Ranks: objeto com ranks de skills
- Level: inteiro >= 1
- MaxHP: inteiro >= 1
- Defense: inteiro >= 0
- Initiative: inteiro
- MeleeDamage: inteiro >= 0

## 🎯 Próximos Passos

- [ ] Implementar listagem de personagens no frontend
- [ ] Implementar seleção de personagem para jogar
- [ ] Implementar edição de personagem
- [ ] Implementar sistema de progressão (level up)
- [ ] Implementar gerenciamento de campanhas (GM)
- [ ] Integrar seleção de campanha no wizard

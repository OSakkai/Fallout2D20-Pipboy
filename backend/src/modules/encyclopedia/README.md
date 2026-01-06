# Encyclopedia Module

Sistema de consulta dos dados do Fallout 2D20 Corebook. Fornece API REST para acesso a todos os itens master do jogo.

## 📋 Endpoints

### Weapons
```http
GET /encyclopedia/weapons?search=laser&weaponType=ENERGY_WEAPONS&rarity=3
```

**Query Parameters:**
- `search` (string): Busca por nome
- `weaponType` (string): Tipo de arma (SMALL_GUNS, BIG_GUNS, ENERGY_WEAPONS, MELEE_WEAPONS, UNARMED, THROWING)
- `rarity` (number): Nível de raridade (0-5)
- `minWeight` / `maxWeight` (number): Filtro por peso
- `minCost` / `maxCost` (number): Filtro por custo

### Armor
```http
GET /encyclopedia/armor?search=power&armorType=POWER_ARMOR&location=TORSO
```

**Query Parameters:**
- `search` (string): Busca por nome
- `armorType` (string): Tipo de armadura (ARMOR, CLOTHING, POWER_ARMOR, ROBOT_ARMOR)
- `location` (string): Local do corpo
- `rarity` (number): Nível de raridade
- `minWeight` / `maxWeight` (number): Filtro por peso
- `minCost` / `maxCost` (number): Filtro por custo

### Consumables
```http
GET /encyclopedia/consumables?category=AID&search=stimpak
```

**Query Parameters:**
- `search` (string): Busca por nome
- `category` (string): **AID**, **CHEM**, **FOOD**, ou **BEVERAGE**
- `rarity` (number): Nível de raridade
- `minCost` / `maxCost` (number): Filtro por custo

**Categorias:**
- **AID**: Stimpak, Super Stimpak, Stimpak Diffuser, RadAway, Rad-X, Robot Repair Kit (e variações)
- **CHEM**: Buffout, Jet, Mentats, Psycho, X-Cell, etc.
- **FOOD**: Comidas (75 items)
- **BEVERAGE**: Bebidas (22 items)

### Mods
```http
GET /encyclopedia/mods?search=scope&modType=WEAPON_MOD
```

**Query Parameters:**
- `search` (string): Busca por nome
- `modType` (string): Tipo de mod (WEAPON_MOD, ARMOR_MOD, CLOTHING_MOD, ROBOT_MOD)
- `modSlot` (string): Slot do mod (RECEIVER, BARREL, GRIP, SIGHT, MAGAZINE, MATERIAL, UTILITY, etc.)

### Perks
```http
GET /encyclopedia/perks?search=gunslinger
```

**Query Parameters:**
- `search` (string): Busca por nome

### Ammo
```http
GET /encyclopedia/ammo?ammoType=.308&rarity=2
```

**Query Parameters:**
- `search` (string): Busca por nome
- `ammoType` (string): Tipo de munição
- `rarity` (number): Nível de raridade

### Magazines
```http
GET /encyclopedia/magazines?search=grognak
```

**Query Parameters:**
- `search` (string): Busca por nome

### Tools
```http
GET /encyclopedia/tools?category=medical&rarity=3
```

**Query Parameters:**
- `search` (string): Busca por nome
- `category` (string): Categoria da ferramenta
- `rarity` (number): Nível de raridade

### Item Individual
```http
GET /encyclopedia/weapon/:id
GET /encyclopedia/armor/:id
GET /encyclopedia/consumable/:id
GET /encyclopedia/mod/:id
GET /encyclopedia/perk/:id
GET /encyclopedia/ammo/:id
GET /encyclopedia/magazine/:id
GET /encyclopedia/tool/:id
```

## 🔍 Exemplos de Uso

### Buscar todas as armas de energia
```typescript
const response = await fetch('http://localhost:3000/encyclopedia/weapons?weaponType=ENERGY_WEAPONS');
const energyWeapons = await response.json();
```

### Buscar itens de cura (AID)
```typescript
const response = await fetch('http://localhost:3000/encyclopedia/consumables?category=AID');
const healingItems = await response.json();
// Retorna: Stimpak, Super Stimpak, RadAway, Rad-X, Robot Repair Kit, etc.
```

### Buscar armaduras leves e baratas
```typescript
const response = await fetch('http://localhost:3000/encyclopedia/armor?maxWeight=5&maxCost=100');
const lightArmor = await response.json();
```

### Detalhes de uma arma específica
```typescript
const response = await fetch('http://localhost:3000/encyclopedia/weapon/cmk2k1234abcd');
const weapon = await response.json();
```

## 📊 Estrutura de Dados

### Weapon Response
```json
{
  "id": "cmk2k1234abcd",
  "name": "Laser Rifle",
  "weaponType": "ENERGY_WEAPONS",
  "skill": "ENERGY_WEAPONS",
  "damage": "4CD",
  "damageEffects": ["Laser"],
  "damageType": "ENERGY",
  "fireRate": 2,
  "range": "MEDIUM",
  "ammoType": "Fusion Cell",
  "qualities": ["Breaking 3", "Reliable"],
  "weight": 8,
  "cost": 150,
  "rarity": 3,
  "availableModSlots": {
    "RECEIVER": true,
    "BARREL": true,
    "GRIP": true,
    "SIGHT": true
  },
  "corebookPage": 123
}
```

### Consumable Response
```json
{
  "id": "cmk2k5678efgh",
  "name": "Stimpak",
  "category": "AID",
  "hpHealed": 4,
  "effects": ["Heals 4 HP (see description)"],
  "radiationDice": null,
  "addictionRating": 0,
  "duration": "Instant",
  "isAlcoholic": false,
  "weight": 0.5,
  "cost": 50,
  "rarity": 2,
  "corebookPage": 98
}
```

## 🎯 Frontend Integration

O módulo Encyclopedia está integrado com o frontend React em:
- `frontend/src/components/Terminal/Encyclopedia.tsx`

**Features:**
- 11 categorias navegáveis
- Busca em tempo real com debouncing
- Sistema de favoritos (localStorage)
- Filtros por tipo, raridade, peso, custo
- Modal de detalhes expandido
- Interface estilo Pip-Boy com CRT effect

## 📝 Notas

1. **Busca Case-Insensitive**: Todas as buscas são case-insensitive usando Prisma `mode: 'insensitive'`
2. **Categorização de Consumíveis**: Stimpaks, RadAway, Rad-X e Robot Repair Kit foram movidos para categoria AID via migração
3. **Ordenação**: Todos os endpoints retornam resultados ordenados alfabeticamente por nome
4. **Swagger**: Documentação completa disponível em `/api` quando servidor está rodando

## 🔧 Migrations

### Healing Items Migration
Script executado para mover itens de cura de CHEM para AID:
```bash
npx ts-node prisma/migrate-healing-to-aid.ts
```

Itens migrados:
- Stimpak
- Stimpak (Diluted)
- Super Stimpak
- Stimpak Diffuser
- RadAway
- RadAway (Diluted)
- Rad-X
- Rad-X (Diluted)
- Robot Repair Kit

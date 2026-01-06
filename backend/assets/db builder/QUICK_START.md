# 🚀 Quick Start Guide

## Setup em 5 Minutos

### **1. Instalar**
```bash
npm install @prisma/client prisma
```

### **2. Configurar .env**
```bash
DATABASE_URL="postgresql://user:password@localhost:5432/fallout2d20"
```

### **3. Deploy Schema**
```bash
npx prisma generate
npx prisma db push
```

### **4. Popular Dados Básicos**
```bash
npx ts-node seed.ts
```

### **5. Testar**
```typescript
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Criar usuário
const user = await prisma.user.create({
  data: {
    email: "gm@vault-tec.com",
    name: "Overseer"
  }
});

// Criar campanha
const campaign = await prisma.campaign.create({
  data: {
    name: "Commonwealth Adventures",
    gmId: user.id
  }
});

console.log("✅ Setup completo!");
```

---

## 📁 Dados Disponíveis dos HTMLs

### ✅ **Já Processados Parcialmente**
- `melee_weapons.html` (27 armas)
- `throwables.html` (15 explosivos - grenades + mines)
- `beverages.html` (23 bebidas)
- `armor_mods.html` (16 mods)
- `clothing_mods.html` (11 mods)
- `power_armor.html` (21 peças - 4 modelos)
- `dog_armor.html` (4 itens)
- `robot_modules.html` (13 módulos)
- `syringer_ammo.html` (10 tipos especiais)
- `magazines.html` (20 publicações)
- `tagskill.html` (17 skills - equipamento inicial)

### ⏳ **Pendentes (HTMLs fornecidos mas não processados)**
- `ranged_weapons.html` - CRÍTICO
- `perks.html` - CRÍTICO
- `ammunition.html`
- `armor.html` - Leather, Metal, Combat, Synth, Marine
- `clothing.html`
- `food.html`
- `chems.html` - IMPORTANTE (Stimpak, RadAway, etc)
- `tools.html`
- `weapons_mods.html` - CRÍTICO
- `power_armor_mods.html`
- `power_armor_plating.html`
- `robot_armor.html`
- `magazines_issues.html` (issues individuais)

---

## 🎯 Prioridades para Completar

### **Prioridade ALTA**
1. **ranged_weapons.html** → Processar e adicionar ao seed
   - Small Guns (10mm, Hunting Rifle, Combat Rifle, etc)
   - Energy Weapons (Laser Pistol, Plasma Gun, etc)
   - Big Guns (Minigun, Gatling Laser, Fat Man, etc)

2. **perks.html** → Popular perk_master
   - ~60+ perks do Corebook
   - Requirements em JSON
   - Mechanical effects parseáveis

3. **chems.html** → Popular consumable_master
   - Stimpak, RadAway, Rad-X
   - Buffout, Jet, Psycho, Med-X
   - Addiction ratings e durations

4. **weapons_mods.html** → Popular mod_master
   - Receivers, barrels, grips, sights, magazines
   - Requirements e efeitos

### **Prioridade MÉDIA**
5. **armor.html** → Completar armor_master
6. **ammunition.html** → Popular ammo_master  
7. **food.html** → Adicionar a consumable_master

### **Prioridade BAIXA**
8. Clothing, tools, power armor mods, robot armor

---

## 📊 Estrutura dos HTMLs

Todos os HTMLs seguem o mesmo padrão:
```html
<table class="waffle">
  <thead>
    <tr>
      <th>COLUMN_1</th>
      <th>COLUMN_2</th>
      ...
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Value 1</td>
      <td>Value 2</td>
      ...
    </tr>
  </tbody>
</table>
```

### **Parser Simples**
```typescript
import * as cheerio from 'cheerio';
import * as fs from 'fs';

function parseHTML(filepath: string) {
  const html = fs.readFileSync(filepath, 'utf-8');
  const $ = cheerio.load(html);
  
  const rows = [];
  
  $('table tbody tr').each((i, row) => {
    const cells = $(row).find('td').map((j, cell) => 
      $(cell).text().trim()
    ).get();
    
    rows.push(cells);
  });
  
  return rows;
}

// Uso
const weapons = parseHTML('/path/to/ranged_weapons.html');
```

---

## 🔄 Workflow Sugerido

### **Para cada HTML pendente:**

1. **Parse HTML** para array de dados
2. **Map para schema Prisma**
   ```typescript
   const weapons = parseHTML('ranged_weapons.html').map(row => ({
     name: row[0],
     weaponType: mapWeaponType(row[1]),
     skill: mapSkill(row[1]),
     damage: row[2],
     damageEffects: parseEffects(row[3]),
     // ... etc
   }));
   ```
3. **Adicionar ao seed.ts**
4. **Testar insert**
5. **Commit**

---

## 🧪 Testing

### **Validar Inserts**
```typescript
// Contar items
const weaponCount = await prisma.weaponMaster.count();
console.log(`Weapons: ${weaponCount}`);

// Buscar por rarity
const rareWeapons = await prisma.weaponMaster.findMany({
  where: { rarity: { gte: 3 } }
});

// Validar relationships
const weaponWithMods = await prisma.weaponMaster.findFirst({
  where: { name: '10mm Pistol' }
});
console.log('Available mods:', weaponWithMods.availableModSlots);
```

### **Validar Cálculos**
```typescript
// Criar personagem teste
const testChar = await createCharacter(
  userId, 
  campaignId,
  testData
);

// Verificar derived stats
const stats = await prisma.derivedStats.findUnique({
  where: { characterId: testChar.id }
});

console.assert(stats.meleeDamage === expectedValue);
console.assert(stats.carryWeightMax === expectedValue);
```

---

## 📝 Próximos Passos

1. **Processar HTMLs críticos** (ranged_weapons, perks, chems)
2. **Completar seed.ts** com todos os dados
3. **Testar fluxos de combate** end-to-end
4. **Implementar queries úteis** no backend
5. **Criar API endpoints** (se aplicável)
6. **Adicionar validações** de regras de negócio
7. **Implementar UI** conectando ao Prisma

---

## 🐛 Troubleshooting

### **Erro: relation does not exist**
```bash
npx prisma db push --force-reset
```

### **Erro: unique constraint violation**
```bash
# Limpar dados e re-seed
npx prisma db push --force-reset
npx ts-node seed.ts
```

### **Performance lenta**
```sql
-- Adicionar índices customizados
CREATE INDEX idx_inventory_character ON inventory_items(character_id);
CREATE INDEX idx_effects_expires ON active_effects(expires_at) WHERE expires_at IS NOT NULL;
```

---

## 💡 Dicas

### **Prisma Studio**
```bash
npx prisma studio
```
Interface visual para explorar dados

### **Migrations**
```bash
npx prisma migrate dev --name add_new_feature
```
Para mudanças de schema em produção

### **Reset Database**
```bash
npx prisma db push --force-reset
npx ts-node seed.ts
```

---

## 🎯 Checklist Final

- [ ] Schema deployado
- [ ] Master tables populadas (ranged_weapons, perks, chems)
- [ ] Seed script completo
- [ ] Testes de character creation funcionando
- [ ] Testes de combat system funcionando
- [ ] Testes de level up funcionando
- [ ] Validações implementadas
- [ ] Documentação revisada
- [ ] Performance otimizada

---

**🚀 Ready to go!**

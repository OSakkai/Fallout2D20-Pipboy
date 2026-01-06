# Fallout 2D20 Database Migration Specification

## CURRENT SCHEMA ANALYSIS

### Existing Tables

**users**
```
id, email, username, password, role, createdAt, updatedAt
Role ENUM: PLAYER, GM
```
ACTION: KEEP, add campaigns relationship

**characters**
```
id, name, userId, 
strength, perception, endurance, charisma, intelligence, agility, luck,
currentHP, maxHP, level, xp,
createdAt, updatedAt
```
ACTION: REFACTOR - normalize SPECIAL and derived stats into separate tables

**items**
```
id, name, category, weight, value, characterId, createdAt, updatedAt
ItemCategory ENUM: WEAPON, APPAREL, AID, MISC, JUNK, AMMO
```
ACTION: DELETE - replace with master-instance pattern

**parties**
```
id, code, name, gmUserId, status, maxPlayers, createdAt, updatedAt
PartyStatus ENUM: ACTIVE, PAUSED, FINISHED
```
ACTION: RENAME to campaigns, remove code/maxPlayers fields

**character_parties**
```
id, characterId, partyId, joinedAt, leftAt
```
ACTION: KEEP, optional rename to campaign_members

---

## TARGET SCHEMA

### 1. Core Tables - KEEP/MODIFY

**users** (NO CHANGES)
```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  username  String   @unique
  password  String
  role      Role     @default(PLAYER)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  characters Character[]
  campaigns  Campaign[]
  
  @@map("users")
}

enum Role {
  PLAYER
  GM
}
```

**campaigns** (RENAMED from parties)
```prisma
model Campaign {
  id          String   @id @default(cuid())
  name        String
  description String?
  gmId        String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  gm          User              @relation(fields: [gmId], references: [id], onDelete: Cascade)
  members     CampaignMember[]
  characters  Character[]
  npcs        Npc[]
  sessions    Session[]
  
  @@index([gmId])
  @@map("campaigns")
}
```

**campaign_members** (RENAMED from character_parties)
```prisma
model CampaignMember {
  id          String    @id @default(cuid())
  characterId String
  campaignId  String
  joinedAt    DateTime  @default(now())
  leftAt      DateTime?
  
  character   Character @relation(fields: [characterId], references: [id], onDelete: Cascade)
  campaign    Campaign  @relation(fields: [campaignId], references: [id], onDelete: Cascade)
  
  @@unique([characterId, campaignId])
  @@index([campaignId])
  @@map("campaign_members")
}
```

---

### 2. Character System - REFACTOR

**characters** (MODIFIED)
```prisma
model Character {
  id          String        @id @default(cuid())
  name        String
  userId      String
  campaignId  String
  origin      Origin
  type        CharacterType @default(NORMAL)
  level       Int           @default(1)
  xpCurrent   Int           @default(0)
  xpToNext    Int           @default(100)
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt
  
  user           User               @relation(fields: [userId], references: [id], onDelete: Cascade)
  campaign       Campaign           @relation(fields: [campaignId], references: [id], onDelete: Cascade)
  attributes     CharacterAttributes?
  skills         CharacterSkill[]
  derivedStats   DerivedStats?
  bodyLocations  BodyLocation[]
  perks          CharacterPerk[]
  inventory      InventoryItem[]
  activeEffects  ActiveEffect[]
  campaignMember CampaignMember[]
  sessionStates  SessionState[]
  
  @@index([userId])
  @@index([campaignId])
  @@map("characters")
}

enum Origin {
  VAULT_DWELLER
  SURVIVOR
  BROTHERHOOD
  GHOUL
  SUPER_MUTANT
  MISTER_HANDY
}

enum CharacterType {
  NORMAL
  NOTABLE
  MAJOR
}
```

**character_attributes** (NEW)
```prisma
model CharacterAttributes {
  id           String @id @default(cuid())
  characterId  String @unique
  strength     Int    @default(5)
  perception   Int    @default(5)
  endurance    Int    @default(5)
  charisma     Int    @default(5)
  intelligence Int    @default(5)
  agility      Int    @default(5)
  luck         Int    @default(5)
  
  character Character @relation(fields: [characterId], references: [id], onDelete: Cascade)
  
  @@map("character_attributes")
}
```

**character_skills** (NEW)
```prisma
model CharacterSkill {
  id          String  @id @default(cuid())
  characterId String
  skill       Skill
  rank        Int     @default(0)
  isTagged    Boolean @default(false)
  
  character Character @relation(fields: [characterId], references: [id], onDelete: Cascade)
  
  @@unique([characterId, skill])
  @@index([characterId])
  @@map("character_skills")
}

enum Skill {
  ATHLETICS
  BARTER
  BIG_GUNS
  ENERGY_WEAPONS
  EXPLOSIVES
  LOCKPICK
  MEDICINE
  MELEE_WEAPONS
  PILOT
  REPAIR
  SCIENCE
  SMALL_GUNS
  SNEAK
  SPEECH
  SURVIVAL
  THROWING
  UNARMED
}
```

**derived_stats** (NEW)
```prisma
model DerivedStats {
  id                 String @id @default(cuid())
  characterId        String @unique
  defense            Int
  initiative         Int
  meleeDamage        Int
  maxHP              Int
  currentHP          Int
  carryWeightMax     Int
  carryWeightCurrent Int
  maxLuckPoints      Int
  poisonDR           Int    @default(0)
  
  character Character @relation(fields: [characterId], references: [id], onDelete: Cascade)
  
  @@map("derived_stats")
}
```

**body_locations** (NEW)
```prisma
model BodyLocation {
  id          String           @id @default(cuid())
  characterId String
  location    BodyLocationEnum
  diceRange   String
  maxHP       Int
  currentHP   Int
  physicalDR  Int              @default(0)
  energyDR    Int              @default(0)
  radiationDR Int              @default(0)
  
  character Character @relation(fields: [characterId], references: [id], onDelete: Cascade)
  
  @@unique([characterId, location])
  @@index([characterId])
  @@map("body_locations")
}

enum BodyLocationEnum {
  HEAD
  LEFT_ARM
  RIGHT_ARM
  TORSO
  LEFT_LEG
  RIGHT_LEG
  OPTICS
  MAIN_BODY
  ARM_1
  ARM_2
  ARM_3
  THRUSTER
}
```

**character_perks** (NEW)
```prisma
model CharacterPerk {
  id              String   @id @default(cuid())
  characterId     String
  perkId          String
  rank            Int      @default(1)
  acquiredAtLevel Int
  acquiredAt      DateTime @default(now())
  
  character Character  @relation(fields: [characterId], references: [id], onDelete: Cascade)
  perk      PerkMaster @relation(fields: [perkId], references: [id])
  
  @@index([characterId])
  @@index([perkId])
  @@map("character_perks")
}
```

**active_effects** (NEW)
```prisma
model ActiveEffect {
  id              String      @id @default(cuid())
  characterId     String
  effectType      EffectType
  name            String
  description     String?
  attributeMods   Json?
  skillMods       Json?
  drMods          Json?
  duration        Int?
  startedAt       DateTime    @default(now())
  expiresAt       DateTime?
  addictionRating Int?
  
  character Character @relation(fields: [characterId], references: [id], onDelete: Cascade)
  
  @@index([characterId])
  @@index([expiresAt])
  @@map("active_effects")
}

enum EffectType {
  CHEM
  INJURY
  PERK
  EQUIPMENT
  ENVIRONMENTAL
  OTHER
}
```

---

### 3. Inventory System - NEW

**inventory_items** (REPLACES items)
```prisma
model InventoryItem {
  id           String   @id @default(cuid())
  characterId  String?
  npcId        String?
  itemType     ItemType
  itemId       String
  quantity     Int      @default(1)
  condition    Int?
  isEquipped   Boolean  @default(false)
  equippedSlot String?
  appliedMods  String[] @default([])
  
  character Character? @relation(fields: [characterId], references: [id], onDelete: Cascade)
  npc       Npc?       @relation(fields: [npcId], references: [id], onDelete: Cascade)
  
  @@index([characterId])
  @@index([npcId])
  @@index([itemType])
  @@map("inventory_items")
}

enum ItemType {
  WEAPON_RANGED
  WEAPON_MELEE
  ARMOR
  CLOTHING
  CONSUMABLE
  AMMO
  MOD
  MISC
  MAGAZINE
}
```

---

### 4. Master Data Tables - NEW (populate from CSV)

**weapon_master**
```prisma
model WeaponMaster {
  id                String       @id @default(cuid())
  name              String       @unique
  weaponType        WeaponType
  skill             Skill
  damage            String
  damageEffects     String[]     @default([])
  damageType        DamageType
  fireRate          Int?
  range             WeaponRange?
  ammoType          String?
  qualities         String[]     @default([])
  weight            Float
  cost              Int
  rarity            Int          @default(0)
  availableModSlots Json
  corebookPage      Int?
  
  @@index([weaponType])
  @@index([skill])
  @@map("weapon_master")
}

enum WeaponType {
  SMALL_GUN
  ENERGY_WEAPON
  BIG_GUN
  MELEE
  UNARMED
  THROWING
  EXPLOSIVE
}

enum WeaponRange {
  CLOSE
  MEDIUM
  LONG
}

enum DamageType {
  PHYSICAL
  ENERGY
  RADIATION
  POISON
}
```

**armor_master**
```prisma
model ArmorMaster {
  id                String           @id @default(cuid())
  name              String           @unique
  armorType         ArmorType
  location          BodyLocationEnum
  physicalDR        Int
  energyDR          Int
  radiationDR       Int
  maxHP             Int?
  weight            Float
  cost              Int
  rarity            Int              @default(0)
  allowsMaterialMod Boolean          @default(true)
  allowsUtilityMod  Boolean          @default(true)
  corebookPage      Int?
  
  @@index([armorType])
  @@index([location])
  @@map("armor_master")
}

enum ArmorType {
  LEATHER
  METAL
  COMBAT
  SYNTH
  MARINE
  POWER_ARMOR
  CLOTHING
  DOG_ARMOR
  ROBOT_ARMOR
}
```

**consumable_master**
```prisma
model ConsumableMaster {
  id              String              @id @default(cuid())
  name            String              @unique
  category        ConsumableCategory
  hpHealed        Int                 @default(0)
  effects         String[]            @default([])
  radiationDice   String?
  addictionRating Int?
  duration        Int?
  isAlcoholic     Boolean             @default(false)
  weight          Float
  cost            Int
  rarity          Int                 @default(0)
  corebookPage    Int?
  
  @@index([category])
  @@map("consumable_master")
}

enum ConsumableCategory {
  AID
  CHEM
  FOOD
  BEVERAGE
}
```

**mod_master**
```prisma
model ModMaster {
  id             String   @id @default(cuid())
  name           String   @unique
  modType        ModType
  modSlot        String?
  applicableTo   String[] @default([])
  effects        String[] @default([])
  drModifiers    Json?
  damageBonus    String?
  requirements   String[] @default([])
  weight         Float    @default(0)
  weightModifier Float    @default(0)
  cost           Int
  corebookPage   Int?
  
  @@index([modType])
  @@index([modSlot])
  @@map("mod_master")
}

enum ModType {
  WEAPON_MOD
  ARMOR_MOD
  CLOTHING_MOD
  ROBOT_MOD
  POWER_ARMOR_MOD
}
```

**perk_master**
```prisma
model PerkMaster {
  id                String @id @default(cuid())
  name              String @unique
  ranks             Int    @default(1)
  requirements      Json
  condition         String
  benefit           String
  mechanicalEffects Json?
  corebookPage      Int?
  
  characterPerks CharacterPerk[]
  
  @@index([name])
  @@map("perk_master")
}
```

**ammo_master**
```prisma
model AmmoMaster {
  id           String @id @default(cuid())
  name         String @unique
  ammoType     String
  damageBonus  String
  baseQuantity Int    @default(6)
  weight       Float
  cost         Int
  rarity       Int    @default(0)
  corebookPage Int?
  
  @@index([ammoType])
  @@map("ammo_master")
}
```

**magazine_master**
```prisma
model MagazineMaster {
  id              String @id @default(cuid())
  name            String @unique
  rollRange       String
  hasIssues       Boolean
  perkGranted     String
  perkDescription String
  corebookPage    Int?
  
  issues MagazineIssueMaster[]
  
  @@map("magazine_master")
}
```

**magazine_issue_master** (NEW)
```prisma
model MagazineIssueMaster {
  id          String @id @default(cuid())
  magazineId  String
  issueNumber Int
  perkName    String
  perkEffect  String
  
  magazine MagazineMaster @relation(fields: [magazineId], references: [id], onDelete: Cascade)
  
  @@unique([magazineId, issueNumber])
  @@index([magazineId])
  @@map("magazine_issue_master")
}
```

**tool_master** (NEW)
```prisma
model ToolMaster {
  id           String @id @default(cuid())
  name         String @unique
  category     String
  effect       String
  weight       Float
  cost         Int
  rarity       Int    @default(0)
  corebookPage Int?
  
  @@index([category])
  @@map("tool_master")
}
```

---

### 5. Session Management - NEW

**sessions**
```prisma
model Session {
  id            String   @id @default(cuid())
  campaignId    String
  sessionNumber Int
  date          DateTime @default(now())
  notes         String?
  
  campaign      Campaign       @relation(fields: [campaignId], references: [id], onDelete: Cascade)
  sessionStates SessionState[]
  
  @@unique([campaignId, sessionNumber])
  @@index([campaignId])
  @@map("sessions")
}
```

**session_states**
```prisma
model SessionState {
  id          String @id @default(cuid())
  sessionId   String
  characterId String
  currentAP   Int    @default(0)
  currentLuck Int    @default(0)
  
  session   Session   @relation(fields: [sessionId], references: [id], onDelete: Cascade)
  character Character @relation(fields: [characterId], references: [id], onDelete: Cascade)
  
  @@unique([sessionId, characterId])
  @@index([sessionId])
  @@index([characterId])
  @@map("session_states")
}
```

---

### 6. NPCs - NEW

**npcs**
```prisma
model Npc {
  id          String  @id @default(cuid())
  campaignId  String
  name        String
  level       Int
  npcType     NpcType
  strength    Int
  perception  Int
  endurance   Int
  charisma    Int
  intelligence Int
  agility     Int
  luck        Int
  maxHP       Int
  currentHP   Int
  defense     Int
  initiative  Int
  meleeDamage Int
  carryWeight Int
  luckPoints  Int
  physicalDR  Int     @default(0)
  energyDR    Int     @default(0)
  radiationDR Int     @default(0)
  poisonDR    Int     @default(0)
  skills      Json
  
  campaign  Campaign        @relation(fields: [campaignId], references: [id], onDelete: Cascade)
  inventory InventoryItem[]
  
  @@index([campaignId])
  @@map("npcs")
}

enum NpcType {
  NORMAL
  NOTABLE
  MAJOR
}
```

---

## MIGRATION STEPS

### Step 1: Backup Current Database
```sql
CREATE TABLE backup_users AS SELECT * FROM users;
CREATE TABLE backup_characters AS SELECT * FROM characters;
CREATE TABLE backup_items AS SELECT * FROM items;
CREATE TABLE backup_parties AS SELECT * FROM parties;
CREATE TABLE backup_character_parties AS SELECT * FROM character_parties;
```

### Step 2: Update Schema
```bash
npx prisma db push --force-reset
npx prisma generate
```

### Step 3: Data Migration Logic

**Users - NO CHANGES**
Copy all data as-is from backup_users

**Campaigns - RENAME from parties**
```typescript
for each backup_parties row:
  INSERT INTO campaigns (id, name, gmId, createdAt, updatedAt)
  VALUES (row.id, row.name, row.gmUserId, row.createdAt, row.updatedAt)
  description = NULL
  IGNORE: code, status, maxPlayers
```

**Campaign Members - RENAME from character_parties**
```typescript
for each backup_character_parties row:
  INSERT INTO campaign_members (id, characterId, campaignId, joinedAt, leftAt)
  VALUES (row.id, row.characterId, row.partyId, row.joinedAt, row.leftAt)
```

**Characters - REFACTOR**
```typescript
for each backup_characters row:
  // 1. Main character record
  INSERT INTO characters (id, name, userId, level, xpCurrent, xpToNext, createdAt, updatedAt)
  VALUES (row.id, row.name, row.userId, row.level, row.xp, calculateXP(row.level + 1), row.createdAt, row.updatedAt)
  origin = 'VAULT_DWELLER'  // default
  type = 'NORMAL'           // default
  campaignId = (SELECT campaignId FROM campaign_members WHERE characterId = row.id LIMIT 1)
  
  // 2. Extract SPECIAL attributes
  INSERT INTO character_attributes (characterId, strength, perception, endurance, charisma, intelligence, agility, luck)
  VALUES (row.id, row.strength, row.perception, row.endurance, row.charisma, row.intelligence, row.agility, row.luck)
  
  // 3. Create 17 default skills
  for each skill in Skill enum:
    INSERT INTO character_skills (characterId, skill, rank, isTagged)
    VALUES (row.id, skill, 0, false)
  
  // 4. Calculate derived stats
  INSERT INTO derived_stats
  VALUES (characterId, defense, initiative, meleeDamage, row.maxHP, row.currentHP, carryWeight, 0, maxLuck, 0)
  WHERE:
    defense = 1
    initiative = row.perception + row.agility
    meleeDamage = calculateMelee(row.strength)
    carryWeight = row.strength * 10 + 150
    maxLuck = 0
  
  // 5. Create 6 body locations (humans)
  INSERT INTO body_locations
  VALUES for HEAD, TORSO, LEFT_ARM, RIGHT_ARM, LEFT_LEG, RIGHT_LEG
  with appropriate maxHP, diceRange values
```

**Items - DELETE and CREATE instances**
```typescript
for each backup_items row:
  // Map old category to new itemType
  itemType = mapCategory(row.category)
  
  // Create or find master entry
  masterId = findOrCreateMaster(row.name, itemType, row.weight, row.value)
  
  // Create inventory instance
  INSERT INTO inventory_items (characterId, itemType, itemId, quantity, condition)
  VALUES (row.characterId, itemType, masterId, 1, 100)
```

### Step 4: Populate Master Tables from CSV

**CSV Files in backend/assets:**
```
FALLOUT 2D20 DATA - ammunition.csv          → AmmoMaster
FALLOUT 2D20 DATA - armor mods.csv          → ModMaster (ARMOR_MOD)
FALLOUT 2D20 DATA - armor.csv               → ArmorMaster
FALLOUT 2D20 DATA - beverages.csv           → ConsumableMaster (BEVERAGE)
FALLOUT 2D20 DATA - chems.csv               → ConsumableMaster (CHEM)
FALLOUT 2D20 DATA - clothing mods.csv       → ModMaster (CLOTHING_MOD)
FALLOUT 2D20 DATA - clothing.csv            → ArmorMaster (CLOTHING)
FALLOUT 2D20 DATA - dog armor.csv           → ArmorMaster (DOG_ARMOR)
FALLOUT 2D20 DATA - food.csv                → ConsumableMaster (FOOD)
FALLOUT 2D20 DATA - magazines issues.csv    → MagazineIssueMaster
FALLOUT 2D20 DATA - magazines.csv           → MagazineMaster
FALLOUT 2D20 DATA - melee weapons.csv       → WeaponMaster (MELEE/UNARMED)
FALLOUT 2D20 DATA - perks.csv               → PerkMaster
FALLOUT 2D20 DATA - power armor mods.csv    → ModMaster (POWER_ARMOR_MOD)
FALLOUT 2D20 DATA - power armor plating.csv → ModMaster (POWER_ARMOR_MOD material)
FALLOUT 2D20 DATA - power armor.csv         → ArmorMaster (POWER_ARMOR)
FALLOUT 2D20 DATA - ranged weapons.csv      → WeaponMaster (SMALL_GUN/ENERGY_WEAPON/BIG_GUN)
FALLOUT 2D20 DATA - robot armor.csv         → ArmorMaster (ROBOT_ARMOR)
FALLOUT 2D20 DATA - robot modules.csv       → ModMaster (ROBOT_MOD)
FALLOUT 2D20 DATA - syringer ammo.csv       → AmmoMaster (special type)
FALLOUT 2D20 DATA - tagskill.csv            → Reference only (starting equipment)
FALLOUT 2D20 DATA - throwables.csv          → WeaponMaster (THROWING/EXPLOSIVE)
FALLOUT 2D20 DATA - tools.csv               → ToolMaster (NEW table for misc tools)
FALLOUT 2D20 DATA - weapons mods.csv        → ModMaster (WEAPON_MOD)
```

**Import Script:**
```typescript
const CSV_MAPPINGS = {
  'FALLOUT 2D20 DATA - ammunition.csv': { model: 'ammoMaster', parser: 'ammo' },
  'FALLOUT 2D20 DATA - armor mods.csv': { model: 'modMaster', parser: 'armorMod' },
  'FALLOUT 2D20 DATA - armor.csv': { model: 'armorMaster', parser: 'armor' },
  'FALLOUT 2D20 DATA - beverages.csv': { model: 'consumableMaster', parser: 'beverage' },
  'FALLOUT 2D20 DATA - chems.csv': { model: 'consumableMaster', parser: 'chem' },
  'FALLOUT 2D20 DATA - clothing mods.csv': { model: 'modMaster', parser: 'clothingMod' },
  'FALLOUT 2D20 DATA - clothing.csv': { model: 'armorMaster', parser: 'clothing' },
  'FALLOUT 2D20 DATA - dog armor.csv': { model: 'armorMaster', parser: 'dogArmor' },
  'FALLOUT 2D20 DATA - food.csv': { model: 'consumableMaster', parser: 'food' },
  'FALLOUT 2D20 DATA - magazines issues.csv': { model: 'magazineIssueMaster', parser: 'magazineIssue' },
  'FALLOUT 2D20 DATA - magazines.csv': { model: 'magazineMaster', parser: 'magazine' },
  'FALLOUT 2D20 DATA - melee weapons.csv': { model: 'weaponMaster', parser: 'meleeWeapon' },
  'FALLOUT 2D20 DATA - perks.csv': { model: 'perkMaster', parser: 'perk' },
  'FALLOUT 2D20 DATA - power armor mods.csv': { model: 'modMaster', parser: 'powerArmorMod' },
  'FALLOUT 2D20 DATA - power armor plating.csv': { model: 'modMaster', parser: 'powerArmorPlating' },
  'FALLOUT 2D20 DATA - power armor.csv': { model: 'armorMaster', parser: 'powerArmor' },
  'FALLOUT 2D20 DATA - ranged weapons.csv': { model: 'weaponMaster', parser: 'rangedWeapon' },
  'FALLOUT 2D20 DATA - robot armor.csv': { model: 'armorMaster', parser: 'robotArmor' },
  'FALLOUT 2D20 DATA - robot modules.csv': { model: 'modMaster', parser: 'robotModule' },
  'FALLOUT 2D20 DATA - syringer ammo.csv': { model: 'ammoMaster', parser: 'syringerAmmo' },
  'FALLOUT 2D20 DATA - tagskill.csv': { skip: true }, // Reference only
  'FALLOUT 2D20 DATA - throwables.csv': { model: 'weaponMaster', parser: 'throwable' },
  'FALLOUT 2D20 DATA - tools.csv': { model: 'toolMaster', parser: 'tool' },
  'FALLOUT 2D20 DATA - weapons mods.csv': { model: 'modMaster', parser: 'weaponMod' }
};

async function importAllCSVs() {
  for (const [filename, config] of Object.entries(CSV_MAPPINGS)) {
    if (config.skip) continue;
    
    const filepath = `/backend/assets/${filename}`;
    const rows = parseCSV(filepath);
    
    for (const row of rows) {
      const data = parsers[config.parser](row);
      
      await prisma[config.model].upsert({
        where: { name: data.name },
        update: {},
        create: data
      });
    }
  }
}
```

---

## VALIDATION RULES

### Character Creation
- SPECIAL: each 4-10, sum = 40
- Skills: 3 tagged (start rank 2), others rank 0
- Max skill rank = 6
- Level = 1, XP = 0

### Derived Stats Calculations
```typescript
defense = 1
initiative = PER + AGI + typeBonus
meleeDamage = STR >= 11 ? 3 : STR >= 9 ? 2 : STR >= 7 ? 1 : 0
maxHP = END + LCK + Level + typeBonus
carryWeightMax = STR * 10 + 150
maxLuckPoints = type === 'MAJOR' ? LCK : Math.ceil(LCK / 2)
```

### Body Locations (Humans)
```
HEAD: diceRange "1-2", maxHP 5
TORSO: diceRange "3-8", maxHP 10
LEFT_ARM: diceRange "9-11", maxHP 5
RIGHT_ARM: diceRange "12-14", maxHP 5
LEFT_LEG: diceRange "15-17", maxHP 5
RIGHT_LEG: diceRange "18-20", maxHP 5
```

---

## CSV COLUMN MAPPINGS

### Weapons CSVs

**melee weapons.csv → WeaponMaster**
```
name, weaponType (MELEE/UNARMED), skill, damage, damageEffects, damageType (PHYSICAL), 
qualities, weight, cost, rarity, corebookPage
```

**ranged weapons.csv → WeaponMaster**
```
name, weaponType (SMALL_GUN/ENERGY_WEAPON/BIG_GUN), skill, damage, damageEffects, 
damageType, fireRate, range, ammoType, qualities, weight, cost, rarity, 
availableModSlots, corebookPage
```

**throwables.csv → WeaponMaster**
```
name, weaponType (THROWING/EXPLOSIVE), skill, damage, damageEffects, damageType,
range, qualities, weight, cost, rarity, corebookPage
```

### Armor CSVs

**armor.csv → ArmorMaster**
```
name, armorType (LEATHER/METAL/COMBAT/SYNTH/MARINE), location, physicalDR, energyDR, 
radiationDR, weight, cost, rarity, allowsMaterialMod, allowsUtilityMod, corebookPage
```

**clothing.csv → ArmorMaster**
```
name, armorType (CLOTHING), location, physicalDR, energyDR, radiationDR, weight, 
cost, rarity, corebookPage
```

**dog armor.csv → ArmorMaster**
```
name, armorType (DOG_ARMOR), location, physicalDR, energyDR, radiationDR, weight, 
cost, rarity, corebookPage
```

**power armor.csv → ArmorMaster**
```
name, armorType (POWER_ARMOR), location, physicalDR, energyDR, radiationDR, maxHP, 
weight, cost, rarity, corebookPage
```

**robot armor.csv → ArmorMaster**
```
name, armorType (ROBOT_ARMOR), location, physicalDR, energyDR, radiationDR, maxHP,
weight, cost, rarity, corebookPage
```

### Consumables CSVs

**beverages.csv → ConsumableMaster**
```
name, category (BEVERAGE), hpHealed, effects, radiationDice, addictionRating, 
isAlcoholic, weight, cost, rarity, corebookPage
```

**food.csv → ConsumableMaster**
```
name, category (FOOD), hpHealed, effects, radiationDice, weight, cost, rarity, 
corebookPage
```

**chems.csv → ConsumableMaster**
```
name, category (CHEM), hpHealed, effects, addictionRating, duration, weight, cost, 
rarity, corebookPage
```

### Mods CSVs

**weapons mods.csv → ModMaster**
```
name, modType (WEAPON_MOD), modSlot, applicableTo, effects, damageBonus, requirements, 
weight, weightModifier, cost, corebookPage
```

**armor mods.csv → ModMaster**
```
name, modType (ARMOR_MOD), modSlot (material/utility), applicableTo, effects, 
drModifiers, requirements, weight, weightModifier, cost, corebookPage
```

**clothing mods.csv → ModMaster**
```
name, modType (CLOTHING_MOD), modSlot, applicableTo, effects, requirements, weight, 
weightModifier, cost, corebookPage
```

**power armor mods.csv → ModMaster**
```
name, modType (POWER_ARMOR_MOD), modSlot, applicableTo, effects, drModifiers, 
requirements, weight, cost, corebookPage
```

**power armor plating.csv → ModMaster**
```
name, modType (POWER_ARMOR_MOD), modSlot (material), applicableTo, effects, 
drModifiers, requirements, weight, cost, corebookPage
```

**robot modules.csv → ModMaster**
```
name, modType (ROBOT_MOD), modSlot, applicableTo, effects, requirements, weight, 
cost, corebookPage
```

### Other CSVs

**ammunition.csv → AmmoMaster**
```
name, ammoType, damageBonus, baseQuantity, weight, cost, rarity, corebookPage
```

**syringer ammo.csv → AmmoMaster**
```
name, ammoType (syringer), damageBonus, baseQuantity, weight, cost, rarity, 
corebookPage
```

**magazines.csv → MagazineMaster**
```
name, rollRange, hasIssues, perkGranted, perkDescription, corebookPage
```

**magazines issues.csv → MagazineIssueMaster**
```
magazineName (FK lookup), issueNumber, perkName, perkEffect
```

**perks.csv → PerkMaster**
```
name, ranks, requirements (JSON), condition, benefit, mechanicalEffects (JSON), 
corebookPage
```

**tools.csv → ToolMaster**
```
name, category, effect, weight, cost, rarity, corebookPage
```

**tagskill.csv** (Reference Only - Not Imported)
```
skill, startingEquipment
Used for initial character creation logic only
```

---

## IMPLEMENTATION CHECKLIST

### Database Migration
- [ ] Backup current database (users, characters, items, parties, character_parties)
- [ ] Update schema.prisma with new structure
- [ ] Run npx prisma db push --force-reset
- [ ] Run npx prisma generate
- [ ] Migrate users (copy as-is)
- [ ] Migrate parties → campaigns (rename, remove code/maxPlayers)
- [ ] Migrate character_parties → campaign_members (rename)
- [ ] Migrate characters (split SPECIAL, create skills, body locations, derived stats)
- [ ] Convert items → inventory_items + master entries

### CSV Import (24 files in backend/assets)

**Weapons (4 files)**
- [ ] Import FALLOUT 2D20 DATA - melee weapons.csv
- [ ] Import FALLOUT 2D20 DATA - ranged weapons.csv
- [ ] Import FALLOUT 2D20 DATA - throwables.csv
- [ ] Import FALLOUT 2D20 DATA - weapons mods.csv

**Armor (5 files)**
- [ ] Import FALLOUT 2D20 DATA - armor.csv
- [ ] Import FALLOUT 2D20 DATA - clothing.csv
- [ ] Import FALLOUT 2D20 DATA - dog armor.csv
- [ ] Import FALLOUT 2D20 DATA - power armor.csv
- [ ] Import FALLOUT 2D20 DATA - robot armor.csv

**Armor Mods (4 files)**
- [ ] Import FALLOUT 2D20 DATA - armor mods.csv
- [ ] Import FALLOUT 2D20 DATA - clothing mods.csv
- [ ] Import FALLOUT 2D20 DATA - power armor mods.csv
- [ ] Import FALLOUT 2D20 DATA - power armor plating.csv

**Consumables (3 files)**
- [ ] Import FALLOUT 2D20 DATA - beverages.csv
- [ ] Import FALLOUT 2D20 DATA - food.csv
- [ ] Import FALLOUT 2D20 DATA - chems.csv

**Ammunition (2 files)**
- [ ] Import FALLOUT 2D20 DATA - ammunition.csv
- [ ] Import FALLOUT 2D20 DATA - syringer ammo.csv

**Other (6 files)**
- [ ] Import FALLOUT 2D20 DATA - robot modules.csv
- [ ] Import FALLOUT 2D20 DATA - magazines.csv
- [ ] Import FALLOUT 2D20 DATA - magazines issues.csv
- [ ] Import FALLOUT 2D20 DATA - perks.csv
- [ ] Import FALLOUT 2D20 DATA - tools.csv
- [ ] Skip FALLOUT 2D20 DATA - tagskill.csv (reference only)

### Validation
- [ ] Verify master table counts (weapons, armor, consumables, mods, perks)
- [ ] Validate data integrity (all FKs resolve, no orphans)
- [ ] Test character creation flow
- [ ] Test derived stats calculations
- [ ] Test body location creation
- [ ] Test inventory management
- [ ] Test combat damage calculations
- [ ] Update application queries to use new structure
- [ ] Test session management
- [ ] Test NPC creation

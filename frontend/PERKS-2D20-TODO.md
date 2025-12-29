# Perks do Fallout 2d20 RPG - Lista Completa

## Status de Download

❌ **Problema**: A Fallout Wiki (Fandom) tem proteção anti-hotlinking que bloqueia downloads automáticos.

✅ **Solução Temporária**: Usando perks do Fallout 4 como placeholder visual.

## Download Manual dos Perks 2d20

Para baixar manualmente os 97 perks do sistema 2d20, acesse:

**URL**: https://fallout.fandom.com/wiki/Category:Fallout:_The_Roleplaying_Game_perk_images

### Método Recomendado:

1. Abra a URL acima no navegador
2. Clique com botão direito em cada imagem
3. "Salvar imagem como..."
4. Salve em: `public/assets/images/perks-2d20/`
5. Renomeie removendo o prefixo "2D20_" e usando snake_case

## Lista Completa de Perks 2d20 (97 total)

### A
- [ ] Action Boy/Girl
- [ ] Adamantium Skeleton
- [ ] Adrenaline Rush
- [ ] Animal Friend
- [ ] Aquaboy/Girl
- [ ] Armorer
- [ ] Awareness

### B
- [ ] Barbarian
- [ ] Better Criticals
- [ ] Big Leagues
- [ ] Blacksmith
- [ ] Blitz
- [ ] Bloody Mess
- [ ] Bodyguard

### C
- [ ] Cannibal
- [ ] Cap Collector
- [ ] Chem Resistant
- [ ] Chemist
- [ ] Commando
- [ ] Concentrated Fire
- [ ] Critical Banker

### D
- [ ] Demolition Expert
- [ ] Dogmeat's Friend
- [ ] Durable

### E
- [ ] Educated
- [ ] Entomologist

### F
- [ ] Fast Metabolism
- [ ] Finesse
- [ ] Fortune Finder
- [ ] Four Leaf Clover

### G
- [ ] Ghoulish
- [ ] Glob Trotter
- [ ] Gun Fu
- [ ] Gun Nut
- [ ] Gunslinger

### H
- [ ] Hacker
- [ ] Heavy Gunner
- [ ] Here and Now
- [ ] Healer

### I
- [ ] Idiot Savant
- [ ] Infiltrator
- [ ] Inspirational
- [ ] Intense Training
- [ ] Intimidation
- [ ] Iron Fist

### L
- [ ] Lady Killer / Black Widow
- [ ] Lead Belly
- [ ] Life Giver
- [ ] Light Step
- [ ] Local Leader
- [ ] Locksmith
- [ ] Lone Wanderer

### M
- [ ] Medic
- [ ] Mister Sandman
- [ ] Moving Target
- [ ] Mysterious Stranger
- [ ] Mister Sandman

### N
- [ ] Nerd Rage
- [ ] Night Person
- [ ] Ninja
- [ ] Nuclear Physicist

### P
- [ ] Pain Train
- [ ] Party Boy/Girl
- [ ] Penetrator
- [ ] Pickpocket
- [ ] Pyromaniac

### Q
- [ ] Quick Hands
- [ ] Quick Draw

### R
- [ ] Rad Resistant
- [ ] Refractor
- [ ] Ricochet
- [ ] Rifleman
- [ ] Robotics Expert
- [ ] Rooted

### S
- [ ] Science!
- [ ] Scrapper
- [ ] Scrounger
- [ ]Sen

sory Deprivation
- [ ] Sharpshooter
- [ ] Sneak
- [ ] Sniper
- [ ] Solar Powered
- [ ] Spray n' Pray
- [ ] Steady Aim
- [ ] Stealth
- [ ] Strong Back

### T
- [ ] Tag!
- [ ] Toughness
- [ ] Tracker

### V
- [ ] V.A.N.S
- [ ] Wasteland Whisperer

## Perks Disponíveis Atualmente (Fallout 4)

✅ **Já baixados** em `public/assets/images/vault-boy/`:
- Cannibal (35KB)
- Chemist (47KB)
- Fortune Finder (30KB)
- Heavy Gunner (38KB)
- Idiot Savant (27KB)
- Nerd Rage (28KB)

## Alternativas para Download

### Opção 1: Nexus Mods (Recomendado)
- **DEF_UI Icon Pack**: https://www.nexusmods.com/fallout4/mods/10654
- Contém ícones em alta resolução
- Requer cadastro gratuito no Nexus

### Opção 2: Extração do Jogo
Se você possui Fallout 4:
1. Baixe **BSA Browser**: https://www.nexusmods.com/fallout4/mods/17061
2. Extraia de: `Fallout4 - Textures9.ba2`
3. Caminho interno: `Interface/Pipboy/`

### Opção 3: GitHub Repositories
- **CosX React Pip-Boy**: https://github.com/CosX/React-pip-boy
- Pode conter alguns ícones prontos

## Implementação Futura

Quando os perks forem baixados, adicione em:

```typescript
// src/data/perks-2d20.ts
export const PERKS_2D20 = [
  {
    id: 'action_boy',
    name: 'Action Boy/Girl',
    description: 'Action Points regenerate faster.',
    requirement: 'Agility 5',
    ranks: 2,
    image: '/assets/images/perks-2d20/action_boy.png'
  },
  // ... resto dos perks
];
```

## Nota Importante

Os perks do **Fallout 2d20 RPG** são diferentes dos perks do video game. O sistema 2d20 usa:
- **Escala SPECIAL 4-10** (não 1-10)
- **Requisitos diferentes**
- **Mecânicas adaptadas para tabletop**

Consulte sempre o livro oficial "Fallout: The Roleplaying Game" da Modiphius Entertainment.

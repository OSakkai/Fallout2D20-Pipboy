# 📥 Como Baixar Imagens dos Perks Fallout 2d20

Criamos **2 scripts Python** para baixar automaticamente as imagens dos perks:

---

## 🚀 Método 1: Script API (Mais Rápido)

### Instalação
```bash
# Nenhuma dependência extra necessária (usa apenas requests)
pip install requests
```

### Uso
```bash
cd frontend
python download_perks_2d20.py
```

### Características
✅ Usa API oficial da Fandom
✅ Mais rápido
✅ Sem dependências pesadas
⚠️ Pode ser bloqueado por proteções anti-bot

---

## 🌐 Método 2: Script Selenium (Mais Robusto)

### Instalação
```bash
# Instalar dependências
pip install selenium webdriver-manager requests

# Ou instalar ChromeDriver manualmente:
# Windows: https://chromedriver.chromium.org/downloads
# Linux: sudo apt install chromium-chromedriver
# Mac: brew install chromedriver
```

### Uso
```bash
cd frontend
python download_perks_selenium.py
```

### Características
✅ Usa navegador automatizado (contorna proteções)
✅ Mais confiável
✅ Extrai imagens em alta resolução
⚠️ Requer ChromeDriver instalado
⚠️ Mais lento

---

## 📂 Resultado

Ambos os scripts baixam as imagens para:
```
frontend/public/assets/images/perks-2d20/
```

Nomes dos arquivos:
- `action_boy.png`
- `adamantium_skeleton.png`
- `bloody_mess.png`
- etc. (97 perks no total)

---

## 🔧 Solução de Problemas

### Erro: "ChromeDriver not found"
```bash
# Opção 1: Usar webdriver-manager (automático)
pip install webdriver-manager

# Opção 2: Download manual
# https://chromedriver.chromium.org/downloads
# Coloque chromedriver.exe no PATH do sistema
```

### Erro: "Connection refused" ou "403 Forbidden"
- A Fandom tem proteção anti-bot
- Use o **Método 2 (Selenium)** que simula navegador real
- Adicione delays entre downloads (já incluído nos scripts)

### Script não encontra imagens
- Verifique sua conexão com internet
- Tente novamente (pode ser erro temporário da Fandom)
- Como último recurso: download manual da categoria
  - URL: https://fallout.fandom.com/wiki/Category:Fallout:_The_Roleplaying_Game_perk_images
  - Clique direito → Salvar imagem

---

## 📋 Lista de Perks (97 total)

<details>
<summary>Ver lista completa</summary>

### A (7)
- Action Boy/Girl
- Adamantium Skeleton
- Adrenaline Rush
- Animal Friend
- Aquaboy/Girl
- Armorer
- Awareness

### B (7)
- Barbarian
- Better Criticals
- Big Leagues
- Blacksmith
- Blitz
- Bloody Mess
- Bodyguard

### C (7)
- Cannibal
- Cap Collector
- Chem Resistant
- Chemist
- Commando
- Concentrated Fire
- Critical Banker

### D (3)
- Demolition Expert
- Dogmeat's Friend
- Durable

### E (2)
- Educated
- Entomologist

### F (4)
- Fast Metabolism
- Finesse
- Fortune Finder
- Four Leaf Clover

### G (5)
- Ghoulish
- Globe Trotter
- Gun Fu
- Gun Nut
- Gunslinger

### H (4)
- Hacker
- Heavy Gunner
- Here and Now
- Healer

### I (6)
- Idiot Savant
- Infiltrator
- Inspirational
- Intense Training
- Intimidation
- Iron Fist

### L (7)
- Lady Killer / Black Widow
- Lead Belly
- Life Giver
- Light Step
- Local Leader
- Locksmith
- Lone Wanderer

### M (4)
- Medic
- Mister Sandman
- Moving Target
- Mysterious Stranger

### N (4)
- Nerd Rage
- Night Person
- Ninja
- Nuclear Physicist

### P (6)
- Pain Train
- Party Boy/Girl
- Penetrator
- Pickpocket
- Pyromaniac

### Q (2)
- Quick Hands
- Quick Draw

### R (6)
- Rad Resistant
- Refractor
- Ricochet
- Rifleman
- Robotics Expert
- Rooted

### S (13)
- Science!
- Scrapper
- Scrounger
- Sensory Deprivation
- Sharpshooter
- Sneak
- Sniper
- Solar Powered
- Spray n' Pray
- Steady Aim
- Stealth
- Strong Back

### T (3)
- Tag!
- Toughness
- Tracker

### V-W (2)
- V.A.N.S
- Wasteland Whisperer

</details>

---

## 🎨 Após o Download

As imagens estarão prontas para uso no componente de Perks:

```typescript
// src/data/perks-2d20.ts
export const PERKS_2D20 = [
  {
    id: 'action_boy',
    name: 'Action Boy/Girl',
    description: 'Your Action Points regenerate faster.',
    requirement: 'Agility 5',
    ranks: 2,
    image: '/assets/images/perks-2d20/action_boy.png'
  },
  // ... resto dos 97 perks
];
```

---

## 📄 Licença

As imagens dos perks são propriedade da **Modiphius Entertainment** (Fallout 2d20 RPG) e **Bethesda Softworks** (Fallout).

Este script é apenas para uso pessoal e educacional.

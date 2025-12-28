# Status dos Assets do Pip-Boy

## ✅ ASSETS BAIXADOS COM SUCESSO

### Vault Boy GIFs SPECIAL (7/7) - 100%
Localização: `public/assets/images/vault-boy/`

- ✅ `strength.gif` (304KB) - Funcionando
- ✅ `perception.gif` (235KB) - Funcionando
- ✅ `endurance.gif` (73KB) - Funcionando
- ✅ `charisma.gif` (221KB) - Funcionando
- ✅ `intelligence.gif` (173KB) - Funcionando
- ✅ `agility.gif` (88KB) - Funcionando
- ✅ `luck.gif` (222KB) - Funcionando

**Total**: 1.3MB
**Status**: ✅ INTEGRADO NO StatTab.tsx
**Visual**: Verde monocromático com filtro autêntico aplicado

### Perks 2d20 (3/97) - 3%
Localização: `public/assets/images/perks/`

- ✅ `action_boy.png` (19KB)
- ✅ `adamantium_skeleton.png` (80KB)
- ✅ `adrenaline_rush.png` (33KB)

**Total**: 132KB
**Status**: ⏳ Aguardando download manual dos 94 perks restantes

### Fontes
Localização: `public/assets/fonts/`

- ✅ `monofonto.ttf` (193KB) - Baixada mas usando CDN

### Outros Assets
Localização: `public/assets/images/`

- ✅ `pip-boy_overlay.png` (560KB) - Overlay do dispositivo físico
- ✅ `vault_boy_walking.gif` (176KB) - Animação de caminhada

## ❌ BLOQUEIO DA FALLOUT WIKI

### Problema Técnico

A Fallout Wiki (Fandom) implementa **proteção anti-hotlinking robusta**:

1. **User-Agent checking**: Bloqueia requests automáticos
2. **Referer validation**: Requer headers específicos
3. **Rate limiting**: Limita downloads em massa
4. **IP fingerprinting**: Detecta padrões de download
5. **Session tokens**: URLs exigem tokens temporários

### Tentativas Realizadas

- ❌ cURL direto das URLs estáticas
- ❌ cURL com User-Agent personalizado
- ❌ cURL com headers de Referer
- ❌ Download com parâmetros de escala
- ❌ Múltiplas tentativas com delay

**Resultado**: Apenas 3% dos perks (3/97) foram baixados com sucesso

## 📋 PRÓXIMOS PASSOS

### Opção 1: Download Manual (RECOMENDADO)

**Passo a passo**:

1. Acesse: https://fallout.fandom.com/wiki/Category:Fallout:_The_Roleplaying_Game_perk_images

2. Para cada perk:
   - Clique na imagem
   - Na página do arquivo, clique com botão direito em "Original file" ou na imagem de preview
   - "Salvar imagem como..."
   - Salve em: `public/assets/images/perks/`
   - Renomeie para snake_case (ex: `2D20_Action_Boy.png` → `action_boy.png`)

3. Total a baixar: **94 perks restantes**

### Opção 2: Nexus Mods

**Link**: https://www.nexusmods.com/fallout4/mods/10654

**Vantagens**:
- Ícones em alta resolução
- Pack completo organizado
- Legalmente distribuído

**Desvantagens**:
- Requer cadastro gratuito
- Download via Nexus Mod Manager
- Pode incluir assets extras não necessários

### Opção 3: Extração do Jogo

**Se você possui Fallout 4**:

1. Baixe **BSA Browser**: https://www.nexusmods.com/fallout4/mods/17061

2. Extraia de: `Fallout4 - Textures9.ba2`

3. Caminho interno: `Interface/Pipboy/VATS/`

4. Converta para PNG se necessário

## 📊 ESTATÍSTICAS

```
TOTAL DE ASSETS NECESSÁRIOS: 104 arquivos
├── Vault Boy SPECIAL: 7/7 (100%) ✅
├── Perks 2d20: 3/97 (3%) ⏳
├── Fontes: 1/1 (100%) ✅
└── Extras: 2/2 (100%) ✅

PROGRESSO GERAL: 13/107 (12%)
```

## 🎯 ASSETS EM USO

### Atualmente Implementados

1. **StatTab → SPECIAL GIFs**
   - Localização: `src/components/Tabs/StatTab.tsx:162-204`
   - Status: ✅ Funcionando perfeitamente
   - Visual: Animados com filtro verde monocromático

### Prontos para Implementação

1. **Pip-Boy Overlay**
   - Arquivo: `public/assets/images/pip-boy_overlay.png`
   - Uso sugerido: Decoração na PipBoyPhysicalFrame

2. **Vault Boy Walking**
   - Arquivo: `public/assets/images/vault_boy_walking.gif`
   - Uso sugerido: Loading state ou animação de transição

3. **Monofonto Local**
   - Arquivo: `public/assets/fonts/monofonto.ttf`
   - Uso: Fallback se CDN falhar

## 🔧 COMO USAR OS PERKS QUANDO BAIXADOS

### 1. Criar arquivo de configuração

```typescript
// src/data/perks-2d20.ts
export interface Perk {
  id: string;
  name: string;
  description: string;
  requirement: string;
  ranks: number;
  image: string;
}

export const PERKS_2D20: Perk[] = [
  {
    id: 'action_boy',
    name: 'Action Boy/Girl',
    description: 'Action Points regenerate faster.',
    requirement: 'Agility 5',
    ranks: 2,
    image: '/assets/images/perks/action_boy.png'
  },
  // ... resto dos perks
];
```

### 2. Implementar tab de Perks

```typescript
// src/components/Tabs/PerksTab.tsx
import { PERKS_2D20 } from '../../data/perks-2d20';

export const PerksTab = () => {
  const [selectedPerk, setSelectedPerk] = useState(PERKS_2D20[0]);

  return (
    <PerkGrid>
      {PERKS_2D20.map(perk => (
        <PerkCard key={perk.id} onClick={() => setSelectedPerk(perk)}>
          <PerkImage src={perk.image} alt={perk.name} />
          <PerkName>{perk.name}</PerkName>
        </PerkCard>
      ))}
    </PerkGrid>
  );
};
```

## 📝 NOTAS IMPORTANTES

### Diferenças 2d20 vs Video Game

O sistema **Fallout 2d20 RPG** tem mecânicas diferentes:

- **SPECIAL**: Escala 4-10 (não 1-10)
- **Skills**: 17 skills específicos do tabletop
- **Perks**: Requisitos e efeitos adaptados
- **Combat Dice**: Sistema próprio de d20

**Sempre consulte**: "Fallout: The Roleplaying Game" - Modiphius Entertainment

### Licença dos Assets

- **Vault Boy GIFs**: Propriedade da Bethesda, uso educacional/pessoal
- **Perks 2d20**: Propriedade da Modiphius + Bethesda
- **Monofonto**: Typodermic Fonts (uso gratuito)

**Nota Legal**: Este projeto é fan-made e não comercial. Todos os direitos pertencem aos respectivos proprietários.

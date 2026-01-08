import styled from 'styled-components';
import { PIPBOY_COLORS, PIPBOY_TEXT_GLOW, PIPBOY_TYPOGRAPHY } from '../../../styles/pipboy-colors';
import { useCharacter } from '../../../contexts/CharacterContext';

const EffectsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
  height: 100%;
  overflow-y: auto;
  padding-right: 10px;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(18, 255, 21, 0.1);
  }

  &::-webkit-scrollbar-thumb {
    background: ${PIPBOY_COLORS.primary};
    border-radius: 4px;
  }
`;

const EffectRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  padding: 12px 15px;
  border-bottom: 1px solid ${PIPBOY_COLORS.primary};
  font-family: ${PIPBOY_TYPOGRAPHY.fontFamily};
  font-size: 14px;

  &:last-child {
    border-bottom: none;
  }
`;

const EffectName = styled.div`
  font-weight: bold;
  text-shadow: ${PIPBOY_TEXT_GLOW.subtle};
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const EffectType = styled.span`
  font-size: 10px;
  opacity: 0.6;
  font-weight: normal;
`;

const EffectMods = styled.div`
  text-align: right;
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-size: 13px;
`;

const ModText = styled.span<{ $positive?: boolean }>`
  color: ${props => props.$positive ? '#00ff00' : props.$positive === false ? '#ff4444' : PIPBOY_COLORS.primary};
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  opacity: 0.5;
  text-align: center;
  gap: 10px;
  font-family: ${PIPBOY_TYPOGRAPHY.fontFamily};
`;

interface ActiveEffect {
  id: string;
  effectType: 'CHEM' | 'INJURY' | 'PERK' | 'EQUIPMENT' | 'ENVIRONMENTAL' | 'OTHER';
  name: string;
  description?: string;
  attributeMods?: Record<string, number>;
  skillMods?: Record<string, number>;
  drMods?: Record<string, number>;
  duration?: number;
  startedAt: string;
  expiresAt?: string;
  addictionRating?: number;
}

const formatModifiers = (effect: ActiveEffect): string[] => {
  const mods: string[] = [];

  // Attribute mods
  if (effect.attributeMods) {
    Object.entries(effect.attributeMods).forEach(([attr, value]) => {
      const sign = value > 0 ? '+' : '';
      mods.push(`${sign}${value} ${attr.toUpperCase().slice(0, 3)}`);
    });
  }

  // Skill mods
  if (effect.skillMods) {
    Object.entries(effect.skillMods).forEach(([skill, value]) => {
      const sign = value > 0 ? '+' : '';
      mods.push(`${sign}${value} ${skill}`);
    });
  }

  // DR mods
  if (effect.drMods) {
    Object.entries(effect.drMods).forEach(([type, value]) => {
      const sign = value > 0 ? '+' : '';
      mods.push(`${sign}${value} ${type} DR`);
    });
  }

  return mods.length > 0 ? mods : ['No modifiers'];
};

const isPositiveMod = (modText: string): boolean | undefined => {
  if (modText.startsWith('+')) return true;
  if (modText.startsWith('-')) return false;
  return undefined;
};

export const EffectsCategory = () => {
  const { character } = useCharacter();

  if (!character) {
    return <EmptyState>LOADING...</EmptyState>;
  }

  const effects = character.activeEffects || [];

  if (effects.length === 0) {
    return (
      <EmptyState>
        <div style={{ fontSize: '40px' }}>⚗️</div>
        <div>NO ACTIVE EFFECTS</div>
        <div style={{ fontSize: '12px', opacity: 0.6 }}>
          Effects from chems, injuries, perks, and equipment will appear here
        </div>
      </EmptyState>
    );
  }

  return (
    <EffectsContainer>
      {effects.map((effect) => {
        const modifiers = formatModifiers(effect);

        return (
          <EffectRow key={effect.id}>
            <EffectName>
              {effect.name}
              <EffectType>{effect.effectType}</EffectType>
            </EffectName>
            <EffectMods>
              {modifiers.map((mod, idx) => (
                <ModText key={idx} $positive={isPositiveMod(mod)}>
                  {mod}
                </ModText>
              ))}
            </EffectMods>
          </EffectRow>
        );
      })}
    </EffectsContainer>
  );
};

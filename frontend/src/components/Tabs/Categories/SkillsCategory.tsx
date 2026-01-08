import { useState } from 'react';
import styled from 'styled-components';
import { PIPBOY_COLORS, PIPBOY_TEXT_GLOW, PIPBOY_TYPOGRAPHY } from '../../../styles/pipboy-colors';
import { useCharacter } from '../../../contexts/CharacterContext';

const SkillsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  height: 100%;
  overflow: hidden;
`;

const SkillsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
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

const SkillRow = styled.div<{ $active?: boolean; $tagged?: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 12px;
  border-bottom: 1px solid ${PIPBOY_COLORS.primary};
  cursor: pointer;
  font-family: ${PIPBOY_TYPOGRAPHY.fontFamily};
  font-size: 14px;
  background: ${props => props.$active ? 'rgba(18, 255, 21, 0.15)' : 'transparent'};
  border-left: ${props => props.$tagged ? `3px solid ${PIPBOY_COLORS.accent}` : '3px solid transparent'};
  transition: background 0.2s;

  &:hover {
    background: rgba(18, 255, 21, 0.1);
  }

  &:last-child {
    border-bottom: none;
  }
`;

const SkillName = styled.div`
  font-weight: bold;
  text-shadow: ${PIPBOY_TEXT_GLOW.subtle};
  display: flex;
  align-items: center;
  gap: 8px;
`;

const TaggedIcon = styled.span`
  color: ${PIPBOY_COLORS.accent};
  font-size: 12px;
`;

const SkillValue = styled.div`
  font-size: 16px;
  font-weight: bold;
  text-shadow: ${PIPBOY_TEXT_GLOW.strong};
`;

const SkillDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 20px;
  border: 1px solid ${PIPBOY_COLORS.primary};
  background: rgba(18, 255, 21, 0.05);
  overflow-y: auto;

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

const SkillImage = styled.div`
  width: 100%;
  height: 200px;
  background: rgba(18, 255, 21, 0.1);
  border: 1px solid ${PIPBOY_COLORS.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 60px;
  flex-shrink: 0;
`;

const SkillTitle = styled.h3`
  margin: 0;
  font-family: ${PIPBOY_TYPOGRAPHY.fontFamily};
  font-size: 20px;
  text-shadow: ${PIPBOY_TEXT_GLOW.strong};
  color: ${PIPBOY_COLORS.primary};
`;

const SkillDescription = styled.div`
  font-family: ${PIPBOY_TYPOGRAPHY.fontFamily};
  font-size: 13px;
  line-height: 1.6;
  opacity: 0.9;
`;

const SkillBreakdown = styled.div`
  font-family: ${PIPBOY_TYPOGRAPHY.fontFamily};
  font-size: 14px;
  padding: 10px;
  background: rgba(18, 255, 21, 0.1);
  border-left: 3px solid ${PIPBOY_COLORS.primary};
`;

const EmptyState = styled.div`
  grid-column: 1 / -1;
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

// Mapping of skills to their governing SPECIAL attributes
const SKILL_ATTRIBUTES: Record<string, keyof CharacterAttributes> = {
  ATHLETICS: 'strength',
  BIG_GUNS: 'strength',
  MELEE_WEAPONS: 'strength',
  THROWING: 'strength',
  UNARMED: 'strength',
  ENERGY_WEAPONS: 'perception',
  EXPLOSIVES: 'perception',
  LOCKPICK: 'perception',
  SMALL_GUNS: 'perception',
  SNEAK: 'agility',
  PILOT: 'agility',
  BARTER: 'charisma',
  SPEECH: 'charisma',
  MEDICINE: 'intelligence',
  REPAIR: 'intelligence',
  SCIENCE: 'intelligence',
  SURVIVAL: 'endurance',
};

// Skill descriptions
const SKILL_DESCRIPTIONS: Record<string, string> = {
  ATHLETICS: 'Physical prowess including climbing, jumping, swimming, and other feats of strength and endurance.',
  BIG_GUNS: 'Proficiency with heavy weapons like miniguns, rocket launchers, and flamers.',
  MELEE_WEAPONS: 'Skill with close-combat weapons such as knives, sledgehammers, and super sledges.',
  THROWING: 'Accuracy and effectiveness when throwing grenades and other projectiles.',
  UNARMED: 'Combat effectiveness when fighting without weapons, including hand-to-hand and martial arts.',
  ENERGY_WEAPONS: 'Proficiency with laser rifles, plasma weapons, and other energy-based armaments.',
  EXPLOSIVES: 'Knowledge of setting, disarming, and using explosive devices safely and effectively.',
  LOCKPICK: 'Ability to pick locks and bypass physical security mechanisms.',
  SMALL_GUNS: 'Proficiency with pistols, rifles, and other conventional firearms.',
  SNEAK: 'Ability to move silently and remain undetected.',
  PILOT: 'Skill in operating vehicles and aircraft in the wasteland.',
  BARTER: 'Negotiating better prices when buying and selling goods.',
  SPEECH: 'Persuasion, deception, and other verbal skills to influence others.',
  MEDICINE: 'Knowledge of healing, treating injuries, and using medical supplies.',
  REPAIR: 'Ability to fix and maintain weapons, armor, and other equipment.',
  SCIENCE: 'Understanding of computers, robotics, and advanced technology.',
  SURVIVAL: 'Knowledge of wasteland survival including tracking, foraging, and environmental awareness.',
};

// Skill icons (emojis as placeholders)
const SKILL_ICONS: Record<string, string> = {
  ATHLETICS: '🏃',
  BIG_GUNS: '🚀',
  MELEE_WEAPONS: '⚔️',
  THROWING: '💣',
  UNARMED: '👊',
  ENERGY_WEAPONS: '⚡',
  EXPLOSIVES: '💥',
  LOCKPICK: '🔓',
  SMALL_GUNS: '🔫',
  SNEAK: '👤',
  PILOT: '🚁',
  BARTER: '💰',
  SPEECH: '💬',
  MEDICINE: '⚕️',
  REPAIR: '🔧',
  SCIENCE: '🔬',
  SURVIVAL: '🌿',
};

interface CharacterAttributes {
  strength: number;
  perception: number;
  endurance: number;
  charisma: number;
  intelligence: number;
  agility: number;
  luck: number;
}

const formatSkillName = (skill: string): string => {
  return skill
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

export const SkillsCategory = () => {
  const { character } = useCharacter();
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);

  if (!character) {
    return <EmptyState>LOADING...</EmptyState>;
  }

  // Create a complete list of all 17 skills
  const allSkills = Object.keys(SKILL_ATTRIBUTES).sort();

  // Create a map of character's skills
  const skillsMap = new Map(
    character.skills.map(s => [s.skill.toUpperCase(), s])
  );

  // Calculate total for a skill
  const calculateSkillTotal = (skillName: string) => {
    const attributeKey = SKILL_ATTRIBUTES[skillName];
    const specialValue = character.attributes[attributeKey] || 0;
    const skillData = skillsMap.get(skillName);
    const rank = skillData?.rank || 0;
    return specialValue + rank;
  };

  const currentSkill = selectedSkill || allSkills[0];
  const currentSkillData = skillsMap.get(currentSkill);
  const attributeKey = SKILL_ATTRIBUTES[currentSkill];
  const specialValue = character.attributes[attributeKey] || 0;
  const rank = currentSkillData?.rank || 0;
  const total = calculateSkillTotal(currentSkill);
  const isTagged = currentSkillData?.isTagged || false;

  return (
    <SkillsContainer>
      <SkillsList>
        {allSkills.map((skill) => {
          const skillData = skillsMap.get(skill);
          const skillTotal = calculateSkillTotal(skill);
          const skillTagged = skillData?.isTagged || false;

          return (
            <SkillRow
              key={skill}
              $active={skill === currentSkill}
              $tagged={skillTagged}
              onClick={() => setSelectedSkill(skill)}
            >
              <SkillName>
                {skillTagged && <TaggedIcon>★</TaggedIcon>}
                {formatSkillName(skill)}
              </SkillName>
              <SkillValue>{skillTotal}</SkillValue>
            </SkillRow>
          );
        })}
      </SkillsList>

      <SkillDetails>
        <SkillImage>{SKILL_ICONS[currentSkill] || '❓'}</SkillImage>

        <SkillTitle>
          {formatSkillName(currentSkill)}
          {isTagged && <TaggedIcon style={{ marginLeft: '8px' }}>★ TAGGED</TaggedIcon>}
        </SkillTitle>

        <SkillBreakdown>
          <strong>Total: {total}</strong>
          <div style={{ fontSize: '12px', marginTop: '5px', opacity: 0.8 }}>
            {formatSkillName(attributeKey)}: {specialValue} + Rank: {rank}
          </div>
        </SkillBreakdown>

        <SkillDescription>
          {SKILL_DESCRIPTIONS[currentSkill] || 'No description available.'}
        </SkillDescription>
      </SkillDetails>
    </SkillsContainer>
  );
};

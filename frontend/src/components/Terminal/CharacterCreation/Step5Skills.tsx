import styled from 'styled-components';
import { PIPBOY_COLORS } from '../../../styles/pipboy-colors';
import type { Skill, Origin, SPECIALAttributes } from '../../../types/character';
import { SKILLS } from '../../../data/skills';
import { getSuggestedTagSkills } from '../../../data/origins';
import type { PipBoySoundType } from '../../../hooks/usePipBoySound';

interface Step5SkillsProps {
  tagSkills: Skill[];
  setTagSkills: (skills: Skill[]) => void;
  skillRanks: Partial<Record<Skill, number>>;
  setSkillRanks: (ranks: Partial<Record<Skill, number>>) => void;
  selectedOrigin: Origin | null;
  special: SPECIALAttributes;
  playSound: (sound: PipBoySoundType, volume?: number) => void;
}

export const Step5Skills: React.FC<Step5SkillsProps> = ({
  tagSkills,
  setTagSkills,
  selectedOrigin,
  playSound,
}) => {
  const suggestedSkills = selectedOrigin ? getSuggestedTagSkills(selectedOrigin) : [];

  const toggleTagSkill = (skill: Skill) => {
    if (tagSkills.includes(skill)) {
      setTagSkills(tagSkills.filter(s => s !== skill));
    } else if (tagSkills.length < 3) {
      setTagSkills([...tagSkills, skill]);
      playSound('beep', 0.4);
    }
  };

  return (
    <Container>
      <SectionTitle>&gt; TAG SKILLS</SectionTitle>
      <Description>
        Select 3 tag skills. Tagged skills have improved success rates and will be your character's specialties.
      </Description>

      <PointsDisplay>
        <span>SELECTED:</span>
        <span>{tagSkills.length} / 3</span>
      </PointsDisplay>

      {suggestedSkills.length > 0 && (
        <Suggested>
          <span>💡 SUGGESTED:</span>
          {suggestedSkills.map(skill => (
            <SuggestedButton
              key={skill}
              onClick={() => toggleTagSkill(skill)}
              selected={tagSkills.includes(skill)}
            >
              {SKILLS.find(s => s.id === skill)?.name}
            </SuggestedButton>
          ))}
        </Suggested>
      )}

      <SkillsGrid>
        {SKILLS.map(skill => (
          <SkillCard
            key={skill.id}
            selected={tagSkills.includes(skill.id as Skill)}
            onClick={() => toggleTagSkill(skill.id as Skill)}
            disabled={!tagSkills.includes(skill.id as Skill) && tagSkills.length >= 3}
          >
            <SkillHeader>
              <Checkbox checked={tagSkills.includes(skill.id as Skill)}>
                {tagSkills.includes(skill.id as Skill) && '✓'}
              </Checkbox>
              <SkillName>{skill.name}</SkillName>
            </SkillHeader>
            <SkillAttribute>[{skill.attribute.slice(0, 3).toUpperCase()}]</SkillAttribute>
            <SkillDesc>{skill.description}</SkillDesc>
          </SkillCard>
        ))}
      </SkillsGrid>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  letter-spacing: 0.1em;
  margin-bottom: 1rem;
  text-shadow: 0 0 10px ${PIPBOY_COLORS.primary}88;
`;

const Description = styled.p`
  font-size: 0.9rem;
  opacity: 0.8;
  margin-bottom: 2rem;
  line-height: 1.5;
`;

const PointsDisplay = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 1rem;
  background: ${PIPBOY_COLORS.primary}11;
  border: 2px solid ${PIPBOY_COLORS.primary};
  margin-bottom: 1rem;
  font-size: 1rem;
`;

const Suggested = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
  padding: 1rem;
  background: ${PIPBOY_COLORS.success}08;
  border: 1px solid ${PIPBOY_COLORS.success}44;
  margin-bottom: 1rem;
  font-size: 0.85rem;
`;

const SuggestedButton = styled.button<{ selected: boolean }>`
  padding: 0.4rem 0.8rem;
  background: ${props => props.selected ? PIPBOY_COLORS.success : 'transparent'};
  border: 1px solid ${PIPBOY_COLORS.success};
  color: ${PIPBOY_COLORS.success};
  font-size: 0.75rem;
  cursor: pointer;
  &:hover { background: ${PIPBOY_COLORS.success}22; }
`;

const SkillsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 0.75rem;
`;

const SkillCard = styled.div<{ selected: boolean; disabled: boolean }>`
  padding: 0.75rem;
  background: ${props => props.selected ? `${PIPBOY_COLORS.primary}11` : `${PIPBOY_COLORS.primary}05`};
  border: 1px solid ${props => props.selected ? PIPBOY_COLORS.primary : `${PIPBOY_COLORS.primary}33`};
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.disabled ? 0.5 : 1};
  &:hover { border-color: ${props => !props.disabled && PIPBOY_COLORS.primary}; }
`;

const SkillHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
`;

const Checkbox = styled.div<{ checked: boolean }>`
  width: 20px;
  height: 20px;
  border: 1px solid ${PIPBOY_COLORS.primary};
  background: ${props => props.checked ? PIPBOY_COLORS.primary : 'transparent'};
  color: #000;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
`;

const SkillName = styled.div`
  font-size: 0.9rem;
  font-weight: bold;
`;

const SkillAttribute = styled.div`
  font-size: 0.7rem;
  opacity: 0.6;
  margin-bottom: 0.5rem;
`;

const SkillDesc = styled.div`
  font-size: 0.75rem;
  opacity: 0.8;
  line-height: 1.3;
`;

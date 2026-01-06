import styled from 'styled-components';
import { PIPBOY_COLORS } from '../../../styles/pipboy-colors';
import type { Origin, Skill, SPECIALAttributes } from '../../../types/character';
import { ORIGINS } from '../../../data/origins';
import { SKILLS } from '../../../data/skills';

interface Step6ReviewProps {
  characterName: string;
  selectedOrigin: Origin | null;
  special: SPECIALAttributes;
  tagSkills: Skill[];
  skillRanks: Partial<Record<Skill, number>>;
  calculateStats: () => {
    finalSpecial: SPECIALAttributes;
    maxHP: number;
    defense: number;
    initiative: number;
    meleeDamage: number;
  };
}

export const Step6Review: React.FC<Step6ReviewProps> = ({
  characterName,
  selectedOrigin,
  tagSkills,
  calculateStats,
}) => {
  const stats = calculateStats();

  return (
    <Container>
      <SectionTitle>&gt; CHARACTER REVIEW</SectionTitle>
      <Description>
        Review your character before finalizing. You won't be able to change these choices later.
      </Description>

      <ReviewGrid>
        <Section>
          <SectionHeader>IDENTITY</SectionHeader>
          <InfoRow>
            <Label>Name:</Label>
            <Value>{characterName}</Value>
          </InfoRow>
          <InfoRow>
            <Label>Origin:</Label>
            <Value>{selectedOrigin && ORIGINS[selectedOrigin].name}</Value>
          </InfoRow>
          <InfoRow>
            <Label>Level:</Label>
            <Value>1</Value>
          </InfoRow>
        </Section>

        <Section>
          <SectionHeader>S.P.E.C.I.A.L.</SectionHeader>
          {Object.entries(stats.finalSpecial).map(([key, value]) => (
            <InfoRow key={key}>
              <Label>{key.charAt(0).toUpperCase() + key.slice(1)}:</Label>
              <Value>{value}</Value>
            </InfoRow>
          ))}
        </Section>

        <Section>
          <SectionHeader>DERIVED STATS</SectionHeader>
          <InfoRow>
            <Label>Max HP:</Label>
            <Value>{stats.maxHP}</Value>
          </InfoRow>
          <InfoRow>
            <Label>Defense:</Label>
            <Value>{stats.defense}</Value>
          </InfoRow>
          <InfoRow>
            <Label>Initiative:</Label>
            <Value>{stats.initiative}</Value>
          </InfoRow>
          <InfoRow>
            <Label>Melee Damage:</Label>
            <Value>+{stats.meleeDamage}CD</Value>
          </InfoRow>
        </Section>

        <Section>
          <SectionHeader>TAG SKILLS</SectionHeader>
          {tagSkills.map(skill => (
            <SkillRow key={skill}>
              <SkillIcon>▸</SkillIcon>
              {SKILLS.find(s => s.id === skill)?.name}
            </SkillRow>
          ))}
        </Section>
      </ReviewGrid>

      <Warning>
        <WarningIcon>⚠</WarningIcon>
        <WarningText>
          Once you create this character, you cannot change the name, origin, or SPECIAL attributes.
        </WarningText>
      </Warning>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
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

const ReviewGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const Section = styled.div`
  padding: 1.5rem;
  background: ${PIPBOY_COLORS.primary}08;
  border: 1px solid ${PIPBOY_COLORS.primary}44;
`;

const SectionHeader = styled.h3`
  font-size: 1rem;
  letter-spacing: 0.1em;
  margin: 0 0 1rem 0;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid ${PIPBOY_COLORS.primary}33;
  text-shadow: 0 0 8px ${PIPBOY_COLORS.primary}88;
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  font-size: 0.9rem;
`;

const Label = styled.span`
  opacity: 0.8;
`;

const Value = styled.span`
  font-weight: bold;
  text-shadow: 0 0 5px ${PIPBOY_COLORS.primary}88;
`;

const SkillRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 0;
  font-size: 0.9rem;
`;

const SkillIcon = styled.span`
  color: ${PIPBOY_COLORS.success};
`;

const Warning = styled.div`
  display: flex;
  gap: 1rem;
  padding: 1.5rem;
  background: ${PIPBOY_COLORS.warning}11;
  border: 2px solid ${PIPBOY_COLORS.warning};
  border-radius: 4px;
`;

const WarningIcon = styled.div`
  font-size: 2rem;
  color: ${PIPBOY_COLORS.warning};
  flex-shrink: 0;
`;

const WarningText = styled.div`
  font-size: 0.9rem;
  line-height: 1.5;
  color: ${PIPBOY_COLORS.warning};
`;

import styled from 'styled-components';
import { PIPBOY_COLORS } from '../../../styles/pipboy-colors';
import { motion } from 'framer-motion';
import type { Origin } from '../../../types/character';
import { ORIGINS } from '../../../data/origins';
import type { PipBoySoundType } from '../../../hooks/usePipBoySound';

interface Step3OriginProps {
  selectedOrigin: Origin | null;
  setSelectedOrigin: (origin: Origin) => void;
  playSound: (sound: PipBoySoundType, volume?: number) => void;
}

export const Step3Origin: React.FC<Step3OriginProps> = ({
  selectedOrigin,
  setSelectedOrigin,
  playSound,
}) => {
  const handleSelectOrigin = (origin: Origin) => {
    setSelectedOrigin(origin);
    playSound('changeCategory', 0.4);
  };

  return (
    <Container>
      <SectionTitle>&gt; ORIGIN SELECTION</SectionTitle>
      <Description>
        Your origin defines who you were before the wasteland. Each origin provides unique SPECIAL modifiers.
      </Description>

      <OriginsGrid>
        {Object.values(ORIGINS).map((origin) => (
          <OriginCard
            key={origin.id}
            selected={selectedOrigin === origin.id}
            onClick={() => handleSelectOrigin(origin.id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <OriginName>{origin.name}</OriginName>
            <OriginDescription>{origin.description}</OriginDescription>

            <ModifiersSection>
              <ModifiersTitle>SPECIAL MODIFIERS:</ModifiersTitle>
              {Object.entries(origin.specialModifiers).map(([key, value]) => (
                <Modifier key={key} positive={value! > 0}>
                  {key.toUpperCase()}: {value! > 0 ? '+' : ''}{value}
                </Modifier>
              ))}
            </ModifiersSection>

            <FlavorText>{origin.flavorText}</FlavorText>
          </OriginCard>
        ))}
      </OriginsGrid>

      {selectedOrigin && (
        <SelectedInfo
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <InfoTitle>✓ SELECTED: {ORIGINS[selectedOrigin].name.toUpperCase()}</InfoTitle>
          <SuggestedSkills>
            <SkillsTitle>SUGGESTED TAG SKILLS:</SkillsTitle>
            <SkillsList>
              {ORIGINS[selectedOrigin].suggestedTagSkills.map(skill => (
                <SkillTag key={skill}>{skill.replace('_', ' ')}</SkillTag>
              ))}
            </SkillsList>
          </SuggestedSkills>
        </SelectedInfo>
      )}
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

const OriginsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const OriginCard = styled(motion.div)<{ selected: boolean }>`
  padding: 1.5rem;
  border: 2px solid ${props => props.selected ? PIPBOY_COLORS.primary : `${PIPBOY_COLORS.primary}44`};
  background: ${props => props.selected ? `${PIPBOY_COLORS.primary}11` : `${PIPBOY_COLORS.primary}05`};
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  transition: all 0.3s;

  &:hover {
    border-color: ${PIPBOY_COLORS.primary};
    background: ${PIPBOY_COLORS.primary}08;
  }
`;

const OriginName = styled.h3`
  font-size: 1.2rem;
  letter-spacing: 0.1em;
  margin: 0;
  text-shadow: 0 0 8px ${PIPBOY_COLORS.primary}88;
`;

const OriginDescription = styled.p`
  font-size: 0.85rem;
  opacity: 0.9;
  line-height: 1.4;
  margin: 0;
`;

const ModifiersSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding-top: 0.5rem;
  border-top: 1px solid ${PIPBOY_COLORS.primary}33;
`;

const ModifiersTitle = styled.div`
  font-size: 0.75rem;
  opacity: 0.7;
  letter-spacing: 0.05em;
`;

const Modifier = styled.div<{ positive: boolean }>`
  font-size: 0.9rem;
  color: ${props => props.positive ? PIPBOY_COLORS.success : PIPBOY_COLORS.danger};
  font-weight: bold;
`;

const FlavorText = styled.p`
  font-size: 0.75rem;
  opacity: 0.7;
  font-style: italic;
  line-height: 1.4;
  margin: 0;
  padding-top: 0.5rem;
  border-top: 1px solid ${PIPBOY_COLORS.primary}22;
`;

const SelectedInfo = styled(motion.div)`
  padding: 1.5rem;
  background: ${PIPBOY_COLORS.success}11;
  border: 2px solid ${PIPBOY_COLORS.success};
  border-radius: 4px;
`;

const InfoTitle = styled.div`
  font-size: 1rem;
  letter-spacing: 0.1em;
  color: ${PIPBOY_COLORS.success};
  margin-bottom: 1rem;
  text-shadow: 0 0 10px ${PIPBOY_COLORS.success}88;
`;

const SuggestedSkills = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const SkillsTitle = styled.div`
  font-size: 0.85rem;
  opacity: 0.9;
`;

const SkillsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const SkillTag = styled.div`
  padding: 0.4rem 0.8rem;
  background: ${PIPBOY_COLORS.primary}22;
  border: 1px solid ${PIPBOY_COLORS.primary};
  font-size: 0.75rem;
  letter-spacing: 0.05em;
`;

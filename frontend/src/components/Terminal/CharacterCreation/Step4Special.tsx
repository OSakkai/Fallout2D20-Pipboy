import { useEffect } from 'react';
import styled from 'styled-components';
import { PIPBOY_COLORS } from '../../../styles/pipboy-colors';
import { motion } from 'framer-motion';
import type { SPECIALAttributes, Origin } from '../../../types/character';
import { ORIGINS } from '../../../data/origins';
import type { PipBoySoundType } from '../../../hooks/usePipBoySound';

interface Step4SpecialProps {
  special: SPECIALAttributes;
  setSpecial: (special: SPECIALAttributes) => void;
  selectedOrigin: Origin | null;
  availablePoints: number;
  setAvailablePoints: (points: number) => void;
  playSound: (sound: PipBoySoundType, volume?: number) => void;
}

const TOTAL_POINTS = 10; // Extra points after base 4 in each attribute

export const Step4Special: React.FC<Step4SpecialProps> = ({
  special,
  setSpecial,
  selectedOrigin,
  availablePoints,
  setAvailablePoints,
  playSound,
}) => {
  // Initialize available points
  useEffect(() => {
    const spent = Object.values(special).reduce((sum, val) => sum + (val - 4), 0);
    setAvailablePoints(TOTAL_POINTS - spent);
  }, []);

  const modifyAttribute = (attr: keyof SPECIALAttributes, delta: number) => {
    const newValue = special[attr] + delta;
    const newSpent = Object.values({ ...special, [attr]: newValue }).reduce((sum, val) => sum + (val - 4), 0);

    if (newValue >= 4 && newValue <= 10 && newSpent <= TOTAL_POINTS) {
      setSpecial({ ...special, [attr]: newValue });
      setAvailablePoints(TOTAL_POINTS - newSpent);
      playSound('beep', 0.3);
    }
  };

  const getFinalValue = (attr: keyof SPECIALAttributes): number => {
    const modifier = selectedOrigin ? (ORIGINS[selectedOrigin].specialModifiers[attr] || 0) : 0;
    return special[attr] + modifier;
  };

  const attributes: Array<{ key: keyof SPECIALAttributes; name: string; desc: string }> = [
    { key: 'strength', name: 'STRENGTH', desc: 'Physical power and carrying capacity' },
    { key: 'perception', name: 'PERCEPTION', desc: 'Awareness and accuracy' },
    { key: 'endurance', name: 'ENDURANCE', desc: 'Stamina and hit points' },
    { key: 'charisma', name: 'CHARISMA', desc: 'Social skills and bartering' },
    { key: 'intelligence', name: 'INTELLIGENCE', desc: 'Problem solving and skill points' },
    { key: 'agility', name: 'AGILITY', desc: 'Coordination and action points' },
    { key: 'luck', name: 'LUCK', desc: 'General fortune and critical chance' },
  ];

  return (
    <Container>
      <SectionTitle>&gt; S.P.E.C.I.A.L. ATTRIBUTES</SectionTitle>
      <Description>
        Distribute {TOTAL_POINTS} points across your attributes. Each starts at 4. Origin modifiers will be applied after.
      </Description>

      <PointsDisplay>
        <PointsLabel>AVAILABLE POINTS:</PointsLabel>
        <PointsValue>{availablePoints}</PointsValue>
      </PointsDisplay>

      <AttributesGrid>
        {attributes.map(({ key, name, desc }) => {
          const baseValue = special[key];
          const finalValue = getFinalValue(key);
          const modifier = finalValue - baseValue;

          return (
            <AttributeCard key={key}>
              <AttributeName>{name}</AttributeName>
              <AttributeDesc>{desc}</AttributeDesc>

              <AttributeControl>
                <ControlButton
                  onClick={() => modifyAttribute(key, -1)}
                  disabled={baseValue <= 4}
                  whileTap={{ scale: 0.9 }}
                >
                  -
                </ControlButton>

                <ValueDisplay>
                  <BaseValue>{baseValue}</BaseValue>
                  {modifier !== 0 && (
                    <ModifierValue positive={modifier > 0}>
                      ({modifier > 0 ? '+' : ''}{modifier}) = {finalValue}
                    </ModifierValue>
                  )}
                </ValueDisplay>

                <ControlButton
                  onClick={() => modifyAttribute(key, 1)}
                  disabled={baseValue >= 10 || availablePoints <= 0}
                  whileTap={{ scale: 0.9 }}
                >
                  +
                </ControlButton>
              </AttributeControl>

              <ProgressBar>
                <ProgressFill width={(finalValue / 10) * 100} />
              </ProgressBar>
            </AttributeCard>
          );
        })}
      </AttributesGrid>

      {selectedOrigin && (
        <OriginInfo>
          <InfoIcon>✓</InfoIcon>
          <InfoText>
            {ORIGINS[selectedOrigin].name} modifiers applied
          </InfoText>
        </OriginInfo>
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

const PointsDisplay = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: ${PIPBOY_COLORS.primary}11;
  border: 2px solid ${PIPBOY_COLORS.primary};
  margin-bottom: 2rem;
`;

const PointsLabel = styled.div`
  font-size: 1rem;
  letter-spacing: 0.1em;
`;

const PointsValue = styled.div`
  font-size: 2rem;
  font-weight: bold;
  text-shadow: 0 0 15px ${PIPBOY_COLORS.primary};
`;

const AttributesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const AttributeCard = styled.div`
  padding: 1rem;
  background: ${PIPBOY_COLORS.primary}05;
  border: 1px solid ${PIPBOY_COLORS.primary}33;
`;

const AttributeName = styled.h3`
  font-size: 1rem;
  letter-spacing: 0.1em;
  margin: 0 0 0.5rem 0;
  text-shadow: 0 0 8px ${PIPBOY_COLORS.primary}88;
`;

const AttributeDesc = styled.p`
  font-size: 0.75rem;
  opacity: 0.7;
  margin: 0 0 1rem 0;
  line-height: 1.3;
`;

const AttributeControl = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 0.75rem;
`;

const ControlButton = styled(motion.button)<{ disabled: boolean }>`
  width: 40px;
  height: 40px;
  background: ${props => props.disabled ? 'transparent' : `${PIPBOY_COLORS.primary}22`};
  border: 1px solid ${props => props.disabled ? `${PIPBOY_COLORS.primary}22` : PIPBOY_COLORS.primary};
  color: ${props => props.disabled ? `${PIPBOY_COLORS.primary}44` : PIPBOY_COLORS.primary};
  font-size: 1.5rem;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background: ${PIPBOY_COLORS.primary}33;
  }
`;

const ValueDisplay = styled.div`
  min-width: 120px;
  text-align: center;
`;

const BaseValue = styled.div`
  font-size: 2rem;
  font-weight: bold;
  line-height: 1;
`;

const ModifierValue = styled.div<{ positive: boolean }>`
  font-size: 0.85rem;
  color: ${props => props.positive ? PIPBOY_COLORS.success : PIPBOY_COLORS.danger};
  margin-top: 0.25rem;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 6px;
  background: ${PIPBOY_COLORS.primary}22;
  border: 1px solid ${PIPBOY_COLORS.primary}44;
`;

const ProgressFill = styled.div<{ width: number }>`
  width: ${props => props.width}%;
  height: 100%;
  background: ${PIPBOY_COLORS.primary};
  box-shadow: 0 0 8px ${PIPBOY_COLORS.primary};
  transition: width 0.3s;
`;

const OriginInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: ${PIPBOY_COLORS.success}11;
  border: 1px solid ${PIPBOY_COLORS.success}66;
`;

const InfoIcon = styled.div`
  font-size: 1.5rem;
  color: ${PIPBOY_COLORS.success};
`;

const InfoText = styled.div`
  font-size: 0.9rem;
  opacity: 0.9;
`;

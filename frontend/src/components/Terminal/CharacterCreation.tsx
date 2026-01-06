import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { PIPBOY_COLORS } from '../../styles/pipboy-colors';
import { CRTEffect } from '../Effects/CRTEffect';
import { usePipBoySound } from '../../hooks/usePipBoySound';
import type {
  CharacterCreationData,
  Origin,
  Skill,
  SPECIALAttributes,
} from '../../types/character';
import { ORIGINS } from '../../data/origins';
import { Step2BasicInfo } from './CharacterCreation/Step2BasicInfo';
import { Step3Origin } from './CharacterCreation/Step3Origin';
import { Step4Special } from './CharacterCreation/Step4Special';
import { Step5Skills } from './CharacterCreation/Step5Skills';
import { Step6Review } from './CharacterCreation/Step6Review';

interface CharacterCreationProps {
  onBack: () => void;
  onComplete: (data: CharacterCreationData) => void;
}

type Step = 1 | 2 | 3 | 4 | 5;

const STEP_NAMES = {
  1: 'BASIC INFO',
  2: 'ORIGIN',
  3: 'S.P.E.C.I.A.L.',
  4: 'SKILLS',
  5: 'REVIEW',
};

const BASE_SPECIAL: SPECIALAttributes = {
  strength: 4,
  perception: 4,
  endurance: 4,
  charisma: 4,
  intelligence: 4,
  agility: 4,
  luck: 4,
};

export const CharacterCreation: React.FC<CharacterCreationProps> = ({
  onBack,
  onComplete,
}) => {
  const { playSound } = usePipBoySound();
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Character Data State
  const [characterName, setCharacterName] = useState('');
  const [selectedOrigin, setSelectedOrigin] = useState<Origin | null>(null);
  const [special, setSpecial] = useState<SPECIALAttributes>(BASE_SPECIAL);
  const [availablePoints, setAvailablePoints] = useState(0);
  const [tagSkills, setTagSkills] = useState<Skill[]>([]);
  const [skillRanks, setSkillRanks] = useState<Partial<Record<Skill, number>>>({});

  // Initialize sounds
  useEffect(() => {
    playSound('boot', 0.3);
  }, [playSound]);

  // Navigate to next step
  const nextStep = () => {
    if (currentStep < 5) {
      setIsTransitioning(true);
      playSound('transition', 0.4);
      setTimeout(() => {
        setCurrentStep((prev) => (prev + 1) as Step);
        setIsTransitioning(false);
      }, 300);
    }
  };

  // Navigate to previous step
  const prevStep = () => {
    if (currentStep > 1) {
      setIsTransitioning(true);
      playSound('transition', 0.4);
      setTimeout(() => {
        setCurrentStep((prev) => (prev - 1) as Step);
        setIsTransitioning(false);
      }, 300);
    } else {
      onBack();
    }
  };

  // Calculate derived stats
  const calculateStats = () => {
    const finalSpecial = { ...special };
    if (selectedOrigin) {
      const modifiers = ORIGINS[selectedOrigin].specialModifiers;
      Object.entries(modifiers).forEach(([key, value]) => {
        finalSpecial[key as keyof SPECIALAttributes] += value || 0;
      });
    }

    const maxHP = finalSpecial.endurance + finalSpecial.luck + 1; // Level 1
    const defense = 1; // Base defense
    const initiative = finalSpecial.perception + finalSpecial.agility;
    const meleeDamage =
      finalSpecial.strength >= 11 ? 3 :
      finalSpecial.strength >= 9 ? 2 :
      finalSpecial.strength >= 7 ? 1 : 0;

    return { finalSpecial, maxHP, defense, initiative, meleeDamage };
  };

  // Handle form submission
  const handleSubmit = () => {
    if (!selectedOrigin || !characterName) {
      alert('Please complete all required fields');
      return;
    }

    const { finalSpecial, maxHP, defense, initiative, meleeDamage } = calculateStats();

    const data: CharacterCreationData = {
      characterName,
      origin: selectedOrigin,
      special: finalSpecial,
      tagSkills,
      skillRanks,
      level: 1,
      maxHP,
      defense,
      initiative,
      meleeDamage,
    };

    playSound('lightUp', 0.5);
    onComplete(data);
  };

  // Validation functions
  const canProceedStep1 = () => characterName.trim().length > 0;
  const canProceedStep2 = () => selectedOrigin !== null;
  const canProceedStep3 = () => availablePoints === 0;
  const canProceedStep4 = () => tagSkills.length === 3;

  const canProceed = () => {
    switch (currentStep) {
      case 1: return canProceedStep1();
      case 2: return canProceedStep2();
      case 3: return canProceedStep3();
      case 4: return canProceedStep4();
      case 5: return true;
      default: return false;
    }
  };

  return (
    <CreationContainer>
      <TerminalScreen
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <CRTEffect />
        <ContentWrapper>
          {/* HEADER */}
          <Header>
            <HeaderLine>████████████████████████████████████████████████████████</HeaderLine>
            <Title>VAULT-TEC CHARACTER CREATION SYSTEM</Title>
            <HeaderLine>████████████████████████████████████████████████████████</HeaderLine>
            <Subtitle>
              STEP {currentStep}/5: {STEP_NAMES[currentStep]}
            </Subtitle>
            <ProgressBar>
              {[1, 2, 3, 4, 5].map((step) => (
                <ProgressSegment key={step} active={step <= currentStep} />
              ))}
            </ProgressBar>
          </Header>

          {/* CONTENT AREA */}
          <StepContent>
            <AnimatePresence mode="wait">
              {!isTransitioning && (
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                  style={{ width: '100%', height: '100%' }}
                >
                  {currentStep === 1 && (
                    <Step2BasicInfo
                      characterName={characterName}
                      setCharacterName={setCharacterName}
                      playSound={playSound}
                    />
                  )}
                  {currentStep === 2 && (
                    <Step3Origin
                      selectedOrigin={selectedOrigin}
                      setSelectedOrigin={setSelectedOrigin}
                      playSound={playSound}
                    />
                  )}
                  {currentStep === 3 && (
                    <Step4Special
                      special={special}
                      setSpecial={setSpecial}
                      selectedOrigin={selectedOrigin}
                      availablePoints={availablePoints}
                      setAvailablePoints={setAvailablePoints}
                      playSound={playSound}
                    />
                  )}
                  {currentStep === 4 && (
                    <Step5Skills
                      tagSkills={tagSkills}
                      setTagSkills={setTagSkills}
                      skillRanks={skillRanks}
                      setSkillRanks={setSkillRanks}
                      selectedOrigin={selectedOrigin}
                      special={special}
                      playSound={playSound}
                    />
                  )}
                  {currentStep === 5 && (
                    <Step6Review
                      characterName={characterName}
                      selectedOrigin={selectedOrigin}
                      special={special}
                      tagSkills={tagSkills}
                      skillRanks={skillRanks}
                      calculateStats={calculateStats}
                    />
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </StepContent>

          {/* FOOTER WITH NAVIGATION */}
          <Footer>
            <FooterLine>────────────────────────────────────────────────────────</FooterLine>
            <ButtonRow>
              <BackButton onClick={prevStep}>
                [ ESC ] {currentStep === 1 ? 'CANCEL' : 'BACK'}
              </BackButton>
              {currentStep < 5 ? (
                <NextButton
                  onClick={nextStep}
                  disabled={!canProceed()}
                  whileHover={canProceed() ? { scale: 1.05 } : {}}
                  whileTap={canProceed() ? { scale: 0.95 } : {}}
                >
                  CONTINUE &gt;
                </NextButton>
              ) : (
                <SubmitButton
                  onClick={handleSubmit}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  [ ENTER ] CREATE CHARACTER
                </SubmitButton>
              )}
            </ButtonRow>
          </Footer>
        </ContentWrapper>
      </TerminalScreen>
    </CreationContainer>
  );
};

// ============================================================================
// STYLED COMPONENTS
// ============================================================================

const CreationContainer = styled.div`
  width: 100vw;
  height: 100vh;
  background: radial-gradient(circle at center, #0a0a0a 0%, #000000 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

const TerminalScreen = styled(motion.div)`
  width: 90%;
  height: 90%;
  background: #000000;
  border: 2px solid ${PIPBOY_COLORS.primary};
  border-radius: 8px;
  position: relative;
  overflow: hidden;
  box-shadow:
    0 0 40px ${PIPBOY_COLORS.primary}66,
    inset 0 0 40px rgba(0, 0, 0, 0.5);
`;

const ContentWrapper = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  color: ${PIPBOY_COLORS.primary};
  padding: 2rem;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 1.5rem;
  flex-shrink: 0;
`;

const HeaderLine = styled.div`
  font-size: 0.5rem;
  letter-spacing: -1px;
  color: ${PIPBOY_COLORS.primary};
  opacity: 0.5;
  text-shadow: 0 0 8px ${PIPBOY_COLORS.primary}88;
`;

const Title = styled.h1`
  font-family: 'Monofonto', monospace;
  font-size: 1.8rem;
  margin: 0.5rem 0;
  letter-spacing: 0.15em;
  text-shadow:
    0 0 10px ${PIPBOY_COLORS.primary},
    0 0 20px ${PIPBOY_COLORS.primary}88;
`;

const Subtitle = styled.div`
  font-size: 0.9rem;
  letter-spacing: 0.1em;
  opacity: 0.8;
  margin-top: 0.5rem;
`;

const ProgressBar = styled.div`
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  margin-top: 1rem;
`;

const ProgressSegment = styled.div<{ active: boolean }>`
  width: 60px;
  height: 4px;
  background: ${props => props.active ? PIPBOY_COLORS.primary : `${PIPBOY_COLORS.primary}22`};
  box-shadow: ${props => props.active ? `0 0 8px ${PIPBOY_COLORS.primary}` : 'none'};
  transition: all 0.3s;
`;

const StepContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  margin: 1rem 0;
  border: 1px solid ${PIPBOY_COLORS.primary}33;
  background: ${PIPBOY_COLORS.primary}05;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #000;
  }

  &::-webkit-scrollbar-thumb {
    background: ${PIPBOY_COLORS.primary}44;
    border-radius: 4px;
  }
`;

const Footer = styled.div`
  flex-shrink: 0;
  margin-top: 1rem;
`;

const FooterLine = styled.div`
  font-size: 0.5rem;
  letter-spacing: -1px;
  color: ${PIPBOY_COLORS.primary};
  opacity: 0.3;
  margin-bottom: 1rem;
  text-align: center;
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
`;

const BackButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: transparent;
  border: 1px solid ${PIPBOY_COLORS.primary}66;
  color: ${PIPBOY_COLORS.primary};
  font-family: 'Monofonto', monospace;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
  letter-spacing: 0.1em;

  &:hover {
    background: ${PIPBOY_COLORS.primary}22;
    border-color: ${PIPBOY_COLORS.primary};
    box-shadow: 0 0 10px ${PIPBOY_COLORS.primary}44;
  }
`;

const NextButton = styled(motion.button)<{ disabled: boolean }>`
  padding: 0.75rem 1.5rem;
  background: ${props => props.disabled ? 'transparent' : `${PIPBOY_COLORS.primary}22`};
  border: 1px solid ${props => props.disabled ? `${PIPBOY_COLORS.primary}33` : PIPBOY_COLORS.primary};
  color: ${props => props.disabled ? `${PIPBOY_COLORS.primary}44` : PIPBOY_COLORS.primary};
  font-family: 'Monofonto', monospace;
  font-size: 0.9rem;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.2s;
  letter-spacing: 0.1em;
  opacity: ${props => props.disabled ? 0.5 : 1};

  &:hover {
    background: ${props => props.disabled ? 'transparent' : `${PIPBOY_COLORS.primary}33`};
    box-shadow: ${props => props.disabled ? 'none' : `0 0 15px ${PIPBOY_COLORS.primary}44`};
  }
`;

const SubmitButton = styled(motion.button)`
  padding: 0.75rem 1.5rem;
  background: ${PIPBOY_COLORS.success}22;
  border: 2px solid ${PIPBOY_COLORS.success};
  color: ${PIPBOY_COLORS.success};
  font-family: 'Monofonto', monospace;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
  letter-spacing: 0.1em;

  &:hover {
    background: ${PIPBOY_COLORS.success}33;
    box-shadow: 0 0 20px ${PIPBOY_COLORS.success}66;
  }
`;

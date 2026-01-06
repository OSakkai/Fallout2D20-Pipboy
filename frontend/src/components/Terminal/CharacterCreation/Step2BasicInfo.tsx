import styled from 'styled-components';
import { PIPBOY_COLORS } from '../../../styles/pipboy-colors';
import type { PipBoySoundType } from '../../../hooks/usePipBoySound';

interface Step2BasicInfoProps {
  characterName: string;
  setCharacterName: (name: string) => void;
  playSound: (sound: PipBoySoundType, volume?: number) => void;
}

export const Step2BasicInfo: React.FC<Step2BasicInfoProps> = ({
  characterName,
  setCharacterName,
  playSound,
}) => {
  return (
    <Container>
      <SectionTitle>&gt; BASIC INFORMATION</SectionTitle>
      <Description>
        Enter your character's name. Choose wisely, wastelander.
      </Description>

      <FormGroup>
        <Label>CHARACTER NAME *</Label>
        <NameInput
          type="text"
          value={characterName}
          onChange={(e) => setCharacterName(e.target.value)}
          onFocus={() => playSound('beep', 0.2)}
          placeholder="Enter character name..."
          maxLength={30}
          autoFocus
        />
        <CharCount>{characterName.length}/30</CharCount>
      </FormGroup>

      <VaultBoyContainer>
        <VaultBoy>👤</VaultBoy>
        <VaultBoyText>
          {characterName || 'UNKNOWN WASTELANDER'}
        </VaultBoyText>
      </VaultBoyContainer>

      <InfoBox>
        <InfoText>
          This name will be visible to other players in your campaign and cannot be changed later.
        </InfoText>
      </InfoBox>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  max-width: 600px;
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

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 3rem;
`;

const Label = styled.label`
  font-size: 0.85rem;
  letter-spacing: 0.05em;
  opacity: 0.9;
`;

const NameInput = styled.input`
  background: #000;
  border: 2px solid ${PIPBOY_COLORS.primary};
  color: ${PIPBOY_COLORS.primary};
  padding: 1rem;
  font-family: 'Monofonto', monospace;
  font-size: 1.2rem;
  outline: none;
  text-align: center;
  letter-spacing: 0.1em;
  text-transform: uppercase;

  &::placeholder {
    color: ${PIPBOY_COLORS.primary}44;
    text-transform: none;
  }

  &:focus {
    box-shadow: 0 0 20px ${PIPBOY_COLORS.primary}66;
  }
`;

const CharCount = styled.div`
  font-size: 0.7rem;
  opacity: 0.6;
  text-align: right;
`;

const VaultBoyContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 2rem;
  border: 1px solid ${PIPBOY_COLORS.primary}33;
  background: ${PIPBOY_COLORS.primary}05;
  margin-bottom: 2rem;
`;

const VaultBoy = styled.div`
  font-size: 5rem;
`;

const VaultBoyText = styled.div`
  font-size: 1.2rem;
  letter-spacing: 0.1em;
  text-shadow: 0 0 10px ${PIPBOY_COLORS.primary}88;
`;

const InfoBox = styled.div`
  padding: 1rem;
  background: ${PIPBOY_COLORS.warning}11;
  border: 1px solid ${PIPBOY_COLORS.warning}66;
  border-radius: 2px;
`;

const InfoText = styled.div`
  font-size: 0.85rem;
  line-height: 1.5;
  opacity: 0.9;
  color: ${PIPBOY_COLORS.warning};
`;

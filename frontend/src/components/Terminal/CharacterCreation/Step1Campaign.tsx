import styled from 'styled-components';
import { PIPBOY_COLORS } from '../../../styles/pipboy-colors';
import { motion } from 'framer-motion';
import type { PipBoySoundType } from '../../../hooks/usePipBoySound';

interface Step1CampaignProps {
  campaignMode: 'new' | 'existing';
  setCampaignMode: (mode: 'new' | 'existing') => void;
  campaignId: string;
  setCampaignId: (id: string) => void;
  campaignName: string;
  setCampaignName: (name: string) => void;
  campaignDescription: string;
  setCampaignDescription: (desc: string) => void;
  playSound: (sound: PipBoySoundType, volume?: number) => void;
}

export const Step1Campaign: React.FC<Step1CampaignProps> = ({
  campaignMode,
  setCampaignMode,
  campaignId,
  setCampaignId,
  campaignName,
  setCampaignName,
  campaignDescription,
  setCampaignDescription,
  playSound,
}) => {
  const handleModeChange = (mode: 'new' | 'existing') => {
    setCampaignMode(mode);
    playSound('beep', 0.3);
  };

  return (
    <Container>
      <SectionTitle>&gt; CAMPAIGN SELECTION</SectionTitle>
      <Description>
        Choose whether to create a new campaign or join an existing one.
      </Description>

      <ModeSelector>
        <ModeOption
          selected={campaignMode === 'new'}
          onClick={() => handleModeChange('new')}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <ModeIcon>+</ModeIcon>
          <ModeLabel>CREATE NEW CAMPAIGN</ModeLabel>
        </ModeOption>

        <ModeOption
          selected={campaignMode === 'existing'}
          onClick={() => handleModeChange('existing')}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <ModeIcon>▸</ModeIcon>
          <ModeLabel>JOIN EXISTING CAMPAIGN</ModeLabel>
        </ModeOption>
      </ModeSelector>

      <Divider>─────────────────────────────────────────</Divider>

      {campaignMode === 'new' ? (
        <FormSection>
          <FormGroup>
            <Label>CAMPAIGN NAME *</Label>
            <Input
              type="text"
              value={campaignName}
              onChange={(e) => setCampaignName(e.target.value)}
              onFocus={() => playSound('beep', 0.2)}
              placeholder="Enter campaign name..."
              maxLength={50}
            />
            <CharCount>{campaignName.length}/50</CharCount>
          </FormGroup>

          <FormGroup>
            <Label>DESCRIPTION (Optional)</Label>
            <TextArea
              value={campaignDescription}
              onChange={(e) => setCampaignDescription(e.target.value)}
              onFocus={() => playSound('beep', 0.2)}
              placeholder="Describe your campaign setting..."
              maxLength={200}
              rows={4}
            />
            <CharCount>{campaignDescription.length}/200</CharCount>
          </FormGroup>

          <InfoBox>
            <InfoIcon>ℹ</InfoIcon>
            <InfoText>
              A new campaign will be created with you as the Game Master. You can invite other players later.
            </InfoText>
          </InfoBox>
        </FormSection>
      ) : (
        <FormSection>
          <FormGroup>
            <Label>SELECT CAMPAIGN *</Label>
            <Select
              value={campaignId}
              onChange={(e) => {
                setCampaignId(e.target.value);
                playSound('beep', 0.3);
              }}
            >
              <option value="">-- Select a campaign --</option>
              <option value="campaign1">The Capital Wasteland Adventure</option>
              <option value="campaign2">New Vegas Survival</option>
              <option value="campaign3">Commonwealth Chronicles</option>
            </Select>
          </FormGroup>

          <InfoBox>
            <InfoIcon>ℹ</InfoIcon>
            <InfoText>
              Select an existing campaign to join. You will create a character for this campaign.
            </InfoText>
          </InfoBox>
        </FormSection>
      )}
    </Container>
  );
};

// ============================================================================
// STYLED COMPONENTS
// ============================================================================

const Container = styled.div`
  width: 100%;
  max-width: 800px;
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

const ModeSelector = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const ModeOption = styled(motion.div)<{ selected: boolean }>`
  padding: 2rem;
  border: 2px solid ${props => props.selected ? PIPBOY_COLORS.primary : `${PIPBOY_COLORS.primary}44`};
  background: ${props => props.selected ? `${PIPBOY_COLORS.primary}11` : 'transparent'};
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  transition: all 0.3s;

  &:hover {
    border-color: ${PIPBOY_COLORS.primary};
    background: ${PIPBOY_COLORS.primary}08;
  }
`;

const ModeIcon = styled.div`
  font-size: 3rem;
  font-weight: bold;
`;

const ModeLabel = styled.div`
  font-size: 0.9rem;
  letter-spacing: 0.1em;
  text-align: center;
`;

const Divider = styled.div`
  text-align: center;
  opacity: 0.3;
  font-size: 0.7rem;
  margin: 2rem 0;
`;

const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 0.85rem;
  letter-spacing: 0.05em;
  opacity: 0.9;
`;

const Input = styled.input`
  background: #000;
  border: 1px solid ${PIPBOY_COLORS.primary}66;
  color: ${PIPBOY_COLORS.primary};
  padding: 0.75rem;
  font-family: 'Monofonto', monospace;
  font-size: 1rem;
  outline: none;
  transition: all 0.2s;

  &::placeholder {
    color: ${PIPBOY_COLORS.primary}44;
  }

  &:focus {
    border-color: ${PIPBOY_COLORS.primary};
    box-shadow: 0 0 10px ${PIPBOY_COLORS.primary}44;
  }
`;

const TextArea = styled.textarea`
  background: #000;
  border: 1px solid ${PIPBOY_COLORS.primary}66;
  color: ${PIPBOY_COLORS.primary};
  padding: 0.75rem;
  font-family: 'Monofonto', monospace;
  font-size: 0.9rem;
  outline: none;
  transition: all 0.2s;
  resize: vertical;

  &::placeholder {
    color: ${PIPBOY_COLORS.primary}44;
  }

  &:focus {
    border-color: ${PIPBOY_COLORS.primary};
    box-shadow: 0 0 10px ${PIPBOY_COLORS.primary}44;
  }
`;

const Select = styled.select`
  background: #000;
  border: 1px solid ${PIPBOY_COLORS.primary}66;
  color: ${PIPBOY_COLORS.primary};
  padding: 0.75rem;
  font-family: 'Monofonto', monospace;
  font-size: 1rem;
  outline: none;
  cursor: pointer;

  &:focus {
    border-color: ${PIPBOY_COLORS.primary};
    box-shadow: 0 0 10px ${PIPBOY_COLORS.primary}44;
  }

  option {
    background: #000;
    color: ${PIPBOY_COLORS.primary};
  }
`;

const CharCount = styled.div`
  font-size: 0.7rem;
  opacity: 0.6;
  text-align: right;
`;

const InfoBox = styled.div`
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: ${PIPBOY_COLORS.primary}08;
  border: 1px solid ${PIPBOY_COLORS.primary}33;
  border-radius: 2px;
`;

const InfoIcon = styled.div`
  font-size: 1.5rem;
  flex-shrink: 0;
`;

const InfoText = styled.div`
  font-size: 0.85rem;
  line-height: 1.5;
  opacity: 0.9;
`;

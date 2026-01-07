import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { PIPBOY_COLORS, PIPBOY_TEXT_GLOW, PIPBOY_TYPOGRAPHY } from '../../styles/pipboy-colors';

interface DevCheatsOverlayProps {
  characterId: string | null;
  onClose: () => void;
}

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.92);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 20000;
  backdrop-filter: blur(5px);
`;

const Panel = styled(motion.div)`
  background: rgba(2, 5, 2, 0.98);
  border: 3px solid ${PIPBOY_COLORS.warning};
  border-radius: 4px;
  padding: 25px;
  max-width: 900px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow:
    0 0 30px rgba(255, 165, 0, 0.4),
    inset 0 0 40px rgba(255, 165, 0, 0.05);
`;

const Title = styled.div`
  font-family: ${PIPBOY_TYPOGRAPHY.fontFamily};
  font-size: 24px;
  color: ${PIPBOY_COLORS.warning};
  text-shadow: 0 0 10px ${PIPBOY_COLORS.warning};
  text-align: center;
  margin-bottom: 15px;
  text-transform: uppercase;
  letter-spacing: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  &::before,
  &::after {
    content: '⚠';
    color: ${PIPBOY_COLORS.danger};
  }
`;

const Section = styled.div`
  margin-bottom: 20px;
`;

const SectionTitle = styled.div`
  font-family: ${PIPBOY_TYPOGRAPHY.fontFamily};
  font-size: 16px;
  color: ${PIPBOY_COLORS.bright};
  text-shadow: ${PIPBOY_TEXT_GLOW.standard};
  margin-bottom: 10px;
  text-transform: uppercase;
  letter-spacing: 1px;
  border-bottom: 1px solid ${PIPBOY_COLORS.primary};
  padding-bottom: 5px;
`;

const ControlGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
`;

const ControlItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const Label = styled.label`
  font-family: ${PIPBOY_TYPOGRAPHY.fontFamily};
  font-size: 12px;
  color: ${PIPBOY_COLORS.primary};
  text-shadow: ${PIPBOY_TEXT_GLOW.subtle};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const Input = styled.input`
  background: rgba(0, 0, 0, 0.7);
  border: 1px solid ${PIPBOY_COLORS.primary};
  border-radius: 2px;
  padding: 8px 12px;
  font-family: ${PIPBOY_TYPOGRAPHY.fontFamily};
  font-size: 14px;
  color: ${PIPBOY_COLORS.bright};
  text-shadow: ${PIPBOY_TEXT_GLOW.subtle};
  outline: none;

  &:focus {
    border-color: ${PIPBOY_COLORS.bright};
    box-shadow: 0 0 8px rgba(18, 255, 21, 0.3);
  }
`;

const Select = styled.select`
  background: rgba(0, 0, 0, 0.7);
  border: 1px solid ${PIPBOY_COLORS.primary};
  border-radius: 2px;
  padding: 8px 12px;
  font-family: ${PIPBOY_TYPOGRAPHY.fontFamily};
  font-size: 14px;
  color: ${PIPBOY_COLORS.bright};
  text-shadow: ${PIPBOY_TEXT_GLOW.subtle};
  outline: none;
  cursor: pointer;

  &:focus {
    border-color: ${PIPBOY_COLORS.bright};
    box-shadow: 0 0 8px rgba(18, 255, 21, 0.3);
  }

  option {
    background: #000;
    color: ${PIPBOY_COLORS.bright};
  }
`;

const Button = styled(motion.button)<{ variant?: 'primary' | 'danger' | 'warning' }>`
  padding: 10px 20px;
  background: transparent;
  border: 2px solid ${props =>
    props.variant === 'danger' ? PIPBOY_COLORS.danger :
    props.variant === 'warning' ? PIPBOY_COLORS.warning :
    PIPBOY_COLORS.primary};
  border-radius: 3px;
  color: ${props =>
    props.variant === 'danger' ? PIPBOY_COLORS.danger :
    props.variant === 'warning' ? PIPBOY_COLORS.warning :
    PIPBOY_COLORS.primary};
  font-family: ${PIPBOY_TYPOGRAPHY.fontFamily};
  font-size: 14px;
  text-transform: uppercase;
  cursor: pointer;
  text-shadow: ${PIPBOY_TEXT_GLOW.subtle};
  transition: all 0.2s;

  &:hover {
    background: ${props =>
      props.variant === 'danger' ? 'rgba(255, 0, 0, 0.2)' :
      props.variant === 'warning' ? 'rgba(255, 165, 0, 0.2)' :
      'rgba(18, 255, 21, 0.2)'};
    border-color: ${PIPBOY_COLORS.bright};
    color: ${PIPBOY_COLORS.bright};
    box-shadow: 0 0 10px rgba(18, 255, 21, 0.3);
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;

const Message = styled(motion.div)<{ type: 'success' | 'error' }>`
  padding: 10px 15px;
  background: ${props => props.type === 'success' ? 'rgba(18, 255, 21, 0.1)' : 'rgba(255, 0, 0, 0.1)'};
  border: 1px solid ${props => props.type === 'success' ? PIPBOY_COLORS.primary : PIPBOY_COLORS.danger};
  border-radius: 3px;
  font-family: ${PIPBOY_TYPOGRAPHY.fontFamily};
  font-size: 12px;
  color: ${props => props.type === 'success' ? PIPBOY_COLORS.primary : PIPBOY_COLORS.danger};
  text-shadow: ${PIPBOY_TEXT_GLOW.subtle};
  margin-top: 10px;
`;

const NoCharacterWarning = styled.div`
  padding: 20px;
  background: rgba(255, 0, 0, 0.1);
  border: 2px solid ${PIPBOY_COLORS.danger};
  border-radius: 4px;
  font-family: ${PIPBOY_TYPOGRAPHY.fontFamily};
  font-size: 16px;
  color: ${PIPBOY_COLORS.danger};
  text-align: center;
  text-shadow: ${PIPBOY_TEXT_GLOW.standard};
  margin-bottom: 20px;
`;

const SKILLS = [
  'ATHLETICS', 'BARTER', 'BIG_GUNS', 'ENERGY_WEAPONS', 'EXPLOSIVES', 'LOCKPICK',
  'MEDICINE', 'MELEE_WEAPONS', 'PILOT', 'REPAIR', 'SCIENCE', 'SMALL_GUNS',
  'SNEAK', 'SPEECH', 'SURVIVAL', 'THROWING', 'UNARMED'
];

const BODY_LOCATIONS = ['HEAD', 'TORSO', 'LEFT_ARM', 'RIGHT_ARM', 'LEFT_LEG', 'RIGHT_LEG'];

export const DevCheatsOverlay: React.FC<DevCheatsOverlayProps> = ({ characterId, onClose }) => {
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // SPECIAL states
  const [strength, setStrength] = useState('5');
  const [perception, setPerception] = useState('5');
  const [endurance, setEndurance] = useState('5');
  const [charisma, setCharisma] = useState('5');
  const [intelligence, setIntelligence] = useState('5');
  const [agility, setAgility] = useState('5');
  const [luck, setLuck] = useState('5');

  // Skill states
  const [selectedSkill, setSelectedSkill] = useState('SMALL_GUNS');
  const [skillRank, setSkillRank] = useState('0');

  // Stats states
  const [currentHP, setCurrentHP] = useState('');
  const [maxHP, setMaxHP] = useState('');
  const [level, setLevel] = useState('');
  const [xpCurrent, setXpCurrent] = useState('');

  // Damage/Heal states
  const [damageAmount, setDamageAmount] = useState('10');
  const [healAmount, setHealAmount] = useState('10');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [radsAmount, setRadsAmount] = useState('10');
  const [poisonLevel, setPoisonLevel] = useState('1');

  const apiUrl = window.location.hostname === 'localhost'
    ? 'http://localhost:3000'
    : `http://${window.location.hostname}:3000`;

  const getToken = () => localStorage.getItem('token');

  const showMessage = (text: string, type: 'success' | 'error') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
  };

  const apiCall = async (endpoint: string, method: string, body?: any) => {
    if (!characterId) {
      showMessage('No character selected!', 'error');
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/characters/${characterId}${endpoint}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`,
        },
        body: body ? JSON.stringify(body) : undefined,
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const data = await response.json();
      showMessage('✓ Success!', 'success');
      return data;
    } catch (err) {
      showMessage(err instanceof Error ? err.message : 'Failed', 'error');
    }
  };

  const handleUpdateSPECIAL = () => {
    const updates: any = {};
    if (strength) updates.strength = parseInt(strength);
    if (perception) updates.perception = parseInt(perception);
    if (endurance) updates.endurance = parseInt(endurance);
    if (charisma) updates.charisma = parseInt(charisma);
    if (intelligence) updates.intelligence = parseInt(intelligence);
    if (agility) updates.agility = parseInt(agility);
    if (luck) updates.luck = parseInt(luck);

    apiCall('/special', 'PUT', updates);
  };

  const handleUpdateSkill = () => {
    apiCall('/skill', 'PUT', {
      skill: selectedSkill,
      rank: parseInt(skillRank),
    });
  };

  const handleUpdateStats = () => {
    const updates: any = {};
    if (currentHP) updates.currentHP = parseInt(currentHP);
    if (maxHP) updates.maxHP = parseInt(maxHP);
    if (level) updates.level = parseInt(level);
    if (xpCurrent) updates.xpCurrent = parseInt(xpCurrent);

    apiCall('/stats', 'PUT', updates);
  };

  const handleApplyDamage = () => {
    apiCall('/damage', 'POST', {
      damage: parseInt(damageAmount),
      location: selectedLocation || undefined,
    });
  };

  const handleHeal = () => {
    apiCall('/heal', 'POST', {
      amount: parseInt(healAmount),
      location: selectedLocation || undefined,
    });
  };

  const handleApplyRadiation = () => {
    apiCall('/radiation', 'POST', { rads: parseInt(radsAmount) });
  };

  const handleApplyPoison = () => {
    apiCall('/poison', 'POST', { poisonLevel: parseInt(poisonLevel) });
  };

  // ESC to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <Overlay
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <Panel
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <Title>DEV CHEATS MENU</Title>

        {!characterId && (
          <NoCharacterWarning>
            NO CHARACTER LOADED! Select a character first.
          </NoCharacterWarning>
        )}

        {/* SPECIAL */}
        <Section>
          <SectionTitle>S.P.E.C.I.A.L.</SectionTitle>
          <ControlGrid>
            <ControlItem>
              <Label>Strength</Label>
              <Input type="number" min="1" max="10" value={strength} onChange={(e) => setStrength(e.target.value)} />
            </ControlItem>
            <ControlItem>
              <Label>Perception</Label>
              <Input type="number" min="1" max="10" value={perception} onChange={(e) => setPerception(e.target.value)} />
            </ControlItem>
            <ControlItem>
              <Label>Endurance</Label>
              <Input type="number" min="1" max="10" value={endurance} onChange={(e) => setEndurance(e.target.value)} />
            </ControlItem>
            <ControlItem>
              <Label>Charisma</Label>
              <Input type="number" min="1" max="10" value={charisma} onChange={(e) => setCharisma(e.target.value)} />
            </ControlItem>
            <ControlItem>
              <Label>Intelligence</Label>
              <Input type="number" min="1" max="10" value={intelligence} onChange={(e) => setIntelligence(e.target.value)} />
            </ControlItem>
            <ControlItem>
              <Label>Agility</Label>
              <Input type="number" min="1" max="10" value={agility} onChange={(e) => setAgility(e.target.value)} />
            </ControlItem>
            <ControlItem>
              <Label>Luck</Label>
              <Input type="number" min="1" max="10" value={luck} onChange={(e) => setLuck(e.target.value)} />
            </ControlItem>
          </ControlGrid>
          <Button onClick={handleUpdateSPECIAL} disabled={!characterId} whileHover={{ scale: 1.05 }} style={{ marginTop: '10px', width: '100%' }}>
            Update SPECIAL
          </Button>
        </Section>

        {/* Skills */}
        <Section>
          <SectionTitle>Skills</SectionTitle>
          <ControlGrid>
            <ControlItem>
              <Label>Skill</Label>
              <Select value={selectedSkill} onChange={(e) => setSelectedSkill(e.target.value)}>
                {SKILLS.map(skill => (
                  <option key={skill} value={skill}>{skill.replace('_', ' ')}</option>
                ))}
              </Select>
            </ControlItem>
            <ControlItem>
              <Label>Rank</Label>
              <Input type="number" min="0" max="6" value={skillRank} onChange={(e) => setSkillRank(e.target.value)} />
            </ControlItem>
          </ControlGrid>
          <Button onClick={handleUpdateSkill} disabled={!characterId} whileHover={{ scale: 1.05 }} style={{ marginTop: '10px', width: '100%' }}>
            Update Skill
          </Button>
        </Section>

        {/* Stats */}
        <Section>
          <SectionTitle>Stats (HP / XP / Level)</SectionTitle>
          <ControlGrid>
            <ControlItem>
              <Label>Current HP</Label>
              <Input type="number" min="0" value={currentHP} onChange={(e) => setCurrentHP(e.target.value)} placeholder="Leave empty to skip" />
            </ControlItem>
            <ControlItem>
              <Label>Max HP</Label>
              <Input type="number" min="1" value={maxHP} onChange={(e) => setMaxHP(e.target.value)} placeholder="Leave empty to skip" />
            </ControlItem>
            <ControlItem>
              <Label>Level</Label>
              <Input type="number" min="1" value={level} onChange={(e) => setLevel(e.target.value)} placeholder="Leave empty to skip" />
            </ControlItem>
            <ControlItem>
              <Label>XP</Label>
              <Input type="number" min="0" value={xpCurrent} onChange={(e) => setXpCurrent(e.target.value)} placeholder="Leave empty to skip" />
            </ControlItem>
          </ControlGrid>
          <Button onClick={handleUpdateStats} disabled={!characterId} whileHover={{ scale: 1.05 }} style={{ marginTop: '10px', width: '100%' }}>
            Update Stats
          </Button>
        </Section>

        {/* Damage / Heal */}
        <Section>
          <SectionTitle>Damage / Heal</SectionTitle>
          <ControlGrid>
            <ControlItem>
              <Label>Damage Amount</Label>
              <Input type="number" min="0" value={damageAmount} onChange={(e) => setDamageAmount(e.target.value)} />
            </ControlItem>
            <ControlItem>
              <Label>Heal Amount</Label>
              <Input type="number" min="0" value={healAmount} onChange={(e) => setHealAmount(e.target.value)} />
            </ControlItem>
            <ControlItem>
              <Label>Body Location (optional)</Label>
              <Select value={selectedLocation} onChange={(e) => setSelectedLocation(e.target.value)}>
                <option value="">General HP</option>
                {BODY_LOCATIONS.map(loc => (
                  <option key={loc} value={loc}>{loc.replace('_', ' ')}</option>
                ))}
              </Select>
            </ControlItem>
          </ControlGrid>
          <ButtonRow style={{ marginTop: '10px' }}>
            <Button onClick={handleApplyDamage} disabled={!characterId} variant="danger" whileHover={{ scale: 1.05 }}>
              Apply Damage
            </Button>
            <Button onClick={handleHeal} disabled={!characterId} variant="primary" whileHover={{ scale: 1.05 }}>
              Heal
            </Button>
          </ButtonRow>
        </Section>

        {/* Radiation / Poison */}
        <Section>
          <SectionTitle>Radiation / Poison</SectionTitle>
          <ControlGrid>
            <ControlItem>
              <Label>Radiation (RADs)</Label>
              <Input type="number" min="0" value={radsAmount} onChange={(e) => setRadsAmount(e.target.value)} />
            </ControlItem>
            <ControlItem>
              <Label>Poison Level</Label>
              <Input type="number" min="0" value={poisonLevel} onChange={(e) => setPoisonLevel(e.target.value)} />
            </ControlItem>
          </ControlGrid>
          <ButtonRow style={{ marginTop: '10px' }}>
            <Button onClick={handleApplyRadiation} disabled={!characterId} variant="warning" whileHover={{ scale: 1.05 }}>
              Apply Radiation
            </Button>
            <Button onClick={handleApplyPoison} disabled={!characterId} variant="warning" whileHover={{ scale: 1.05 }}>
              Apply Poison
            </Button>
          </ButtonRow>
        </Section>

        {/* Message */}
        <AnimatePresence>
          {message && (
            <Message
              type={message.type}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {message.text}
            </Message>
          )}
        </AnimatePresence>

        {/* Close Button */}
        <Button onClick={onClose} whileHover={{ scale: 1.05 }} style={{ marginTop: '20px', width: '100%' }}>
          Close (ESC)
        </Button>
      </Panel>
    </Overlay>
  );
};

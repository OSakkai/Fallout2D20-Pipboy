import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';
import type { PipBoyTab } from '../../types';
import { StatTab } from '../Tabs/StatTabWithData';
import { InvTab } from '../Tabs/InvTabWithData';
import { DataTab } from '../Tabs/DataTab';
import { MapTab } from '../Tabs/MapTab';
import { RadioTab } from '../Tabs/RadioTab';
import { PIPBOY_COLORS, PIPBOY_TYPOGRAPHY } from '../../styles/pipboy-colors';

const ContentContainer = styled(motion.div)`
  width: 100%;
  height: 100%;
  color: ${PIPBOY_COLORS.primary};
  font-family: ${PIPBOY_TYPOGRAPHY.fontFamily};
`;

interface TabContentProps {
  activeTab: PipBoyTab;
}

export const TabContent = ({ activeTab }: TabContentProps) => {
  const renderTabContent = () => {
    switch (activeTab) {
      case 'stat':
        return <StatTab />;
      case 'inv':
        return <InvTab />;
      case 'data':
        return <DataTab />;
      case 'map':
        return <MapTab />;
      case 'radio':
        return <RadioTab />;
      default:
        return <StatTab />;
    }
  };

  return (
    <AnimatePresence mode="wait">
      <ContentContainer
        key={activeTab}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
      >
        {renderTabContent()}
      </ContentContainer>
    </AnimatePresence>
  );
};

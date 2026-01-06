import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { PIPBOY_COLORS } from '../../styles/pipboy-colors';
import { CRTEffect } from '../Effects/CRTEffect';

interface EncyclopediaProps {
  onBack: () => void;
}

type Category =
  | 'weapons'
  | 'armor'
  | 'food'
  | 'beverages'
  | 'chems'
  | 'aid'
  | 'mods'
  | 'perks'
  | 'ammo'
  | 'magazines'
  | 'tools';

type SortOption = 'name' | 'level' | 'weight' | 'damage' | 'value';
type SortOrder = 'asc' | 'desc';

interface EncyclopediaItem {
  id: string;
  name: string;
  category: Category;
  description: string;
  image?: string;
  tags: string[];
  stats?: Record<string, any>;
  isFavorite?: boolean;
}

// Backend API Types
interface WeaponMaster {
  id: number;
  name: string;
  weaponType: string;
  skill: string;
  damage: string;
  damageEffects: string[];
  damageType: string;
  fireRate: string;
  range: string;
  ammoType: string;
  qualities: string[];
  weight: number;
  cost: number;
  rarity: number;
  availableModSlots: Record<string, boolean>;
  corebookPage: number;
}

interface ArmorMaster {
  id: number;
  name: string;
  armorType: string;
  location: string;
  physicalDR: number;
  energyDR: number;
  radiationDR: number;
  maxHP: number;
  weight: number;
  cost: number;
  rarity: number;
  allowsMaterialMod: boolean;
  allowsUtilityMod: boolean;
  corebookPage: number;
}

interface ConsumableMaster {
  id: number;
  name: string;
  category: 'AID' | 'CHEM' | 'FOOD' | 'BEVERAGE';
  hpHealed: number;
  effects: string[];
  radiationDice: string;
  addictionRating: number;
  duration: string;
  isAlcoholic: boolean;
  weight: number;
  cost: number;
  rarity: number;
  corebookPage: number;
}

interface ModMaster {
  id: number;
  name: string;
  modType: string;
  modSlot: string;
  applicableTo: string[];
  effects: string[];
  drModifiers: any;
  damageBonus: string;
  requirements: string[];
  weight: number;
  weightModifier: number;
  cost: number;
  corebookPage: number;
}

interface PerkMaster {
  id: number;
  name: string;
  ranks: number;
  requirements: any;
  condition: string;
  benefit: string;
  mechanicalEffects: any;
  corebookPage: number;
}

interface AmmoMaster {
  id: number;
  name: string;
  ammoType: string;
  damageBonus: string;
  baseQuantity: number;
  weight: number;
  cost: number;
  rarity: number;
  corebookPage: number;
}

interface MagazineMaster {
  id: number;
  name: string;
  rollRange: string;
  hasIssues: boolean;
  perkGranted: string;
  perkDescription: string;
  issues: any[];
  corebookPage: number;
}

interface ToolMaster {
  id: number;
  name: string;
  category: string;
  effect: string;
  weight: number;
  cost: number;
  rarity: number;
  corebookPage: number;
}

const API_BASE_URL = 'http://localhost:3000/encyclopedia';

const categoryConfig: Record<Category, { label: string; icon: string; color: string }> = {
  weapons: { label: 'WEAPONS', icon: '▸', color: PIPBOY_COLORS.primary },
  armor: { label: 'ARMOR', icon: '▸', color: PIPBOY_COLORS.primary },
  aid: { label: 'AID', icon: '▸', color: PIPBOY_COLORS.primary },
  food: { label: 'FOOD', icon: '▸', color: PIPBOY_COLORS.primary },
  beverages: { label: 'BEVERAGES', icon: '▸', color: PIPBOY_COLORS.primary },
  chems: { label: 'CHEMS', icon: '▸', color: PIPBOY_COLORS.primary },
  ammo: { label: 'AMMO', icon: '▸', color: PIPBOY_COLORS.primary },
  perks: { label: 'PERKS', icon: '▸', color: PIPBOY_COLORS.success },
  magazines: { label: 'MAGAZINES', icon: '▸', color: PIPBOY_COLORS.primary },
  mods: { label: 'MODS', icon: '▸', color: PIPBOY_COLORS.primary },
  tools: { label: 'TOOLS', icon: '▸', color: PIPBOY_COLORS.primary },
};

// Helper function to format enum values for display
const formatEnumValue = (value: string): string => {
  return value
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

// API fetch functions
const fetchWeapons = async (searchQuery?: string): Promise<EncyclopediaItem[]> => {
  const params = new URLSearchParams();
  if (searchQuery) params.append('search', searchQuery);

  const response = await fetch(`${API_BASE_URL}/weapons?${params}`);
  if (!response.ok) throw new Error('Failed to fetch weapons');

  const data: WeaponMaster[] = await response.json();
  return data.map(weapon => ({
    id: weapon.id.toString(),
    name: weapon.name,
    category: 'weapons' as Category,
    description: `${formatEnumValue(weapon.weaponType)} - ${weapon.skill}. Page ${weapon.corebookPage}`,
    tags: [formatEnumValue(weapon.weaponType)],
    stats: {
      damage: weapon.damage,
      fireRate: weapon.fireRate,
      range: weapon.range,
      ammoType: weapon.ammoType,
      weight: weapon.weight,
      cost: weapon.cost,
      rarity: weapon.rarity,
      modSlots: Object.keys(weapon.availableModSlots || {}).filter(k => weapon.availableModSlots[k]).join(', ')
    }
  }));
};

const fetchArmor = async (searchQuery?: string): Promise<EncyclopediaItem[]> => {
  const params = new URLSearchParams();
  if (searchQuery) params.append('search', searchQuery);

  const response = await fetch(`${API_BASE_URL}/armor?${params}`);
  if (!response.ok) throw new Error('Failed to fetch armor');

  const data: ArmorMaster[] = await response.json();
  return data.map(armor => ({
    id: armor.id.toString(),
    name: armor.name,
    category: 'armor' as Category,
    description: `${formatEnumValue(armor.armorType)} for ${armor.location}. Page ${armor.corebookPage}`,
    tags: [formatEnumValue(armor.armorType)],
    stats: {
      location: armor.location,
      physicalDR: armor.physicalDR,
      energyDR: armor.energyDR,
      radiationDR: armor.radiationDR,
      maxHP: armor.maxHP,
      weight: armor.weight,
      cost: armor.cost,
      rarity: armor.rarity,
      materialMod: armor.allowsMaterialMod ? 'Yes' : 'No',
      utilityMod: armor.allowsUtilityMod ? 'Yes' : 'No'
    }
  }));
};

const fetchConsumables = async (category: 'AID' | 'CHEM' | 'FOOD' | 'BEVERAGE', searchQuery?: string): Promise<EncyclopediaItem[]> => {
  const params = new URLSearchParams();
  params.append('category', category);
  if (searchQuery) params.append('search', searchQuery);

  const response = await fetch(`${API_BASE_URL}/consumables?${params}`);
  if (!response.ok) throw new Error('Failed to fetch consumables');

  const data: ConsumableMaster[] = await response.json();
  const categoryMap: Record<string, Category> = {
    'AID': 'aid',
    'CHEM': 'chems',
    'FOOD': 'food',
    'BEVERAGE': 'beverages'
  };

  return data.map(consumable => ({
    id: consumable.id.toString(),
    name: consumable.name,
    category: categoryMap[consumable.category],
    description: `${consumable.effects.join(', ')}. Page ${consumable.corebookPage}`,
    tags: [formatEnumValue(consumable.category)],
    stats: {
      hpHealed: consumable.hpHealed,
      duration: consumable.duration,
      radiationDice: consumable.radiationDice,
      addictionRating: consumable.addictionRating,
      isAlcoholic: consumable.isAlcoholic ? 'Yes' : 'No',
      weight: consumable.weight,
      cost: consumable.cost,
      rarity: consumable.rarity
    }
  }));
};

const fetchMods = async (searchQuery?: string): Promise<EncyclopediaItem[]> => {
  const params = new URLSearchParams();
  if (searchQuery) params.append('search', searchQuery);

  const response = await fetch(`${API_BASE_URL}/mods?${params}`);
  if (!response.ok) throw new Error('Failed to fetch mods');

  const data: ModMaster[] = await response.json();
  return data.map(mod => ({
    id: mod.id.toString(),
    name: mod.name,
    category: 'mods' as Category,
    description: `${formatEnumValue(mod.modType)} mod for ${mod.modSlot}. Page ${mod.corebookPage}`,
    tags: [formatEnumValue(mod.modType)],
    stats: {
      modSlot: mod.modSlot,
      applicableTo: mod.applicableTo.join(', '),
      damageBonus: mod.damageBonus,
      weight: mod.weight,
      weightModifier: mod.weightModifier,
      cost: mod.cost,
      requirements: mod.requirements.join(', ')
    }
  }));
};

const fetchPerks = async (searchQuery?: string): Promise<EncyclopediaItem[]> => {
  const params = new URLSearchParams();
  if (searchQuery) params.append('search', searchQuery);

  const response = await fetch(`${API_BASE_URL}/perks?${params}`);
  if (!response.ok) throw new Error('Failed to fetch perks');

  const data: PerkMaster[] = await response.json();
  return data.map(perk => ({
    id: perk.id.toString(),
    name: perk.name,
    category: 'perks' as Category,
    description: `${perk.benefit} Page ${perk.corebookPage}`,
    tags: [],
    stats: {
      ranks: perk.ranks,
      condition: perk.condition,
      requirements: typeof perk.requirements === 'object'
        ? JSON.stringify(perk.requirements)
        : perk.requirements
    }
  }));
};

const fetchAmmo = async (searchQuery?: string): Promise<EncyclopediaItem[]> => {
  const params = new URLSearchParams();
  if (searchQuery) params.append('search', searchQuery);

  const response = await fetch(`${API_BASE_URL}/ammo?${params}`);
  if (!response.ok) throw new Error('Failed to fetch ammo');

  const data: AmmoMaster[] = await response.json();
  return data.map(ammo => ({
    id: ammo.id.toString(),
    name: ammo.name,
    category: 'ammo' as Category,
    description: `${ammo.ammoType} ammunition. Page ${ammo.corebookPage}`,
    tags: [formatEnumValue(ammo.ammoType)],
    stats: {
      ammoType: ammo.ammoType,
      damageBonus: ammo.damageBonus,
      baseQuantity: ammo.baseQuantity,
      weight: ammo.weight,
      cost: ammo.cost,
      rarity: ammo.rarity
    }
  }));
};

const fetchMagazines = async (searchQuery?: string): Promise<EncyclopediaItem[]> => {
  const params = new URLSearchParams();
  if (searchQuery) params.append('search', searchQuery);

  const response = await fetch(`${API_BASE_URL}/magazines?${params}`);
  if (!response.ok) throw new Error('Failed to fetch magazines');

  const data: MagazineMaster[] = await response.json();
  return data.map(magazine => ({
    id: magazine.id.toString(),
    name: magazine.name,
    category: 'magazines' as Category,
    description: `${magazine.perkDescription} Page ${magazine.corebookPage}`,
    tags: [],
    stats: {
      rollRange: magazine.rollRange,
      hasIssues: magazine.hasIssues ? 'Yes' : 'No',
      perkGranted: magazine.perkGranted,
      issues: magazine.hasIssues ? magazine.issues.length : 0
    }
  }));
};

const fetchTools = async (searchQuery?: string): Promise<EncyclopediaItem[]> => {
  const params = new URLSearchParams();
  if (searchQuery) params.append('search', searchQuery);

  const response = await fetch(`${API_BASE_URL}/tools?${params}`);
  if (!response.ok) throw new Error('Failed to fetch tools');

  const data: ToolMaster[] = await response.json();
  return data.map(tool => ({
    id: tool.id.toString(),
    name: tool.name,
    category: 'tools' as Category,
    description: `${tool.effect} Page ${tool.corebookPage}`,
    tags: [formatEnumValue(tool.category)],
    stats: {
      category: tool.category,
      weight: tool.weight,
      cost: tool.cost,
      rarity: tool.rarity
    }
  }));
};

export const Encyclopedia: React.FC<EncyclopediaProps> = ({ onBack }) => {
  const [selectedCategory, setSelectedCategory] = useState<Category>('weapons');
  const [searchQuery, setSearchQuery] = useState('');
  const [items, setItems] = useState<EncyclopediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [selectedItem, setSelectedItem] = useState<EncyclopediaItem | null>(null);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  // Fetch data when category changes (with debounce for search)
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        let data: EncyclopediaItem[] = [];

        switch (selectedCategory) {
          case 'weapons':
            data = await fetchWeapons(searchQuery);
            break;
          case 'armor':
            data = await fetchArmor(searchQuery);
            break;
          case 'food':
            data = await fetchConsumables('FOOD', searchQuery);
            break;
          case 'beverages':
            data = await fetchConsumables('BEVERAGE', searchQuery);
            break;
          case 'chems':
            data = await fetchConsumables('CHEM', searchQuery);
            break;
          case 'aid':
            data = await fetchConsumables('AID', searchQuery);
            break;
          case 'mods':
            data = await fetchMods(searchQuery);
            break;
          case 'perks':
            data = await fetchPerks(searchQuery);
            break;
          case 'ammo':
            data = await fetchAmmo(searchQuery);
            break;
          case 'magazines':
            data = await fetchMagazines(searchQuery);
            break;
          case 'tools':
            data = await fetchTools(searchQuery);
            break;
        }

        setItems(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    // Debounce search queries (wait 500ms after user stops typing)
    const timeoutId = setTimeout(() => {
      fetchData();
    }, searchQuery ? 500 : 0);

    return () => clearTimeout(timeoutId);
  }, [selectedCategory, searchQuery]);

  // Filtrar itens
  const filteredItems = items.filter(item => {
    if (showFavoritesOnly && !favorites.has(item.id)) return false;
    if (selectedTags.length > 0 && !selectedTags.some(tag => item.tags.includes(tag))) return false;
    return true;
  });

  // Ordenar itens
  const sortedItems = [...filteredItems].sort((a, b) => {
    let comparison = 0;

    if (sortBy === 'name') {
      comparison = a.name.localeCompare(b.name);
    } else if (sortBy === 'level') {
      const aLevel = a.stats?.level || 0;
      const bLevel = b.stats?.level || 0;
      comparison = aLevel - bLevel;
    } else if (sortBy === 'weight') {
      const aWeight = a.stats?.weight || 0;
      const bWeight = b.stats?.weight || 0;
      comparison = aWeight - bWeight;
    } else if (sortBy === 'damage') {
      const aDamage = a.stats?.damage || 0;
      const bDamage = b.stats?.damage || 0;
      comparison = aDamage - bDamage;
    } else if (sortBy === 'value') {
      const aValue = a.stats?.cost || 0;
      const bValue = b.stats?.cost || 0;
      comparison = aValue - bValue;
    }

    return sortOrder === 'asc' ? comparison : -comparison;
  });

  // Tags únicas da categoria atual
  const availableTags = Array.from(new Set(items.flatMap(i => i.tags))).filter(tag => tag);

  const toggleFavorite = (itemId: string) => {
    setFavorites(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  return (
    <EncyclopediaContainer tabIndex={0}>
      <TVBezel
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <ScreenOutline>
          <ScreenInset>
            <MonitorBezel>
              <TerminalFrame>
                <CRTEffect />
                <ContentWrapper>
                  {/* HEADER */}
                  <Header>
                    <HeaderLine>████████████████████████████████████████████████████████</HeaderLine>
                    <Title>WASTELAND ENCYCLOPEDIA</Title>
                    <HeaderLine>████████████████████████████████████████████████████████</HeaderLine>
                    <Subtitle>COMPREHENSIVE DATABASE - WEAPONS, ARMOR, CONSUMABLES & MORE</Subtitle>
                  </Header>

                  <MainLayout>
                    {/* SIDEBAR */}
                    <Sidebar>
                      <SidebarTitle>&gt; CATEGORIES</SidebarTitle>
                      <CategoryList>
                        {(Object.keys(categoryConfig) as Category[]).map(cat => (
                          <CategoryItem
                            key={cat}
                            selected={selectedCategory === cat}
                            onClick={() => {
                              setSelectedCategory(cat);
                              setSearchQuery('');
                              setSelectedTags([]);
                            }}
                          >
                            <CategoryIcon>{categoryConfig[cat].icon}</CategoryIcon>
                            <CategoryLabel>{categoryConfig[cat].label}</CategoryLabel>
                            <ItemCount>
                              {selectedCategory === cat ? `[${items.length}]` : ''}
                            </ItemCount>
                          </CategoryItem>
                        ))}
                      </CategoryList>

                      <Divider>─────────────────────</Divider>

                      <BackButton onClick={onBack}>
                        [ ESC ] BACK TO MENU
                      </BackButton>
                    </Sidebar>

                    {/* CONTENT AREA */}
                    <ContentArea>
                      {/* FILTERS BAR */}
                      <FiltersBar>
                        <SearchContainer>
                          <SearchLabel>&gt; SEARCH:</SearchLabel>
                          <SearchInput
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Type to filter..."
                          />
                          {searchQuery && (
                            <ClearButton onClick={() => setSearchQuery('')}>✕</ClearButton>
                          )}
                        </SearchContainer>

                        <FilterRow>
                          <FilterGroup>
                            <FilterLabel>SORT:</FilterLabel>
                            <Select value={sortBy} onChange={(e) => setSortBy(e.target.value as SortOption)}>
                              <option value="name">Name</option>
                              <option value="level">Level</option>
                              <option value="weight">Weight</option>
                              <option value="damage">Damage</option>
                              <option value="value">Value</option>
                            </Select>
                            <OrderButton onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}>
                              {sortOrder === 'asc' ? '▲' : '▼'}
                            </OrderButton>
                          </FilterGroup>

                          <FavoritesToggle
                            active={showFavoritesOnly}
                            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                          >
                            ★ FAVORITES ONLY
                          </FavoritesToggle>
                        </FilterRow>

                      </FiltersBar>

                      {/* ITEMS LIST */}
                      <ItemsGrid>
                        <ResultCount>
                          SHOWING {sortedItems.length} / {filteredItems.length} ITEMS
                        </ResultCount>

                        {loading ? (
                          <NoResults>
                            <NoResultsText>LOADING...</NoResultsText>
                            <NoResultsHint>Fetching data from database</NoResultsHint>
                          </NoResults>
                        ) : error ? (
                          <NoResults>
                            <NoResultsText>ERROR</NoResultsText>
                            <NoResultsHint>{error}</NoResultsHint>
                          </NoResults>
                        ) : sortedItems.length === 0 ? (
                          <NoResults>
                            <NoResultsText>NO ITEMS FOUND</NoResultsText>
                            <NoResultsHint>Try adjusting your filters or search query</NoResultsHint>
                          </NoResults>
                        ) : (
                          <ItemsList>
                            {sortedItems.map(item => (
                              <ItemCard
                                key={item.id}
                                onClick={() => setSelectedItem(item)}
                                whileHover={{ scale: 1.02, borderColor: PIPBOY_COLORS.primary }}
                                whileTap={{ scale: 0.98 }}
                              >
                                <ItemHeader>
                                  <ItemName>{item.name}</ItemName>
                                  <FavoriteButton
                                    active={favorites.has(item.id)}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleFavorite(item.id);
                                    }}
                                  >
                                    {favorites.has(item.id) ? '★' : '☆'}
                                  </FavoriteButton>
                                </ItemHeader>
                                <ItemDescription>{item.description}</ItemDescription>
                                <ItemStats>
                                  {item.stats && Object.entries(item.stats).map(([key, value]) => (
                                    <Stat key={key}>
                                      <StatKey>{key}:</StatKey>
                                      <StatValue>{value ?? 'N/A'}</StatValue>
                                    </Stat>
                                  ))}
                                </ItemStats>
                              </ItemCard>
                            ))}
                          </ItemsList>
                        )}
                      </ItemsGrid>
                    </ContentArea>
                  </MainLayout>

                  {/* FOOTER */}
                  <Footer>
                    <FooterLine>────────────────────────────────────────────────────────</FooterLine>
                    <FooterText>[ CLICK ] SELECT   [ ★ ] FAVORITE   [ ESC ] BACK</FooterText>
                  </Footer>
                </ContentWrapper>
              </TerminalFrame>
            </MonitorBezel>
          </ScreenInset>
        </ScreenOutline>
      </TVBezel>

      {/* DETAIL MODAL */}
      <AnimatePresence>
        {selectedItem && (
          <ModalOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedItem(null)}
          >
            <ModalContent
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <ModalHeader>
                <ModalTitle>{selectedItem.name}</ModalTitle>
                <ModalClose onClick={() => setSelectedItem(null)}>✕</ModalClose>
              </ModalHeader>

              <ModalBody>
                <ModalCategory>{categoryConfig[selectedItem.category].label}</ModalCategory>
                <ModalDescription>{selectedItem.description}</ModalDescription>

                {selectedItem.image && (
                  <ModalImage src={selectedItem.image} alt={selectedItem.name} />
                )}

                {selectedItem.stats && (
                  <ModalSection>
                    <ModalSectionTitle>&gt; STATISTICS</ModalSectionTitle>
                    <ModalStats>
                      {Object.entries(selectedItem.stats).map(([key, value]) => (
                        <ModalStat key={key}>
                          <ModalStatKey>{key.toUpperCase()}:</ModalStatKey>
                          <ModalStatValue>{value ?? 'N/A'}</ModalStatValue>
                        </ModalStat>
                      ))}
                    </ModalStats>
                  </ModalSection>
                )}
              </ModalBody>

              <ModalFooter>
                <ModalButton
                  onClick={() => {
                    toggleFavorite(selectedItem.id);
                  }}
                >
                  {favorites.has(selectedItem.id) ? '★ REMOVE FAVORITE' : '☆ ADD FAVORITE'}
                </ModalButton>
                <ModalButton onClick={() => setSelectedItem(null)}>
                  [ CLOSE ]
                </ModalButton>
              </ModalFooter>
            </ModalContent>
          </ModalOverlay>
        )}
      </AnimatePresence>
    </EncyclopediaContainer>
  );
};

// ============================================================================
// STYLED COMPONENTS
// ============================================================================

const EncyclopediaContainer = styled.div`
  width: 100vw;
  height: 100vh;
  background: radial-gradient(circle at center, #0a0a0a 0%, #000000 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  outline: none;
`;

const TVBezel = styled(motion.div)`
  width: 80%;
  height: 85%;
  background: linear-gradient(145deg, #1a1a1a, #0d0d0d);
  border-radius: 20px;
  padding: 1.5rem;
  box-shadow:
    0 0 60px rgba(0, 0, 0, 0.9),
    inset 0 2px 4px rgba(255, 255, 255, 0.1),
    inset 0 -2px 4px rgba(0, 0, 0, 0.5);
`;

const ScreenOutline = styled.div`
  width: 100%;
  height: 100%;
  border: 3px solid #2a2a2a;
  border-radius: 12px;
  padding: 1rem;
  background: #0a0a0a;
  box-shadow: inset 0 0 30px rgba(0, 0, 0, 0.8);
`;

const ScreenInset = styled.div`
  width: 100%;
  height: 100%;
  border: 2px solid #1a1a1a;
  border-radius: 8px;
  padding: 0.75rem;
  background: radial-gradient(circle at center, #050505 0%, #000000 100%);
`;

const MonitorBezel = styled.div`
  width: 100%;
  height: 100%;
  border: 1px solid ${PIPBOY_COLORS.primary}33;
  border-radius: 6px;
  overflow: hidden;
  position: relative;
  box-shadow:
    0 0 20px ${PIPBOY_COLORS.primary}22,
    inset 0 0 40px rgba(0, 0, 0, 0.5);
`;

const TerminalFrame = styled.div`
  width: 100%;
  height: 100%;
  background: #000000;
  position: relative;
  overflow: hidden;
`;

const ContentWrapper = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  color: ${PIPBOY_COLORS.primary};
  padding: 1.5rem;
  overflow: hidden;
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
  font-size: 2rem;
  margin: 0.5rem 0;
  letter-spacing: 0.2em;
  text-shadow:
    0 0 10px ${PIPBOY_COLORS.primary},
    0 0 20px ${PIPBOY_COLORS.primary}88;
  animation: pulse 2s ease-in-out infinite;

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.8; }
  }
`;

const Subtitle = styled.div`
  font-size: 0.75rem;
  letter-spacing: 0.15em;
  opacity: 0.8;
  margin-top: 0.5rem;
`;

const MainLayout = styled.div`
  display: flex;
  gap: 2rem;
  flex: 1;
  overflow: hidden;
`;

const Sidebar = styled.div`
  width: 240px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  border-right: 1px solid ${PIPBOY_COLORS.primary}44;
  padding-right: 1.5rem;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #000;
  }

  &::-webkit-scrollbar-thumb {
    background: ${PIPBOY_COLORS.primary}44;
    border-radius: 3px;
  }
`;

const SidebarTitle = styled.div`
  font-size: 1rem;
  letter-spacing: 0.1em;
  margin-bottom: 1rem;
  text-shadow: 0 0 8px ${PIPBOY_COLORS.primary};
`;

const CategoryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const CategoryItem = styled.div<{ selected: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  cursor: pointer;
  background: ${props => props.selected ? PIPBOY_COLORS.primary + '22' : 'transparent'};
  border: 1px solid ${props => props.selected ? PIPBOY_COLORS.primary : 'transparent'};
  border-radius: 2px;
  transition: all 0.2s;
  font-size: 0.85rem;

  &:hover {
    background: ${PIPBOY_COLORS.primary}11;
    border-color: ${PIPBOY_COLORS.primary}66;
  }
`;

const CategoryIcon = styled.span`
  font-size: 0.8rem;
`;

const CategoryLabel = styled.span`
  flex: 1;
  letter-spacing: 0.05em;
`;

const ItemCount = styled.span`
  font-size: 0.7rem;
  opacity: 0.6;
`;

const Divider = styled.div`
  margin: 1.5rem 0;
  text-align: center;
  opacity: 0.3;
  font-size: 0.7rem;
`;

const BackButton = styled.button`
  margin-top: auto;
  padding: 0.75rem;
  background: transparent;
  border: 1px solid ${PIPBOY_COLORS.primary}66;
  color: ${PIPBOY_COLORS.primary};
  font-family: 'Monofonto', monospace;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;
  letter-spacing: 0.1em;

  &:hover {
    background: ${PIPBOY_COLORS.primary}22;
    border-color: ${PIPBOY_COLORS.primary};
    box-shadow: 0 0 10px ${PIPBOY_COLORS.primary}44;
  }
`;

const ContentArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const FiltersBar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  background: ${PIPBOY_COLORS.primary}08;
  border: 1px solid ${PIPBOY_COLORS.primary}33;
  border-radius: 2px;
  margin-bottom: 1rem;
  flex-shrink: 0;
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const SearchLabel = styled.span`
  font-size: 0.85rem;
  letter-spacing: 0.1em;
  white-space: nowrap;
`;

const SearchInput = styled.input`
  flex: 1;
  background: #000;
  border: 1px solid ${PIPBOY_COLORS.primary}66;
  color: ${PIPBOY_COLORS.primary};
  padding: 0.5rem 0.75rem;
  font-family: 'Monofonto', monospace;
  font-size: 0.85rem;
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

const ClearButton = styled.button`
  background: transparent;
  border: 1px solid ${PIPBOY_COLORS.primary}66;
  color: ${PIPBOY_COLORS.primary};
  width: 2rem;
  height: 2rem;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s;

  &:hover {
    background: ${PIPBOY_COLORS.primary}22;
    border-color: ${PIPBOY_COLORS.primary};
  }
`;

const FilterRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
`;

const FilterGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const FilterLabel = styled.span`
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  white-space: nowrap;
`;

const Select = styled.select`
  background: #000;
  border: 1px solid ${PIPBOY_COLORS.primary}66;
  color: ${PIPBOY_COLORS.primary};
  padding: 0.4rem;
  font-family: 'Monofonto', monospace;
  font-size: 0.75rem;
  cursor: pointer;
  outline: none;

  &:hover {
    border-color: ${PIPBOY_COLORS.primary};
  }

  option {
    background: #000;
    color: ${PIPBOY_COLORS.primary};
  }
`;

const OrderButton = styled.button`
  background: transparent;
  border: 1px solid ${PIPBOY_COLORS.primary}66;
  color: ${PIPBOY_COLORS.primary};
  width: 2rem;
  height: 2rem;
  cursor: pointer;
  font-size: 0.8rem;
  transition: all 0.2s;

  &:hover {
    background: ${PIPBOY_COLORS.primary}22;
    border-color: ${PIPBOY_COLORS.primary};
  }
`;

const FavoritesToggle = styled.button<{ active: boolean }>`
  background: ${props => props.active ? PIPBOY_COLORS.primary + '22' : 'transparent'};
  border: 1px solid ${props => props.active ? PIPBOY_COLORS.primary : PIPBOY_COLORS.primary + '66'};
  color: ${PIPBOY_COLORS.primary};
  padding: 0.4rem 0.75rem;
  font-family: 'Monofonto', monospace;
  font-size: 0.7rem;
  cursor: pointer;
  letter-spacing: 0.1em;
  transition: all 0.2s;

  &:hover {
    background: ${PIPBOY_COLORS.primary}22;
    border-color: ${PIPBOY_COLORS.primary};
  }
`;

const TagsRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const TagsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  flex: 1;
`;

const Tag = styled.button<{ active: boolean }>`
  background: ${props => props.active ? PIPBOY_COLORS.primary + '33' : 'transparent'};
  border: 1px solid ${props => props.active ? PIPBOY_COLORS.primary : PIPBOY_COLORS.primary + '44'};
  color: ${PIPBOY_COLORS.primary};
  padding: 0.25rem 0.5rem;
  font-family: 'Monofonto', monospace;
  font-size: 0.65rem;
  cursor: pointer;
  transition: all 0.2s;
  letter-spacing: 0.05em;

  &:hover {
    background: ${PIPBOY_COLORS.primary}22;
    border-color: ${PIPBOY_COLORS.primary};
  }
`;

const ItemsGrid = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 0 0.5rem;

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

const ResultCount = styled.div`
  font-size: 0.7rem;
  letter-spacing: 0.1em;
  margin-bottom: 1rem;
  opacity: 0.7;
  text-align: center;
`;

const ItemsList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
  padding-bottom: 1rem;
`;

const ItemCard = styled(motion.div)`
  background: ${PIPBOY_COLORS.primary}05;
  border: 1px solid ${PIPBOY_COLORS.primary}44;
  border-radius: 2px;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${PIPBOY_COLORS.primary}11;
    box-shadow: 0 0 15px ${PIPBOY_COLORS.primary}33;
  }
`;

const ItemHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 0.5rem;
`;

const ItemName = styled.h3`
  font-size: 1rem;
  margin: 0;
  letter-spacing: 0.05em;
  text-shadow: 0 0 8px ${PIPBOY_COLORS.primary}88;
`;

const FavoriteButton = styled.button<{ active: boolean }>`
  background: transparent;
  border: none;
  color: ${props => props.active ? PIPBOY_COLORS.warning : PIPBOY_COLORS.primary + '66'};
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0;
  transition: all 0.2s;

  &:hover {
    color: ${PIPBOY_COLORS.warning};
    transform: scale(1.2);
  }
`;

const ItemDescription = styled.p`
  font-size: 0.75rem;
  margin: 0.5rem 0;
  opacity: 0.8;
  line-height: 1.4;
`;

const ItemTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
  margin: 0.75rem 0;
`;

const ItemTag = styled.span`
  background: ${PIPBOY_COLORS.primary}22;
  border: 1px solid ${PIPBOY_COLORS.primary}44;
  padding: 0.15rem 0.4rem;
  font-size: 0.6rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;
`;

const ItemStats = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid ${PIPBOY_COLORS.primary}22;
`;

const Stat = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.7rem;
`;

const StatKey = styled.span`
  opacity: 0.7;
  text-transform: uppercase;
`;

const StatValue = styled.span`
  font-weight: bold;
  text-shadow: 0 0 5px ${PIPBOY_COLORS.primary}88;
`;

const NoResults = styled.div`
  text-align: center;
  padding: 4rem 2rem;
`;

const NoResultsText = styled.div`
  font-size: 1.5rem;
  letter-spacing: 0.2em;
  margin-bottom: 1rem;
  opacity: 0.7;
  text-shadow: 0 0 10px ${PIPBOY_COLORS.primary}88;
`;

const NoResultsHint = styled.div`
  font-size: 0.85rem;
  opacity: 0.5;
`;

const Footer = styled.div`
  text-align: center;
  margin-top: 1rem;
  flex-shrink: 0;
`;

const FooterLine = styled.div`
  font-size: 0.5rem;
  letter-spacing: -1px;
  color: ${PIPBOY_COLORS.primary};
  opacity: 0.3;
  margin-bottom: 0.5rem;
`;

const FooterText = styled.div`
  font-size: 0.65rem;
  opacity: 0.6;
  letter-spacing: 0.1em;
`;

// ============================================================================
// MODAL STYLES
// ============================================================================

const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
`;

const ModalContent = styled(motion.div)`
  background: #0a0a0a;
  border: 2px solid ${PIPBOY_COLORS.primary};
  border-radius: 4px;
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow:
    0 0 40px ${PIPBOY_COLORS.primary}66,
    inset 0 0 20px rgba(0, 0, 0, 0.5);
  color: ${PIPBOY_COLORS.primary};

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

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid ${PIPBOY_COLORS.primary}44;
  background: ${PIPBOY_COLORS.primary}08;
`;

const ModalTitle = styled.h2`
  font-size: 1.5rem;
  margin: 0;
  letter-spacing: 0.1em;
  text-shadow: 0 0 10px ${PIPBOY_COLORS.primary};
`;

const ModalClose = styled.button`
  background: transparent;
  border: 1px solid ${PIPBOY_COLORS.primary}66;
  color: ${PIPBOY_COLORS.primary};
  width: 2.5rem;
  height: 2.5rem;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${PIPBOY_COLORS.primary}22;
    border-color: ${PIPBOY_COLORS.primary};
    transform: rotate(90deg);
  }
`;

const ModalBody = styled.div`
  padding: 2rem;
`;

const ModalCategory = styled.div`
  display: inline-block;
  background: ${PIPBOY_COLORS.primary}22;
  border: 1px solid ${PIPBOY_COLORS.primary};
  padding: 0.4rem 0.8rem;
  font-size: 0.7rem;
  letter-spacing: 0.15em;
  margin-bottom: 1rem;
`;

const ModalDescription = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  margin: 1.5rem 0;
  opacity: 0.9;
`;

const ModalImage = styled.img`
  width: 100%;
  height: auto;
  border: 1px solid ${PIPBOY_COLORS.primary}44;
  margin: 1.5rem 0;
  filter: contrast(1.1) brightness(0.9);
`;

const ModalSection = styled.div`
  margin: 2rem 0;
`;

const ModalSectionTitle = styled.h3`
  font-size: 1rem;
  letter-spacing: 0.1em;
  margin-bottom: 1rem;
  text-shadow: 0 0 8px ${PIPBOY_COLORS.primary}88;
`;

const ModalTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const ModalTag = styled.span`
  background: ${PIPBOY_COLORS.primary}22;
  border: 1px solid ${PIPBOY_COLORS.primary}66;
  padding: 0.4rem 0.8rem;
  font-size: 0.75rem;
  letter-spacing: 0.05em;
`;

const ModalStats = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
`;

const ModalStat = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.75rem;
  background: ${PIPBOY_COLORS.primary}05;
  border: 1px solid ${PIPBOY_COLORS.primary}22;
`;

const ModalStatKey = styled.span`
  opacity: 0.8;
  letter-spacing: 0.05em;
`;

const ModalStatValue = styled.span`
  font-weight: bold;
  text-shadow: 0 0 8px ${PIPBOY_COLORS.primary}88;
`;

const ModalFooter = styled.div`
  display: flex;
  gap: 1rem;
  padding: 1.5rem;
  border-top: 1px solid ${PIPBOY_COLORS.primary}44;
  background: ${PIPBOY_COLORS.primary}08;
`;

const ModalButton = styled.button`
  flex: 1;
  background: transparent;
  border: 1px solid ${PIPBOY_COLORS.primary}66;
  color: ${PIPBOY_COLORS.primary};
  padding: 0.75rem;
  font-family: 'Monofonto', monospace;
  font-size: 0.85rem;
  cursor: pointer;
  letter-spacing: 0.1em;
  transition: all 0.2s;

  &:hover {
    background: ${PIPBOY_COLORS.primary}22;
    border-color: ${PIPBOY_COLORS.primary};
    box-shadow: 0 0 15px ${PIPBOY_COLORS.primary}44;
  }
`;

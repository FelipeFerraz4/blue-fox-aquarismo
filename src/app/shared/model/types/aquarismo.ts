/**
 * Tipos do catálogo do Aquarismo, espelhando as respostas de `blog-api /api/v1/aquarismo/*`
 * (blue-fox-blog-backend, módulo `aquarismo`). Textos já vêm no idioma pedido, com fallback pt-BR;
 * `locale` diz qual idioma foi servido.
 */

export type WaterType = 'FRESH' | 'BRACKISH' | 'SALT';
export type Publication = 'DRAFT' | 'REVIEWED' | 'PUBLISHED';
export type Temperament = 'PEACEFUL' | 'SEMI_AGGRESSIVE' | 'AGGRESSIVE';
export type SwimLayer = 'SURFACE' | 'MIDDLE' | 'BOTTOM';
export type Difficulty = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
export type Diet = 'HERBIVORE' | 'OMNIVORE' | 'CARNIVORE';
export type Level = 'LOW' | 'MEDIUM' | 'HIGH';
export type Breeding = 'EASY' | 'MODERATE' | 'HARD';
export type TechLevel = 'LOW' | 'HIGH';
export type EquipmentType = 'FILTER' | 'HEATER' | 'LIGHTING' | 'CO2' | 'PUMP' | 'TEST_KIT' | 'SUBSTRATE' | 'OTHER';
export type SizingUnit = 'WATTS_PER_LITER' | 'TURNOVER_PER_HOUR' | 'NONE';
export type CompatibilityLevel = 'COMPATIBLE' | 'ATTENTION' | 'INCOMPATIBLE';

interface CatalogItem {
  id: string;
  slug: string;
  /** Idioma em que os textos vieram (pode ser o fallback). */
  locale: string;
  publication: Publication;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface SpeciesSummary {
  id: string;
  slug: string;
  scientificName: string;
  commonName: string;
}

export interface Species extends CatalogItem {
  scientificName: string;
  commonName: string;
  otherNames: string[];
  region: string | null;
  description: string;
  careNotes: string | null;
  waterType: WaterType;
  adultSizeCm: number;
  minVolumeL: number;
  minTankLengthCm: number;
  minGroupSize: number;
  tempMinC: number;
  tempMaxC: number;
  phMin: number;
  phMax: number;
  ghMin: number | null;
  ghMax: number | null;
  /** Temperamento da fêmea quando difere por sexo. */
  temperament: Temperament;
  /** Temperamento do macho quando difere (ex.: Betta AGGRESSIVE); null = igual a `temperament`. */
  maleTemperament: Temperament | null;
  finNipper: boolean;
  longFinned: boolean;
  territorial: boolean;
  conspecificAggression: boolean;
  layers: SwimLayer[];
  activity: Level;
  difficulty: Difficulty;
  diet: Diet;
  needsPlants: boolean;
  needsHiding: boolean;
  eatsPlants: boolean;
  jumps: boolean;
  breeding: Breeding;
  suitableForBreedingSale: boolean;
  imageUrl: string | null;
  sources: string[];
  lastReviewedAt: string | null;
  familyId: string | null;
  family: { id: string; slug: string; scientificName: string; name: string } | null;
  biomes: { id: string; slug: string; name: string }[];
}

/** Filtros da listagem de espécies (todos opcionais e combináveis). */
export interface SpeciesFilters {
  q?: string;
  waterType?: WaterType;
  /** Espécies que toleram esta temperatura (°C). */
  temperature?: number;
  ph?: number;
  /** Volume do aquário (L): espécies cujo mínimo cabe nele. */
  volume?: number;
  tankLength?: number;
  temperament?: Temperament;
  difficulty?: Difficulty;
  layer?: SwimLayer;
  biome?: string;
  family?: string;
  noFinNippers?: boolean;
}

export interface Family {
  id: string;
  slug: string;
  scientificName: string;
  locale: string;
  name: string;
  description: string | null;
  speciesCount?: number;
}

export interface Biome extends CatalogItem {
  name: string;
  region: string | null;
  description: string;
  substrate: string | null;
  hardscape: string | null;
  plants: string | null;
  waterType: WaterType;
  tempMinC: number;
  tempMaxC: number;
  phMin: number;
  phMax: number;
  ghMin: number | null;
  ghMax: number | null;
  current: Level;
  light: Level;
  techLevel: TechLevel;
  imageUrl: string | null;
  species: SpeciesSummary[];
}

export interface Equipment extends CatalogItem {
  type: EquipmentType;
  name: string;
  description: string;
  sizingNote: string | null;
  waterTypes: WaterType[];
  techLevel: TechLevel;
  minVolumeL: number | null;
  maxVolumeL: number | null;
  sizingUnit: SizingUnit;
  sizingMin: number | null;
  sizingMax: number | null;
  guideSlug: string | null;
  /** Faixa recomendada para o volume pedido (ex.: 50–100 W), quando há regra de dimensionamento. */
  recommended: { volumeL: number; min: number; max: number; unit: 'W' | 'L/h' } | null;
}

export interface CompatibilityReason {
  level: CompatibilityLevel;
  code: string;
  message: string;
}

export interface CompatibilityPair {
  a: string;
  b: string;
  level: CompatibilityLevel;
  reasons: CompatibilityReason[];
}

export interface CompatibilityReport {
  locale: string;
  /** Pior nível entre todos os pares. */
  level: CompatibilityLevel;
  species: SpeciesSummary[];
  pairs: CompatibilityPair[];
}

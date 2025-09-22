// Top-level interface for the provided JSON
export interface Broker {
  id: number;
  name?: string;
  image?: string;
  tag?: string;
  score?: string;
  license?: string;
  country?: string;
  years?: string;
  environmentRating?: string;
  website?: string;
  labels: string[];
  environmentDetails?: environmentDetails;
  contact?: string[];
  brokerLicenses: string[];
  about?: About;
  markets: Market[]; // empty array in sample; change to specific type if you know the shape
  spreads: SpreadInfo[] | null;
  mtServers: MtServer | null;
  licenses: LicenseInfo[] | null;
  environment: Environment | null;
  transactionData: TransactionData | null;
  marketing: Marketing | null;
  bizArea: BizAreaEntry[] | null;
  clones: CloneFirm[] | null;
  companies: CompanyEntry[] | null;
}

export interface environmentDetails {
  grade?: string;
  avgTransactionSpeed?: string;
  speedLabel?: string;
  mt4License?: string;
  mt4Server?: string;
  capital?: string;
  influenceGrade?: string;
  influenceScore?: string;
  influenceCountry?: string;
}

export interface About {
  brokerInformation?: string[];
  companyName?: string[];
  abbreviation?: string[];
  regulatoryStatus?: string[];
  companyWebsite?: string[];
  nbp?: string[];
  timeOfFirstCollection?: string[];
  phoneOfTheCompany?: string[];
  x?: string[];
  facebook?: string[];
  instagram?: string[];
  youtube?: string[];
  companyAddress?: string[];
  linkedin?: string[];
  whatsapp?: string[];
  qq?: string[];
  wechat?: string[];
  customerServiceEmailAddress?: string[];
  registeredRegion?: string[];
  operatingPeriod?: string[];
  contactNumber?: string[];
}

export interface Market {
  id: string;
  name: string;
}

/* Spread rows */
export interface SpreadInfo {
  id: number;
  broker_id?: number;
  tradingPair?: string;
  buy?: string;
  account?: string;
  spread?: string;
  avgSpreadDay?: string;
  longSwap?: string;
  shortSwap?: string;
}

/* MT/platform info */
export interface MtServer {
  id: number;
  broker_id: number;

  executionSpeed: string;

  licenses: string[]; // JSON array of strings

  servers: Array<{
    platform: string;
    brokerName: string;
    country: string;
    ping: string;
    leverage: string;
    serverIps: Array<{
      ip: string;
      ping: string;
      pingStatus: string;
      country: string;
      flag: string;
    }>;
  }>;

  countryRegion: Array<{
    country: string;
    flag: string;
    firstValue: string;
    secondValue: string;
  }>;
}

/* Regulator / license entries */
export interface LicenseInfo {
  id: number;
  broker_id?: number;
  flag?: string;
  regulator?: string;
  status?: string;
  country?: string;
  licenseType?: string;
}

export interface Environment {
  id: number;
  broker_id?: number;
  tabs: string[];
  speed: {
    label?: string;
    value?: string;
    rating?: string;
  }[];
  cost: Record<string, unknown>; // from statsValidator
  overnight: Record<string, unknown>; // from statsValidator
  slippage: Record<string, unknown>; // from extendedStatsValidator
  offline: Record<string, unknown>; // from extendedStatsValidator
  ranking: string[];
  summary: {
    ranking?: string; // e.g. "12 / 125"
    testUsers?: string; // e.g. "1,189"
    orders?: string; // e.g. "3,111"
    margin?: string;
  };
  chart?: {
    [key: string]: {
      labels?: string[];
      datasets?: {
        name?: string;
        data?: number[];
        [key: string]: unknown; // allow additional props
      }[];
    };
  };
  dataSource?: string;
  updatedAt?: string;
}

/* Transaction-related data */
export interface TransactionData {
  tabs: string[];
  tabsContent: TransactionTabContent[];
}

export interface TransactionTabContent {
  title: string;
  left?: TransactionLeftEntry[]; // some tabs have left content as array of entries
  right?: Record<string, any>; // right content is heterogeneous; use the concrete types below where appropriate
}

/* Generic left entries used in TransactionData */
export interface TransactionLeftEntry {
  title: string;
  content: {
    chartId?: string;
  } | null;
}

/* Marketing and analytics */
export interface Marketing {
  tabs: string[];
  blocks: MarketingBlock[];
  dataSource: string;
}

export interface MarketingBlock {
  title: string;
  items?: MarketingItem[] | null; // some blocks only have title (no items)
}

export interface MarketingItem {
  name: string | null;
  value: string | null;
}

/* Business area entries */
export interface BizAreaEntry {
  id: number;
  broker_id?: number;
  name: string;
  ranking: {
    country?: string;
    code?: string;
    value?: number;
    flag?: string;
  }[];
  chart: {
    labels?: string[];
    datasets?: {
      [key: string]: unknown; // datasetSchema not fully defined here
    }[];
  };
}

/* Clone firms (possible scams / clones) */
export interface CloneFirm {
  id: number;
  broker_id?: number;
  name?: string;
  link?: string;
  logo?: string;
  score?: number;
  tags: string[];
}

/* Companies list (VIP-not-activated example) */
export interface CompanyEntry {
  companyName: string;
  status: string;
  country: string;
  registrationNo: string;
  established: string;
  relatedSources: string;
  logoUrl: string;
  countryFlagUrl: string;
}

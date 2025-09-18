// Top-level interface for the provided JSON
export interface Broker {
  id: string;
  name: string;
  image: string;
  tag: string;
  score: string; // "9.50" in sample; keep string to match source, or change to number if you normalize
  license: string;
  labels: string[];
  country: CountryInfo;
  markets: Market[]; // empty array in sample; change to specific type if you know the shape
  basicInfo: BasicInfo | null;
  spreads: SpreadInfo[] | null;
  mtServers: MtServer[] | null;
  licenses: LicenseInfo[] | null;
  environment: Environment | null;
  transactionData: TransactionData | null;
  marketing: Marketing | null;
  bizArea: BizAreaEntry[] | null;
  clones: CloneFirm[] | null;
  companies: CompanyEntry[] | null;
}

export interface Market {
  id: string;
  name: string;
}

export interface CountryInfo {
  years: string; // "15-20 years"
}

/* Basic info placeholder (fields in your sample are keys, but values are generic placeholders) */
export interface BasicInfo {
  registeredRegion: string | null;
  operatingPeriod: string | null;
  companyName: string | null;
  contactNumber: string | null;
  companyWebsite: string | null;
  Facebook: string | null;
}

/* Spread rows */
export interface SpreadInfo {
  _id: string;
  tradingPair: string;
  buy: string; // numeric-like but represented as string in sample
  account: string;
  spread: string;
  avgSpreadDay: string;
  longSwap: string;
  shortSwap: string;
}

/* MT/platform info */
export interface MtServer {
  id: string
  platform: string
  serverName: string
  country: string
  leverageList: string
  // leverageTable: {},
  serverIp: string
  ping: string
  company: string
  logo: string
  rating: string
}

/* Regulator / license entries */
export interface LicenseInfo {
  _id: string;
  flag: string;
  regulator: string;
  status: string;
  country: string;
  licenseType: string;
}

/* Environment / performance cards */
export interface Environment {
  tabs: string[];
  speed: SpeedEntry[];
  cost: CostEntry[];
  overnight: OvernightEntry[];
  slippage: SlippageEntry[];
  offline: OfflineEntry[];
  summary: EnvironmentSummary;
  dataSource: string;
  updatedAt: string; // timestamp string "YYYY-MM-DD HH:mm:ss"
}

export interface SpeedEntry {
  label: string;
  value: string; // e.g. "717.8"
  rating: string | null; // e.g. "Poor"
}

export interface CostEntry {
  value: string; // e.g. "13.66USD/Lot"
  rating: string | null; // e.g. "Average"
}

export interface OvernightEntry {
  value: string; // e.g. "Long: -2.73USD/Lot"
  rating: string | null;
}

export interface SlippageEntry {
  label: string;
  value: string; // e.g. "-0.2"
  rating: string | null;
}

export interface OfflineEntry {
  label: string;
  value: string; // e.g. "0.2"
  rating: string | null; // can be null
}

export interface EnvironmentSummary {
  ranking: string; // e.g. "12 / 125"
  testUsers: string; // e.g. "1,189"
  orders: string; // e.g. "3,111"
  margin: string; // e.g. "$4,077,649 USD"
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
  _id: string;
  country: string;
  code: string;
  value: number;
  flag: string;
}

/* Clone firms (possible scams / clones) */
export interface CloneFirm {
  name: string;
  link: string;
  logo: string;
  score: number;
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

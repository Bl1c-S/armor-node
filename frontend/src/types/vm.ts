export type BillingCycle = "monthly" | "yearly";

export type DiskType = "NVMe Gen4" | "NVMe Gen4 RAID10" | "Enterprise SATA SSD";

export interface VmSpecs {
  vcpu: number;
  cpuModel: string;
  ramGb: number;
  diskGb: number;
  diskType: DiskType;
  bandwidthTb: number | "unmetered";
  portSpeedGbps: number;
  ddosCapacityTbps: number;
}

export interface PresetPlan {
  id: string;
  name: string;
  tagline: string;
  badge?: string;
  isPopular?: boolean;
  specs: VmSpecs;
  monthlyPrice: number;
  yearlyPrice: number;
  features: string[];
}

export interface OperatingSystem {
  id: string;
  name: string;
  version: string;
  family: "linux" | "windows" | "bsd";
  icon: string;
  recommended?: boolean;
  additionalMonthlyCost?: number;
}

export interface VmAddonsConfig {
  dailyBackups: boolean;
  extraIpv4Count: number;
  ddosGameShield: boolean;
  bgpAnycast: boolean;
}

export interface CustomVmConfig {
  vcpu: number;
  ramGb: number;
  diskGb: number;
  selectedOsId: string;
  selectedDatacenterId: string;
  billingCycle: BillingCycle;
  addons: VmAddonsConfig;
}

export interface PricingBreakdown {
  basePrice: number;
  osCost: number;
  addonsCost: number;
  discountAmount: number;
  subtotal: number;
  finalPrice: number;
  billingCycle: BillingCycle;
}

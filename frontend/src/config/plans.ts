import { PresetPlan } from "@/types/vm";

export const PRESET_PLANS: PresetPlan[] = [
  {
    id: "plan-starter",
    name: "Starter Shield",
    tagline: "Ideal for lightweight apps, personal VPNs, DNS servers, and testing.",
    specs: {
      vcpu: 1,
      cpuModel: "AMD EPYC 9654 (3.7GHz)",
      ramGb: 2,
      diskGb: 40,
      diskType: "NVMe Gen4",
      bandwidthTb: 5,
      portSpeedGbps: 1,
      ddosCapacityTbps: 3.2,
    },
    monthlyPrice: 4.99,
    yearlyPrice: 3.99,
    features: [
      "1 Dedicated AMD EPYC Core",
      "2 GB DDR5 ECC Memory",
      "40 GB NVMe Gen4 Storage",
      "3.2 Tbps L3-L7 ArmorShield™",
      "1 Dedicated IPv4 + /64 IPv6",
      "Instant 55s Automated Deployment",
    ],
  },
  {
    id: "plan-compute",
    name: "Compute Armor",
    tagline: "Our most popular VM for production web servers, APIs, and SaaS backends.",
    badge: "MOST POPULAR",
    isPopular: true,
    specs: {
      vcpu: 2,
      cpuModel: "AMD EPYC 9654 (3.7GHz)",
      ramGb: 4,
      diskGb: 80,
      diskType: "NVMe Gen4",
      bandwidthTb: 10,
      portSpeedGbps: 2.5,
      ddosCapacityTbps: 3.2,
    },
    monthlyPrice: 9.99,
    yearlyPrice: 7.99,
    features: [
      "2 Dedicated AMD EPYC Cores",
      "4 GB DDR5 ECC Memory",
      "80 GB NVMe Gen4 Storage",
      "3.2 Tbps L3-L7 ArmorShield™",
      "Automated Daily Snapshot",
      "1 Dedicated IPv4 + /64 IPv6",
      "BGP Anycast Routing",
    ],
  },
  {
    id: "plan-highfreq",
    name: "High-Freq Fortress",
    tagline: "High single-thread clock speed for game servers, trading bots & real-time apps.",
    badge: "ULTRA FAST",
    specs: {
      vcpu: 4,
      cpuModel: "AMD Ryzen 9 7950X (5.7GHz Turbo)",
      ramGb: 16,
      diskGb: 180,
      diskType: "NVMe Gen4 RAID10",
      bandwidthTb: 20,
      portSpeedGbps: 10,
      ddosCapacityTbps: 3.2,
    },
    monthlyPrice: 24.99,
    yearlyPrice: 19.99,
    features: [
      "4 Dedicated 5.7GHz Turbo Cores",
      "16 GB DDR5 5600MHz RAM",
      "180 GB PCIe 4.0 RAID10 NVMe",
      "Specialized Game L7 UDP Mitigation",
      "Unmetered 10 Gbps Burst Uplink",
      "Hourly Snapshots & REST API Access",
    ],
  },
  {
    id: "plan-enterprise",
    name: "Enterprise Titan",
    tagline: "Maximum throughput and memory for big data, container clusters & heavy workloads.",
    specs: {
      vcpu: 8,
      cpuModel: "Dual AMD EPYC Zen 4",
      ramGb: 32,
      diskGb: 400,
      diskType: "NVMe Gen4 RAID10",
      bandwidthTb: "unmetered",
      portSpeedGbps: 10,
      ddosCapacityTbps: 3.2,
    },
    monthlyPrice: 49.99,
    yearlyPrice: 39.99,
    features: [
      "8 Dedicated EPYC Zen4 Cores",
      "32 GB DDR5 ECC Registered RAM",
      "400 GB NVMe Gen4 RAID10",
      "3.2 Tbps Enterprise DDoS SLA",
      "Priority VIP 24/7 Discord & Phone Support",
      "Custom BGP / Bring Your Own IP (BYOIP)",
    ],
  },
];

export const CUSTOM_CONFIG_LIMITS = {
  vcpu: { min: 1, max: 32, step: 1, default: 4 },
  ramGb: { min: 2, max: 128, step: 2, default: 8 },
  diskGb: { min: 25, max: 1000, step: 25, default: 120 },
} as const;

export const ADDON_PRICING = {
  dailyBackupPercent: 0.15, // +15%
  extraIpv4Monthly: 2.5,    // $2.50 per IP
  ddosGameShieldMonthly: 0, // Free
  bgpAnycastMonthly: 0,     // Free
} as const;

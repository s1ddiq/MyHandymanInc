export type CityData = {
  slug: string;
  name: string;
  secondaryCity?: string; // For pages that serve two cities like Orange & Woodbridge
  county: string;
  region: string;
  zipCodes: string[];
  neighborhoods: string[];
  specificProblems?: string[];
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  heroBadge: string;
  heroTitle: string;
  heroSubtitle: string;
  whyChooseTitle: string;
  whyChooseSubtitle: string;
  serviceAreasTitle: string;
  serviceAreasSubtitle: string;
  ctaTitle: string;
  ctaSubtitle: string;
};

export const cities: Record<string, CityData> = {
  shelton: {
    slug: "shelton",
    name: "Shelton",
    county: "Fairfield County",
    region: "Housatonic River area",
    zipCodes: ["06484"],
    neighborhoods: [
      "Huntington Center",
      "White Hills",
      "Long Hill",
      "Booth Hill",
      "Downtown Riverwalk",
    ],
    specificProblems: [
      "Refrigerator not cooling during summer heat waves near the river",
      "Freezer icing up in humid Huntington Center basements",
      "Washer draining issues in historic White Hills homes",
    ],
    metaTitle: "Appliance Repair Shelton, CT | My Handyman Inc",
    metaDescription:
      "Fast & reliable appliance repair in Shelton, CT. Same-day service for refrigerators, washers, dryers, ovens & more. Serving Huntington Center, White Hills & all Shelton neighborhoods.",
    keywords:
      "appliance repair Shelton CT, refrigerator repair Shelton, washer dryer repair Shelton, Samsung appliance repair Shelton, My Handyman Inc Shelton",
    heroBadge: "Serving Shelton, CT Since 2012",
    heroTitle: "Fast & Reliable Appliance Repair in Shelton",
    heroSubtitle:
      "Same-day service for refrigerators, washers, dryers, ovens, and more. Serving Huntington Center, White Hills, Long Hill, and all Shelton neighborhoods.",
    whyChooseTitle: "Why Shelton Homeowners Trust Us",
    whyChooseSubtitle:
      "We're your neighbors in Shelton, committed to honest work and lasting relationships.",
    serviceAreasTitle: "Serving All of Shelton, Connecticut",
    serviceAreasSubtitle:
      "Fast response times throughout Shelton's beautiful neighborhoods along the Housatonic River",
    ctaTitle: "Schedule Appliance Repair in Shelton Today",
    ctaSubtitle:
      "Need fast, professional appliance repair in Shelton? Call or email us now for same-day service and free estimates!",
  },
  orange: {
    slug: "orange",
    name: "Orange",
    secondaryCity: "Woodbridge",
    county: "New Haven County",
    region: "Greater New Haven area",
    zipCodes: ["06477", "06525"],
    neighborhoods: ["Orange Center", "Turkey Hill", "Race Brook", "Peck Hill"],
    metaTitle: "Appliance Repair Orange & Woodbridge CT | My Handyman Inc",
    metaDescription:
      "Fast & reliable appliance repair in Orange and Woodbridge, CT. Same-day service for refrigerators, washers, dryers, ovens & more. Samsung & LG specialists.",
    keywords:
      "appliance repair Orange CT, appliance repair Woodbridge CT, refrigerator repair, washer dryer repair, Samsung appliance repair, LG appliance repair, My Handyman Inc Connecticut",
    heroBadge: "Serving Orange & Woodbridge, CT Since 2012",
    heroTitle: "Fast & Reliable Appliance Repair",
    heroSubtitle:
      "Same-day service for refrigerators, washers, dryers, ovens, and more. Samsung & LG specialists. Family-owned.",
    whyChooseTitle: "Why Connecticut Trusts Us for Appliance Repair",
    whyChooseSubtitle:
      "We're your neighbors, committed to honest work and lasting relationships.",
    serviceAreasTitle: "Serving Orange & Woodbridge, CT",
    serviceAreasSubtitle:
      "Fast response times throughout both communities. We know Connecticut homes and their appliance needs.",
    ctaTitle: "Schedule Appliance Repair Today",
    ctaSubtitle:
      "If you need fast, professional appliance repair in Orange or Woodbridge, trust My Handyman Inc. Call or email us now for same-day service and free estimates!",
  },
  woodbridge: {
    slug: "woodbridge",
    name: "Woodbridge",
    county: "New Haven County",
    region: "Amity region",
    zipCodes: ["06525"],
    neighborhoods: ["Amity Road", "Racebrook", "Beecher Road", "Meeting House"],
    metaTitle: "Appliance Repair Woodbridge, CT | My Handyman Inc",
    metaDescription:
      "Reliable appliance repair in Woodbridge, CT. Same-day service for refrigerators, washers, dryers, ovens. Serving Amity Road, Racebrook & all Woodbridge neighborhoods.",
    keywords:
      "appliance repair Woodbridge CT, refrigerator repair Woodbridge, washer dryer repair Woodbridge, Samsung appliance repair Woodbridge",
    heroBadge: "Serving Woodbridge, CT Since 2012",
    heroTitle: "Fast & Reliable Appliance Repair in Woodbridge",
    heroSubtitle:
      "Same-day service for refrigerators, washers, dryers, ovens, and more. Serving Amity Road, Racebrook, and all Woodbridge neighborhoods.",
    whyChooseTitle: "Why Woodbridge Homeowners Trust Us",
    whyChooseSubtitle:
      "We're your neighbors in Woodbridge, committed to honest work and lasting relationships.",
    serviceAreasTitle: "Serving All of Woodbridge, Connecticut",
    serviceAreasSubtitle:
      "Fast response times throughout Woodbridge's beautiful neighborhoods near the Amity region",
    ctaTitle: "Schedule Appliance Repair in Woodbridge Today",
    ctaSubtitle:
      "Need fast, professional appliance repair in Woodbridge? Call or email us now for same-day service and free estimates!",
  },
};

export const defaultCity: CityData = {
  slug: "default",
  name: "Connecticut",
  county: "",
  region: "",
  zipCodes: [],
  neighborhoods: [],
  metaTitle: "Appliance Repair Connecticut | My Handyman Inc",
  metaDescription:
    "Professional appliance repair services across Connecticut. Same-day service for refrigerators, washers, dryers, ovens. Family-owned since 2012.",
  keywords:
    "appliance repair Connecticut, refrigerator repair, washer dryer repair, Samsung appliance repair",
  heroBadge: "Serving Connecticut Since 2012",
  heroTitle: "Fast & Reliable Appliance Repair in Connecticut",
  heroSubtitle:
    "Same-day service for refrigerators, washers, dryers, ovens, and more. Samsung & LG specialists. Family-owned.",
  whyChooseTitle: "Why Connecticut Trusts Us for Appliance Repair",
  whyChooseSubtitle:
    "We're your neighbors, committed to honest work and lasting relationships.",
  serviceAreasTitle: "Serving Connecticut",
  serviceAreasSubtitle:
    "Fast response times throughout the state. We know Connecticut homes and their appliance needs.",
  ctaTitle: "Schedule Appliance Repair Today",
  ctaSubtitle:
    "Need fast, professional appliance repair in Connecticut? Call or email us now for same-day service and free estimates!",
};

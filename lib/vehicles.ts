/**
 * JMC Georgia catalogue schema.
 * No model, trim, price or specification is published without an approved Georgia-market source.
 * Replace this repository-backed registry with a CMS adapter later.
 */
export type Feature = { label: string; value: string };
export type Trim = {
  id: string;
  name: string;
  priceGEL?: number;
  powertrain?: string;
  drivetrain?: string;
  transmission?: string;
  features: Feature[];
};
export type Vehicle = {
  slug: string;
  name: string;
  category: 'pickup' | 'suv' | 'commercial' | 'other';
  description: string;
  heroImage?: string;
  gallery: string[];
  trims: Trim[];
  highlighted?: boolean;
};
export const vehicles: Vehicle[] = [];
export const getVehicle = (slug: string) => vehicles.find(v => v.slug === slug);
export const categoryLabels: Record<Vehicle['category'], string> = {
 pickup: 'პიკაპი', suv: 'SUV', commercial: 'კომერციული', other: 'სხვა'
};

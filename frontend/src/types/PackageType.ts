export interface PackageType {
  name: string;
  subTitle?: string;
  price: number;
  features: string[];
  color: string;
  badge?: string | null;
}

export interface PackageColorType {
  border: string;
  shadow: string;
  gradient: string;
  badge: string;
  dot: string;
  divider: string;
}

export type KalesaFare = {
  regular: number;
  discounted: number;
};

export type KalesaCodeEntry = {
  routeId: string;
  routeColor?: string;
  routeFare?: KalesaFare;

  image?: string;
  places?: string[];

  description?: string;
  operatingHours?: string;
  estimatedTravelTime?: string;
};

export type KalesaRoute = {
  routeId: string;
  name: string;
  routeColor?: string;
  routeFare?: KalesaFare;
  hasGeoJson: boolean;
};

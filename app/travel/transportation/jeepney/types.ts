export type JeepneyFare = {
  regular: number;
  discounted: number;
};

export type JeepneyCodeEntry = {
  routeId: string;
  routeName: string;
  routeColor?: string;
  routeFare?: JeepneyFare;

  image?: string;
  places?: string[];

  description?: string;
  operatingHours?: string;
  estimatedTravelTime?: string;
};

export type JeepneyRoute = {
  routeId: string;
  routeName: string;
  routeColor?: string;
  routeFare?: JeepneyFare;
  hasGeoJson: boolean;
};

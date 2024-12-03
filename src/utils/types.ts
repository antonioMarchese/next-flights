export type IconType = React.ForwardRefExoticComponent<
  Omit<React.SVGProps<SVGSVGElement>, "ref">
>;

export type SelectType = {
  name: string;
  value: string | number;
};

export type CabinClassType =
  | "economy"
  | "premium_economy"
  | "business"
  | "first";

export type FlightsFormData = {
  from?: string;
  to?: string;
  cabinClass?: CabinClassType;
  type?: 0 | 1;
  goingDate?: Date;
  returningDate?: Date;
};

type AirportsPresentation = {
  title: string;
  subtitle: string;
  suggestionTitle: string;
};

type AirpotrsRelevantFlightParams = {
  entityId: string;
  flightPlaceType: string;
  localizedName: string;
  skyId: string;
};

type AirportsNavigation = {
  entityId: string;
  entityType: string;
  localizedName: string;
  relevantFlightParams: AirpotrsRelevantFlightParams;
};

export type AirportsProps = {
  entityId: string;
  skyId: string;
  navigation: AirportsNavigation;
  presentation: AirportsPresentation;
};

export type GetFlightsParams = {
  originSkyId: string;
  destinationSkyId: string;
  originEntityId: string;
  destinationEntityId: string;
  cabinClass: string;
  adults: number;
  date: string;
  returnDate: string;
};

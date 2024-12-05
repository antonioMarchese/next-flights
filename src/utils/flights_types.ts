type FlightPlace = {
  flightPlaceId: string;
  displayCode: string;
  name: string;
  type: string;
  parent?: {
    flightPlaceId: string;
    displayCode: string;
    name: string;
    type: string;
  };
};

type Carrier = {
  id: number;
  logoUrl: string;
  name: string;
  alternateId?: string;
  allianceId?: number;
};

type Segment = {
  id: string;
  origin: FlightPlace;
  destination: FlightPlace;
  departure: string;
  arrival: string;
  durationInMinutes: number;
  flightNumber: string;
  marketingCarrier: Carrier;
  operatingCarrier: Carrier;
};

type Leg = {
  id: string;
  origin: Omit<FlightPlace, "type" | "parent"> & {
    city: string;
    isHighlighted: boolean;
  };
  destination: Omit<FlightPlace, "type" | "parent"> & {
    city: string;
    isHighlighted: boolean;
  };
  durationInMinutes: number;
  stopCount: number;
  isSmallestStops: boolean;
  departure: string;
  arrival: string;
  timeDeltaInDays: number;
  carriers: {
    marketing: Carrier[];
    operationType: string;
  };
  segments: Segment[];
};

type Price = {
  raw: number;
  formatted: string;
};

export type FlightsProps = {
  id: string;
  price: Price;
  legs: Leg[];
  isSelfTransfer: boolean;
  isProtectedSelfTransfer: boolean;
  farePolicy: {
    isChangeAllowed: boolean;
    isPartiallyChangeable: boolean;
    isCancellationAllowed: boolean;
    isPartiallyRefundable: boolean;
  };
  eco: {
    ecoContenderDelta: number;
  };
  tags: string[];
  isMashUp: boolean;
  hasFlexibleOptions: boolean;
  score: number;
};

type Context = {
  status: string;
  totalResults: number;
};

type FilterStats = {
  duration: {
    min: number;
    max: number;
  };
  airports: {
    city: string;
    airports: {
      id: string;
      name: string;
    }[];
  }[];
  carriers: Carrier[];
  stopPrices: {
    direct: {
      isPresent: boolean;
      formattedPrice: string;
    };
    one: {
      isPresent: boolean;
      formattedPrice: string;
    };
    twoOrMore?: {
      isPresent: boolean;
    };
  };
};

export type FlightsResponseData = {
  status: boolean;
  timestamp: number;
  sessionId: string;
  data: {
    context: Context;
    itineraries: FlightsProps[];
    messages: any[];
    filterStats: FilterStats;
  };
};

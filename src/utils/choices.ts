import { SelectType } from "./types";

export const FLIGHT_TYPES: SelectType[] = [
  {
    name: "Ida e volta",
    value: 0,
  },
  {
    name: "Só ida",
    value: 1,
  },
];

export const CABIN_CLASSES: SelectType[] = [
  {
    name: "Econômica",
    value: "economy",
  },
  {
    name: "Econômica premium",
    value: "premium_economy",
  },
  {
    name: "Executiva",
    value: "business",
  },
  {
    name: "Primeira",
    value: "first",
  },
];

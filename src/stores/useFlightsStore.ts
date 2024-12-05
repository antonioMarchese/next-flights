import { FlightsProps } from "@/utils/flights_types";
import { create } from "zustand";

export type FlightsStore = {
  flights: Array<FlightsProps>;
  hasSearched: boolean;
  setFlights: (flights: Array<FlightsProps>) => void;
  setHasSearched: (value: boolean) => void;
  isFetching: boolean;
  setIsFetching: (value: boolean) => void;
};

export const useFlightsStore = create<FlightsStore>((set) => ({
  flights: [],
  hasSearched: false,
  isFetching: false,
  setFlights: (flights: Array<FlightsProps>) => set(() => ({ flights })),
  setHasSearched: (value: boolean) => set(() => ({ hasSearched: value })),
  setIsFetching: (value: boolean) => set(() => ({ isFetching: value })),
}));

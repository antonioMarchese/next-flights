import { FlightsFormData } from "@/utils/types";
import { create } from "zustand";

export type FlightsFormStore = {
  data: FlightsFormData;
  setData: (data: FlightsFormData) => void;
};

export const useFlightsFormStore = create<FlightsFormStore>((set) => ({
  data: {
    from: undefined,
    to: undefined,
    cabinClass: "economy",
    goingDate: undefined,
    returningDate: undefined,
    type: 0,
  },
  setData: (data: FlightsFormData) => set(() => ({ data })),
}));

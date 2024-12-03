import { useModalStore } from "@/stores/useAirportsModalStore";
import Modal from "./modal";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, UseFormReturn } from "react-hook-form";
import { Form, FormField, FormControl, FormItem } from "../ui/form";
import { FormInput } from "../ui/input";
import { MagnifyingGlassIcon, MapPinIcon } from "@heroicons/react/24/outline";
import { Button } from "../ui/button";
import rapidAPIService from "@/services/rapidAPI.service";
import { useState } from "react";
import { AirportsProps } from "@/utils/types";
import { useFlightsFormStore } from "@/stores/useFlightsFormStore";

const airportsFormSchema = z.object({
  airport: z.string(),
});

type AirportsFormData = z.infer<typeof airportsFormSchema>;

interface AiportsModalProps {
  flightsForm: UseFormReturn<
    {
      originSkyId: string;
      destinationSkyId: string;
      originEntityId: string;
      destinationEntityId: string;
      cabinClass: string;
      adults?: number;
      date: Date;
      type?: string | undefined;
      returnDate?: Date | undefined;
    },
    any,
    undefined
  >;
}

export default function AirportsModal({ flightsForm }: AiportsModalProps) {
  const form = useForm<AirportsFormData>({
    resolver: zodResolver(airportsFormSchema),
  });

  const { isOpen, setIsOpen, isFrom } = useModalStore();
  const { data: flightsFormData, setData: setFlightsFormData } =
    useFlightsFormStore();

  const [airports, setAirports] = useState<Array<AirportsProps>>([]);

  async function handleSubmit({ airport }: AirportsFormData) {
    if (!airport.trim()) {
      return setAirports([]);
    }
    try {
      const response = await rapidAPIService.getAirports(airport);
      if (response.status === 200) {
        const data = await response.json();
        setAirports(data.data as AirportsProps[]);
      }
    } catch (error) {
      console.error("Erro ao buscar aeroportos");
    }
  }

  function handleSelectAirport(airport: AirportsProps) {
    if (isFrom) {
      setFlightsFormData({
        ...flightsFormData,
        from: airport.presentation.title,
      });
      flightsForm.setValue("originEntityId", airport.entityId);
      flightsForm.setValue("originSkyId", airport.skyId);
    } else {
      setFlightsFormData({
        ...flightsFormData,
        to: airport.presentation.title,
      });
      flightsForm.setValue("destinationEntityId", airport.entityId);
      flightsForm.setValue("destinationSkyId", airport.skyId);
    }

    setIsOpen(false);
    setAirports([]);
    form.setValue("airport", "");
  }

  return (
    <Modal open={isOpen} onOpenChange={setIsOpen} title="Escolha um aeroporto">
      <div className="w-full h-full flex flex-col gap-2 items-center justify-start mt-3">
        <Form {...form}>
          <form
            className="w-full flex items-start justify-center gap-2"
            onSubmit={form.handleSubmit(handleSubmit)}
          >
            <FormField
              control={form.control}
              name="airport"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <FormInput {...field} icon={MapPinIcon} />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button className="m-0 h-10 lg:h-12 text-zinc-400 bg-zinc-600 hover:bg-zinc-500 hover:text-zinc-700 rounded-lg">
              <MagnifyingGlassIcon className="size-6" />
            </Button>
          </form>
        </Form>
        {airports.length > 0 && (
          <div className="w-full h-full overflow-y-auto flex flex-col items-center justify-start gap-2">
            {airports.map((airport, index) => (
              <button
                onClick={() => {
                  handleSelectAirport(airport);
                }}
                type="button"
                className="w-full px-2 py-3 bg-zinc-800 hover:bg-zinc-700 cursor-pointer rounded-md flex items-center justify-start"
                key={index}
              >
                <p className="w-full text-left text-lg text-zinc-400">
                  {airport.presentation.suggestionTitle}
                </p>
              </button>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
}

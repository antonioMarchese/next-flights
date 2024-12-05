import { add, format } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";

import {
  CalendarIcon,
  CheckIcon,
  GlobeAltIcon,
  MagnifyingGlassIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import * as Select from "@radix-ui/react-select";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CABIN_CLASSES, FLIGHT_TYPES } from "@/utils/choices";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { Calendar } from "./ui/calendar";
import { useFlightsFormStore } from "@/stores/useFlightsFormStore";
import { CabinClassType, GetFlightsParams } from "@/utils/types";
import { useModalStore } from "@/stores/useAirportsModalStore";
import AirportsModal from "./general/airportsModal";
import rapidAPIService from "@/services/rapidAPI.service";
import { useFlightsStore } from "@/stores/useFlightsStore";
import { FlightsProps, FlightsResponseData } from "@/utils/flights_types";

const flightsFormSchema = z.object({
  originSkyId: z.string(),
  destinationSkyId: z.string(),
  originEntityId: z.string(),
  destinationEntityId: z.string(),
  cabinClass: z.string(),
  adults: z.number().optional(),
  type: z.string().optional(),
  date: z.date(),
  returnDate: z.date().optional(),
});

type FlightsFormData = z.infer<typeof flightsFormSchema>;

export default function FlightsForm() {
  const form = useForm<FlightsFormData>({
    resolver: zodResolver(flightsFormSchema),
    defaultValues: {
      cabinClass: "economy",
      type: "0",
    },
  });

  const { data, setData } = useFlightsFormStore();
  const { setFlights, setHasSearched, isFetching, setIsFetching } =
    useFlightsStore();
  const { setIsOpen, setIsFrom } = useModalStore();

  async function handleSubmit(formData: FlightsFormData) {
    setIsFetching(true);
    const submittingData: GetFlightsParams = {
      ...formData,
      adults: 1,
      date: formData.date.toISOString().split("T")[0],
      returnDate: undefined,
    };

    if (formData.returnDate)
      submittingData.returnDate = formData.returnDate
        .toISOString()
        .split("T")[0];

    try {
      const response = await rapidAPIService.getFlights(submittingData);
      if (response.status === 200) {
        const responseData = (await response.json()) as FlightsResponseData;
        setFlights(responseData.data.itineraries as FlightsProps[]);
        setHasSearched(true);
      }
    } catch (error) {
      console.error({ error });
    } finally {
      setIsFetching(false);
    }
  }

  function handleChangeFlightType(value: string) {
    const newData = { ...data };

    if (Number(value)) {
      newData.returningDate = undefined;
      form.setValue("returnDate", undefined);
    }

    setData({ ...newData, type: Number(value) as 0 | 1 });
    form.setValue("type", value);
  }

  function handleChangeCabinClass(value: string) {
    setData({
      ...data,
      cabinClass: value as CabinClassType,
    });
    form.setValue("cabinClass", value);
  }

  function handleClickFrom() {
    setIsFrom(true);
    setIsOpen(true);
  }

  function handleClickTo() {
    setIsFrom(false);
    setIsOpen(true);
  }

  return (
    <div className="w-full flex">
      <AirportsModal flightsForm={form} />

      <Form {...form}>
        <form
          className="w-full flex flex-col items-start justify-center gap-2"
          onSubmit={form.handleSubmit(handleSubmit)}
        >
          <div className="w-full flex items-center justify-start gap-2">
            <Select.Root onValueChange={handleChangeFlightType}>
              <Select.Trigger className="text-zinc-400 hover:bg-zinc-700/50 px-2 py-1 rounded-sm data-[state=open]:bg-zinc-700/50 flex items-center group gap-2 data-[state=open]:text-sky-500">
                <Select.Value defaultValue={"0"} placeholder="Ida e volta" />
                <Select.Icon className="text-[8px]" />
              </Select.Trigger>

              <Select.Portal>
                <Select.Content
                  className="py-2 bg-zinc-700"
                  position="popper"
                  sideOffset={5}
                >
                  <Select.Viewport>
                    {FLIGHT_TYPES.map((flightType) => (
                      <Select.Item
                        className="bg-transparent hover:bg-zinc-600/50 outline-none px-2 py-3 flex items-center justify-start gap-2 min-w-36 cursor-pointer data-[state=checked]:bg-zinc-600/50 data-[state=checked]:text-sky-400"
                        key={flightType.value}
                        value={String(flightType.value)}
                      >
                        <div className="size-4">
                          {data.type === flightType.value && (
                            <CheckIcon className="text-zinc-500 size-4" />
                          )}
                        </div>
                        <Select.ItemText>{flightType.name}</Select.ItemText>
                      </Select.Item>
                    ))}
                  </Select.Viewport>
                </Select.Content>
              </Select.Portal>
            </Select.Root>

            <Select.Root onValueChange={handleChangeCabinClass}>
              <Select.Trigger className="text-zinc-400 hover:bg-zinc-700/50 px-2 py-1 rounded-sm data-[state=open]:bg-zinc-700/50 flex items-center group gap-2 data-[state=open]:text-sky-500">
                <Select.Value
                  defaultValue={"enconomy"}
                  placeholder="Econômica"
                />
                <Select.Icon className="text-[8px]" />
              </Select.Trigger>

              <Select.Portal>
                <Select.Content
                  className="py-2 bg-zinc-700"
                  position="popper"
                  sideOffset={5}
                >
                  <Select.Viewport>
                    {CABIN_CLASSES.map((cabinClass) => (
                      <Select.Item
                        className="bg-transparent hover:bg-zinc-600/50 outline-none px-2 py-3 flex items-center justify-start gap-2 min-w-36 cursor-pointer data-[state=checked]:bg-zinc-600/50 data-[state=checked]:text-sky-400"
                        key={cabinClass.value}
                        value={String(cabinClass.value)}
                      >
                        <div className="size-4">
                          {data.cabinClass === cabinClass.value && (
                            <CheckIcon className="text-zinc-500 size-4" />
                          )}
                        </div>
                        <Select.ItemText>{cabinClass.name}</Select.ItemText>
                      </Select.Item>
                    ))}
                  </Select.Viewport>
                </Select.Content>
              </Select.Portal>
            </Select.Root>
          </div>
          <div className="w-full flex items-center justify-between gap-2">
            <FormItem>
              <button
                onClick={handleClickFrom}
                className="w-full h-10 lg:h-12 bg-transparent disabled:bg-neutral-300 disabled:text-neutral-400 py-3 pl-4 flex items-center justify-start gap-2 rounded-md border placeholder:text-neutral-400 text-white border-zinc-500 focus:border-zinc-400 outline-none text-[14px] lg:text-base font-medium"
              >
                <GlobeAltIcon className="size-4 text-zinc-400" />
                {data.from ?? "Local de partida"}
              </button>
            </FormItem>
            <FormItem>
              <button
                onClick={handleClickTo}
                className="w-full h-10 lg:h-12 bg-transparent disabled:bg-neutral-300 disabled:text-neutral-400 py-3 pl-4 flex items-center justify-start gap-2 rounded-md border placeholder:text-neutral-400 text-white border-zinc-500 focus:border-zinc-400 outline-none text-[14px] lg:text-base font-medium"
              >
                <MapPinIcon className="size-4 text-zinc-400" />
                {data.to ?? "Local de chegada"}
              </button>
            </FormItem>
          </div>
          <div className="w-full flex items-center justify-between gap-2">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col w-full">
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          type="button"
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal border-zinc-500",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "P", { locale: ptBR })
                          ) : (
                            <span>Data de ida</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-auto p-0 border border-zinc-800"
                      align="start"
                    >
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={(date) => {
                          field.onChange(date);
                          setData({ ...data, goingDate: date });
                        }}
                        disabled={(date) => {
                          const baseCondition =
                            date <
                            add(new Date(), {
                              days: -1,
                            });

                          if (data.returningDate) {
                            return baseCondition || date > data.returningDate;
                          }
                          return baseCondition;
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </FormItem>
              )}
            />
            {data.type === 0 && (
              <FormField
                control={form.control}
                name="returnDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col w-full">
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            type="button"
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal border-zinc-500",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "P", { locale: ptBR })
                            ) : (
                              <span>Data de volta</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-auto p-0 border-zinc-800"
                        align="end"
                      >
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={(date) => {
                            field.onChange(date);
                            setData({ ...data, returningDate: date });
                          }}
                          disabled={(date) => {
                            if (data.goingDate) {
                              return date < data.goingDate;
                            }
                            return (
                              date <
                              add(new Date(), {
                                days: -1,
                              })
                            );
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </FormItem>
                )}
              />
            )}
          </div>
          <div className="w-full flex items-center justify-center">
            <Button
              disabled={isFetching}
              type="submit"
              className="text-zinc-600 bg-zinc-800 rounded-3xl px-4 py-2 hover:bg-zinc-700 transition-all duration-200 cursor-pointer hover:text-zinc-300"
            >
              <MagnifyingGlassIcon className="size-6" />
              <span>Pesquisar</span>
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

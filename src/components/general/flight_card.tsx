import { FlightsProps } from "@/utils/flights_types";
import Image from "next/image";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  formatDateTimeToBRL,
  getHoursAndMinutesFromMinutes,
} from "@/utils/format";

interface FlightCardProps {
  flight: FlightsProps;
}

export default function FlightCard({ flight }: FlightCardProps) {
  function getOperationAirline() {
    const { legs } = flight;
    return legs[0].carriers.marketing[0];
  }

  function getDuration(duration: number) {
    const { hours, minutes } = getHoursAndMinutesFromMinutes(duration);

    return `${hours}h ${minutes > 0 ? minutes + " min" : ""}`;
  }

  function getDepAndArrival() {
    const { legs } = flight;
    const { durationInMinutes } = legs[0];
    const departureTime = legs[0].departure;
    const arrivalTime = legs[0].arrival;
    const days = Math.ceil(durationInMinutes / (60 * 24));

    return (
      <div className="relative text-base font-semibold">
        {formatDateTimeToBRL(departureTime)} -{" "}
        {formatDateTimeToBRL(arrivalTime)}
        {days > 0 && (
          <span className="absolute -top-1 -right-4 text-xs">+{days}</span>
        )}
      </div>
    );
  }

  function getOriginDestination() {
    const { legs } = flight;
    const origin = legs[0].origin;
    const destination = legs[legs.length - 1].destination;

    return `${origin.displayCode} - ${destination.displayCode}`;
  }

  function getStops() {
    const { legs } = flight;
    const { segments, destination } = legs[0];
    const stopDisplayNames = segments
      .filter((s) => s.destination.displayCode !== destination.displayCode)
      .map((segment) => segment.destination.displayCode);

    return stopDisplayNames.join(", ");
  }

  return (
    <Accordion type="single" collapsible>
      <AccordionItem
        value={flight.id}
        className="border border-zinc-400 rounded-md px-2 py-4"
      >
        <div className="w-full flex items-center justify-between">
          <Image
            className="size-7"
            width={1000}
            height={1000}
            src={getOperationAirline().logoUrl}
            alt={getOperationAirline().name}
          />
          <div className="flex flex-col items-start gap-1">
            {getDepAndArrival()}
          </div>
          <div className="flex flex-col gap-1 text-left">
            <p>{getDuration(flight.legs[0].durationInMinutes)}</p>
            <p className="text-[10px]">{getOriginDestination()}</p>
          </div>
          <div className="sm:flex-col sm:gap-1 text-left hidden sm:flex">
            <p>
              {flight.legs[0].stopCount > 0 ? (
                <>
                  {flight.legs[0].stopCount} parada
                  {flight.legs[0].stopCount !== 1 ? "s" : ""}
                </>
              ) : (
                <>Sem escalas</>
              )}
            </p>
            <small className="text-[10px]">{getStops()}</small>
          </div>
          <div>
            <p> {flight.price.formatted}</p>
          </div>
          <AccordionTrigger />
        </div>

        <AccordionContent>
          <div className="w-full flex flex-col items-start justify-start gap-4">
            {flight.legs[0].segments.map((segment) => (
              <div
                key={segment.id}
                className="w-full flex items-stretch justify-start gap-2 px-7"
              >
                <div className="w-4 flex flex-col pr-[6px] gap-1">
                  <div className="size-4 border-2 border-zinc-500 rounded-full" />
                  <div className="flex-1 border-dotted border-r-4 border-zinc-500" />
                  <div className="size-4 border-2 border-zinc-500 rounded-full" />
                </div>
                <div className="w-full flex flex-col items-start justify-start gap-2 px-2">
                  <div className="flex flex-col gap-1">
                    <strong className="md:text-lg">
                      {formatDateTimeToBRL(segment.departure)}
                    </strong>
                    <small className="text-zinc-300 md:text-base">
                      {segment.origin.name} - {segment.origin.displayCode}
                    </small>
                  </div>
                  <small className="text-zinc-400 md:text-base">
                    Tempo de viagem: {getDuration(segment.durationInMinutes)}
                  </small>
                  <div className="flex flex-col gap-1">
                    <strong className="md:text-lg">
                      {formatDateTimeToBRL(segment.arrival)}
                    </strong>
                    <small className="text-zinc-300 md:text-base">
                      {segment.destination.name} -{" "}
                      {segment.destination.displayCode}
                    </small>
                  </div>
                  <small className="text-zinc-400 md:text-base">
                    {segment.operatingCarrier.name}
                  </small>
                </div>
              </div>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

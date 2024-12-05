"use client";

import FlightCard from "@/components/general/flight_card";
import Header from "@/components/header";
import { useFlightsStore } from "@/stores/useFlightsStore";

import EMPTY_SVG from "../../public/empty_state.svg";
import Image from "next/image";
import Spinner from "@/components/general/spinner";

export default function Home() {
  const { flights, hasSearched, isFetching } = useFlightsStore();

  return (
    <div className="w-full min-h-screen h-full max-w-3xl flex flex-col gap-3 items-stretch justify-start p-3">
      <Header />
      {isFetching && (
        <div className="absolute flex items-center justify-center inset-0 bg-zinc-900/50 z-50">
          <Spinner />
        </div>
      )}

      {flights.length === 0 && hasSearched && (
        <div className="w-full h-full flex flex-col items-center justify-start gap-5 flex-1 pt-10">
          <div className="w-full text-center">
            <p className="text-zinc-300">Não há voos para a sua pesquisa</p>
            <small className="text-zinc-400">
              Tente alterar os parâmetros de busca
            </small>
          </div>
          <Image
            className="size-52"
            src={EMPTY_SVG}
            width={500}
            height={500}
            alt="Escada de bordo"
          />
        </div>
      )}
      {flights.length > 0 && (
        <div className="w-full flex flex-col gap-2 overflow-y-auto">
          {flights.map((flight, key) => (
            <FlightCard key={key} flight={flight} />
          ))}
        </div>
      )}
    </div>
  );
}

import { format } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";

export function formatDateTimeToBRL(date: string | Date) {
  return format(date, "p", { locale: ptBR });
}

export function getHoursAndMinutesFromMinutes(durationInMinutes: number) {
  const hours = Math.floor(durationInMinutes / 60);
  const minutes = Math.floor(durationInMinutes % 60);

  return { hours, minutes };
}

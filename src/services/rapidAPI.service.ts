import { GetFlightsParams } from "@/utils/types";

class RapidAPIService {
  private baseUrl: string;
  private headers: HeadersInit;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.headers = {
      "x-rapidapi-key": process.env.NEXT_PUBLIC_RAPID_API_KEY ?? "",
      "x-rapidapi-host": process.env.NEXT_PUBLIC_RAPID_API_HOST ?? "",
    };
  }

  async getAirports(name: string) {
    const response = await fetch(
      `${this.baseUrl}/flights/searchAirport?query=${name}&locale=pt-BR`,
      {
        headers: this.headers,
      }
    );

    return response;
  }

  async getFlights(params: GetFlightsParams) {
    const queryParams = Object.keys(params)
      .filter((key) => params[key as keyof typeof params])
      .map((key) => `${key}=${params[key as keyof typeof params]}`)
      .join("&");
    console.info({ queryParams });

    const response = await fetch(
      `${this.baseUrl}/flights/searchFlights?${queryParams}&currency=BRL`,
      {
        headers: this.headers,
      }
    );

    return response;
  }
}

const rapidAPIService = new RapidAPIService(
  process.env.NEXT_PUBLIC_BASE_RAPID_URL!
);

export default rapidAPIService;

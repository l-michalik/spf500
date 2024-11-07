import { IOptions } from "../types";

export const createOptions = ({ params, path }: IOptions) => {
    return {
      method: "GET",
      url: `https://api-football-v1.p.rapidapi.com/v3/${path}`,
      params: params,
      headers: {
        "x-rapidapi-key": process.env.RAPID_API_KEY,
        "x-rapidapi-host": process.env.RAPID_API_HOST,
      },
    };
  };
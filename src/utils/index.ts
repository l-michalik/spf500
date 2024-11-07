import { ITeam, Team } from "../models";
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

export const insertOrUpdateTeams = async (documents: ITeam[]) => {
  for (const doc of documents) {
    // Check if the team with the given ID already exists
    const existingTeam = await Team.findOne({ id: doc.id });

    if (!existingTeam) {
      await Team.create(doc);
    }
  }
}
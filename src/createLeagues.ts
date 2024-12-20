import { CLeaguesInterface } from "./types";
import { createOptions } from "./utils";
import dbConnect from "./lib/dbConnect"
import { CLeagues } from "./constants";
import { League } from "./models";
import { exit } from "process";
import axios from "axios";

export const createLeagues = async () => {
    const docs: any[] = [];

    try {
        const options = createOptions({ path: 'leagues', params: {} });

        const response = await axios.request(options);

        response.data.response.map((doc: any) => {
            const league = doc.league;
            const country = doc.country;
            const newestSeason = doc.seasons[doc.seasons.length - 1].year.toString();

            if (CLeagues.map((x: CLeaguesInterface) => x.Id).includes(league.id)) {
                return docs.push({
                    id: league.id,
                    name: league.name,
                    country: country.name,
                    newestSeason: newestSeason
                });
            }
        });
    } catch (error) {
        console.log(error);
        exit(1);
    }

    try {
        await dbConnect();

        for (const doc of docs) {
            await League.findOneAndUpdate({ id: doc.id }, doc, { upsert: true });
        }

    } catch (error) {
        console.log(error);
        exit(1);
    } finally {
        console.log('Leagues created successfully');
        exit(0);
    }
}
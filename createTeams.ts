import { exit } from "process";
import dbConnect from "./src/lib/dbConnect";
import { League } from "./src/models";
import { CLeagues } from "./src/constants";
import { createOptions, insertOrUpdateTeams } from "./src/utils";
import { IleagueIds } from "./src/types";
import axios from "axios";

export const createTeams = async () => {
    const leaguesIds: any[] = [];
    let counter = 0;

    try {
        await dbConnect();

        const leagues = await League.find({ id: { $in: CLeagues.map((x) => x.Id) } }).select("id");

        leaguesIds.push(...leagues);
    } catch (error) {
        console.log(error);
        exit(1);
    }

    leaguesIds.map(async (league: IleagueIds, idx: number) => {
        const docs: any[] = [];

        try {
            const options = createOptions({
                params: { season: `2024`, league: league.id },
                path: "teams",
            });

            await dbConnect();

            const response = await axios.request(options);

            response.data.response.map((doc: any) => {
                const team = doc.team;

                return docs.push({
                    id: team.id,
                    name: team.name,
                    league: league._id,
                });      
            });
            
            insertOrUpdateTeams(docs).then(() => {
                counter++;
                console.log(`Teams for league ${league.id} created successfully.`);

                if (counter === leaguesIds.length) {
                    console.log("All teams created successfully.");
                    exit(0);
                }
            });
        } catch (error) {
            console.log(error);
            exit(1);
        }
    });
}
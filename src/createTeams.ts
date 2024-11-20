import { exit } from "process";
import dbConnect from "./lib/dbConnect";
import { League } from "./models";
import { CLeagues } from "./constants";
import { createOptions, insertOrUpdateTeams } from "./utils";
import { IleagueIds } from "./types";
import axios from "axios";

export const createTeams = async () => {
    const leaguesIds: any[] = [];
    let counter = 0;

    try {
        await dbConnect();

        const leagues = await League.find({ id: { $in: CLeagues.map((x) => x.Id) } }).select(["id", "newestSeason"]);

        leaguesIds.push(...leagues);
    } catch (error) {
        console.log(error);
        exit(1);
    }

    for (let i = 0; i < leaguesIds.length; i += 10) {
        setTimeout(async () => {
            const leaguesSlice = leaguesIds.slice(i, i + 10);

            leaguesSlice.map(async (league: IleagueIds, idx: number) => {
                const docs: any[] = [];
        
                try {
                    const options = createOptions({
                        params: { season: league.newestSeason, league: league.id },
                        path: "teams",
                    });
        
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

        }, 10000 * i / 10);
    }
}
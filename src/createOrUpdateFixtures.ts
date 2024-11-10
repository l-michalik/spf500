import { exit } from "process";
import { CLeagues } from "./constants";
import dbConnect from "./lib/dbConnect";
import { Fixture, League, Statistic, Team } from "./models";
import { IleagueIds } from "./types";
import { createOptions } from "./utils";
import axios from "axios";

export const createOrUpdateFixtures = async () => {
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
        try {
            const options = createOptions({
                path: "fixtures",
                params: {
                    league: `${league.id}`,
                    season: `2024`,
                    timezone: "Europe/Warsaw",
                },
            });

            const response = await axios.request(options);

            const docsPromises = Promise.all(
                response.data.response.map(async (doc: any) => {
                    const fixture = doc.fixture;
                    const teams = doc.teams;

                    const [_League, _Home, _Away, _Statistic] = await Promise.all([
                        League.findOne({ id: league.id }).select("_id"),
                        Team.findOne({ id: teams.home.id }).select("_id"),
                        Team.findOne({ id: teams.away.id }).select("_id"),
                        Statistic.findOne({ "home.fixtureId": fixture.id }).select("_id"),
                    ]);

                    return {
                        id: fixture.id,
                        timestamp: new Date(fixture.date).getTime(),
                        league: _League,
                        teams: {
                            home: _Home,
                            away: _Away
                        },
                        statistic: _Statistic
                    };
                })
            );

            const docs = (await docsPromises).flat();

            await dbConnect();

            const bulk = docs.map((doc: any) => ({
                updateOne: {
                    filter: { id: doc.id },
                    update: doc,
                    upsert: true
                }
            }));

            Fixture.bulkWrite(bulk).then(() => {
                counter++;
                console.log(`Fixtures for league ${league.id} created/updated successfully.`);

                if (counter === leaguesIds.length) {
                    console.log("All fixtures created/updated successfully.");
                    exit(0);
                }
            });
        } catch (error) {
            console.log(error);
            exit(1);
        }
    });
}
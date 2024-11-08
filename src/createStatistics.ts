import { Fixture, Statistic } from "./models";
import dbConnect from "./lib/dbConnect";
import { createOptions } from "./utils";
import { exit } from "process";
import axios from "axios";

export const createStatistics = async () => {
    let counter = 0;

    try {
        await dbConnect();

        const fixtures = await Fixture
            .find({ statistic: null, timestamp: { $lt: Date.now() / 1000 - 60 * 60 * 24 } }).select("id teams")
            .populate(["teams.home", "teams.away"])
            .limit(20);

        console.log(`Found ${fixtures.length} fixtures.`);

        fixtures.map(async (fixture) => {
            const options = createOptions({ 
                path: "fixtures/statistics",
                params: {
                    fixture: `${fixture.id}`,
                }
            });

            const response = await axios.request(options);

            const teams = fixture.teams;

            const data = response.data.response;

            const homeTeamId = teams.home.id;
            const awayTeamId = teams.away.id;

            if(data.length === 0){
                console.log(`No statistics found for fixture ${fixture.id}.`);
                counter++;

                if (counter === fixtures.length) {
                    console.log("All statistics created successfully.");
                    exit(0);
                }

                return;
            }

            const homeTeamStats = data.find((x: any) => x.team.id === homeTeamId).statistics;
            const awayTeamStats = data.find((x: any) => x.team.id === awayTeamId).statistics;

            const optionsGoals = createOptions({
                path: "fixtures",
                params: {
                    id: `${fixture.id}`,
                }
            });

            const responseGoals = await axios.request(optionsGoals);

            const dataGoals = responseGoals.data.response;

            const homeHalftimeGoals = dataGoals[0].teams.home.id === homeTeamId ? dataGoals[0].score.halftime.home : dataGoals[0].score.halftime.away;
            const homeFulltimeGoals = dataGoals[0].teams.home.id === homeTeamId ? dataGoals[0].goals.home : dataGoals[0].goals.away;
            const awayHalftimeGoals = dataGoals[0].teams.home.id === homeTeamId ? dataGoals[0].score.halftime.away : dataGoals[0].score.halftime.home;
            const awayFulltimeGoals = dataGoals[0].teams.home.id === homeTeamId ? dataGoals[0].goals.away : dataGoals[0].goals.home;

            const newStatistic = await Statistic.create({
                home: {
                    fixtureId: fixture.id,
                    shotsOnGoal: homeTeamStats.find((x: any) => x.type === "Shots on Goal").value,
                    shotsOffGoal: homeTeamStats.find((x: any) => x.type === "Shots off Goal").value,
                    totalShots: homeTeamStats.find((x: any) => x.type === "Total Shots").value,
                    fouls: homeTeamStats.find((x: any) => x.type === "Fouls").value,
                    corners: homeTeamStats.find((x: any) => x.type === "Corner Kicks").value,
                    offsides: homeTeamStats.find((x: any) => x.type === "Offsides").value,
                    yellowCards: homeTeamStats.find((x: any) => x.type === "Yellow Cards").value,
                    redCards: homeTeamStats.find((x: any) => x.type === "Red Cards").value,
                    halftimeGoals: homeHalftimeGoals,
                    fulltimeGoals: homeFulltimeGoals,
                },
                away: {
                    fixtureId: fixture.id,
                    shotsOnGoal: awayTeamStats.find((x: any) => x.type === "Shots on Goal").value,
                    shotsOffGoal: awayTeamStats.find((x: any) => x.type === "Shots off Goal").value,
                    totalShots: awayTeamStats.find((x: any) => x.type === "Total Shots").value,
                    fouls: awayTeamStats.find((x: any) => x.type === "Fouls").value,
                    corners: awayTeamStats.find((x: any) => x.type === "Corner Kicks").value,
                    offsides: awayTeamStats.find((x: any) => x.type === "Offsides").value,
                    yellowCards: awayTeamStats.find((x: any) => x.type === "Yellow Cards").value,
                    redCards: awayTeamStats.find((x: any) => x.type === "Red Cards").value,
                    halftimeGoals: awayHalftimeGoals,
                    fulltimeGoals: awayFulltimeGoals,
                },
            });

            const fixtureToUpdate = await Fixture.findOne({ id: fixture.id });

            fixtureToUpdate.statistic = newStatistic._id;

            await fixtureToUpdate.save().then(() => {
                counter++;
                console.log(`Statistics for fixture ${fixture.id} created successfully.`);

                if (counter === fixtures.length) {
                    console.log("All statistics created successfully.");
                    exit(0);
                }
            });
        });
    } catch (error) {
        console.log(error);
        exit(1);
    }
}
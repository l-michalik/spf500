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
            .find({ statistic: null, timestamp: { $lt: Date.now() - (24 * 60 * 60 * 1000) } }).select("id teams")
            .populate(["teams.home", "teams.away"])
            .sort({ timestamp: -1 })

        console.log(`Found ${fixtures.length} fixtures.`);
        

        for (let i = 0; i < fixtures.length; i += 10) {
            setTimeout(async () => {
                const fixturesSlice = fixtures.slice(i, i + 10);

                fixturesSlice.map(async (fixture) => {
                    let hasStats = false;
                    const options = createOptions({
                        path: "fixtures/statistics",
                        params: {
                            fixture: `${fixture.id}`,
                        }
                    });

                    const response = await axios.request(options);

                    const data = response.data.response;

                    const teams = fixture.teams;
                    const homeTeamId = teams.home.id;
                    const awayTeamId = teams.away.id;

                    hasStats = data.length === 0 ? false : true;

                    let homeTeamStats, awayTeamStats;

                    if (hasStats) {
                        homeTeamStats = data.find((x: any) => x.team.id === homeTeamId).statistics;
                        awayTeamStats = data.find((x: any) => x.team.id === awayTeamId).statistics;
                    }

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

                    let statistic: any = {
                        home: {
                            fixtureId: fixture.id,
                            halftimeGoals: homeHalftimeGoals,
                            fulltimeGoals: homeFulltimeGoals,
                        },
                        away: {
                            fixtureId: fixture.id,
                            halftimeGoals: awayHalftimeGoals,
                            fulltimeGoals: awayFulltimeGoals,
                        },
                    }

                    if (hasStats) {
                        statistic.home.shotsOnGoal = homeTeamStats.find((x: any) => x.type === "Shots on Goal").value;
                        statistic.home.shotsOffGoal = homeTeamStats.find((x: any) => x.type === "Shots off Goal").value;
                        statistic.home.totalShots = homeTeamStats.find((x: any) => x.type === "Total Shots").value;
                        statistic.home.fouls = homeTeamStats.find((x: any) => x.type === "Fouls").value;
                        statistic.home.corners = homeTeamStats.find((x: any) => x.type === "Corner Kicks").value;
                        statistic.home.offsides = homeTeamStats.find((x: any) => x.type === "Offsides").value;
                        statistic.home.yellowCards = homeTeamStats.find((x: any) => x.type === "Yellow Cards").value;
                        statistic.home.redCards = homeTeamStats.find((x: any) => x.type === "Red Cards").value;

                        statistic.away.shotsOnGoal = awayTeamStats.find((x: any) => x.type === "Shots on Goal").value;
                        statistic.away.shotsOffGoal = awayTeamStats.find((x: any) => x.type === "Shots off Goal").value;
                        statistic.away.totalShots = awayTeamStats.find((x: any) => x.type === "Total Shots").value;
                        statistic.away.fouls = awayTeamStats.find((x: any) => x.type === "Fouls").value;
                        statistic.away.corners = awayTeamStats.find((x: any) => x.type === "Corner Kicks").value;
                        statistic.away.offsides = awayTeamStats.find((x: any) => x.type === "Offsides").value;
                        statistic.away.yellowCards = awayTeamStats.find((x: any) => x.type === "Yellow Cards").value;
                        statistic.away.redCards = awayTeamStats.find((x: any) => x.type === "Red Cards").value;
                    }

                    const newStatistic = await Statistic.create(statistic);

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

            }, 10000 * i / 10);
        }
    } catch (error) {
        console.log(error);
        exit(1);
    }
}
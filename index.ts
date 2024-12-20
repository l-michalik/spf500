import { createOrUpdateFixtures } from './src/createOrUpdateFixtures';
import express, { Request, Response } from 'express';
import { createLeagues } from './src/createLeagues';
import { createTeams } from './src/createTeams';
import { createStatistics } from './src/createStatistics';
import cors from 'cors'; // Import cors
import { Fixture, League, Team } from './src/models';
import dbConnect from './src/lib/dbConnect';

const app = express();
const port: number = 4000;

require("dotenv").config();

app.use(cors({
    origin: ['http://localhost:3000', 'https://spfront500.vercel.app'],
    methods: ['GET', 'POST', 'OPTIONS'],
}));

app.get('/getFixtures', async (req: Request, res: Response) => {
    await dbConnect();

    const fixtures = await Fixture
        .find({ timestamp: { $gt: Date.now() - (2 * 60 * 60 * 1000) } })
        .sort({ timestamp: 1 })
        .populate(["teams.home", "teams.away", 'league'])
        .limit(100)

    res.send(fixtures);
});

app.get('/getFixture/:fixtureId', async (req: Request, res: Response) => {
    await dbConnect();

    const fixture = await Fixture.findOne({ id: req.params.fixtureId })
        .populate(["teams.home", "teams.away"]);

    res.send(fixture);
});

app.get('/getFixtureStats/:fixtureId/:teamId', async (req: Request, res: Response) => {
    await dbConnect();

    const teamId = Number(req.params.teamId);

    const fixture = await Fixture.findOne({ id: req.params.fixtureId });
    
    const team = await Team.findOne({ id: teamId });

    const teamFixtures = await Fixture
        .find({
            statistic: { $ne: null },
            timestamp: { $lt: fixture.timestamp },
            $or: [
                { "teams.home": team },
                { "teams.away": team }
            ]
        })
        .populate(["teams.home", "teams.away", "statistic"])
        .sort({ timestamp: -1 })
        .limit(5);

    res.send({
        team: teamFixtures,
    });
});

app.listen(port, async () => {
    // Uncomment these lines to run them when the server starts
    // await createLeagues();
    // await createTeams();
    // await createOrUpdateFixtures();
    // await createStatistics();
    console.log(`Server is running on http://localhost:${port}`);
});
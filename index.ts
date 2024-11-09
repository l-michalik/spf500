import { createOrUpdateFixtures } from './src/createOrUpdateFixtures';
import express, { Request, Response } from 'express';
import { createLeagues } from './src/createLeagues';
import { createTeams } from './src/createTeams';
import { createStatistics } from './src/createStatistics';
import cors from 'cors'; // Import cors
import { League } from './src/models';
import dbConnect from './src/lib/dbConnect';

const app = express();
const port: number = 4000;

require("dotenv").config();

app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'OPTIONS'],
}));

app.get('/', async (req: Request, res: Response) => {
    await dbConnect();
    
    const leagues = await League.find({});
    
    res.send(leagues);
});

app.listen(port, async () => {
    // Uncomment these lines to run them when the server starts
    // await createLeagues();
    // await createTeams();
    // await createOrUpdateFixtures();
    // await createStatistics();
    console.log(`Server is running on http://localhost:${port}`);
});
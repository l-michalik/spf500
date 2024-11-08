import { createOrUpdateFixtures } from './src/createOrUpdateFixtures';
import express, { Request, Response } from 'express';
import { createLeagues } from './src/createLeagues';
import { createTeams } from './src/createTeams';

const app = express();

const port: number = 4000;

require("dotenv").config();

app.get('/', (req: Request, res: Response) => {
    res.send('Root is running...');
});

app.listen(port, async () => {
    // createLeagues();

    // createTeams();

    // createOrUpdateFixtures();
});
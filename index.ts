import express, { Request, Response } from 'express';

const app = express();

const port: number = 4000;

app.get('/', (req: Request, res: Response) => {
    res.send('Root is running...');
});

app.listen(port, async () => {
    console.log(`Server is running on port ${port}`);
});
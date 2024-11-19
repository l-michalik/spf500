import { Schema } from "mongoose";

export interface IOptions {
    params: any;
    path: string;
}

export interface CLeaguesInterface {
    country: string;
    BetclicName: string;
    ApiName: string;
    Id: number;
}

export interface IleagueIds {
    id: number;
    _id: Schema.Types.ObjectId;
    newestSeason: string;
}
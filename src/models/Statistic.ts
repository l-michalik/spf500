import mongoose, { Schema } from "mongoose";

interface IStatistic {
  fixtureId: number;
  shotsOnGoal: number;
  shotsOffGoal: number;
  totalShots: number;
  fouls: number;
  corners: number;
  offsides: number;
  yellowCards: number;
  redCards: number;
  halftimeGoals: number;
  fulltimeGoals: number;
}

export interface IStats {
  home: IStatistic;
  away: IStatistic;
}

const statisticSchema: Schema = new mongoose.Schema<IStats>({
  home: {
    fixtureId: {
      type: Number,
      required: true,
    },
    shotsOnGoal: {
      type: Number,
      required: false,
    },
    shotsOffGoal: {
      type: Number,
      required: false,
    },
    totalShots: {
      type: Number,
      required: false,
    },
    fouls: {
      type: Number,
      required: false,
    },
    corners: {
      type: Number,
      required: false,
    },
    offsides: {
      type: Number,
      required: false,
    },
    yellowCards: {
      type: Number,
      required: false,
    },
    redCards: {
      type: Number,
      required: false,
    },
    halftimeGoals: {
      type: Number,
      required: false,
    },
    fulltimeGoals: {
      type: Number,
      required: false,
    },
  },
  away: {
    fixtureId: {
      type: Number,
      required: false,
    },
    shotsOnGoal: {
      type: Number,
      required: false,
    },
    shotsOffGoal: {
      type: Number,
      required: false,
    },
    totalShots: {
      type: Number,
      required: false,
    },
    fouls: {
      type: Number,
      required: false,
    },
    corners: {
      type: Number,
      required: false,
    },
    offsides: {
      type: Number,
      required: false,
    },
    yellowCards: {
      type: Number,
      required: false,
    },
    redCards: {
      type: Number,
      required: false,
    },
    halftimeGoals: {
      type: Number,
      required: false,
    },
    fulltimeGoals: {
      type: Number,
      required: false,
    },
  },
})

export const Statistic = mongoose.models.Statistic || mongoose.model<IStats>('Statistic', statisticSchema);
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
      required: true,
    },
    shotsOffGoal: {
      type: Number,
      required: true,
    },
    totalShots: {
      type: Number,
      required: true,
    },
    fouls: {
      type: Number,
      required: true,
    },
    corners: {
      type: Number,
      required: true,
    },
    offsides: {
      type: Number,
      required: true,
    },
    yellowCards: {
      type: Number,
      required: true,
    },
    redCards: {
      type: Number,
      required: true,
    },
    halftimeGoals: {
      type: Number,
      required: true,
    },
    fulltimeGoals: {
      type: Number,
      required: true,
    },
  },
  away: {
    fixtureId: {
      type: Number,
      required: true,
    },
    shotsOnGoal: {
      type: Number,
      required: true,
    },
    shotsOffGoal: {
      type: Number,
      required: true,
    },
    totalShots: {
      type: Number,
      required: true,
    },
    fouls: {
      type: Number,
      required: true,
    },
    corners: {
      type: Number,
      required: true,
    },
    offsides: {
      type: Number,
      required: true,
    },
    yellowCards: {
      type: Number,
      required: true,
    },
    redCards: {
      type: Number,
      required: true,
    },
    halftimeGoals: {
      type: Number,
      required: true,
    },
    fulltimeGoals: {
      type: Number,
      required: true,
    },
  },
})

export const Statistic = mongoose.models.Statistic || mongoose.model<IStats>('Statistic', statisticSchema);
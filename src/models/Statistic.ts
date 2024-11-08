import mongoose, { Schema } from "mongoose";

export interface IStats {
  fixtureId: number;
  shotsOnGoal: number;
  shotsOffGoal: number;
  totalShots: number;
  fouls: number;
  corners: number;
  offsides: number;
  yellowCards: number;
  redCards: number;
  goals: {
    halftime: {
      home: number;
      away: number;
    },
    fulltime: {
      home: number;
      away: number;
    },
  }
}

const statisticSchema: Schema = new mongoose.Schema<IStats>({
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
  goals: {
    halftime: {
      home: {
        type: Number,
        required: true,
      },
      away: {
        type: Number,
        required: true,
      },
    },
    fulltime: {
      home: {
        type: Number,
        required: true,
      },
      away: {
        type: Number,
        required: true,
      },
    },
  },
})

export const Statistic = mongoose.models.Statistic || mongoose.model<IStats>('Statistic', statisticSchema);
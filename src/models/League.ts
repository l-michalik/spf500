import mongoose, { Document, Schema } from "mongoose";

export interface ILeague extends Document {
  id: number;
  name: string;
  country: string;
  // start, end, current @TODO
}

const leagueSchema: Schema = new mongoose.Schema<ILeague>({
  id: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },

})

export const League = mongoose.models.League || mongoose.model<ILeague>('League', leagueSchema);
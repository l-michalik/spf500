import mongoose, { Document, ObjectId, Schema } from "mongoose";

export interface ITeam extends Required<Document<ObjectId>> {
  id: number;
  name: string;
  league: Schema.Types.ObjectId;
}

const teamSchema: Schema = new mongoose.Schema<ITeam>({
  id: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  league: {
    type: Schema.Types.ObjectId,
    ref: 'League',
    required: true,
  }
})

export const Team = mongoose.models.Team || mongoose.model<ITeam>('Team', teamSchema);
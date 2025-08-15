// src/models/Timeslot.ts
import mongoose, { Schema, Document } from "mongoose";

export interface ITimeslot extends Document {
  day: string; // Mon, Tue, Wed, Thu, Fri
  start: string; // "08:00"
  end: string;   // "09:30"
  slotIndex: number; // 0 to 4
}

const TimeslotSchema = new Schema<ITimeslot>({
  day: { type: String, required: true },
  start: { type: String, required: true },
  end: { type: String, required: true },
  slotIndex: { type: Number, required: true },
});

export default mongoose.models.Timeslot ||
  mongoose.model<ITimeslot>("Timeslot", TimeslotSchema);

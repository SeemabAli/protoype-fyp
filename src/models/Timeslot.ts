import mongoose, { Schema, Document, Model } from "mongoose";

export interface ITimeslot extends Document {
  day: string;     // e.g., "Mon"
  start: string;   // "08:00"
  end: string;     // "09:30"
  slotIndex: number;
}

const TimeslotSchema = new Schema<ITimeslot>(
  {
    day: { type: String, required: true },
    start: { type: String, required: true },
    end: { type: String, required: true },
    slotIndex: { type: Number, required: true },
  },
  { timestamps: true }
);

const Timeslot: Model<ITimeslot> =
  mongoose.models.Timeslot || mongoose.model<ITimeslot>("Timeslot", TimeslotSchema);

export default Timeslot;

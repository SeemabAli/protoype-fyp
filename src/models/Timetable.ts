// src/models/Timetable.ts
import mongoose, { Schema, Document } from "mongoose";

export interface ITimetable extends Document {
  course: mongoose.Types.ObjectId;
  faculty: mongoose.Types.ObjectId;
  classroom: mongoose.Types.ObjectId;
  day: string;
  slot: string;
}

const TimetableSchema = new Schema<ITimetable>(
  {
    course: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    faculty: { type: Schema.Types.ObjectId, ref: "Faculty", required: true },
    classroom: {
      type: Schema.Types.ObjectId,
      ref: "Classroom",
      required: true,
    },
    day: { type: String, required: true },
    slot: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Timetable ||
  mongoose.model<ITimetable>("Timetable", TimetableSchema);

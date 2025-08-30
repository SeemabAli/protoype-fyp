import mongoose, { Schema, Document, Types } from "mongoose";

export interface ITimetable extends Document {
  course: Types.ObjectId;      // reference to Course
  faculty: Types.ObjectId;     // reference to Faculty
  classroom: Types.ObjectId;   // reference to Classroom
  day: string;                 // e.g., "Monday"
  slot: string;                // e.g., "09:30 - 11:00"
  createdAt: Date;
  updatedAt: Date;
}

const TimetableSchema = new Schema<ITimetable>(
  {
    course: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    faculty: { type: Schema.Types.ObjectId, ref: "Faculty", required: true },
    classroom: { type: Schema.Types.ObjectId, ref: "Classroom", required: true },
    day: { type: String, required: true },
    slot: { type: String, required: true },
  },
  { timestamps: true }
);

const Timetable =
  mongoose.models.Timetable ||
  mongoose.model<ITimetable>("Timetable", TimetableSchema);

export default Timetable;

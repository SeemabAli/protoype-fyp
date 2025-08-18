import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface ITimetable extends Document {
  course: Types.ObjectId;
  faculty: Types.ObjectId;
  classroom: Types.ObjectId;
  day: string;
  timeSlot: Types.ObjectId;
  studentBatch: string;
}

const TimetableSchema = new Schema<ITimetable>(
  {
    course: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    faculty: { type: Schema.Types.ObjectId, ref: "Faculty", required: true },
    classroom: { type: Schema.Types.ObjectId, ref: "Classroom", required: true },
    day: { type: String, required: true },
    timeSlot: { type: Schema.Types.ObjectId, ref: "Timeslot", required: true },
    studentBatch: { type: String, required: true },
  },
  { timestamps: true }
);

const Timetable: Model<ITimetable> =
  mongoose.models.Timetable || mongoose.model<ITimetable>("Timetable", TimetableSchema);

export default Timetable;

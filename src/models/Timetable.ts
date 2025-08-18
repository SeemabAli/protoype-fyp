import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface ITimetable extends Document {
  course: Types.ObjectId;
  faculty: Types.ObjectId;
  classroom: Types.ObjectId;
  day: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday";
  timeSlot: Types.ObjectId;
  studentBatch: string;
  semester: string;
}

const TimetableSchema = new Schema<ITimetable>(
  {
    course: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    faculty: { type: Schema.Types.ObjectId, ref: "Faculty", required: true },
    classroom: { type: Schema.Types.ObjectId, ref: "Classroom", required: true },
    day: { 
      type: String, 
      enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], 
      required: true 
    },
    timeSlot: { type: Schema.Types.ObjectId, ref: "Timeslot", required: true },
    studentBatch: { type: String, required: true },
    semester: { type: String, required: true },
  },
  { timestamps: true }
);

const Timetable: Model<ITimetable> =
  mongoose.models.Timetable || mongoose.model<ITimetable>("Timetable", TimetableSchema);

export default Timetable;

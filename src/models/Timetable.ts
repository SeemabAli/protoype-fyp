import mongoose from "mongoose";

const timetableSchema = new mongoose.Schema({
  course: String,
  faculty: String,
  classroom: String,
  day: String,
  timeSlot: String,
  studentBatch: String
}, { timestamps: true });

export default mongoose.models.Timetable || mongoose.model("Timetable", timetableSchema);

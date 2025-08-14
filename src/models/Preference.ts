import mongoose, { Schema, Document } from "mongoose";

export interface IPreference extends Document {
  facultyId: string; // ref to Faculty
  courseCode: string; // ref to Course
  timePreferences: string[]; // array of time slots
}

const PreferenceSchema: Schema = new Schema(
  {
    facultyId: { type: String, required: true },
    courseCode: { type: String, required: true },
    timePreferences: { type: [String], required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Preference || mongoose.model<IPreference>("Preference", PreferenceSchema);
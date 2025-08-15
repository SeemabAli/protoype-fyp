/* eslint-disable @typescript-eslint/no-unused-vars */
import mongoose, { Schema, Document, Types } from "mongoose";
import { z } from "zod";

export interface ICoursePreference {
  courseId: Types.ObjectId;
  timeSlots: string[];
}

export interface IFaculty extends Document {
  name: string;
  email: string;
  department: string;
  designation: "Lecturer" | "AssistantProfessor" | "AssociateProfessor" | "Professor";
  preferences: ICoursePreference[];
  preferenceSubmittedAt?: Date;
}

const CoursePreferenceSchema = new Schema<ICoursePreference>({
  courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true },
  timeSlots: [{ type: String, required: true }],
});

const FacultySchema = new Schema<IFaculty>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  department: { type: String, required: true },
  designation: {
    type: String,
    enum: ["Lecturer", "AssistantProfessor", "AssociateProfessor", "Professor"],
    required: true,
  },
  preferences: [CoursePreferenceSchema],
  preferenceSubmittedAt: Date,
});

// Zod schema for validation (separate from Mongoose schema)
export const coursePreferencesSchema = z.object({
  preferences: z.array(
    z.object({
      courseId: z.string().min(1, "Invalid course ID"),
      timeSlots: z.array(z.string()).min(1, "At least one time slot is required")
    })
  ).length(5, "Exactly 5 course preferences are required")
});

// Fix: More explicit null check
let Faculty: mongoose.Model<IFaculty>;

try {
  Faculty = mongoose.models?.Faculty || mongoose.model<IFaculty>("Faculty", FacultySchema);
} catch (error) {
  Faculty = mongoose.model<IFaculty>("Faculty", FacultySchema);
}

export default Faculty;
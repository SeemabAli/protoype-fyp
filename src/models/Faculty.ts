import mongoose, { Schema, Document, Types, Model } from "mongoose";
import { z } from "zod";

export interface ICoursePreference {
  courseId: Types.ObjectId;
  timeSlots: Types.ObjectId[];
}

export interface IFaculty extends Document {
  name: string;
  email: string;
  department: string;
  designation: "Lecturer" | "AssistantProfessor" | "AssociateProfessor" | "Professor";
  preferences: ICoursePreference[];
  preferenceSubmittedAt?: Date;
}

const CoursePreferenceSchema = new Schema<ICoursePreference>(
  {
    courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    timeSlots: [{ type: Schema.Types.ObjectId, ref: "Timeslot", required: true }],
  },
  { _id: false }
);

const FacultySchema = new Schema<IFaculty>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    department: { type: String, required: true },
    designation: {
      type: String,
      enum: ["Lecturer", "AssistantProfessor", "AssociateProfessor", "Professor"],
      required: true,
    },
    preferences: { type: [CoursePreferenceSchema], default: [] },
    preferenceSubmittedAt: Date,
  },
  { timestamps: true }
);

// Zod validation schema
export const coursePreferencesSchema = z.object({
  preferences: z
    .array(
      z.object({
        courseId: z.string().min(1, "Invalid course ID"),
        timeSlots: z.array(z.string()).min(1, "At least one time slot is required"),
      })
    )
    .length(5, "Exactly 5 course preferences are required"),
});

const Faculty: Model<IFaculty> =
  mongoose.models.Faculty || mongoose.model<IFaculty>("Faculty", FacultySchema);

export default Faculty;

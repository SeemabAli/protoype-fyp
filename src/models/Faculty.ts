import { Schema, Document, models, model } from "mongoose";

export type Designation =
  | "Professor"
  | "Associate Professor"
  | "Assistant Professor"
  | "Lecturer";

export interface IFaculty extends Document {
  facultyId: string;
  name: string;
  department: string;
  designation: Designation;
  coursePreferences: string[];
  timePreferences?: string[];
  assignedCourses: string[];
  submittedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const FacultySchema = new Schema<IFaculty>(
  {
    facultyId: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    department: { type: String, required: true, trim: true },
    designation: {
      type: String,
      enum: ["Professor", "Associate Professor", "Assistant Professor", "Lecturer"],
      required: true,
    },
    coursePreferences: {
      type: [String],
      required: true,
      validate: {
        validator: (arr: string[]) => Array.isArray(arr) && arr.length >= 5,
        message: "At least five course preferences are required.",
      },
    },
    timePreferences: { type: [String], default: [] },
    assignedCourses: { type: [String], default: [] },
    submittedAt: { type: Date, default: () => new Date() },
  },
  { timestamps: true }
);

export default models.Faculty || model<IFaculty>("Faculty", FacultySchema);

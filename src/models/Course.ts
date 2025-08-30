// src/models/Course.ts
import { Schema, Document, models, model } from "mongoose";

export interface ICourse extends Document {
  code: string;
  title: string;
  enrollment: number;
  multimediaRequired: boolean;
  studentBatch?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

const CourseSchema = new Schema<ICourse>(
  {
    code: { type: String, required: true, unique: true, trim: true },
    title: { type: String, required: true, trim: true },
    enrollment: { type: Number, required: true, min: 0 },
    multimediaRequired: { type: Boolean, default: false },
    studentBatch: { type: String, default: null },
  },
  { timestamps: true }
);

export default models.Course || model<ICourse>("Course", CourseSchema);

import mongoose, { Schema, Document } from "mongoose";

export interface ICourse extends Document {
  code: string;
  title: string;
  enrollment: number;
  multimediaRequired: boolean;
}

const CourseSchema: Schema = new Schema(
  {
    code: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    enrollment: { type: Number, required: true },
    multimediaRequired: { type: Boolean, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Course || mongoose.model<ICourse>("Course", CourseSchema);

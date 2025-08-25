import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICourse extends Document {
  code: string;
  title: string;
  enrollment: number;
  multimediaRequired: boolean;
  studentBatch?: string;
  preferredFacultyIds?: string[];
}

const CourseSchema: Schema<ICourse> = new Schema(
  {
    code: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    enrollment: { type: Number, required: true },
    multimediaRequired: { type: Boolean, required: true },
    studentBatch: { type: String },
    preferredFacultyIds: [{ type: Schema.Types.ObjectId, ref: "Faculty" }],
  },
  { timestamps: true }
);

const Course: Model<ICourse> =
  mongoose.models.Course || mongoose.model<ICourse>("Course", CourseSchema);

export default Course;

import mongoose, { Schema, Document } from "mongoose";

export interface IStudent extends Document {
  name: string;
  email: string;
  department: string;
  rollNo: string;       // unique student roll number
  semester: number;
  section?: string;
}

const StudentSchema = new Schema<IStudent>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  department: { type: String, required: true },
  rollNo: { type: String, required: true, unique: true },
  semester: { type: Number, required: true },
  section: { type: String },
});

const Student =
  (mongoose.models.Student as mongoose.Model<IStudent>) ||
  mongoose.model<IStudent>("Student", StudentSchema);

export default Student;

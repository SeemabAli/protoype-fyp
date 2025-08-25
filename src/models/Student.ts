import mongoose, { Schema, Document } from "mongoose";

export interface IStudent extends Document {
  name: string;
  email: string;
  registrationNumber: string; // ✅ match frontend
  department: string;
  semester: number;
  section?: string;
}

const StudentSchema = new Schema<IStudent>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  registrationNumber: { type: String, required: true, unique: true }, // ✅ renamed
  department: { type: String, required: true },
  semester: { type: Number, required: true },
  section: { type: String },
});

const Student =
  (mongoose.models.Student as mongoose.Model<IStudent>) ||
  mongoose.model<IStudent>("Student", StudentSchema);

export default Student;

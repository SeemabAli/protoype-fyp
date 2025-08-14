import mongoose, { Schema, Document } from "mongoose";

export interface IFaculty extends Document {
  name: string;
  email: string;
  department: string;
}

const FacultySchema = new Schema<IFaculty>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  department: { type: String, required: true },
});

export default mongoose.models.Faculty || mongoose.model<IFaculty>("Faculty", FacultySchema);

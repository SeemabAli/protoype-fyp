// src/models/Classroom.ts
import mongoose, { Schema, Document, Model } from "mongoose";

export interface IClassroom extends Document {
  classroomId: string;
  building: string;
  capacity: number;
  multimedia: boolean;
}

const ClassroomSchema: Schema<IClassroom> = new Schema(
  {
    classroomId: { type: String, required: true, unique: true }, // e.g. B1-F0-01
    building: { type: String, required: true }, // e.g. Block 1
    capacity: { type: Number, required: true },
    multimedia: { type: Boolean, required: true },
  },
  { timestamps: true }
);

const Classroom: Model<IClassroom> =
  mongoose.models.Classroom || mongoose.model<IClassroom>("Classroom", ClassroomSchema);

export default Classroom;

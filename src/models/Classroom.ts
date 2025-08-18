import mongoose, { Schema, Document, Model } from "mongoose";

export interface IClassroom extends Document {
  classroomId: string;
  building: string;
  capacity: number;
  multimedia: boolean;
}

const ClassroomSchema: Schema<IClassroom> = new Schema(
  {
    classroomId: { type: String, required: true, unique: true },
    building: { type: String, required: true },
    capacity: { type: Number, required: true },
    multimedia: { type: Boolean, required: true },
  },
  { timestamps: true }
);

const Classroom: Model<IClassroom> =
  mongoose.models.Classroom || mongoose.model<IClassroom>("Classroom", ClassroomSchema);

export default Classroom;

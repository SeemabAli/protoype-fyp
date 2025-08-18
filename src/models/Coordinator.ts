import mongoose, { Schema, Document } from "mongoose";

export interface ICoordinator extends Document {
  name: string;
  email: string;
  department: string;
}

const CoordinatorSchema = new Schema<ICoordinator>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  department: { type: String, required: true },
});

const Coordinator =
  (mongoose.models.Coordinator as mongoose.Model<ICoordinator>) ||
  mongoose.model<ICoordinator>("Coordinator", CoordinatorSchema);

export default Coordinator;

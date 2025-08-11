
import mongoose, { Document, Model, Schema } from "mongoose";

export type UserRole = "admin" | "coordinator" | "faculty" | "student";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  designation?: string;
  createdAt?: Date;
}

const UserSchema: Schema<IUser> = new mongoose.Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "coordinator", "faculty", "student"], required: true },
  designation: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;

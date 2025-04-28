import mongoose, { Document, Schema, model, models } from "mongoose";

export interface IUser extends Document {
  name?: string;
  email: string;
  password?: string;
  image?: string;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    image: { type: String },
  },
  {
    timestamps: true,
  }
);

// ✅ Avoid OverwriteModelError during hot-reload (Next.js dev mode)
const User = models.User || model<IUser>("User", UserSchema);

export default User;

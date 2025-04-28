import { Document, Schema, model, models } from "mongoose";

export interface ITestimonial extends Document {
  name: string;
  course: string;
  type: string;
  content: string;
  message?: string;
  date: Date;
  userId: Schema.Types.ObjectId; // Correct type (ObjectId)
}

const TestimonialSchema = new Schema<ITestimonial>(
  {
    name: { type: String, required: true },
    course: { type: String, required: true },
    type: { type: String, required: true },
    content: { type: String, required: true },
    message: { type: String },
    date: { type: Date, required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Correct: ObjectId with ref
  },
  {
    timestamps: true,
  }
);

// Safely create model or use existing to avoid "overwrite model" error
const Testimonial =
  models.Testimonial || model<ITestimonial>("Testimonial", TestimonialSchema);

export default Testimonial;

// app/models/Testimonial.ts
import { Document, Schema, model, models } from "mongoose";

export interface ITestimonial extends Document {
  name: string;
  course: string;
  type: string;
  content: string;
  message: string;
  date: Date;
  userId: string; // ✅ userId is a string, not ObjectId
}

const TestimonialSchema = new Schema<ITestimonial>(
  {
    name: { type: String, required: true },
    course: { type: String, required: true },
    type: { type: String, required: true },
    content: { type: String, required: true },
    message: { type: String },
    date: { type: Date, required: true },
    userId: { type: String, required: true }, // userId is now a string
  },
  {
    timestamps: true,
  }
);

const Testimonial =
  models.Testimonial || model<ITestimonial>("Testimonial", TestimonialSchema);

export default Testimonial;

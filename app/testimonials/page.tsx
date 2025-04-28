import TestimonialGrid from "@/app/components/testimonial-grid";
import dbConnect from "@/lib/mongoose";
import Testimonial from "../models/Testimonial";
import User from "../models/User"; // Import the User model if needed

export default async function TestimonialsPage() {
  await dbConnect();

  // Fetch all testimonials and populate the userId to get the user details
  const testimonial = await Testimonial.find()
    .populate("userId") // This populates the userId field with user data
    .lean(); // `.lean()` to return plain JavaScript objects

  // Map through the testimonials and ensure that user data is properly structured
  const testimonials = testimonial.map((item) => ({
    id: String(item._id),
    name: item.name ?? "",
    email: item.email ?? "",
    course: item.course ?? "",
    type: item.type ?? "",
    image: item.image ?? "",
    content: item.content ?? "",
    date: item.date ?? new Date(),
    user: item.userId // Use the populated user data directly
      ? {
          name: item.userId.name ?? "Unknown User", // Access populated user data
          image: item.userId.image ?? "", // Access populated user image
        }
      : {
          name: "Unknown User", // Fallback if user not found
          image: "", // Fallback if user image is not found
        },
    createdAt: item.createdAt ?? new Date(),
    updatedAt: item.updatedAt ?? new Date(),
  }));

  return (
    <div className="mx-auto px-4 py-12 container">
      <h1 className="mb-8 font-bold text-3xl text-center">
        Course Testimonials
      </h1>

      {testimonials.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-muted-foreground">
            No testimonials yet. Be the first to share your experience!
          </p>
        </div>
      ) : (
        <TestimonialGrid testimonials={testimonials} />
      )}
    </div>
  );
}

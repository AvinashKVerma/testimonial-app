import mongoose from "mongoose";
import dbConnect from "@/lib/mongoose";
import Testimonial from "@/app/models/Testimonial";

async function migrateUserIds() {
  await dbConnect();
  const testimonials = await Testimonial.find();

  for (const testimonial of testimonials) {
    if (typeof testimonial.userId === "string") {
      console.log(`Migrating testimonial ${testimonial._id}`);
      testimonial.userId = new mongoose.Types.ObjectId(testimonial.userId);
      await testimonial.save();
    }
  }

  console.log("Migration complete ✅");
  process.exit(0);
}

migrateUserIds().catch((error) => {
  console.error(error);
  process.exit(1);
});

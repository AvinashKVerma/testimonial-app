import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // Adjust the path as necessary
import { FaQuoteLeft } from "react-icons/fa";
import RecentTestimonials from "@/app/components/recent-testimonials";
import { Button } from "@heroui/react";
import dbConnect from "@/lib/mongoose";
import Testimonial from "./models/Testimonial";
import User from "./models/User";

export default async function Home() {
  const session = await getServerSession(authOptions);

  // Connect to the database
  await dbConnect();

  // Get 3 recent testimonials
  const rawTestimonials = await Testimonial.find({})
    .sort({ createdAt: -1 }) // Order by the most recent
    .limit(3);

  // Fetch user details for each testimonial based on userId
  const recentTestimonials = await Promise.all(
    rawTestimonials.map(async (item) => {
      const user = await User.findOne({ _id: item.userId }); // Fetch the user using userId

      return {
        id: item._id.toString(),
        course: item.course,
        type: item.type,
        content: item.content,
        date: item.date,
        createdAt: item.createdAt,
        user: {
          name: user?.name || "Unknown User", // Fallback if user not found
          image: user?.image || "", // Fallback image if user not found
        },
      };
    })
  );

  return (
    <main className="mx-auto px-4 py-12 container">
      <section className="space-y-6 mx-auto max-w-4xl text-center">
        <div className="flex justify-center">
          <FaQuoteLeft className="opacity-50 text-primary text-5xl" />
        </div>
        <h1 className="font-bold text-4xl md:text-5xl tracking-tight">
          Share Your Learning Journey
        </h1>
        <p className="text-muted-foreground text-xl">
          Help future students by sharing your experience with our courses. Your
          testimonial can make a difference in someone&apos;s learning journey.
        </p>
        <div className="pt-4">
          <Link href={session ? "/submit" : "/api/auth/signin"}>
            <Button size="md" className="bg-black px-8 rounded-full text-white">
              Share Your Testimonial
            </Button>
          </Link>
        </div>
      </section>

      {recentTestimonials.length > 0 && (
        <section className="mt-24">
          <h2 className="mb-12 font-semibold text-2xl text-center">
            Recent Testimonials
          </h2>
          <RecentTestimonials testimonials={recentTestimonials} />
          <div className="mt-8 text-center">
            <Link href="/testimonials">
              <Button variant="bordered" className="border-black rounded-full">
                View All Testimonials
              </Button>
            </Link>
          </div>
        </section>
      )}
    </main>
  );
}

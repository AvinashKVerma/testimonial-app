import TestimonialGrid from "@/app/components/testimonial-grid";

type TestimonialType = "audio" | "video" | "text";

interface TestimonialWithUser {
  id: string;
  name: string;
  email: string;
  course: string;
  type: TestimonialType;
  image: string;
  content: string;
  date: Date;
  user: {
    name: string;
    image: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

function mapType(type: unknown): TestimonialType {
  if (type === "audio" || type === "video" || type === "text") {
    return type;
  }
  return "text"; // default fallback
}

async function getTestimonials(): Promise<TestimonialWithUser[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/testimonials?number=10&page=1`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch testimonials");
  }

  const data = await res.json();

  interface TestimonialAPIResponse {
    _id: string;
    name?: string;
    email?: string;
    course?: string;
    type?: string;
    image?: string;
    content?: string;
    date?: string;
    userId?: {
      name?: string;
      image?: string;
    };
    createdAt?: string;
    updatedAt?: string;
  }

  return (data.testimonials as TestimonialAPIResponse[]).map((item) => ({
    id: String(item._id),
    name: item.name ?? "",
    email: item.email ?? "",
    course: item.course ?? "",
    type: mapType(item.type),
    image: item.image ?? "",
    content: item.content ?? "",
    date: item.date ? new Date(item.date) : new Date(),
    user: item.userId
      ? {
          name: item.userId.name ?? "Unknown User",
          image: item.userId.image ?? "",
        }
      : {
          name: "Unknown User",
          image: "",
        },
    createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
    updatedAt: item.updatedAt ? new Date(item.updatedAt) : new Date(),
  }));
}

export default async function TestimonialsPage() {
  const testimonials = await getTestimonials();

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

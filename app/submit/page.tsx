import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import SubmitClientWrapper from "./submit-client-wrapper";

export default async function SubmitPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/api/auth/signin");
  }

  return (
    <div className="mx-auto px-4 py-12 container">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-8 font-bold text-3xl text-center">
          Share Your Testimonial
        </h1>
        <SubmitClientWrapper user={session.user} />
      </div>
    </div>
  );
}

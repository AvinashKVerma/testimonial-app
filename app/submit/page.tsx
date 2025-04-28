// // In SubmitPage component
// import { getServerSession } from "next-auth";
// import { redirect } from "next/navigation";
// import { authOptions } from "@/lib/auth"; // Adjust path if necessary
// import SubmitClientWrapper from "./submit-client-wrapper";

// export default async function Page() {
//   const session = await getServerSession(authOptions);

//   if (!session) {
//     redirect("/api/auth/signin");
//   }

//   return (
//     <div className="mx-auto px-4 py-12 container">
//       <div className="mx-auto max-w-2xl">
//         <h1 className="mb-8 font-bold text-3xl text-center">
//           Share Your Testimonial
//         </h1>
//         <SubmitClientWrapper user={session.user} />
//       </div>
//     </div>
//   );
// }

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // Adjust path if necessary
import SubmitForm from "../components/submit-form";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/api/auth/signin");
  }

  return (
    <main className="flex flex-col justify-start items-center p-24 min-h-screen">
      <h1 className="mb-8 font-bold text-4xl">Submit Testimonial</h1>
      {session?.user ? (
        <SubmitForm user={session.user} />
      ) : (
        <p>Please sign in to submit a testimonial.</p>
      )}
    </main>
  );
}

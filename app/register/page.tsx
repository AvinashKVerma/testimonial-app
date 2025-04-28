import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import RegisterForm from "@/app/components/register-form";

export default async function RegisterPage() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/");
  }

  return (
    <div className="mx-auto px-4 py-12 container">
      <div className="mx-auto max-w-md">
        <h1 className="mb-8 font-bold text-3xl text-center">
          Create an Account
        </h1>
        <RegisterForm />
      </div>
    </div>
  );
}

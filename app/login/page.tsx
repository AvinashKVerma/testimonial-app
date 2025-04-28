import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import LoginForm from "@/app/components/login-form";

export default async function LoginPage() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/");
  }

  return (
    <div className="mx-auto px-4 py-12 container">
      <div className="mx-auto max-w-md">
        <h1 className="mb-8 font-bold text-3xl text-center">Sign In</h1>
        <LoginForm />
      </div>
    </div>
  );
}

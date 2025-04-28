"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FaGoogle, FaGithub } from "react-icons/fa";
import { addToast, Button, Divider, Input } from "@heroui/react";
import { signIn } from "next-auth/react";

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
        callbackUrl,
      });

      if (!result?.ok) {
        addToast({
          title: "Error",
          description: "Invalid email or password. Please try again.",
          color: "danger",
        });
        return;
      }

      router.push(callbackUrl);
      router.refresh();
    } catch (error) {
      console.error("Login error:", error);
      addToast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        color: "danger",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleOAuthSignIn = async (provider: "google" | "github") => {
    setIsLoading(true);
    try {
      await signIn(provider, { callbackUrl });
    } catch (error) {
      console.error(`${provider} sign in error:`, error);
      addToast({
        title: "Error",
        description: `Failed to sign in with ${provider}. Please try again.`,
        color: "danger",
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="gap-4 grid">
        <Button
          variant="bordered"
          onPress={() => handleOAuthSignIn("google")}
          disabled={isLoading}
          className="w-full"
        >
          <FaGoogle className="mr-2 w-4 h-4" />
          Continue with Google
        </Button>
        <Button
          variant="bordered"
          onPress={() => handleOAuthSignIn("github")}
          disabled={isLoading}
          className="w-full"
        >
          <FaGithub className="mr-2 w-4 h-4" />
          Continue with GitHub
        </Button>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Divider className="w-full" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      {/* HeroUI Form components */}
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        <Input
          type="email"
          label="Email"
          labelPlacement="outside"
          variant="bordered"
          placeholder="example@example.com"
          {...form.register("email")}
          className="form-control"
        />

        <Input
          type="password"
          label="Password"
          labelPlacement="outside"
          variant="bordered"
          placeholder="Enter your password"
          {...form.register("password")}
          className="form-control"
        />

        <Button
          type="submit"
          className="bg-black w-full text-white"
          disabled={isLoading}
        >
          {isLoading ? "Signing in..." : "Sign In"}
        </Button>
      </form>

      <div className="text-sm text-center">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="underline">
          Sign up
        </Link>
      </div>
    </div>
  );
}

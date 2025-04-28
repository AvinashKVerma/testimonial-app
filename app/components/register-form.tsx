"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FaGoogle, FaGithub } from "react-icons/fa";
import { addToast, Button, Divider, Input } from "@heroui/react";
import { EyeFilledIcon, EyeSlashFilledIcon } from "./icons";

const formSchema = z
  .object({
    name: z.string().min(2, {
      message: "Name must be at least 2 characters.",
    }),
    email: z.string().email({
      message: "Please enter a valid email address.",
    }),
    password: z.string().min(6, {
      message: "Password must be at least 6 characters.",
    }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof formSchema>;

export default function RegisterForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          password: values.password,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to register");
      }

      addToast({
        title: "Success",
        description: "Your account has been created. Please sign in.",
        color: "success",
      });

      router.push("/login");
    } catch (error: any) {
      console.error("Registration error:", error);
      addToast({
        title: "Error",
        description: error.message || "Something went wrong. Please try again.",
        color: "danger",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleOAuthSignIn = async (provider: "google" | "github") => {
    setIsLoading(true);
    try {
      await signIn(provider, { callbackUrl: "/" });
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

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        <Input
          label="Name"
          labelPlacement="outside"
          variant="bordered"
          placeholder="John Doe"
          {...form.register("name")}
          errorMessage={form.formState.errors.name?.message}
        />
        <Input
          label="Email"
          labelPlacement="outside"
          variant="bordered"
          placeholder="example@example.com"
          {...form.register("email")}
          errorMessage={form.formState.errors.email?.message}
        />

        <Input
          label="Password"
          labelPlacement="outside"
          variant="bordered"
          type={isPasswordVisible ? "text" : "password"}
          {...form.register("password")}
          placeholder="Enter your password"
          errorMessage={form.formState.errors.password?.message}
          endContent={
            <button
              aria-label="toggle password visibility"
              className="focus:outline-none"
              type="button"
              onClick={() => setIsPasswordVisible(!isPasswordVisible)}
            >
              {isPasswordVisible ? (
                <EyeSlashFilledIcon className="text-default-400 text-2xl pointer-events-none" />
              ) : (
                <EyeFilledIcon className="text-default-400 text-2xl pointer-events-none" />
              )}
            </button>
          }
        />
        <Input
          label="Confirm Password"
          labelPlacement="outside"
          variant="bordered"
          placeholder="Confirm your password"
          type={isConfirmPasswordVisible ? "text" : "password"}
          {...form.register("confirmPassword")}
          errorMessage={form.formState.errors.confirmPassword?.message}
          endContent={
            <button
              type="button"
              onClick={() =>
                setIsConfirmPasswordVisible(!isConfirmPasswordVisible)
              }
            >
              {isConfirmPasswordVisible ? (
                <EyeSlashFilledIcon className="text-default-400 text-2xl pointer-events-none" />
              ) : (
                <EyeFilledIcon className="text-default-400 text-2xl pointer-events-none" />
              )}
            </button>
          }
        />
        <Button
          type="submit"
          className="bg-black w-full text-white"
          disabled={isLoading}
        >
          {isLoading ? "Creating account..." : "Create Account"}
        </Button>
      </form>

      <div className="text-sm text-center">
        Already have an account?{" "}
        <Link href="/login" className="underline">
          Sign in
        </Link>
      </div>
    </div>
  );
}

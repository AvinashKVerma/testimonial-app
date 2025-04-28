"use client";
import dynamic from "next/dynamic";
import { User } from "next-auth";

// Dynamic import of SubmitForm (SSR disabled)
const SubmitForm = dynamic(() => import("@/app/components/submit-form"), {
  ssr: false,
});

export default function SubmitClientWrapper({ user }: { user: User }) {
  return <SubmitForm user={user} />;
}

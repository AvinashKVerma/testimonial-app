"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signIn, signOut, useSession } from "next-auth/react";
import { FiMenu } from "react-icons/fi";
import { useState } from "react";
import {
  Button,
  Avatar,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const routes = [
    { href: "/", label: "Home" },
    { href: "/testimonials", label: "Testimonials" },
    ...(session ? [{ href: "/submit", label: "Submit" }] : []),
  ];

  const userInitials = session?.user?.name
    ? session.user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "?";

  return (
    <header className="border-b">
      <div className="flex justify-between items-center mx-auto px-4 h-16 container">
        <Link href="/" className="font-bold text-xl">
          Testimonials
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={`text-sm ${
                pathname === route.href
                  ? "font-medium text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {route.label}
            </Link>
          ))}

          {session ? (
            <Dropdown>
              <DropdownTrigger>
                <div className="flex items-center cursor-pointer">
                  <Avatar
                    name={session.user?.name || userInitials}
                    src={session.user?.image || ""}
                    showFallback
                    className="w-8 h-8"
                  />
                  <div className="px-3 py-2">
                    <p className="font-medium">{session.user?.name}</p>
                    <p className="max-w-[200px] text-muted-foreground text-xs truncate">
                      {session.user?.email}
                    </p>
                  </div>
                </div>
              </DropdownTrigger>
              <DropdownMenu aria-label="User Menu">
                <DropdownItem key="logout" onPress={() => signOut()}>
                  Log out
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          ) : (
            <Button variant="flat" onPress={() => signIn()}>
              Sign In
            </Button>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <FiMenu className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden p-4 border-t">
          <nav className="flex flex-col space-y-4">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={`text-sm ${
                  pathname === route.href
                    ? "font-medium text-foreground"
                    : "text-muted-foreground"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {route.label}
              </Link>
            ))}
            {session ? (
              <Button
                variant="bordered"
                onPress={() => {
                  signOut();
                  setMobileMenuOpen(false);
                }}
              >
                Log out
              </Button>
            ) : (
              <Button
                onPress={() => {
                  signIn();
                  setMobileMenuOpen(false);
                }}
              >
                Sign In
              </Button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}

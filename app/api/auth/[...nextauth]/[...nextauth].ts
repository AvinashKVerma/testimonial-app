import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";

import dbConnect from "@/lib/mongoose";
import User from "@/app/models/User";

declare module "next-auth" {
  interface Session {
    user: {
      _id: string;
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }

  interface User {
    _id: string;
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    password?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    _id: string;
    id: string;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID || "",
      clientSecret: process.env.GITHUB_SECRET || "",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing email or password");
        }

        await dbConnect();

        const user = await User.findOne({ email: credentials.email });

        if (!user || !user.password) {
          throw new Error("No user found");
        }

        const isValid = await compare(credentials.password, user.password);

        if (!isValid) {
          throw new Error("Incorrect password");
        }

        return {
          _id: user._id.toString(), // returning both _id and id
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          image: user.image,
        };
      },
    }),
  ],
  pages: {
    signIn: "/login",
    signOut: "/auth/signout",
    error: "/auth/error",
    verifyRequest: "/auth/verify-request",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token._id = (user as any)._id; // since NextAuth's `user` type doesn't know _id by default
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id && token._id) {
        session.user.id = token.id as string;
        session.user._id = token._id as string;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  events: {
    async signIn({ user, account }) {
      if (account?.provider !== "credentials") {
        await dbConnect();

        const email = user.email;

        if (!email) return;

        const existingUser = await User.findOne({ email });

        if (!existingUser) {
          await User.create({
            email,
            name: user.name,
            image: user.image,
            password: "oAuth",
          });
        }
      }
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

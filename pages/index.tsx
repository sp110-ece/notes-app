import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";

import { components, withAuthenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import DoSignUp from "@/componenets/doSignUp";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

type Props = {
  signOut?: () => void;
  user?: any;
};

export default function Home({ signOut, user }: Props) {
  return (
    <div
      className="relative font-sans min-h-screen flex items-center justify-center bg-[radial-gradient(circle_at_center,_var(--gradient-alpha),_var(--color-background)_70%)] text-gray-900 p-6 sm:p-10"
    >
      <main className="bg-[var(--color-background)] text-[var(--color-foreground)] shadow-2xl rounded-2xl p-10 max-w-md w-full text-center z-10">
        <h1 className="text-3xl mb-6">Notely</h1>
        <DoSignUp />
      </main>
    </div>
  );
}

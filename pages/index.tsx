


import "@aws-amplify/ui-react/styles.css";
import DoSignUp from "@/componenets/doSignUp";

type Props = {
  signOut?: () => void;
  
};

export default function Home({ }: Props) {
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

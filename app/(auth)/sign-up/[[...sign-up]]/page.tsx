import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <SignUp
      appearance={{
        elements: {
          rootBox: "w-full max-w-sm",
          card: "shadow-card border border-border rounded-3xl",
          headerTitle: "font-display",
          formButtonPrimary:
            "bg-gradient-to-r from-coral-500 to-indigo-500 hover:brightness-105 text-sm normal-case",
          footerActionLink: "text-indigo-600 hover:text-indigo-700",
        },
      }}
    />
  );
}

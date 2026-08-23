"use client";

import { Suspense, useState, type FormEvent } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setIsSubmitting(false);

    if (result?.error) {
      setError("Invalid email or password.");
      return;
    }

    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <div className="w-full max-w-sm">
      <h1 className="text-center font-heading text-4xl uppercase tracking-wide text-deep-espresso">
        Sign In
      </h1>
      <p className="mt-3 text-center font-sans text-sm text-muted-olive">
        Welcome back to AURELIA.
      </p>

      <form onSubmit={handleSubmit} className="mt-10 flex flex-col gap-4">
        <div className="flex flex-col text-left">
          <label
            htmlFor="email"
            className="mb-2 font-sans text-xs uppercase tracking-[0.2em] text-deep-espresso/70"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="border border-deep-espresso/30 bg-transparent px-4 py-3 font-sans text-sm text-deep-espresso focus:border-antique-gold focus:outline-none"
          />
        </div>

        <div className="flex flex-col text-left">
          <label
            htmlFor="password"
            className="mb-2 font-sans text-xs uppercase tracking-[0.2em] text-deep-espresso/70"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="border border-deep-espresso/30 bg-transparent px-4 py-3 font-sans text-sm text-deep-espresso focus:border-antique-gold focus:outline-none"
          />
        </div>

        {error && <p className="font-sans text-sm text-red-700">{error}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-4 w-full border border-deep-espresso px-8 py-3 font-sans text-xs font-medium uppercase tracking-[0.25em] text-deep-espresso transition-colors duration-300 ease-in-out hover:bg-deep-espresso hover:text-warm-ivory disabled:opacity-50"
        >
          {isSubmitting ? "Signing In…" : "Sign In"}
        </button>
      </form>

      <p className="mt-8 text-center font-sans text-sm text-muted-olive">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="text-deep-espresso underline underline-offset-2"
        >
          Create one
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-warm-ivory px-6 py-24">
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </main>
  );
}

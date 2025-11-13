"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/auth/AuthContext";

export default function ResetPasswordPage() {
  const { sendResetEmail } = useAuth();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    setError(null);

    const { error } = await sendResetEmail({
      email,
      redirectTo: `${window.location.origin}/auth/login`,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setStatus("Check your email for reset instructions.");
  };

  return (
    <main className="min-h-screen bg-gray-800 flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-lg shadow p-8">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">
          Reset Password
        </h1>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </label>

          {error && <p className="text-sm text-red-600">{error}</p>}
          {status && <p className="text-sm text-green-600">{status}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-blue-500 px-4 py-2 text-white font-semibold hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? "Sending..." : "Email reset link"}
          </button>
        </form>

        <div className="mt-6 text-sm text-center text-gray-600">
          <Link href="/auth/login" className="text-blue-500 hover:underline">
            Back to sign in
          </Link>
        </div>
      </div>
    </main>
  );
}

"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/auth/AuthContext";
import { useCart } from "@/components/cart/CartContext";

export default function CheckoutAuthPage() {
  const router = useRouter();
  const { user, loading, signUp } = useAuth();
  const { items } = useCart();
  const [showSignup, setShowSignup] = useState(false);
  const [signupForm, setSignupForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [signupLoading, setSignupLoading] = useState(false);
  const [signupError, setSignupError] = useState<string | null>(null);

  useEffect(() => {
    if (items.length === 0) {
      router.replace("/cart");
    }
  }, [items, router]);

  useEffect(() => {
    if (!loading && user) {
      router.replace("/checkout");
    }
  }, [user, loading, router]);

  const handleGuestCheckout = () => {
    router.push("/checkout");
  };

  const handleSignup = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSignupError(null);

    if (signupForm.password !== signupForm.confirmPassword) {
      setSignupError("Passwords do not match");
      return;
    }

    if (signupForm.password.length < 6) {
      setSignupError("Password must be at least 6 characters");
      return;
    }

    setSignupLoading(true);

    const { error } = await signUp({
      email: signupForm.email,
      password: signupForm.password,
    });

    setSignupLoading(false);

    if (error) {
      setSignupError(error.message);
      return;
    }

    router.push("/checkout");
  };

  if (loading || user) {
    return (
      <main className="min-h-screen bg-gray-800 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-800 py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-8 text-center">
            Continue to Checkout
          </h1>

          <div className="bg-white rounded-lg shadow-lg p-8 space-y-6">
            <div className="border-b pb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Checkout as Guest
              </h2>
              <p className="text-gray-600 mb-4">
                Continue without creating an account. You can still complete your
                purchase and track your order via email.
              </p>
              <button
                onClick={handleGuestCheckout}
                className="w-full bg-gray-700 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors font-semibold"
              >
                Continue as Guest
              </button>
            </div>

            <div>
              {!showSignup ? (
                <>
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Create an Account
                  </h2>
                  <p className="text-gray-600 mb-4">
                    Create an account to save your information, track orders, and
                    enjoy faster checkout on future purchases.
                  </p>
                  <button
                    onClick={() => setShowSignup(true)}
                    className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors font-semibold mb-4"
                  >
                    Create Account
                  </button>
                  <p className="text-sm text-center text-gray-600">
                    Already have an account?{" "}
                    <Link
                      href={`/auth/login?redirect=${encodeURIComponent("/checkout")}`}
                      className="text-blue-500 hover:underline"
                    >
                      Sign in
                    </Link>
                  </p>
                </>
              ) : (
                <>
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Create Account
                  </h2>
                  <form onSubmit={handleSignup} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        required
                        value={signupForm.email}
                        onChange={(e) =>
                          setSignupForm({
                            ...signupForm,
                            email: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                        placeholder="your.email@example.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Password
                      </label>
                      <input
                        type="password"
                        required
                        value={signupForm.password}
                        onChange={(e) =>
                          setSignupForm({
                            ...signupForm,
                            password: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                        placeholder="At least 6 characters"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        required
                        value={signupForm.confirmPassword}
                        onChange={(e) =>
                          setSignupForm({
                            ...signupForm,
                            confirmPassword: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                        placeholder="Confirm your password"
                      />
                    </div>

                    {signupError && (
                      <p className="text-sm text-red-600">{signupError}</p>
                    )}

                    <div className="flex gap-4">
                      <button
                        type="button"
                        onClick={() => {
                          setShowSignup(false);
                          setSignupError(null);
                          setSignupForm({
                            email: "",
                            password: "",
                            confirmPassword: "",
                          });
                        }}
                        className="flex-1 bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={signupLoading}
                        className="flex-1 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {signupLoading ? "Creating..." : "Create Account"}
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>

          <div className="mt-6 text-center">
            <Link
              href="/cart"
              className="text-white hover:text-gray-300 underline"
            >
              ← Return to Cart
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}


"use client";

import { useEffect, useState } from "react";
import { useRequireAuth } from "@/components/auth/useRequireAuth";
import { createClient } from "@/lib/supabase/client";

interface PaymentMethod {
  id: string;
  brand: string;
  last4: string;
  exp_month: number;
  exp_year: number;
  is_default: boolean;
  created_at: string;
}

export default function PaymentMethodsPage() {
  const { user, loading } = useRequireAuth();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    brand: "Visa",
    last4: "",
    exp_month: new Date().getMonth() + 1,
    exp_year: new Date().getFullYear(),
    is_default: false,
  });

  useEffect(() => {
    if (!user) return;
    fetchPaymentMethods();
  }, [user]);

  const fetchPaymentMethods = async () => {
    if (!user) return;

    const supabase = createClient();
    const { data, error } = await supabase
      .from("payment_methods")
      .select("*")
      .eq("user_id", user.id)
      .order("is_default", { ascending: false })
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching payment methods:", error);
      setError("Failed to load payment methods");
      return;
    }

    setPaymentMethods(data || []);
    setIsLoading(false);
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\D/g, "");
    return v.slice(0, 4);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (formData.last4.length !== 4) {
      setError("Please enter the last 4 digits of your card");
      return;
    }

    setError(null);
    const supabase = createClient();

    if (formData.is_default) {
      await supabase
        .from("payment_methods")
        .update({ is_default: false })
        .eq("user_id", user.id)
        .eq("is_default", true);
    }

    const { error } = await supabase.from("payment_methods").insert({
      ...formData,
      user_id: user.id,
    });

    if (error) {
      setError(error.message);
      return;
    }

    resetForm();
    fetchPaymentMethods();
  };

  const handleDelete = async (id: string) => {
    if (!user) return;
    if (!confirm("Are you sure you want to delete this payment method?"))
      return;

    const supabase = createClient();
    const { error } = await supabase
      .from("payment_methods")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      setError(error.message);
      return;
    }

    fetchPaymentMethods();
  };

  const handleSetDefault = async (id: string) => {
    if (!user) return;

    const supabase = createClient();

    await supabase
      .from("payment_methods")
      .update({ is_default: false })
      .eq("user_id", user.id)
      .eq("is_default", true);

    const { error } = await supabase
      .from("payment_methods")
      .update({ is_default: true })
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      setError(error.message);
      return;
    }

    fetchPaymentMethods();
  };

  const resetForm = () => {
    setFormData({
      brand: "Visa",
      last4: "",
      exp_month: new Date().getMonth() + 1,
      exp_year: new Date().getFullYear(),
      is_default: false,
    });
    setIsFormOpen(false);
    setError(null);
  };

  const getCardIcon = (brand: string) => {
    const brandLower = brand.toLowerCase();
    if (brandLower.includes("visa")) return "💳";
    if (brandLower.includes("mastercard") || brandLower.includes("master"))
      return "💳";
    if (brandLower.includes("amex") || brandLower.includes("american"))
      return "💳";
    return "💳";
  };

  const formatExpiry = (month: number, year: number) => {
    return `${String(month).padStart(2, "0")}/${String(year).slice(-2)}`;
  };

  if (loading || isLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">Loading payment methods...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="border-b border-gray-700 pb-4 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Payment Methods</h1>
          <p className="text-gray-400 mt-2">
            Manage your saved payment methods for faster checkout
          </p>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
        >
          + Add Payment Method
        </button>
      </header>

      {error && (
        <div className="bg-red-500/20 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {isFormOpen && (
        <div className="bg-gray-900 rounded-lg border border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            Add Payment Method
          </h2>
          <p className="text-gray-400 text-sm mb-4">
            For security, we only store the last 4 digits of your card. Full
            card details are never saved.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Card Brand *
                </label>
                <select
                  required
                  value={formData.brand}
                  onChange={(e) =>
                    setFormData({ ...formData, brand: e.target.value })
                  }
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option>Visa</option>
                  <option>Mastercard</option>
                  <option>American Express</option>
                  <option>Discover</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Last 4 Digits *
                </label>
                <input
                  type="text"
                  required
                  maxLength={4}
                  value={formData.last4}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      last4: formatCardNumber(e.target.value),
                    })
                  }
                  placeholder="1234"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Expiry Month *
                </label>
                <select
                  required
                  value={formData.exp_month}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      exp_month: parseInt(e.target.value),
                    })
                  }
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                    <option key={month} value={month}>
                      {String(month).padStart(2, "0")}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Expiry Year *
                </label>
                <select
                  required
                  value={formData.exp_year}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      exp_year: parseInt(e.target.value),
                    })
                  }
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {Array.from({ length: 10 }, (_, i) => {
                    const year = new Date().getFullYear() + i;
                    return (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    );
                  }).map((option) => option)}
                </select>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-700">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.is_default}
                  onChange={(e) =>
                    setFormData({ ...formData, is_default: e.target.checked })
                  }
                  className="mr-2"
                />
                <span className="text-gray-300">
                  Set as default payment method
                </span>
              </label>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
              >
                Save Payment Method
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {paymentMethods.length === 0 ? (
        <div className="text-center py-12 bg-gray-900 rounded-lg border border-gray-700">
          <p className="text-gray-400 text-lg mb-4">
            No saved payment methods yet
          </p>
          <button
            onClick={() => setIsFormOpen(true)}
            className="text-blue-400 hover:text-blue-200"
          >
            Add your first payment method →
          </button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              className="bg-gray-900 rounded-lg border border-gray-700 p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{getCardIcon(method.brand)}</span>
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      {method.brand}
                    </h3>
                    <p className="text-gray-400 text-sm">
                      Ending in {method.last4}
                    </p>
                  </div>
                </div>
                {method.is_default && (
                  <span className="bg-blue-500/20 text-blue-400 text-xs font-medium px-2 py-1 rounded border border-blue-500/30">
                    Default
                  </span>
                )}
              </div>

              <div className="text-gray-300 space-y-1 mb-4">
                <p>
                  Expires: {formatExpiry(method.exp_month, method.exp_year)}
                </p>
                <p className="text-gray-400 text-sm">
                  Added{" "}
                  {new Date(method.created_at).toLocaleDateString("en-GB", {
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>

              <div className="flex gap-2 pt-4 border-t border-gray-700">
                {!method.is_default && (
                  <button
                    onClick={() => handleSetDefault(method.id)}
                    className="text-sm text-blue-400 hover:text-blue-200"
                  >
                    Set as default
                  </button>
                )}
                <button
                  onClick={() => handleDelete(method.id)}
                  className="text-sm text-red-400 hover:text-red-200"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

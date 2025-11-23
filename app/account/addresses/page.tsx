"use client";

import { useEffect, useState } from "react";
import { useRequireAuth } from "@/components/auth/useRequireAuth";
import { createClient } from "@/lib/supabase/client";

interface Address {
  id: string;
  label: string | null;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  address_line1: string;
  address_line2: string | null;
  city: string;
  postcode: string;
  country: string;
  is_default: boolean;
  is_shipping: boolean;
  is_billing: boolean;
}

export default function AddressesPage() {
  const { user, loading } = useRequireAuth();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    label: "",
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    address_line1: "",
    address_line2: "",
    city: "",
    postcode: "",
    country: "United Kingdom",
    is_default: false,
    is_shipping: true,
    is_billing: true,
  });

  useEffect(() => {
    if (!user) return;
    fetchAddresses();
  }, [user]);

  const fetchAddresses = async () => {
    if (!user) return;

    const supabase = createClient();
    const { data, error } = await supabase
      .from("addresses")
      .select("*")
      .eq("user_id", user.id)
      .order("is_default", { ascending: false })
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching addresses:", error);
      setError("Failed to load addresses");
      return;
    }

    setAddresses(data || []);
    setIsLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setError(null);
    const supabase = createClient();

    // If setting as default, unset other defaults first
    if (formData.is_default) {
      const { error: updateError } = await supabase
        .from("addresses")
        .update({ is_default: false })
        .eq("user_id", user.id)
        .eq("is_default", true);

      if (updateError) {
        console.error("Error updating defaults:", updateError);
      }
    }

    if (editingAddress) {
      // Update existing address
      const { error } = await supabase
        .from("addresses")
        .update({
          ...formData,
          updated_at: new Date().toISOString(),
        })
        .eq("id", editingAddress.id)
        .eq("user_id", user.id);

      if (error) {
        setError(error.message);
        return;
      }
    } else {
      // Create new address
      const { error } = await supabase.from("addresses").insert({
        ...formData,
        user_id: user.id,
      });

      if (error) {
        setError(error.message);
        return;
      }
    }

    // Reset form and refresh
    resetForm();
    fetchAddresses();
  };

  const handleDelete = async (id: string) => {
    if (!user) return;
    if (!confirm("Are you sure you want to delete this address?")) return;

    const supabase = createClient();
    const { error } = await supabase
      .from("addresses")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      setError(error.message);
      return;
    }

    fetchAddresses();
  };

  const handleSetDefault = async (id: string) => {
    if (!user) return;

    const supabase = createClient();

    // Unset all other defaults
    await supabase
      .from("addresses")
      .update({ is_default: false })
      .eq("user_id", user.id)
      .eq("is_default", true);

    // Set this one as default
    const { error } = await supabase
      .from("addresses")
      .update({ is_default: true })
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      setError(error.message);
      return;
    }

    fetchAddresses();
  };

  const resetForm = () => {
    setFormData({
      label: "",
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      address_line1: "",
      address_line2: "",
      city: "",
      postcode: "",
      country: "United Kingdom",
      is_default: false,
      is_shipping: true,
      is_billing: true,
    });
    setEditingAddress(null);
    setIsFormOpen(false);
    setError(null);
  };

  const openEditForm = (address: Address) => {
    setFormData({
      label: address.label || "",
      first_name: address.first_name,
      last_name: address.last_name,
      email: address.email,
      phone: address.phone || "",
      address_line1: address.address_line1,
      address_line2: address.address_line2 || "",
      city: address.city,
      postcode: address.postcode,
      country: address.country,
      is_default: address.is_default,
      is_shipping: address.is_shipping,
      is_billing: address.is_billing,
    });
    setEditingAddress(address);
    setIsFormOpen(true);
  };

  if (loading || isLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">Loading addresses...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="border-b border-gray-700 pb-4 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Saved Addresses</h1>
          <p className="text-gray-400 mt-2">
            Manage your shipping and billing addresses
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setIsFormOpen(true);
          }}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
        >
          + Add Address
        </button>
      </header>

      {error && (
        <div className="bg-red-500/20 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Add/Edit Form */}
      {isFormOpen && (
        <div className="bg-gray-900 rounded-lg border border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            {editingAddress ? "Edit Address" : "Add New Address"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div> */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  First Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.first_name}
                  onChange={(e) =>
                    setFormData({ ...formData, first_name: e.target.value })
                  }
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Last Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.last_name}
                  onChange={(e) =>
                    setFormData({ ...formData, last_name: e.target.value })
                  }
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Label (optional)
                </label>
                <input
                  type="text"
                  value={formData.label}
                  onChange={(e) =>
                    setFormData({ ...formData, label: e.target.value })
                  }
                  placeholder="e.g., Home, Work"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Phone (optional)
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Country *
                </label>
                <select
                  required
                  value={formData.country}
                  onChange={(e) =>
                    setFormData({ ...formData, country: e.target.value })
                  }
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option>United Kingdom</option>
                  <option>United States</option>
                  <option>Canada</option>
                  <option>Australia</option>
                  <option>Germany</option>
                  <option>France</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Address Line 1 *
                </label>
                <input
                  type="text"
                  required
                  value={formData.address_line1}
                  onChange={(e) =>
                    setFormData({ ...formData, address_line1: e.target.value })
                  }
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Address Line 2 (optional)
                </label>
                <input
                  type="text"
                  value={formData.address_line2}
                  onChange={(e) =>
                    setFormData({ ...formData, address_line2: e.target.value })
                  }
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  City *
                </label>
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={(e) =>
                    setFormData({ ...formData, city: e.target.value })
                  }
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Postcode *
                </label>
                <input
                  type="text"
                  required
                  value={formData.postcode}
                  onChange={(e) =>
                    setFormData({ ...formData, postcode: e.target.value })
                  }
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-4 pt-4 border-t border-gray-700">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.is_default}
                  onChange={(e) =>
                    setFormData({ ...formData, is_default: e.target.checked })
                  }
                  className="mr-2"
                />
                <span className="text-gray-300">Set as default address</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.is_shipping}
                  onChange={(e) =>
                    setFormData({ ...formData, is_shipping: e.target.checked })
                  }
                  className="mr-2"
                />
                <span className="text-gray-300">Use for shipping</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.is_billing}
                  onChange={(e) =>
                    setFormData({ ...formData, is_billing: e.target.checked })
                  }
                  className="mr-2"
                />
                <span className="text-gray-300">Use for billing</span>
              </label>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
              >
                {editingAddress ? "Update Address" : "Save Address"}
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

      {/* Addresses List */}
      {addresses.length === 0 ? (
        <div className="text-center py-12 bg-gray-900 rounded-lg border border-gray-700">
          <p className="text-gray-400 text-lg mb-4">No saved addresses yet</p>
          <button
            onClick={() => {
              resetForm();
              setIsFormOpen(true);
            }}
            className="text-blue-400 hover:text-blue-200"
          >
            Add your first address →
          </button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {addresses.map((address) => (
            <div
              key={address.id}
              className="bg-gray-900 rounded-lg border border-gray-700 p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  {address.label && (
                    <h3 className="text-lg font-semibold text-white mb-1">
                      {address.label}
                    </h3>
                  )}
                  {address.is_default && (
                    <span className="inline-block bg-blue-500/20 text-blue-400 text-xs font-medium px-2 py-1 rounded border border-blue-500/30">
                      Default
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  {!address.is_default && (
                    <button
                      onClick={() => handleSetDefault(address.id)}
                      className="text-xs text-blue-400 hover:text-blue-200"
                    >
                      Set default
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(address.id)}
                    className="text-xs text-red-400 hover:text-red-200"
                  >
                    Delete
                  </button>
                </div>
              </div>

              <div className="text-gray-300 space-y-1 mb-4">
                <p>
                  {address.first_name} {address.last_name}
                </p>
                <p>{address.address_line1}</p>
                {address.address_line2 && <p>{address.address_line2}</p>}
                <p>
                  {address.city}, {address.postcode}
                </p>
                <p>{address.country}</p>
                {address.phone && <p className="mt-2">{address.phone}</p>}
                {/* <p className="text-gray-400 text-sm">{address.email}</p> */}
              </div>

              <div className="flex gap-2 text-xs text-gray-400 pt-4 border-t border-gray-700">
                {address.is_shipping && (
                  <span className="bg-gray-800 px-2 py-1 rounded">
                    Shipping
                  </span>
                )}
                {address.is_billing && (
                  <span className="bg-gray-800 px-2 py-1 rounded">Billing</span>
                )}
              </div>

              <button
                onClick={() => openEditForm(address)}
                className="mt-4 text-blue-400 hover:text-blue-200 text-sm"
              >
                Edit address →
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

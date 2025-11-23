"use client";

import { useCart } from "@/components/cart/CartContext";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/auth/AuthContext";
import { createClient } from "@/lib/supabase/client";

interface SavedAddress {
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

interface SavedPaymentMethod {
  id: string;
  brand: string;
  last4: string;
  exp_month: number;
  exp_year: number;
  is_default: boolean;
}

export default function CheckoutPage() {
  const { items, getTotalPrice } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Saved addresses and payment methods
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [savedPaymentMethods, setSavedPaymentMethods] = useState<
    SavedPaymentMethod[]
  >([]);
  const [selectedShippingAddressId, setSelectedShippingAddressId] =
    useState<string>("");
  const [selectedBillingAddressId, setSelectedBillingAddressId] =
    useState<string>("");
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] =
    useState<string>("");
  const [saveShippingAddress, setSaveShippingAddress] = useState(false);
  const [saveBillingAddress, setSaveBillingAddress] = useState(false);
  const [savePaymentMethod, setSavePaymentMethod] = useState(false);

  // Form state
  const [shippingInfo, setShippingInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postcode: "",
    country: "United Kingdom",
  });

  const [billingInfo, setBillingInfo] = useState({
    sameAsShipping: true,
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    postcode: "",
    country: "United Kingdom",
  });

  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardName: "",
  });

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      router.replace("/cart"); // replace avoids back-button issues
    }
  }, [items, router]);

  // Helper functions to fill forms from saved data
  const fillShippingForm = useCallback((address: SavedAddress) => {
    setShippingInfo({
      firstName: address.first_name,
      lastName: address.last_name,
      email: address.email,
      phone: address.phone || "",
      address:
        address.address_line1 +
        (address.address_line2 ? `, ${address.address_line2}` : ""),
      city: address.city,
      postcode: address.postcode,
      country: address.country,
    });
  }, []);

  const fillBillingForm = useCallback((address: SavedAddress) => {
    setBillingInfo((prev) => ({
      ...prev,
      firstName: address.first_name,
      lastName: address.last_name,
      address:
        address.address_line1 +
        (address.address_line2 ? `, ${address.address_line2}` : ""),
      city: address.city,
      postcode: address.postcode,
      country: address.country,
    }));
  }, []);

  const fillPaymentForm = useCallback((paymentMethod: SavedPaymentMethod) => {
    // We can't fill the full card number, but we can show the last 4
    // For security, we'll just pre-fill the expiry date
    const formattedExpiry = `${String(paymentMethod.exp_month).padStart(
      2,
      "0"
    )}/${String(paymentMethod.exp_year).slice(-2)}`;
    setPaymentInfo((prev) => ({
      ...prev,
      expiryDate: formattedExpiry,
      cardNumber: `**** **** **** ${paymentMethod.last4}`,
    }));
  }, []);

  // Fetch saved addresses and payment methods if user is logged in
  useEffect(() => {
    if (!user) return;

    const fetchSavedData = async () => {
      const supabase = createClient();

      // Fetch addresses
      const { data: addresses } = await supabase
        .from("addresses")
        .select("*")
        .eq("user_id", user.id)
        .order("is_default", { ascending: false });

      if (addresses) {
        setSavedAddresses(addresses);
        // Auto-select default shipping address if available
        const defaultShipping = addresses.find(
          (addr) => addr.is_default && addr.is_shipping
        );
        if (defaultShipping) {
          setSelectedShippingAddressId(defaultShipping.id);
        }
      }

      // Fetch payment methods
      const { data: paymentMethods } = await supabase
        .from("payment_methods")
        .select("*")
        .eq("user_id", user.id)
        .order("is_default", { ascending: false });

      if (paymentMethods) {
        setSavedPaymentMethods(paymentMethods);
        // Auto-select default payment method if available
        const defaultPayment = paymentMethods.find((pm) => pm.is_default);
        if (defaultPayment) {
          setSelectedPaymentMethodId(defaultPayment.id);
        }
      }
    };

    fetchSavedData();
  }, [user]);

  // Auto-fill forms when saved data is selected
  useEffect(() => {
    if (selectedShippingAddressId) {
      const address = savedAddresses.find(
        (addr) => addr.id === selectedShippingAddressId
      );
      if (address) {
        fillShippingForm(address);
      }
    }
  }, [selectedShippingAddressId, savedAddresses, fillShippingForm]);

  useEffect(() => {
    if (selectedPaymentMethodId) {
      const paymentMethod = savedPaymentMethods.find(
        (pm) => pm.id === selectedPaymentMethodId
      );
      if (paymentMethod) {
        fillPaymentForm(paymentMethod);
      }
    }
  }, [selectedPaymentMethodId, savedPaymentMethods, fillPaymentForm]);

  if (items.length === 0) {
    return null; // or a spinner
  }

  // Handle address selection
  const handleShippingAddressSelect = (addressId: string) => {
    setSelectedShippingAddressId(addressId);
    if (addressId === "") {
      // Clear form
      setShippingInfo({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        postcode: "",
        country: "United Kingdom",
      });
    } else {
      const address = savedAddresses.find((addr) => addr.id === addressId);
      if (address) {
        fillShippingForm(address);
      }
    }
  };

  const handleBillingAddressSelect = (addressId: string) => {
    setSelectedBillingAddressId(addressId);
    if (addressId === "") {
      // Clear form
      setBillingInfo({
        ...billingInfo,
        firstName: "",
        lastName: "",
        address: "",
        city: "",
        postcode: "",
        country: "United Kingdom",
      });
    } else {
      const address = savedAddresses.find((addr) => addr.id === addressId);
      if (address) {
        fillBillingForm(address);
      }
    }
  };

  const handlePaymentMethodSelect = (paymentMethodId: string) => {
    setSelectedPaymentMethodId(paymentMethodId);
    if (paymentMethodId === "") {
      // Clear form
      setPaymentInfo({
        cardNumber: "",
        expiryDate: "",
        cvv: "",
        cardName: "",
      });
    } else {
      const paymentMethod = savedPaymentMethods.find(
        (pm) => pm.id === paymentMethodId
      );
      if (paymentMethod) {
        fillPaymentForm(paymentMethod);
      }
    }
  };

  const isExpiryDateValid = (expiryDate: string) => {
    const [monthStr, yearStr] = expiryDate.split("/");
    const expMonth = parseInt(monthStr, 10);
    const expYear = parseInt(yearStr, 10);

    if (
      Number.isNaN(expMonth) ||
      Number.isNaN(expYear) ||
      expMonth < 1 ||
      expMonth > 12 ||
      yearStr.length !== 2
    ) {
      return false;
    }

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear() % 100;

    if (expYear < currentYear) {
      return false;
    }

    if (expYear === currentYear && expMonth < currentMonth) {
      return false;
    }

    return true;
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Shipping validation
    if (!shippingInfo.firstName.trim())
      newErrors.shippingFirstName = "First name is required";
    if (!shippingInfo.lastName.trim())
      newErrors.shippingLastName = "Last name is required";
    if (!shippingInfo.email.trim())
      newErrors.shippingEmail = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(shippingInfo.email))
      newErrors.shippingEmail = "Invalid email address";
    if (!shippingInfo.phone.trim())
      newErrors.shippingPhone = "Phone number is required";
    if (!shippingInfo.address.trim())
      newErrors.shippingAddress = "Address is required";
    if (!shippingInfo.city.trim()) newErrors.shippingCity = "City is required";
    if (!shippingInfo.postcode.trim())
      newErrors.shippingPostcode = "Postcode is required";

    // Billing validation
    if (!billingInfo.sameAsShipping) {
      if (!billingInfo.firstName.trim())
        newErrors.billingFirstName = "First name is required";
      if (!billingInfo.lastName.trim())
        newErrors.billingLastName = "Last name is required";
      if (!billingInfo.address.trim())
        newErrors.billingAddress = "Address is required";
      if (!billingInfo.city.trim()) newErrors.billingCity = "City is required";
      if (!billingInfo.postcode.trim())
        newErrors.billingPostcode = "Postcode is required";
    }

    // Payment validation
    if (!paymentInfo.cardNumber.trim())
      newErrors.cardNumber = "Card number is required";
    else if (selectedPaymentMethodId) {
      // If using saved payment method, allow masked format
      if (
        !/^\*\*\*\*\s?\*\*\*\*\s?\*\*\*\*\s?\d{4}$/.test(
          paymentInfo.cardNumber.replace(/\s/g, "")
        )
      ) {
        newErrors.cardNumber = "Invalid card number format";
      }
    } else if (
      !/^\d{4}\s?\d{4}\s?\d{4}\s?\d{4}$/.test(
        paymentInfo.cardNumber.replace(/\s/g, "")
      )
    ) {
      newErrors.cardNumber = "Invalid card number";
    }
    if (!paymentInfo.expiryDate.trim())
      newErrors.expiryDate = "Expiry date is required";
    else if (!/^\d{2}\/\d{2}$/.test(paymentInfo.expiryDate))
      newErrors.expiryDate = "Invalid format (MM/YY)";
    else if (!isExpiryDateValid(paymentInfo.expiryDate))
      newErrors.expiryDate = "Card has expired";
    if (!paymentInfo.cvv.trim()) newErrors.cvv = "CVV is required";
    else if (!/^\d{3,4}$/.test(paymentInfo.cvv)) newErrors.cvv = "Invalid CVV";
    if (!paymentInfo.cardName.trim())
      newErrors.cardName = "Cardholder name is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(" ");
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\D/g, "");
    if (v.length >= 2) {
      return v.substring(0, 2) + "/" + v.substring(2, 4);
    }
    return v;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const supabase = createClient();

      // Save addresses if requested and user is logged in
      if (user) {
        // Save shipping address
        if (saveShippingAddress && !selectedShippingAddressId) {
          const [addressLine1, ...addressLine2Parts] =
            shippingInfo.address.split(", ");
          const addressLine2 = addressLine2Parts.join(", ") || null;

          await supabase.from("addresses").insert({
            user_id: user.id,
            label: null,
            first_name: shippingInfo.firstName,
            last_name: shippingInfo.lastName,
            email: shippingInfo.email,
            phone: shippingInfo.phone || null,
            address_line1: addressLine1,
            address_line2: addressLine2,
            city: shippingInfo.city,
            postcode: shippingInfo.postcode,
            country: shippingInfo.country,
            is_shipping: true,
            is_billing: false,
            is_default: savedAddresses.length === 0, // First address is default
          });
        }

        // Save billing address (if different from shipping)
        if (
          saveBillingAddress &&
          !billingInfo.sameAsShipping &&
          !selectedBillingAddressId
        ) {
          const [addressLine1, ...addressLine2Parts] =
            billingInfo.address.split(", ");
          const addressLine2 = addressLine2Parts.join(", ") || null;

          await supabase.from("addresses").insert({
            user_id: user.id,
            label: null,
            first_name: billingInfo.firstName,
            last_name: billingInfo.lastName,
            email: shippingInfo.email, // Use shipping email
            phone: shippingInfo.phone || null,
            address_line1: addressLine1,
            address_line2: addressLine2,
            city: billingInfo.city,
            postcode: billingInfo.postcode,
            country: billingInfo.country,
            is_shipping: false,
            is_billing: true,
            is_default: false,
          });
        }

        // Save payment method if requested
        if (savePaymentMethod && !selectedPaymentMethodId) {
          // Extract last 4 digits and brand from card number
          const cardNumberDigits = paymentInfo.cardNumber.replace(/\s/g, "");
          const last4 = cardNumberDigits.slice(-4);
          const [monthStr, yearStr] = paymentInfo.expiryDate.split("/");
          const expMonth = parseInt(monthStr, 10);
          const expYear = 2000 + parseInt(yearStr, 10); // Convert YY to YYYY

          // Try to detect brand from card number (simplified)
          let brand = "Other";
          if (cardNumberDigits.startsWith("4")) brand = "Visa";
          else if (cardNumberDigits.startsWith("5")) brand = "Mastercard";
          else if (cardNumberDigits.startsWith("3")) brand = "American Express";

          await supabase.from("payment_methods").insert({
            user_id: user.id,
            brand,
            last4,
            exp_month: expMonth,
            exp_year: expYear,
            is_default: savedPaymentMethods.length === 0, // First payment method is default
          });
        }
      }

      // Calculate totals
      const subtotal = getTotalPrice();
      const shippingCost = 5.99; // Your shipping cost
      const finalTotal = subtotal + shippingCost;

      // Prepare order data to send to API
      const orderData = {
        items,
        shippingInfo,
        billingInfo: billingInfo.sameAsShipping ? shippingInfo : billingInfo,
        subtotal,
        shippingCost,
        total: finalTotal,
      };

      // Call API route to save order
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage =
          errorData.message || errorData.error || "Failed to create order";
        throw new Error(errorMessage);
      }

      const result = await response.json();

      // Redirect to success page with order number
      router.push(`/checkout/success?orderNumber=${result.orderNumber}`);
    } catch (error) {
      console.error("Error creating order:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to create order. Please try again.";
      alert(errorMessage);
      setIsSubmitting(false);
    }
  };

  const subtotal = getTotalPrice();
  const shipping = 5.99; // Fixed shipping cost
  const total = subtotal + shipping;

  return (
    <main className="py-8 bg-gray-800 min-h-screen">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-white">Checkout</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Forms */}
            <div className="lg:col-span-2 space-y-8">
              {/* Shipping Information */}
              <section className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">
                  Shipping Information
                </h2>
                {user &&
                  savedAddresses.filter((addr) => addr.is_shipping).length >
                    0 && (
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Use Saved Address
                      </label>
                      <select
                        value={selectedShippingAddressId}
                        onChange={(e) =>
                          handleShippingAddressSelect(e.target.value)
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                      >
                        <option value="">Enter new address</option>
                        {savedAddresses
                          .filter((addr) => addr.is_shipping)
                          .map((addr) => (
                            <option key={addr.id} value={addr.id}>
                              {addr.label ||
                                `${addr.first_name} ${addr.last_name}`}
                              {addr.is_default && " (Default)"}
                            </option>
                          ))}
                      </select>
                    </div>
                  )}
                {user && (
                  <div className="mb-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={saveShippingAddress}
                        onChange={(e) =>
                          setSaveShippingAddress(e.target.checked)
                        }
                        className="mr-2"
                        disabled={!!selectedShippingAddressId}
                      />
                      <span className="text-sm text-gray-700">
                        Save this address for future orders
                      </span>
                    </label>
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      value={shippingInfo.firstName}
                      onChange={(e) =>
                        setShippingInfo({
                          ...shippingInfo,
                          firstName: e.target.value,
                        })
                      }
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 ${
                        errors.shippingFirstName
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    {errors.shippingFirstName && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.shippingFirstName}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      value={shippingInfo.lastName}
                      onChange={(e) =>
                        setShippingInfo({
                          ...shippingInfo,
                          lastName: e.target.value,
                        })
                      }
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 ${
                        errors.shippingLastName
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    {errors.shippingLastName && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.shippingLastName}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={shippingInfo.email}
                      onChange={(e) =>
                        setShippingInfo({
                          ...shippingInfo,
                          email: e.target.value,
                        })
                      }
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 ${
                        errors.shippingEmail
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    {errors.shippingEmail && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.shippingEmail}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      value={shippingInfo.phone}
                      onChange={(e) =>
                        setShippingInfo({
                          ...shippingInfo,
                          phone: e.target.value,
                        })
                      }
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 ${
                        errors.shippingPhone
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    {errors.shippingPhone && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.shippingPhone}
                      </p>
                    )}
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address *
                    </label>
                    <input
                      type="text"
                      value={shippingInfo.address}
                      onChange={(e) =>
                        setShippingInfo({
                          ...shippingInfo,
                          address: e.target.value,
                        })
                      }
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 ${
                        errors.shippingAddress
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    {errors.shippingAddress && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.shippingAddress}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      value={shippingInfo.city}
                      onChange={(e) =>
                        setShippingInfo({
                          ...shippingInfo,
                          city: e.target.value,
                        })
                      }
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 ${
                        errors.shippingCity
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    {errors.shippingCity && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.shippingCity}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Postcode *
                    </label>
                    <input
                      type="text"
                      value={shippingInfo.postcode}
                      onChange={(e) =>
                        setShippingInfo({
                          ...shippingInfo,
                          postcode: e.target.value,
                        })
                      }
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 ${
                        errors.shippingPostcode
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    {errors.shippingPostcode && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.shippingPostcode}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Country *
                    </label>
                    <select
                      value={shippingInfo.country}
                      onChange={(e) =>
                        setShippingInfo({
                          ...shippingInfo,
                          country: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                    >
                      <option>United Kingdom</option>
                      <option>United States</option>
                      <option>Canada</option>
                      <option>Australia</option>
                      <option>Germany</option>
                      <option>France</option>
                    </select>
                  </div>
                </div>
              </section>

              {/* Billing Information */}
              <section className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">
                  Billing Information
                </h2>
                <div className="mb-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={billingInfo.sameAsShipping}
                      onChange={(e) =>
                        setBillingInfo({
                          ...billingInfo,
                          sameAsShipping: e.target.checked,
                        })
                      }
                      className="mr-2 w-4 h-4"
                    />
                    <span className="text-gray-700">
                      Same as shipping address
                    </span>
                  </label>
                </div>
                {!billingInfo.sameAsShipping && (
                  <>
                    {user &&
                      savedAddresses.filter((addr) => addr.is_billing).length >
                        0 && (
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Use Saved Billing Address
                          </label>
                          <select
                            value={selectedBillingAddressId}
                            onChange={(e) =>
                              handleBillingAddressSelect(e.target.value)
                            }
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                          >
                            <option value="">Enter new address</option>
                            {savedAddresses
                              .filter((addr) => addr.is_billing)
                              .map((addr) => (
                                <option key={addr.id} value={addr.id}>
                                  {addr.label ||
                                    `${addr.first_name} ${addr.last_name}`}
                                  {addr.is_default && " (Default)"}
                                </option>
                              ))}
                          </select>
                        </div>
                      )}
                    {user && (
                      <div className="mb-4">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={saveBillingAddress}
                            onChange={(e) =>
                              setSaveBillingAddress(e.target.checked)
                            }
                            className="mr-2"
                            disabled={!!selectedBillingAddressId}
                          />
                          <span className="text-sm text-gray-700">
                            Save this billing address for future orders
                          </span>
                        </label>
                      </div>
                    )}
                  </>
                )}
                {!billingInfo.sameAsShipping && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name *
                      </label>
                      <input
                        type="text"
                        value={billingInfo.firstName}
                        onChange={(e) =>
                          setBillingInfo({
                            ...billingInfo,
                            firstName: e.target.value,
                          })
                        }
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 ${
                          errors.billingFirstName
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                      />
                      {errors.billingFirstName && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.billingFirstName}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        value={billingInfo.lastName}
                        onChange={(e) =>
                          setBillingInfo({
                            ...billingInfo,
                            lastName: e.target.value,
                          })
                        }
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 ${
                          errors.billingLastName
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                      />
                      {errors.billingLastName && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.billingLastName}
                        </p>
                      )}
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Address *
                      </label>
                      <input
                        type="text"
                        value={billingInfo.address}
                        onChange={(e) =>
                          setBillingInfo({
                            ...billingInfo,
                            address: e.target.value,
                          })
                        }
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 ${
                          errors.billingAddress
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                      />
                      {errors.billingAddress && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.billingAddress}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        value={billingInfo.city}
                        onChange={(e) =>
                          setBillingInfo({
                            ...billingInfo,
                            city: e.target.value,
                          })
                        }
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 ${
                          errors.billingCity
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                      />
                      {errors.billingCity && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.billingCity}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Postcode *
                      </label>
                      <input
                        type="text"
                        value={billingInfo.postcode}
                        onChange={(e) =>
                          setBillingInfo({
                            ...billingInfo,
                            postcode: e.target.value,
                          })
                        }
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 ${
                          errors.billingPostcode
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                      />
                      {errors.billingPostcode && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.billingPostcode}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Country *
                      </label>
                      <select
                        value={billingInfo.country}
                        onChange={(e) =>
                          setBillingInfo({
                            ...billingInfo,
                            country: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                      >
                        <option>United Kingdom</option>
                        <option>United States</option>
                        <option>Canada</option>
                        <option>Australia</option>
                        <option>Germany</option>
                        <option>France</option>
                      </select>
                    </div>
                  </div>
                )}
              </section>

              {/* Payment Information */}
              <section className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">
                  Payment Information
                </h2>
                {user && savedPaymentMethods.length > 0 && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Use Saved Payment Method
                    </label>
                    <select
                      value={selectedPaymentMethodId}
                      onChange={(e) =>
                        handlePaymentMethodSelect(e.target.value)
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                    >
                      <option value="">Enter new payment method</option>
                      {savedPaymentMethods.map((pm) => (
                        <option key={pm.id} value={pm.id}>
                          {pm.brand} ending in {pm.last4}
                          {pm.is_default && " (Default)"}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                {user && (
                  <div className="mb-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={savePaymentMethod}
                        onChange={(e) => setSavePaymentMethod(e.target.checked)}
                        className="mr-2"
                        disabled={!!selectedPaymentMethodId}
                      />
                      <span className="text-sm text-gray-700">
                        Save this payment method for future orders
                      </span>
                    </label>
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Card Number *
                    </label>
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      value={paymentInfo.cardNumber}
                      onChange={(e) =>
                        setPaymentInfo({
                          ...paymentInfo,
                          cardNumber: formatCardNumber(e.target.value),
                        })
                      }
                      maxLength={19}
                      readOnly={!!selectedPaymentMethodId}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 ${
                        errors.cardNumber ? "border-red-500" : "border-gray-300"
                      } ${
                        selectedPaymentMethodId
                          ? "bg-gray-100 cursor-not-allowed"
                          : ""
                      }`}
                    />
                    {errors.cardNumber && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.cardNumber}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Expiry Date *
                    </label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      value={paymentInfo.expiryDate}
                      onChange={(e) =>
                        setPaymentInfo({
                          ...paymentInfo,
                          expiryDate: formatExpiryDate(e.target.value),
                        })
                      }
                      maxLength={5}
                      readOnly={!!selectedPaymentMethodId}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 ${
                        errors.expiryDate ? "border-red-500" : "border-gray-300"
                      } ${
                        selectedPaymentMethodId
                          ? "bg-gray-100 cursor-not-allowed"
                          : ""
                      }`}
                    />
                    {errors.expiryDate && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.expiryDate}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CVV *
                    </label>
                    <input
                      type="text"
                      placeholder="123"
                      value={paymentInfo.cvv}
                      onChange={(e) =>
                        setPaymentInfo({
                          ...paymentInfo,
                          cvv: e.target.value.replace(/\D/g, "").slice(0, 4),
                        })
                      }
                      maxLength={4}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 ${
                        errors.cvv ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.cvv && (
                      <p className="text-red-500 text-sm mt-1">{errors.cvv}</p>
                    )}
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cardholder Name *
                    </label>
                    <input
                      type="text"
                      value={paymentInfo.cardName}
                      onChange={(e) =>
                        setPaymentInfo({
                          ...paymentInfo,
                          cardName: e.target.value,
                        })
                      }
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 ${
                        errors.cardName ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.cardName && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.cardName}
                      </p>
                    )}
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-4">
                  * This is a demo checkout. No actual payment will be
                  processed.
                </p>
              </section>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  Order Summary
                </h2>
                <div className="space-y-3 mb-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {item.name} x{item.quantity}
                      </span>
                      <span className="text-gray-800">
                        £{(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="border-t pt-3 space-y-2">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>£{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span>£{shipping.toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between font-bold text-lg text-gray-800">
                      <span>Total</span>
                      <span>£{total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors font-semibold mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Processing..." : "Place Order"}
                </button>
                <Link
                  href="/cart"
                  className="block text-center text-blue-500 hover:text-blue-600 underline mt-4 text-sm"
                >
                  Return to Cart
                </Link>
              </div>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}

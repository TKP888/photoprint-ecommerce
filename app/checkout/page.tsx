"use client";

import { useCart } from "@/components/cart/CartContext";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CheckoutPage() {
  const { items, getTotalPrice } = useCart();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

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
  if (items.length === 0) {
    router.push("/cart");
    return null;
  }

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
    else if (
      !/^\d{4}\s?\d{4}\s?\d{4}\s?\d{4}$/.test(
        paymentInfo.cardNumber.replace(/\s/g, "")
      )
    )
      newErrors.cardNumber = "Invalid card number";
    if (!paymentInfo.expiryDate.trim())
      newErrors.expiryDate = "Expiry date is required";
    else if (!/^\d{2}\/\d{2}$/.test(paymentInfo.expiryDate))
      newErrors.expiryDate = "Invalid format (MM/YY)";
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
        throw new Error("Failed to create order");
      }

      const result = await response.json();

      // Redirect to success page with order number
      router.push(`/checkout/success?orderNumber=${result.orderNumber}`);
    } catch (error) {
      console.error("Error creating order:", error);
      alert("Failed to create order. Please try again.");
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
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 ${
                        errors.cardNumber ? "border-red-500" : "border-gray-300"
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
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 ${
                        errors.expiryDate ? "border-red-500" : "border-gray-300"
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

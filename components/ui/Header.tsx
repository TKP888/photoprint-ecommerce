"use client";

import Link from "next/link";
import { useCart } from "@/components/cart/CartContext";
import { useState } from "react";
import { useAuth } from "@/components/auth/AuthContext";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Header() {
  const {
    getTotalItems,
    items,
    getTotalPrice,
    updateQuantity,
    removeFromCart,
  } = useCart();
  const { user, signOut } = useAuth();
  const totalItems = getTotalItems();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAccountHover, setIsAccountHover] = useState(false);
  const [isCartHover, setIsCartHover] = useState(false);
  const [isMobileCartOpen, setIsMobileCartOpen] = useState(false);
  const [isMobileAccountOpen, setIsMobileAccountOpen] = useState(false);
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.replace("/"); // optional: redirect home after logout
  };

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Products", href: "/product" },
    { label: "Services", href: "/services" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-gray-300 text-black shadow-sm">
      <div className="container mx-auto px-4 md:px-8 py-4 md:py-8">
        <div className="flex items-center justify-between relative">
          {/* Left Section - Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="hover:text-gray-500">
              <h1 className="text-2xl font-bold">PhotoPrint</h1>
            </Link>
          </div>

          {/* Middle Section - Navigation Links (Centered) */}
          <nav className="hidden md:block absolute left-1/2 transform -translate-x-1/2">
            <ul className="flex gap-8 text-lg font-bold items-center">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-gray-500 hover:underline"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Right Section - Account & Cart Icons */}
          <div className="hidden md:flex items-center gap-4 flex-shrink-0">
            {/* Cart Icon with Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setIsCartHover(true)}
              onMouseLeave={() => setIsCartHover(false)}
            >
              <Link
                href="/cart"
                className="relative inline-flex items-center justify-center p-2 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs font-bold rounded-full min-w-[20px] h-5 px-1.5 flex items-center justify-center">
                    {totalItems > 99 ? "99+" : totalItems}
                  </span>
                )}
              </Link>

              {/* Cart Dropdown */}
              {isCartHover && (
                <div
                  className="absolute right-0 w-80 z-50"
                  onMouseEnter={() => setIsCartHover(true)}
                  onMouseLeave={() => setIsCartHover(false)}
                >
                  {/* Invisible bridge to make hover easier */}
                  <div className="h-2"></div>
                  <div className="mt-2 bg-white rounded-lg shadow-xl border border-gray-200">
                    {items.length === 0 ? (
                      <div className="p-6 text-center text-gray-500">
                        <p className="text-sm">Your cart is empty</p>
                        <Link
                          href="/product"
                          className="mt-2 inline-block text-blue-500 hover:text-blue-600 text-sm"
                        >
                          Continue Shopping →
                        </Link>
                      </div>
                    ) : (
                      <>
                        <div className="max-h-96 overflow-y-auto">
                          <div className="p-4 border-b border-gray-200">
                            <h3 className="font-semibold text-gray-800">
                              Cart ({totalItems}{" "}
                              {totalItems === 1 ? "item" : "items"})
                            </h3>
                          </div>
                          <div className="divide-y divide-gray-200">
                            {items.map((item) => (
                              <div
                                key={item.id}
                                className="p-4 flex gap-3 hover:bg-gray-50"
                              >
                                <div className="relative w-16 h-16 flex-shrink-0 bg-gray-100 rounded">
                                  {item.imageUrl && (
                                    <Image
                                      src={item.imageUrl}
                                      alt={item.name}
                                      fill
                                      className="object-cover rounded"
                                    />
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start justify-between gap-2">
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-medium text-gray-800 truncate">
                                        {item.name}
                                      </p>
                                      <p className="text-sm font-semibold text-gray-800 mt-1">
                                        £
                                        {(item.price * item.quantity).toFixed(
                                          2
                                        )}
                                      </p>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        removeFromCart(item.id);
                                      }}
                                      className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
                                      aria-label="Remove item"
                                    >
                                      <svg
                                        className="h-4 w-4"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M6 18L18 6M6 6l12 12"
                                        />
                                      </svg>
                                    </button>
                                  </div>
                                  <div className="flex items-center gap-2 mt-2">
                                    <span className="text-xs text-gray-500">
                                      Qty:
                                    </span>
                                    <div className="flex items-center gap-1 border border-gray-300 rounded">
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          updateQuantity(
                                            item.id,
                                            item.quantity - 1
                                          );
                                        }}
                                        className="px-2 py-1 text-gray-600 hover:bg-gray-100 transition-colors"
                                        aria-label="Decrease quantity"
                                      >
                                        <svg
                                          className="h-3 w-3"
                                          fill="none"
                                          viewBox="0 0 24 24"
                                          stroke="currentColor"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M20 12H4"
                                          />
                                        </svg>
                                      </button>
                                      <span className="px-2 py-1 text-sm font-medium text-gray-800 min-w-[2rem] text-center">
                                        {item.quantity}
                                      </span>
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          updateQuantity(
                                            item.id,
                                            item.quantity + 1
                                          );
                                        }}
                                        className="px-2 py-1 text-gray-600 hover:bg-gray-100 transition-colors"
                                        aria-label="Increase quantity"
                                      >
                                        <svg
                                          className="h-3 w-3"
                                          fill="none"
                                          viewBox="0 0 24 24"
                                          stroke="currentColor"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 4v16m8-8H4"
                                          />
                                        </svg>
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="p-4 border-t border-gray-200 bg-gray-50">
                          <div className="flex justify-between items-center mb-3">
                            <span className="font-semibold text-gray-800">
                              Total:
                            </span>
                            <span className="font-bold text-lg text-gray-800">
                              £{getTotalPrice().toFixed(2)}
                            </span>
                          </div>
                          <Link
                            href="/cart"
                            className="block w-full bg-blue-500 text-white text-center px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors font-semibold"
                          >
                            View Cart
                          </Link>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Account Icon with Dropdown */}
            {user ? (
              <div
                className="relative"
                onMouseEnter={() => setIsAccountHover(true)}
                onMouseLeave={() => setIsAccountHover(false)}
              >
                <button
                  type="button"
                  className="inline-flex items-center justify-center p-2 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </button>

                {/* Account Dropdown */}
                {isAccountHover && (
                  <div
                    className="absolute right-0 w-56 z-50"
                    onMouseEnter={() => setIsAccountHover(true)}
                    onMouseLeave={() => setIsAccountHover(false)}
                  >
                    {/* Invisible bridge to make hover easier */}
                    <div className="h-2"></div>
                    <div className="mt-2 bg-white rounded-lg shadow-xl border border-gray-200">
                      <div className="py-2">
                        <Link
                          href="/account"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <svg
                              className="h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                              />
                            </svg>
                            Dashboard
                          </div>
                        </Link>
                        <Link
                          href="/account/orders"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <svg
                              className="h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                              />
                            </svg>
                            Orders
                          </div>
                        </Link>
                        <Link
                          href="/account/recently-viewed"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <svg
                              className="h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            Recently Viewed
                          </div>
                        </Link>
                        <Link
                          href="/account/addresses"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <svg
                              className="h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                            </svg>
                            Addresses
                          </div>
                        </Link>
                        <Link
                          href="/account/payments"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <svg
                              className="h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                              />
                            </svg>
                            Payment Methods
                          </div>
                        </Link>
                        <div className="border-t border-gray-200 my-1"></div>
                        <button
                          type="button"
                          onClick={handleSignOut}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <svg
                              className="h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                              />
                            </svg>
                            Sign out
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="hover:text-gray-500 hover:underline"
                >
                  Login
                </Link>
                <Link
                  href="/auth/signup"
                  className="rounded-lg bg-blue-500 px-4 py-2 text-white font-semibold hover:bg-blue-600 transition"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 hover:bg-gray-200 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile nav */}
        <nav
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out bg-white border-t border-gray-200 ${
            isMenuOpen ? "max-h-[90vh] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="px-4 py-4 space-y-2">
            {/* Navigation Links */}
            <div className="space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block px-4 py-3 text-gray-800 hover:bg-gray-100 rounded-lg transition-colors font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Account Section */}
            {user ? (
              <div className="border-t border-gray-200 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileAccountOpen(!isMobileAccountOpen);
                    setIsMobileCartOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-4 py-3 text-gray-800 hover:bg-gray-100 rounded-lg transition-colors font-medium"
                >
                  <div className="flex items-center gap-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    <span>Account</span>
                  </div>
                  <svg
                    className={`h-5 w-5 transition-transform ${
                      isMobileAccountOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* Account Dropdown */}
                {isMobileAccountOpen && (
                  <div className="mt-2 bg-gray-50 rounded-lg overflow-hidden">
                    <Link
                      href="/account"
                      className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors border-b border-gray-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <div className="flex items-center gap-3">
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                          />
                        </svg>
                        Dashboard
                      </div>
                    </Link>
                    <Link
                      href="/account/orders"
                      className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors border-b border-gray-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <div className="flex items-center gap-3">
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                          />
                        </svg>
                        Orders
                      </div>
                    </Link>
                    <Link
                      href="/account/recently-viewed"
                      className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors border-b border-gray-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <div className="flex items-center gap-3">
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        Recently Viewed
                      </div>
                    </Link>
                    <Link
                      href="/account/addresses"
                      className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors border-b border-gray-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <div className="flex items-center gap-3">
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        Addresses
                      </div>
                    </Link>
                    <Link
                      href="/account/payments"
                      className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors border-b border-gray-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <div className="flex items-center gap-3">
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                          />
                        </svg>
                        Payment Methods
                      </div>
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        setIsMenuOpen(false);
                        handleSignOut();
                      }}
                      className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                          />
                        </svg>
                        Sign out
                      </div>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="border-t border-gray-200 pt-2 space-y-2">
                <Link
                  href="/auth/login"
                  className="block px-4 py-3 text-gray-800 hover:bg-gray-100 rounded-lg transition-colors font-medium text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/auth/signup"
                  className="block px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign up
                </Link>
              </div>
            )}
            {/* Cart Section */}
            <div className="border-t border-gray-200 pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsMobileCartOpen(!isMobileCartOpen);
                  setIsMobileAccountOpen(false);
                }}
                className="w-full flex items-center justify-between px-4 py-3 text-gray-800 hover:bg-gray-100 rounded-lg transition-colors font-medium"
              >
                <div className="flex items-center gap-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  <span>Cart</span>
                  {totalItems > 0 && (
                    <span className="bg-blue-500 text-white text-xs font-bold rounded-full min-w-[20px] h-5 px-1.5 flex items-center justify-center">
                      {totalItems > 99 ? "99+" : totalItems}
                    </span>
                  )}
                </div>
                <svg
                  className={`h-5 w-5 transition-transform ${
                    isMobileCartOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Cart Items Dropdown */}
              {isMobileCartOpen && (
                <div className="mt-2 bg-gray-50 rounded-lg overflow-hidden">
                  {items.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">
                      <p className="text-sm mb-2">Your cart is empty</p>
                      <Link
                        href="/product"
                        className="text-blue-500 hover:text-blue-600 text-sm font-medium"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Continue Shopping →
                      </Link>
                    </div>
                  ) : (
                    <>
                      <div className="max-h-64 overflow-y-auto">
                        {items.map((item) => (
                          <div
                            key={item.id}
                            className="p-3 flex gap-3 border-b border-gray-200 last:border-0"
                          >
                            <div className="relative w-14 h-14 flex-shrink-0 bg-gray-200 rounded">
                              {item.imageUrl && (
                                <Image
                                  src={item.imageUrl}
                                  alt={item.name}
                                  fill
                                  className="object-cover rounded"
                                />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-gray-800 truncate">
                                    {item.name}
                                  </p>
                                  <p className="text-sm font-semibold text-gray-800 mt-1">
                                    £{(item.price * item.quantity).toFixed(2)}
                                  </p>
                                </div>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeFromCart(item.id);
                                  }}
                                  className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
                                  aria-label="Remove item"
                                >
                                  <svg
                                    className="h-4 w-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M6 18L18 6M6 6l12 12"
                                    />
                                  </svg>
                                </button>
                              </div>
                              <div className="flex items-center gap-2 mt-2">
                                <span className="text-xs text-gray-500">
                                  Qty:
                                </span>
                                <div className="flex items-center gap-1 border border-gray-300 rounded">
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      updateQuantity(
                                        item.id,
                                        item.quantity - 1
                                      );
                                    }}
                                    className="px-2 py-1 text-gray-600 hover:bg-gray-100 transition-colors"
                                    aria-label="Decrease quantity"
                                  >
                                    <svg
                                      className="h-3 w-3"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M20 12H4"
                                      />
                                    </svg>
                                  </button>
                                  <span className="px-2 py-1 text-sm font-medium text-gray-800 min-w-[2rem] text-center">
                                    {item.quantity}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      updateQuantity(
                                        item.id,
                                        item.quantity + 1
                                      );
                                    }}
                                    disabled={
                                      item.stock !== null &&
                                      item.quantity >= item.stock
                                    }
                                    className={`px-2 py-1 transition-colors ${
                                      item.stock !== null &&
                                      item.quantity >= item.stock
                                        ? "text-gray-400 cursor-not-allowed"
                                        : "text-gray-600 hover:bg-gray-100"
                                    }`}
                                    aria-label="Increase quantity"
                                  >
                                    <svg
                                      className="h-3 w-3"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 4v16m8-8H4"
                                      />
                                    </svg>
                                  </button>
                                </div>
                                {item.stock !== null && (
                                  <span className="text-xs text-gray-500">
                                    / {item.stock}
                                  </span>
                                )}
                              </div>
                              {item.stock !== null &&
                                item.quantity >= item.stock && (
                                  <p className="text-xs text-red-600 mt-1">
                                    Max quantity reached
                                  </p>
                                )}
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="p-3 bg-white border-t border-gray-200">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-semibold text-gray-800">
                            Total:
                          </span>
                          <span className="font-bold text-lg text-gray-800">
                            £{getTotalPrice().toFixed(2)}
                          </span>
                        </div>
                        <Link
                          href="/cart"
                          className="block w-full bg-blue-500 text-white text-center px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors font-semibold text-sm"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          View Cart
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}

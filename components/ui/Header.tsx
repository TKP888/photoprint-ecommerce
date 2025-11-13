"use client";

import Link from "next/link";
import { useCart } from "@/components/cart/CartContext";
import { useState } from "react";
import { useAuth } from "@/components/auth/AuthContext";
import { useRouter } from "next/navigation";

export default function Header() {
  const { getTotalItems } = useCart();
  const { user, signOut } = useAuth();
  const totalItems = getTotalItems();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
        <div className="flex justify-between items-center">
          <Link href="/" className="hover:text-gray-500">
            <h1 className="text-2xl font-bold">PhotoPrint</h1>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:block">
            <ul className="flex gap-12 text-lg font-bold items-center">
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

              <li className="relative">
                <Link
                  href="/cart"
                  className="hover:text-gray-500 hover:underline relative inline-block"
                >
                  Cart
                  {totalItems > 0 && (
                    <span className="absolute -top-2 -right-6 bg-blue-500 text-white text-xs font-bold rounded-full min-w-[20px] h-5 px-1.5 flex items-center justify-center">
                      {totalItems > 99 ? "99+" : totalItems}
                    </span>
                  )}
                </Link>
              </li>

              {user ? (
                <>
                  <li>
                    <Link
                      href="/account"
                      className="hover:text-gray-500 hover:underline"
                    >
                      Account
                    </Link>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="hover:text-gray-500 hover:underline"
                    >
                      Sign out
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link
                      href="/auth/login"
                      className="hover:text-gray-500 hover:underline"
                    >
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/auth/signup"
                      className="rounded-lg bg-blue-500 px-4 py-2 text-white font-semibold hover:bg-blue-600 transition"
                    >
                      Sign up
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </nav>

          {/* Mobile hamburger */}
          {/* (unchanged) */}
        </div>

        {/* Mobile nav */}
        <nav
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <ul className="flex flex-col gap-4 py-4 text-lg font-bold items-center text-center">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="block hover:text-gray-500 hover:underline py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}

            <li className="relative">
              <Link
                href="/cart"
                className="block hover:text-gray-500 hover:underline py-2 relative inline-block"
                onClick={() => setIsMenuOpen(false)}
              >
                Cart
                {totalItems > 0 && (
                  <span className="absolute -top-1 left-full ml-2 bg-blue-500 text-white text-xs font-bold rounded-full min-w-[20px] h-5 px-1.5 flex items-center justify-center">
                    {totalItems > 99 ? "99+" : totalItems}
                  </span>
                )}
              </Link>
            </li>

            {user ? (
              <>
                <li>
                  <Link
                    href="/account"
                    className="block hover:text-gray-500 hover:underline py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Account
                  </Link>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      setIsMenuOpen(false);
                      handleSignOut();
                    }}
                    className="block hover:text-gray-500 hover:underline py-2"
                  >
                    Sign out
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    href="/auth/login"
                    className="block hover:text-gray-500 hover:underline py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                </li>
                <li>
                  <Link
                    href="/auth/signup"
                    className="block rounded-lg bg-blue-500 px-4 py-2 text-white font-semibold hover:bg-blue-600 transition"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign up
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}

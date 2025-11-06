"use client";

import Link from "next/link";
import { useCart } from "@/components/cart/CartContext";
import { useState } from "react";

export default function Header() {
  const { getTotalItems } = useCart();
  const totalItems = getTotalItems();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-gray-300 text-black shadow-sm">
      <div className="container mx-auto px-4 md:px-8 py-4 md:py-8">
        <div className="flex justify-between items-center">
          <Link href="/" className="hover:text-gray-500">
            <h1 className="text-2xl font-bold">PhotoPrint</h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:block">
            <ul className="flex gap-12 text-lg font-bold">
              <li>
                <Link
                  href="/about"
                  className="hover:text-gray-500 hover:underline"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/product"
                  className="hover:text-gray-500 hover:underline"
                >
                  Products
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className="hover:text-gray-500 hover:underline"
                >
                  Services
                </Link>
              </li>
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
            </ul>
          </nav>

          {/* Mobile Hamburger Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden flex flex-col gap-1.5 p-2"
            aria-label="Toggle menu"
          >
            <span
              className={`block h-0.5 w-6 bg-black transition-all duration-300 ${
                isMenuOpen ? "rotate-45 translate-y-2" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-6 bg-black transition-all duration-300 ${
                isMenuOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-6 bg-black transition-all duration-300 ${
                isMenuOpen ? "-rotate-45 -translate-y-2" : ""
              }`}
            />
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        <nav
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <ul className="flex flex-col gap-4 py-4 text-lg font-bold items-center text-center">
            <li>
              <Link
                href="/about"
                className="block hover:text-gray-500 hover:underline py-2"
                onClick={closeMenu}
              >
                About
              </Link>
            </li>
            <li>
              <Link
                href="/product"
                className="block hover:text-gray-500 hover:underline py-2"
                onClick={closeMenu}
              >
                Products
              </Link>
            </li>
            <li>
              <Link
                href="/services"
                className="block hover:text-gray-500 hover:underline py-2"
                onClick={closeMenu}
              >
                Services
              </Link>
            </li>
            <li className="relative">
              <Link
                href="/cart"
                className="block hover:text-gray-500 hover:underline py-2 relative inline-block"
                onClick={closeMenu}
              >
                Cart
                {totalItems > 0 && (
                  <span className="absolute -top-1 left-full ml-2 bg-blue-500 text-white text-xs font-bold rounded-full min-w-[20px] h-5 px-1.5 flex items-center justify-center">
                    {totalItems > 99 ? "99+" : totalItems}
                  </span>
                )}
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { useRequireAuth } from "@/components/auth/useRequireAuth";

const navItems = [
  { label: "Dashboard", href: "/account" },
  { label: "Orders", href: "/account/orders" },
  { label: "Recently Viewed", href: "/account/recently-viewed" },
  { label: "Addresses", href: "/account/addresses" },
  { label: "Payment Methods", href: "/account/payments" },
];

export default function AccountLayout({ children }: { children: ReactNode }) {
  const { loading } = useRequireAuth();
  const pathname = usePathname();

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-800 flex items-center justify-center">
        <p className="text-white text-lg">Loading account…</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-64 bg-gray-800 rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-6">Account</h2>
            <nav>
              <ul className="space-y-3">
                {navItems.map((item) => {
                  const isActive =
                    item.href === "/account"
                      ? pathname === "/account"
                      : pathname.startsWith(item.href);

                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={`block rounded-lg px-4 py-2 transition ${
                          isActive
                            ? "bg-blue-500 text-white"
                            : "text-gray-300 hover:bg-gray-700 hover:text-white"
                        }`}
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </aside>

          <section className="flex-1 bg-gray-800 rounded-xl p-6 shadow-lg">
            {children}
          </section>
        </div>
      </div>
    </main>
  );
}

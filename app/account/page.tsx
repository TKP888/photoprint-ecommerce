// app/account/page.tsx
"use client";

import Link from "next/link";

export default function AccountDashboardPage() {
  return (
    <div className="space-y-6">
      <header className="border-b border-gray-700 pb-4">
        <h1 className="text-3xl font-bold text-white">Welcome back</h1>
        <p className="text-gray-400">
          View your recent orders, saved addresses, and payment details.
        </p>
      </header>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <section className="bg-gray-900 rounded-lg p-5 border border-gray-700">
          <h2 className="text-xl font-semibold text-white mb-3">
            Recent Orders
          </h2>
          <p className="text-gray-400 mb-4">
            Check the status of your latest purchases.
          </p>
          <Link
            href="/account/orders"
            className="inline-flex items-center text-blue-400 hover:text-blue-200"
          >
            View all orders →
          </Link>
        </section>

        <section className="bg-gray-900 rounded-lg p-5 border border-gray-700">
          <h2 className="text-xl font-semibold text-white mb-3">
            Saved Addresses
          </h2>
          <p className="text-gray-400 mb-4">
            Manage your shipping and billing addresses for faster checkout.
          </p>
          <Link
            href="/account/addresses"
            className="inline-flex items-center text-blue-400 hover:text-blue-200"
          >
            Manage addresses →
          </Link>
        </section>

        <section className="bg-gray-900 rounded-lg p-5 border border-gray-700">
          <h2 className="text-xl font-semibold text-white mb-3">
            Payment Methods
          </h2>
          <p className="text-gray-400 mb-4">
            Save cards securely for quick future purchases.
          </p>
          <Link
            href="/account/payments"
            className="inline-flex items-center text-blue-400 hover:text-blue-200"
          >
            Manage payment methods →
          </Link>
        </section>

        <section className="bg-gray-900 rounded-lg p-5 border border-gray-700">
          <h2 className="text-xl font-semibold text-white mb-3">
            Recently Viewed
          </h2>
          <p className="text-gray-400 mb-4">
            Jump back to items you were browsing.
          </p>
          <Link
            href="/account/recent"
            className="inline-flex items-center text-blue-400 hover:text-blue-200"
          >
            View recently viewed →
          </Link>
        </section>
      </div>
    </div>
  );
}

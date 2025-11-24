import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-10">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h2 className="text-2xl font-extrabold">PhotoPrint</h2>
          <p className="mt-2 text-gray-400">Prints That Inspire.</p>
        </div>

        <div>
          <h3 className="font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li>
              <Link href="/" className="hover:text-blue-400">
                Home
              </Link>
            </li>
            <li>
              <a href="/about" className="hover:text-blue-400">
                About
              </a>
            </li>
            <li>
              <a href="/product" className="hover:text-blue-400">
                Products
              </a>
            </li>
            <li>
              <a href="/services" className="hover:text-blue-400">
                Services
              </a>
            </li>
            <li>
              <a href="/contact" className="hover:text-blue-400">
                Contact Us
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-4">Contact</h3>
          <p className="text-gray-400">antony@photoprint.co.uk</p>
          <p className="text-gray-400">+44 7500 000 000</p>
          <div className="flex space-x-4 mt-2">
            <a href="#" className="hover:text-blue-400">
              Twitter
            </a>
            <a href="#" className="hover:text-blue-400">
              LinkedIn
            </a>
            <a href="#" className="hover:text-blue-400">
              Instagram
            </a>
          </div>
        </div>
      </div>
      <div className="mt-10 border-t border-gray-700 pt-6 text-center text-gray-500 text-sm">
        &copy; 2025 PhotoPrint. All rights reserved.
      </div>
    </footer>
  );
}

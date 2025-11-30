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
              <Link href="/about" className="hover:text-blue-400">
                About
              </Link>
            </li>
            <li>
              <Link href="/product" className="hover:text-blue-400">
                Products
              </Link>
            </li>
            <li>
              <Link href="/services" className="hover:text-blue-400">
                Services
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-blue-400">
                Contact Us
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-4">Contact</h3>
          <p className="text-gray-400">antonypetsas@gmail.com</p>

          <div className="flex space-x-4 mt-2">
            <a
              href="https://www.linkedin.com/in/akpetsas/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-400"
            >
              LinkedIn
            </a>
            <a
              href="https://github.com/TKP888"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-400"
            >
              GitHub
            </a>
            <a
              href="https://antonypetsas.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-400"
            >
              Website
            </a>
          </div>
        </div>
      </div>
      <div className="mt-10 border-t border-gray-700 pt-6 text-center text-gray-500 text-sm">
        &copy; Antony Petsas 2025, All Rights Reserved
      </div>
    </footer>
  );
}

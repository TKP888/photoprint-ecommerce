import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-gray-300 text-black shadow-sm">
      <div className="container mx-auto px-8 py-8 flex justify-between items-center">
        <Link href="/" className="hover:text-gray-500 ">
          {" "}
          <h1 className="text-2xl font-bold">Printshop</h1>
        </Link>{" "}
        <nav>
          <ul className="flex gap-12 text-lg font-bold">
            <li>
              <a href="/about" className="hover:text-gray-500 hover:underline">
                About
              </a>
            </li>
            <li>
              <a
                href="/products"
                className="hover:text-gray-500 hover:underline"
              >
                Products
              </a>
            </li>
            <li>
              <a
                href="/services"
                className="hover:text-gray-500 hover:underline"
              >
                Services
              </a>
            </li>
            <li>
              <a href="/cart" className="hover:text-gray-500 hover:underline">
                Cart
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

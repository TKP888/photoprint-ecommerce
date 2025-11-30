import Link from "next/link";

export default function ServicesPage() {
  return (
    <main>
      <section className="relative h-96 md:h-[500px] flex items-center justify-center">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url("/images/hero/Services-Hero.jpg")' }}
        >
          <div className="absolute inset-0 bg-black opacity-70"></div>
        </div>

        <div className="relative z-10 text-center text-white px-4 ">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Our Services</h1>
          <p className="text-xl md:text-2xl">
            We offer a wide range of services to help you in your photography
            journey.
          </p>
        </div>
      </section>

      <section className="py-16 bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl text-white font-bold mb-6 text-center">
              High-Quality Photo Prints
            </h2>
            <p className="text-lg text-white text-center">
              Bring your memories to life with stunning photo prints using
              premium photo paper and professional-grade inks. Choose from a
              variety of sizes, finishes (matte, glossy, or lustre), and borders
              to perfectly match your vision.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-700">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl text-white font-bold mb-6">
              Bespoke Requests
            </h2>
            <p className="text-lg text-white mb-6">
              Have a specific request or need something custom? We&apos;re here
              to help with bespoke printing solutions tailored to your needs.
            </p>
            <Link
              href="/contact"
              className="inline-block bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600 transition-colors font-semibold text-lg"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

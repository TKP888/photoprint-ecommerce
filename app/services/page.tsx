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

        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Our Services</h1>
          <p className="text-xl md:text-2xl">
            We offer a wide range of services to help you in your photography
            journey.
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl text-gray-800 font-bold mb-6 text-center">
              High-Quality Photo Prints
            </h2>
            <p className="text-lg text-gray-700 mb-6">
              Bring your memories to life with stunning photo prints that
              capture every detail and color. We use premium photo paper and
              professional-grade inks to ensure your pictures stay vibrant for
              years to come.
            </p>
            <p className="text-lg text-gray-700 mb-6">
              Choose from a variety of sizes, finishes (matte, glossy, or
              lustre), and borders to perfectly match your vision.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl text-gray-800 font-bold mb-6 text-center">
              Canvas & Wall Art Printing
            </h2>
            <p className="text-lg text-gray-700 mb-6">
              Transform your favorite shots into timeless wall art. Our canvas
              prints are stretched on durable wooden frames and printed with
              fade-resistant ink for gallery-quality results.
            </p>
            <p className="text-lg text-gray-700">
              Whether it’s a family portrait, travel memory, or artistic shot,
              we make it easy to decorate your space with meaningful images.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl text-gray-800 font-bold mb-6 text-center">
              Photo Books & Albums
            </h2>
            <p className="text-lg text-gray-700 text-center">
              Tell your story beautifully with custom-designed photo books and
              albums. Ideal for weddings, vacations, or milestone events, our
              photo books feature high-resolution printing, sturdy binding, and
              elegant cover options.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl text-gray-800 font-bold mb-6 text-center">
              Personalised Gifts & Accessories
            </h2>
            <p className="text-lg text-gray-700 mb-6">
              Turn your photos into unique, heartfelt gifts. From mugs and
              calendars to phone cases and puzzles, we offer a wide range of
              customizable products that make every occasion memorable. Upload
              your favorite pictures and let us craft something that’s both
              personal and high-quality.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

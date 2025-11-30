export default function AboutPage() {
  return (
    <main>
      <section className="relative h-96 md:h-[500px] flex items-center justify-center">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url("/images/hero/About-Hero.jpg")' }}
        >
          <div className="absolute inset-0 bg-black opacity-70"></div>
        </div>

        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            About PhotoPrint
          </h1>
          <p className="text-xl md:text-2xl">
            Capture moments, create memories
          </p>
        </div>
      </section>

      <section className="py-16 bg-gray-700">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl text-white font-bold mb-6 text-center">
              Who We Are{" "}
            </h2>
            <p className="text-lg text-white mb-6">
              PhotoPrint is dedicated to bringing beautiful photographic art
              into your home. We believe that great photography deserves to be
              displayed and appreciated, not just viewed on a screen.
            </p>
            <p className="text-lg text-white mb-6">
              Our collection features stunning prints from talented
              photographers around the world, printed on premium materials that
              ensure your art remains vibrant and beautiful for years to come.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl text-white font-bold mb-6 text-center">
              Why We Started
            </h2>
            <p className="text-lg text-white mb-6">
              After years of admiring beautiful photography online, we realized
              that these stunning images deserved to be more than just pixels on
              a screen. We founded PhotoPrint to bridge the gap between digital
              photography and physical art.
            </p>
            <p className="text-lg text-white mb-6">
              Every print in our collection is carefully curated to ensure it
              meets our high standards for composition, color, and emotional
              impact. We partner with photographers to bring you prints that
              will transform your space into a gallery of memories and
              inspiration.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-700">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl text-white font-bold mb-6 text-center">
              Our Mission
            </h2>
            <p className="text-lg text-white mb-6">
              To make beautiful, high-quality photographic prints accessible to
              everyone, while supporting talented photographers and helping you
              create spaces that inspire.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

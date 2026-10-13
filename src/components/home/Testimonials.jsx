// Client testimonials: short, believable, authentic reviews.
const REVIEWS = [
  {
    quote: "The chauffeur arrived early and the entire airport transfer was seamless.",
    name: "Ade",
    context: "Executive Transfer",
  },
  {
    quote:
      "Immaculate vehicle condition and prompt communication. The most reliable pickup I\u2019ve had in Lagos.",
    name: "Ibrahim",
    context: "Airport Corridor",
  },
  {
    quote:
      "Punctual, discreet, and reliable. Exactly what you need when hosting partners in Victoria Island.",
    name: "Tari",
    context: "Chauffeur Service",
  },
];

export const Testimonials = () => {
  return (
    <section id="reviews" className="py-28 sm:py-36 bg-[#05070c] scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="max-w-2xl mb-16">
          <span className="font-mono text-xs tracking-[0.25em] text-amber-500 uppercase block mb-3">
            CLIENT NOTES
          </span>
          <h2 className="font-['Playfair_Display',serif] text-3xl sm:text-4xl lg:text-5xl font-normal text-white tracking-tight leading-[1.12]">
            Recommended by clients.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {REVIEWS.map((review) => (
            <div
              key={review.name}
              className="border-t border-white/[0.1] pt-6 flex flex-col justify-between"
            >
              <p className="font-['Instrument_Serif',serif] italic text-xl text-[#f1f5f9] leading-relaxed mb-6">
                &ldquo;{review.quote}&rdquo;
              </p>
              <div className="text-sm font-medium text-slate-300">
                &mdash; {review.name},{" "}
                <span className="text-slate-400 font-normal">
                  {review.context}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;

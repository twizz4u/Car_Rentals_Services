import { useState, useEffect, useMemo } from "react";
import { Header } from "../component/Header";
import { Hero } from "../component/Hero";
import { CarDetail } from "../component/CarDetails";
import { Highligth } from "../component/Highligth";
import { BudgetFriendly } from "../component/BudgetFrienldly";
import { Footer } from "../component/Footer";
import { Cart } from "../component/Cart";
import { PaymentPage } from "./Payment";
import { data as localCarsData } from "../assets/data";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";

export const Home = () => {
  const [showPayment, setShowPayment] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const itemsPerPage = 6;

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/cars");
        if (!response.ok) {
          throw new Error("Failed to fetch from API");
        }
        const result = await response.json();
        if (
          result.data &&
          Array.isArray(result.data) &&
          result.data.length > 0
        ) {
          setCars(result.data);
        } else {
          setCars(localCarsData);
        }
      } catch (error) {
        console.warn(
          "API unreachable, falling back to verified fleet data:",
          error,
        );
        setCars(localCarsData);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  const handlePaymentToggle = (value) => {
    setShowPayment(value);
  };

  // Filter logic
  const filteredCars = useMemo(() => {
    return cars.filter((car) => {
      const name = (car.name || "").toLowerCase();
      const model = (car.model || "").toLowerCase();
      const category = (car.category || "").toLowerCase();
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        name.includes(query) ||
        model.includes(query) ||
        category.includes(query);
      let matchesCategory = true;
      if (activeCategory !== "all") {
        if (activeCategory === "Executive") {
          matchesCategory =
            category.includes("executive") ||
            category.includes("sedan") ||
            model.includes("7") ||
            model.includes("s-class") ||
            name.includes("cadillac") ||
            name.includes("volvo");
        } else if (activeCategory === "SUV") {
          matchesCategory =
            category.includes("suv") ||
            category.includes("crossover") ||
            name.includes("range rover") ||
            name.includes("lexus") ||
            name.includes("g 63");
        } else if (activeCategory === "Sport") {
          matchesCategory =
            category.includes("sport") ||
            category.includes("gt") ||
            category.includes("electric") ||
            name.includes("porsche") ||
            name.includes("tesla");
        } else if (activeCategory === "Luxury") {
          matchesCategory =
            category.includes("luxury") ||
            name.includes("range rover") ||
            name.includes("lexus");
        } else if (activeCategory === "4x4") {
          matchesCategory =
            category.includes("suv") ||
            category.includes("truck") ||
            name.includes("range rover") ||
            name.includes("g-class");
        }
      }

      return matchesSearch && matchesCategory;
    });
  }, [cars, activeCategory, searchQuery]);

  const totalPages = Math.ceil(filteredCars.length / itemsPerPage) || 1;
  const currentItems = filteredCars.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );
  const scrollToFleet = () => {
    const fleetSection = document.getElementById("fleet");
    if (fleetSection) {
      const headerOffset = 90;
      const elementPosition = fleetSection.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((page) => page + 1);
      scrollToFleet();
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((page) => page - 1);
      scrollToFleet();
    }
  };

  const goToPage = (pageNumber) => {
    if (pageNumber !== currentPage) {
      setCurrentPage(pageNumber);
      scrollToFleet();
    }
  };

  const categories = [
    { id: "all", label: "All vehicles" },
    { id: "Executive", label: "Executive" },
    { id: "SUV", label: "SUV" },
    { id: "Luxury", label: "Luxury" },
    { id: "Sport", label: "Sport" },
    { id: "4x4", label: "4×4" },
  ];

  return (
    <div className="min-h-screen bg-[#000000] text-[#e4e4e7] font-['Plus_Jakarta_Sans',sans-serif] selection:bg-amber-400/30 selection:text-amber-200">
      <Header />
      <Cart />

      {showPayment ? (
        <PaymentPage />
      ) : (
        <main>
          {/* Cinematic Hero */}
          <Hero />

          {/* Section: The Fleet Showroom (Base #000000) */}
          <section
            id="fleet"
            className="pt-20 sm:pt-24 pb-28 sm:pb-36 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto"
          >
            {/* Editorial Section Header */}
            <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div className="text-[11px] font-medium tracking-[0.22em] text-amber-500 uppercase mb-5">
                  The fleet
                </div>
                <h2 className="font-['Playfair_Display',serif] text-4xl sm:text-5xl lg:text-6xl font-normal text-[#f5f3ee] tracking-[-0.03em] leading-[1.02]">
                  Find your next ride.
                </h2>
                <p className="mt-6 text-base text-slate-300 max-w-lg font-light leading-7">
                  Browse our collection of premium vehicles available for your
                  journey.
                </p>
              </div>
              <label className="relative block w-full lg:w-72">
                <span className="sr-only">Search the fleet</span>
                <Search className="pointer-events-none absolute left-0 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(event) => {
                    setSearchQuery(event.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Search vehicles"
                  className="w-full border-b border-white/[0.16] bg-transparent py-3 pl-7 text-sm text-white placeholder:text-slate-500 focus:border-amber-500 focus:outline-none"
                />
              </label>
            </div>

            {/* Category Filter Tabs */}
            <div className="flex items-center gap-4 overflow-x-auto py-10 no-scrollbar">
              <div className="flex items-center gap-5 sm:gap-7">
                {categories.map((cat) => {
                  const isActive = activeCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setActiveCategory(cat.id);
                        setCurrentPage(1);
                      }}
                      className={`py-1 text-sm transition-colors whitespace-nowrap cursor-pointer ${
                        isActive
                          ? "text-amber-500 font-medium"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      {cat.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Vehicle Grid */}
            {loading ? (
              <div className="py-32 text-center text-sm text-slate-400">
                Loading fleet…
              </div>
            ) : filteredCars.length === 0 ? (
              <div className="py-24 text-center my-10">
                <h3 className="font-['Plus_Jakarta_Sans',sans-serif] text-base font-semibold text-white">
                  No matching vehicles found
                </h3>
                <p className="text-sm text-slate-400 mt-1 max-w-sm mx-auto">
                  Try another keyword or view the full showroom catalog.
                </p>
                <button
                  onClick={() => {
                    setActiveCategory("all");
                    setSearchQuery("");
                    setCurrentPage(1);
                  }}
                  className="mt-5 text-amber-500 hover:text-amber-400 text-sm font-medium transition-colors cursor-pointer"
                >
                  View All Vehicles
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-7 lg:grid-cols-3 lg:gap-8">
                {currentItems.map((car, id) => (
                  <CarDetail
                    key={id}
                    cardata={car}
                    changeui={handlePaymentToggle}
                  />
                ))}
              </div>
            )}

            {totalPages > 1 && (
              <div className="mt-16 flex items-center justify-between border-t border-white/[0.08] pt-6">
                <button
                  type="button"
                  onClick={prevPage}
                  disabled={currentPage === 1}
                  className="inline-flex items-center gap-2 text-sm font-medium text-slate-300 transition-colors hover:text-white disabled:cursor-not-allowed disabled:opacity-30 cursor-pointer"
                >
                  <ChevronLeft className="h-4 w-4" /> Previous
                </button>

                <div className="flex items-center gap-1.5 sm:gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (pageNumber) => (
                      <button
                        key={pageNumber}
                        type="button"
                        onClick={() => goToPage(pageNumber)}
                        className={`inline-flex items-center justify-center text-center p-0 leading-none h-7 w-7 sm:h-8 sm:w-8 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                          currentPage === pageNumber
                            ? "bg-amber-500 text-black font-semibold"
                            : "text-slate-400 hover:text-white hover:bg-white/[0.06]"
                        }`}
                      >
                        {pageNumber}
                      </button>
                    ),
                  )}
                </div>

                <button
                  type="button"
                  onClick={nextPage}
                  disabled={currentPage === totalPages}
                  className="inline-flex items-center gap-2 text-sm font-medium text-slate-300 transition-colors hover:text-white disabled:cursor-not-allowed disabled:opacity-30 cursor-pointer"
                >
                  Next <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </section>

          {/* Section: Monthly Highlights */}
          <Highligth />

          {/* Section: Accessible Fleet */}
          <BudgetFriendly />

          {/* Section: Service Standards (Point 8 — Simplified 4 Pillars with Whitespace) */}
          <section id="standards" className="py-28 sm:py-36 bg-[#000000]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
              <div className="lg:col-span-5">
                <span className="text-[11px] font-medium tracking-[0.22em] text-amber-500 uppercase block mb-5">
                  Service
                </span>
                <h2 className="font-['Playfair_Display',serif] text-5xl sm:text-6xl lg:text-7xl font-normal text-white tracking-[-0.04em] leading-[0.95]">
                  The standard of service you deserve.
                </h2>
              </div>
              <div className="lg:col-span-7 space-y-0">
                <div className="grid grid-cols-[2rem_1fr] gap-5 border-t border-white/[0.12] py-6">
                  <span className="text-sm text-amber-500">01</span>
                  <div>
                    <h3 className="font-['Plus_Jakarta_Sans',sans-serif] text-base font-semibold text-white">
                      Vehicle Ready
                    </h3>
                    <p className="text-sm text-slate-400 leading-relaxed font-light mt-2.5">
                      Every vehicle is cleaned and prepared before pickup.
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-[2rem_1fr] gap-5 border-t border-white/[0.12] py-6">
                  <span className="text-sm text-amber-500">02</span>
                  <div>
                    <h3 className="font-['Plus_Jakarta_Sans',sans-serif] text-base font-semibold text-white">
                      Professional Chauffeurs
                    </h3>
                    <p className="text-sm text-slate-400 leading-relaxed font-light mt-2.5">
                      Choose the vehicle and rental option that fits your
                      journey.
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-[2rem_1fr] gap-5 border-t border-white/[0.12] py-6">
                  <span className="text-sm text-amber-500">03</span>
                  <div>
                    <h3 className="font-['Plus_Jakarta_Sans',sans-serif] text-base font-semibold text-white">
                      Reliable Booking
                    </h3>
                    <p className="text-sm text-slate-400 leading-relaxed font-light mt-2.5">
                      Clear pricing and straightforward reservation.
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-[2rem_1fr] gap-5 border-y border-white/[0.12] py-6">
                  <span className="text-sm text-amber-500">04</span>
                  <div>
                    <h3 className="font-['Plus_Jakarta_Sans',sans-serif] text-base font-semibold text-white">
                      Personal Concierge
                    </h3>
                    <p className="text-sm text-slate-400 leading-relaxed font-light mt-2.5">
                      Support when you need help choosing or booking a vehicle.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section: Service Coverage / Locations (Point 5 & 9 — Clean, Real Service Coverage) */}
          <section id="locations" className="py-28 sm:py-36 bg-[#05070c]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
              <div className="max-w-4xl mb-20">
                <h2 className="font-['Playfair_Display',serif] text-5xl sm:text-6xl lg:text-7xl font-normal text-white tracking-[-0.04em] leading-[0.95]">
                  Stationed where
                  <br />
                  you need us.
                </h2>
                <p className="text-base sm:text-lg text-slate-300 mt-8 max-w-2xl font-light leading-8">
                  From airport transfers to business districts and private
                  residences, TASIN MOBILITY is positioned around the journeys
                  that matter most.
                </p>
              </div>

              {/* Service Coverage Columns — Airy & Open, Not UI Dashboard Cards */}
              <div className="border-y border-white/[0.1]">
                <div className="grid grid-cols-1 gap-2 py-7 md:grid-cols-[minmax(12rem,1fr)_2fr] md:items-baseline">
                  <span className="hidden">Airport Meet & Greet</span>
                  <h3 className="font-['Plus_Jakarta_Sans',sans-serif] text-lg font-semibold text-white">
                    Lagos Airport Corridor
                  </h3>
                  <p className="hidden">Ikeja · Victoria Island · Lekki</p>
                  <p className="text-sm text-slate-400 font-light leading-relaxed">
                    Flight-aware pickup and direct transfers from MMIA.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-2 border-t border-white/[0.1] py-7 md:grid-cols-[minmax(12rem,1fr)_2fr] md:items-baseline">
                  <span className="hidden">Corporate & Diplomatic</span>
                  <h3 className="font-['Plus_Jakarta_Sans',sans-serif] text-lg font-semibold text-white">
                    Business & Diplomatic Districts
                  </h3>
                  <p className="hidden">
                    Ikoyi · Victoria Island · Central Lagos
                  </p>
                  <p className="text-sm text-slate-400 font-light leading-relaxed">
                    Chauffeur dispatch for meetings, appointments and evenings
                    out.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-2 border-t border-white/[0.1] py-7 md:grid-cols-[minmax(12rem,1fr)_2fr] md:items-baseline">
                  <span className="hidden">Bespoke Itineraries</span>
                  <h3 className="font-['Plus_Jakarta_Sans',sans-serif] text-lg font-semibold text-white">
                    Extended & Private Charters
                  </h3>
                  <p className="hidden">Greater Lagos & Regional Travel</p>
                  <p className="text-sm text-slate-400 font-light leading-relaxed">
                    Full-day and multi-day journeys, planned around your
                    itinerary.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section: About (Quiet, editorial brand presence) */}
          <section id="about" className="py-28 sm:py-36 bg-[#000000]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
                <div className="lg:col-span-5">
                  <span className="font-mono text-xs tracking-[0.25em] text-amber-500 uppercase block mb-3">
                    ABOUT TASIN MOBILITY
                  </span>
                  <h2 className="font-['Playfair_Display',serif] text-3xl sm:text-4xl lg:text-5xl font-normal text-white tracking-tight leading-[1.12]">
                    Mobility, handled properly.
                  </h2>
                </div>

                <div className="lg:col-span-7 space-y-5 text-sm sm:text-base text-slate-300 font-light leading-relaxed">
                  <p>
                    TASIN MOBILITY provides private chauffeur services and
                    executive vehicle hire for corporate executives, diplomatic
                    visits, and discerning travelers across Lagos.
                  </p>
                  <p className="text-slate-400">
                    Punctuality, vehicle preparation and discretion guide every
                    journey.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section: Testimonials (Point 11 — Short, Believable, Authentic) */}
          <section id="reviews" className="py-28 sm:py-36 bg-[#05070c]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
              <div className="max-w-2xl mb-16">
                <span className="font-mono text-xs tracking-[0.25em] text-amber-500 uppercase block mb-3">
                  CLIENT NOTES
                </span>
                <h2 className="font-['Playfair_Display',serif] text-3xl sm:text-4xl lg:text-5xl font-normal text-white tracking-tight leading-[1.12]">
                  Recommended by clients.
                </h2>
              </div>

              {/* Three Short, Concise, Believable Reviews */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                <div className="border-t border-white/[0.1] pt-6 flex flex-col justify-between">
                  <p className="font-['Instrument_Serif',serif] italic text-xl text-[#f1f5f9] leading-relaxed mb-6">
                    “The chauffeur arrived early and the entire airport transfer
                    was seamless.”
                  </p>
                  <div className="text-sm font-medium text-slate-300">
                    — Ade,{" "}
                    <span className="text-slate-400 font-normal">
                      Executive Transfer
                    </span>
                  </div>
                </div>

                <div className="border-t border-white/[0.1] pt-6 flex flex-col justify-between">
                  <p className="font-['Instrument_Serif',serif] italic text-xl text-[#f1f5f9] leading-relaxed mb-6">
                    “Immaculate vehicle condition and prompt communication. The
                    most reliable pickup I’ve had in Lagos.”
                  </p>
                  <div className="text-sm font-medium text-slate-300">
                    — Ibrahim,{" "}
                    <span className="text-slate-400 font-normal">
                      Airport Corridor
                    </span>
                  </div>
                </div>

                <div className="border-t border-white/[0.1] pt-6 flex flex-col justify-between">
                  <p className="font-['Instrument_Serif',serif] italic text-xl text-[#f1f5f9] leading-relaxed mb-6">
                    “Punctual, discreet, and reliable. Exactly what you need
                    when hosting partners in Victoria Island.”
                  </p>
                  <div className="text-sm font-medium text-slate-300">
                    — Tari,{" "}
                    <span className="text-slate-400 font-normal">
                      Chauffeur Service
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Footer */}
          <Footer />
        </main>
      )}
    </div>
  );
};

export default Home;

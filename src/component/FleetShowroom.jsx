import { useState, useEffect, useMemo } from "react";
import { CarDetail } from "./CarDetails";
import { data as localCarsData } from "../assets/data";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";

// The fleet showroom section: fetches the catalogue, then handles category
// filtering, keyword search and pagination. Owns all of its own data state so
// the Home page only has to compose sections together.
export const FleetShowroom = ({ onPaymentToggle }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter states
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

  // Reposition to the fleet top synchronously BEFORE the grid re-renders.
  // An instant jump avoids painting the shorter next page at the old scroll
  // position (which flashes the section below) and avoids animating through
  // content. The fleet header sits above the grid, so its position is stable.
  const snapToFleetTop = () => {
    const fleetSection = document.getElementById("fleet");
    if (fleetSection) {
      fleetSection.scrollIntoView({ behavior: "auto", block: "start" });
    }
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      snapToFleetTop();
      setCurrentPage((page) => page + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      snapToFleetTop();
      setCurrentPage((page) => page - 1);
    }
  };

  const goToPage = (pageNumber) => {
    if (pageNumber !== currentPage) {
      snapToFleetTop();
      setCurrentPage(pageNumber);
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
    <section
      id="fleet"
      className="pt-20 sm:pt-24 pb-28 sm:pb-36 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto scroll-mt-24"
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
                  snapToFleetTop();
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
              changeui={onPaymentToggle}
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
  );
};

export default FleetShowroom;

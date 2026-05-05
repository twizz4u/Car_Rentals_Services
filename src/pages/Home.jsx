import { FilterBar } from "../component/searchFilter";
import { Header } from "../component/Header";
import { Hero } from "../component/Hero";
import { SectionCover } from "../component/sectionCover";
import { CarDetail } from "../component/carDetails";
import { Offer } from "../component/offer";
import { Highligth } from "../component/Highligth";
import { About } from "../component/About";
import { BudgetFriendly } from "../component/budgetFrienldly";
import { Footer } from "../component/Footer";
import { data } from "../assets/data";
import { TopRated } from "../assets/data";
import { PaymentPage } from "./Payment";
import { CustomerReviews } from "../component/CustomerReviews";
import { useState, useEffect } from "react";
import { Cart } from "../component/Cart";

const pageStyle = {
  minHeight: "100vh",
  backgroundColor: "#f1f5f9", // slate-100 base
  backgroundImage:
    "radial-gradient(circle at 15% 50%, rgba(14, 165, 233, 0.04), transparent 40%), radial-gradient(circle at 85% 30%, rgba(99, 102, 241, 0.03), transparent 40%), linear-gradient(180deg, rgba(248, 250, 252, 1) 0%, rgba(241, 245, 249, 1) 100%)",
  backgroundRepeat: "no-repeat",
  backgroundAttachment: "fixed",
  backgroundSize: "cover",
  color: "#1e293b", // slate-800 text
};

const Home = () => {
  const [showPayment, setShowPayment] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 8;

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/cars");
        if (!response.ok) {
          throw new Error("Failed to fetch from API");
        }
        const result = await response.json();
        setCars(result.data);
      } catch (error) {
        console.warn("API unreachable, falling back to local data:", error);
        setCars(data); // Fallback to local data
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  const handlePaymentToggle = (value) => {
    setShowPayment(value);
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = cars.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(cars.length / itemsPerPage);

  const nextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  return (
    <div style={pageStyle}>
      <Header />
      <Cart />
      {showPayment && <PaymentPage />}
      {!showPayment && (
        <div>
          <Hero />
          <SectionCover
            {...{
              display:
                "grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 place-items-center",
              gap: "gap-2 p-2 md:gap-6 md:p-6",
              justify: "justify-center",
            }}
          >
            {currentItems.map((car, id) => (
              <CarDetail
                key={id}
                cardata={car}
                changeui={handlePaymentToggle}
              />
            ))}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="col-span-1 sm:col-span-2 lg:col-span-4 w-full flex justify-center items-center gap-4 mt-8">
                <button
                  onClick={prevPage}
                  disabled={currentPage === 1}
                  className="p-2 rounded-full bg-white/10 text-slate-800 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/20 transition-all backdrop-blur-sm border border-slate-200 shadow-sm"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m15 18-6-6 6-6" />
                  </svg>
                </button>

                <span className="text-sm font-semibold text-slate-700 bg-white/50 px-4 py-1 rounded-full backdrop-blur-sm">
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  onClick={nextPage}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-full bg-white/10 text-slate-800 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/20 transition-all backdrop-blur-sm border border-slate-200 shadow-sm"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </button>
              </div>
            )}
          </SectionCover>
          <Highligth />
          <Offer />
          <BudgetFriendly />
          <About />
          <CustomerReviews />
          <Footer />
        </div>
      )}
    </div>
  );
};

export default Home;

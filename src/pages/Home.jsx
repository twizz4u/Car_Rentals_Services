import { useState } from "react";
import { Header } from "../components/shared/Header";
import { Hero } from "../components/home/Hero";
import { FleetShowroom } from "../components/home/FleetShowroom";
import { Highligth } from "../components/home/Highligth";
import { BudgetFriendly } from "../components/home/BudgetFrienldly";
import { ServiceStandards } from "../components/home/ServiceStandards";
import { ServiceLocations } from "../components/home/ServiceLocations";
import { AboutSection } from "../components/home/AboutSection";
import { Testimonials } from "../components/home/Testimonials";
import { Footer } from "../components/shared/Footer";
import { Cart } from "../components/shared/Cart";
import { PaymentPage } from "./Payment";

export const Home = () => {
  const [showPayment, setShowPayment] = useState(false);

  const handlePaymentToggle = (value) => {
    setShowPayment(value);
  };

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

          {/* Section: The Fleet Showroom */}
          <FleetShowroom onPaymentToggle={handlePaymentToggle} />

          {/* Section: Monthly Highlights */}
          <Highligth />

          {/* Section: Accessible Fleet */}
          <BudgetFriendly />

          {/* Section: Service Standards */}
          <ServiceStandards />

          {/* Section: Service Coverage / Locations */}
          <ServiceLocations />

          {/* Section: About */}
          <AboutSection />

          {/* Section: Testimonials */}
          <Testimonials />

          {/* Footer */}
          <Footer />
        </main>
      )}
    </div>
  );
};

export default Home;

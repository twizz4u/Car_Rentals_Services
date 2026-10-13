import { useState } from "react";
import { Header } from "../component/Header";
import { Hero } from "../component/Hero";
import { FleetShowroom } from "../component/FleetShowroom";
import { Highligth } from "../component/Highligth";
import { BudgetFriendly } from "../component/BudgetFrienldly";
import { ServiceStandards } from "../component/ServiceStandards";
import { ServiceLocations } from "../component/ServiceLocations";
import { AboutSection } from "../component/AboutSection";
import { Testimonials } from "../component/Testimonials";
import { Footer } from "../component/Footer";
import { Cart } from "../component/Cart";
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

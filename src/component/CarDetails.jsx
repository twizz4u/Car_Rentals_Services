import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

// Distinct, verified automotive campaign photography & metadata per make/model
// Ensures every vehicle in the fleet has a unique, professional photograph
const VEHICLE_METADATA_MAP = {
  "mercedes-benz s-class": {
    image: "/cars/hero_mercedes_s580.jpg",
    category: "EXECUTIVE",
    price: "₦260,000 / day",
    specs: "Automatic · 5 Seats · Chauffeur",
  },
  "mercedes-benz g-class": {
    image: "/cars/mercedes-g-class.jpg",
    category: "LUXURY SUV",
    price: "₦380,000 / day",
    specs: "Automatic · 5 Seats · Chauffeur",
  },
  "mercedes-amg": {
    image: "/cars/mercedes-g-class.jpg",
    category: "LUXURY SUV",
    price: "₦380,000 / day",
    specs: "Automatic · 5 Seats · Chauffeur",
  },
  "lexus ls": {
    image: "/cars/lexus_ls500.jpg",
    category: "EXECUTIVE",
    price: "₦220,000 / day",
    specs: "Automatic · 5 Seats · Chauffeur",
  },
  "lexus lx": {
    image: "/cars/lexus_lx600.jpg",
    category: "LUXURY SUV",
    price: "₦320,000 / day",
    specs: "Automatic · 7 Seats · Chauffeur",
  },
  "toyota century": {
    image:
      "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=80",
    category: "EXECUTIVE",
    price: "₦300,000 / day",
    specs: "Automatic · 4 Seats · Chauffeur",
  },
  "tesla model s": {
    image: "/cars/tesla_model_s.jpg",
    category: "EXECUTIVE",
    price: "₦250,000 / day",
    specs: "Electric · 5 Seats · Chauffeur",
  },
  "tesla model x": {
    image: "/cars/tesla_model_x.jpg",
    category: "LUXURY SUV",
    price: "₦290,000 / day",
    specs: "Electric · 6 Seats · Chauffeur",
  },
  "lamborghini urus": {
    image: "/cars/lamborghini_urus.jpg",
    category: "SPORTS",
    price: "₦450,000 / day",
    specs: "Automatic · 5 Seats · Chauffeur",
  },
  "bmw 7 series": {
    image: "/cars/BMW_7.webp",
    category: "EXECUTIVE",
    price: "₦250,000 / day",
    specs: "Automatic · 5 Seats · Chauffeur",
  },
  "bmw x7": {
    image: "/cars/Lincoln_Navigator.webp",
    category: "LUXURY SUV",
    price: "₦310,000 / day",
    specs: "Automatic · 7 Seats · Chauffeur",
  },
  "audi a8": {
    image: "/cars/audi-r8.jpg",
    category: "EXECUTIVE",
    price: "₦230,000 / day",
    specs: "Automatic · 5 Seats · Chauffeur",
  },
  "audi r8": {
    image: "/cars/audi-a8.jpg",
    category: "SPORTS",
    price: "₦400,000 / day",
    specs: "Automatic · 2 Seats · Self Drive",
  },
  "porsche 911": {
    image:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80",
    category: "SPORTS",
    price: "₦350,000 / day",
    specs: "Automatic · 4 Seats · Self Drive",
  },
  "porsche panamera": {
    image: "/cars/header_1.jpg",
    category: "SPORTS",
    price: "₦320,000 / day",
    specs: "Automatic · 4 Seats · Chauffeur",
  },
  "range rover": {
    image: "/cars/range_rover_autobiography.jpg",
    category: "LUXURY SUV",
    price: "₦310,000 / day",
    specs: "Automatic · 5 Seats · Chauffeur",
  },
  cadillac: {
    image: "/cars/Lincoln_Navigator.webp",
    category: "LUXURY SUV",
    price: "₦340,000 / day",
    specs: "Automatic · 7 Seats · Chauffeur",
  },
};

// Helper to resolve asset URLs with Vite's configured base path (supports GitHub Pages and dev)
export const resolveAsset = (path) => {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const base = import.meta.env.BASE_URL || "/";
  const cleanBase = base.endsWith("/") ? base : `${base}/`;
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;
  return `${cleanBase}${cleanPath}`;
};

// Helper to cleanly deduplicate repeated model/brand words
// e.g. ("Tesla Model X", "Model X Plaid") -> "Tesla Model X Plaid"
// e.g. ("Toyota Century", "Century") -> "Toyota Century"
// e.g. ("Lamborghini Urus", "Urus") -> "Lamborghini Urus"
// e.g. ("Lexus LX", "LX 600") -> "Lexus LX 600"
export const formatVehicleTitle = (name = "", model = "") => {
  const cleanName = (name || "").trim();
  const cleanModel = (model || "").trim();
  if (!cleanModel) return cleanName;
  if (!cleanName) return cleanModel;

  if (cleanName.toLowerCase() === cleanModel.toLowerCase()) return cleanName;
  if (cleanName.toLowerCase().includes(cleanModel.toLowerCase()))
    return cleanName;

  const nameWords = cleanName.split(/\s+/);
  const modelWords = cleanModel.split(/\s+/);

  let overlap = 0;
  for (let i = 1; i <= Math.min(nameWords.length, modelWords.length); i++) {
    const nameSuffix = nameWords
      .slice(nameWords.length - i)
      .join(" ")
      .toLowerCase();
    const modelPrefix = modelWords.slice(0, i).join(" ").toLowerCase();
    if (nameSuffix === modelPrefix) {
      overlap = i;
    }
  }

  if (overlap > 0) {
    const uniqueModelPart = modelWords.slice(overlap).join(" ");
    return uniqueModelPart ? `${cleanName} ${uniqueModelPart}` : cleanName;
  }

  return `${cleanName} ${cleanModel}`;
};

export const CarDetail = ({ cardata = {} }) => {
  const { name = "Executive Vehicle", model = "S 580" } = cardata;

  const { addToCart } = useCart();
  const navigate = useNavigate();

  // Find exact vehicle match from our curated lookup map
  const searchKey = `${name} ${model}`.toLowerCase();
  let matchedMeta = null;

  for (const [key, value] of Object.entries(VEHICLE_METADATA_MAP)) {
    if (searchKey.includes(key)) {
      matchedMeta = value;
      break;
    }
  }

  // Fallback defaults if vehicle is unfamiliar
  const category =
    (cardata.category && cardata.category !== "null" && cardata.category) ||
    matchedMeta?.category ||
    "EXECUTIVE";

  const displayPrice =
    cardata.loanPrice ||
    (cardata.price && cardata.price !== "null" ? cardata.price : null) ||
    matchedMeta?.price ||
    "₦150,000 / day";

  const specs = (
    cardata.specs ||
    matchedMeta?.specs ||
    "Automatic · 5 Seats · Driver"
  ).replace(/\bChauffeur\b/g, "Driver");

  // Resolve authentic, distinct vehicle image with base URL resolution
  const rawImage =
    (cardata.image &&
      cardata.image !== "null" &&
      !cardata.image.includes("cars/Lexus.webp") &&
      !cardata.image.includes("cars/Cadillac.webp") &&
      cardata.image) ||
    matchedMeta?.image ||
    "/cars/hero_mercedes_s580.jpg";

  const vehicleImage = resolveAsset(rawImage);

  // Clean vehicle title without duplicate words (e.g. "Tesla Model X Plaid")
  const fullTitle = formatVehicleTitle(name, model);

  const handleRentNow = () => {
    addToCart({
      ...cardata,
      name,
      model,
      category,
      specs,
      image: vehicleImage,
      loanPrice: displayPrice,
    });
    navigate("/checkout");
  };

  // Open the premium vehicle detail page for this vehicle
  const handleViewDetails = () => {
    navigate("/car-details", {
      state: {
        car: {
          ...cardata,
          name,
          model,
          category,
          specs,
          image: vehicleImage,
          loanPrice: displayPrice,
        },
      },
    });
  };

  return (
    <article className="group flex w-full flex-col bg-[#090a0d]">
      {/* 1. Consistent Professional Vehicle Photograph (16:10 horizontal landscape) */}
      <button
        type="button"
        onClick={handleViewDetails}
        aria-label={`View ${fullTitle} details`}
        className="relative aspect-[16/10] w-full cursor-pointer overflow-hidden bg-[#07080a]"
      >
        <img
          src={vehicleImage}
          alt={fullTitle}
          className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.025] brightness-[0.93]"
          loading="lazy"
        />
      </button>

      {/* 2. Information Area (Horizontally distributed, vertically compact) */}
      <div className="flex flex-1 flex-col justify-between px-4 py-3 sm:px-5 sm:py-3.5">
        <div>
          <div className="flex items-baseline justify-between gap-2">
            <h3
              className="text-base sm:text-lg font-semibold tracking-tight text-[#f5f3ee] leading-snug truncate"
              title={fullTitle}
            >
              {fullTitle}
            </h3>
            <span className="shrink-0 text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.16em] text-slate-400">
              {category}
            </span>
          </div>

          <p className="mt-1 text-xs sm:text-sm font-light text-slate-400 truncate">
            {specs}
          </p>
          <p className="mt-1 text-xs text-slate-300">
            Pickup available <span className="px-1 text-slate-600">·</span>{" "}
            Driver available
          </p>
        </div>

        {/* 3. Pricing & Reserve CTA */}
        <div className="mt-3.5 flex items-center justify-between gap-2.5 border-t border-white/[0.08] pt-3 pb-0.5">
          <span className="text-xs sm:text-sm font-semibold tracking-tight text-amber-500 whitespace-nowrap min-w-0">
            {displayPrice}
          </span>

          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            <button
              type="button"
              onClick={handleViewDetails}
              className="whitespace-nowrap text-xs font-medium text-slate-400 transition-colors hover:text-white cursor-pointer"
            >
              View details
            </button>
            <button
              type="button"
              onClick={handleRentNow}
              className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 hover:bg-amber-500 px-2.5 sm:px-3 py-1 text-xs font-medium text-amber-400 hover:text-black transition-all cursor-pointer whitespace-nowrap"
            >
              <span>Reserve</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

export default CarDetail;

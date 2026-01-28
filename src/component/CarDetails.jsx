import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

const defaultSpecs = [
  { label: "Seats", value: "5" },
  { label: "Range", value: "610 km" },
  { label: "Drive", value: "AWD" },
];

export const CarDetail = ({ cardata = {}, changeui }) => {
  const {
    name = "Unknown",
    image = "cars/Volvo.webp",
    model = "Executive",
    price = "₦150,000 / day",
    rating = 4.9,
    specs = defaultSpecs,
  } = cardata;

  const [imageLoaded, setImageLoaded] = useState(false);
  const [liked, setLiked] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleRentNow = () => {
    addToCart({ ...cardata, loanPrice: cardata.loanPrice || price });
    navigate("/checkout");
  };

  const handleAddToCart = () => {
    addToCart({ ...cardata, loanPrice: cardata.loanPrice || price });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const driveSpec = specs?.find((s) => s.label === "Drive")?.value || "AWD";

  return (
    <article className="group relative h-auto md:h-[420px] w-full transition-all duration-500 hover:-translate-y-2">
      <div className="absolute inset-0 rounded-2xl md:rounded-[30px] border border-slate-200 bg-white shadow-xl shadow-slate-200/50 transition-all duration-500 group-hover:border-indigo-500/30 group-hover:shadow-2xl group-hover:shadow-indigo-500/20" />

      <div className="relative z-10 h-full w-full rounded-2xl md:rounded-[30px] bg-white text-slate-800 border border-slate-100 transition-colors group-hover:border-indigo-500/10">
        <div className="flex h-full flex-col">
          {/* Image Section */}
          <div className="relative h-24 md:h-40 shrink-0 overflow-hidden rounded-t-2xl md:rounded-t-[30px] border-b border-slate-100 bg-slate-50">
            <div
              className={`${
                imageLoaded
                  ? "hidden"
                  : "absolute inset-0 animate-pulse bg-slate-200"
              }`}
            ></div>
            <img
              src={image}
              alt={name}
              className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-110"
              draggable={false}
              loading="lazy"
              onLoad={() => setImageLoaded(true)}
            />
            <span className="absolute left-2 top-16 md:left-4 md:top-30 rounded-full bg-white/95 px-2 py-0.5 md:px-3 md:py-1 text-[10px] md:text-xs font-bold uppercase tracking-wider text-indigo-600 shadow-sm backdrop-blur-sm border border-indigo-100">
              {model}
            </span>
            <button
              onClick={() => setLiked((s) => !s)}
              className={`absolute right-1 top-1 md:right-3 md:top-3 rounded-full bg-white/90 p-0.5 md:p-2 shadow-sm backdrop-blur-sm transition-all hover:bg-white hover:text-red-500 active:scale-90 text-xs md:text-base ${
                liked ? "text-red-500" : "text-slate-400"
              }`}
            >
              {liked ? "♥" : "♡"}
            </button>
          </div>

          <div className="flex flex-1 flex-col justify-between px-1.5 py-2 md:p-4">
            <div>
              <p className="text-[9px] md:text-xs uppercase tracking-[0.3em] md:tracking-[0.5em] text-indigo-500">
                {driveSpec}
              </p>
              <h4
                className="mt-0.5 md:mt-1 text-sm md:text-xl font-bold text-slate-900 line-clamp-1"
                title={name}
              >
                {name}
              </h4>
            </div>

            <ul className="my-1 md:my-2 space-y-0.5 md:space-y-2 text-[11px] md:text-sm text-slate-600">
              <li className="flex items-center justify-between">
                <span className="text-slate-500">Price</span>
                <span className="font-bold text-indigo-950 text-xs md:text-lg">
                  {cardata.loanPrice || price}
                </span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-slate-500">Rating</span>
                <span className="font-semibold text-slate-900 flex items-center gap-0.5 md:gap-1 text-xs md:text-sm">
                  <span className="text-amber-500">★</span> {rating}
                </span>
              </li>
            </ul>

            <div className="flex gap-1 md:flex-col md:space-y-2">
              <button
                onClick={handleAddToCart}
                className={`flex-1 md:flex-none md:w-full h-5 md:h-auto rounded-sm md:rounded-xl py-0 md:py-2.5 text-[10px] md:text-sm font-bold uppercase tracking-wide transition-all duration-300 flex items-center justify-center ${
                  addedToCart
                    ? "bg-emerald-500 text-white"
                    : "bg-indigo-50 text-indigo-600 hover:bg-indigo-100 border border-indigo-200"
                }`}
              >
                {addedToCart ? "✓" : "Cart"}
              </button>
              <button
                onClick={handleRentNow}
                className="flex-1 md:flex-none md:w-full h-5 md:h-auto rounded-sm md:rounded-xl bg-gradient-to-r from-slate-900 to-slate-800 py-0 md:py-2.5 text-[10px] md:text-sm font-bold uppercase tracking-wide text-white shadow-sm md:shadow-lg shadow-slate-900/20 ring-1 ring-white/10 transition-all hover:from-slate-800 hover:to-slate-700 active:scale-[0.98] flex items-center justify-center"
              >
                Rent
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

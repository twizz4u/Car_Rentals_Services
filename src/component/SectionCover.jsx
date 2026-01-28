import { useInView } from "../hooks/useInView";
import { FilterBar } from "./SearchFilter";
import { useState } from "react";

export const SectionCover = (prop) => {
  const {
    display = "grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4",
    gap = "gap-3 p-4 md:gap-6 md:p-6",
    justify = "justify-center",
    title = "Available Cars for Loans",
    subtitle = "Choose from our fleet",
  } = prop || {};

  const [ref, isInView] = useInView({ threshold: 0.1 });
  const [toggle, settoggle] = useState(false);

  return (
    <section
      ref={ref}
      className="mt-12 md:mt-24 relative"
      aria-labelledby="section-cover-title"
    >
      <div className="max-w-[1300px] mx-auto px-2 md:px-4">
        <header
          className={`text-center mb-6 transition-all duration-700 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <h3 id="section-cover-title" className="text-2xl font-semibold">
            {title}
          </h3>
          {subtitle && (
            <p className="text-sm text-slate-400 mt-1">{subtitle}</p>
          )}
        </header>
        <div className=" flex items-center justify-between pr-6">
          <button
            className="filter-icon ml-4 flex items-center gap-2"
            onClick={() => {
              settoggle(!toggle);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
            </svg>
            Filter
          </button>
          <input
            type="search"
            placeholder="Search Model"
            className="border border-gray-900/50 px-4 py-1 w-80 rounded-3xl placeholder:text-gray-600 placeholder:font-medium"
          />
        </div>
        {toggle && <FilterBar toggleHandle={settoggle} />}

        <div
          className={`${display} ${gap} ${justify} items-start ${
            isInView ? "stagger-children" : "opacity-0"
          }`}
        >
          {prop.children}
        </div>
      </div>
    </section>
  );
};

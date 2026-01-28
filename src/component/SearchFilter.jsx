import { useState } from "react";

const model = ["BMW", "Lexus", "BENZ"];

export const FilterBar = (prop) => {
  const [loanRange, setLoanRange] = useState(450);

  console.log(prop);

  function HandleToggle() {
    prop.toggleHandle(false);
  }

  const minAmount = 150;
  const maxAmount = 900;

  return (
    <section className="w-[350px] overflow-auto fixed  z-50 left-0 top-[13%]">
      <div className="mx-auto max-w-5xl  border border-slate-100 bg-white p-6 shadow-[0_25px_65px_rgba(15,23,42,0.08)]">
        <header className="mb-6 flex flex-col gap-2 text-center md:text-left">
          <p className="text-xs uppercase tracking-[0.4em] text-amber-500 flex justify-between">
            Smart filters{" "}
            <span className="cursor-pointer" onClick={HandleToggle}>
              cancel
            </span>
          </p>
          <h3 className="text-2xl font-semibold text-slate-900">
            Find a car and lock a loan in seconds
          </h3>
          <p className="text-sm text-slate-500">
            Adjust budget, trim, and duration to surface the best matches for
            your trip.
          </p>
        </header>

        <form className="grid gap-6">
          <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
            <label
              htmlFor="loanRange"
              className="flex items-center justify-between text-sm font-semibold text-slate-700"
            >
              Loan budget (₦{loanRange}k)
              <span className="text-xs font-normal text-slate-500">
                ₦{minAmount}k – ₦{maxAmount}k
              </span>
            </label>
            <input
              type="range"
              id="loanRange"
              min={minAmount}
              max={maxAmount}
              value={loanRange}
              className="mt-3 w-full accent-amber-500"
              onChange={(event) => setLoanRange(Number(event.target.value))}
            />
          </div>

          <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
            <p className="text-sm font-semibold text-slate-700">
              Trim preference
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {model.map((tier) => (
                <label
                  key={tier}
                  className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-600 transition hover:border-amber-300 hover:text-amber-600"
                >
                  <input type="checkbox" className="accent-amber-500" />
                  {tier}
                </label>
              ))}
            </div>
          </div>
        </form>

        <div className="mt-6 flex flex-wrap justify-between gap-3">
          <p className="text-xs uppercase tracking-wide text-slate-400">
            Showing 16 matching cars
          </p>
          <div className="flex gap-3">
            <button
              type="reset"
              className="rounded-full border border-slate-200 px-5 py-2 text-xs font-semibold uppercase tracking-wide text-slate-500 transition hover:border-amber-300 hover:text-amber-600"
            >
              Reset
            </button>
            <button
              type="submit"
              className="rounded-full bg-slate-900 px-5 py-2 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-slate-800"
            >
              Apply filters
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

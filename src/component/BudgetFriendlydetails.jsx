const fallbackInfo = {
  loanPrice: "₦30,000 / day",
  duration: "4-10 wks",
  efficiency: "34 mpg",
  transmission: "Auto",
};

export const BudgetDetails = ({ data }) => {
  const { name = "Economy", image, loanPrice, duration } = data ?? {};
  const info = {
    loanPrice: loanPrice || fallbackInfo.loanPrice,
    duration: duration || fallbackInfo.duration,
  };

  return (
    <article className="flex h-full flex-col gap-3 select-none">
      <div className="relative h-36 w-full overflow-hidden rounded-2xl bg-slate-100">
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover object-center"
          draggable={false}
          loading="lazy"
        />
        <span className="absolute left-3 top-3 rounded-full bg-emerald-500/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
          Budget pick
        </span>
      </div>

      <div className="space-y-3">
        <header>
          <h4 className="text-lg font-semibold text-slate-900">{name}</h4>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
            Low payment plan
          </p>
        </header>

        <ul className="space-y-1 text-sm text-slate-600">
          <li className="flex items-center justify-between">
            <span className="text-slate-400 ">Loan price</span>
            <span className="font-semibold text-slate-900 select-none">
              {info.loanPrice}
            </span>
          </li>
          <li className="flex items-center justify-between">
            <span className="text-slate-400 ">Duration</span>
            <span>{info.duration}</span>
          </li>
        </ul>

        <button className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-700 transition hover:border-emerald-300 hover:text-emerald-600">
          Loan
        </button>
      </div>
    </article>
  );
};

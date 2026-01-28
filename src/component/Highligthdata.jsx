export const HighligthData = ({ data }) => {
  const { name, image, category, loanPrice, duration, rating, drivetrain } =
    data ?? {};

  return (
    <article className="relative h-[330px] w-full max-w-[300px] origin-bottom-left skew-y-6">
      <div className="absolute  rounded-[30px] border border-slate-300 bg-gradient-to-br from-slate-100 via-slate-200 to-slate-300 shadow-2xl shadow-slate-400/40" />

      <div className="relative z-10 h-full w-full rounded-[30px] bg-white p-4 text-slate-800 border border-slate-100">
        <div className="-skew-y-6 flex h-full flex-col">
          <div className="relative h-40 overflow-hidden rounded-2xl border border-slate-100 bg-slate-50">
            <img
              src={image}
              alt={name}
              className="h-full w-full object-cover object-center"
              draggable={false}
              loading="lazy"
            />
            <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-indigo-600 shadow-sm">
              {category || "Top pick"}
            </span>
          </div>

          <div className="mt-4 flex flex-1 flex-col justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.5em] text-indigo-500">
                {drivetrain || "AWD"}
              </p>
              <h4 className="mt-1 text-xl font-bold text-slate-900">{name}</h4>
            </div>

            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li className="flex items-center justify-between">
                <span className="text-slate-400">Loan price</span>
                <span className="font-semibold text-slate-900">
                  {loanPrice || "₦85,000 / day"}
                </span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-slate-400">Duration</span>
                <span>{duration || "4-12 wks"}</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-slate-400">Rating</span>
                <span className="font-medium text-slate-900">
                  {rating ? `${rating}/5` : "4.8/5"}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </article>
  );
};

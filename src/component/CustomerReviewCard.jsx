export const CustomerCardReviews = () => {
  return (
    <figure className="mx-auto mt-10 max-w-2xl rounded-3xl border border-slate-100 bg-white p-8 shadow-lg">
      <blockquote className="relative text-lg text-slate-700">
        <p className="before:absolute before:-left-4 before:-top-2 before:text-5xl before:text-amber-200 before:content-['\201C']">
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Excepturi
          modi ad quod at tenetur. Animi eos inventore, culpa, consequatur
          libero magni labore ipsa, sed harum nostrum quaerat ratione porro
          veritatis!
        </p>
      </blockquote>
      <figcaption className="mt-6 flex items-center gap-4">
        <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-amber-500 text-xl font-bold text-white">
          J
        </div>
        <div>
          <div className="font-semibold text-slate-900">Jerry</div>
          <div className="text-sm text-slate-500">Repeat Customer</div>
        </div>
      </figcaption>
    </figure>
  );
};

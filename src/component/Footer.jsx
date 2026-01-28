const footerLinks = [
  { label: "Fleet", href: "#" },
  { label: "Pricing", href: "#" },
  { label: "Concierge", href: "#" },
  { label: "Support", href: "#" },
];

const socialLinks = ["Twitter", "Instagram", "LinkedIn"];

export const Footer = () => {
  return (
    <footer className="relative mt-24 overflow-hidden bg-slate-900 text-slate-300">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 py-16 md:grid-cols-3">
        <div className="space-y-3">
          <h4 className="text-xl font-bold text-white">Tasin Car Rental</h4>
          <p className="text-sm text-slate-400">
            Purpose-built loans, premium maintenance, and concierge support in
            every city we serve. We keep your journeys seamless—whether it’s a
            board meeting or a sunrise escape.
          </p>
        </div>

        <nav className="space-y-3">
          <p className="text-xs uppercase tracking-wide text-slate-400">
            Explore
          </p>
          <ul className="space-y-1 text-sm">
            {footerLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="text-slate-300 transition hover:text-amber-300"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="space-y-3 text-sm">
          <p className="text-xs uppercase tracking-wide text-slate-400">
            Contact
          </p>
          <address className="not-italic space-y-1 text-slate-300">
            <p>27 Churchill Avenue</p>
            <p>Lagos, NG</p>
            <p>+234 (0) 800 123 4567</p>
          </address>
          <div className="flex gap-4">
            {socialLinks.map((label) => (
              <a
                key={label}
                href="#"
                className="rounded-full border border-slate-700 bg-slate-800/50 px-3 py-1 text-xs uppercase tracking-wide text-slate-300 transition-colors hover:border-amber-400 hover:bg-slate-800 hover:text-amber-300"
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-slate-800 px-6 py-4 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} Tasin Car Rental. All rights reserved.
      </div>
    </footer>
  );
};

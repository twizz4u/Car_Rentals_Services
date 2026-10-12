// Tasin Mobility — Customer rental dashboard (customer portal, not admin).
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { resolveAsset } from "../component/CarDetails";
import { data as localFleet } from "../assets/data";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Car,
  Check,
  ChevronRight,
  Clock,
  History,
  LayoutGrid,
  Loader2,
  LogOut,
  MapPin,
  Menu,
  Phone,
  UserRound,
  X,
} from "lucide-react";

const API_BASE = "http://127.0.0.1:8000";
const CONCIERGE_TEL = "tel:+2348008274666";
const HISTORY_PAGE_SIZE = 5;

/* ---------------- formatting (matches existing app conventions) ---------------- */

const fmtDate = (value) => {
  if (!value) return "";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const fmtDateTime = (value) => {
  if (!value) return "";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return `${fmtDate(date)} · ${date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
};

const fmtNaira = (value) => {
  const amount = Number(value);
  if (!Number.isFinite(amount) || amount <= 0) return "";
  return `\u20A6${amount.toLocaleString()}`;
};

const parseAmount = (value) => {
  if (typeof value === "number") return value;
  const match = String(value ?? "").match(/[\d,]+/);
  return match ? parseInt(match[0].replace(/,/g, ""), 10) : 0;
};

/* ---------------- rental normalisation ---------------- */

const deriveStatus = (rawStatus, start, end) => {
  const s = String(rawStatus || "").toLowerCase().trim();
  if (["cancelled", "canceled"].includes(s)) return "Cancelled";
  if (["completed", "complete", "returned", "closed", "done"].includes(s))
    return "Completed";
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const startDate = start ? new Date(start) : null;
  const endDate = end ? new Date(end) : null;
  if (endDate && !Number.isNaN(endDate.getTime()) && endDate < now)
    return "Completed";
  if (startDate && !Number.isNaN(startDate.getTime()) && startDate > now)
    return "Upcoming";
  if (
    ["active", "ongoing", "in_progress", "in-progress", "picked_up", "current"].includes(s)
  )
    return "Active";
  if (startDate && endDate && startDate <= now && now <= endDate) return "Active";
  return "Upcoming";
};

const normalizeRental = (raw, index = 0) => {
  const source = raw && typeof raw === "object" ? raw : {};
  const car =
    source.car && typeof source.car === "object" ? source.car : {};
  const name =
    source.car_name || car.name || source.vehicle_name || "Reserved vehicle";
  const model =
    source.car_model || car.model || source.vehicle_model || "";
  const category =
    source.car_category || car.category || source.category || "";
  const image =
    source.car_image || source.image || car.image || car.photo || "";
  const reference =
    source.reference ||
    source.booking_reference ||
    source.booking_number ||
    source.code ||
    (source.id ? `TM-${source.id}` : `TM-${String(index + 1).padStart(4, "0")}`);
  const start = source.start_date || source.pickup_date || source.from_date || null;
  const end = source.end_date || source.return_date || source.to_date || null;
  const location =
    source.pickup_location ||
    source.handover_location ||
    source.location ||
    source.hub ||
    "";
  const amount = parseAmount(
    source.amount ?? source.total ?? source.total_amount ?? source.price,
  );
  const terms = source.rental_terms || source.terms || "";
  return {
    id: source.id ?? reference,
    name,
    model,
    category,
    image,
    reference,
    start,
    end,
    location,
    amount,
    terms,
    status: deriveStatus(source.status, start, end),
    days:
      Number(source.duration_days ?? source.duration ?? source.days) || null,
  };
};

const rentalDays = (rental) => {
  if (rental.days && rental.days > 0) return rental.days;
  if (rental.start && rental.end) {
    const diff =
      new Date(rental.end).getTime() - new Date(rental.start).getTime();
    if (Number.isFinite(diff) && diff >= 0)
      return Math.max(1, Math.round(diff / 86400000));
  }
  return null;
};

/* ---------------- sample rentals (only when the API has no records) ---------------- */

const daysFromNow = (days, hour = 10) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  d.setHours(hour, 0, 0, 0);
  return d.toISOString();
};

const buildDemoRentals = () => {
  const fleet = Array.isArray(localFleet) ? localFleet : [];
  const pick = (i) => fleet[i % Math.max(fleet.length, 1)] || {};
  const demo = [
    {
      id: "demo-active-1",
      status: "active",
      reference: "TM-84210",
      start_date: daysFromNow(-1),
      end_date: daysFromNow(2, 18),
      pickup_location: "Lagos — VI / Ikoyi / Lekki Hub",
      rental_terms:
        "Standard Tasin Mobility handover terms apply. Valid driver's licence required at pick-up.",
    },
    {
      id: "demo-upcoming-1",
      status: "upcoming",
      reference: "TM-84251",
      start_date: daysFromNow(5),
      end_date: daysFromNow(8, 18),
      pickup_location: "Lagos — MMIA Airport Executive Terminal",
      rental_terms:
        "Free rescheduling up to 24 hours before pick-up.",
    },
    {
      id: "demo-upcoming-2",
      status: "upcoming",
      reference: "TM-84263",
      start_date: daysFromNow(12),
      end_date: daysFromNow(15, 18),
      pickup_location: "Abuja — CBD / Maitama Diplomatic Hub",
      rental_terms:
        "Chauffeur handover available on request.",
    },
    {
      id: "demo-completed-1",
      status: "completed",
      reference: "TM-83904",
      start_date: daysFromNow(-20),
      end_date: daysFromNow(-17, 18),
      pickup_location: "Lagos — VI / Ikoyi / Lekki Hub",
      rental_terms: "Trip completed and vehicle returned.",
    },
    {
      id: "demo-completed-2",
      status: "completed",
      reference: "TM-83612",
      start_date: daysFromNow(-40),
      end_date: daysFromNow(-36, 18),
      pickup_location: "Port Harcourt — Trans-Amadi Hub",
      rental_terms: "Trip completed and vehicle returned.",
    },
    {
      id: "demo-cancelled-1",
      status: "cancelled",
      reference: "TM-84102",
      start_date: daysFromNow(3),
      end_date: daysFromNow(5, 18),
      pickup_location: "Lagos — VI / Ikoyi / Lekki Hub",
      rental_terms: "Reservation cancelled before pick-up.",
    },
  ];
  return demo.map((r, i) => {
    const v = pick(i);
    return {
      ...r,
      car_name: v.name || "Mercedes-Benz",
      car_model: v.model || "S-Class S580",
      car_category: v.category || "Executive",
      car_image: v.image || "/cars/hero_mercedes_s580.jpg",
      amount: parseAmount(v.loanPrice) || 250000,
    };
  });
};

/* ---------------- small helpers ---------------- */

const vehicleTitle = (rental) => {
  const name = (rental.name || "").trim();
  const model = (rental.model || "").trim();
  if (!model) return name || "Reserved vehicle";
  if (!name) return model;
  if (name.toLowerCase().includes(model.toLowerCase())) return name;
  return `${name} ${model}`;
};

const fleetFallbackImage = (rental) => {
  const key = `${rental.name || ""} ${rental.model || ""}`.toLowerCase();
  const match = (localFleet || []).find((v) => {
    const vk = `${v.name || ""} ${v.model || ""}`.toLowerCase();
    const first = String(v.name || "").toLowerCase();
    return (
      (first && key.includes(first)) ||
      (vk && (key.includes(vk.slice(0, 8)) || vk.includes(key.slice(0, 8))))
    );
  });
  return match?.image || "/cars/hero_mercedes_s580.jpg";
};

const rentalImage = (rental) => {
  const direct = rental.image ? resolveAsset(rental.image) : "";
  if (direct) return direct;
  return resolveAsset(fleetFallbackImage(rental));
};

const extractList = (json) => {
  if (Array.isArray(json)) return json;
  if (!json || typeof json !== "object") return [];
  const candidates = [
    json.data,
    json.bookings,
    json.rentals,
    json.orders,
    json.items,
    json.results,
  ];
  for (const c of candidates) {
    if (Array.isArray(c)) return c;
    if (c && typeof c === "object" && Array.isArray(c.data)) return c.data;
  }
  return [];
};

async function fetchCustomerRentals(token, customerEmail) {
  const endpoints = [
    `${API_BASE}/api/customer/bookings`,
    `${API_BASE}/api/customer/rentals`,
    `${API_BASE}/api/customer/orders`,
    `${API_BASE}/api/rentalOrders`,
  ];
  let lastError = null;
  for (const url of endpoints) {
    try {
      const res = await fetch(url, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (res.status === 404) continue;
      if (!res.ok) {
        lastError = new Error(`Request failed (${res.status})`);
        continue;
      }
      const json = await res.json().catch(() => null);
      let list = extractList(json);
      // rentalOrders is an admin-wide list: scope to this customer when possible.
      if (url.endsWith("/api/rentalOrders") && customerEmail && list.length > 0) {
        const mine = list.filter((o) => {
          const email =
            o?.customer?.email || o?.email || o?.customer_email || "";
          return (
            String(email).toLowerCase() === String(customerEmail).toLowerCase()
          );
        });
        // Only narrow when the backend actually tags rows with customer email.
        if (mine.length > 0) list = mine;
        else if (list.some((o) => o?.customer?.email || o?.email)) list = mine;
      }
      return { list, endpoint: url };
    } catch (err) {
      lastError = err;
    }
  }
  throw lastError || new Error("Unable to reach the booking service.");
}

/* ---------------- presentational pieces ---------------- */

function StatusPill({ status }) {
  const map = {
    Active: "bg-emerald-400/10 text-emerald-300 border-emerald-400/20",
    Upcoming: "bg-amber-400/10 text-amber-300 border-amber-400/25",
    Completed: "bg-white/[0.06] text-slate-300 border-white/10",
    Cancelled: "bg-rose-400/10 text-rose-300 border-rose-400/20",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium ${map[status] || map.Completed}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
      {status}
    </span>
  );
}

function SkeletonBlock({ className = "" }) {
  return (
    <div className={`animate-pulse rounded-[3px] bg-white/[0.06] ${className}`} />
  );
}

function EmptyState({ title, body, actionLabel, onAction, to }) {
  const inner = (
    <>
      {actionLabel ? (
        <span className="mt-6 inline-flex items-center justify-center gap-2 bg-amber-500 px-6 py-3 text-sm font-semibold text-black transition-colors hover:bg-amber-400">
          <span>{actionLabel}</span>
          <ArrowRight className="h-4 w-4" />
        </span>
      ) : null}
    </>
  );
  return (
    <div className="rounded-[4px] border border-white/[0.06] bg-[#0a0b0e] px-6 py-12 text-center sm:px-10">
      <h3 className="font-['Playfair_Display',serif] text-2xl font-normal text-[#f5f3ee]">
        {title}
      </h3>
      <p className="mx-auto mt-2 max-w-sm text-sm font-light leading-relaxed text-slate-400">
        {body}
      </p>
      {to ? <Link to={to}>{inner}</Link> : <button type="button" onClick={onAction}>{inner}</button>}
    </div>
  );
}

function RentalCard({ rental, onView }) {
  const days = rentalDays(rental);
  return (
    <article className="overflow-hidden rounded-[4px] border border-white/[0.06] bg-[#0a0b0e]">
      <div className="grid gap-0 sm:grid-cols-[220px_1fr]">
        <button
          type="button"
          onClick={onView}
          className="relative block aspect-[16/10] w-full overflow-hidden bg-[#07080a] sm:aspect-auto sm:h-full sm:min-h-[150px]"
          aria-label={`View ${vehicleTitle(rental)} details`}
        >
          <img
            src={rentalImage(rental)}
            alt={vehicleTitle(rental)}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover object-center brightness-[0.93]"
            onError={(e) => {
              e.currentTarget.src = resolveAsset("/cars/hero_mercedes_s580.jpg");
            }}
          />
        </button>
        <div className="flex flex-col justify-between gap-4 p-4 sm:p-5">
          <div>
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-slate-500">
                  {rental.category || "Tasin fleet"} · {rental.reference}
                </p>
                <h3 className="mt-1 truncate text-base font-semibold tracking-tight text-[#f5f3ee]">
                  {vehicleTitle(rental)}
                </h3>
              </div>
              <StatusPill status={rental.status} />
            </div>
            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-[13px] text-slate-400">
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays className="h-3.5 w-3.5 text-slate-500" />
                {fmtDate(rental.start) || "Date to confirm"}
                <span className="text-slate-600">→</span>
                {fmtDate(rental.end) || "Date to confirm"}
              </span>
              {days ? (
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-slate-500" />
                  {days} {days === 1 ? "day" : "days"}
                </span>
              ) : null}
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.06] pt-3">
            <span className="text-sm font-semibold text-amber-500">
              {fmtNaira(rental.amount) || "Total on confirmation"}
            </span>
            <button
              type="button"
              onClick={onView}
              className="inline-flex items-center gap-1.5 text-[13px] font-medium text-slate-300 transition-colors hover:text-amber-400"
            >
              View details
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

/* ---------------- main portal ---------------- */

const NAV = [
  { id: "overview", label: "Overview", icon: LayoutGrid },
  { id: "rentals", label: "My Rentals", icon: Car },
  { id: "history", label: "Rental History", icon: History },
  { id: "profile", label: "My Profile", icon: UserRound },
];

export function CustomerProfile() {
  const { token, user, isAuthenticated, isLoading, logout, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const initialView = useMemo(() => {
    const q = new URLSearchParams(location.search).get("view");
    return ["overview", "rentals", "history", "profile"].includes(q) ? q : "overview";
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [view, setView] = useState(initialView);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [rentals, setRentals] = useState([]);
  const [rentalsLoading, setRentalsLoading] = useState(true);
  const [rentalsError, setRentalsError] = useState("");
  const [usingDemo, setUsingDemo] = useState(false);
  const [rentalsTab, setRentalsTab] = useState("all");
  const [historyFilter, setHistoryFilter] = useState("all");
  const [historyVisible, setHistoryVisible] = useState(HISTORY_PAGE_SIZE);
  const [selectedId, setSelectedId] = useState(null);

  // Profile state (real account data only)
  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState("");
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "" });
  const [fieldErrors, setFieldErrors] = useState({});
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState({ type: "", text: "" });
  const [pwd, setPwd] = useState({ current: "", next: "", confirm: "" });
  const [pwdMsg, setPwdMsg] = useState({ type: "", text: "" });
  const [pwdSaving, setPwdSaving] = useState(false);
  const [pwdSupported, setPwdSupported] = useState(true);
  const baselineRef = useRef(null);

  const customerEmail = profile?.email || user?.email || "";

  const loadRentals = useCallback(async () => {
    if (!token) {
      setRentalsLoading(false);
      return;
    }
    setRentalsLoading(true);
    setRentalsError("");
    try {
      const { list } = await fetchCustomerRentals(token, user?.email);
      if (list.length > 0) {
        setRentals(list.map((r, i) => normalizeRental(r, i)));
        setUsingDemo(false);
      } else {
        // API reachable but no records for this customer: fall back to sample rentals.
        setRentals(buildDemoRentals().map((r, i) => normalizeRental(r, i)));
        setUsingDemo(true);
      }
    } catch {
      // API unreachable: keep the portal usable with sample rentals.
      setRentalsError("We could not load your rentals. Check your connection and try again.");
      setRentals(buildDemoRentals().map((r, i) => normalizeRental(r, i)));
      setUsingDemo(true);
    } finally {
      setRentalsLoading(false);
    }
  }, [token, user?.email]);

  const loadProfile = useCallback(async () => {
    setProfileLoading(true);
    setProfileError("");
    const fallback = {
      name: user?.name || user?.full_name || "",
      email: user?.email || "",
      phone: user?.phone || user?.phone_number || "",
      address: user?.address || user?.billing_address || "",
      created_at: user?.created_at || user?.createdAt || "",
      verified: user?.verified ?? user?.email_verified ?? null,
    };
    if (!token) {
      setProfile(fallback);
      setForm({
        name: fallback.name,
        email: fallback.email,
        phone: fallback.phone,
        address: fallback.address,
      });
      baselineRef.current = { ...fallback };
      setProfileLoading(false);
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/api/customer/profile`, {
        headers: {
          Accept: "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (res.status === 404) throw new Error("not-found");
      if (!res.ok) throw new Error(`profile-${res.status}`);
      const json = await res.json().catch(() => null);
      const p = json?.data && typeof json.data === "object" ? json.data : json || {};
      const merged = {
        name: p.name || p.full_name || fallback.name,
        email: p.email || fallback.email,
        phone: p.phone || p.phone_number || fallback.phone,
        address: p.address || p.billing_address || fallback.address,
        created_at: p.created_at || p.createdAt || fallback.created_at,
        verified: p.verified ?? p.email_verified ?? fallback.verified,
      };
      setProfile(merged);
      setForm({
        name: merged.name,
        email: merged.email,
        phone: merged.phone,
        address: merged.address,
      });
      baselineRef.current = { ...merged };
    } catch {
      // Backend may not expose a profile endpoint yet: use authenticated account data.
      setProfile(fallback);
      setForm({
        name: fallback.name,
        email: fallback.email,
        phone: fallback.phone,
        address: fallback.address,
      });
      baselineRef.current = { ...fallback };
      setProfileError("");
    } finally {
      setProfileLoading(false);
    }
  }, [token, user]);

  useEffect(() => {
    if (isLoading) return;
    if (isAuthenticated) {
      loadRentals();
      loadProfile();
    }
  }, [isLoading, isAuthenticated, loadRentals, loadProfile]);

  useEffect(() => {
    const q = new URLSearchParams(location.search).get("view");
    if (q && ["overview", "rentals", "history", "profile"].includes(q)) setView(q);
  }, [location.search]);

  const goView = (id) => {
    setView(id);
    setSelectedId(null);
    setDrawerOpen(false);
    navigate(`/account?view=${id}`, { replace: true });
  };

  const openDetail = (id) => setSelectedId(id);
  const closeDetail = () => setSelectedId(null);

  const counts = useMemo(() => {
    return {
      active: rentals.filter((r) => r.status === "Active").length,
      upcoming: rentals.filter((r) => r.status === "Upcoming").length,
      completed: rentals.filter((r) => r.status === "Completed").length,
      cancelled: rentals.filter((r) => r.status === "Cancelled").length,
    };
  }, [rentals]);

  const currentRental = useMemo(
    () => rentals.find((r) => r.status === "Active") || null,
    [rentals],
  );
  const upcomingList = useMemo(
    () =>
      rentals
        .filter((r) => r.status === "Upcoming")
        .sort((a, b) => new Date(a.start || 0) - new Date(b.start || 0))
        .slice(0, 3),
    [rentals],
  );
  const selected = useMemo(
    () => rentals.find((r) => String(r.id) === String(selectedId)) || null,
    [rentals, selectedId],
  );

  const rentalsFiltered = useMemo(() => {
    if (rentalsTab === "active") return rentals.filter((r) => r.status === "Active");
    if (rentalsTab === "upcoming") return rentals.filter((r) => r.status === "Upcoming");
    return rentals.filter((r) => ["Active", "Upcoming"].includes(r.status));
  }, [rentals, rentalsTab]);

  const historyList = useMemo(() => {
    let list = rentals.filter((r) => ["Completed", "Cancelled"].includes(r.status));
    if (historyFilter !== "all")
      list = list.filter((r) => r.status.toLowerCase() === historyFilter);
    return [...list].sort((a, b) => new Date(b.end || b.start || 0) - new Date(a.end || a.start || 0));
  }, [rentals, historyFilter]);

  /* ----- profile editing ----- */

  const setField = (key) => (e) => {
    setForm((s) => ({ ...s, [key]: e.target.value }));
    setDirty(true);
    setSaveMsg({ type: "", text: "" });
    setFieldErrors((s) => ({ ...s, [key]: "" }));
  };

  const validateProfile = () => {
    const errors = {};
    if (!form.name.trim()) errors.name = "Full name is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
      errors.email = "Enter a valid email address.";
    if (form.phone.trim() && form.phone.replace(/\D/g, "").length < 7)
      errors.phone = "Enter a valid phone number.";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const resetForm = () => {
    if (baselineRef.current) {
      setForm({
        name: baselineRef.current.name || "",
        email: baselineRef.current.email || "",
        phone: baselineRef.current.phone || "",
        address: baselineRef.current.address || "",
      });
    }
    setFieldErrors({});
    setDirty(false);
    setSaveMsg({ type: "", text: "" });
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    if (!validateProfile() || saving) return;
    setSaving(true);
    setSaveMsg({ type: "", text: "" });
    try {
      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
      };
      let savedRemotely = false;
      if (token) {
        for (const method of ["PATCH", "PUT"]) {
          try {
            const res = await fetch(`${API_BASE}/api/customer/profile`, {
              method,
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify(payload),
            });
            if (res.status === 404 || res.status === 405) continue;
            if (!res.ok) {
              const errJson = await res.json().catch(() => null);
              throw new Error(errJson?.message || `Save failed (${res.status})`);
            }
            savedRemotely = true;
            break;
          } catch (err) {
            if (String(err.message).startsWith("Save failed")) throw err;
          }
        }
      }
      const next = { ...profile, ...payload };
      setProfile(next);
      baselineRef.current = { ...next };
      // Reflect changes across the dashboard immediately.
      if (user && token) {
        try {
          const mergedUser = { ...user, ...payload };
          sessionStorage.setItem("adminUser", JSON.stringify(mergedUser));
        } catch { /* storage unavailable */ }
        login(token, { ...user, ...payload });
      }
      setDirty(false);
      setSaveMsg({
        type: "success",
        text: savedRemotely
          ? "Profile saved."
          : "Profile saved on this device. It will sync when the profile service is available.",
      });
    } catch (err) {
      setSaveMsg({
        type: "error",
        text: err.message || "Could not save changes. Try again.",
      });
    } finally {
      setSaving(false);
    }
  };

  const savePassword = async (e) => {
    e.preventDefault();
    setPwdMsg({ type: "", text: "" });
    if (!pwd.next || pwd.next.length < 8) {
      setPwdMsg({ type: "error", text: "New password must be at least 8 characters." });
      return;
    }
    if (pwd.next !== pwd.confirm) {
      setPwdMsg({ type: "error", text: "New passwords do not match." });
      return;
    }
    setPwdSaving(true);
    try {
      const res = await fetch(`${API_BASE}/api/customer/password`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          current_password: pwd.current,
          password: pwd.next,
          password_confirmation: pwd.confirm,
        }),
      });
      if (res.status === 404 || res.status === 405) {
        setPwdSupported(false);
        setPwdMsg({
          type: "error",
          text: "Password changes are not enabled on this account. Contact concierge for help.",
        });
        return;
      }
      if (!res.ok) {
        const errJson = await res.json().catch(() => null);
        throw new Error(errJson?.message || "Could not update password.");
      }
      setPwd({ current: "", next: "", confirm: "" });
      setPwdMsg({ type: "success", text: "Password updated." });
    } catch (err) {
      setPwdMsg({ type: "error", text: err.message || "Could not update password." });
    } finally {
      setPwdSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#06070a]">
        <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/customer-login" state={{ from: location }} replace />;
  }

  const sidebar = (
    <div className="flex h-full flex-col bg-[#0a0b0e]">
      <Link to="/" className="flex items-center gap-3 px-6 pb-6 pt-7" aria-label="Tasin Mobility home">
        <span className="flex h-8 w-8 items-center justify-center bg-amber-500">
          <Car className="h-4 w-4 stroke-[2.4] text-black" />
        </span>
        <span className="font-['Syne',sans-serif] text-[13px] font-bold uppercase tracking-[0.22em] text-white">
          Tasin Mobility
        </span>
      </Link>
      <nav className="flex-1 space-y-1 px-3" aria-label="Customer portal">
        {NAV.map((item) => {
          const Icon = item.icon;
          const active = view === item.id && !selected;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => goView(item.id)}
              className={`flex w-full items-center gap-3 rounded-[3px] px-3 py-2.5 text-sm transition-colors ${
                active
                  ? "bg-amber-500/[0.08] font-medium text-amber-400"
                  : "font-light text-slate-400 hover:bg-white/[0.04] hover:text-white"
              }`}
              aria-current={active ? "page" : undefined}
            >
              <span className={`h-4 w-[2px] rounded-full ${active ? "bg-amber-500" : "bg-transparent"}`} aria-hidden="true" />
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
      <div className="border-t border-white/[0.06] p-3">
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-[3px] px-3 py-2.5 text-sm font-light text-slate-400 transition-colors hover:bg-white/[0.04] hover:text-white"
        >
          <LogOut className="h-4 w-4" />
          <span>Log Out</span>
        </button>
        <p className="px-3 pb-2 pt-3 text-[11px] font-light leading-relaxed text-slate-600">
          Support
          <a href={CONCIERGE_TEL} className="mt-0.5 flex items-center gap-1.5 text-slate-400 hover:text-amber-400">
            <Phone className="h-3 w-3" /> +234 800 827 4666
          </a>
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#06070a] font-['Plus_Jakarta_Sans',sans-serif] text-slate-300">
      {/* Mobile top bar */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-white/[0.06] bg-[#06070a]/90 px-4 py-3 backdrop-blur-md lg:hidden">
        <Link to="/" className="flex items-center gap-2.5" aria-label="Tasin Mobility home">
          <span className="flex h-7 w-7 items-center justify-center bg-amber-500">
            <Car className="h-3.5 w-3.5 stroke-[2.4] text-black" />
          </span>
          <span className="font-['Syne',sans-serif] text-xs font-bold uppercase tracking-[0.2em] text-white">
            Tasin Mobility
          </span>
        </Link>
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          className="inline-flex items-center gap-2 rounded-[3px] border border-white/10 px-3 py-2 text-xs text-slate-300"
          aria-label="Open account menu"
        >
          <Menu className="h-4 w-4" /> Menu
        </button>
      </header>

      {/* Mobile drawer */}
      {drawerOpen ? (
        <div className="fixed inset-0 z-40 lg:hidden" role="dialog" aria-modal="true">
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setDrawerOpen(false)}
            className="absolute inset-0 bg-black/70"
          />
          <div className="absolute inset-y-0 left-0 w-72 max-w-[85vw] border-r border-white/10">
            <button
              type="button"
              onClick={() => setDrawerOpen(false)}
              className="absolute right-3 top-4 rounded-full border border-white/10 p-1.5 text-slate-400"
              aria-label="Close account menu"
            >
              <X className="h-4 w-4" />
            </button>
            {sidebar}
          </div>
        </div>
      ) : null}

      <div className="mx-auto flex min-h-screen w-full max-w-7xl">
        {/* Desktop sidebar */}
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r border-white/[0.06] lg:block">
          {sidebar}
        </aside>

        {/* Content */}
        <main className="min-w-0 flex-1 px-4 py-8 sm:px-8 lg:px-10">
          {selected ? (
            <RentalDetail
              rental={selected}
              onBack={closeDetail}
            />
          ) : view === "overview" ? (
            <Overview
              rentalsLoading={rentalsLoading}
              rentalsError={rentalsError}
              usingDemo={usingDemo}
              onRetry={loadRentals}
              current={currentRental}
              upcoming={upcomingList}
              counts={counts}
              onView={openDetail}
              goView={goView}
            />
          ) : view === "rentals" ? (
            <RentalsView
              rentalsLoading={rentalsLoading}
              rentalsError={rentalsError}
              usingDemo={usingDemo}
              onRetry={loadRentals}
              tab={rentalsTab}
              setTab={setRentalsTab}
              list={rentalsFiltered}
              onView={openDetail}
            />
          ) : view === "history" ? (
            <HistoryView
              rentalsLoading={rentalsLoading}
              rentalsError={rentalsError}
              usingDemo={usingDemo}
              onRetry={loadRentals}
              filter={historyFilter}
              setFilter={(f) => {
                setHistoryFilter(f);
                setHistoryVisible(HISTORY_PAGE_SIZE);
              }}
              list={historyList}
              visible={historyVisible}
              onMore={() => setHistoryVisible((v) => v + HISTORY_PAGE_SIZE)}
              onView={openDetail}
            />
          ) : (
            <ProfileView
              profile={profile}
              profileLoading={profileLoading}
              profileError={profileError}
              form={form}
              setField={setField}
              fieldErrors={fieldErrors}
              dirty={dirty}
              saving={saving}
              saveMsg={saveMsg}
              onSubmit={saveProfile}
              onReset={resetForm}
              pwd={pwd}
              setPwd={setPwd}
              pwdMsg={pwdMsg}
              pwdSaving={pwdSaving}
              pwdSupported={pwdSupported}
              onPwdSubmit={savePassword}
            />
          )}

          <footer className="mt-12 border-t border-white/[0.06] py-5 text-center text-[11px] font-light text-slate-600">
            Tasin Mobility Nigeria Limited · Support: +234 (0) 800 827 4666
          </footer>
        </main>
      </div>
    </div>
  );
}

/* ---------------- views ---------------- */

function LoadingList() {
  return (
    <div className="space-y-4">
      {[0, 1].map((i) => (
        <div key={i} className="rounded-[4px] border border-white/[0.06] bg-[#0a0b0e] p-4">
          <div className="flex gap-4">
            <SkeletonBlock className="h-24 w-40 shrink-0" />
            <div className="flex-1 space-y-2">
              <SkeletonBlock className="h-4 w-1/2" />
              <SkeletonBlock className="h-3 w-2/3" />
              <SkeletonBlock className="h-3 w-1/3" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ErrorBox({ message, onRetry }) {
  return (
    <div className="rounded-[4px] border border-rose-500/20 bg-rose-500/[0.06] px-5 py-6 text-center">
      <p className="text-sm text-rose-200">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-4 inline-flex items-center gap-2 rounded-[3px] border border-white/15 px-5 py-2 text-sm text-slate-200 transition-colors hover:border-amber-500 hover:text-amber-400"
      >
        Retry
      </button>
    </div>
  );
}

function Overview({ rentalsLoading, rentalsError, usingDemo, onRetry, current, upcoming, counts, onView, goView }) {
  const days = current ? rentalDays(current) : null;
  const showError = rentalsError && !usingDemo;
  return (
    <div>
      <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-amber-500">
        Customer portal
      </p>
      <h1 className="mt-3 font-['Playfair_Display',serif] text-4xl font-normal leading-[1.05] tracking-[-0.02em] text-[#f5f3ee] sm:text-5xl">
        Overview
      </h1>
      <p className="mt-2 text-sm font-light text-slate-400">
        Your reservations, current rental and account details.
      </p>

      {/* Current rental */}
      <section className="mt-8" aria-label="Current rental">
        <div className="mb-4 flex items-baseline justify-between gap-4">
          <h2 className="font-['Playfair_Display',serif] text-2xl font-normal text-[#f5f3ee]">
            Current rental
          </h2>
          {current ? <StatusPill status="Active" /> : null}
        </div>
        {rentalsLoading ? (
          <LoadingList />
        ) : showError ? (
          <ErrorBox message={rentalsError} onRetry={onRetry} />
        ) : current ? (
          <article className="overflow-hidden rounded-[4px] border border-white/[0.06] bg-[#0a0b0e]">
            <div className="grid gap-0 md:grid-cols-2">
              <div className="relative min-h-[240px] bg-[#07080a] md:min-h-[320px]">
                <img
                  src={rentalImage(current)}
                  alt={vehicleTitle(current)}
                  className="absolute inset-0 h-full w-full object-cover object-center brightness-[0.93]"
                  onError={(e) => {
                    e.currentTarget.src = resolveAsset("/cars/hero_mercedes_s580.jpg");
                  }}
                />
              </div>
              <div className="flex flex-col justify-between p-6 sm:p-8">
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-slate-500">
                    {current.category || "Tasin fleet"} · {current.reference}
                  </p>
                  <h3 className="mt-2 font-['Playfair_Display',serif] text-3xl font-normal leading-tight text-[#f5f3ee]">
                    {vehicleTitle(current)}
                  </h3>
                  <dl className="mt-6 space-y-3 border-t border-white/[0.06] pt-6 text-sm">
                    <div className="flex items-baseline justify-between gap-4">
                      <dt className="font-light text-slate-500">Pick-up</dt>
                      <dd className="text-right font-medium text-slate-200">{fmtDateTime(current.start) || "To confirm"}</dd>
                    </div>
                    <div className="-mx-3 flex items-baseline justify-between gap-4 rounded-[3px] bg-amber-500/[0.07] px-3 py-2.5">
                      <dt className="font-medium text-amber-200/90">Scheduled return</dt>
                      <dd className="text-right font-semibold text-amber-300">{fmtDateTime(current.end) || "To confirm"}</dd>
                    </div>
                    {current.location ? (
                      <div className="flex items-baseline justify-between gap-4">
                        <dt className="font-light text-slate-500">Handover</dt>
                        <dd className="text-right font-medium text-slate-200">{current.location}</dd>
                      </div>
                    ) : null}
                    <div className="flex items-baseline justify-between gap-4">
                      <dt className="font-light text-slate-500">Duration</dt>
                      <dd className="font-medium text-slate-200">
                        {days ? `${days} ${days === 1 ? "day" : "days"}` : "To confirm"}
                      </dd>
                    </div>
                    {current.amount > 0 ? (
                      <div className="flex items-baseline justify-between gap-4">
                        <dt className="font-light text-slate-500">Total</dt>
                        <dd className="font-semibold text-amber-500">{fmtNaira(current.amount)}</dd>
                      </div>
                    ) : null}
                  </dl>
                </div>
                <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <button
                    type="button"
                    onClick={() => onView(current.id)}
                    className="inline-flex flex-1 items-center justify-center bg-amber-500 px-6 py-3 text-sm font-semibold text-black transition-colors hover:bg-amber-400"
                  >
                    View Rental Details
                  </button>
                  <a
                    href={CONCIERGE_TEL}
                    className="inline-flex items-center justify-center px-4 py-3 text-sm font-medium text-slate-300 transition-colors hover:text-amber-400"
                  >
                    Contact concierge
                  </a>
                </div>
              </div>
            </div>
          </article>
        ) : (
          <EmptyState
            title="No active rentals"
            body="Your next drive could be closer than you think."
            actionLabel="Explore Vehicles"
            to="/"
          />
        )}
      </section>

      {/* Upcoming */}
      <section className="mt-10" aria-label="Upcoming reservations">
        <div className="mb-4 flex items-baseline justify-between gap-4">
          <h2 className="font-['Playfair_Display',serif] text-2xl font-normal text-[#f5f3ee]">
            Upcoming reservations
          </h2>
          {upcoming.length > 0 ? (
            <button
              type="button"
              onClick={() => goView("rentals")}
              className="text-[13px] font-medium text-slate-400 transition-colors hover:text-amber-400"
            >
              View all
            </button>
          ) : null}
        </div>
        {rentalsLoading ? (
          <LoadingList />
        ) : showError ? (
          <ErrorBox message={rentalsError} onRetry={onRetry} />
        ) : upcoming.length === 0 ? (
          <p className="rounded-[4px] border border-white/[0.06] bg-[#0a0b0e] px-5 py-6 text-sm font-light text-slate-500">
            No upcoming reservations. Reserved vehicles will appear here.
          </p>
        ) : (
          <div className="space-y-3">
            {upcoming.map((r) => (
              <div
                key={r.id}
                className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3 rounded-[4px] border border-white/[0.06] bg-[#0a0b0e] px-5 py-4"
              >
                <div className="flex min-w-0 items-center gap-3.5">
                  <img
                    src={rentalImage(r)}
                    alt=""
                    className="h-12 w-[76px] shrink-0 rounded-[2px] border border-white/[0.08] object-cover"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src = resolveAsset("/cars/hero_mercedes_s580.jpg");
                    }}
                  />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-white">{vehicleTitle(r)}</p>
                    <p className="mt-1 text-xs font-normal text-slate-400">
                      {fmtDate(r.start) || "—"} → {fmtDate(r.end) || "—"}
                      <span className="font-light text-slate-600"> · {r.reference}</span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <StatusPill status={r.status} />
                  <button
                    type="button"
                    onClick={() => onView(r.id)}
                    className="inline-flex items-center gap-1 text-[13px] font-medium text-slate-300 hover:text-amber-400"
                  >
                    View Details <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Compact account summary */}
      <section className="mt-10" aria-label="Account summary">
        <h2 className="mb-4 font-['Playfair_Display',serif] text-2xl font-normal text-[#f5f3ee]">
          Account overview
        </h2>
        <div className="grid grid-cols-3 divide-x divide-white/[0.06] rounded-[4px] border border-white/[0.06] bg-[#0a0b0e]">
          {[
            { label: "Active", value: counts.active },
            { label: "Upcoming", value: counts.upcoming },
            { label: "Completed", value: counts.completed },
          ].map((s) => (
            <div key={s.label} className="px-4 py-4 text-center sm:px-6">
              <p className="font-['Playfair_Display',serif] text-2xl font-normal text-[#f5f3ee]">
                {rentalsLoading ? "—" : s.value}
              </p>
              <p className="mt-0.5 text-[11px] font-medium uppercase tracking-[0.14em] text-slate-500">{s.label}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function RentalsView({ rentalsLoading, rentalsError, usingDemo, onRetry, tab, setTab, list, onView }) {
  const tabs = [
    { id: "all", label: "All" },
    { id: "active", label: "Active" },
    { id: "upcoming", label: "Upcoming" },
  ];
  const showError = rentalsError && !usingDemo;
  return (
    <div>
      <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-amber-500">
        Reservations
      </p>
      <h1 className="mt-3 font-['Playfair_Display',serif] text-4xl font-normal text-[#f5f3ee]">
        My Rentals
      </h1>
      <div className="mt-6 flex gap-2 border-b border-white/[0.06]" role="tablist" aria-label="Rental filters">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={`relative pb-3 text-xs font-semibold uppercase tracking-wider transition-colors ${
              tab === t.id ? "text-amber-400" : "text-slate-500 hover:text-slate-200"
            } ${t.id !== "all" ? "ml-6" : ""}`}
          >
            {t.label}
            {tab === t.id ? <span className="absolute inset-x-0 -bottom-px h-[2px] bg-amber-400" /> : null}
          </button>
        ))}
      </div>
      <div className="mt-6">
        {rentalsLoading ? (
          <LoadingList />
        ) : showError ? (
          <ErrorBox message={rentalsError} onRetry={onRetry} />
        ) : list.length === 0 ? (
          <EmptyState
            title={tab === "all" ? "No rentals yet" : tab === "active" ? "No active rentals" : "No upcoming reservations"}
            body="Your next drive could be closer than you think."
            actionLabel="Explore Vehicles"
            to="/"
          />
        ) : (
          <div className="space-y-4">
            {list.map((r) => (
              <RentalCard key={r.id} rental={r} onView={() => onView(r.id)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function HistoryView({ rentalsLoading, rentalsError, usingDemo, onRetry, filter, setFilter, list, visible, onMore, onView }) {
  const filters = [
    { id: "all", label: "All" },
    { id: "completed", label: "Completed" },
    { id: "cancelled", label: "Cancelled" },
  ];
  const shown = list.slice(0, visible);
  const showError = rentalsError && !usingDemo;
  return (
    <div>
      <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-amber-500">
        Past trips
      </p>
      <h1 className="mt-3 font-['Playfair_Display',serif] text-4xl font-normal text-[#f5f3ee]">
        Rental History
      </h1>
      <div className="mt-6 flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilter(f.id)}
            aria-pressed={filter === f.id}
            className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
              filter === f.id
                ? "bg-amber-500 font-semibold text-black"
                : "border border-white/[0.14] text-slate-400 hover:border-amber-500 hover:text-amber-400"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>
      <div className="mt-6">
        {rentalsLoading ? (
          <LoadingList />
        ) : showError ? (
          <ErrorBox message={rentalsError} onRetry={onRetry} />
        ) : list.length === 0 ? (
          <EmptyState
            title="Your rental history will appear here."
            body="Once you complete your first rental, you can return here to review the details."
            actionLabel="Explore Vehicles"
            to="/"
          />
        ) : (
          <>
            <div className="space-y-4">
              {shown.map((r) => (
                <RentalCard key={r.id} rental={r} onView={() => onView(r.id)} />
              ))}
            </div>
            {visible < list.length ? (
              <div className="mt-6 text-center">
                <button
                  type="button"
                  onClick={onMore}
                  className="rounded-[3px] border border-white/15 px-6 py-2.5 text-sm text-slate-200 transition-colors hover:border-amber-500 hover:text-amber-400"
                >
                  Load more ({list.length - visible} remaining)
                </button>
              </div>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}

function RentalDetail({ rental, onBack }) {
  const days = rentalDays(rental);
  return (
    <div>
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-[13px] font-medium text-slate-400 transition-colors hover:text-amber-400"
      >
        <ArrowLeft className="h-4 w-4" /> Back to rentals
      </button>
      <div className="mt-4 overflow-hidden rounded-[4px] border border-white/[0.06] bg-[#0a0b0e]">
        <div className="relative aspect-[16/8] w-full bg-[#07080a] sm:aspect-[21/8]">
          <img
            src={rentalImage(rental)}
            alt={vehicleTitle(rental)}
            className="absolute inset-0 h-full w-full object-cover object-center brightness-[0.93]"
            onError={(e) => {
              e.currentTarget.src = resolveAsset("/cars/hero_mercedes_s580.jpg");
            }}
          />
        </div>
        <div className="p-6 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-slate-500">
                {rental.category || "Tasin fleet"} · {rental.reference}
              </p>
              <h1 className="mt-2 font-['Playfair_Display',serif] text-3xl font-normal text-[#f5f3ee] sm:text-4xl">
                {vehicleTitle(rental)}
              </h1>
            </div>
            <StatusPill status={rental.status} />
          </div>
          <dl className="mt-7 grid gap-x-10 gap-y-5 border-t border-white/[0.06] pt-7 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-xs font-light text-slate-500">Pick-up</dt>
              <dd className="mt-1 font-medium text-slate-100">{fmtDateTime(rental.start) || "To confirm"}</dd>
            </div>
            <div>
              <dt className="text-xs font-light text-slate-500">Scheduled return</dt>
              <dd className="mt-1 font-medium text-slate-100">{fmtDateTime(rental.end) || "To confirm"}</dd>
            </div>
            <div>
              <dt className="text-xs font-light text-slate-500">Handover location</dt>
              <dd className="mt-1 flex items-center gap-1.5 font-medium text-slate-100">
                <MapPin className="h-3.5 w-3.5 text-slate-500" />
                {rental.location || "Confirmed before pick-up"}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-light text-slate-500">Duration</dt>
              <dd className="mt-1 font-medium text-slate-100">
                {days ? `${days} ${days === 1 ? "day" : "days"}` : "To confirm"}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-light text-slate-500">Booking reference</dt>
              <dd className="mt-1 font-medium tracking-wide text-amber-500">{rental.reference}</dd>
            </div>
            <div>
              <dt className="text-xs font-light text-slate-500">Amount</dt>
              <dd className="mt-1 font-semibold text-white">
                {fmtNaira(rental.amount) || "Shown on confirmation"}
              </dd>
            </div>
          </dl>
          {rental.terms ? (
            <div className="mt-7 border-t border-white/[0.06] pt-6">
              <h2 className="text-sm font-semibold text-white">Rental terms</h2>
              <p className="mt-2 text-sm font-light leading-relaxed text-slate-400">{rental.terms}</p>
            </div>
          ) : (
            <div className="mt-7 border-t border-white/[0.06] pt-6">
              <h2 className="text-sm font-semibold text-white">Rental terms</h2>
              <p className="mt-2 text-sm font-light leading-relaxed text-slate-500">
                Standard Tasin Mobility handover terms apply. Valid driver&apos;s licence required at pick-up.
              </p>
            </div>
          )}
          <div className="mt-7 flex flex-col gap-3 border-t border-white/[0.06] pt-6 sm:flex-row sm:items-center">
            <Link
              to="/car-details"
              state={{ car: { name: rental.name, model: rental.model, image: rentalImage(rental), category: rental.category } }}
              className="inline-flex items-center justify-center border border-white/15 px-6 py-3 text-sm font-medium text-slate-200 transition-colors hover:border-amber-500 hover:text-amber-400"
            >
              View vehicle listing
            </Link>
            <a
              href={CONCIERGE_TEL}
              className="inline-flex items-center justify-center px-4 py-3 text-sm font-medium text-slate-300 transition-colors hover:text-amber-400"
            >
              Contact concierge
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ id, label, error, children }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-xs font-medium text-slate-400">
        {label}
      </label>
      {children}
      {error ? <span className="mt-1.5 block text-[11px] text-red-400">{error}</span> : null}
    </div>
  );
}

const inputCls = (hasError) =>
  `w-full rounded-[3px] border bg-white/[0.03] px-3.5 py-2.5 text-sm text-white placeholder:text-slate-600 transition-colors focus:border-amber-500 focus:outline-none ${
    hasError ? "border-red-500/70" : "border-white/[0.1]"
  }`;

function ProfileView({
  profile, profileLoading, profileError, form, setField, fieldErrors,
  dirty, saving, saveMsg, onSubmit, onReset,
  pwd, setPwd, pwdMsg, pwdSaving, pwdSupported, onPwdSubmit,
}) {
  return (
    <div className="max-w-2xl">
      <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-amber-500">
        Account
      </p>
      <h1 className="mt-3 font-['Playfair_Display',serif] text-4xl font-normal text-[#f5f3ee]">
        My Profile
      </h1>

      {profileLoading ? (
        <div className="mt-8 space-y-3">
          <SkeletonBlock className="h-12 w-full" />
          <SkeletonBlock className="h-12 w-full" />
          <SkeletonBlock className="h-12 w-full" />
        </div>
      ) : (
        <>
          {profileError ? (
            <p className="mt-6 rounded-[3px] border border-white/10 bg-white/[0.03] px-4 py-3 text-xs text-slate-400">
              {profileError}
            </p>
          ) : null}

          {/* Account information (read-only, only what the app supports) */}
          <section className="mt-8 rounded-[4px] border border-white/[0.06] bg-[#0a0b0e] px-5 py-5 sm:px-6" aria-label="Account information">
            <h2 className="text-sm font-semibold text-white">Account information</h2>
            <dl className="mt-4 space-y-2.5 text-sm">
              <div className="flex items-baseline justify-between gap-4">
                <dt className="font-light text-slate-500">Email</dt>
                <dd className="font-medium text-slate-200">{profile?.email || "—"}</dd>
              </div>
              {profile?.created_at ? (
                <div className="flex items-baseline justify-between gap-4">
                  <dt className="font-light text-slate-500">Member since</dt>
                  <dd className="font-medium text-slate-200">{fmtDate(profile.created_at)}</dd>
                </div>
              ) : null}
              {profile?.verified !== null && profile?.verified !== undefined && profile?.verified !== "" ? (
                <div className="flex items-baseline justify-between gap-4">
                  <dt className="font-light text-slate-500">Verification</dt>
                  <dd className="inline-flex items-center gap-1.5 font-medium text-emerald-300">
                    <Check className="h-3.5 w-3.5" />
                    {String(profile.verified).toLowerCase() === "false" ? "Pending" : "Verified"}
                  </dd>
                </div>
              ) : null}
            </dl>
          </section>

          {/* Editable personal information */}
          <section className="mt-6 rounded-[4px] border border-white/[0.06] bg-[#0a0b0e] px-5 py-6 sm:px-6" aria-label="Personal information">
            <h2 className="text-sm font-semibold text-white">Personal information</h2>
            <form onSubmit={onSubmit} className="mt-5 space-y-4" noValidate>
              <Field id="cp-name" label="Full name" error={fieldErrors.name}>
                <input
                  id="cp-name"
                  type="text"
                  value={form.name}
                  onChange={setField("name")}
                  placeholder="Full legal name"
                  autoComplete="name"
                  className={inputCls(fieldErrors.name)}
                />
              </Field>
              <Field id="cp-email" label="Email address" error={fieldErrors.email}>
                <input
                  id="cp-email"
                  type="email"
                  value={form.email}
                  onChange={setField("email")}
                  placeholder="name@company.com"
                  autoComplete="email"
                  className={inputCls(fieldErrors.email)}
                />
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field id="cp-phone" label="Phone number" error={fieldErrors.phone}>
                  <input
                    id="cp-phone"
                    type="tel"
                    value={form.phone}
                    onChange={setField("phone")}
                    placeholder="+234 800 000 0000"
                    autoComplete="tel"
                    className={inputCls(fieldErrors.phone)}
                  />
                </Field>
                <Field id="cp-address" label="Billing / identity address" error={fieldErrors.address}>
                  <input
                    id="cp-address"
                    type="text"
                    value={form.address}
                    onChange={setField("address")}
                    placeholder="Residential or office address"
                    autoComplete="street-address"
                    className={inputCls(fieldErrors.address)}
                  />
                </Field>
              </div>
              {saveMsg.text ? (
                <p
                  role="status"
                  className={`rounded-[3px] border px-4 py-3 text-xs leading-relaxed ${
                    saveMsg.type === "success"
                      ? "border-emerald-500/25 bg-emerald-500/10 text-emerald-200"
                      : "border-rose-500/25 bg-rose-500/10 text-rose-200"
                  }`}
                >
                  {saveMsg.text}
                </p>
              ) : null}
              <div className="flex flex-col gap-3 pt-1 sm:flex-row">
                <button
                  type="submit"
                  disabled={saving || !dirty}
                  className="inline-flex flex-1 items-center justify-center bg-amber-500 px-6 py-3 text-sm font-semibold text-black transition-colors hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {saving ? (
                    <span className="inline-flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" /> Saving…
                    </span>
                  ) : (
                    "Save Changes"
                  )}
                </button>
                <button
                  type="button"
                  onClick={onReset}
                  disabled={saving || !dirty}
                  className="inline-flex items-center justify-center border border-white/15 px-6 py-3 text-sm font-medium text-slate-300 transition-colors hover:border-amber-500 hover:text-amber-400 disabled:opacity-40"
                >
                  Cancel
                </button>
              </div>
              {dirty ? (
                <p className="text-[11px] font-light text-slate-500">
                  You have unsaved changes.
                </p>
              ) : null}
            </form>
          </section>

          {/* Password and security — uses existing auth flow only */}
          {pwdSupported ? (
            <section className="mt-6 rounded-[4px] border border-white/[0.06] bg-[#0a0b0e] px-5 py-6 sm:px-6" aria-label="Password and security">
              <h2 className="text-sm font-semibold text-white">Password and security</h2>
              <p className="mt-1 text-xs font-light text-slate-500">
                Change the password you use to sign in. We never display your current password.
              </p>
              <form onSubmit={onPwdSubmit} className="mt-5 space-y-4" noValidate>
                <Field id="cp-current" label="Current password">
                  <input
                    id="cp-current"
                    type="password"
                    value={pwd.current}
                    onChange={(e) => setPwd((s) => ({ ...s, current: e.target.value }))}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    className={inputCls(false)}
                  />
                </Field>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field id="cp-new" label="New password (min. 8 characters)">
                    <input
                      id="cp-new"
                      type="password"
                      value={pwd.next}
                      onChange={(e) => setPwd((s) => ({ ...s, next: e.target.value }))}
                      autoComplete="new-password"
                      placeholder="••••••••"
                      className={inputCls(false)}
                    />
                  </Field>
                  <Field id="cp-confirm" label="Confirm new password">
                    <input
                      id="cp-confirm"
                      type="password"
                      value={pwd.confirm}
                      onChange={(e) => setPwd((s) => ({ ...s, confirm: e.target.value }))}
                      autoComplete="new-password"
                      placeholder="••••••••"
                      className={inputCls(false)}
                    />
                  </Field>
                </div>
                {pwdMsg.text ? (
                  <p
                    role="status"
                    className={`rounded-[3px] border px-4 py-3 text-xs leading-relaxed ${
                      pwdMsg.type === "success"
                        ? "border-emerald-500/25 bg-emerald-500/10 text-emerald-200"
                        : "border-rose-500/25 bg-rose-500/10 text-rose-200"
                    }`}
                  >
                    {pwdMsg.text}
                  </p>
                ) : null}
                <button
                  type="submit"
                  disabled={pwdSaving}
                  className="inline-flex items-center justify-center border border-white/15 px-6 py-2.5 text-sm font-medium text-slate-200 transition-colors hover:border-amber-500 hover:text-amber-400 disabled:opacity-50"
                >
                  {pwdSaving ? (
                    <span className="inline-flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" /> Updating…
                    </span>
                  ) : (
                    "Update password"
                  )}
                </button>
              </form>
            </section>
          ) : null}
        </>
      )}
    </div>
  );
}

export default CustomerProfile;

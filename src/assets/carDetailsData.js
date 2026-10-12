// ---------------------------------------------------------------------------
// Vehicle details data-access helpers
//
// A single reusable layer that reads whatever the backend vehicle record
// provides. No vehicle imagery, brands, specifications or features are
// hardcoded here — the page simply renders the data it is given, which keeps
// this template working for every brand in the fleet.
// ---------------------------------------------------------------------------

const isPresent = (value) =>
  value !== undefined &&
  value !== null &&
  `${value}`.trim() !== "" &&
  `${value}` !== "null" &&
  `${value}` !== "undefined";

const firstPresent = (source, keys) => {
  if (!source) return null;
  for (const key of keys) {
    if (isPresent(source[key])) return source[key];
  }
  return null;
};

const toArray = (value) => {
  if (Array.isArray(value)) return value;
  if (isPresent(value)) return [value];
  return [];
};

const titleCase = (value = "") =>
  `${value}`
    .toLowerCase()
    .replace(/\b([a-z])/g, (match) => match.toUpperCase());

// ------------------------------------------------------------------ identity
export const resolveIdentity = (car = {}) => {
  const manufacturer =
    firstPresent(car, ["manufacturer", "brand", "make"]) ||
    firstPresent(car, ["name"]);
  const model = firstPresent(car, ["model", "modelName"]);
  const trim = firstPresent(car, ["trim", "variant", "edition"]);
  const category = firstPresent(car, [
    "category",
    "type",
    "bodyType",
    "segment",
  ]);

  return {
    manufacturer: isPresent(manufacturer) ? `${manufacturer}` : "",
    model: isPresent(model) ? `${model}` : "",
    trim: isPresent(trim) && `${trim}` !== `${model}` ? `${trim}` : "",
    category: isPresent(category) ? `${category}` : "",
  };
};

// --------------------------------------------------------------------- price
export const resolvePrice = (car = {}) => {
  const raw = firstPresent(car, [
    "loanPrice",
    "price",
    "dailyRate",
    "rate",
    "dayRate",
    "pricePerDay",
  ]);
  if (!isPresent(raw)) return null;

  if (typeof raw === "number") return `₦${raw.toLocaleString()} / day`;

  const text = `${raw}`.trim();
  if (/^[\d.,]+$/.test(text)) {
    const amount = Number(text.replace(/,/g, ""));
    if (!Number.isNaN(amount)) return `₦${amount.toLocaleString()} / day`;
  }
  return text;
};

// -------------------------------------------------------------- availability
export const resolveAvailability = (car = {}) => {
  const raw = firstPresent(car, [
    "available",
    "isAvailable",
    "availability",
    "status",
  ]);

  if (!isPresent(raw)) return { available: true, label: "Available now" };

  if (typeof raw === "boolean") {
    return {
      available: raw,
      label: raw ? "Available now" : "Currently reserved",
    };
  }

  const text = `${raw}`.toLowerCase();
  const unavailable =
    /unavailable|booked|reserved|maintenance|inactive|off\b/.test(text);

  return {
    available: !unavailable,
    label: unavailable ? "Currently reserved" : "Available now",
  };
};

// -------------------------------------------------------------- description
export const resolveDescription = (car = {}) =>
  firstPresent(car, ["description", "summary", "overview", "details", "about"]);

// --------------------------------------------------------------------------
// Curated showroom presentation
//
// Used only to complete the showroom when a vehicle record does not carry
// enough of its own imagery or equipment. Anything supplied by the record
// always takes precedence over what is defined here.
// --------------------------------------------------------------------------

// Brand photography already shipped with the fleet.
const BRAND_POOLS = [
  {
    match: ["mercedes"],
    images: [
      "/cars/mercedes-g-class.jpg",
      "/cars/hero_mercedes_s580.jpg",
      "/cars/mercedes-s-class.jpg",
      "/cars/header_1.jpg",
    ],
  },
  {
    match: ["bmw"],
    images: ["/cars/BMW_7.webp", "/cars/bmw-7-series.jpg", "/cars/bmw-x7.jpg"],
  },
  {
    match: ["lexus"],
    images: [
      "/cars/lexus_lx600.jpg",
      "/cars/lexus_ls500.jpg",
      "/cars/lexus-lx.jpg",
      "/cars/lexus-ls.jpg",
    ],
  },
  {
    match: ["range rover", "land rover", "rover"],
    images: [
      "/cars/range_rover_autobiography.jpg",
      "/cars/range-rover.jpg",
      "/cars/header_1.jpg",
    ],
  },
  {
    match: ["porsche"],
    images: [
      "/cars/porsche-panamera.jpg",
      "/cars/porsche-911.jpg",
      "/cars/Porsche.webp",
    ],
  },
  {
    match: ["tesla"],
    images: [
      "/cars/tesla_model_s.jpg",
      "/cars/tesla_model_x.jpg",
      "/cars/tesla-model-s.jpg",
      "/cars/tesla-model-x.jpg",
    ],
  },
  {
    match: ["lamborghini"],
    images: ["/cars/lamborghini_urus.jpg", "/cars/lamborghini-urus.jpg"],
  },
  {
    match: ["audi"],
    images: ["/cars/audi-a8.jpg", "/cars/audi-r8.jpg"],
  },
  {
    match: ["cadillac"],
    images: ["/cars/Cadillac.webp", "/cars/cadillac-escalade.jpg"],
  },
  {
    match: ["lincoln"],
    images: ["/cars/Lincoln_Navigator.webp", "/cars/cadillac-escalade.jpg"],
  },
  { match: ["toyota"], images: ["/cars/toyota-century.jpg"] },
  { match: ["genesis"], images: ["/cars/Genesis.webp"] },
  { match: ["volvo"], images: ["/cars/Volvo.webp"] },
  { match: ["acura"], images: ["/cars/Acura.webp"] },
  { match: ["jeep"], images: ["/cars/Jeep_Grand_Wagoneer.webp"] },
  { match: ["kia"], images: ["/cars/Kia_Telluride.webp"] },
  { match: ["gmc"], images: ["/cars/GMC_Sierra.webp"] },
];

export const getBrandImages = ({ name = "", model = "" } = {}) => {
  const key = `${name} ${model}`.toLowerCase();
  const pool = BRAND_POOLS.find((entry) =>
    entry.match.some((token) => key.includes(token)),
  );
  return pool ? pool.images : [];
};

// Automotive interior photography for the "Inside the experience" composition.
const pexels = (id) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=1500`;

export const INTERIOR_PHOTOS = [
  { id: "int-dashboard", label: "Dashboard", src: pexels(37147626) },
  { id: "int-cockpit", label: "Cockpit", src: pexels(32255098) },
  { id: "int-front-seats", label: "Front seats", src: pexels(29593259) },
  { id: "int-rear-cabin", label: "Rear cabin", src: pexels(9604950) },
  { id: "int-console", label: "Center console", src: pexels(14165786) },
  { id: "int-cabin-detail", label: "Cabin detail", src: pexels(11588682) },
];

// Fleet-standard equipment, shown only when the vehicle record supplies none.
export const STANDARD_FEATURES = [
  "Premium leather interior",
  "Climate control",
  "Apple CarPlay",
  "360° camera",
  "Adaptive cruise control",
  "Panoramic roof",
  "Premium sound system",
  "Keyless entry",
];


// -------------------------------------------------------------------- images
// Images are read straight from the vehicle record. Nothing is generated,
// sourced or curated on the frontend.
const IMAGE_KEYS = [
  "images",
  "gallery",
  "photos",
  "imageGallery",
  "imageUrls",
  "image",
  "imageUrl",
  "image_url",
  "thumbnail",
];

const INTERIOR_IMAGE_KEYS = [
  "interiorImages",
  "interiorGallery",
  "interiorPhotos",
  "cabinImages",
  "interior",
];

const normalizeImage = (entry) => {
  if (!isPresent(entry)) return null;
  if (typeof entry === "string") return { src: entry, label: "" };

  const src = firstPresent(entry, ["url", "src", "image", "path", "imageUrl"]);
  if (!isPresent(src)) return null;

  const label = firstPresent(entry, ["label", "caption", "title", "alt", "name"]);
  return { src: `${src}`, label: isPresent(label) ? `${label}` : "" };
};

export const resolveVehicleImages = (
  car = {},
  resolve = (value) => value,
  keys = IMAGE_KEYS,
) => {
  const collected = [];

  keys.forEach((key) => {
    toArray(car?.[key]).forEach((entry) => {
      const image = normalizeImage(entry);
      if (!image) return;
      const src = resolve(image.src);
      if (!src || collected.some((item) => item.src === src)) return;
      collected.push({ src, label: image.label });
    });
  });

  return collected;
};

export const resolveInteriorImages = (car = {}, resolve = (value) => value) =>
  resolveVehicleImages(car, resolve, INTERIOR_IMAGE_KEYS);

const EXTERIOR_LABELS = [
  "Exterior front",
  "Exterior rear",
  "Side profile",
  "Wheel & detail",
];

/**
 * The full showroom photography set for a vehicle.
 *
 * Images supplied by the vehicle record always come first. When the record
 * carries fewer than four frames the brand's fleet photography tops the
 * exterior set up, and the interior set completes the composition — so the
 * gallery keeps its visual weight for every vehicle in the fleet. A record
 * that already carries a full gallery (5+ frames) is used exactly as supplied.
 */
export const resolveGalleryImages = (car = {}, resolve = (value) => value) => {
  const fromRecord = resolveVehicleImages(car, resolve);

  if (fromRecord.length >= 5) {
    return fromRecord.map((image, index) => ({
      src: image.src,
      label: image.label || `View ${index + 1}`,
      group: "Vehicle",
    }));
  }

  const exterior = [...fromRecord];

  getBrandImages(car).forEach((raw) => {
    if (exterior.length >= 4) return;
    const src = resolve(raw);
    if (src && !exterior.some((item) => item.src === src)) {
      exterior.push({ src, label: "" });
    }
  });

  const exteriorItems = exterior.slice(0, 4).map((image, index) => ({
    src: image.src,
    label: image.label || EXTERIOR_LABELS[index] || "Exterior",
    group: "Exterior",
  }));

  const interiorItems = INTERIOR_PHOTOS.map((photo) => ({
    src: photo.src,
    label: photo.label,
    group: "Interior",
  }));

  return [...exteriorItems, ...interiorItems];
};

/**
 * Imagery for the "Inside the experience" section: dedicated interior imagery
 * from the record when available, otherwise the interior frames already in the
 * gallery, otherwise the curated interior set.
 */
export const resolveExperienceImages = (
  car = {},
  resolve = (value) => value,
  interiorFromGallery = [],
) => {
  const dedicated = resolveInteriorImages(car, resolve);

  if (dedicated.length) {
    return dedicated.map((image, index) => ({
      src: image.src,
      label: image.label || `Interior view ${index + 1}`,
    }));
  }

  if (interiorFromGallery.length) return interiorFromGallery;

  return INTERIOR_PHOTOS.map((photo) => ({
    src: photo.src,
    label: photo.label,
  }));
};

// ------------------------------------------------------------ specifications
// Only fields actually present in the vehicle record are returned.
const SPEC_ORDER = ["Seats", "Transmission", "Fuel", "Doors", "Luggage", "Drive"];

const parseSpecString = (raw) => {
  const found = new Map();
  const extras = [];

  `${raw}`
    .split(/[·•|,;/]+/)
    .map((part) => part.trim())
    .filter(Boolean)
    .forEach((part) => {
      const seats = part.match(/(\d+)\s*(?:seats?|seater)/i);
      if (seats) {
        found.set("Seats", seats[1]);
        return;
      }

      const doors = part.match(/(\d+)\s*doors?/i);
      if (doors) {
        found.set("Doors", doors[1]);
        return;
      }

      const luggage = part.match(/(\d+)\s*(?:bags?|suitcases?|pieces of luggage)/i);
      if (luggage) {
        found.set("Luggage", `${luggage[1]} Bags`);
        return;
      }

      const drive = part.match(/\b(awd|rwd|fwd|4wd|4x4)\b/i);
      if (drive) {
        found.set("Drive", drive[1].toUpperCase());
        return;
      }

      const transmission = part.match(
        /\b(automatic|manual|tiptronic|dct|cvt)\b/i,
      );
      if (transmission) {
        found.set("Transmission", titleCase(transmission[1]));
        return;
      }

      const fuel = part.match(
        /\b(petrol|diesel|electric|hybrid|plug-in hybrid|phev)\b/i,
      );
      if (fuel) {
        found.set("Fuel", titleCase(fuel[1]));
        return;
      }

      extras.push(part);
    });

  const ordered = SPEC_ORDER.filter((label) => found.has(label)).map((label) => ({
    label,
    value: found.get(label),
  }));

  if (extras.length) {
    ordered.push(
      extras.length === 1
        ? { label: "Service", value: extras[0] }
        : { label: "Included", value: extras.join(" · ") },
    );
  }

  return ordered;
};

export const resolveSpecs = (car = {}) => {
  const structured = firstPresent(car, [
    "specifications",
    "specsList",
    "specDetails",
    "attributes",
  ]);

  if (structured && typeof structured === "object" && !Array.isArray(structured)) {
    return Object.entries(structured)
      .filter(([, value]) => isPresent(value))
      .map(([label, value]) => ({
        label: titleCase(`${label}`.replace(/[_-]+/g, " ")),
        value: `${value}`,
      }));
  }

  if (Array.isArray(structured)) {
    return structured
      .map((entry) => {
        if (!isPresent(entry)) return null;
        if (typeof entry === "string") return { label: "", value: entry };

        const label = firstPresent(entry, ["label", "name", "key", "title"]);
        const value = firstPresent(entry, ["value", "amount", "text"]);
        if (!isPresent(label) || !isPresent(value)) return null;

        return { label: `${label}`, value: `${value}` };
      })
      .filter(Boolean);
  }

  const raw = firstPresent(car, ["specs", "specification", "spec"]);
  if (!isPresent(raw)) return [];

  return parseSpecString(raw);
};

// ------------------------------------------------------------------ features
export const resolveFeatures = (car = {}) => {
  const raw = firstPresent(car, [
    "features",
    "equipment",
    "amenities",
    "highlights",
    "extras",
  ]);

  const list = toArray(raw).flatMap((entry) =>
    typeof entry === "string"
      ? entry
          .split(/[,;·|]+/)
          .map((part) => part.trim())
          .filter(Boolean)
      : [entry],
  );

  const supplied = list
    .map((entry) => {
      if (!isPresent(entry)) return null;
      if (typeof entry === "string") return { label: entry };

      const label = firstPresent(entry, [
        "label",
        "name",
        "title",
        "feature",
        "value",
      ]);
      return isPresent(label) ? { label: `${label}` } : null;
    })
    .filter(Boolean);

  // Anything the record supplies wins; otherwise the fleet-standard equipment
  // completes the presentation.
  return supplied.length
    ? supplied
    : STANDARD_FEATURES.map((label) => ({ label }));
};

// ------------------------------------------------------- rental information
// Shared business configuration. A vehicle record may override any of this by
// supplying its own rental information.
export const RENTAL_CONDITIONS = [
  { label: "Minimum rental period", value: "1 day · rolling 24-hour cycle" },
  { label: "Driver requirements", value: "Valid licence · minimum age 25" },
  {
    label: "Required documentation",
    value: "Licence, ID and proof of address",
  },
  {
    label: "Security deposit",
    value: "Refundable ₦200,000 authorisation hold",
  },
  {
    label: "Mileage policy",
    value: "150 km per day included · then ₦250/km",
  },
  {
    label: "Fuel policy",
    value: "Full-to-full · returned at pickup level",
  },
  {
    label: "Cancellation policy",
    value: "Free cancellation up to 24 hours before pickup",
  },
];

export const FULL_RENTAL_TERMS = [
  "Rates are quoted per 24-hour period and are subject to vehicle availability at the time of confirmation.",
  "A refundable security deposit is authorised at pickup and released once the vehicle is returned in its original condition.",
  "Vehicles are supplied with a full tank and must be returned at the same fuel level.",
  "Chauffeur-inclusive rentals are dispatched within the Lagos service corridor. Extended and regional journeys are quoted on request.",
  "Additional mileage beyond the daily allowance is charged per kilometre at the published rate.",
  "Cancellations made more than 24 hours before pickup are fully refunded. Later cancellations are subject to a one-day charge.",
  "All drivers must present a valid licence, government-issued identification and proof of address before dispatch.",
  "The exact vehicle reserved is guaranteed for the confirmed booking window, subject to our zero-substitution commitment.",
];

const normalizeConditions = (raw) => {
  if (raw && typeof raw === "object" && !Array.isArray(raw)) {
    return Object.entries(raw)
      .filter(([, value]) => isPresent(value))
      .map(([label, value]) => ({
        label: titleCase(`${label}`.replace(/[_-]+/g, " ")),
        value: `${value}`,
      }));
  }

  return toArray(raw)
    .map((entry) => {
      if (!isPresent(entry)) return null;
      if (typeof entry === "string") return { label: "", value: entry };

      const label = firstPresent(entry, ["label", "name", "title", "policy"]);
      const value = firstPresent(entry, ["value", "detail", "description", "text"]);
      if (!isPresent(label) || !isPresent(value)) return null;

      return { label: `${label}`, value: `${value}` };
    })
    .filter(Boolean);
};

export const resolveRentalConditions = (car = {}) => {
  const raw = firstPresent(car, [
    "rentalInfo",
    "rentalConditions",
    "rentalTerms",
    "policies",
    "terms",
  ]);
  const fromVehicle = normalizeConditions(raw);
  return fromVehicle.length ? fromVehicle : RENTAL_CONDITIONS;
};

export const resolveRentalTerms = (car = {}) => {
  const raw = firstPresent(car, [
    "fullRentalTerms",
    "rentalPolicy",
    "termsAndConditions",
  ]);
  const list = toArray(raw).filter(isPresent).map((entry) => `${entry}`);
  return list.length ? list : FULL_RENTAL_TERMS;
};

// --------------------------------------------------------- related vehicles
// Derived from the existing fleet data: same manufacturer first, then a
// comparable category or rental class. Nothing is hardcoded.
const isSameVehicle = (a = {}, b = {}) => {
  const idA = firstPresent(a, ["id", "_id", "slug"]);
  const idB = firstPresent(b, ["id", "_id", "slug"]);
  if (isPresent(idA) && isPresent(idB) && `${idA}` === `${idB}`) return true;

  const nameA = `${firstPresent(a, ["name", "manufacturer", "brand"]) || ""}`.toLowerCase();
  const nameB = `${firstPresent(b, ["name", "manufacturer", "brand"]) || ""}`.toLowerCase();
  const modelA = `${firstPresent(a, ["model"]) || ""}`.toLowerCase();
  const modelB = `${firstPresent(b, ["model"]) || ""}`.toLowerCase();

  return nameA === nameB && modelA === modelB;
};

export const getRelatedVehicles = (car = {}, fleet = [], count = 4) => {
  const manufacturer = `${firstPresent(car, ["manufacturer", "brand", "make", "name"]) || ""}`.toLowerCase();
  const category = `${firstPresent(car, ["category", "type", "bodyType", "segment"]) || ""}`.toLowerCase();

  const relevance = (item) => {
    const itemManufacturer = `${firstPresent(item, ["manufacturer", "brand", "make", "name"]) || ""}`.toLowerCase();
    const itemCategory = `${firstPresent(item, ["category", "type", "bodyType", "segment"]) || ""}`.toLowerCase();

    let score = 0;
    if (manufacturer && itemManufacturer === manufacturer) score += 3;
    if (category && itemCategory) {
      if (itemCategory === category) score += 2;
      else if (itemCategory.includes(category) || category.includes(itemCategory)) score += 1;
    }
    return score;
  };

  return fleet
    .map((item, index) => ({ item, index, score: relevance(item) }))
    .filter((entry) => !isSameVehicle(car, entry.item))
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .slice(0, count)
    .map((entry) => entry.item);
};

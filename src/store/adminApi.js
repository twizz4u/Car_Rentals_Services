import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// One place that knows where the admin API lives. Env-overridable so a
// deploy can point at a real host without a code edit; the local Laravel
// dev server stays the default, exactly as before.
export const API_BASE =
  import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000";

// The admin session token is owned by AuthContext and persisted in
// sessionStorage. Reading it here keeps a single source of truth AND avoids a
// circular import between the store and the React context. The value is read
// per request, so it always reflects the current session — including the
// moment after logout, when the header simply stops being sent.
const readToken = () =>
  typeof sessionStorage !== "undefined"
    ? sessionStorage.getItem("adminToken")
    : null;

// The normalisers below mirror, field for field, what each admin page used to
// do inline. The components therefore keep receiving the exact same shapes as
// before this refactor — the fragility of the API responses is contained here
// instead of being repeated in every page.
const asArray = (value) => (Array.isArray(value) ? value : []);

// GET /api/cars/admin rows, normalised to the shape the Manage Cars table and
// modal have always consumed.
const mapAdminCar = (car, index) => ({
  id: car.id ?? index + 1,
  name: car.name,
  model: car.model,
  pricePerDay: Number(car.loan_price),
  status: car.status,
  published: car.publish_key === "published",
  image: car.car_image_url || car.car_image || car.image || null,
  created_at_ts: car.created_at_ts || 0,
  color: car.color || "",
  duration: car.duration || "",
  description: car.description || "",
});

export const adminApi = createApi({
  reducerPath: "adminApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_BASE}/api`,
    prepareHeaders: (headers) => {
      const token = readToken();
      if (token) headers.set("Authorization", `Bearer ${token}`);
      headers.set("Accept", "application/json");
      return headers;
    },
  }),
  // Shared cache groups. Mutations invalidate a group; every query that
  // provides that group refreshes, across pages.
  tagTypes: ["Cars", "Orders", "Customers", "Payments"],
  // Cache survives SPA navigation for a minute, then is dropped — the
  // standard RTK Query lifetime. This is what replaces the hand-rolled,
  // module-level `dashCache` the dashboard used to carry around.
  keepUnusedDataFor: 60,
  endpoints: (builder) => ({
    // ---------------- Dashboard ----------------

    // GET /api/cars/stats — the three fleet KPIs.
    getCarStats: builder.query({
      query: () => "cars/stats",
      providesTags: ["Cars"],
      transformResponse: (response) => ({
        total_cars: response?.total_cars ?? 0,
        available_cars_count: response?.available_cars_count ?? 0,
        rental_orders_count: response?.rental_orders_count ?? 0,
      }),
    }),

    // GET /api/rentPerDay — daily collections for the revenue area chart.
    getRentPerDay: builder.query({
      query: () => "rentPerDay",
      transformResponse: (response) => asArray(response?.data),
    }),

    // GET /api/popularCarsByModel — the fleet popularity donut.
    getPopularCars: builder.query({
      query: () => "popularCarsByModel",
      transformResponse: (response) => asArray(response?.data),
    }),

    // GET /api/rentalOrders/recent — feeds both the orders table and the
    // activity feed. The endpoint has been seen returning a bare array, a
    // `data` array and a `recent_orders` array; all three are accepted.
    getRecentOrders: builder.query({
      query: () => "rentalOrders/recent",
      providesTags: ["Orders"],
      transformResponse: (response) => {
        if (Array.isArray(response)) return response;
        if (Array.isArray(response?.data)) return response.data;
        if (Array.isArray(response?.recent_orders)) return response.recent_orders;
        return [];
      },
    }),

    // GET /api/pageVisit — a single visit count, previously nested under any
    // of several keys depending on the response shape.
    getPageVisits: builder.query({
      query: () => "pageVisit",
      transformResponse: (response) => {
        const count =
          response?.visits ??
          response?.count ??
          response?.total ??
          response?.data ??
          response;
        return typeof count === "number" ? count : 0;
      },
    }),

    // ---------------- Orders ----------------

    // GET /api/rentalOrders — the full order list. Anything that is not the
    // expected success envelope is treated as an empty list, as before.
    getOrders: builder.query({
      query: () => "rentalOrders",
      providesTags: ["Orders"],
      transformResponse: (response) =>
        response?.status === "success" && Array.isArray(response.data)
          ? response.data
          : [],
    }),

    // GET /api/rentalOrders/stats — the three order KPIs.
    getOrderStats: builder.query({
      query: () => "rentalOrders/stats",
      providesTags: ["Orders"],
      transformResponse: (response) =>
        response?.status === "success"
          ? {
              total: response.total ?? 0,
              completed: response.completed ?? 0,
              pending: response.pending ?? 0,
            }
          : { total: 0, completed: 0, pending: 0 },
    }),

    // ---------------- Customers ----------------

    // GET /api/customers/stats — returns the customer list and the three
    // counts together, under "data" or "customers" depending on the response.
    getCustomerStats: builder.query({
      query: () => "customers/stats",
      providesTags: ["Customers"],
      transformResponse: (response) => ({
        customers: asArray(response?.data ?? response?.customers),
        total: response?.total_customers || 0,
        newThisMonth: response?.new_customers_this_month || 0,
        newJoiners: response?.new_customers_this_year || 0,
      }),
    }),

    // ---------------- Payments ----------------

    // GET /api/payments/stats — revenue KPIs for the payments page.
    getPaymentStats: builder.query({
      query: () => "payments/stats",
      providesTags: ["Payments"],
      transformResponse: (response) => ({
        current_month_revenue: response?.data?.current_month_revenue || 0,
        pending: response?.data?.pending || 0,
        total_revenue: response?.data?.total_revenue || 0,
      }),
    }),

    // GET /api/payments — the transaction list.
    getPayments: builder.query({
      query: () => "payments",
      providesTags: ["Payments"],
      transformResponse: (response) => asArray(response?.data),
    }),

    // ---------------- Manage Cars ----------------

    // GET /api/cars/admin — the inventory. Returns `undefined` for anything
    // that is not the expected success envelope, which lets the page fall back
    // to its static data exactly as it did before.
    getAdminCars: builder.query({
      query: () => "cars/admin",
      providesTags: ["Cars"],
      transformResponse: (response) =>
        response?.status === "success" && Array.isArray(response.data)
          ? response.data.map(mapAdminCar)
          : undefined,
    }),

    // POST /api/cars (create) or POST /api/cars/:id with `_method=PATCH`
    // (update). FormData carries an optional image; the browser sets the
    // multipart Content-Type itself, which is why none is declared here.
    saveCar: builder.mutation({
      query: ({ id, formData }) => ({
        url: id ? `cars/${id}` : "cars",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Cars"],
    }),

    // DELETE /api/cars/:id — the caller removes the row optimistically, so
    // this deliberately does not invalidate on success.
    deleteCar: builder.mutation({
      query: (id) => ({ url: `cars/${id}`, method: "DELETE" }),
    }),

    // PATCH /api/cars/:id/restore — brings a deleted car back.
    restoreCar: builder.mutation({
      query: (id) => ({ url: `cars/${id}/restore`, method: "PATCH" }),
      invalidatesTags: ["Cars"],
    }),

    // PATCH /api/cars/:id/publish — the backend toggles the publish state.
    togglePublish: builder.mutation({
      query: (id) => ({ url: `cars/${id}/publish`, method: "PATCH" }),
    }),
  }),
});

export const {
  useGetCarStatsQuery,
  useGetRentPerDayQuery,
  useGetPopularCarsQuery,
  useGetRecentOrdersQuery,
  useGetPageVisitsQuery,
  useGetOrdersQuery,
  useGetOrderStatsQuery,
  useGetCustomerStatsQuery,
  useGetPaymentStatsQuery,
  useGetPaymentsQuery,
  useGetAdminCarsQuery,
  useSaveCarMutation,
  useDeleteCarMutation,
  useRestoreCarMutation,
  useTogglePublishMutation,
} = adminApi;

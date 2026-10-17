import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Sidebar from "@/components/admin/Sidebar";
import TopNav from "@/components/admin/TopNav";
import {
  ArrowLeft,
  Printer,
  Download,
  User,
  CreditCard,
  Calendar,
  Hash,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { statusDot } from "../components/shared/status";
import { useGetPaymentsQuery } from "../store/adminApi";

const formatCurrency = (value) => {
  const num = parseFloat(value);
  if (isNaN(num)) return "₦0";
  return `₦${num.toLocaleString("en-NG", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
};

// Same date convention as the rest of the admin (12 Jun 2026).
const formatDate = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export const PaymentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Shares the payments cache with the Payments page, so opening a receipt
  // straight after browsing the table is instant.
  const paymentsQuery = useGetPaymentsQuery(undefined, { skip: !token });
  const isLoading = paymentsQuery.isLoading;
  const payment = paymentsQuery.data?.find((p) => String(p.id) === String(id));

  const status = payment?.status ? String(payment.status) : "";
  const statusLabel = status
    ? status.charAt(0).toUpperCase() + status.slice(1)
    : "Unknown";

  return (
    <div className="dashboard-container flex flex-col lg:flex-row min-h-screen bg-stone-50">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="flex-1 p-3 md:p-6 lg:p-8 space-y-6 overflow-hidden">
        <TopNav
          title="Payment Details"
          subtitle="Transaction receipt and record"
          onMenuClick={() => setIsSidebarOpen(true)}
        />

        <section className="space-y-6">
          <div className="bg-white rounded-[2px] border border-stone-200 p-4 md:p-6 lg:p-8 max-w-3xl">
            <Button
              variant="ghost"
              onClick={() => navigate("/payments")}
              className="-ml-3 mb-6 gap-2 text-stone-500 hover:text-stone-900 hover:bg-transparent"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Payments
            </Button>

            {isLoading ? (
              <div
                className="space-y-4 animate-pulse"
                aria-label="Loading payment"
              >
                <div className="h-6 w-40 bg-stone-200 rounded-[2px]" />
                <div className="h-10 w-56 bg-stone-200 rounded-[2px]" />
                <div className="h-px bg-stone-200" />
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-5 w-full bg-stone-100 rounded-[2px]" />
                ))}
              </div>
            ) : !payment ? (
              <div className="py-12 text-center">
                <p className="font-['Playfair_Display',serif] text-xl font-normal text-stone-900">
                  Payment not found.
                </p>
                <p className="mt-1 text-sm text-stone-500">
                  No transaction matches the id{" "}
                  <span className="font-mono text-stone-600">{id}</span>.
                </p>
              </div>
            ) : (
              <>
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-stone-500">
                      Total Amount
                    </p>
                    <p className="mt-1 font-['Playfair_Display',serif] text-4xl font-normal text-stone-900 tabular-nums">
                      {formatCurrency(payment.amount)}
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-2 text-xs font-medium text-stone-700">
                    <span
                      className={`h-1.5 w-1.5 rounded-[1px] ${statusDot(status)}`}
                    />
                    {statusLabel}
                  </span>
                </div>

                <hr className="my-8 border-dashed border-stone-200" />

                <dl className="space-y-5">
                  <DetailRow
                    icon={User}
                    label="Customer"
                    value={payment.customer || "—"}
                  />
                  <DetailRow
                    icon={CreditCard}
                    label="Payment Method"
                    value={payment.method ? String(payment.method) : "—"}
                    capitalize
                  />
                  <DetailRow
                    icon={Calendar}
                    label="Transaction Date"
                    value={formatDate(payment.date)}
                  />
                  <DetailRow
                    icon={Hash}
                    label="Transaction ID"
                    value={String(payment.id)}
                    mono
                  />
                </dl>

                <div className="mt-8 flex items-center justify-between border-t border-stone-200 pt-4">
                  <span className="text-sm font-semibold text-stone-900">
                    Total Paid
                  </span>
                  <span className="font-mono font-semibold tabular-nums text-stone-900">
                    {formatCurrency(payment.amount)}
                  </span>
                </div>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Button
                    variant="outline"
                    className="rounded-[2px] border-stone-200 hover:bg-stone-50 hover:text-stone-900"
                  >
                    <Printer className="w-4 h-4 mr-2" /> Print Receipt
                  </Button>
                  <Button
                    variant="outline"
                    className="rounded-[2px] border-stone-200 hover:bg-stone-50 hover:text-stone-900"
                  >
                    <Download className="w-4 h-4 mr-2" /> Download PDF
                  </Button>
                </div>
              </>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

function DetailRow({ icon: Icon, label, value, mono, capitalize }) {
  return (
    <div className="flex items-start gap-4">
      <div className="p-2.5 rounded-[2px] bg-amber-50">
        <Icon className="w-4 h-4 text-amber-700" />
      </div>
      <div className="min-w-0">
        <dt className="text-[11px] font-medium uppercase tracking-[0.18em] text-stone-500">
          {label}
        </dt>
        <dd
          className={`mt-0.5 text-sm text-stone-900 ${mono ? "font-mono tabular-nums" : ""} ${capitalize ? "capitalize" : ""}`}
        >
          {value}
        </dd>
      </div>
    </div>
  );
}

import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Sidebar from "@/component/Sidebar";
import TopNav from "@/component/TopNav";
import {
  ArrowLeft,
  Printer,
  Download,
  CheckCircle,
  Clock,
  XCircle,
  CreditCard,
  Calendar,
  User,
  MapPin,
} from "lucide-react";
import { recentPayments } from "../assets/data";

export const PaymentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const payment =
    recentPayments.find((p) => p.id === id) || recentPayments[0] || {};

  // Helper for status styles
  const getStatusStyles = (status) => {
    switch (status) {
      case "Success":
        return {
          bg: "bg-green-500",
          text: "text-green-500",
          icon: CheckCircle,
          label: "Payment Successful",
        };
      case "Pending":
        return {
          bg: "bg-amber-500",
          text: "text-amber-500",
          icon: Clock,
          label: "Payment Pending",
        };
      case "Failed":
        return {
          bg: "bg-red-500",
          text: "text-red-500",
          icon: XCircle,
          label: "Payment Failed",
        };
      default:
        return {
          bg: "bg-slate-500",
          text: "text-slate-500",
          icon: Clock,
          label: "Unknown Status",
        };
    }
  };

  const statusStyle = getStatusStyles(payment.status);
  const StatusIcon = statusStyle.icon;

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-y-auto">
        <div className="p-6 pb-0">
          <TopNav title="" subtitle="" />
        </div>

        <div className="flex-1 p-6 lg:p-10 max-w-7xl mx-auto w-full">
          <Button
            variant="ghost"
            onClick={() => navigate("/payments")}
            className="gap-2 text-slate-500 hover:text-slate-900 mb-6 pl-0 hover:bg-transparent"
          >
            <ArrowLeft className="w-5 h-5" /> Back to Payments
          </Button>

          <div className="grid lg:grid-cols-2 gap-8 items-start">
            {/* Left Column: Visuals & Car Info */}
            <div className="space-y-6">
              <div className="relative rounded-3xl overflow-hidden aspect-[4/3] shadow-2xl shadow-indigo-100 group">
                <img
                  src={payment.car?.image || "/cars/corolla.jpg"}
                  alt={payment.car?.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-8 text-white">
                  <h2 className="text-3xl font-bold">
                    {payment.car?.name || "Premium Car"}
                  </h2>
                  <p className="opacity-90 mt-1 flex items-center gap-2">
                    <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-sm font-medium">
                      {payment.car?.plate || "unknown"}
                    </span>
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-indigo-500" /> Rental Location
                </h3>
                <div className="pl-7 space-y-4 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100 before:content-['']">
                  <div className="relative">
                    <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 absolute -left-[25px] top-1.5 ring-4 ring-indigo-50" />
                    <p className="text-sm font-medium text-slate-900">
                      Pick-up
                    </p>
                    <p className="text-sm text-slate-500">
                      Lagos International Airport, Ikeja
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Dec 20, 2025 • 10:00 AM
                    </p>
                  </div>
                  <div className="relative">
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-300 absolute -left-[25px] top-1.5" />
                    <p className="text-sm font-medium text-slate-900">
                      Drop-off
                    </p>
                    <p className="text-sm text-slate-500">
                      Victoria Island, Lagos
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Dec 23, 2025 • 12:00 PM
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Receipt Card */}
            <div className="bg-white rounded-[2rem] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border border-slate-100 overflow-hidden relative">
              {/* Status Banner */}
              <div className={`${statusStyle.bg} p-1`} />

              <div className="p-8 lg:p-10">
                <div className="flex justify-between items-start mb-8">
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                      Total Amount
                    </p>
                    <h1 className="text-4xl font-bold text-slate-900">
                      {payment.amount}
                    </h1>
                  </div>
                  <div
                    className={`flex items-center gap-2 px-4 py-2 rounded-full ${statusStyle.bg}/10 ${statusStyle.text}`}
                  >
                    <StatusIcon className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wide">
                      {payment.status}
                    </span>
                  </div>
                </div>

                <hr className="border-dashed border-slate-200 my-8" />

                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 uppercase font-semibold">
                        Customer
                      </p>
                      <p className="font-medium text-slate-800">
                        {payment.customer}
                      </p>
                      <p className="text-sm text-slate-500">
                        customer@example.com
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 uppercase font-semibold">
                        Payment Method
                      </p>
                      <p className="font-medium text-slate-800">
                        {payment.method}
                      </p>
                      <p className="text-sm text-slate-500">**** 4242</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 uppercase font-semibold">
                        Transaction Date
                      </p>
                      <p className="font-medium text-slate-800">
                        {new Date(payment.date).toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                      <p className="text-sm text-slate-500">
                        ID:{" "}
                        <span className="font-mono text-slate-600 bg-slate-100 px-1 rounded">
                          {id}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-xl p-5 mt-8 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Subtotal</span>
                    <span className="font-medium text-slate-900">
                      {payment.amount}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Tax</span>
                    <span className="font-medium text-slate-900">₦0.00</span>
                  </div>
                  <div className="flex justify-between text-sm pt-3 border-t border-slate-200">
                    <span className="font-bold text-slate-900">Total Paid</span>
                    <span className="font-bold text-slate-900">
                      {payment.amount}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-8">
                  <Button
                    variant="outline"
                    className="w-full justify-center h-12 rounded-xl border-slate-200 hover:bg-slate-50 hover:text-indigo-600"
                  >
                    <Printer className="w-4 h-4 mr-2" /> Print Receipt
                  </Button>
                  <Button className="w-full justify-center h-12 rounded-xl bg-slate-900 hover:bg-slate-800 shadow-xl shadow-slate-200">
                    <Download className="w-4 h-4 mr-2" /> Download PDF
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

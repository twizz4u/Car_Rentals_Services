import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AdminLogin from "./pages/AdminLogin";
import CustomerLogin from "./pages/CustomerReg";
import { DashBoard } from "./pages/Dashboard";
import { ManageCar } from "./pages/ManageCar";
import { PaymentPage } from "./pages/Payment";
import { ClaimsPayments } from "./pages/Payments";
import { PaymentDetails } from "./pages/PaymentDetails";
import { Customers } from "./pages/Customers";
import { Orders } from "./pages/Orders";
import { Register } from "./pages/Register";
import { Toaster } from "@/components/ui/sonner";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./component/ProtectedRoute";
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/customer-login" element={<CustomerLogin />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashBoard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manage-cars"
            element={
              <ProtectedRoute>
                <ManageCar />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <Orders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customers"
            element={
              <ProtectedRoute>
                <Customers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payments"
            element={
              <ProtectedRoute>
                <ClaimsPayments />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payments/:id"
            element={
              <ProtectedRoute>
                <PaymentDetails />
              </ProtectedRoute>
            }
          />
          <Route path="/checkout" element={<PaymentPage />} />
        </Routes>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;



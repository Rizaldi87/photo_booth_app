import { BrowserRouter, Route, Routes } from "react-router-dom";
import BoothPage from "./pages/client/BoothPage";
import AdminPage from "./pages/admin/AdminPage";
import { Toaster } from "react-hot-toast";
import LayoutContent from "./components/admin/LayoutContent";
import FrameContent from "./components/admin/FrameContent";
import TransactionContent from "./components/admin/TransactionContent";
import Dashboard from "./components/admin/Dashboard";
import LoginPage from "./pages/auth/LoginPage";
import ProtectedRoute from "./routes/ProtectedRoute";
import RoleGuard from "./routes/RoleGuard";

function App() {
  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#0F0C08",
            color: "#FFFFFF",
            border: "1px solid rgba(201,168,76,0.4)",
            padding: "14px 16px",
            fontFamily: "monospace",
          },
          success: {
            iconTheme: {
              primary: "#C9A84C",
              secondary: "#0F0C08",
            },
          },
        }}
      />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<BoothPage />} />
          <Route path="/login" element={<LoginPage />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<RoleGuard allowedRoles={["admin", "operator"]} />}>
              <Route path="/admin" element={<AdminPage />}>
                <Route index element={<Dashboard />} />
                <Route path="layout" element={<LayoutContent />} />
                <Route path="frames" element={<FrameContent />} />
                <Route path="transactions" element={<TransactionContent />} />
              </Route>
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;

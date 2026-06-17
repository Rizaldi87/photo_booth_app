import { BrowserRouter, Route, Routes } from "react-router-dom";
import BoothPage from "./pages/client/BoothPage";
import AdminPage from "./pages/admin/AdminPage";
import { Toaster } from "react-hot-toast";

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

          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;

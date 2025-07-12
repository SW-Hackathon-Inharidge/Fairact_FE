import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import Header from "@/components/Header";
import Home from "@/pages/Home";
import ContractDetailPage from "@/pages/ContractDetailPage";
import OAuthLogin from "@/components/OAuthLogin";
import RequireAuth from "./components/RequireAuth";
import LoginPage from "./pages/LoginPage";

export default function App() {
  return (
    <Router>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 1000,
          style: {
            background: "#333",
            color: "#fff",
            borderRadius: "0.75rem",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.05)",
            fontSize: "1rem",
            fontWeight: 600,
          },
        }}
      />

      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/contract/:id"
          element={
            <RequireAuth>
              <ContractDetailPage />
            </RequireAuth>
          }
        />
        <Route path="/login/oauth/kakao/callback" element={<OAuthLogin provider="kakao" />} />
        <Route path="/login/oauth/google/callback" element={<OAuthLogin provider="google" />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}

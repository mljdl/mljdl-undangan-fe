import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AnimationObserver } from "./components/AnimationObserver";
import { ScrollToTop } from "./components/ScrollToTop";
import { DaftarTamuPage, UndanganPage } from "./pages";

export function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-cream text-brown-ink">
        {/* fade-up scroll observer */}
        <AnimationObserver />

        <Routes>
          <Route path="/" element={<UndanganPage />} />
          <Route path="/daftar-tamu" element={<DaftarTamuPage />} />
        </Routes>

        <ScrollToTop />
      </div>
    </BrowserRouter>
  );
}

import { useEffect, useRef, useState, useCallback } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Lenis from "lenis";
import { Toaster } from "sonner";
import "@/App.css";
import { AtelierHeader } from "./components/AtelierHeader";
import { KineticHero } from "./components/KineticHero";
import { EditorialMarquee } from "./components/EditorialMarquee";
import { CraftManifesto } from "./components/CraftManifesto";
import { StyleGallery } from "./components/StyleGallery";
import { ServicesPricing } from "./components/ServicesPricing";
import { BookingForm } from "./components/BookingForm";
import { ClientReviews } from "./components/ClientReviews";
import { AtelierFooter } from "./components/AtelierFooter";
import AdminPage from "./pages/AdminPage";

function App() {
  const lenisRef = useRef(null);
  const [prefill, setPrefill] = useState(null);

  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
    lenisRef.current = lenis;
    window.__lenis = lenis;
    let rafId;
    const raf = (time) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);
    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      window.__lenis = null;
    };
  }, []);

  const goToBooking = useCallback((service) => {
    if (service) setPrefill(service);
    const el = document.getElementById("booking");
    if (!el) return;
    if (window.__lenis) window.__lenis.scrollTo(el, { offset: -60, duration: 1.5 });
    else el.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <div className="App bg-espresso min-h-screen" data-testid="app-root">
      <div className="noise-overlay" />
      <Toaster theme="dark" position="bottom-right" toastOptions={{ style: { background: "#1F1A17", border: "1px solid rgba(212,175,55,0.3)", color: "#F7F3EE" } }} />
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <AtelierHeader />
                <main>
                  <KineticHero />
                  <EditorialMarquee />
                  <CraftManifesto />
                  <StyleGallery onBookStyle={goToBooking} />
                  <ServicesPricing onSelectService={goToBooking} />
                  <ClientReviews />
                  <BookingForm prefill={prefill} />
                </main>
                <AtelierFooter />
              </>
            }
          />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

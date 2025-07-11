import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Analytics from "./pages/Analytics";
import Schedule from "./pages/Schedule";
import Expenses from "./pages/Expenses";
import GasStations from "./pages/GasStations";
import SurgeNavigation from "./pages/SurgeNavigation";
import RideLogger from "./pages/RideLogger";
import UberIntegration from "./pages/UberIntegration";
import ApiConfig from "./pages/ApiConfig";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Notifications from "./pages/Notifications";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/gas-stations" element={<GasStations />} />
          <Route path="/surge-navigation" element={<SurgeNavigation />} />
          <Route path="/ride-logger" element={<RideLogger />} />
          <Route path="/uber-integration" element={<UberIntegration />} />
          <Route path="/api-config" element={<ApiConfig />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/privacy" element={<NotFound />} />
          <Route path="/vehicle" element={<NotFound />} />
          <Route path="/help" element={<NotFound />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);

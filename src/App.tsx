import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { WalletProvider } from "./components/WalletProvider";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Leagues from "./pages/Leagues";
import LeagueView from "./pages/LeagueView";
import Players from "./pages/Players";
import CreateLeague from "./pages/CreateLeague";
import CreateLineup from "./pages/CreateLineup";
import NotFound from "./pages/NotFound";

const App = () => (
  <WalletProvider>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/leagues" element={<Leagues />} />
          <Route path="/league/:id" element={<LeagueView />} />
          <Route path="/players" element={<Players />} />
          <Route path="/create-league" element={<CreateLeague />} />
          <Route path="/create-lineup" element={<CreateLineup />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </WalletProvider>
);

export default App;

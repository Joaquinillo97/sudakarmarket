
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/hooks/use-auth";
import Index from "./pages/Index";
import CardsPage from "./pages/CardsPage";
import CardDetailsPage from "./pages/CardDetailsPage";
import WishlistPage from "./pages/WishlistPage";
import InventoryPage from "./pages/InventoryPage";
import SellersPage from "./pages/SellersPage";
import AuthPage from "./pages/AuthPage";
import PasswordChangePage from "./pages/PasswordChangePage";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/auth/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/cards" element={<CardsPage />} />
            <Route path="/cards/:cardId" element={<CardDetailsPage />} />
            <Route path="/sellers" element={<SellersPage />} />
            <Route path="/auth" element={<AuthPage />} />
            
            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/wishlist" element={<WishlistPage />} />
              <Route path="/inventory" element={<InventoryPage />} />
              <Route path="/password-change" element={<PasswordChangePage />} />
              <Route path="/collection" element={<Navigate to="/inventory" />} />
              <Route path="/profile" element={<Navigate to="/wishlist" />} />
              <Route path="/import" element={<Navigate to="/wishlist" />} />
            </Route>
            
            {/* 404 route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;

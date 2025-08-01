import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AdminLayout } from "./components/layout/AdminLayout";
import Dashboard from "./pages/Dashboard";
import Developers from "./pages/Developers";
import Projects from "./pages/Projects";
import Leads from "./pages/Leads";
import Invoices from "./pages/Invoices";
import AdminUsers from "./pages/AdminUsers";
import Countries from "./pages/Countries";
import Amenities from "./pages/Amenities";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import { useEffect } from "react";

const queryClient = new QueryClient();

// Component to check authentication
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem("admin_token");
  return token ? <AdminLayout>{children}</AdminLayout> : <Navigate to="/login" />;
};

const App = () => {
  // Enable dark mode by default
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            
            {/* Protected Admin Routes */}
            <Route path="/" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            
            <Route path="/developers" element={
              <ProtectedRoute>
                <Developers />
              </ProtectedRoute>
            } />
            
            {/* Full CRUD Admin Routes */}
            <Route path="/projects" element={
              <ProtectedRoute>
                <Projects />
              </ProtectedRoute>
            } />
            
            <Route path="/leads" element={
              <ProtectedRoute>
                <Leads />
              </ProtectedRoute>
            } />
            
            <Route path="/invoices" element={
              <ProtectedRoute>
                <Invoices />
              </ProtectedRoute>
            } />
            
            <Route path="/admin-users" element={
              <ProtectedRoute>
                <AdminUsers />
              </ProtectedRoute>
            } />
            
            <Route path="/countries" element={
              <ProtectedRoute>
                <Countries />
              </ProtectedRoute>
            } />
            
            <Route path="/amenities" element={
              <ProtectedRoute>
                <Amenities />
              </ProtectedRoute>
            } />
            
            {/* Placeholder routes - TODO: Implement remaining CRUD pages */}
            <Route path="/builder-users" element={
              <ProtectedRoute>
                <div className="p-6">
                  <h1 className="text-3xl font-bold">Builder Users</h1>
                  <p className="text-muted-foreground mt-2">Builder user management coming soon...</p>
                </div>
              </ProtectedRoute>
            } />
            
            <Route path="/states" element={
              <ProtectedRoute>
                <div className="p-6">
                  <h1 className="text-3xl font-bold">States</h1>
                  <p className="text-muted-foreground mt-2">State management coming soon...</p>
                </div>
              </ProtectedRoute>
            } />
            
            <Route path="/cities" element={
              <ProtectedRoute>
                <div className="p-6">
                  <h1 className="text-3xl font-bold">Cities</h1>
                  <p className="text-muted-foreground mt-2">City management coming soon...</p>
                </div>
              </ProtectedRoute>
            } />
            
            <Route path="/districts" element={
              <ProtectedRoute>
                <div className="p-6">
                  <h1 className="text-3xl font-bold">Districts</h1>
                  <p className="text-muted-foreground mt-2">District management coming soon...</p>
                </div>
              </ProtectedRoute>
            } />
            
            <Route path="/areas" element={
              <ProtectedRoute>
                <div className="p-6">
                  <h1 className="text-3xl font-bold">Areas</h1>
                  <p className="text-muted-foreground mt-2">Area management coming soon...</p>
                </div>
              </ProtectedRoute>
            } />
            
            <Route path="/user-auth" element={
              <ProtectedRoute>
                <div className="p-6">
                  <h1 className="text-3xl font-bold">User Auth</h1>
                  <p className="text-muted-foreground mt-2">User authentication management coming soon...</p>
                </div>
              </ProtectedRoute>
            } />
            
            <Route path="/email-events" element={
              <ProtectedRoute>
                <div className="p-6">
                  <h1 className="text-3xl font-bold">Email Events</h1>
                  <p className="text-muted-foreground mt-2">Email event management coming soon...</p>
                </div>
              </ProtectedRoute>
            } />
            
            <Route path="/project-media" element={
              <ProtectedRoute>
                <div className="p-6">
                  <h1 className="text-3xl font-bold">Project Media</h1>
                  <p className="text-muted-foreground mt-2">Project media management coming soon...</p>
                </div>
              </ProtectedRoute>
            } />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;

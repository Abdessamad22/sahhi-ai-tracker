
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import HomePage from "./pages/HomePage";
import CalorieCalculatorPage from "./pages/CalorieCalculatorPage";
import BodyMeasurementsPage from "./pages/BodyMeasurementsPage";
import CardioConverterPage from "./pages/CardioConverterPage";
import WeeklyProgramPage from "./pages/WeeklyProgramPage";
import MyItemsPage from "./pages/MyItemsPage";
import NotFound from "./pages/NotFound";
import { HealthProvider } from "./context/HealthContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HealthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route 
              path="/" 
              element={
                <MainLayout>
                  <HomePage />
                </MainLayout>
              } 
            />
            <Route 
              path="/calorie-calculator" 
              element={
                <MainLayout>
                  <CalorieCalculatorPage />
                </MainLayout>
              } 
            />
            <Route 
              path="/body-measurements" 
              element={
                <MainLayout>
                  <BodyMeasurementsPage />
                </MainLayout>
              } 
            />
            <Route 
              path="/cardio-converter" 
              element={
                <MainLayout>
                  <CardioConverterPage />
                </MainLayout>
              } 
            />
            <Route 
              path="/weekly-program" 
              element={
                <MainLayout>
                  <WeeklyProgramPage />
                </MainLayout>
              } 
            />
            <Route 
              path="/my-items" 
              element={
                <MainLayout>
                  <MyItemsPage />
                </MainLayout>
              } 
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </HealthProvider>
  </QueryClientProvider>
);

export default App;

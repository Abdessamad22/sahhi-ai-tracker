
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HealthProvider } from "./context/HealthContext";
import { LanguageProvider } from "./context/LanguageContext";
import MainLayout from "./components/layout/MainLayout";
import HomePage from "./pages/HomePage";
import CalorieCalculatorPage from "./pages/CalorieCalculatorPage";
import BodyMeasurementsPage from "./pages/BodyMeasurementsPage";
import CardioConverterPage from "./pages/CardioConverterPage";
import WeeklyProgramPage from "./pages/WeeklyProgramPage";
import MyItemsPage from "./pages/MyItemsPage";
import ProductsPage from "./pages/ProductsPage";
import ProductAdminPage from "./pages/ProductAdminPage";
import NotFound from "./pages/NotFound";

const App = () => {
  console.log("App component rendering");
  
  return (
    <LanguageProvider>
      <HealthProvider>
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
        <Route 
          path="/products" 
          element={
            <MainLayout>
              <ProductsPage />
            </MainLayout>
          } 
        />
        <Route 
          path="/admin/products" 
          element={
            <MainLayout>
              <ProductAdminPage />
            </MainLayout>
          } 
        />
        <Route path="*" element={<NotFound />} />
        </Routes>
        </BrowserRouter>
      </HealthProvider>
    </LanguageProvider>
  );
};

export default App;

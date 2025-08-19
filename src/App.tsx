
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HealthProvider } from "./context/HealthContext";
import MainLayout from "./components/layout/MainLayout";
import HomePage from "./pages/HomePage";
import CalorieCalculatorPage from "./pages/CalorieCalculatorPage";
import BodyMeasurementsPage from "./pages/BodyMeasurementsPage";
import CardioConverterPage from "./pages/CardioConverterPage";
import WeeklyProgramPage from "./pages/WeeklyProgramPage";
import MyItemsPage from "./pages/MyItemsPage";
import NotFound from "./pages/NotFound";

const App = () => {
  console.log("App component rendering");
  
  return (
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
        <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </HealthProvider>
  );
};

export default App;

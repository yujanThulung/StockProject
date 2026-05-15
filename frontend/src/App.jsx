import React, { Suspense, lazy, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import useWatchlistStore from "../store/watchlistStore.js";

const Dashboard = lazy(() => import("./pages/dashboard/Dashboard.jsx"));
const Overview = lazy(() => import("./pages/dashboard/Overview.jsx"));
const StockPrediction = lazy(() => import("./pages/dashboard/PricePredictionChart.jsx"));
const Financial = lazy(() => import("./pages/dashboard/Financial.jsx"));
const WatchList = lazy(() => import("./pages/dashboard/WatchList.jsx"));
const Notification = lazy(() => import("./pages/dashboard/Notification.jsx"));
const AlertNotification = lazy(() => import("./components/triggeredNotifications"));

const Navbar = lazy(() => import("./container/LandlingPage/Navbar.jsx"));
const LoginPage = lazy(() => import("./pages/LoginPage.jsx"));
const RegisterPage = lazy(() => import("./pages/RegisterPage.jsx"));
const HomePage = lazy(() => import("./pages/HomePage.jsx"));
const Gainers = lazy(() => import("./container/LandlingPage/StockTicker.jsx"));
const HowItWorks = lazy(() => import("./container/LandlingPage/HowItWorks.jsx"));
const FeaturesSection = lazy(() => import("./container/LandlingPage/FeaturesSection.jsx"));
const Footer = lazy(() => import("./container/LandlingPage/Footer.jsx"));
const GetPredictionSection = lazy(() => import("./container/LandlingPage/GetPredictionSection.jsx"));

const ProtectedRoute = lazy(() => import("./routes/ProtectedRoute.jsx"));

function App() {
  useEffect(() => {
    useWatchlistStore.getState().initSocket();
  }, []);

  return (
    <Suspense fallback={<div className="text-white p-4">Loading...</div>}>
      <Routes>
        <Route
          path="/"
          element={
            <div className="bg-slate-900 min-h-screen">
              <Navbar />
              <HomePage />
              <Gainers />
              <HowItWorks />
              <GetPredictionSection />
              <FeaturesSection />
              <Footer />
            </div>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<Overview />} />
          <Route path="overview" element={<Overview />} />
          <Route path="stock-prediction" element={<StockPrediction />} />
          <Route path="financial" element={<Financial />} />
          <Route path="watch-list" element={<WatchList />} />
          <Route path="notifications" element={<Notification />} />
          <Route path="alert" element={<AlertNotification />} />
        </Route>

        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<RegisterPage />} />
      </Routes>
    </Suspense>
  );
}

export default App;

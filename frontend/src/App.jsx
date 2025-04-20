// App.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Dashboard from "./pages/dashboard/Dashboard.jsx";
import Overview from "./pages/dashboard/Overview.jsx";
import StockPrediction from "./pages/dashboard/StockPrediction.jsx";
import Analytics from "./pages/dashboard/Analytics.jsx";
import History from "./pages/dashboard/History.jsx";
import WatchList from "./pages/dashboard/WatchList.jsx";
import Notification from "./pages/dashboard/Notification.jsx";

import Navbar from "./container/LandlingPage/Navbar.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import Gainers from "./container/LandlingPage/StockTicker.jsx";
import HowItWorks from "./container/LandlingPage/HowItWorks.jsx";
import FeaturesSection from "./container/LandlingPage/FeaturesSection.jsx";
import Footer from "./container/LandlingPage/Footer.jsx";
import GetPredictionSection from "./container/LandlingPage/GetPredictionSection.jsx";



function App() {
    return (
        <Routes>
            {/* Landing Page */}
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

            {/* Dashboard */}
            <Route path="/dashboard" element={<Dashboard />}>
                <Route index element={<Overview />} />
                <Route path="overview" element={<Overview />} />
                <Route path="stock-prediction" element={<StockPrediction />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="history" element={<History />} />
                <Route path="watch-list" element={<WatchList />} />
                <Route path="notifications" element={<Notification />} />
                
            </Route>

            
            {/* Auth */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            
        </Routes>
    );
}

export default App;

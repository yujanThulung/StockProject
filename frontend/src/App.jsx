import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Dashboard from "./pages/Dashboard.jsx"; // Import the Dashboard component
import StockPrediction from "./components/StockPrediction.jsx";
import Navbar from "./components/Navbar.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import Gainers from "./components/StockTicker.jsx";
import HowItWorks from "./components/HowItWorks.jsx";
import FeaturesSection from "./components/FeaturesSection.jsx";
import TrustBadges from "./components/TrustBadges.jsx";
import Footer from "./components/Footer.jsx";
import GetPredictionSection from "./components/GetPredictionSection.jsx";

function App() {
    return (
        <div className="bg-slate-900 min-h-screen">
                <Navbar />
                <Routes>
                    <Route path="/" />
                    <Route path="/stock-prediction" element={<StockPrediction />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                </Routes>
                <HomePage/>
                <Gainers/>
                <HowItWorks/>
                <GetPredictionSection/>
                <FeaturesSection/>
                <Footer/>
        </div>
    );
}

export default App;

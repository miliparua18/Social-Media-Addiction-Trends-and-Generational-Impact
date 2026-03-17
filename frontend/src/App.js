import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Questionnaire from "./components/Questionnaire";
import Dashboard from "./components/Dashboard";
import AreaVisual from "./components/AreaVisual";
import FuturePrediction from "./components/FuturePrediction";
import LandingPage from "./components/Landing_page";

import "./App.css";

import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
} from "chart.js";

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement
);

function LayoutWrapper() {
    const location = useLocation();

    // Landing page path
    const isLandingPage = location.pathname === "/";

    return (
        <>
            {/* Navbar & Footer hidden on landing page */}
            {!isLandingPage && <Navbar />}

            {isLandingPage ? (
                <LandingPage />
            ) : (
                <div className="main-content">
                    <Routes>
                        <Route path="/questionnaire" element={<Questionnaire />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/areavisual" element={<AreaVisual />} />
                        <Route path="/futureprediction" element={<FuturePrediction />} />
                    </Routes>
                </div>
            )}

            {!isLandingPage && <Footer />}
        </>
    );
}

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/*" element={<LayoutWrapper />} />
            </Routes>
        </Router>
    );
}

export default App;

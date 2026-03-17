import React, { useState, useEffect } from "react";
import "./Navbar.css";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`navbar ${isScrolled ? "scrolled" : ""}`}>
      <div className="nav-content">
        <div className="logo">
          <div className="logo-dot"></div>
          <h2>Addiction<span>Predictor</span></h2>
        </div>
        
        <div className="nav-menu">
          <a href="/" className="link">Home</a>
          <a href="/questionnaire" className="link">Predict Addiction</a>
          <a href="/dashboard" className="link">Details Report</a>
          <a href="/areavisual" className="link">Your Area</a>
          <a href="/areavisual" className="link">Future Trends</a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
import React, { useState, useEffect } from "react";
import "./AreaVisual.css";
import CityComparisonDashboard from "./CityComparisonDashboard";

const stateCityMap = {
    "Andhra Pradesh": ["Visakhapatnam", "Guntur", "Nellore", "Kurnool", "Vijayawada"],
    "Arunachal Pradesh": ["Tawang", "Pasighat", "Ziro", "Itanagar", "Bomdila"],
    "Assam": ["Guwahati", "Dibrugarh", "Jorhat", "Silchar", "Tezpur"],
    "Bihar": ["Muzaffarpur", "Bhagalpur", "Gaya", "Purnia", "Patna"],
    "Chhattisgarh": ["Rajnandgaon", "Raipur", "Durg", "Korba", "Bilaspur"],
    "Gujarat": ["Rajkot", "Vadodara", "Bhavnagar", "Ahmedabad", "Surat"],
    "Haryana": ["Panipat", "Faridabad", "Gurugram", "Ambala", "Hisar"],
    "Himachal Pradesh": ["Kullu", "Solan", "Mandi", "Dharamshala", "Shimla"],
    "Jharkhand": ["Ranchi", "Jamshedpur", "Dhanbad", "Hazaribagh", "Bokaro"],
    "Karnataka": ["Mysuru", "Bengaluru", "Belagavi", "Hubli", "Mangaluru"],
    "Kerala": ["Thrissur", "Kozhikode", "Thiruvananthapuram", "Kannur", "Kochi"],
    "Madhya Pradesh": ["Indore", "Jabalpur", "Bhopal", "Gwalior", "Ujjain"],
    "Maharashtra": ["Pune", "Nagpur", "Nashik", "Mumbai", "Aurangabad"],
    "Odisha": ["Bhubaneswar", "Cuttack", "Rourkela", "Sambalpur", "Berhampur"],
    "Punjab": ["Amritsar", "Jalandhar", "Bathinda", "Patiala", "Ludhiana"],
    "Rajasthan": ["Kota", "Ajmer", "Jodhpur", "Udaipur", "Jaipur"],
    "Tamil Nadu": ["Coimbatore", "Madurai", "Salem", "Tiruchirappalli", "Chennai"],
    "Telangana": ["Khammam", "Karimnagar", "Hyderabad", "Warangal", "Nizamabad"],
    "Uttar Pradesh": ["Kanpur", "Agra", "Varanasi", "Lucknow", "Meerut"],
    "West Bengal": ["Siliguri", "Durgapur", "Asansol", "Howrah", "Kolkata"]
};

// Removed the userData prop from here
const AreaVisual = () => {
    const [state, setState] = useState("");
    const [city, setCity] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showDashboard, setShowDashboard] = useState(false);
    
    // State to manage user data and errors
    const [userData, setUserData] = useState(null); 
    const [fetchError, setFetchError] = useState(null); 

    const BACKEND_URL_COMPARE = "http://localhost:5000/api/generate-csv";
    const BACKEND_URL_GET_USER = "http://localhost:5000/api/get-user-prediction";

    // 1. Fetch user data on component mount
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch(BACKEND_URL_GET_USER);
                const result = await response.json();

                if (!response.ok || result.error) {
                    setFetchError(result.error || "Failed to load user prediction data.");
                } else {
                    setUserData(result);
                    setFetchError(null);
                }
            } catch (error) {
                console.error("User data fetch failed:", error);
                setFetchError("Could not connect to backend or fetch user data.");
            }
        };
        fetchUserData();
    }, []); // Run only once on mount

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!state || !city) {
            alert("Please select both State and City.");
            return;
        }

        if (!userData) {
            // Use the fetchError if data is still null
            alert(fetchError || "User prediction data not found. Please complete the questionnaire first.");
            return;
        }

        setIsLoading(true);
        setShowDashboard(false);

        // 2. Call the comparison API
        try {
            const response = await fetch(BACKEND_URL_COMPARE, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ state, city })
            });

            const result = await response.json();

            if (!response.ok) {
                alert(result.error || "Failed to generate local comparison data.");
                setIsLoading(false);
                return;
            }

            setShowDashboard(true);

        } catch (error) {
            console.error("Backend connection failed:", error);
            alert("Could not connect to backend.");
        } finally {
            setIsLoading(false);
        }
    };
    
    // Display error/prompt if user data is missing
    if (fetchError && !userData) {
        return (
            <div className="main-container">
                <div className="area-visual-container">
                    <h1>⚠️ Data Required</h1>
                    <p className="description" style={{color: 'red'}}>
                        {fetchError}
                    </p>
                    <button onClick={() => window.location.href = "/"} className="btn-report">
                        Go to Questionnaire
                    </button>
                </div>
            </div>
        );
    }
    
    // Display loading message while waiting for initial user data fetch
    if (!userData && !fetchError) {
         return (
            <div className="main-container">
                <div className="area-visual-container">
                    <h1>📊 Loading User Data...</h1>
                    <p className="description">Please wait while we retrieve your prediction results...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="main-container">
            <div className="area-visual-container">
        
                {/* --- Wrap the heading and description in this condition --- */}
                {!showDashboard && (
                    <>
                        <h1>📊 Compare Your Addiction Level to Your Area</h1>
                        <p className="description">
                            Select your state and city to compare your addiction level with people in your area.
                        </p>
                        
                        <form className="location-form" onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>State</label>
                                <select
                                    value={state}
                                    onChange={(e) => {
                                        setState(e.target.value);
                                        setCity("");
                                    }}
                                    required
                                >
                                    <option value="">Select State</option>
                                    {Object.keys(stateCityMap).map((st) => (
                                        <option key={st} value={st}>{st}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label>City</label>
                                <select
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                    disabled={!state}
                                    required
                                >
                                    <option value="">Select City</option>
                                    {state &&
                                        stateCityMap[state].map((ct) => (
                                            <option key={ct} value={ct}>{ct}</option>
                                        ))}
                                </select>
                            </div>

                            <button type="submit" disabled={isLoading}>
                                {isLoading ? "Processing..." : "Show Local Comparison"}
                            </button>
                        </form>
                    </>
                )}

                {showDashboard && userData && (
                    <CityComparisonDashboard
                        city={city}
                        state={state}
                        userData={userData}
                    />
                )}
            </div>
            
        </div>
    );
};

export default AreaVisual;
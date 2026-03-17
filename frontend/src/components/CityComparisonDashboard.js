import React, { useEffect, useState } from "react";
import { Doughnut, Bar } from "react-chartjs-2";
import "./CityComparisonDashboard.css";

// ---------------- COLORS ----------------
const COLORS = {
  High: "#e74c3c",
  Medium: "#f1c40f",
  Low: "#2ecc71",

  BarAqua: "rgba(173, 216, 230, 0.9)",
  BarPink: "rgba(255, 192, 203, 0.9)",

  UserDot: "#ADD8E6",
  UserColumnHighlight: "rgba(139, 0, 0, 0.3)"
};

// ---------------- COMMON OPTIONS ----------------
const commonOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: { color: "white" }
    },
    tooltip: {
      titleColor: "white",
      bodyColor: "white"
    }
  },
  scales: {
    x: {
      ticks: { color: "white" },
      grid: { color: "rgba(255,255,255,0.1)" }
    },
    y: {
      ticks: { color: "white" },
      grid: { color: "rgba(255,255,255,0.1)" },
      beginAtZero: true
    }
  }
};

// ---------------- AGE CHART OPTIONS (No Y-axis, custom legend) ----------------
const ageChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: "top",
      labels: {
        usePointStyle: true,
        generateLabels: () => ([
          { text: "High", fillStyle: COLORS.High, fontColor: "white", strokeStyle: "white",lineWidth: 2},
          { text: "Medium", fillStyle: COLORS.Medium, fontColor: "white",strokeStyle: "white",lineWidth: 2},
          { text: "Low", fillStyle: COLORS.Low , fontColor: "white",strokeStyle: "white",lineWidth: 2},
          { text: "You", fillStyle: COLORS.UserDot , fontColor: "white",strokeStyle: "white",lineWidth: 2}
        ])
      }
    },
    tooltip: {  
      enabled: true
    }
  },
  scales: {
    x: {
      ticks: { color: "white" },
      grid: { display: false }
    },
    y: {
      display: false,
      grid: { display: false }
    }
  }
};

// ---------------- No Legend -----------------

// Add this near your other options
const commonOptionsNoLegend = {
  ...commonOptions,
  plugins: {
    ...commonOptions.plugins,
    legend: {
      display: false // This hides the legend box
    }
  }
};

// ---------------- HELPERS ----------------
const getAgeGroup = (age) => {
  if (age <= 19) return "Teen";
  if (age <= 30) return "Young Adult";
  if (age <= 45) return "Adult";
  return "Middle-Aged";
};

const getDominantLevel = (c) => {
  const max = Math.max(c.High, c.Medium, c.Low);
  if (max === c.High) return "High";
  if (max === c.Medium) return "Medium";
  return "Low";
};

// ---------------- COMPONENT ----------------
const CityComparisonDashboard = ({ city, state, userData }) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!city || !state || !userData) return;

    fetch("http://127.0.0.1:5000/api/get-city-data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        city,
        state,
        user_addiction: userData.prediction,
        user_hours: userData.hours,
        user_anxiety: userData.anxiety,
        user_age: userData.age,
        user_education: userData.education
      })
    })
      .then(res => res.json())
      .then(json => {
        if (json.error) setError(json.error);
        else setData(json);
      })
      .catch(() => setError("Server error"));
  }, [city, state, userData]);

  if (error) return <p className="prompt-message error">{error}</p>;
  if (!data) return <p className="prompt-message loading">Loading visuals...</p>;

  // ---------------- 1. ADDICTION DISTRIBUTION ----------------
  const distData = {
    labels: ["High", "Medium", "Low"],
    datasets: [{
      data: [
        data.addiction_distribution.High || 0,
        data.addiction_distribution.Medium || 0,
        data.addiction_distribution.Low || 0
      ],
      backgroundColor: [COLORS.High, COLORS.Medium, COLORS.Low]
    }]
  };
  const totalDist = distData.datasets[0].data.reduce((a, b) => a + b, 0);

  const distOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "white",
          usePointStyle: true
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.parsed;
            const percent = totalDist
              ? ((value / totalDist) * 100).toFixed(1)
              : 0;
            return `${context.label}: ${percent}%`;
          }
        }
      }
    }
  };

  // ---------------- 2. AGE GROUP VISUAL ----------------
  const ageGrouped = {};
  data.age_data.forEach(a => {
    const g = getAgeGroup(a.Age);
    if (!ageGrouped[g]) ageGrouped[g] = { High: 0, Medium: 0, Low: 0 };
    ageGrouped[g].High += a.High;
    ageGrouped[g].Medium += a.Medium;
    ageGrouped[g].Low += a.Low;
  });

  const ageFinal = Object.keys(ageGrouped).map(g => ({
    group: g,
    total: ageGrouped[g].High + ageGrouped[g].Medium + ageGrouped[g].Low,
    dominant: getDominantLevel(ageGrouped[g])
  }));

  const ageLabels = ageFinal.map(a => a.group);
  const userAgeIndex = ageLabels.indexOf(getAgeGroup(userData.age));

  const ageData = {
    labels: ageLabels,
    datasets: [
      {
        data: ageFinal.map(a => a.total),
        backgroundColor: ageFinal.map(a => COLORS[a.dominant])
      },
      {
        type: "scatter",
        data: ageLabels.map((_, i) =>
          i === userAgeIndex ? ageFinal[i].total + 0.5 : null
        ),
        pointRadius: 8,
        pointBackgroundColor: COLORS.UserDot
      }
    ]
  };

  // ---------------- 3. EDUCATION VISUAL (NEW AGE-STYLE OPTIONS) ----------------
  const eduFinal = data.edu_data.map(e => ({
    group: e.Education,
    total: e.High + e.Medium + e.Low,
    dominant: getDominantLevel(e)
  }));

  const eduLabels = eduFinal.map(e => e.group);
  const userEduIndex = eduLabels.indexOf(userData.education);

  const eduData = {
    labels: eduLabels,
    datasets: [
      {
        data: eduFinal.map(e => e.total),
        backgroundColor: eduFinal.map(e => COLORS[e.dominant])
      },
      {
        type: "scatter",
        data: eduLabels.map((_, i) =>
          i === userEduIndex ? eduFinal[i].total + 0.5 : null
        ),
        pointRadius: 8,
        pointBackgroundColor: COLORS.UserDot
      }
    ]
  };

  const ChartBox = ({ title, children }) => (
    <div className="visual-box">
      <h3>{title}</h3>
      <div style={{ height: "300px" }}>{children}</div>
    </div>
  );

  // ---------------- 4. SCREEN TIME ----------------
  const screenData = {
    labels: ["People", "You"],
    datasets: [{
      data: [data.screen_time.average, userData.hours],
      backgroundColor: [COLORS.BarAqua, COLORS.BarPink]
    }]
  };

  // ---------------- 5. ANXIETY ----------------
  const anxietyData = {
    labels: ["You", "People"],
    datasets: [{
      data: [userData.anxiety, data.anxiety.average],
      backgroundColor: [COLORS.BarPink, COLORS.BarAqua]
    }]
  };

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Your Addiction vs People Of {city}, {state}</h2>

      {/* --- 0. Score Cards (Top Row) --- */}
    <div className="score-cards-row">
      <div className="score-card addiction">
        <p className="card-label">Your Addiction Level</p>
        {/* Fixed: Added backticks and $ for the dynamic class */}
        <h2 className={`card-value ${userData.prediction.toLowerCase()}`}>
          {userData.prediction}
        </h2>
      </div>
      
      <div className="score-card age">
        <p className="card-label">Your Age</p>
        <h2 className="card-value">{userData.age}</h2>
      </div>

      <div className="score-card anxiety">
        <p className="card-label">Your Anxiety Score</p>
        <h2 className="card-value">{userData.anxiety}</h2>
      </div>
    </div>

      <div className="dashboard-grid">

        <ChartBox title={`Addiction Level Distribution in ${city}`}>
          <Doughnut data={distData} options={distOptions} />
        </ChartBox>

        <ChartBox title={`Your Addiction vs Age Groups in ${city}`}>
          <Bar data={ageData} options={ageChartOptions} />
        </ChartBox>

        <ChartBox title={`Screen Time Comparison in ${city}`}>
          <Bar data={screenData} options={commonOptionsNoLegend} />
        </ChartBox>

        <ChartBox title={`Your Addiction vs Education Groups in ${city}`}>
          <Bar data={eduData} options={ageChartOptions} />
        </ChartBox>

        <ChartBox title={`Anxiety Comparison in ${city}`}>
          <Bar data={anxietyData} options={commonOptionsNoLegend} />
        </ChartBox>

      </div>
    </div>
  );
};

export default CityComparisonDashboard;

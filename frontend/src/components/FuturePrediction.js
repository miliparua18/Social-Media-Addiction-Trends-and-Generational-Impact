import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import "./FuturePrediction.css";
import {
Chart as ChartJS,
CategoryScale,
LinearScale,
PointElement,
LineElement,
Tooltip,
Legend,
Filler,
} from "chart.js";

ChartJS.register(
CategoryScale,
LinearScale,
PointElement,
LineElement,
Tooltip,
Legend,
Filler
);

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

/* ===== Recommendation Tip Pools ===== */

const lowRiskTips = [
"Maintain balanced social media usage habits.",
"Encourage offline hobbies like sports or reading.",
"Track daily screen time using digital wellbeing apps.",
"Promote outdoor activities and social interaction.",
"Take short breaks from social media every few hours.",
"Encourage productive use of technology like learning apps."
];

const mediumRiskTips = [
"Set daily screen-time limits using digital wellbeing tools.",
"Disable non-essential social media notifications.",
"Encourage participation in physical activities.",
"Schedule social media breaks every 30–60 minutes.",
"Use productivity apps to manage focus time.",
"Promote awareness about the negative effects of excessive usage.",
"Encourage spending more time with family and friends."
];

const highRiskTips = [
"Try to limit social media use to specific hours in a day.",
"Turn off notifications from social media apps.",
"Take regular breaks from your phone during study or work time.",
"Spend more time doing offline activities like sports or hobbies.",
"Avoid using your phone before sleeping.",
"Use screen-time apps to control how long you use social media.",
"Try a small digital detox day once every week."
];

const severeRiskTips = [
"Start reducing social media time little by little every day.",
"Ask family members to help monitor your screen time.",
"Try to stay away from your phone during important activities.",
"Replace social media time with exercise or outdoor activities.",
"Take a few hours of complete digital detox every day.",
"If social media affects your mood or sleep, consider talking to a counselor.",
"Spend more time with friends and family instead of online platforms."
];

/* ===== Random Recommendation Selector ===== */

const getRandomTips = (tips, count = 4) => {
const shuffled = [...tips].sort(() => 0.5 - Math.random());
return shuffled.slice(0, count);
};

/* ===== AI Recommendation Function ===== */

const getRecommendation = (score) => {

if(score < 40){
return {
level: "Low Risk",
tips: getRandomTips(lowRiskTips)
};
}

if(score < 70){
return {
level: "Moderate Risk",
tips: getRandomTips(mediumRiskTips)
};
}

if(score < 85){
return {
level: "High Risk",
tips: getRandomTips(highRiskTips)
};
}

return {
level: "Severe Risk",
tips: getRandomTips(severeRiskTips)
};

};

const FuturePrediction = () => {

const [state, setState] = useState("");
const [city, setCity] = useState("");
const [futureData, setFutureData] = useState([]);
const [loading, setLoading] = useState(false);

const BACKEND_URL = "http://localhost:5000/api/future-forecast";

const getAddictionLevel = (score) => {
if (score < 40) return { label: "Low", color: "#22c55e" };
if (score < 70) return { label: "Medium", color: "#f59e0b" };
return { label: "High", color: "#ef4444" };
};

const handleSubmit = async (e) => {


e.preventDefault();

if (!state || !city) {
  alert("Please select State and City");
  return;
}

setLoading(true);
setFutureData([]);

try {

  const res = await fetch(BACKEND_URL,{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({state,city})
  });

  const data = await res.json();

  if(!res.ok){
    alert(data.error);
  }
  else{
    setFutureData(data);
  }

}
catch(error){
  alert("Error connecting to backend.");
}

setLoading(false);


};

const startVal = futureData[0]?.Predicted_Avg_Addiction_Score || 0;
const endVal = futureData.at(-1)?.Predicted_Avg_Addiction_Score || 0;

const recommendation = getRecommendation(endVal);

const trend = endVal > startVal ? "Increasing" : "Stable / Decreasing";

const growth =
startVal !== 0
? (((endVal - startVal) / startVal) * 100).toFixed(1)
: "0";

const allPoints = futureData.flatMap(d => [
d.Predicted_Avg_Addiction_Score,
d.Upper_Bound,
d.Lower_Bound
]);

const minVal = Math.min(...allPoints);
const maxVal = Math.max(...allPoints);

const chartData = {


labels: futureData.map(d => d.Year),

datasets:[
  {
    label:"Predicted Score",
    data:futureData.map(d=>d.Predicted_Avg_Addiction_Score),
    borderColor:"#6366f1",
    backgroundColor:"#6366f1",
    borderWidth:3,
    tension:0.4,
    pointRadius:5
  },
  {
    label:"Upper Bound",
    data:futureData.map(d=>d.Upper_Bound),
    borderColor:"transparent",
    backgroundColor:"rgba(99,102,241,0.1)",
    fill:"+1",
    pointRadius:0
  },
  {
    label:"Lower Bound",
    data:futureData.map(d=>d.Lower_Bound),
    borderColor:"transparent",
    backgroundColor:"rgba(99,102,241,0.1)",
    fill:false,
    pointRadius:0
  }
]


};

const chartOptions = {


responsive:true,
maintainAspectRatio:false,

plugins:{
  legend:{
    labels:{
      filter:(item)=>!item.text.includes("Bound")
    }
  },
  tooltip:{mode:"index",intersect:false}
},

scales:{
  y:{
    min:Math.floor(minVal-5)<0?0:Math.floor(minVal-5),
    max:Math.ceil(maxVal+5)>100?102:Math.ceil(maxVal+5),
    title:{display:true,text:"Addiction Index (%)"}
  },
  x:{grid:{display:false}}
}


};

return (


<div className="future-container">

  <div className="future-box">

    <h1>Future Addiction Forecast</h1>
    <p className="subtitle">
      Forecasting social media addiction trends using time-series modeling
    </p>

    <form className="location-form" onSubmit={handleSubmit}>

      <select
        value={state}
        onChange={(e)=>{
          setState(e.target.value);
          setCity("");
        }}
      >
        <option value="">Select State</option>
        {Object.keys(stateCityMap).map(st=>(
          <option key={st}>{st}</option>
        ))}
      </select>

      <select
        value={city}
        onChange={(e)=>setCity(e.target.value)}
        disabled={!state}
      >
        <option value="">Select City</option>
        {stateCityMap[state]?.map(ct=>(
          <option key={ct}>{ct}</option>
        ))}
      </select>

      <button type="submit">
        {loading ? "Predicting..." : "Predict Future"}
      </button>

    </form>

    {futureData.length>0 &&(

    <>

    <div className="summary">

      <div className="card">
        <h3>Location</h3>
        <p>{city}, {state}</p>
      </div>

      <div className="card">
        <h3>Trend</h3>
        <p style={{color:trend==="Increasing"?"#ef4444":"#22c55e"}}>
          {trend}
        </p>
      </div>

      <div className="card">
        <h3>Growth</h3>
        <p>{growth}%</p>
      </div>

    </div>

    <div className="chart-box" style={{height:"400px",marginTop:"20px"}}>
      <Line data={chartData} options={chartOptions}/>
    </div>

    <table>

      <thead>
        <tr>
          <th>Year</th>
          <th>Predicted Score</th>
          <th>Addiction Level</th>
        </tr>
      </thead>

      <tbody>

      {futureData.map((row,i)=>{

        const level = getAddictionLevel(row.Predicted_Avg_Addiction_Score);

        return(

        <tr key={i}>

          <td>{row.Year}</td>

          <td style={{fontWeight:"bold"}}>
            {row.Predicted_Avg_Addiction_Score.toFixed(2)}
          </td>

          <td style={{color:level.color,fontWeight:"600"}}>
            {level.label}
          </td>

        </tr>

        );

      })}

      </tbody>

    </table>

    <div className={`insight-container risk-${recommendation.level.split(' ')[0].toLowerCase()}`}>
      <div className="insight-header">
        <div className="ai-icon">
          <span>✨</span>
        </div>
        <div className="header-text">
          <h3>AI Prevention Strategies</h3>
          <div className="risk-badge">
            {recommendation.level} Analysis
          </div>
        </div>
      </div>

      <div className="forecast-summary">
        <p>
          In <span className="highlight">{city}</span>, addiction levels show an 
          <span className={`trend-tag ${trend.toLowerCase()}`}> {trend.toLowerCase()} </span> 
          trend, projected to reach <b>{endVal.toFixed(1)}%</b> by <b>{futureData.at(-1).Year}</b>.
        </p>
      </div>

      <div className="tips-grid">
        {recommendation.tips.map((tip, index) => (
          <div className="tip-card" key={index}>
            <div className="tip-number">{index + 1}</div>
            <p>{tip}</p>
          </div>
        ))}
      </div>
      
      <div className="ai-footer">
        <small>Action plan generated based on local {city} growth trends.</small>
      </div>
    </div>

    </>

    )}

  </div>

</div>


);

};

export default FuturePrediction;

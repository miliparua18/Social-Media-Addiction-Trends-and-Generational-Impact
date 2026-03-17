import React, { useState } from "react";
import "./Questionnaire.css";

// ⚠️ IMPORTANT: Replace these placeholder URLs with paths to your actual question images/icons
const questionImages = {
  age: "https://blog.ons.gov.uk/wp-content/uploads/sites/6/2023/01/shutterstock_1409780333-630x470.jpg",
  gender: "https://cdn.dribbble.com/userupload/22207531/file/original-470fcbf441258ae3bf79096803aea116.gif",
  education: "https://www.euroschoolindia.com/blogs/wp-content/uploads/2023/09/the-evolution-of-higher-education-in-india.jpg",
  phone: "https://static.vecteezy.com/system/resources/thumbnails/052/025/548/small/a-cartoon-man-sitting-on-the-floor-holding-a-phone-vector.jpg",
  session: "https://i.pinimg.com/originals/03/c0/38/03c038d16263b1edbd846b4d2cc4ed28.gif",
  Posts: "https://media4.giphy.com/media/v1.Y2lkPTZjMDliOTUyODBjczRvejc4a204NzVpb3NjcGhlZTd5ZzIzNWFybTF5bDhucDRkZCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/G8N2xVSdzAMHxWVoUS/200.gif",
  scrolling: "https://media0.giphy.com/media/v1.Y2lkPTZjMDliOTUyOGttYnk2dmMxbDFtMXhxeGN2a2Rhb240ZDBpbHVudHAwbzBtbTFtNSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/3GSoFVODOkiPBFArlu/giphy.gif",
  "night-usage": "https://thumbs.dreamstime.com/b/late-night-connections-woman-engaged-social-media-digital-illustration-bed-engrossed-her-smartphone-surrounded-icons-368265065.jpg",
  notifications: "https://cdn.dribbble.com/userupload/22316154/file/original-4256048f3c92914805a1b56c91d2d719.gif",
  "social-apps": "https://i.pinimg.com/originals/e9/f7/c5/e9f7c599af092d6317691eb406ad4258.gif",
  "preferred-app": "/social_app.png",
  "likes-comments": "https://media1.giphy.com/media/v1.Y2lkPTZjMDliOTUyNjF6bWNkd2p1b3NnY2JmYXRlMmMyc3d1bGdqaHEzd3c5cmszNTN6ZiZlcD12MV9zdGlja2Vyc19zZWFyY2gmY3Q9cw/dUHYpKpEpiLnCE6qBt/source.gif",
  time: "https://thumbs.dreamstime.com/b/funny-sleepless-man-clipart-using-phone-bed-cartoon-insomnia-screen-addiction-385103980.jpg",
  mood: "https://i.pinimg.com/originals/65/c2/13/65c2132c5fc02dbfa6543eef7447829e.gif",
  "anxiety-score": "https://media2.giphy.com/media/v1.Y2lkPTZjMDliOTUyeWNyaWxjNXM5b2h0NTI5NjkwYnZiMWpucTBqMXY3d2Y3cW5iNmpscCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/3b4y2w1AitJEqqLJsD/giphy.gif",
  sleep: "https://media.tenor.com/DiyL7gn-uSoAAAAM/insomnia-cant-sleep.gif",
  productivity: "https://media2.giphy.com/media/v1.Y2lkPTZjMDliOTUyZXowdWRseWJicWg3ZmMyOTMwYm9xdnB3cnMxbWkweDdpeGs4Nm5lMyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/2WGS9i0pKO6s2YI2t2/giphy.gif",
};

const questions = [
  { id: "age", question: "Enter your age:", type: "number", emoji: "🎂" },
  { id: "gender", question: "What is your gender?", type: "radio", options: ["Male", "Female", "Other"], emoji: "🚻" },
  { id: "education", question: "Education Level", type: "radio", options: ["School", "College", "Working", "Graduate"], emoji: "🎓" },
  { id: "phone", question: "How many hours do you spend on your phone daily?", type: "number", emoji: "📱" },
  { id: "session", question: "How many times do you open social media daily?", type: "number", emoji: "🔄" },
  { id: "Posts", question: "Approximate Posts per Month", type: "number", emoji: "✍️" },
  { id: "scrolling", question: "How long do you scroll through content (min)?", type: "number", emoji: "⬇️" },
  { id: "night-usage", question: "Do you use social media at night?", type: "radio", options: ["Yes", "No"], emoji: "🌙" },
  { id: "notifications", question: "How many Notifications you received/checked daily?", type: "number", emoji: "🔔" },
  { id: "social-apps", question: "How many No. of Social Media Apps do you use?", type: "number", emoji: "📲" },
  { id: "preferred-app", question: "Preferred App", type: "radio", options: ["LinkedIn", "Instagram", "Reddit", "Facebook", "WhatsApp", "Twitter", "Snapchat", "YouTube"], emoji: "⭐" },
  { id: "likes-comments", question: "On average, how many likes or comments do your posts receive?", type: "number", emoji: "👍" },
  { id: "time", question: "How many minutes after waking up do you check social media?", type: "number", emoji: "⏰" },
  { id: "mood", question: "How is your overall mood after use social media?", type: "radio", options: ["Happy", "Neutral", "Irritable", "Anxious", "Relaxed", "Excited", "Calm"], emoji: "😊" },
  { id: "anxiety-score", question: "Rate your Anxiety Level (1–10):", type: "number", emoji: "😰" },
  { id: "sleep", question: "Do you feel Sleep Disturbance?", type: "radio", options: ["Yes", "No"], emoji: "😴" },
  { id: "productivity", question: "What percentage of your work or study time do you lose because you spend time on social media?", type: "number", emoji: "📈" },
];

const Questionnaire = () => {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [prediction, setPrediction] = useState("");
  const currentQuestion = questions[current];

  const handleChange = (e) => {
    setAnswers({ ...answers, [e.target.name]: e.target.value });
  };

  const handleNext = () => {
    if (!answers[currentQuestion.id]) {
      alert("Please answer before continuing!");
      return;
    }
    setCurrent(current + 1);
  };

  const handlePrev = () => {
    if (current > 0) setCurrent(current - 1);
  };

  const handleSubmit = async () => {
    // Basic validation for the last question
    if (!answers[currentQuestion.id]) {
      alert("Please answer before submitting!");
      return;
    }

    console.log("Answers sent to Flask:", answers);
    try {
      const response = await fetch("http://127.0.0.1:5000/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      });

      const data = await response.json();

      if (data.prediction) {
        console.log("Prediction from Flask:", data.prediction);
        setPrediction(data.prediction);
        setSubmitted(true);
      } else {
        console.error("Backend returned error:", data.error);
        alert("Error from server: " + data.error);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Network or server error");
    }
  };

  return (
    <div className="App">
      <div className="form-box">
        <h1>📱 Addiction Prediction App</h1>

        {!submitted ? (
          <div className="question-container">
            <div className="progress-bar-container">
                <div 
                    className="progress-bar" 
                    style={{ width: `${((current + 1) / questions.length) * 100}%` }}
                ></div>
            </div>
            
            <p className="question-number">
               Question {current + 1} of {questions.length}
            </p>

            <div className="question-content">
                <div className="question-image-container">
                    {/* Display a relevant image for the current question */}
                    <img
                    src={questionImages[currentQuestion.id]}
                    alt={currentQuestion.question}
                    className="question-image"
                    />
                </div>

                <div className="question-details">
                    <h3 className="question-text">{currentQuestion.emoji}  {currentQuestion.question}</h3>

                    {currentQuestion.type === "radio" ? (
                    <div className="options">
                        {currentQuestion.options.map((opt) => (
                        <label
                            key={opt}
                            className={`option-label ${answers[currentQuestion.id] === opt ? "selected" : ""}`}
                        >
                            <input
                            type="radio"
                            name={currentQuestion.id}
                            value={opt}
                            checked={answers[currentQuestion.id] === opt}
                            onChange={handleChange}
                            />
                            {opt}
                        </label>
                        ))}
                    </div>
                    ) : (
                    <input
                        type="number"
                        name={currentQuestion.id}
                        value={answers[currentQuestion.id] || ""}
                        onChange={handleChange}
                        placeholder={`Enter your answer for ${currentQuestion.id}`}
                        min={currentQuestion.id === 'anxiety-score' ? 1 : 0}
                        max={currentQuestion.id === 'anxiety-score' ? 10 : undefined}
                    />
                    )}

                    <div className="buttons">
                    {current > 0 && (
                        <button onClick={handlePrev} className="btn-back">
                        ⬅️ Back
                        </button>
                    )}
                    {current < questions.length - 1 ? (
                        <button onClick={handleNext} className="btn-next">
                        Next Question ➡️
                        </button>
                    ) : (
                        <button onClick={handleSubmit} className="btn-submit">
                        Submit & Get Prediction 🚀
                        </button>
                    )}
                    </div>
                </div>
            </div>
          </div>
        ) : (
          <div className="result">
            <h2>🎉 Prediction Result</h2>
            <p
              className={
                prediction === "Low"
                  ? "prediction-low"
                  : prediction === "Medium"
                  ? "prediction-medium"
                  : prediction === "High"
                  ? "prediction-high"
                  : ""
              }
            >
              Your Addiction Rate Is: {prediction}
            </p>
            <br></br>
            <button
              onClick={() => (window.location.href = "/dashboard")}
              style={{ marginLeft: "10px" }}
              className="btn-report"
            >
              📊 View Detailed Report
            </button>
            <button
              onClick={() => (window.location.href = "/areavisual")}
              style={{ marginLeft: "10px" }}
              className="btn-area"
            >
              📊 Compare to My Area
            </button>
            <br></br>
            <button
              onClick={() => (window.location.href = "/futureprediction")}
              style={{ marginLeft: "10px" }}
              className="btn-future"
            >
              🔮 Future Addiction Forecast
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Questionnaire;
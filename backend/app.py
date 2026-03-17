from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import numpy as np
import pandas as pd
import os

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"]) 

# --- Load ML model ---
with open("addiction_prediction_model.pkl", "rb") as file:
    model = pickle.load(file)

# --- Encoding Maps ---
gender_map = {"Female": 0, "Male": 1}
education_map = {"School": 0, "College": 1, "Working": 2, "Graduate": 3}
night_usage_map = {"No": 0, "Yes": 1}
preferred_app_map = {
    "LinkedIn": 0, "Instagram": 1, "Reddit": 2, "Facebook": 3,
    "WhatsApp": 4, "Twitter": 5, "Snapchat": 6, "YouTube": 7
}
mood_map = {"Happy": 0, "Neutral": 1, "Irritable": 2, "Anxious": 3,
            "Relaxed": 4, "Excited": 5, "Calm": 6}
sleep_map = {"No": 0, "Yes": 1}

# --- File paths ---
USER_DATA_PATH = "Data/user_input_dataset.csv"
LOCAL_COMPARISON_DATA_PATH = "Data/user_local_comparison_data.csv"
MAIN_DATASET_PATH = "Data/area_addiction_dataset.csv"  # 1000 users dataset

# --- Prediction endpoint ---
@app.route("/api/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()
        answers = data.get("answers", {})

        feature_order = [
            "age", "gender", "education", "phone", "session", "Posts", "scrolling",
            "night-usage", "notifications", "social-apps", "preferred-app",
            "likes-comments", "time", "mood", "anxiety-score", "sleep", "productivity"
        ]

        features = []
        for key in feature_order:
            val = answers.get(key, 0)
            if key == "gender":
                val = gender_map.get(val, 0)
            elif key == "education":
                val = education_map.get(val, 0)
            elif key == "night-usage":
                val = night_usage_map.get(val, 0)
            elif key == "preferred-app":
                val = preferred_app_map.get(val, 0)
            elif key == "mood":
                val = mood_map.get(val, 0)
            elif key == "sleep":
                val = sleep_map.get(val, 0)
            else:
                try:
                    val = float(val)
                except:
                    val = 0
            features.append(val)

        input_data = np.array(features).reshape(1, -1)
        prediction = model.predict(input_data)
        prediction_value = int(prediction[0])
        result_map = {0: "High", 1: "Low", 2: "Medium"}
        result = result_map.get(prediction_value, "Unknown")

        # Save user data to CSV
        user_record = answers.copy()
        user_record["prediction"] = result
        user_record["is_user"] = "Yes"
        df = pd.DataFrame([user_record])
        column_rename_map = {
            "age": "Age", "gender": "Gender", "education": "Education Level",
            "phone": "Hours per Day", "session": "Sessions per Day",
            "Posts": "Posts per Month", "scrolling": "Scrolling Time (min)",
            "night-usage": "Night Usage", "notifications": "Notifications per Day",
            "social-apps": "No. of Social Apps", "preferred-app": "Preferred App",
            "likes-comments": "Likes/Comments per Post", "time": "Time to Check After Waking (min)",
            "mood": "Mood After Use", "anxiety-score": "Anxiety Score",
            "sleep": "Sleep Disturbance", "productivity": "Productivity Loss (%)",
            "prediction": "Addiction Level", "is_user": "is_user"
        }
        df.rename(columns=column_rename_map, inplace=True)
        df.to_csv(USER_DATA_PATH, index=False)

        return jsonify({"prediction": result})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# --- NEW ENDPOINT: Retrieve saved user data ---
@app.route("/api/get-user-prediction", methods=["GET"])
def get_user_prediction():
    try:
        if not os.path.exists(USER_DATA_PATH):
            return jsonify({"error": "User prediction data not found. Please complete the questionnaire first."}), 404

        user_df = pd.read_csv(USER_DATA_PATH)
        
        if user_df.empty:
             return jsonify({"error": "User prediction data found, but empty. Please re-run the questionnaire."}), 404

        # Get the first row (the user's data)
        user_data = user_df.iloc[0].to_dict()
        
        # Map the column names back to the keys expected by the frontend
        data_to_return = {
            "prediction": user_data.get("Addiction Level"),
            "age": user_data.get("Age"),
            "hours": user_data.get("Hours per Day"), # Used as user_hours
            "anxiety": user_data.get("Anxiety Score"), # Used as user_anxiety
            "education": user_data.get("Education Level"), # Used as user_education
        }

        return jsonify(data_to_return)

    except Exception as e:
        return jsonify({"error": f"Error retrieving user prediction: {str(e)}"}), 500


# --- Local comparison CSV endpoint ---
@app.route('/api/generate-csv', methods=['POST'])
def generate_local_comparison_data():
    try:
        data = request.get_json()
        city = data.get('city', '').strip()
        state = data.get('state', '').strip()
        if not city or not state:
            return jsonify({"error": "City and State are required."}), 400

        if not os.path.exists(USER_DATA_PATH):
            return jsonify({"error": "User prediction data not found. Please run prediction first."}), 404

        user_df = pd.read_csv(USER_DATA_PATH)
        required_columns = ['Age', 'Gender', 'Education Level', 'Hours per Day', 'Anxiety Score', 'Addiction Level']
        user_df = user_df[required_columns]

        # Add new location
        user_df.insert(0, 'State', state)
        user_df.insert(1, 'City', city)

        # Save to new CSV
        user_df.to_csv(LOCAL_COMPARISON_DATA_PATH, index=False)
        addiction_level = user_df.iloc[0]['Addiction Level']

        return jsonify({
            "message": "Local comparison data generated and saved.",
            "addictionLevel": addiction_level,
            "city": city,
            "state": state
        })

    except Exception as e:
        return jsonify({"error": f"Error generating local comparison data: {str(e)}"}), 500

# --- City data endpoint for 5 visuals ---
@app.route("/api/get-city-data", methods=["POST"])
def get_city_data():
    try:
        data = request.get_json()
        city = data.get("city", "").strip()
        state = data.get("state", "").strip()
        user_addiction = data.get("user_addiction", "")
        # Ensure conversion to standard float/int upon retrieval
        user_hours = float(data.get("user_hours", 0)) 
        user_anxiety = float(data.get("user_anxiety", 0))
        user_age = int(data.get("user_age", 0))
        user_education = data.get("user_education", "")

        if not city or not state:
            return jsonify({"error": "City and State required."}), 400

        if not os.path.exists(MAIN_DATASET_PATH):
            return jsonify({"error": "Main dataset not found."}), 404

        df = pd.read_csv(MAIN_DATASET_PATH)
        df_city = df[(df["City"] == city) & (df["State"] == state)]
        
        # 1. Addiction distribution
        addiction_counts = df_city["Addiction Level"].value_counts().to_dict()
        # FIX 1: Ensure values in addiction_counts dictionary are standard Python int
        addiction_counts_fixed = {k: int(v) for k, v in addiction_counts.items()} 

        # 2. Addiction by Age (already handled inside the loop, but we will ensure conversion)
        age_groups = df_city.groupby("Age")["Addiction Level"].value_counts().unstack(fill_value=0)
        age_data = []
        for age in sorted(age_groups.index):
            row = {
                "Age": int(age), 
                "Low": int(age_groups.loc[age].get("Low", 0)), # Cast to int
                "Medium": int(age_groups.loc[age].get("Medium", 0)), # Cast to int
                "High": int(age_groups.loc[age].get("High", 0)) # Cast to int
            }
            if age == user_age:
                row["User"] = user_addiction
            age_data.append(row)

        # 3. Addiction by Education (already handled inside the loop, but we will ensure conversion)
        edu_groups = df_city.groupby("Education Level")["Addiction Level"].value_counts().unstack(fill_value=0)
        edu_data = []
        for edu in edu_groups.index:
            row = {
                "Education": edu, 
                "Low": int(edu_groups.loc[edu].get("Low", 0)), # Cast to int
                "Medium": int(edu_groups.loc[edu].get("Medium", 0)), # Cast to int
                "High": int(edu_groups.loc[edu].get("High", 0)) # Cast to int
            }
            if edu == user_education:
                row["User"] = user_addiction
            edu_data.append(row)

        # 4. Screen time comparison
        avg_hours_np = df_city["Hours per Day"].mean()
        # FIX 2: Convert NumPy float to standard Python float
        avg_hours = float(avg_hours_np) if pd.notna(avg_hours_np) else 0

        # 5. Anxiety score comparison
        avg_anxiety_np = df_city["Anxiety Score"].mean()
        # FIX 3: Convert NumPy float to standard Python float
        avg_anxiety = float(avg_anxiety_np) if pd.notna(avg_anxiety_np) else 0

        return jsonify({
            "addiction_distribution": addiction_counts_fixed, # Use the fixed dictionary
            "age_data": age_data,
            "edu_data": edu_data,
            "screen_time": {"user": user_hours, "average": avg_hours},
            "anxiety": {"user": user_anxiety, "average": avg_anxiety}
        })

    except Exception as e:
        # A more detailed error message will help diagnose future issues
        return jsonify({"error": f"Error processing city data: {str(e)}"}), 500

##-----------Future Prediction---------
@app.route("/api/future-forecast", methods=["POST"])
def get_future_forecast():
    try:
        data = request.get_json()
        state = data.get("state")
        city = data.get("city")

        if not state or not city:
            return jsonify({"error": "State and City required"}), 400

        df = pd.read_csv("Data/future_area_forecast.csv")

        city_df = df[
            (df["State"] == state) & 
            (df["City"] == city)
        ]

        if city_df.empty:
            return jsonify({"error": "No future data found"}), 404

        return jsonify(city_df.to_dict(orient="records"))

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(port=5000, debug=True)
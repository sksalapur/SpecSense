import os
import streamlit as st
import json
from typing import List, Dict
from dotenv import load_dotenv
import requests

# Load environment variables
load_dotenv()

# Device features and price ranges
device_features = {
    "Mobile": ["Camera", "Battery Life", "Performance", "Display Quality", "Fast Charging"],
    "Tablet": ["Display Quality", "Performance", "Battery Life", "Stylus Support"],
    "TWS": ["Sound Quality", "Battery Life", "Noise Cancellation", "Comfort & Fit"],
    "TV": ["Picture Quality", "Sound Quality", "Smart Features", "Gaming Performance"],
    "Smart-Watch": ["Fitness Tracking", "Battery Life", "Smart Features", "Design"],
}

price_ranges = {
    "Mobile": (5000, 150000, (10000, 50000)),
    "Tablet": (8000, 200000, (15000, 80000)),
    "TWS": (1000, 50000, (2000, 15000)),
    "TV": (15000, 500000, (25000, 100000)),
    "Smart-Watch": (2000, 100000, (5000, 30000)),
}

def call_gemini_api(prompt: str, api_key: str):
    url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent"
    headers = {"Content-Type": "application/json"}
    params = {"key": api_key}
    data = {
        "contents": [{"parts": [{"text": prompt}]}]
    }
    try:
        response = requests.post(url, headers=headers, params=params, json=data, timeout=30)
        response.raise_for_status()
        result = response.json()
        # Extract the text from the response
        return result["candidates"][0]["content"]["parts"][0]["text"]
    except Exception as e:
        return f"Error: {e}"

def get_forum_reviews(device_name: str):
    # Placeholder for web scraping logic
    # In production, use an external API or backend service for scraping
    # Here, we simulate a review fetch
    return f"Sample review for {device_name} from Reddit/XDA."

def get_gemini_recommendations(device_type: str, feature_prefs: Dict[str, int], price_range: List[int], api_key: str):
    features = ", ".join([f"{k} (Priority: {v}/5)" for k, v in feature_prefs.items()])
    prompt = f"""
You are a tech expert. Recommend up to 10 {device_type}s available in India within the budget of ₹{price_range[0]:,} - ₹{price_range[1]:,}.
User preferences: {features}
Return a JSON array with this structure:
[
  {{
    "device_name": "Device Name",
    "current_price_inr": 25000,
    "summary": "One paragraph explaining why this device is good for the user",
    "feature_scores": {{ "camera": 8.5, ... }},
    "fit_rating": 85,
    "regret_rating": 15
  }}
]
Only recommend devices actually available in India within the specified budget. Use current 2024 prices.
"""
    result = call_gemini_api(prompt, api_key)
    try:
        devices = json.loads(result)
        # Add forum reviews for each device
        for device in devices:
            device_name = device.get("device_name", "")
            device["reviews"] = call_gemini_api(
                f"Summarize real user reviews for {device_name} from Reddit, XDA, and other forums. Only include recent and relevant feedback.",
                api_key
            )
        return devices
    except Exception:
        return [{"device_name": "Error", "summary": result, "feature_scores": {}, "fit_rating": 0, "regret_rating": 0, "reviews": ""}]

def main():
    st.title("Device Suggester AI (Streamlit)")
    st.write("Find the perfect device tailored to your needs.")

    device_type = st.selectbox("Select device type", list(device_features.keys()))
    st.subheader("Set your feature preferences (1-5)")
    features = device_features[device_type]
    feature_prefs = {}
    for feat in features:
        feature_prefs[feat] = st.slider(f"{feat}", 1, 5, 3)

    min_price, max_price, default_range = price_ranges[device_type]
    price_range = st.slider(
        "Select your price range (INR)",
        min_price, max_price, default_range
    )

    api_key = os.getenv("GEMINI_API_KEY", "")
    if not api_key:
        st.warning("Please set your GEMINI_API_KEY in the .env file.")

    if st.button("Suggest Devices"):
        with st.spinner("Fetching recommendations..."):
            results = get_gemini_recommendations(device_type, feature_prefs, price_range, api_key)
            for device in results:
                st.markdown(f"### {device['device_name']}")
                st.write(f"**Price:** ₹{device.get('current_price_inr','')}")
                st.write(f"**Summary:** {device.get('summary','')}")
                st.write(f"**Feature Scores:** {device.get('feature_scores','')}")
                st.write(f"**Fit Rating:** {device.get('fit_rating','')}% | **Regret Rating:** {device.get('regret_rating','')}%")
                st.write(f"**Reviews:** {device.get('reviews','')}")
                st.markdown("---")

if __name__ == "__main__":
    main()

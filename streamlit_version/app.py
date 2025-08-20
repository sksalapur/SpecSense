import streamlit as st
import json

# Device features and price ranges
device_features = {
    "Mobile": ["Camera", "Battery Life", "Performance", "Display Quality"],
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

def main():
    st.title("Device Suggester AI (Streamlit)")
    st.write("Find the perfect device tailored to your needs.")

    # Step 1: Device selection
    device_type = st.selectbox("Select device type", list(device_features.keys()))

    # Step 2: Feature preferences
    st.subheader("Set your feature preferences (1-5)")
    features = device_features[device_type]
    feature_prefs = {}
    for feat in features:
        feature_prefs[feat] = st.slider(f"{feat}", 1, 5, 3)

    # Step 3: Price range
    min_price, max_price, default_range = price_ranges[device_type]
    price_range = st.slider(
        "Select your price range (INR)",
        min_price, max_price, default_range
    )

    # Step 4: Suggest button
    if st.button("Suggest Devices"):
        st.info("(AI integration placeholder) Here you would call your AI model/API.")
        st.write("**Selected Device Type:**", device_type)
        st.write("**Feature Preferences:**", feature_prefs)
        st.write(f"**Price Range:** ₹{price_range[0]:,} - ₹{price_range[1]:,}")
        # Placeholder for AI results
        st.write("\n---\n**Sample Output:**")
        st.json([
            {
                "device_name": "Sample Device 1",
                "current_price_inr": 25000,
                "image_url": "https://images.unsplash.com/photo-...",
                "summary": "A great device for your needs.",
                "user_experience_note": "Users love the battery life.",
                "feature_scores": {feat.lower().replace(' ', '_'): 8.0 for feat in features},
                "fit_rating": 85,
                "regret_rating": 15
            }
        ])

if __name__ == "__main__":
    main()

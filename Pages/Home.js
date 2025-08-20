
'use client'

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { InvokeLLM } from '../integrations/Core';

import DeviceSelector from '../Components/DeviceSelector';
import FeatureSelector from '../Components/FeatureSelector';
import ResultsDisplay from '../Components/ResultsDisplay';
import { Sparkles, Bot } from 'lucide-react';

const DEVICE_FEATURES = {
  Mobile: ['Camera', 'Battery Life', 'Performance', 'Display Quality'],
  Tablet: ['Display Quality', 'Performance', 'Battery Life', 'Stylus Support'],
  TWS: ['Sound Quality', 'Battery Life', 'Noise Cancellation', 'Comfort & Fit'],
  TV: ['Picture Quality', 'Sound Quality', 'Smart Features', 'Gaming Performance'],
  'Smart-Watch': ['Fitness Tracking', 'Battery Life', 'Smart Features', 'Design'],
};

const PRICE_RANGES = {
  Mobile: { min: 5000, max: 150000, default: [10000, 50000] },
  Tablet: { min: 8000, max: 200000, default: [15000, 80000] },
  TWS: { min: 1000, max: 50000, default: [2000, 15000] },
  TV: { min: 15000, max: 500000, default: [25000, 100000] },
  'Smart-Watch': { min: 2000, max: 100000, default: [5000, 30000] },
};

export default function HomePage() {
  const [step, setStep] = useState(1);
  const [deviceType, setDeviceType] = useState(null);
  const [featurePreferences, setFeaturePreferences] = useState({});
  const [priceRange, setPriceRange] = useState([10000, 50000]);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const handleDeviceSelect = (type) => {
    setDeviceType(type);
    const initialPrefs = DEVICE_FEATURES[type].reduce((acc, feature) => {
      acc[feature] = 3; // Default preference
      return acc;
    }, {});
    setFeaturePreferences(initialPrefs);
    setPriceRange(PRICE_RANGES[type].default);
    setStep(2);
  };

  const handlePreferencesChange = (feature, value) => {
    setFeaturePreferences((prev) => ({ ...prev, [feature]: value }));
  };



  const handleSuggest = async () => {
    setIsLoading(true);
    setError(null);
    setResults(null);
    setStep(3);

    const preferencesString = Object.entries(featurePreferences)
      .map(([feature, value]) => `${feature} (Priority: ${value}/5)`)
      .join(', ');

    const features = DEVICE_FEATURES[deviceType];
    const featureList = features.map(f => f.toLowerCase().replace(/\s+/g, '_')).join(', ');

    const prompt = `
You are a tech expert. Recommend 3-5 ${deviceType}s available in India within the budget of ₹${priceRange[0].toLocaleString('en-IN')} - ₹${priceRange[1].toLocaleString('en-IN')}.

User preferences: ${preferencesString}

Features to evaluate: ${featureList}

Return a JSON array with this exact structure:
[
  {
    "device_name": "Device Name",
    "current_price_inr": 25000,
    "image_url": "https://images.unsplash.com/photo-...",
    "summary": "One paragraph explaining why this device is good for the user",
    "user_experience_note": "What users love or complain about",
    "feature_scores": {
      "camera": 8.5,
      "battery_life": 7.8,
      "performance": 8.2,
      "display_quality": 8.0
    },
    "fit_rating": 85,
    "regret_rating": 15
  }
]

Only recommend devices that are actually available in India within the specified budget. Use current 2024 prices.
    `;

    try {
      const response = await InvokeLLM({
        prompt,
        priceRange,
      });

      if (response && Array.isArray(response)) {
        setResults(response);
      } else {
        throw new Error("Invalid response format from AI.");
      }
    } catch (e) {
      console.error(e);
      setError("Failed to get recommendations. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleReset = () => {
    setStep(1);
    setDeviceType(null);
    setFeaturePreferences({});
    setPriceRange([10000, 50000]);
    setResults(null);
    setError(null);
    setIsLoading(false);
  }

  const currentFeatures = useMemo(() => deviceType ? DEVICE_FEATURES[deviceType] : [], [deviceType]);
  const currentPriceRange = useMemo(() => deviceType ? PRICE_RANGES[deviceType] : null, [deviceType]);

  return (
    <div className="container mx-auto px-4 py-8 md:py-16 max-w-5xl">
      <header className="text-center mb-12">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl md:text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-600"
        >
          Device Suggester AI
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-4 text-lg text-gray-400"
        >
          Find the perfect device tailored to your needs.
        </motion.p>
      </header>

      <div className="bg-gray-800/50 rounded-2xl shadow-2xl backdrop-blur-md border border-gray-700 p-6 md:p-10">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1">
              <DeviceSelector onSelect={handleDeviceSelect} />
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2">
              <FeatureSelector
                deviceType={deviceType}
                features={currentFeatures}
                preferences={featurePreferences}
                onPreferenceChange={handlePreferencesChange}
                priceRange={priceRange}
                priceRangeConfig={currentPriceRange}
                onPriceRangeChange={setPriceRange}
                onSubmit={handleSuggest}
                onBack={() => setStep(1)}
              />
            </motion.div>
          )}

          {(step === 3) && (
            <motion.div key="step3">
              <ResultsDisplay 
                isLoading={isLoading}
                results={results}
                error={error}
                onReset={handleReset}
                features={currentFeatures}
                priceRange={priceRange}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      

    </div>
  );
}

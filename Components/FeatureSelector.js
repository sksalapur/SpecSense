
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { Label } from './ui/label';
import { ArrowLeft, Wand2, IndianRupee } from 'lucide-react';

const sliderVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: i => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.08,
    }
  })
}

export default function FeatureSelector({ 
  deviceType, 
  features, 
  preferences, 
  onPreferenceChange, 
  priceRange, 
  priceRangeConfig, 
  onPriceRangeChange, 
  onSubmit, 
  onBack 
}) {
  return (
    <div>
      <div className="flex items-center mb-8">
        <Button variant="ghost" size="icon" onClick={onBack} className="mr-4 hover:bg-gray-700">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold text-white">Step 2: Set Your Preferences</h2>
          <p className="text-gray-400">Rate what's most important for your new {deviceType}.</p>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 p-6 bg-gradient-to-r from-green-900/20 to-blue-900/20 rounded-xl border border-green-500/30"
      >
        <div className="flex items-center gap-2 mb-4">
          <IndianRupee className="w-5 h-5 text-green-400" />
          <Label className="text-lg font-semibold text-green-300">Budget Range (INR)</Label>
        </div>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400 min-w-[80px]">₹{priceRangeConfig?.min.toLocaleString('en-IN')}</span>
            <Slider
              min={priceRangeConfig?.min}
              max={priceRangeConfig?.max}
              step={1000}
              value={priceRange}
              onValueChange={onPriceRangeChange}
              className="flex-1"
            />
            <span className="text-sm text-gray-400 min-w-[80px] text-right">₹{priceRangeConfig?.max.toLocaleString('en-IN')}</span>
          </div>
          <div className="text-center">
            <span className="text-xl font-bold text-white bg-green-600/20 px-4 py-2 rounded-lg border border-green-500/40">
              ₹{priceRange[0].toLocaleString('en-IN')} - ₹{priceRange[1].toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </motion.div>
      
      <div className="space-y-8">
        {features.map((feature, i) => (
          <motion.div
            key={feature}
            custom={i + 1}
            variants={sliderVariants}
            initial="hidden"
            animate="visible"
          >
            <Label htmlFor={feature} className="text-lg font-medium text-gray-300">{feature}</Label>
            <div className="flex items-center gap-4 mt-2">
              <span className="text-sm text-gray-500">Low</span>
              <Slider
                id={feature}
                min={1}
                max={5}
                step={1}
                value={[preferences[feature]]}
                onValueChange={(value) => onPreferenceChange(feature, value[0])}
              />
              <span className="text-sm text-gray-500">High</span>
              <span className="w-8 h-8 flex items-center justify-center rounded-full bg-indigo-500 text-white font-bold text-sm">
                {preferences[feature]}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
      
      <div className="mt-12 text-center">
        <Button 
          size="lg" 
          onClick={onSubmit} 
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg px-8 py-6 rounded-full shadow-lg shadow-indigo-500/20 transition-all duration-300 hover:scale-105"
        >
          <Wand2 className="w-5 h-5 mr-3" />
          Find My Perfect Device
        </Button>
      </div>
    </div>
  );
}

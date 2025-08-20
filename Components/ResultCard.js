
import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from './ui/badge';
import { TrendingUp, TrendingDown, Star, MessageCircle, IndianRupee } from 'lucide-react';
import { Progress } from './ui/progress';

const getRatingColor = (value) => {
    if (value >= 80) return "bg-green-500";
    if (value >= 60) return "bg-yellow-500";
    return "bg-red-500";
};

export default function ResultCard({ result, features }) {
  const { device_name, current_price_inr, image_url, summary, user_experience_note, feature_scores, fit_rating, regret_rating } = result;

  return (
    <motion.div
      whileHover={{ y: -5, boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.2)" }}
      className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 h-full flex flex-col"
    >
      <div className="relative h-48">
        <img src={image_url} alt={device_name} className="w-full h-full object-cover" />
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-gray-800 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-xl font-bold text-white mb-2">{device_name}</h3>
          <div className="flex items-center gap-1 bg-green-600/90 px-3 py-1 rounded-full w-fit">
            <IndianRupee className="w-4 h-4 text-white" />
            <span className="font-bold text-white">{current_price_inr?.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>
      
      <div className="p-6 flex-grow">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-700/50 p-3 rounded-lg text-center">
            <div className="flex items-center justify-center text-green-400 mb-1">
              <TrendingUp className="w-5 h-5 mr-2" />
              <p className="font-semibold">Fit Rating</p>
            </div>
            <p className="text-3xl font-bold text-white">{fit_rating}%</p>
            <Progress value={fit_rating} className="h-1 mt-2 [&>*]:bg-green-500" />
          </div>
          <div className="bg-gray-700/50 p-3 rounded-lg text-center">
            <div className="flex items-center justify-center text-red-400 mb-1">
              <TrendingDown className="w-5 h-5 mr-2" />
              <p className="font-semibold">Regret Rating</p>
            </div>
            <p className="text-3xl font-bold text-white">{regret_rating}%</p>
            <Progress value={regret_rating} className="h-1 mt-2 [&>*]:bg-red-500" />
          </div>
        </div>

        <div className="space-y-3 mb-6">
          {features.map((feature) => {
            const scoreKey = feature.replace(/\s+/g, '_').toLowerCase();
            const score = feature_scores[scoreKey] || 0;
            return (
              <div key={feature} className="flex justify-between items-center">
                <span className="font-medium text-gray-300">{feature}</span>
                <div className="flex items-center gap-2">
                   <Progress value={score * 10} className="w-24 h-1.5" />
                  <span className="font-bold w-8 text-right">{score.toFixed(1)}</span>
                </div>
              </div>
            );
          })}
        </div>

        <p className="text-gray-400 text-sm leading-relaxed mb-4">{summary}</p>

        {user_experience_note && (
          <div className="bg-blue-900/30 border border-blue-700/50 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <MessageCircle className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs font-medium text-blue-300 mb-1">User Experience</p>
                <p className="text-sm text-blue-100">{user_experience_note}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

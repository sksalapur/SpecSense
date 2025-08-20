
import React from 'react';
import { motion } from 'framer-motion';
import { Smartphone, Tablet, Headphones, Tv, Watch } from 'lucide-react';

const devices = [
  { name: 'Mobile', icon: Smartphone },
  { name: 'Tablet', icon: Tablet },
  { name: 'TWS', icon: Headphones },
  { name: 'TV', icon: Tv },
  { name: 'Smart-Watch', icon: Watch },
];

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: i => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: "easeOut"
    }
  }),
  hover: {
    scale: 1.05,
    boxShadow: "0px 10px 30px rgba(79, 70, 229, 0.3)",
    transition: { duration: 0.2 }
  }
};

export default function DeviceSelector({ onSelect }) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-center mb-2 text-white">Step 1: Choose a Device Type</h2>
      <p className="text-center text-gray-400 mb-8">What are you looking for today?</p>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
        {devices.map((device, i) => (
          <motion.div
            key={device.name}
            custom={i}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            className="cursor-pointer bg-gray-800 rounded-xl p-6 text-center border border-gray-700 hover:border-indigo-500 transition-colors duration-300"
            onClick={() => onSelect(device.name)}
          >
            <device.icon className="w-12 h-12 mx-auto text-indigo-400 mb-4" />
            <h3 className="font-semibold text-lg text-gray-200">{device.name}</h3>
          </motion.div>
        ))}
      </div>
      <p className="text-center text-gray-500 mt-8 text-sm">
        More categories like IEMs, Headphones, Soundbars, and more coming soon!
      </p>
    </div>
  );
}

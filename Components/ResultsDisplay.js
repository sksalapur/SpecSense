
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Loader2, ServerCrash, RotateCcw, IndianRupee } from 'lucide-react';
import ResultCard from './ResultCard';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function ResultsDisplay({ isLoading, results, error, onReset, features, priceRange }) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center text-center h-64">
        <Loader2 className="w-12 h-12 text-indigo-400 animate-spin mb-4" />
        <h3 className="text-xl font-semibold text-white">Analyzing the Market...</h3>
        <p className="text-gray-400 mt-2">Our AI is scanning reviews and specs to find your perfect match.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center text-center h-64">
        <Alert variant="destructive" className="max-w-md">
          <ServerCrash className="h-4 w-4" />
          <AlertTitle>Oops! Something went wrong.</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button onClick={onReset} variant="outline" className="mt-6">
          <RotateCcw className="w-4 h-4 mr-2" />
          Start Over
        </Button>
      </div>
    );
  }

  if (!results) {
    return null; // Initial state before loading
  }

  return (
    <div>
        <div className="flex items-center justify-between mb-8">
            <div>
                <h2 className="text-3xl font-bold text-white">Here Are Your Recommendations</h2>
                <p className="text-gray-400 flex items-center gap-1 mt-1">
                  Within your budget of 
                  <IndianRupee className="w-4 h-4" />
                  {priceRange[0].toLocaleString('en-IN')} - 
                  <IndianRupee className="w-4 h-4" />
                  {priceRange[1].toLocaleString('en-IN')}
                </p>
            </div>
            <Button onClick={onReset} variant="outline" className="hover:bg-gray-700 hover:text-white">
                <RotateCcw className="w-4 h-4 mr-2" />
                Start Over
            </Button>
        </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        <AnimatePresence>
          {results.map((result, index) => (
            <motion.div key={result.device_name} variants={itemVariants}>
              <ResultCard result={result} features={features} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

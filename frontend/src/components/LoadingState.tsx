import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Loader2, Brain, Activity, ShieldAlert } from 'lucide-react';

export const LoadingState: React.FC = () => {
  const steps = [
    { text: 'Analyzing customer behavior...', icon: Activity },
    { text: 'Calculating churn risk...', icon: ShieldAlert },
    { text: 'Preparing retention intelligence...', icon: Brain },
  ];

  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const timer1 = setTimeout(() => setCurrentStep(1), 1200);
    const timer2 = setTimeout(() => setCurrentStep(2), 2600);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const CurrentIcon = steps[currentStep].icon;

  return (
    <div
      id="customer-analysis-loading-state"
      className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-slate-900/60 p-12 text-center backdrop-blur-sm"
    >
      <div className="relative flex items-center justify-center">
        {/* Subtle glowing ring */}
        <div className="h-16 w-16 rounded-full bg-indigo-500/10 animate-ping absolute" />
        <div className="flex h-14 w-14 items-center justify-center rounded-full border border-indigo-500/30 bg-slate-800/80 text-indigo-400 shadow-lg shadow-indigo-500/10">
          <Loader2 className="h-7 w-7 animate-spin text-indigo-400" />
        </div>
      </div>

      <div className="mt-6 h-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3 }}
            className="flex items-center justify-center gap-2"
          >
            <CurrentIcon className="h-4 w-4 text-indigo-400" />
            <p className="text-base font-medium text-slate-200">
              {steps[currentStep].text}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      <p className="text-xs text-slate-400 max-w-sm">
        Running behavioral telemetry through the CustomerIQ churn estimation and evidence matching pipeline...
      </p>

      {/* Progress Dots */}
      <div className="mt-6 flex items-center gap-2">
        {steps.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i <= currentStep ? 'w-6 bg-indigo-500' : 'w-1.5 bg-slate-700'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

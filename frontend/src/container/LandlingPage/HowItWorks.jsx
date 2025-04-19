import React from "react";
import { Search, BrainCircuit, TrendingUp, Briefcase } from "lucide-react";

const steps = [
  {
    icon: <Search className="w-6 h-6 text-[#00FFA3]" />,
    title: "Analyze Trends",
    desc: "Our AI scans vast market and alternative data sources.",
  },
  {
    icon: <BrainCircuit className="w-6 h-6 text-[#00FFA3]" />,
    title: "Predict Prices",
    desc: "Advanced ML models forecast future stock movements.",
  },
  {
    icon: <TrendingUp className="w-6 h-6 text-[#00FFA3]" />,
    title: "Make Informed Decisions",
    desc: "Access predictions with confidence.",
  },
  {
    icon: <Briefcase className="w-6 h-6 text-[#00FFA3]" />,
    title: "Track Your Portfolio",
    desc: "Monitor performance and refine strategies.",
  },
];

const HowItWorks = () => {
  return (
    <section className="bg-slate-900 py-16 px-6 text-white">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4">How It Works</h2>
        <span className="w-3/4 mx-auto  bg-white"/>
        <p className="text-gray-400 mb-12">Our AI-powered investment assistant in 4 simple steps.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="bg-slate-800 p-6 rounded-2xl border border-white/5 hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#00FFA3]/10 mb-4 mx-auto">
                {step.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
              <p className="text-sm text-gray-400">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;

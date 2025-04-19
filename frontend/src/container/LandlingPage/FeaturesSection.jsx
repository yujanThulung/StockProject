import React from "react";
import {
  BarChart3,
  Globe,
  CalendarDays,
  BellRing,
  Smartphone,
} from "lucide-react";

const features = [
  {
    icon: <BarChart3 className="w-6 h-6 text-[#00FFA3]" />,
    title: "AI-Powered Forecasts",
    desc: "Real-time predictions with high accuracy.",
  },
  {
    icon: <Globe className="w-6 h-6 text-[#00FFA3]" />,
    title: "Alternative Data Integration",
    desc: "Sentiment analysis, trends, and more.",
  },
  {
    icon: <CalendarDays className="w-6 h-6 text-[#00FFA3]" />,
    title: "Daily Market Insights",
    desc: "Stay updated with top gainers/losers.",
  },
  {
    icon: <BellRing className="w-6 h-6 text-[#00FFA3]" />,
    title: "Smart Alerts",
    desc: "Get notified when conditions meet your criteria.",
  },
  {
    icon: <Smartphone className="w-6 h-6 text-[#00FFA3]" />,
    title: "Mobile-Ready Dashboard",
    desc: "Trade and track on the go.",
  },
];

const FeaturesSection = () => {
  return (
    <section className="bg-slate-900 py-20 px-6 text-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold mb-4">Powerful Features at Your Fingertips</h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            Everything you need to make smarter investment decisions, powered by AI and real-time data.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-slate-800 rounded-2xl p-6 border border-white/5 hover:shadow-[0_0_20px_#00FFA3] transition-shadow duration-300"
            >
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#00FFA3]/10 mb-4">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-400">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;

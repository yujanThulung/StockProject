import React from "react";
import {
  ShieldCheck,
  Users,
  BrainCircuit,
  Newspaper,
} from "lucide-react";

const badges = [
  {
    icon: <Newspaper size={20} className="text-[#00FFA3]" />,
    text: "Featured in TechCrunch",
  },
  {
    icon: <Users size={20} className="text-[#00FFA3]" />,
    text: "1000+ Active Users",
  },
  {
    icon: <ShieldCheck size={20} className="text-[#00FFA3]" />,
    text: "Secured with 256-bit Encryption",
  },
  {
    icon: <BrainCircuit size={20} className="text-[#00FFA3]" />,
    text: "Powered by GPT, ML & NLP",
  },
];

const TrustBadges = () => {
  return (
    <section className="bg-slate-900 py-10 px-6">
      <div className="max-w-6xl mx-auto text-center">
        <div className="flex flex-wrap justify-center gap-4">
          {badges.map((badge, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 bg-[#1b2028] border border-white/5 text-white text-sm px-4 py-2 rounded-full shadow hover:shadow-[0_0_10px_#00FFA3] transition-shadow"
            >
              {badge.icon}
              <span>{badge.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustBadges;

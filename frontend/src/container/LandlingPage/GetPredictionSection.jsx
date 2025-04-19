import React from "react";
import getPredictionImage1 from "../../assets/prediction1.jpg";
import getPredictionImage2 from "../../assets/prediction2.jpg";

const GetPredictionSection = () => {
    return (
        <section className="bg-slate-900 py-24 px-6 text-white relative">
            <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-16">
                {/* Left: Dual Images */}
                <div className="flex gap-4 w-full lg:w-1/2 justify-center">
                    {/* First Image with Overlay */}
                    <div className="relative w-[270px] h-[410px] rounded-lg overflow-hidden">
                        <img
                            src={getPredictionImage1}
                            alt="Prediction Visual 1"
                            className="w-full h-full object-cover rounded-lg"
                        />
                        <div className="absolute inset-0 bg-green-200 opacity-20 rounded-lg pointer-events-none" />
                    </div>

                    {/* Second Image with Overlay */}
                    <div className="relative w-[270px] h-[410px] rounded-lg overflow-hidden mt-20">
                        <img
                            src={getPredictionImage2}
                            alt="Prediction Visual 2"
                            className="w-full h-full object-cover rounded-lg"
                        />
                        <div className="absolute inset-0 bg-green-200 opacity-20 rounded-lg pointer-events-none" />
                    </div>
                </div>

                {/* Right: Text + CTA */}
                <div className="w-full lg:w-1/2">
                    <h2 className="text-3xl font-bold mb-6 leading-snug">
                        Predict Smarter, Invest Better
                    </h2>
                    <p className="text-gray-400 mb-8 text-sm leading-relaxed">
                        Utilize the power of AI to generate predictions based on real-time and
                        alternative market data. Gain the edge you need to make timely, confident
                        decisions.
                    </p>
                    <a
                        href="/stock-prediction"
                        className="inline-block bg-[#00FFA3] text-black font-semibold text-sm px-6 py-3 rounded-lg hover:opacity-90 transition"
                    >
                        Get Prediction Now →
                    </a>
                </div>
            </div>
        </section>
    );
};

export default GetPredictionSection;

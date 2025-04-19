import React from "react";
import heroImage from "../assets/heroImage.png";

const HomePage = () => {
    return (
        <section className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center py-20 gap-14">
            {/* Text */}
            <div className="max-w-xl text-left">
                <h1 className="text-4xl md:text-6xl font-bold leading-tight text-white">
                    Make <span className="text-green-500">Better</span> Investment Decisions With{" "}
                    <span className="text-green-500">Alternative</span> Data
                </h1>
            </div>

            {/* Image + Shadow */}
            <div className="relative mt-10 md:mt-0">
            <div className="absolute top-[-10%] left-[-10%] h-30 w-30 rounded-full z-20 bg-green-500/20 backdrop-blur-[4px] shadow-lg" />
            <div className="absolute top-100 right-[-5%] h-20 w-20 rounded-full z-20 bg-white/10 backdrop-blur-[4px] shadow-lg" />
                {/* Blurred Shadow Image (Background Glow) */}
                <img
                    src={heroImage}
                    alt="Hero Blur"
                    className="w-full max-w-md md:max-w-xl object-cover absolute z-0 rounded-xl inset-0 left-30 top-10 blur-[1px] opacity-40 "
                />

                {/* Main Image */}
                <img
                    src={heroImage}
                    alt="Hero"
                    className="w-full max-w-md md:max-w-xl object-cover relative z-10 rounded-xl"
                />
            </div>
        </section>
    );
};

export default HomePage;

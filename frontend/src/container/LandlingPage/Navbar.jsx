import React from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/logo1.png";

const navLinks = [
    { name: "Home", path: "/" },
    { name: "Stock Prediction", path: "/dashboard/stock-prediction" },
    { name: "Login", path: "/login" },
    { name: "Register", path: "/register" },
];

const Navbar = () => {
    return (
        <nav className="bg-gray-900 shadow-md ">
            <div className="max-w-7xl mx-auto px-4 flex justify-between items-center z-50">
                {/* Logo */}
                <Link to="/" className="flex items-center">
                    <img
                        src={logo}
                        alt="Company Logo"
                        className="w-26 h-26 object-contain hover:opacity-80 transition-opacity"
                    />
                </Link>

                {/* Nav Links */}
                <div className="flex gap-6 items-center">
                    {navLinks.map((link) => (
                        <Link
                        key={link.name}
                        to={link.path}
                        // Add 'group' and 'relative' for positioning the pseudo-element
                        className="group text-white font-medium relative transition-colors duration-200"
                      >
                        {/* The actual link text */}
                        <span className="hover:text-green-300">{link.name}</span>
                  
                        {/* The underline pseudo-element */}
                        <span
                          className="absolute bottom-0 left-0 h-0.5 bg-green-300 w-0 
                                     group-hover:w-full transition-all duration-300 ease-in-out"
                        ></span>
                      </Link>
                    ))}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

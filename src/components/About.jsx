import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AboutUsBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const stats = [
    { number: "15+", label: "Years Experience" },
    { number: "500+", label: "Properties Managed" },
    { number: "2M+", label: "Sq. Ft. Leased" },
    { number: "100%", label: "Client Satisfaction" }
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-gray-900 pt-10">
      {/* Background Image with Parallax */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          transform: `translateY(${scrollY * 0.5}px)`,
          transition: 'transform 0.1s ease-out'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/20 via-gray-900/60 to-gray-900/20 z-10"></div>
        <img 
          src='/osG2.jpg' 
          alt="Modern Office Space"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Animated Geometric Shapes */}
      <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none">
        <div 
          className="absolute top-20 right-20 w-64 h-64 border-4 border-blue-500/20 rounded-full"
          style={{
            animation: 'float 8s ease-in-out infinite',
            animationDelay: '0s'
          }}
        ></div>
        <div 
          className="absolute bottom-40 left-20 w-48 h-48 border-4 border-[#1C244B]/20"
          style={{
            animation: 'float 6s ease-in-out infinite',
            animationDelay: '1s'
          }}
        ></div>
        <div 
          className="absolute top-1/2 left-1/3 w-32 h-32 border-4 border-blue-300/20 rotate-45"
          style={{
            animation: 'float 7s ease-in-out infinite',
            animationDelay: '2s'
          }}
        ></div>
      </div>

      {/* Content */}
      <div className="relative z-20 flex flex-col items-center justify-center min-h-screen px-6 py-20">
        
        {/* Main Heading */}
        <div className="text-center mb-16">
          <div 
            className={`transform transition-all duration-1000 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
          >
            <p className="text-[#1C244B] text-sm font-semibold tracking-widest mb-4 uppercase">
              About Us
            </p>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight">
              Building Your
              <br />
              <span className="text-transparent bg-clip-text bg-blue-600">
                Business Future
              </span>
            </h1>
          </div>
          
          <div 
            className={`transform transition-all duration-1000 delay-300 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
          >
            <p className="text-gray-200 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
              We are a premier commercial real estate company dedicated to providing 
              exceptional office spaces, managed facilities, and warehouse solutions 
              that empower businesses to thrive.
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div 
          className={`grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mb-20 transform transition-all duration-1000 delay-500 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="text-center group"
              style={{
                animation: `fadeInUp 0.8s ease-out ${0.6 + index * 0.1}s both`
              }}
            >
              <div className="relative">
                <h3 className="text-4xl md:text-5xl font-bold text-white mb-2 group-hover:scale-110 transition-transform duration-300">
                  {stat.number}
                </h3>
                <div className="h-1 w-16 bg-gradient-to-r from-[#1C244B] to-blue-600 mx-auto mb-3 group-hover:w-20 transition-all duration-300"></div>
                <p className="text-gray-100 text-sm md:text-base uppercase tracking-wide">
                  {stat.label}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div 
          className={`flex flex-col sm:flex-row gap-4 mb-16 transform transition-all duration-1000 delay-700 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          <Link to="/properties" className="inline-block">
          <button className="px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-blue-500/50">
            Explore Our Properties
          </button>
          </Link>
          <Link to="/contact" className="inline-block">
          <button className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-lg border-2 border-white/30 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
            Contact Our Team
          </button>
          </Link>
        </div>

        {/* Scroll Indicator */}
        <div 
          className={`flex flex-col items-center transform transition-all duration-1000 delay-1000 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          <p className="text-gray-400 text-sm mb-2 tracking-wider">Scroll to explore</p>
          <ChevronDown 
            className="w-6 h-6 text-[#1C244B] animate-bounce" 
          />
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(5deg);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
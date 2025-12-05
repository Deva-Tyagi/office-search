import React, { useState, useEffect, useRef } from 'react';
import { Building2, Briefcase, FileText, TrendingUp, Phone, Mail } from 'lucide-react';

export default function PrimeDestinationSection() {
  const [counts, setCounts] = useState({
    sqft: 0,
    properties: 0,
    clients: 0,
    leases: 0
  });
  const [hasAnimated, setHasAnimated] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          animateCounters();
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated]);

  const animateCounters = () => {
    const targets = {
      sqft: 2000000,
      properties: 350,
      clients: 850,
      leases: 12000
    };

    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;

    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;

      setCounts({
        sqft: Math.floor(targets.sqft * progress),
        properties: Math.floor(targets.properties * progress),
        clients: Math.floor(targets.clients * progress),
        leases: Math.floor(targets.leases * progress)
      });

      if (step >= steps) {
        clearInterval(timer);
        setCounts(targets);
      }
    }, interval);
  };

  const formatNumber = (num) => {
    return num.toLocaleString();
  };

  const stats = [
    {
      icon: <Building2 className="w-12 h-12" />,
      number: formatNumber(counts.sqft),
      label: "SQUARE FEET",
      suffix: "+"
    },
    {
      icon: <Briefcase className="w-12 h-12" />,
      number: formatNumber(counts.properties),
      label: "PROPERTIES LEASED",
      suffix: "+"
    },
    {
      icon: <FileText className="w-12 h-12" />,
      number: formatNumber(counts.clients),
      label: "CORPORATE CLIENTS",
      suffix: "+"
    },
    {
      icon: <TrendingUp className="w-12 h-12" />,
      number: formatNumber(counts.leases),
      label: "ACTIVE LEASES",
      suffix: "+"
    }
  ];

  return (
    <div ref={sectionRef} className="bg-gray-100 py-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-sm font-semibold tracking-widest mb-4" style={{ color: '#1C244B' }}>
            PRIME DESTINATION
          </p>
          <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: '#1C244B' }}>
            Modern & Luxury Commercial Property
          </h2>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto leading-relaxed">
            Discover premium commercial spaces designed for success. From state-of-the-art offices 
            to strategic warehouses, we deliver exceptional real estate solutions for growing businesses.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="bg-white p-8 rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="flex items-start gap-4">
                <div style={{ color: '#1C244B' }}>
                  {stat.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-4xl font-bold mb-2" style={{ color: '#1C244B' }}>
                    {stat.number}{stat.suffix}
                  </h3>
                  <p className="text-sm font-semibold tracking-wide" style={{ color: '#1C244B' }}>
                    {stat.label}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-6">
          <button 
            className="text-white px-8 py-4 rounded font-semibold hover:opacity-90 transition-opacity flex items-center gap-2"
            style={{ backgroundColor: '#1C244B' }}
          >
            GET IN TOUCH →
          </button>

          <div className="flex items-center gap-3">
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ backgroundColor: '#1C244B' }}
            >
              <Phone className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold" style={{ color: '#1C244B' }}>
                Call Us Anytime
              </p>
              <p className="text-gray-600">+91 9205596640</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ backgroundColor: '#1C244B' }}
            >
              <Mail className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold" style={{ color: '#1C244B' }}>
                Email Us Anytime
              </p>
              <p className="text-gray-600">info@officesearch.in</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
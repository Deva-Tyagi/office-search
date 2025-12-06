import React, { useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import projectsData from '../data/projects.json';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const FilteredByCombined = () => {
  const [searchParams] = useSearchParams();
  const location = searchParams.get('location');
  const type = searchParams.get('type');
  const mode = searchParams.get('mode') || 'lease';
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const cardsRef = useRef([]);
  const breadcrumbRef = useRef(null);
  const statsRef = useRef(null);

  const filtered = projectsData.filter(p => 
    p.location === location && 
    (p.type === type || p.category === type) && 
    p.availableFor.includes(mode)
  );

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const ctx = gsap.context(() => {
      // Breadcrumb animation
      gsap.fromTo(breadcrumbRef.current,
        { y: -20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: 'power2.out'
        }
      );

      // Heading animation
      gsap.fromTo(headingRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          delay: 0.2,
          ease: 'power2.out'
        }
      );

      // Stats animation
      if (statsRef.current) {
        gsap.fromTo(statsRef.current,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            delay: 0.4,
            ease: 'power2.out'
          }
        );
      }

      // Cards batch animation
      if (cardsRef.current.length > 0) {
        ScrollTrigger.batch(cardsRef.current, {
          onEnter: batch => {
            gsap.fromTo(batch,
              { y: 60, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: 0.6,
                stagger: 0.1,
                ease: 'power2.out',
                overwrite: 'auto'
              }
            );
          },
          start: 'top 90%',
          once: true
        });
      }

    }, sectionRef);

    return () => ctx.revert();
  }, [location, type, mode]);

  const handleCardHover = useCallback((e, isEntering) => {
    const card = e.currentTarget;
    
    if (isEntering) {
      gsap.to(card, { 
        y: -10,
        duration: 0.3,
        ease: 'power2.out'
      });
    } else {
      gsap.to(card, { 
        y: 0,
        duration: 0.3,
        ease: 'power2.out'
      });
    }
  }, []);

  const handleButtonClick = useCallback((e) => {
    e.stopPropagation();
    gsap.to(e.currentTarget, {
      scale: 0.95,
      duration: 0.1,
      yoyo: true,
      repeat: 1
    });
  }, []);

  return (
    <section ref={sectionRef} className="py-24 bg-gray-50 min-h-screen" style={{ marginTop: '80px' }}>
      <div className="container mx-auto px-6">
        {/* Breadcrumb */}
        <div ref={breadcrumbRef} className="flex items-center gap-2 text-sm mb-8 flex-wrap">
          <a href="/" className="text-[#1C244B] hover:underline font-medium">Home</a>
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-gray-600">Search Results</span>
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-[#1C244B] font-semibold">{location} • {type} • {mode.toUpperCase()}</span>
        </div>

        {/* Heading */}
        <div ref={headingRef} className="text-center mb-8">
          <h2 className="text-4xl md:text-5xl font-bold text-[#1C244B] mb-4">
            {type} Properties in {location}
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Available for <span className="font-semibold text-[#1C244B]">{mode.toUpperCase()}</span>
          </p>
        </div>

        {/* Results Stats */}
        {filtered.length > 0 && (
          <div ref={statsRef} className="bg-white rounded-2xl shadow-md p-6 mb-12 flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#1C244B]/10 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-[#1C244B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-600">Search Results</p>
                <p className="text-2xl font-bold text-[#1C244B]">{filtered.length} {filtered.length === 1 ? 'Property' : 'Properties'}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button className="px-4 py-2 bg-[#1C244B]/5 text-[#1C244B] rounded-xl font-semibold hover:bg-[#1C244B]/10 transition-colors duration-300">
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                  Filter
                </span>
              </button>
              <button className="px-4 py-2 bg-[#1C244B]/5 text-[#1C244B] rounded-xl font-semibold hover:bg-[#1C244B]/10 transition-colors duration-300">
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                  </svg>
                  Sort
                </span>
              </button>
            </div>
          </div>
        )}

        {/* Results Grid or Empty State */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-block p-8 bg-white rounded-3xl shadow-lg mb-6">
              <svg className="w-24 h-24 text-gray-300 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-3xl font-bold text-[#1C244B] mb-4">No Properties Found</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              We couldn't find any properties matching your criteria in <span className="font-semibold">{location}</span> for <span className="font-semibold">{type}</span>.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <a 
                href="/" 
                className="px-8 py-3 bg-[#1C244B] text-white rounded-xl font-semibold hover:bg-[#2a3561] transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Back to Home
              </a>
              <a 
                href="#enquiry" 
                className="px-8 py-3 bg-white text-[#1C244B] border-2 border-[#1C244B] rounded-xl font-semibold hover:bg-[#1C244B] hover:text-white transition-all duration-300"
              >
                Contact Us
              </a>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((p, i) => (
              <div 
                key={p.id} 
                ref={el => cardsRef.current[i] = el}
                onMouseEnter={(e) => handleCardHover(e, true)}
                onMouseLeave={(e) => handleCardHover(e, false)}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl group cursor-pointer relative border border-gray-100 transition-shadow duration-300"
              >
                {/* Image container */}
                <div className="relative h-64 overflow-hidden bg-gray-200">
                  <img 
                    src={p.image} 
                    alt={p.name} 
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" 
                    loading="lazy"
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Type badge */}
                  <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full">
                    <span className="text-[#1C244B] font-semibold text-xs">{p.type}</span>
                  </div>

                  {/* Availability badges */}
                  <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
                    {p.availableFor.map((availability, idx) => (
                      <span 
                        key={idx}
                        className="bg-[#1C244B]/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium"
                      >
                        {availability}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-[#1C244B] mb-2 group-hover:text-[#2a3561] transition-colors duration-300">
                    {p.name}
                  </h3>
                  
                  <div className="flex items-center gap-2 text-gray-600 mb-3">
                    <svg className="w-4 h-4 text-[#1C244B] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    <p className="text-sm font-medium">{p.location}, Noida</p>
                  </div>

                  <div className="flex items-baseline gap-2 mb-4">
                    <svg className="w-5 h-5 text-[#1C244B] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v14a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM16 5a1 1 0 011-1h2a1 1 0 011 1v14a1 1 0 01-1 1h-2a1 1 0 01-1-1V5z" />
                    </svg>
                    <p className="sm:text-md lg:text-xl font-bold text-[#1C244B]">{p.size}</p>
                  </div>

                  <button 
                    onClick={handleButtonClick}
                    className="w-full bg-[#1C244B] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#2a3561] transition-all duration-300 flex items-center justify-center gap-2 group/btn mt-4"
                  >
                    <span>View Details</span>
                    <svg className="w-5 h-5 transform group-hover/btn:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>

                {/* Bottom accent bar */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#1C244B] to-[#2a3561] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FilteredByCombined;

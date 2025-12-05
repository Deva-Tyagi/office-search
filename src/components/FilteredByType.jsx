import React, { useEffect, useRef, useCallback, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import projectsData from '../data/projects.json';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const FilteredByType = () => {
  const [searchParams] = useSearchParams();
  const type = searchParams.get('type');
  const mode = searchParams.get('mode') || 'lease';
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const cardsRef = useRef([]);
  const breadcrumbRef = useRef(null);
  const statsRef = useRef(null);

  // State for filter and sort
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [sortBy, setSortBy] = useState('default');

  // Get initial filtered data
  const initialFiltered = projectsData.filter(p => 
    (p.type === type || p.category === type) && p.availableFor.includes(mode)
  );

  // Get unique locations and sizes for filter options
  const uniqueLocations = [...new Set(initialFiltered.map(p => p.location))];
  const uniqueSizes = [...new Set(initialFiltered.map(p => p.size))];

  // Apply filters and sorting
  const getFilteredAndSortedData = () => {
    let result = [...initialFiltered];

    // Apply location filter
    if (selectedLocations.length > 0) {
      result = result.filter(p => selectedLocations.includes(p.location));
    }

    // Apply size filter
    if (selectedSizes.length > 0) {
      result = result.filter(p => selectedSizes.includes(p.size));
    }

    // Apply sorting
    switch (sortBy) {
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'location-asc':
        result.sort((a, b) => a.location.localeCompare(b.location));
        break;
      case 'location-desc':
        result.sort((a, b) => b.location.localeCompare(a.location));
        break;
      case 'size-asc':
        result.sort((a, b) => {
          const sizeA = parseInt(a.size.replace(/[^0-9]/g, ''));
          const sizeB = parseInt(b.size.replace(/[^0-9]/g, ''));
          return sizeA - sizeB;
        });
        break;
      case 'size-desc':
        result.sort((a, b) => {
          const sizeA = parseInt(a.size.replace(/[^0-9]/g, ''));
          const sizeB = parseInt(b.size.replace(/[^0-9]/g, ''));
          return sizeB - sizeA;
        });
        break;
      default:
        break;
    }

    return result;
  };

  const filtered = getFilteredAndSortedData();

  // Handle location filter toggle
  const toggleLocation = (location) => {
    setSelectedLocations(prev => 
      prev.includes(location)
        ? prev.filter(l => l !== location)
        : [...prev, location]
    );
  };

  // Handle size filter toggle
  const toggleSize = (size) => {
    setSelectedSizes(prev => 
      prev.includes(size)
        ? prev.filter(s => s !== size)
        : [...prev, size]
    );
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedLocations([]);
    setSelectedSizes([]);
  };

  // Handle sort selection
  const handleSort = (sortOption) => {
    setSortBy(sortOption);
    setShowSortMenu(false);
  };

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
  }, [type, mode, selectedLocations, selectedSizes, sortBy]);

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
          <span className="text-[#1C244B] font-semibold">{type} • {mode.toUpperCase()}</span>
        </div>

        {/* Heading */}
        <div ref={headingRef} className="text-center mb-8">
          <h2 className="text-4xl md:text-5xl font-bold text-[#1C244B] mb-4">
            {type} Properties
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Available for <span className="font-semibold text-[#1C244B]">{mode.toUpperCase()}</span>
          </p>
        </div>

        {/* Results Stats */}
        {initialFiltered.length > 0 && (
          <div ref={statsRef} className="bg-white rounded-2xl shadow-md p-6 mb-12 flex items-center justify-between flex-wrap gap-4 relative z-50">
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
            <div className="flex gap-3 relative z-10">
              {/* Filter Button */}
              <div className="relative">
                <button 
                  onClick={() => {
                    setShowFilterMenu(!showFilterMenu);
                    setShowSortMenu(false);
                  }}
                  className="px-4 py-2 bg-[#1C244B]/5 text-[#1C244B] rounded-xl font-semibold hover:bg-[#1C244B]/10 transition-colors duration-300 relative"
                >
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                    </svg>
                    Filter
                    {(selectedLocations.length > 0 || selectedSizes.length > 0) && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {selectedLocations.length + selectedSizes.length}
                      </span>
                    )}
                  </span>
                </button>

                {/* Filter Dropdown */}
                {showFilterMenu && (
                  <div className="absolute top-full right-0 mt-2 bg-white rounded-xl shadow-2xl p-6 z-[100] w-80 border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-[#1C244B]">Filters</h3>
                      <button 
                        onClick={clearFilters}
                        className="text-sm text-red-500 hover:text-red-600 font-semibold"
                      >
                        Clear All
                      </button>
                    </div>

                    {/* Location Filter */}
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-gray-700 mb-3">Location</h4>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {uniqueLocations.map(location => (
                          <label key={location} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded-lg">
                            <input 
                              type="checkbox"
                              checked={selectedLocations.includes(location)}
                              onChange={() => toggleLocation(location)}
                              className="w-4 h-4 text-[#1C244B] border-gray-300 rounded focus:ring-[#1C244B]"
                            />
                            <span className="text-sm text-gray-700">{location}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Size Filter */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-3">Size</h4>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {uniqueSizes.map(size => (
                          <label key={size} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded-lg">
                            <input 
                              type="checkbox"
                              checked={selectedSizes.includes(size)}
                              onChange={() => toggleSize(size)}
                              className="w-4 h-4 text-[#1C244B] border-gray-300 rounded focus:ring-[#1C244B]"
                            />
                            <span className="text-sm text-gray-700">{size}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <button 
                      onClick={() => setShowFilterMenu(false)}
                      className="w-full mt-6 bg-[#1C244B] text-white px-4 py-2 rounded-xl font-semibold hover:bg-[#2a3561] transition-colors duration-300"
                    >
                      Apply Filters
                    </button>
                  </div>
                )}
              </div>

              {/* Sort Button */}
              <div className="relative">
                <button 
                  onClick={() => {
                    setShowSortMenu(!showSortMenu);
                    setShowFilterMenu(false);
                  }}
                  className="px-4 py-2 bg-[#1C244B]/5 text-[#1C244B] rounded-xl font-semibold hover:bg-[#1C244B]/10 transition-colors duration-300"
                >
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                    </svg>
                    Sort
                  </span>
                </button>

                {/* Sort Dropdown */}
                {showSortMenu && (
                  <div className="absolute top-full right-0 mt-2 bg-white rounded-xl shadow-2xl p-4 z-[100] w-64 border border-gray-100">
                    <h3 className="text-lg font-bold text-[#1C244B] mb-3">Sort By</h3>
                    <div className="space-y-1">
                      <button 
                        onClick={() => handleSort('default')}
                        className={`w-full text-left px-4 py-2 rounded-lg transition-colors duration-200 ${sortBy === 'default' ? 'bg-[#1C244B] text-white' : 'hover:bg-gray-100 text-gray-700'}`}
                      >
                        Default
                      </button>
                      <button 
                        onClick={() => handleSort('name-asc')}
                        className={`w-full text-left px-4 py-2 rounded-lg transition-colors duration-200 ${sortBy === 'name-asc' ? 'bg-[#1C244B] text-white' : 'hover:bg-gray-100 text-gray-700'}`}
                      >
                        Name (A-Z)
                      </button>
                      <button 
                        onClick={() => handleSort('name-desc')}
                        className={`w-full text-left px-4 py-2 rounded-lg transition-colors duration-200 ${sortBy === 'name-desc' ? 'bg-[#1C244B] text-white' : 'hover:bg-gray-100 text-gray-700'}`}
                      >
                        Name (Z-A)
                      </button>
                      <button 
                        onClick={() => handleSort('location-asc')}
                        className={`w-full text-left px-4 py-2 rounded-lg transition-colors duration-200 ${sortBy === 'location-asc' ? 'bg-[#1C244B] text-white' : 'hover:bg-gray-100 text-gray-700'}`}
                      >
                        Location (A-Z)
                      </button>
                      <button 
                        onClick={() => handleSort('location-desc')}
                        className={`w-full text-left px-4 py-2 rounded-lg transition-colors duration-200 ${sortBy === 'location-desc' ? 'bg-[#1C244B] text-white' : 'hover:bg-gray-100 text-gray-700'}`}
                      >
                        Location (Z-A)
                      </button>
                      <button 
                        onClick={() => handleSort('size-asc')}
                        className={`w-full text-left px-4 py-2 rounded-lg transition-colors duration-200 ${sortBy === 'size-asc' ? 'bg-[#1C244B] text-white' : 'hover:bg-gray-100 text-gray-700'}`}
                      >
                        Size (Low to High)
                      </button>
                      <button 
                        onClick={() => handleSort('size-desc')}
                        className={`w-full text-left px-4 py-2 rounded-lg transition-colors duration-200 ${sortBy === 'size-desc' ? 'bg-[#1C244B] text-white' : 'hover:bg-gray-100 text-gray-700'}`}
                      >
                        Size (High to Low)
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Active Filters Display */}
        {(selectedLocations.length > 0 || selectedSizes.length > 0) && (
          <div className="mb-6 flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold text-gray-700">Active Filters:</span>
            {selectedLocations.map(location => (
              <span key={location} className="bg-[#1C244B] text-white px-3 py-1 rounded-full text-sm flex items-center gap-2">
                {location}
                <button onClick={() => toggleLocation(location)} className="hover:text-red-300">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            ))}
            {selectedSizes.map(size => (
              <span key={size} className="bg-[#1C244B] text-white px-3 py-1 rounded-full text-sm flex items-center gap-2">
                {size}
                <button onClick={() => toggleSize(size)} className="hover:text-red-300">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            ))}
            <button onClick={clearFilters} className="text-sm text-red-500 hover:text-red-600 font-semibold ml-2">
              Clear All
            </button>
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
              We couldn't find any properties matching your criteria. Try adjusting your filters.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <button 
                onClick={clearFilters}
                className="px-8 py-3 bg-[#1C244B] text-white rounded-xl font-semibold hover:bg-[#2a3561] transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Clear Filters
              </button>
              <a 
                href="/" 
                className="px-8 py-3 bg-white text-[#1C244B] border-2 border-[#1C244B] rounded-xl font-semibold hover:bg-[#1C244B] hover:text-white transition-all duration-300"
              >
                Back to Home
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
                    <p className="text-3xl font-bold text-[#1C244B]">{p.size}</p>
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

export default FilteredByType;
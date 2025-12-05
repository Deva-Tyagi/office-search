import React, { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { FaTimes } from 'react-icons/fa';
import emailjs from '@emailjs/browser';
import projectsData from '../data/projects.json';

const noidaSectors = [
  "Sector 1", "Sector 2", "Sector 3", "Sector 4", "Sector 5", "Sector 6","Sector 7", "Sector 8","Sector 9",
  "Sector 10","Sector 11", "Sector 16", "Sector 16A", "Sector 18", "Sector 62","Sector 57", "Sector 58", "Sector 59","Sector 60","Sector 62",
  "Sector 63", "Sector 64", "Sector 65", "Sector 67", "Sector 68","Sector 80","Sector 81","Sector 83","Sector 85","Sector 125", "Sector 126", "Sector 127", "Sector 128","Sector 129",  "Sector 132",
  "Sector 135", "Sector 142", "Sector 144","Sector 151", "Sector 153", "Sector 168","Sector 88","Sector 90","Sector 84","Sector 87", "Sector 138", "Sector 140","Sector 140A","Hosiery Complex","Phase 2","Sector 155","Sector 154","Sector 153","Sector 156","Sector157","Sector 158","Sector 159","Sector 160","NECZ","Ecotech I","Ecotech II","Ecotech III","Ecotech I Extension 1","Ecotech I Extension 1","Ecotech V","Site 4", "Site 5","Ecotech VI","Ecotech VIII","Ecotech X","Ecotech XI","Ecotech XII","Ecotech XVI","Site B","Site C","Sector 31 GrNoida","Sector 41 GrNoida","Techzone","Techzone II","Techzone III","Techzone IV","Techzone V"
];

const HeroBanner = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('LEASE');
  const [location, setLocation] = useState('Noida (All Sectors)');
  const [propertyType, setPropertyType] = useState('Property Type');
  const [search, setSearch] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', mobile: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');
  const [imagesLoaded, setImagesLoaded] = useState(false);

  // Optimized image sources - use optimized versions
  const carouselImages = [
    '/os1.jpg',
    '/os2.jpg',
    '/os3.jpg',
    '/os4.jpg'
  ];

  // Refs for GSAP animations
  const headingRef = useRef(null);
  const subtitleRef = useRef(null);
  const tabsRef = useRef(null);
  const searchBoxRef = useRef(null);
  const ctaRef = useRef(null);
  const overlayRef = useRef(null);
  const carouselRef = useRef(null);
  const modalRef = useRef(null);
  const formRef = useRef(null);
  const suggestionsRef = useRef(null);

  // Preload images efficiently
  useEffect(() => {
    const preloadImages = () => {
      let loadedCount = 0;
      const totalImages = carouselImages.length;

      carouselImages.forEach((src) => {
        const img = new Image();
        img.src = src;
        img.onload = () => {
          loadedCount++;
          if (loadedCount === totalImages) {
            setImagesLoaded(true);
          }
        };
        img.onerror = () => {
          loadedCount++;
          if (loadedCount === totalImages) {
            setImagesLoaded(true);
          }
        };
      });
    };

    // Delay image loading to prioritize critical content
    const timer = setTimeout(preloadImages, 100);
    return () => clearTimeout(timer);
  }, []);

  // Memoized location getter
  const uniqueLocations = useRef(null);
  const getUniqueLocations = () => {
    if (!uniqueLocations.current) {
      const locations = projectsData.map(project => project.location);
      uniqueLocations.current = [...new Set(locations)].sort();
    }
    return uniqueLocations.current;
  };

  // Debounced search with suggestions
  const searchTimeout = useRef(null);
  const handleSearchInput = (value) => {
    setSearch(value);
    
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    searchTimeout.current = setTimeout(() => {
      if (value.trim().length > 0) {
        const locations = getUniqueLocations();
        const filtered = locations.filter(loc => 
          loc.toLowerCase().includes(value.toLowerCase())
        );
        setSuggestions(filtered);
        setShowSuggestions(filtered.length > 0);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 150);
  };

  const handleSuggestionClick = (suggestion) => {
    setSearch(suggestion);
    setLocation(suggestion);
    setShowSuggestions(false);
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
    };
  }, []);

  // Optimized carousel with requestAnimationFrame
  useEffect(() => {
    if (!imagesLoaded) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [imagesLoaded]);

  // Optimized carousel animations
  useEffect(() => {
    if (!imagesLoaded || !carouselRef.current) return;

    const images = carouselRef.current.querySelectorAll('.carousel-image');
    
    images.forEach((img, index) => {
      const isActive = index === currentSlide;
      const isPrev = index === (currentSlide - 1 + carouselImages.length) % carouselImages.length;
      
      if (isActive) {
        gsap.to(img, {
          opacity: 1,
          scale: 1.1,
          x: '3%',
          y: '-2%',
          duration: 6,
          ease: 'none',
          zIndex: 2,
          force3D: true,
          willChange: 'transform, opacity'
        });
      } else if (isPrev) {
        gsap.to(img, {
          opacity: 0,
          scale: 1.15,
          duration: 0.8,
          ease: 'power1.inOut',
          zIndex: 1,
          force3D: true,
          clearProps: 'willChange'
        });
      } else {
        gsap.set(img, { 
          opacity: 0, 
          scale: 1, 
          x: '0%', 
          y: '0%', 
          zIndex: 0,
          clearProps: 'willChange'
        });
      }
    });
  }, [currentSlide, imagesLoaded]);

  // Optimized entrance animations - only run once
  useEffect(() => {
    if (!imagesLoaded) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });
      tl.from(overlayRef.current, { opacity: 0, duration: 0.5 });
      tl.from(headingRef.current, { y: 40, opacity: 0, duration: 0.7 }, '-=0.3');
      tl.from(subtitleRef.current, { y: 20, opacity: 0, duration: 0.5 }, '-=0.5');
      tl.from(tabsRef.current, { y: 30, opacity: 0, duration: 0.6 }, '-=0.4');
      tl.from(searchBoxRef.current, { scale: 0.95, y: 30, opacity: 0, duration: 0.7 }, '-=0.5');
      tl.from(ctaRef.current, { scale: 0, opacity: 0, duration: 0.5 }, '-=0.3');

      // Lighter floating animation
      gsap.to(ctaRef.current, {
        y: -8,
        duration: 2.5,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1
      });
    });
    return () => ctx.revert();
  }, [imagesLoaded]);

  // Modal animations
  useEffect(() => {
    if (isModalOpen && modalRef.current && formRef.current) {
      document.body.style.overflow = 'hidden';
      gsap.fromTo(modalRef.current, { opacity: 0 }, { opacity: 1, duration: 0.2 });
      gsap.fromTo(formRef.current,
        { scale: 0.9, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.3, ease: 'power2.out' }
      );
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen]);

  const handleSearch = () => {
    const mode = activeTab.toLowerCase();
    const selectedLocation = location !== 'Noida (All Sectors)' ? location : search.trim();
    const selectedType = propertyType !== 'Property Type' ? propertyType : '';
    const searchQuery = search.trim();

    let path = '/';

    if (searchQuery && getUniqueLocations().includes(searchQuery)) {
      path = `/filtered-location?location=${encodeURIComponent(searchQuery)}&mode=${mode}`;
    }
    else if (selectedLocation && selectedType) {
      path = `/filtered-combined?location=${encodeURIComponent(selectedLocation)}&type=${encodeURIComponent(selectedType)}&mode=${mode}`;
    }
    else if (selectedLocation) {
      path = `/filtered-location?location=${encodeURIComponent(selectedLocation)}&mode=${mode}`;
    }
    else if (selectedType) {
      path = `/filtered-type?type=${encodeURIComponent(selectedType)}&mode=${mode}`;
    }
    else if (searchQuery) {
      path = `/search?q=${encodeURIComponent(searchQuery)}&mode=${mode}`;
    }
    else {
      path = `/properties?mode=${mode}`;
    }

    navigate(path);
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const openModal = () => {
    setIsModalOpen(true);
    setSubmitStatus('');
  };

  const closeModal = () => {
    if (modalRef.current && formRef.current) {
      gsap.to(formRef.current, {
        scale: 0.9,
        opacity: 0,
        duration: 0.2,
        ease: 'power1.in'
      });
      gsap.to(modalRef.current, {
        opacity: 0,
        duration: 0.2,
        onComplete: () => {
          setIsModalOpen(false);
          setFormData({ name: '', mobile: '' });
          setSubmitStatus('');
        }
      });
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.mobile) {
      setSubmitStatus('error');
      return;
    }
    
    if (formData.mobile.length !== 10 || !/^\d+$/.test(formData.mobile)) {
      setSubmitStatus('error');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('');

    try {
      await emailjs.send(
        'YOUR_SERVICE_ID',
        'YOUR_TEMPLATE_ID',
        {
          from_name: formData.name,
          mobile: formData.mobile,
          to_name: 'Property Team',
          message: `New enquiry from ${formData.name}. Mobile: ${formData.mobile}`
        },
        'YOUR_PUBLIC_KEY'
      );
      
      setSubmitStatus('success');
      setTimeout(() => closeModal(), 2000);
    } catch (error) {
      console.error('Email error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <section 
      className="relative min-h-[85vh] overflow-hidden" 
      style={{ marginTop: '80px' }}
    >
      {/* Optimized Ken Burns Carousel Background */}
      <div ref={carouselRef} className="absolute inset-0 overflow-hidden bg-gray-900">
        {imagesLoaded ? (
          carouselImages.map((img, index) => (
            <div 
              key={index} 
              className="carousel-image absolute inset-0 w-full h-full"
              style={{ willChange: index === currentSlide ? 'transform, opacity' : 'auto' }}
            >
              <div 
                className="w-full h-full bg-cover bg-center"
                style={{ 
                  backgroundImage: `url(${img})`,
                  filter: 'brightness(0.85) contrast(1.1)',
                }}
              />
            </div>
          ))
        ) : (
          // Placeholder while images load
          <div className="absolute inset-0 bg-gradient-to-br from-[#1C244B] to-[#0a0f24]" />
        )}
        
        <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-black/20"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30"></div>
      </div>

      {/* Simplified Gradient Overlay */}
      <div 
        ref={overlayRef}
        className="absolute inset-0 bg-gradient-to-br from-[#1C244B]/25 via-[#1C244B]/30 to-[#0a0f24]/20"
      >
        {/* Reduced light particles for performance */}
        <div className="absolute inset-0 hidden md:block pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-white/60 rounded-full animate-pulse"></div>
          <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-white/40 rounded-full animate-pulse" style={{ animationDelay: '0.7s' }}></div>
          <div className="absolute bottom-1/3 left-1/3 w-1.5 h-1.5 bg-white/50 rounded-full animate-pulse" style={{ animationDelay: '1.4s' }}></div>
        </div>
        
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-radial from-[#2a3561]/30 to-transparent blur-3xl opacity-70" style={{ animationDuration: '4s' }}></div>
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-radial from-[#1C244B]/40 to-transparent blur-3xl opacity-70" style={{ animationDuration: '5s', animationDelay: '1s' }}></div>
      </div>
      
      <div className="relative container mx-auto px-4 sm:px-6 min-h-[85vh] flex flex-col justify-center items-center text-white text-center z-10 py-8">
        {/* Compact Heading */}
        <h1 
          ref={headingRef}
          className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 sm:mb-3 tracking-tight drop-shadow-2xl px-4"
        >
          Find Your Premium Office Space
        </h1>
        
        {/* Compact Subtitle */}
        <p 
          ref={subtitleRef}
          className="text-sm sm:text-base md:text-lg mb-6 sm:mb-8 text-white/90 max-w-2xl drop-shadow-lg px-4"
        >
          Discover premium commercial spaces across Noida
        </p>
        
        {/* Compact Tabs */}
        <div 
          ref={tabsRef}
          className="flex bg-white/15 backdrop-blur-md rounded-lg sm:rounded-xl p-1 sm:p-1.5 mb-6 sm:mb-8 shadow-2xl border border-white/30 w-full max-w-sm sm:max-w-md"
        >
          <button 
            onClick={() => handleTabClick('BUY')} 
            className={`flex-1 px-3 sm:px-6 py-1.5 sm:py-2 rounded-md sm:rounded-lg text-xs sm:text-sm font-semibold transition-colors duration-200 ${
              activeTab === 'BUY' 
                ? 'bg-white text-[#1C244B] shadow-lg' 
                : 'text-white hover:bg-white/10'
            }`}
          >
            BUY
          </button>
          <button 
            onClick={() => handleTabClick('LEASE')} 
            className={`flex-1 px-3 sm:px-6 py-1.5 sm:py-2 rounded-md sm:rounded-lg text-xs sm:text-sm font-semibold transition-colors duration-200 ${
              activeTab === 'LEASE' 
                ? 'bg-white text-[#1C244B] shadow-lg' 
                : 'text-white hover:bg-white/10'
            }`}
          >
            LEASE
          </button>
          <button 
            onClick={() => handleTabClick('PRE-LEASED')} 
            className={`flex-1 px-3 sm:px-6 py-1.5 sm:py-2 rounded-md sm:rounded-lg text-xs sm:text-sm font-semibold transition-colors duration-200 ${
              activeTab === 'PRE-LEASED' 
                ? 'bg-white text-[#1C244B] shadow-lg' 
                : 'text-white hover:bg-white/10'
            }`}
          >
            PRE-LEASED
          </button>
        </div>

        {/* Compact Search Box */}
        <div 
          ref={searchBoxRef}
          className="bg-white/95 backdrop-blur-md rounded-xl sm:rounded-2xl shadow-2xl p-3 sm:p-4 lg:p-5 max-w-4xl w-full border border-white/50"
        >
          <div className="flex flex-col gap-2 sm:gap-3">
            {/* First Row - Dropdowns */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <select 
                value={location} 
                onChange={(e) => setLocation(e.target.value)} 
                className="px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg border-2 border-gray-200 text-[#1C244B] w-full font-medium focus:border-[#1C244B] focus:outline-none focus:ring-2 focus:ring-[#1C244B]/20 transition-colors duration-200 cursor-pointer hover:border-[#1C244B]/50 shadow-sm text-xs sm:text-sm"
              >
                <option>Noida (All Sectors)</option>
                {noidaSectors.map(sec => (
                  <option key={sec}>{sec}</option>
                ))}
              </select>

              <select 
                value={propertyType} 
                onChange={(e) => setPropertyType(e.target.value)} 
                className="px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg border-2 border-gray-200 text-[#1C244B] w-full font-medium focus:border-[#1C244B] focus:outline-none focus:ring-2 focus:ring-[#1C244B]/20 transition-colors duration-200 cursor-pointer hover:border-[#1C244B]/50 shadow-sm text-xs sm:text-sm"
              >
                <option>Property Type</option>
                <option>IT</option>
                <option>Industrial</option>
                <option>Office Spaces</option>
                <option>Managed Offices</option>
                <option>Warehouses</option>
                <option>Retail Shop</option>
              </select>
            </div>

            {/* Second Row - Search Input with Suggestions */}
            <div className="relative w-full" ref={suggestionsRef}>
              <input
                type="text"
                value={search}
                onChange={(e) => handleSearchInput(e.target.value)}
                onKeyPress={handleKeyPress}
                onFocus={() => search.trim().length > 0 && suggestions.length > 0 && setShowSuggestions(true)}
                placeholder="Search by sector or locality"
                className="px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg border-2 border-gray-200 text-[#1C244B] w-full font-medium focus:border-[#1C244B] focus:outline-none focus:ring-2 focus:ring-[#1C244B]/20 transition-colors duration-200 placeholder:text-gray-400 hover:border-[#1C244B]/50 shadow-sm text-xs sm:text-sm"
              />
              
              {/* Suggestions Dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 sm:left-auto sm:right-auto sm:w-72 md:w-80 mt-2 bg-white rounded-lg shadow-xl border border-gray-300 max-h-36 overflow-y-auto z-[100]">
                  {suggestions.slice(0, 5).map((suggestion, index) => (
                    <div
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="px-3 py-1.5 hover:bg-[#1C244B] hover:text-white cursor-pointer transition-colors duration-150 text-[#1C244B] font-medium border-b border-gray-100 last:border-b-0 text-xs"
                    >
                      📍 {suggestion}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Search Button */}
            <button 
              onClick={handleSearch} 
              className="group relative bg-gradient-to-r from-[#1C244B] to-[#2a3561] text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg font-bold text-xs sm:text-sm transition-all duration-200 shadow-xl hover:shadow-2xl hover:scale-105 w-full overflow-hidden"
            >
              <span className="relative z-10">SEARCH PROPERTY</span>
              <div className="absolute inset-0 bg-gradient-to-r from-[#2a3561] to-[#1C244B] opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
            </button>
          </div>
        </div>

        {/* Compact CTA Button */}
        <div ref={ctaRef} className="mt-6 sm:mt-8">
          <button 
            onClick={openModal}
            className="group relative bg-white text-[#1C244B] px-6 sm:px-8 py-2 sm:py-3 rounded-lg font-bold text-sm sm:text-base shadow-2xl hover:shadow-3xl transition-all duration-200 cursor-pointer overflow-hidden hover:scale-105"
          >
            <span className="relative z-10">Enquire Now</span>
            <div className="absolute inset-0 bg-gradient-to-r from-gray-50 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
          </button>
        </div>
      </div>

      {/* Optimized Modal */}
      {isModalOpen && (
        <div
          ref={modalRef}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
          onClick={closeModal}
        >
          <div
            ref={formRef}
            className="bg-white rounded-xl sm:rounded-2xl shadow-2xl p-5 sm:p-6 md:p-8 max-w-sm w-full relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 text-gray-400 hover:text-gray-600 hover:rotate-90 transition-all duration-200"
            >
              <FaTimes size={18} className="sm:w-5 sm:h-5" />
            </button>

            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-12 sm:w-16 h-1 bg-gradient-to-r from-[#1C244B] to-[#2a3561] rounded-full"></div>

            <h3 className="text-xl sm:text-2xl font-bold text-[#1C244B] mb-1 text-center mt-2">Get in Touch</h3>
            <p className="text-xs sm:text-sm text-gray-600 text-center mb-4 sm:mb-6">We'll contact you shortly</p>

            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-[#1C244B] focus:outline-none focus:ring-2 focus:ring-[#1C244B]/20 transition-colors duration-200 text-xs sm:text-sm"
                  placeholder="Enter your name"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleInputChange}
                  required
                  maxLength={10}
                  pattern="[0-9]{10}"
                  className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-[#1C244B] focus:outline-none focus:ring-2 focus:ring-[#1C244B]/20 transition-colors duration-200 text-xs sm:text-sm"
                  placeholder="Enter 10-digit mobile number"
                />
              </div>

              {submitStatus === 'success' && (
                <div className="bg-green-50 border-2 border-green-500 text-green-700 px-3 py-2 rounded-lg text-center font-semibold text-xs sm:text-sm">
                  ✓ Enquiry submitted successfully!
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="bg-red-50 border-2 border-red-500 text-red-700 px-3 py-2 rounded-lg text-center font-semibold text-xs sm:text-sm">
                  ✗ Please check your details and try again.
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="group relative w-full py-2.5 sm:py-3 bg-gradient-to-r from-[#1C244B] to-[#2a3561] text-white font-bold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden text-xs sm:text-sm"
              >
                <span className="relative z-10">{isSubmitting ? 'Submitting...' : 'Submit Enquiry'}</span>
                <div className="absolute inset-0 bg-gradient-to-r from-[#2a3561] to-[#1C244B] opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default HeroBanner;
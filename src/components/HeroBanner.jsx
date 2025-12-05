import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { FaTimes } from 'react-icons/fa';
import emailjs from '@emailjs/browser';
import projectsData from '../data/projects.json';
import img1 from '/os1.jpg';
import img2 from '/os2.jpg';
import img3 from '/os3.jpg';
import img4 from '/os4.jpg';

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

  const carouselImages = [img1, img2, img3, img4];

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

  // Get unique locations from projects.json
  const getUniqueLocations = () => {
    const locations = projectsData.map(project => project.location);
    return [...new Set(locations)].sort();
  };

  // Smart search with suggestions
  const handleSearchInput = (value) => {
    setSearch(value);
    
    if (value.trim().length > 0) {
      const uniqueLocations = getUniqueLocations();
      const filtered = uniqueLocations.filter(loc => 
        loc.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
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
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Premium Ken Burns Carousel Effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (carouselRef.current) {
      const images = carouselRef.current.querySelectorAll('.carousel-image');
      images.forEach((img, index) => {
        const isActive = index === currentSlide;
        const isPrev = index === (currentSlide - 1 + carouselImages.length) % carouselImages.length;
        
        if (isActive) {
          gsap.to(img, {
            opacity: 1,
            scale: 1.15,
            x: '5%',
            y: '-3%',
            duration: 6,
            ease: 'none',
            zIndex: 2
          });
        } else if (isPrev) {
          gsap.to(img, {
            opacity: 0,
            scale: 1.2,
            duration: 1,
            ease: 'power2.inOut',
            zIndex: 1
          });
        } else {
          gsap.set(img, { opacity: 0, scale: 1, x: '0%', y: '0%', zIndex: 0 });
        }
      });
    }
  }, [currentSlide]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.from(overlayRef.current, { opacity: 0, duration: 0.8 });
      tl.from(headingRef.current, { y: 50, opacity: 0, duration: 1, ease: 'back.out(1.7)' }, '-=0.4');
      tl.from(subtitleRef.current, { y: 30, opacity: 0, duration: 0.8 }, '-=0.6');
      tl.from(tabsRef.current, { y: 40, opacity: 0, duration: 0.8, ease: 'power2.out' }, '-=0.5');
      tl.from(searchBoxRef.current, { scale: 0.95, y: 50, opacity: 0, duration: 1, ease: 'back.out(1.2)' }, '-=0.6');
      tl.from(ctaRef.current, { scale: 0, opacity: 0, duration: 0.6, ease: 'back.out(2)' }, '-=0.4');

      gsap.to(ctaRef.current, {
        y: -10,
        duration: 2,
        ease: 'power1.inOut',
        yoyo: true,
        repeat: -1
      });
    });
    return () => ctx.revert();
  }, []);

  // Modal animations
  useEffect(() => {
    if (isModalOpen && modalRef.current && formRef.current) {
      gsap.fromTo(modalRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3 });
      gsap.fromTo(formRef.current,
        { scale: 0.8, y: 50, opacity: 0, rotateX: -15 },
        { scale: 1, y: 0, opacity: 1, rotateX: 0, duration: 0.6, ease: 'back.out(1.7)' }
      );
    }
  }, [isModalOpen]);

  const handleSearch = () => {
    gsap.to(searchBoxRef.current.querySelector('button'), {
      scale: 0.95,
      duration: 0.1,
      yoyo: true,
      repeat: 1
    });

    const mode = activeTab.toLowerCase();
    const selectedLocation = location !== 'Noida (All Sectors)' ? location : search.trim();
    const selectedType = propertyType !== 'Property Type' ? propertyType : '';
    const searchQuery = search.trim();

    let path = '/';

    // If search has a valid location from suggestions
    if (searchQuery && getUniqueLocations().includes(searchQuery)) {
      path = `/filtered-location?location=${encodeURIComponent(searchQuery)}&mode=${mode}`;
    }
    // Both location and type selected
    else if (selectedLocation && selectedType) {
      path = `/filtered-combined?location=${encodeURIComponent(selectedLocation)}&type=${encodeURIComponent(selectedType)}&mode=${mode}`;
    }
    // Only location selected
    else if (selectedLocation) {
      path = `/filtered-location?location=${encodeURIComponent(selectedLocation)}&mode=${mode}`;
    }
    // Only type selected
    else if (selectedType) {
      path = `/filtered-type?type=${encodeURIComponent(selectedType)}&mode=${mode}`;
    }
    // General search query
    else if (searchQuery) {
      path = `/search?q=${encodeURIComponent(searchQuery)}&mode=${mode}`;
    }
    // Only mode selected
    else {
      path = `/properties?mode=${mode}`;
    }

    console.log('Navigating to:', path);
    navigate(path);
  };

  const handleTabClick = (tab) => {
    gsap.to(tabsRef.current, { scale: 0.98, duration: 0.1, yoyo: true, repeat: 1 });
    setActiveTab(tab);
  };

  const openModal = () => {
    setIsModalOpen(true);
    setSubmitStatus('');
  };

  const closeModal = () => {
    if (modalRef.current && formRef.current) {
      gsap.to(formRef.current, {
        scale: 0.8,
        y: 50,
        opacity: 0,
        rotateX: -15,
        duration: 0.4,
        ease: 'back.in(1.7)'
      });
      gsap.to(modalRef.current, {
        opacity: 0,
        duration: 0.3,
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
      {/* Premium Ken Burns Carousel Background */}
      <div ref={carouselRef} className="absolute inset-0 overflow-hidden">
        {carouselImages.map((img, index) => (
          <div key={index} className="carousel-image absolute inset-0 w-full h-full">
            <div 
              className="w-full h-full bg-cover bg-center"
              style={{ 
                backgroundImage: `url(${img})`,
                filter: 'brightness(0.85) contrast(1.1)',
              }}
            />
          </div>
        ))}
        
        <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-black/20"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30"></div>
      </div>

      {/* Enhanced Gradient Overlay */}
      <div 
        ref={overlayRef}
        className="absolute inset-0 bg-gradient-to-br from-[#1C244B]/25 via-[#1C244B]/30 to-[#0a0f24]/20"
      >
        {/* Premium animated light particles - Hidden on mobile */}
        <div className="absolute inset-0 hidden md:block">
          <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-white/60 rounded-full animate-pulse shadow-lg shadow-white/50"></div>
          <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-white/40 rounded-full animate-pulse shadow-lg shadow-white/30" style={{ animationDelay: '0.7s' }}></div>
          <div className="absolute bottom-1/3 left-1/3 w-1.5 h-1.5 bg-white/50 rounded-full animate-pulse shadow-lg shadow-white/40" style={{ animationDelay: '1.4s' }}></div>
          <div className="absolute bottom-1/4 right-1/4 w-2 h-2 bg-white/45 rounded-full animate-pulse shadow-lg shadow-white/35" style={{ animationDelay: '2.1s' }}></div>
          <div className="absolute top-1/2 left-1/2 w-1 h-1 bg-white/55 rounded-full animate-pulse shadow-lg shadow-white/45" style={{ animationDelay: '2.8s' }}></div>
        </div>
        
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-radial from-[#2a3561]/30 to-transparent blur-3xl animate-pulse" style={{ animationDuration: '4s' }}></div>
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-radial from-[#1C244B]/40 to-transparent blur-3xl animate-pulse" style={{ animationDuration: '5s', animationDelay: '1s' }}></div>
      </div>
      
      <div className="relative container mx-auto px-4 sm:px-6 min-h-[85vh] flex flex-col justify-center items-center text-white text-center z-10 py-8">
        {/* Compact Heading */}
        <h2 
          ref={headingRef}
          className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 sm:mb-3 tracking-tight drop-shadow-2xl px-4"
        >
          Find Your Premium Office Space
        </h2>
        
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
            className={`flex-1 px-3 sm:px-6 py-1.5 sm:py-2 rounded-md sm:rounded-lg text-xs sm:text-sm font-semibold transition-all duration-300 ${
              activeTab === 'BUY' 
                ? 'bg-white text-[#1C244B] shadow-xl scale-105' 
                : 'text-white hover:bg-white/10'
            }`}
          >
            BUY
          </button>
          <button 
            onClick={() => handleTabClick('LEASE')} 
            className={`flex-1 px-3 sm:px-6 py-1.5 sm:py-2 rounded-md sm:rounded-lg text-xs sm:text-sm font-semibold transition-all duration-300 ${
              activeTab === 'LEASE' 
                ? 'bg-white text-[#1C244B] shadow-xl scale-105' 
                : 'text-white hover:bg-white/10'
            }`}
          >
            LEASE
          </button>
          <button 
            onClick={() => handleTabClick('PRE-LEASED')} 
            className={`flex-1 px-3 sm:px-6 py-1.5 sm:py-2 rounded-md sm:rounded-lg text-xs sm:text-sm font-semibold transition-all duration-300 ${
              activeTab === 'PRE-LEASED' 
                ? 'bg-white text-[#1C244B] shadow-xl scale-105' 
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
                className="px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg border-2 border-gray-200 text-[#1C244B] w-full font-medium focus:border-[#1C244B] focus:outline-none focus:ring-2 focus:ring-[#1C244B]/20 transition-all duration-300 cursor-pointer hover:border-[#1C244B]/50 shadow-sm text-xs sm:text-sm"
              >
                <option>Noida (All Sectors)</option>
                {noidaSectors.map(sec => (
                  <option key={sec}>{sec}</option>
                ))}
              </select>

              <select 
                value={propertyType} 
                onChange={(e) => setPropertyType(e.target.value)} 
                className="px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg border-2 border-gray-200 text-[#1C244B] w-full font-medium focus:border-[#1C244B] focus:outline-none focus:ring-2 focus:ring-[#1C244B]/20 transition-all duration-300 cursor-pointer hover:border-[#1C244B]/50 shadow-sm text-xs sm:text-sm"
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
                className="px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg border-2 border-gray-200 text-[#1C244B] w-full font-medium focus:border-[#1C244B] focus:outline-none focus:ring-2 focus:ring-[#1C244B]/20 transition-all duration-300 placeholder:text-gray-400 hover:border-[#1C244B]/50 shadow-sm text-xs sm:text-sm"
              />
              
              {/* Suggestions Dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 sm:left-auto sm:right-auto sm:w-72 md:w-80 mt-2 bg-white rounded-lg shadow-xl border border-gray-300 max-h-36 overflow-y-auto z-[100]">
                  {suggestions.slice(0, 5).map((suggestion, index) => (
                    <div
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="px-3 py-1.5 hover:bg-[#1C244B] hover:text-white cursor-pointer transition-all duration-200 text-[#1C244B] font-medium border-b border-gray-100 last:border-b-0 text-xs"
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
              className="group relative bg-gradient-to-r from-[#1C244B] to-[#2a3561] text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg font-bold text-xs sm:text-sm transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 w-full overflow-hidden"
            >
              <span className="relative z-10">SEARCH PROPERTY</span>
              <div className="absolute inset-0 bg-gradient-to-r from-[#2a3561] to-[#1C244B] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </div>
        </div>

        {/* Compact CTA Button */}
        <div ref={ctaRef} className="mt-6 sm:mt-8">
          <button 
            onClick={openModal}
            className="group relative bg-white text-[#1C244B] px-6 sm:px-8 py-2 sm:py-3 rounded-lg font-bold text-sm sm:text-base shadow-2xl hover:shadow-3xl transition-all duration-300 cursor-pointer overflow-hidden"
            onMouseEnter={(e) => gsap.to(e.currentTarget, { scale: 1.1, duration: 0.3 })}
            onMouseLeave={(e) => gsap.to(e.currentTarget, { scale: 1, duration: 0.3 })}
          >
            <span className="relative z-10">Enquire Now</span>
            <div className="absolute inset-0 bg-gradient-to-r from-gray-50 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-[#1C244B]/10 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            </div>
          </button>
        </div>
      </div>

      {/* Compact Modal */}
      {isModalOpen && (
        <div
          ref={modalRef}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md px-4"
          onClick={closeModal}
          style={{ perspective: '1000px' }}
        >
          <div
            ref={formRef}
            className="bg-white rounded-xl sm:rounded-2xl shadow-2xl p-5 sm:p-6 md:p-8 max-w-sm w-full relative"
            onClick={(e) => e.stopPropagation()}
            style={{ transformStyle: 'preserve-3d' }}
          >
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 text-gray-400 hover:text-gray-600 hover:rotate-90 transition-all duration-300"
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
                  className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-[#1C244B] focus:outline-none focus:ring-2 focus:ring-[#1C244B]/20 transition-all duration-300 text-xs sm:text-sm"
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
                  className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-[#1C244B] focus:outline-none focus:ring-2 focus:ring-[#1C244B]/20 transition-all duration-300 text-xs sm:text-sm"
                  placeholder="Enter 10-digit mobile number"
                />
              </div>

              {submitStatus === 'success' && (
                <div className="bg-green-50 border-2 border-green-500 text-green-700 px-3 py-2 rounded-lg text-center font-semibold animate-pulse text-xs sm:text-sm">
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
                className="group relative w-full py-2.5 sm:py-3 bg-gradient-to-r from-[#1C244B] to-[#2a3561] text-white font-bold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden text-xs sm:text-sm"
              >
                <span className="relative z-10">{isSubmitting ? 'Submitting...' : 'Submit Enquiry'}</span>
                <div className="absolute inset-0 bg-gradient-to-r from-[#2a3561] to-[#1C244B] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default HeroBanner;
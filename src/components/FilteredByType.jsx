import React, { useEffect, useRef, useCallback, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import projectsData from '../data/projects.json';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import emailjs from '@emailjs/browser';
import { User, Phone, X } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);
emailjs.init('FPyANi4X-1gUfsMCI'); // ← Your EmailJS public key

const FilteredByType = () => {
  const [searchParams] = useSearchParams();
  const type = searchParams.get('type');
  const mode = searchParams.get('mode') || 'lease';
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const cardsRef = useRef([]);
  const breadcrumbRef = useRef(null);
  const statsRef = useRef(null);

  // Popup & Form State
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [formData, setFormData] = useState({ name: '', phone: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');

  // Filter & Sort State
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [sortBy, setSortBy] = useState('default');

  // Initial filtered projects
  const initialFiltered = projectsData.filter(p => 
    (p.type === type || p.category === type) && p.availableFor.includes(mode)
  );

  const uniqueLocations = [...new Set(initialFiltered.map(p => p.location))];
  const uniqueSizes = [...new Set(initialFiltered.map(p => p.size))];

  const getFilteredAndSortedData = () => {
    let result = [...initialFiltered];

    if (selectedLocations.length > 0) {
      result = result.filter(p => selectedLocations.includes(p.location));
    }
    if (selectedSizes.length > 0) {
      result = result.filter(p => selectedSizes.includes(p.size));
    }

    switch (sortBy) {
      case 'name-asc': result.sort((a, b) => a.name.localeCompare(b.name)); break;
      case 'name-desc': result.sort((a, b) => b.name.localeCompare(a.name)); break;
      case 'location-asc': result.sort((a, b) => a.location.localeCompare(b.location)); break;
      case 'location-desc': result.sort((a, b) => b.location.localeCompare(a.location)); break;
      case 'size-asc':
        result.sort((a, b) => {
          const sizeA = parseInt(a.size.replace(/[^0-9]/g, '')) || 0;
          const sizeB = parseInt(b.size.replace(/[^0-9]/g, '')) || 0;
          return sizeA - sizeB;
        });
        break;
      case 'size-desc':
        result.sort((a, b) => {
          const sizeA = parseInt(a.size.replace(/[^0-9]/g, '')) || 0;
          const sizeB = parseInt(b.size.replace(/[^0-9]/g, '')) || 0;
          return sizeB - sizeA;
        });
        break;
      default: break;
    }

    return result;
  };

  const filtered = getFilteredAndSortedData();

  const toggleLocation = (location) => {
    setSelectedLocations(prev => 
      prev.includes(location)
        ? prev.filter(l => l !== location)
        : [...prev, location]
    );
  };

  const toggleSize = (size) => {
    setSelectedSizes(prev => 
      prev.includes(size)
        ? prev.filter(s => s !== size)
        : [...prev, size]
    );
  };

  const clearFilters = () => {
    setSelectedLocations([]);
    setSelectedSizes([]);
  };

  const handleSort = (sortOption) => {
    setSortBy(sortOption);
    setShowSortMenu(false);
  };

  // Open Popup
  const openPopup = (project) => {
    setSelectedProject(project);
    setIsPopupOpen(true);
    setFormData({ name: '', phone: '' });
    setSubmitStatus('');
  };

  // EmailJS Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !/^\d{10}$/.test(formData.phone)) {
      setSubmitStatus('Please enter valid name and 10-digit mobile number');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('');

    try {
      const emailData = {
        from_name: formData.name,
        phone: formData.phone,
        project_name: selectedProject.name,
        project_location: selectedProject.location,
        message: `Property Enquiry from Filtered Page\nName: ${formData.name}\nPhone: ${formData.phone}\nProperty: ${selectedProject.name}\nLocation: ${selectedProject.location}`,
        request_type: 'Property Enquiry',
      };

      await emailjs.send('service_91dd84g', 'template_ncabbum', emailData);

      setSubmitStatus('Thank you! We will call you shortly.');
      setFormData({ name: '', phone: '' });
      setTimeout(() => setIsPopupOpen(false), 3000);
    } catch (error) {
      setSubmitStatus('Failed to send. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const ctx = gsap.context(() => {
      gsap.fromTo(breadcrumbRef.current, { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 });
      gsap.fromTo(headingRef.current, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, delay: 0.2 });
      if (statsRef.current) {
        gsap.fromTo(statsRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, delay: 0.4 });
      }

      ScrollTrigger.batch(cardsRef.current, {
        onEnter: batch => {
          gsap.fromTo(batch, { y: 60, opacity: 0 }, {
            y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power2.out'
          });
        },
        start: 'top 90%',
        once: true
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [type, mode, selectedLocations, selectedSizes, sortBy]);

  const handleCardHover = useCallback((e, isEntering) => {
    gsap.to(e.currentTarget, { y: isEntering ? -10 : 0, duration: 0.3 });
  }, []);

  return (
    <>
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
                {/* Filter Button */}
                <div className="relative">
                  <button 
                    onClick={() => {
                      setShowFilterMenu(!showFilterMenu);
                      setShowSortMenu(false);
                    }}
                    className="px-4 py-2 bg-[#1C244B]/5] text-[#1C244B] rounded-xl font-semibold hover:bg-[#1C244B]/10 transition-colors duration-300"
                  >
                    <span className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                      </svg>
                      Filter
                      {(selectedLocations.length + selectedSizes.length) > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {selectedLocations.length + selectedSizes.length}
                        </span>
                      )}
                    </span>
                  </button>

                  {showFilterMenu && (
                    <div className="absolute top-full right-0 mt-2 bg-white rounded-xl shadow-2xl p-6 z-[100] w-80 border border-gray-100">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-[#1C244B]">Filters</h3>
                        <button onClick={clearFilters} className="text-sm text-red-500 hover:text-red-600 font-semibold">Clear All</button>
                      </div>

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
                        className="w-full mt-6 bg-[#1C244B] text-white px-4 py-2 rounded-xl font-semibold hover:bg-[#2a3561] transition-colors"
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
                    className="px-4 py-2 bg-[#1C244B]/5 text-[#1C244B] rounded-xl font-semibold hover:bg-[#1C244B]/10 transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                      </svg>
                      Sort
                    </span>
                  </button>

                  {showSortMenu && (
                    <div className="absolute top-full right-0 mt-2 bg-white rounded-xl shadow-2xl p-4 z-[100] w-64 border border-gray-100">
                      <h3 className="text-lg font-bold text-[#1C244B] mb-3">Sort By</h3>
                      <div className="space-y-1">
                        {['default', 'name-asc', 'name-desc', 'location-asc', 'location-desc', 'size-asc', 'size-desc'].map(opt => (
                          <button 
                            key={opt}
                            onClick={() => handleSort(opt)}
                            className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${sortBy === opt ? 'bg-[#1C244B] text-white' : 'hover:bg-gray-100 text-gray-700'}`}
                          >
                            {opt === 'default' ? 'Default' : opt.replace('-', ' (') + ')'}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Active Filters */}
          {(selectedLocations.length > 0 || selectedSizes.length > 0) && (
            <div className="mb-6 flex items-center gap-2 flex-wrap">
              <span className="text-sm font-semibold text-gray-700">Active Filters:</span>
              {selectedLocations.map(loc => (
                <span key={loc} className="bg-[#1C244B] text-white px-3 py-1 rounded-full text-sm flex items-center gap-2">
                  {loc}
                  <button onClick={() => toggleLocation(loc)} className="hover:text-red-300">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              ))}
              {selectedSizes.map(sz => (
                <span key={sz} className="bg-[#1C244B] text-white px-3 py-1 rounded-full text-sm flex items-center gap-2">
                  {sz}
                  <button onClick={() => toggleSize(sz)} className="hover:text-red-300">
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

          {/* Results Grid */}
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <div className="inline-block p-8 bg-white rounded-3xl shadow-lg mb-6">
                <svg className="w-24 h-24 text-gray-300 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-3xl font-bold text-[#1C244B] mb-4">No Properties Found</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                We couldn't find any properties matching your criteria. Try adjusting your filters.
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <button onClick={clearFilters} className="px-8 py-3 bg-[#1C244B] text-white rounded-xl font-semibold hover:bg-[#2a3561] transition-all shadow-lg hover:shadow-xl">
                  Clear Filters
                </button>
                <a href="/" className="px-8 py-3 bg-white text-[#1C244B] border-2 border-[#1C244B] rounded-xl font-semibold hover:bg-[#1C244B] hover:text-white transition-all">
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
                  <div className="relative h-64 overflow-hidden bg-gray-200">
                    <img 
                      src={p.image} 
                      alt={p.name} 
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute top-4 right-4 bg-white/95 px-3 py-1.5 rounded-full">
                      <span className="text-[#1C244B] font-semibold text-xs">{p.type}</span>
                    </div>
                    <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
                      {p.availableFor.map((avail, idx) => (
                        <span key={idx} className="bg-[#1C244B]/90 text-white px-3 py-1 rounded-full text-xs font-medium">
                          {avail}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-[#1C244B] mb-2 group-hover:text-[#2a3561] transition-colors">
                      {p.name}
                    </h3>
                    <div className="flex items-center gap-2 text-gray-600 mb-3">
                      <svg className="w-4 h-4 text-[#1C244B]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      <p className="text-sm font-medium">{p.location}, Noida</p>
                    </div>

                    <div className="flex items-baseline gap-2 mb-6">
                      <svg className="w-5 h-5 text-[#1C244B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v14a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM16 5a1 1 0 011-1h2a1 1 0 011 1v14a1 1 0 01-1 1h-2a1 1 0 01-1-1V5z" />
                      </svg>
                      <p className="text-xl font-bold text-[#1C244B]">{p.size}</p>
                    </div>

                    <button
                      onClick={() => openPopup(p)}
                      className="w-full bg-[#1C244B] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#2a3561] transition-all duration-300 flex items-center justify-center gap-2 group/btn"
                    >
                      <span>View Details</span>
                      <svg className="w-5 h-5 transform group-hover/btn:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* POPUP FORM */}
      {isPopupOpen && selectedProject && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-[#1C244B] text-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
            <button 
              onClick={() => setIsPopupOpen(false)}
              className="absolute top-4 right-4 text-white/60 hover:text-white transition"
            >
              <X className="w-7 h-7" />
            </button>

            <h2 className="text-3xl font-bold mb-3">Get Free Consultation</h2>
            <p className="text-white/80 mb-2">Property: <span className="font-bold">{selectedProject.name}</span></p>
            <p className="text-white/70 mb-8">Our expert will connect you within 24 hours.</p>

            {submitStatus && (
              <div className={`p-4 rounded-lg mb-6 text-center font-medium text-sm ${
                submitStatus.includes('Thank') 
                  ? 'bg-green-900/30 border border-green-600 text-green-300' 
                  : 'bg-red-900/30 border border-red-600 text-red-300'
              }`}>
                {submitStatus}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-400 w-5 h-5" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Your Full Name"
                  required
                  className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30 transition-all"
                />
              </div>

              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-400 w-5 h-5" />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '').slice(0,10) })}
                  placeholder="Your Mobile Number"
                  required
                  pattern="[0-9]{10}"
                  maxLength="10"
                  className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30 transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-amber-500 hover:bg-amber-600 text-[#1C244B] font-bold py-4 rounded-xl text-lg transition-all duration-300 shadow-lg hover:shadow-2xl hover:scale-105 disabled:opacity-70"
              >
                {isSubmitting ? 'Sending...' : 'GET CALL BACK'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default FilteredByType;
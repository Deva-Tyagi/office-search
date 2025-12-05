import React, { useEffect, useRef, useCallback, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import emailjs from '@emailjs/browser';
import projectsData from '../data/projects.json';

gsap.registerPlugin(ScrollTrigger);

const PROJECTS_PER_PAGE = 10;

const PropertiesList = () => {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const cardsRef = useRef([]);
  const breadcrumbRef = useRef(null);
  const statsRef = useRef(null);
  const formContainerRef = useRef(null); // For scroll & highlight

  const [currentPage, setCurrentPage] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobile: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' });
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [filteredProjects, setFilteredProjects] = useState(projectsData);

  // Extract unique locations and types
  const locations = [...new Set(projectsData.map(p => p.location))].sort();
  const types = [...new Set(projectsData.map(p => p.type))].sort();

  // FILTERING — Now 100% accurate
  useEffect(() => {
    let filtered = projectsData;

    if (selectedLocation && selectedLocation !== '') {
      filtered = filtered.filter(p => p.location === selectedLocation);
    }
    if (selectedType && selectedType !== '') {
      filtered = filtered.filter(p => p.type === selectedType);
    }

    setFilteredProjects(filtered);
    setCurrentPage(1); // Reset to first page on filter
  }, [selectedLocation, selectedType]);

  // PAGINATION
  const totalPages = Math.ceil(filteredProjects.length / PROJECTS_PER_PAGE);
  const paginatedProjects = filteredProjects.slice(
    (currentPage - 1) * PROJECTS_PER_PAGE,
    currentPage * PROJECTS_PER_PAGE
  );

  // Scroll to form + highlight
  const scrollToFormAndHighlight = useCallback(() => {
    if (formContainerRef.current) {
      formContainerRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });

      gsap.to(formContainerRef.current, {
        boxShadow: '0 0 0 15px rgba(28, 36, 75, 0.15)',
        duration: 0.4,
        repeat: 3,
        yoyo: true,
        ease: 'power2.inOut',
        onComplete: () => {
          gsap.to(formContainerRef.current, { boxShadow: '0 10px 25px -3px rgba(0, 0, 0, 0.1)', duration: 0.6 });
        }
      });

      const firstInput = formContainerRef.current.querySelector('input[name="fullName"]');
      if (firstInput) firstInput.focus();
    }
  }, []);

  // GSAP Animations
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const ctx = gsap.context(() => {
      gsap.fromTo(breadcrumbRef.current, { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' });
      gsap.fromTo(headingRef.current, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, delay: 0.2, ease: 'power2.out' });
      if (statsRef.current) gsap.fromTo(statsRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, delay: 0.4, ease: 'power2.out' });

      ScrollTrigger.batch(cardsRef.current, {
        onEnter: batch => gsap.fromTo(batch, { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power2.out' }),
        start: 'top 90%',
        once: true
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [paginatedProjects]);

  const handleCardHover = useCallback((e, isEntering) => {
    gsap.to(e.currentTarget, { y: isEntering ? -10 : 0, duration: 0.3, ease: 'power2.out' });
  }, []);

  const handleButtonClick = useCallback((e) => {
    e.stopPropagation();
    gsap.to(e.currentTarget, { scale: 0.95, duration: 0.1, yoyo: true, repeat: 1 });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: '', message: '' });

    try {
      await emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', {
        from_name: formData.fullName,
        from_email: formData.email,
        from_mobile: formData.mobile,
        message: formData.message,
      }, 'YOUR_PUBLIC_KEY');

      setSubmitStatus({ type: 'success', message: 'Message sent successfully! We will contact you soon.' });
      setFormData({ fullName: '', email: '', mobile: '', message: '' });
    } catch (error) {
      setSubmitStatus({ type: 'error', message: 'Failed to send message. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWhatsApp = () => window.open('https://wa.me/919205596640', '_blank');
  const handleCall = () => window.location.href = 'tel:+919205596640';

  return (
    <section ref={sectionRef} className="py-24 bg-gray-50 min-h-screen" style={{ marginTop: '80px' }}>
      <div className="container mx-auto px-6">
        <div ref={breadcrumbRef} className="flex items-center gap-2 text-sm mb-8 flex-wrap">
          <a href="/" className="text-[#1C244B] hover:underline font-medium">Home</a>
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          <span className="text-[#1C244B] font-semibold">Office for Rent</span>
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          <span className="text-[#1C244B] font-semibold">NOIDA</span>
        </div>

        <div ref={headingRef} className="text-center mb-8">
          <h2 className="text-4xl md:text-5xl font-bold text-[#1C244B] mb-4">All Properties</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">Explore our complete portfolio of commercial spaces in Noida</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Side - Projects */}
          <div className="lg:col-span-2">
            <div ref={statsRef} className="bg-white rounded-xl shadow-md p-4 mb-6 flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#1C244B]/10 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-[#1C244B]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Total Properties</p>
                  <p className="text-xl font-bold text-[#1C244B]">{filteredProjects.length}</p>
                </div>
              </div>
              <div className="flex gap-2 flex-wrap">
                <button onClick={() => window.history.back()} className="px-3 py-2 bg-[#1C244B]/5 text-[#1C244B] rounded-lg text-sm font-semibold hover:bg-[#1C244B]/10 transition-colors duration-300">
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    Back
                  </span>
                </button>
                <select value={selectedLocation} onChange={(e) => setSelectedLocation(e.target.value)} className="px-3 py-2 bg-[#1C244B]/5 text-[#1C244B] rounded-lg text-sm font-semibold hover:bg-[#1C244B]/10 transition-colors duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#1C244B]">
                  <option value="">All Locations</option>
                  {locations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                </select>
                <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)} className="px-3 py-2 bg-[#1C244B]/5 text-[#1C244B] rounded-lg text-sm font-semibold hover:bg-[#1C244B]/10 transition-colors duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#1C244B]">
                  <option value="">All Types</option>
                  {types.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>

            <div className="space-y-6">
              {paginatedProjects.length > 0 ? (
                paginatedProjects.map((p, i) => (
                  <div
                    key={p.id}
                    ref={el => cardsRef.current[i] = el}
                    onMouseEnter={(e) => handleCardHover(e, true)}
                    onMouseLeave={(e) => handleCardHover(e, false)}
                    className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl group cursor-pointer relative border border-gray-100 transition-shadow duration-300"
                  >
                    <div className="flex flex-col md:flex-row">
                      <div className="relative md:w-2/5 h-56 overflow-hidden bg-gray-200">
                        <span className="absolute top-3 left-3 bg-[#1C244B] text-white px-3 py-1 rounded-full text-xs font-semibold z-10">For Rent</span>
                        <img src={p.image} alt={p.name} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full z-10">
                          <span className="text-[#1C244B] font-semibold text-xs">{p.type}</span>
                        </div>
                      </div>

                      <div className="md:w-3/5 p-6">
                        <h3 className="text-2xl font-bold text-[#1C244B] mb-2 group-hover:text-[#2a3561] transition-colors duration-300">{p.name}</h3>
                        
                        <div className="flex items-center gap-2 text-gray-600 mb-3">
                          <svg className="w-4 h-4 text-[#1C244B] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
                          <p className="text-sm font-medium">{p.location}, Noida</p>
                        </div>

                        <div className="flex items-center gap-2 mb-3">
                          <svg className="w-4 h-4 text-[#1C244B] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg>
                          <span className="text-sm text-gray-700 font-medium">Office Building</span>
                        </div>

                        <div className="flex items-baseline gap-2 mb-4">
                          <svg className="w-5 h-5 text-[#1C244B] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v14a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM16 5a1 1 0 011-1h2a1 1 0 011 1v14a1 1 0 01-1 1h-2a1 1 0 01-1-1V5z" /></svg>
                          <p className="text-2xl font-bold text-[#1C244B]">{p.size}</p>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-4">
                          {p.availableFor.map((avail, idx) => (
                            <span key={idx} className="bg-[#1C244B]/90 text-white px-3 py-1 rounded text-xs font-medium">{avail}</span>
                          ))}
                        </div>

                        <div className="flex gap-3">
                          <button
                            onClick={(e) => { handleButtonClick(e); scrollToFormAndHighlight(); }}
                            className="flex-1 bg-[#1C244B] text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#2a3561] transition-all duration-300 flex items-center justify-center gap-2"
                          >
                            View Details
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                          </button>
                          <button
                            onClick={(e) => { handleButtonClick(e); scrollToFormAndHighlight(); }}
                            className="bg-[#1C244B] text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#2a3561] transition-all duration-300"
                          >
                            Know More
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-white rounded-xl p-12 text-center shadow-lg">
                  <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <h3 className="text-xl font-bold text-gray-700 mb-2">No Properties Found</h3>
                  <p className="text-gray-500 mb-4">No properties match your selected filters.</p>
                  <button onClick={() => { setSelectedLocation(''); setSelectedType(''); }} className="px-6 py-2 bg-[#1C244B] text-white rounded-lg font-semibold hover:bg-[#2a3561] transition-all duration-300">
                    Clear Filters
                  </button>
                </div>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-10">
                <button onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} disabled={currentPage === 1} className="px-4 py-2 bg-[#1C244B] text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#2a3561] transition-all">
                  Previous
                </button>
                <div className="flex gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button key={page} onClick={() => setCurrentPage(page)} className={`w-10 h-10 rounded-lg font-medium transition-all ${currentPage === page ? 'bg-[#1C244B] text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
                      {page}
                    </button>
                  ))}
                </div>
                <button onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages} className="px-4 py-2 bg-[#1C244B] text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#2a3561] transition-all">
                  Next
                </button>
              </div>
            )}
          </div>

          {/* Right Side - Contact Form */}
          <div className="lg:col-span-1">
            <div ref={formContainerRef} className="lg:sticky lg:top-24">
              <div className="bg-[#1C244B] text-white rounded-t-xl p-5">
                <h3 className="text-lg font-bold mb-4">Contact for Details</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" /></svg>
                    </div>
                    <div><p className="text-xs text-gray-300">Property Expert</p><p className="font-semibold text-sm">Rohit Kakkar</p></div>
                  </div>
                  <button onClick={handleCall} className="w-full flex items-center gap-2 bg-white/10 hover:bg-white/20 rounded-lg p-2.5 transition-colors duration-300">
                    <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                    </div>
                    <div className="text-left"><p className="text-xs text-gray-300">Call Now</p><p className="font-semibold text-sm">+91-9205596640</p></div>
                  </button>
                  <button onClick={handleWhatsApp} className="w-full flex items-center gap-2 bg-green-600 hover:bg-green-700 rounded-lg p-2.5 transition-colors duration-300">
                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.516"/></svg>
                    </div>
                    <div className="text-left"><p className="text-xs text-gray-200">WhatsApp</p><p className="font-semibold text-sm">Send Message</p></div>
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-b-xl shadow-xl p-5 border-t-2 border-gray-100">
                <h3 className="text-lg font-bold text-[#1C244B] mb-4">Send a Query</h3>
                <div className="space-y-3">
                  <input type="text" name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleInputChange} required className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1C244B] focus:border-transparent transition-all duration-300" />
                  <input type="email" name="email" placeholder="E-mail" value={formData.email} onChange={handleInputChange} required className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1C244B] focus:border-transparent transition-all duration-300" />
                  <input type="tel" name="mobile" placeholder="Mobile Number" value={formData.mobile} onChange={handleInputChange} required className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1C244B] focus:border-transparent transition-all duration-300" />
                  <textarea name="message" placeholder="Type your Message Here" value={formData.message} onChange={handleInputChange} rows={3} className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1C244B] focus:border-transparent transition-all duration-300 resize-none" />
                  {submitStatus.message && (
                    <div className={`p-2.5 rounded-lg text-xs ${submitStatus.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {submitStatus.message}
                    </div>
                  )}
                  <button onClick={handleSubmit} disabled={isSubmitting} className="w-full bg-[#1C244B] text-white px-4 py-2.5 text-sm rounded-lg font-semibold hover:bg-[#2a3561] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                    {isSubmitting ? <>Sending...</> : <>Request Callback</>}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PropertiesList;
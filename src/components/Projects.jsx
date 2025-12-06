import React, { useEffect, useRef, useState, useCallback } from 'react';
import projectsData from '../data/projects.json';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import emailjs from '@emailjs/browser';

gsap.registerPlugin(ScrollTrigger);

const Projects = () => {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const taglineRef = useRef(null);
  const cardsRef = useRef([]);
  const floatingShapesRef = useRef([]);
  const modalRef = useRef(null);
  
  const [visibleCount, setVisibleCount] = useState(6);
  const [showModal, setShowModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [formData, setFormData] = useState({ name: '', mobile: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Smooth floating animations for shapes with will-change optimization
      floatingShapesRef.current.forEach((shape, i) => {
        if (shape) {
          gsap.to(shape, {
            y: i % 2 === 0 ? -40 : 40,
            x: i % 2 === 0 ? 40 : -40,
            scale: 1.1,
            opacity: 0.8,
            duration: 8,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: i * 0.5,
            force3D: true
          });
        }
      });

      // Optimized heading entrance
      gsap.fromTo(headingRef.current,
        { y: 60, opacity: 0 },
        {
          scrollTrigger: { 
            trigger: headingRef.current, 
            start: 'top 85%',
            end: 'top 60%',
            toggleActions: 'play none none none',
            once: true
          },
          y: 0, 
          opacity: 1, 
          duration: 0.8, 
          ease: 'power2.out',
          force3D: true
        }
      );

      // Optimized tagline reveal
      gsap.fromTo(taglineRef.current,
        { y: 40, opacity: 0 },
        {
          scrollTrigger: { 
            trigger: taglineRef.current, 
            start: 'top 85%',
            toggleActions: 'play none none none',
            once: true
          },
          y: 0, 
          opacity: 1, 
          duration: 0.6, 
          delay: 0.2, 
          ease: 'power2.out',
          force3D: true
        }
      );

      // Optimized card entrance with reduced stagger
      cardsRef.current.forEach((card, i) => {
        if (card) {
          gsap.fromTo(card,
            { y: 50, opacity: 0 },
            {
              scrollTrigger: { 
                trigger: card, 
                start: 'top 92%',
                toggleActions: 'play none none none',
                once: true
              },
              y: 0, 
              opacity: 1, 
              duration: 0.6, 
              delay: i * 0.05, 
              ease: 'power2.out',
              force3D: true
            }
          );
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [visibleCount]);

  useEffect(() => {
    if (showModal && modalRef.current) {
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
      
      gsap.fromTo(modalRef.current, 
        { scale: 0.9, opacity: 0 }, 
        { scale: 1, opacity: 1, duration: 0.3, ease: 'power2.out' }
      );
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showModal]);

  const handleCardMouseMove = useCallback((e) => {
    const card = e.currentTarget.querySelector('.tilt-card');
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Reduced tilt effect for better performance
    gsap.to(card, { 
      rotationX: (y - centerY) / 35, 
      rotationY: (centerX - x) / 35, 
      transformPerspective: 1500, 
      duration: 0.4, 
      ease: 'power1.out',
      force3D: true,
      willChange: 'transform'
    });

    // Subtle image parallax
    const img = card.querySelector('.card-image');
    if (img) {
      gsap.to(img, { 
        x: (centerX - x) / 40, 
        y: (centerY - y) / 40, 
        scale: 1.03, 
        duration: 0.4,
        ease: 'power1.out',
        force3D: true
      });
    }
  }, []);

  const handleCardMouseLeave = useCallback((e) => {
    const card = e.currentTarget.querySelector('.tilt-card');
    if (!card) return;
    
    gsap.to(card, { 
      rotationX: 0, 
      rotationY: 0, 
      duration: 0.4,
      ease: 'power1.out',
      force3D: true,
      clearProps: 'willChange'
    });
    
    const img = card.querySelector('.card-image');
    if (img) {
      gsap.to(img, { 
        x: 0, 
        y: 0, 
        scale: 1, 
        duration: 0.4,
        ease: 'power1.out',
        force3D: true
      });
    }
  }, []);

  const handleViewDetails = useCallback((e, project) => {
    e.preventDefault();
    e.stopPropagation();

    const button = e.currentTarget;
    gsap.to(button, {
      scale: 0.96,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
      ease: 'power1.inOut',
      onComplete: () => {
        setSelectedProject(project);
        setShowModal(true);
      }
    });
  }, []);

  const handleCloseModal = useCallback(() => {
    gsap.to(modalRef.current, {
      scale: 0.9,
      opacity: 0,
      duration: 0.2,
      ease: 'power1.in',
      onComplete: () => {
        setShowModal(false);
        setSelectedProject(null);
        setFormData({ name: '', mobile: '' });
        setSubmitStatus('');
      }
    });
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('');

    const templateParams = {
      from_name: formData.name,
      mobile: formData.mobile,
      project_name: selectedProject?.name,
      project_location: selectedProject?.location,
      project_size: selectedProject?.size,
    };

    try {
      await emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams, 'YOUR_PUBLIC_KEY');
      setSubmitStatus('success');
      setTimeout(handleCloseModal, 2000);
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLoadMore = () => setVisibleCount(prev => prev + 6);
  const displayedProjects = projectsData.slice(0, visibleCount);

  return (
    <>
      <section ref={sectionRef} className="py-32 bg-white relative overflow-hidden">
        {/* Optimized Floating Gradients with will-change */}
        <div 
          ref={el => floatingShapesRef.current[0] = el} 
          className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-[#1C244B]/10 to-[#1C244B]/5 rounded-full blur-3xl pointer-events-none"
          style={{ willChange: 'transform' }}
        ></div>
        <div 
          ref={el => floatingShapesRef.current[1] = el} 
          className="absolute bottom-32 left-20 w-[500px] h-[500px] bg-gradient-to-tr from-[#1C244B]/8 to-transparent rounded-full blur-3xl pointer-events-none"
          style={{ willChange: 'transform' }}
        ></div>
        <div 
          ref={el => floatingShapesRef.current[2] = el} 
          className="absolute top-1/3 right-1/3 w-80 h-80 bg-gradient-to-bl from-[#1C244B]/6 to-transparent rounded-full blur-3xl pointer-events-none"
          style={{ willChange: 'transform' }}
        ></div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-20">
            <span className="inline-block px-6 py-2 bg-[#1C244B] text-white text-sm font-bold rounded-full shadow-lg mb-6">
              PREMIUM PORTFOLIO
            </span>
            <h2 ref={headingRef} className="text-3xl lg:text-5xl font-black mb-6 text-[#1C244B] leading-tight">
              Exceptional Projects
            </h2>
            <p ref={taglineRef} className="text-xl text-gray-600 max-w-3xl mx-auto font-medium">
              Discover world-class commercial spaces designed for success in Noida.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {displayedProjects.map((p, i) => (
              <div 
                key={p.id}
                ref={el => cardsRef.current[i] = el}
                className="group"
                onMouseMove={handleCardMouseMove}
                onMouseLeave={handleCardMouseLeave}
              >
                <div 
                  className="tilt-card relative bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300 border border-gray-100 h-full flex flex-col" 
                  style={{ transformStyle: 'preserve-3d', backfaceVisibility: 'hidden' }}
                >
                  {/* Optimized shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none z-10"></div>

                  <div className="relative h-56 overflow-hidden flex-shrink-0">
                    <div className="card-image absolute inset-0" style={{ willChange: 'transform' }}>
                      <img 
                        src={p.image} 
                        alt={p.name} 
                        className="w-full h-full object-cover" 
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>

                    <div className="absolute top-4 right-4">
                      <span className="bg-white/95 backdrop-blur-md px-4 py-2 rounded-full text-[#1C244B] font-bold text-sm shadow-lg">
                        {p.type}
                      </span>
                    </div>

                    <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2">
                      {p.availableFor.map((avail, idx) => (
                        <span key={idx} className="bg-[#1C244B] text-white px-3 py-1.5 rounded-full text-xs font-bold uppercase">
                          {avail}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="card-content p-6 flex flex-col flex-grow">
                    {/* Project Name */}
                    <h3 className="text-2xl font-black text-[#1C244B] mb-2 line-clamp-2">{p.name}</h3>
                    
                    {/* Category Badge */}
                    <div className="mb-3">
                      <span className="inline-block bg-[#1C244B]/10 text-[#1C244B] px-3 py-1 rounded-full text-xs font-bold">
                        {p.category}
                      </span>
                    </div>

                    {/* Location */}
                    <div className="flex items-center gap-2 mb-3 text-gray-700">
                      <svg className="w-4 h-4 text-[#1C244B] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      <p className="font-medium text-sm">{p.location}, Noida</p>
                    </div>

                    {/* Size */}
                    <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 rounded-xl">
                      <div className="w-10 h-10 rounded-lg bg-[#1C244B] flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v14a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM16 5a1 1 0 011-1h2a1 1 0 011 1v14a1 1 0 01-1 1h-2a1 1 0 01-1-1V5z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-bold uppercase">Size Range</p>
                        <p className="text-sm font-black text-[#1C244B]">{p.size}</p>
                      </div>
                    </div>

                    {/* Description */}
                    {p.description && (
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                        {p.description}
                      </p>
                    )}

                    {/* View Details Button */}
                    <button
                      onClick={(e) => handleViewDetails(e, p)}
                      className="mt-auto w-full bg-[#1C244B] text-white py-4 rounded-2xl font-bold hover:bg-[#2a3561] transition-colors duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                    >
                      View Details
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {visibleCount < projectsData.length && (
            <div className="text-center mt-20">
              <button 
                onClick={handleLoadMore} 
                className="px-12 py-5 bg-[#1C244B] text-white rounded-2xl font-bold text-lg shadow-2xl hover:scale-105 hover:bg-[#2a3561] transition-all duration-300"
              >
                Load More Excellence <span className="ml-2 px-3 py-1 bg-white/20 rounded-full text-sm">+{projectsData.length - visibleCount}</span>
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Modal */}
      {showModal && selectedProject && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" 
          onClick={handleCloseModal}
          style={{ touchAction: 'none' }}
        >
          <div 
            ref={modalRef} 
            className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden" 
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-[#1C244B] text-white p-8 relative">
              <h3 className="text-3xl font-black mb-2">Get Details</h3>
              <p className="text-white/80 text-sm font-medium">{selectedProject.name}</p>
              <button 
                onClick={handleCloseModal} 
                className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors duration-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-8">
              <form onSubmit={handleSubmit}>
                <input 
                  type="text" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleInputChange} 
                  placeholder="Full Name *" 
                  required 
                  className="w-full mb-5 px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#1C244B] focus:outline-none transition-colors duration-200" 
                />
                <input 
                  type="tel" 
                  name="mobile" 
                  value={formData.mobile} 
                  onChange={handleInputChange} 
                  placeholder="Mobile Number *" 
                  required 
                  pattern="[0-9]{10}" 
                  className="w-full mb-6 px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#1C244B] focus:outline-none transition-colors duration-200" 
                />

                {submitStatus === 'success' && (
                  <div className="p-4 bg-green-100 text-green-800 rounded-xl text-center font-bold mb-4">
                    Submitted Successfully!
                  </div>
                )}
                {submitStatus === 'error' && (
                  <div className="p-4 bg-red-100 text-red-800 rounded-xl text-center font-bold mb-4">
                    Submission Failed. Try Again.
                  </div>
                )}

                <button 
                  type="submit" 
                  disabled={isSubmitting} 
                  className="w-full bg-[#1C244B] text-white py-4 rounded-xl font-bold hover:bg-[#2a3561] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Details'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Projects;
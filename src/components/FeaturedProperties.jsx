import React, { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import emailjs from '@emailjs/browser';

gsap.registerPlugin(ScrollTrigger);

const FeaturedProperties = () => {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const taglineRef = useRef(null);
  const cardsRef = useRef([]);
  const floatingShapesRef = useRef([]);
  const modalRef = useRef(null);

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showModal, setShowModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [formData, setFormData] = useState({ name: '', mobile: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');

  const properties = [
    { id: 1, img: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00", area: "Sector 62, Noida", size: "25,000 sqft", type: "Furnished Office" },
    { id: 2, img: "https://images.unsplash.com/photo-1497366216548-37526070297c", area: "Sector 135, Noida", size: "1,00,000 sqft", type: "Warehouse" },
    { id: 3, img: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2", area: "Sector 18, Noida", size: "2,500 sqft", type: "Retail Shop" },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      floatingShapesRef.current.forEach((shape, i) => {
        if (shape) {
          gsap.to(shape, {
            y: "random(-40, 40)",
            x: "random(-40, 40)",
            rotation: "random(-20, 20)",
            duration: "random(4, 6)",
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: i * 0.3
          });
        }
      });

      gsap.fromTo(headingRef.current,
        { y: 100, opacity: 0, scale: 0.8, rotationX: -20 },
        {
          scrollTrigger: { trigger: headingRef.current, start: 'top 80%' },
          y: 0, opacity: 1, scale: 1, rotationX: 0, duration: 1.2, ease: 'power4.out'
        }
      );

      gsap.fromTo(taglineRef.current,
        { y: 50, opacity: 0, clipPath: 'inset(0 100% 0 0)' },
        {
          scrollTrigger: { trigger: taglineRef.current, start: 'top 85%' },
          y: 0, opacity: 1, clipPath: 'inset(0 0% 0 0)', duration: 1, delay: 0.3, ease: 'power3.out'
        }
      );

      cardsRef.current.forEach((card, i) => {
        if (card) {
          gsap.fromTo(card,
            { y: 150, opacity: 0, scale: 0.8, rotationY: -15 },
            {
              scrollTrigger: { trigger: card, start: 'top 85%' },
              y: 0, opacity: 1, scale: 1, rotationY: 0, duration: 1, delay: i * 0.15, ease: 'power3.out'
            }
          );
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (showModal && modalRef.current) {
      gsap.fromTo(modalRef.current, { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(1.7)' });
    }
  }, [showModal]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 25,
        y: (e.clientY / window.innerHeight - 0.5) * 25
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleCardMouseMove = useCallback((e) => {
    const card = e.currentTarget.querySelector('.tilt-card');
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    gsap.to(card, { 
      rotationX: (y - centerY) / 12, 
      rotationY: (centerX - x) / 12, 
      transformPerspective: 1000, 
      duration: 0.5 
    });

    const img = card.querySelector('.card-image');
    const content = card.querySelector('.card-content');
    if (img) gsap.to(img, { x: (centerX - x) / 25, y: (centerY - y) / 25, scale: 1.08, duration: 0.5 });
    if (content) gsap.to(content, { x: (x - centerX) / 35, y: (y - centerY) / 35, duration: 0.5 });
  }, []);

  const handleCardMouseLeave = useCallback((e) => {
    const card = e.currentTarget.querySelector('.tilt-card');
    if (!card) return;
    gsap.to(card, { rotationX: 0, rotationY: 0, duration: 0.5 });
    gsap.to(card.querySelector('.card-image'), { x: 0, y: 0, scale: 1, duration: 0.5 });
    gsap.to(card.querySelector('.card-content'), { x: 0, y: 0, duration: 0.5 });
  }, []);

  const handleViewDetails = useCallback((e, property) => {
    e.preventDefault();
    e.stopPropagation();
    gsap.to(e.currentTarget, {
      scale: 0.95,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
      onComplete: () => {
        setSelectedProperty(property);
        setShowModal(true);
      }
    });
  }, []);

  const handleCloseModal = useCallback(() => {
    gsap.to(modalRef.current, {
      scale: 0.8,
      opacity: 0,
      duration: 0.3,
      onComplete: () => {
        setShowModal(false);
        setSelectedProperty(null);
        setFormData({ name: '', mobile: '' });
        setSubmitStatus('');
      }
    });
  }, []);

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('');

    const templateParams = {
      from_name: formData.name,
      mobile: formData.mobile,
      project_name: selectedProperty?.area,
      project_size: selectedProperty?.size,
      project_type: selectedProperty?.type,
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

  return (
    <>
      <section ref={sectionRef} className="py-32 bg-white relative overflow-hidden">
        {/* Floating Shapes */}
        <div ref={el => floatingShapesRef.current[0] = el} className="absolute top-20 right-20 w-80 h-80 bg-[#1C244B]/5 rounded-full blur-3xl pointer-events-none" style={{ transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)` }}></div>
        <div ref={el => floatingShapesRef.current[1] = el} className="absolute bottom-20 left-20 w-96 h-96 bg-[#1C244B]/8 rounded-full blur-3xl pointer-events-none" style={{ transform: `translate(${-mousePosition.x}px, ${-mousePosition.y}px)` }}></div>
        <div ref={el => floatingShapesRef.current[2] = el} className="absolute top-1/2 left-1/2 w-72 h-72 bg-[#1C244B]/3 rounded-full blur-3xl pointer-events-none"></div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-20">
            <span className="inline-block px-6 py-2 bg-[#1C244B] text-white text-sm font-bold rounded-full shadow-lg mb-6">
              PREMIUM SELECTION
            </span>
            <h2 ref={headingRef} className="text-6xl md:text-7xl font-black mb-6 text-[#1C244B] leading-tight">
              Featured Properties
            </h2>
            <p ref={taglineRef} className="text-xl text-gray-600 max-w-3xl mx-auto font-medium">
              Handpicked premium commercial spaces in Noida’s most sought-after locations
            </p>
          </div>

          {/* Smaller & Compact Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {properties.map((p, i) => (
              <div
                key={p.id}
                ref={el => cardsRef.current[i] = el}
                onMouseMove={handleCardMouseMove}
                onMouseLeave={handleCardMouseLeave}
                className="group"
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* Compact Card */}
                <div className="tilt-card relative bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100 h-full flex flex-col">
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none z-10"></div>

                  {/* Smaller Image Height */}
                  <div className="relative h-48 overflow-hidden flex-shrink-0">
                    <div className="card-image absolute inset-0">
                      <img src={p.img} alt={p.area} className="w-full h-full object-cover" loading="lazy" />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>

                    <div className="absolute top-4 right-4">
                      <span className="bg-white/95 backdrop-blur-md px-4 py-2 rounded-full text-[#1C244B] font-bold text-xs shadow-lg">
                        {p.type}
                      </span>
                    </div>
                  </div>

                  <div className="card-content p-5 flex flex-col flex-grow">
                    <h3 className="text-xl font-black text-[#1C244B] mb-2 line-clamp-2">
                      {p.area}
                    </h3>

                    <div className="flex items-center gap-2 mb-3 text-gray-700 text-sm">
                      <svg className="w-4 h-4 text-[#1C244B]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      <p className="font-medium">{p.area.split(',')[0]}</p>
                    </div>

                    {/* Compact Size Box */}
                    <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 rounded-xl">
                      <div className="w-9 h-9 rounded-lg bg-[#1C244B] flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v14a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM16 5a1 1 0 011-1h2a1 1 0 011 1v14a1 1 0 01-1 1h-2a1 1 0 01-1-1V5z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-bold uppercase">Size</p>
                        <p className="text-lg font-black text-[#1C244B]">{p.size}</p>
                      </div>
                    </div>

                    <button
                      onClick={(e) => handleViewDetails(e, p)}
                      className="mt-auto w-full bg-[#1C244B] text-white py-3.5 rounded-2xl font-bold text-sm hover:bg-[#2a3561] transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2 group/btn"
                    >
                      View Details
                      <svg className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modal (unchanged) */}
      {showModal && selectedProperty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={handleCloseModal}>
          <div ref={modalRef} className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="bg-[#1C244B] text-white p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
              <div className="relative z-10">
                <h3 className="text-3xl font-black mb-2">Get Details</h3>
                <p className="text-white/80 text-sm font-medium">{selectedProperty.area} • {selectedProperty.size}</p>
              </div>
              <button onClick={handleCloseModal} className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-8">
              <form onSubmit={handleSubmit}>
                <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Full Name *" required className="w-full mb-5 px-5 py-4 rounded-xl border-2 border-gray-200 focus:border-[#1C244B] focus:outline-none text-gray-800 font-medium" />
                <input type="tel" name="mobile" value={formData.mobile} onChange={handleInputChange} placeholder="Mobile Number *" required pattern="[0-9]{10}" className="w-full mb-6 px-5 py-4 rounded-xl border-2 border-gray-200 focus:border-[#1C244B] focus:outline-none text-gray-800 font-medium" />

                {submitStatus === 'success' && <div className="p-4 bg-green-100 text-green-800 rounded-xl text-center font-bold mb-4">Submitted Successfully!</div>}
                {submitStatus === 'error' && <div className="p-4 bg-red-100 text-red-800 rounded-xl text-center font-bold mb-4">Failed. Try Again.</div>}

                <button type="submit" disabled={isSubmitting} className="w-full bg-[#1C244B] text-white py-4 rounded-xl font-bold hover:bg-[#2a3561] transition-all disabled:opacity-50">
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

export default FeaturedProperties;
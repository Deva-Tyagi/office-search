import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import emailjs from '@emailjs/browser';
import { User, Phone, X } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);
emailjs.init('FPyANi4X-1gUfsMCI'); // ← Your EmailJS public key

const WhyChooseUs = () => {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const cardsRef = useRef([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');

  const stats = [
    { 
      number: "15+", 
      label: "Years",
      desc: "in Noida Commercial Market",
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    { 
      number: "10000+", 
      label: "Owners",
      desc: "Property Owners",
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
    { 
      number: "100%", 
      label: "Direct",
      desc: "No Brokerage Deals",
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    { 
      number: "24/7", 
      label: "Support",
      desc: "Support & Site Visits",
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )
    },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(headingRef.current, { y: 50, opacity: 0 }, {
        scrollTrigger: { trigger: headingRef.current, start: 'top 85%', once: true },
        y: 0, opacity: 1, duration: 0.8, ease: 'power2.out'
      });

      ScrollTrigger.batch(cardsRef.current, {
        onEnter: batch => gsap.fromTo(batch, { y: 60, opacity: 0, scale: 0.9 }, {
          y: 0, opacity: 1, scale: 1, duration: 0.6, stagger: 0.15, ease: 'back.out(1.3)'
        }),
        start: 'top 85%',
        once: true
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleCardHover = (e, isEntering) => {
    const card = e.currentTarget;
    const icon = card.querySelector('.stat-icon');
    const number = card.querySelector('.stat-number');

    if (isEntering) {
      gsap.to(card, { y: -10, duration: 0.3 });
      gsap.to(icon, { scale: 1.15, rotate: 10, duration: 0.3 });
      gsap.to(number, { scale: 1.05, duration: 0.3 });
    } else {
      gsap.to(card, { y: 0, duration: 0.3 });
      gsap.to(icon, { scale: 1, rotate: 0, duration: 0.3 });
      gsap.to(number, { scale: 1, duration: 0.3 });
    }
  };

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
        message: `Why Choose Us Enquiry\nName: ${formData.name}\nPhone: ${formData.phone}\nTime: ${new Date().toLocaleString('en-IN')}`,
        request_type: 'Why Choose Us',
      };

      await emailjs.send('service_91dd84g', 'template_ncabbum', emailData);
      setSubmitStatus('Thank you! We will call you shortly.');
      setFormData({ name: '', phone: '' });
      setTimeout(() => {
        setSubmitStatus('');
        setIsPopupOpen(false);
      }, 2500);
    } catch (error) {
      setSubmitStatus('Failed to send. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <section ref={sectionRef} className="py-24 bg-[#1C244B] text-white relative overflow-hidden">
        {/* Decorative elements - kept exactly as yours */}
        <div className="absolute top-0 left-0 w-full h-full opacity-5">
          <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full">
            <div className="grid grid-cols-8 gap-8 opacity-20">
              {[...Array(64)].map((_, i) => (
                <div key={i} className="w-2 h-2 bg-white rounded-full"></div>
              ))}
            </div>
          </div>
        </div>

        <div className="container mx-auto px-6 text-center relative z-10">
          <h2 ref={headingRef} className="text-3xl lg:text-5xl font-bold mb-6">
            Why Choose Office Search?
          </h2>
          <p className="text-xl text-white/80 mb-16 max-w-3xl mx-auto">
            Your trusted partner in finding the perfect commercial space
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div 
                key={i}
                ref={el => cardsRef.current[i] = el}
                onMouseEnter={(e) => handleCardHover(e, true)}
                onMouseLeave={(e) => handleCardHover(e, false)}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:bg-white/15 hover:border-white/30 transition-all duration-300 cursor-pointer group"
              >
                <div className="stat-icon text-white/90 mb-6 inline-block">
                  {stat.icon}
                </div>
                <h3 className="stat-number text-5xl font-bold mb-2 text-white">
                  {stat.number}
                </h3>
                <p className="text-2xl font-semibold text-white/90 mb-3">
                  {stat.label}
                </p>
                <p className="text-white/70 text-sm leading-relaxed">
                  {stat.desc}
                </p>
                <div className="mt-6 h-1 w-16 bg-white/30 rounded-full mx-auto group-hover:w-full group-hover:bg-white/50 transition-all duration-500"></div>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <div className="mt-16 bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-4xl mx-auto">
            <h3 className="text-2xl lg:text-3xl font-bold mb-4">Ready to Find Your Perfect Space?</h3>
            <p className="text-white/80 mb-6 text-lg">
              Let our experts guide you to the ideal commercial property for your business
            </p>
            <button 
              onClick={() => setIsPopupOpen(true)}
              className="bg-white text-[#1C244B] px-10 py-4 rounded-xl font-bold text-lg hover:bg-white/90 hover:scale-105 transition-all duration-300 shadow-xl"
            >
              Get Started Today
            </button>
          </div>
        </div>
      </section>

      {/* Popup Form - Same Dark Blue & White Theme */}
      {isPopupOpen && (
        <div className="fixed inset-0 bg-black/70 z-[9999] flex items-center justify-center p-4">
          <div className="bg-[#1C244B] text-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
            <button 
              onClick={() => setIsPopupOpen(false)}
              className="absolute top-4 right-4 text-white/60 hover:text-white transition"
            >
              <X className="w-7 h-7" />
            </button>

            <h2 className="text-3xl font-bold mb-8">Get Free Consultation</h2>
            <p className="text-white/70 mb-8">Our expert will connect with you within 24 hours.</p>

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
                  name="name"
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
                  name="phone"
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

export default WhyChooseUs;
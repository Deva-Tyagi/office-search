import React, { useEffect, useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const EnquiryForm = () => {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const formRef = useRef(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    requirement: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Heading animation
      gsap.fromTo(headingRef.current,
        { y: 50, opacity: 0 },
        {
          scrollTrigger: {
            trigger: headingRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
            once: true
          },
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out'
        }
      );

      // Form animation
      gsap.fromTo(formRef.current,
        { y: 60, opacity: 0, scale: 0.95 },
        {
          scrollTrigger: {
            trigger: formRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
            once: true
          },
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          delay: 0.2,
          ease: 'back.out(1.2)'
        }
      );

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    // Button click animation
    gsap.to(e.target.querySelector('button[type="submit"]'), {
      scale: 0.95,
      duration: 0.1,
      yoyo: true,
      repeat: 1
    });

    try {
      // Initialize EmailJS with your public key
      // Replace with your actual EmailJS credentials
      const result = await emailjs.send(
        'YOUR_SERVICE_ID',      // Replace with your EmailJS service ID
        'YOUR_TEMPLATE_ID',     // Replace with your EmailJS template ID
        {
          from_name: formData.name,
          from_email: formData.email,
          phone: formData.phone,
          requirement: formData.requirement,
          to_name: 'Office Search Team',
        },
        'YOUR_PUBLIC_KEY'        // Replace with your EmailJS public key
      );

      if (result.text === 'OK') {
        setSubmitStatus('success');
        setFormData({
          name: '',
          phone: '',
          email: '',
          requirement: ''
        });

        // Success animation
        gsap.to(formRef.current, {
          scale: 1.02,
          duration: 0.2,
          yoyo: true,
          repeat: 1,
          ease: 'power2.inOut'
        });
      }
    } catch (error) {
      console.error('EmailJS Error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
      
      // Clear status after 5 seconds
      setTimeout(() => {
        setSubmitStatus(null);
      }, 5000);
    }
  };

  return (
    <section ref={sectionRef} className="py-24 bg-gradient-to-br from-[#1C244B] to-[#2a3561] relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10">
        <div className="absolute top-20 right-20 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-white rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-6 text-center relative z-10">
        <h2 ref={headingRef} className="text-3xl lg:text-5xl font-bold text-white mb-4">
          Ready to Find Your Perfect Office?
        </h2>
        <p className="text-xl text-white/80 mb-12 max-w-3xl mx-auto">
          Fill out the form below and our team will get back to you within 24 hours
        </p>

        <form 
          ref={formRef}
          onSubmit={handleSubmit} 
          className="max-w-3xl mx-auto bg-white/95 backdrop-blur-md p-10 rounded-3xl shadow-2xl border border-white/20"
        >
          <div className="grid md:grid-cols-2 gap-6">
            {/* Name Input */}
            <div className="relative group">
              <label className="block text-left text-sm font-semibold text-[#1C244B] mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#1C244B]/50">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe" 
                  className="w-full border-2 border-gray-200 p-4 pl-12 rounded-xl focus:border-[#1C244B] focus:outline-none transition-all duration-300 text-[#1C244B] font-medium" 
                  required 
                />
              </div>
            </div>

            {/* Phone Input */}
            <div className="relative group">
              <label className="block text-left text-sm font-semibold text-[#1C244B] mb-2">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#1C244B]/50">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <input 
                  type="tel" 
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 98765 43210" 
                  className="w-full border-2 border-gray-200 p-4 pl-12 rounded-xl focus:border-[#1C244B] focus:outline-none transition-all duration-300 text-[#1C244B] font-medium" 
                  required 
                />
              </div>
            </div>

            {/* Email Input */}
            <div className="relative group">
              <label className="block text-left text-sm font-semibold text-[#1C244B] mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#1C244B]/50">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@company.com" 
                  className="w-full border-2 border-gray-200 p-4 pl-12 rounded-xl focus:border-[#1C244B] focus:outline-none transition-all duration-300 text-[#1C244B] font-medium" 
                />
              </div>
            </div>

            {/* Requirement Input */}
            <div className="relative group">
              <label className="block text-left text-sm font-semibold text-[#1C244B] mb-2">
                Your Requirement
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#1C244B]/50">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <input 
                  type="text" 
                  name="requirement"
                  value={formData.requirement}
                  onChange={handleChange}
                  placeholder="e.g., 20,000 sqft in Sector 62" 
                  className="w-full border-2 border-gray-200 p-4 pl-12 rounded-xl focus:border-[#1C244B] focus:outline-none transition-all duration-300 text-[#1C244B] font-medium" 
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="mt-8 bg-[#1C244B] text-white px-12 py-4 rounded-xl font-bold text-lg hover:bg-[#2a3561] transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-3 mx-auto"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>SUBMITTING...</span>
              </>
            ) : (
              <>
                <span>SUBMIT ENQUIRY</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </>
            )}
          </button>

          {/* Status Messages */}
          {submitStatus === 'success' && (
            <div className="mt-6 bg-green-100 border-2 border-green-500 text-green-700 px-6 py-4 rounded-xl flex items-center gap-3 animate-pulse">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-semibold">Success! We'll contact you within 24 hours.</span>
            </div>
          )}

          {submitStatus === 'error' && (
            <div className="mt-6 bg-red-100 border-2 border-red-500 text-red-700 px-6 py-4 rounded-xl flex items-center gap-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-semibold">Oops! Something went wrong. Please try again.</span>
            </div>
          )}
        </form>

        {/* Additional Info */}
        <div className="mt-12 flex flex-wrap justify-center gap-8 text-white/80">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Quick 24hr Response</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span>100% Secure</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <span>No Spam Calls</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EnquiryForm;
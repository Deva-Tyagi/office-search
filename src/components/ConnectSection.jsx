import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

const ConnectSection = () => {
  const sectionRef = useRef(null);
  const contentRef = useRef(null);
  const imageRef = useRef(null);
  const floatingShapeRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Floating shape animation
      if (floatingShapeRef.current) {
        gsap.to(floatingShapeRef.current, {
          y: -30,
          x: 30,
          scale: 1.1,
          duration: 6,
          repeat: -1,
          yoyo: true,
          ease: "power1.inOut"
        });
      }

      // Content animation
      gsap.fromTo(contentRef.current,
        { x: -60, opacity: 0 },
        {
          scrollTrigger: {
            trigger: contentRef.current,
            start: 'top 85%',
            once: true
          },
          x: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out'
        }
      );

      // Image animation
      gsap.fromTo(imageRef.current,
        { x: 60, opacity: 0, scale: 0.95 },
        {
          scrollTrigger: {
            trigger: imageRef.current,
            start: 'top 85%',
            once: true
          },
          x: 0,
          opacity: 1,
          scale: 1,
          duration: 1,
          ease: 'power3.out'
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 bg-gradient-to-br from-white to-gray-50 relative overflow-hidden">
      {/* Floating gradient shape */}
      <div ref={floatingShapeRef} className="absolute top-20 right-1/4 w-96 h-96 bg-gradient-to-br from-[#1C244B]/10 to-transparent rounded-full blur-3xl pointer-events-none"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center max-w-7xl mx-auto">
          {/* Left Content */}
          <div ref={contentRef} className="space-y-8">
            <div>
              <span className="inline-block px-5 py-2 bg-[#1C244B] text-white text-xs font-bold rounded-full shadow-lg mb-6 uppercase tracking-wider">
                Our Promise
              </span>
              <h2 className="text-3xl lg:text-5xl font-black text-[#1C244B] leading-tight mb-6">
                We're Not Just a <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1C244B] to-[#2a3561]">Service Provider</span>
              </h2>
              <div className="w-24 h-1.5 bg-gradient-to-r from-[#1C244B] to-transparent rounded-full mb-6"></div>
            </div>

            <p className="text-lg text-gray-700 leading-relaxed font-medium">
              We're your trusted partner in finding the perfect commercial space that elevates your business. With deep market expertise, personalized attention, and unwavering commitment to your success, we transform property searches into strategic investments.
            </p>

            <p className="text-lg text-gray-700 leading-relaxed font-medium">
              Every client receives white-glove service—from initial consultation to lease signing and beyond. We don't just show properties; we understand your vision, analyze market trends, and negotiate the best terms that align with your business goals.
            </p>

            <div className="flex flex-wrap gap-6 pt-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#1C244B] flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="font-black text-[#1C244B] text-lg">Personalized Service</p>
                  <p className="text-sm text-gray-600">Tailored to your needs</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#1C244B] flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <p className="font-black text-[#1C244B] text-lg">Fast Results</p>
                  <p className="text-sm text-gray-600">Quick turnaround time</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#1C244B] flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <p className="font-black text-[#1C244B] text-lg">Trusted Expertise</p>
                  <p className="text-sm text-gray-600">Years of experience</p>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <Link to="/contact" className="inline-block">
              <button className="px-10 py-5 bg-[#1C244B] text-white rounded-2xl font-bold text-lg shadow-xl hover:scale-105 hover:bg-[#2a3561] transition-all duration-300 flex items-center gap-3">
                Start Your Journey
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
              </Link>
            </div>
          </div>

          {/* Right Image */}
          <div ref={imageRef} className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-[#1C244B]/20 to-[#1C244B]/10 rounded-3xl blur-2xl"></div>
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&h=1000&fit=crop" 
                alt="Professional team handshake" 
                className="w-full h-[600px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1C244B]/30 to-transparent"></div>
              
              {/* Floating stats card */}
              <div className="absolute bottom-8 left-8 right-8 bg-white/95 backdrop-blur-md rounded-2xl p-6 shadow-xl">
                <div className="grid grid-cols-3 gap-8 text-center">
                  <div>
                    <p className="sm:text-xl md:text-2xl lg:text-3xl font-black text-[#1C244B]">2M+</p>
                    <p className="text-xs text-gray-600 font-bold uppercase mt-1">Sq. Ft. Leased</p>
                  </div>
                  <div className="border-l border-r border-gray-200">
                    <p className="sm:text-xl md:text-2xl lg:text-3xl font-black text-[#1C244B]">10000+</p>
                    <p className="text-xs text-gray-600 font-bold uppercase mt-1">Property Owners</p>
                  </div>
                  <div>
                    <p className="sm:text-xl md:text-2xl lg:text-3xl font-black text-[#1C244B]">15+</p>
                    <p className="text-xs text-gray-600 font-bold uppercase mt-1">Years</p>
                  </div> 
                </div>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-[#1C244B]/10 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-6 -left-6 w-40 h-40 bg-[#1C244B]/10 rounded-full blur-2xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ConnectSection;
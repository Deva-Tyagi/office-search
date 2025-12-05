import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import gsap from 'gsap';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const headerRef = useRef(null);
  const logoRef = useRef(null);
  const navItemsRef = useRef([]);
  const ctaRef = useRef(null);
  const contactRef = useRef(null);
  const mobileMenuRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.from(logoRef.current, { x: -50, opacity: 0, duration: 0.8 })
        .from(navItemsRef.current, { y: -20, opacity: 0, duration: 0.5, stagger: 0.1 }, '-=0.5');
      
      // Animate contact and CTA only if they exist
      if (contactRef.current) {
        tl.fromTo(contactRef.current, 
          { x: 30, opacity: 0 }, 
          { x: 0, opacity: 1, duration: 0.6 }, 
          '-=0.4'
        );
      }
      if (ctaRef.current) {
        tl.fromTo(ctaRef.current, 
          { scale: 0, opacity: 0 }, 
          { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(2)' }, 
          '-=0.3'
        );
      }
    }, headerRef);

    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);

    return () => {
      ctx.revert();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  useEffect(() => {
    if (mobileMenuRef.current) {
      gsap.to(mobileMenuRef.current, {
        height: isMobileMenuOpen ? 'auto' : 0,
        opacity: isMobileMenuOpen ? 1 : 0,
        duration: 0.4,
        ease: isMobileMenuOpen ? 'power2.out' : 'power2.in'
      });
    }
  }, [isMobileMenuOpen]);

  const handleNavHover = (e, isEntering) => {
    gsap.to(e.currentTarget, { y: isEntering ? -2 : 0, duration: 0.3 });
  };

  const handleCtaHover = (e, isEntering) => {
    gsap.to(e.currentTarget, { scale: isEntering ? 1.05 : 1, duration: 0.3, ease: isEntering ? 'back.out(2)' : 'power2.out' });
  };

  const scrollToSection = (id) => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  const goToProperties = () => {
    navigate('/properties');
    setIsMobileMenuOpen(false);
  };

  const goToAbout = () => {
    navigate('/about');
    setIsMobileMenuOpen(false);
  };

  const goToContact = () => {
    navigate('/contact');
    setIsMobileMenuOpen(false);
  };

  return (
    <header
      ref={headerRef}
      className={`fixed w-full top-0 z-50 bg-white shadow-lg py-4 transition-shadow duration-300 ${
        isScrolled ? 'shadow-xl' : 'shadow-lg'
      }`}
    >
      <div className="container mx-auto flex justify-between items-center px-6">
        {/* Logo */}
        <div
          ref={logoRef}
          className="cursor-pointer"
          onClick={() => navigate('/')}
        >
          <img 
            src="/logo.png" 
            alt="Office Search Logo" 
            className="h-10 w-auto" 
          />
        </div>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center space-x-8">
          <button
            ref={el => navItemsRef.current[0] = el}
            onClick={() => navigate('/')}
            onMouseEnter={(e) => handleNavHover(e, true)}
            onMouseLeave={(e) => handleNavHover(e, false)}
            className="font-semibold text-gray-700 hover:text-[#1C244B] relative group transition-colors"
          >
            Home
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#1C244B] transition-all duration-300 group-hover:w-full"></span>
          </button>

          <button
            ref={el => navItemsRef.current[1] = el}
            onClick={goToProperties}
            onMouseEnter={(e) => handleNavHover(e, true)}
            onMouseLeave={(e) => handleNavHover(e, false)}
            className="font-semibold text-gray-700 hover:text-[#1C244B] relative group transition-colors"
          >
            Properties
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#1C244B] transition-all duration-300 group-hover:w-full"></span>
          </button>

          <button
            ref={el => navItemsRef.current[2] = el}
            onClick={goToAbout}
            onMouseEnter={(e) => handleNavHover(e, true)}
            onMouseLeave={(e) => handleNavHover(e, false)}
            className="font-semibold text-gray-700 hover:text-[#1C244B] relative group transition-colors"
          >
            About
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#1C244B] transition-all duration-300 group-hover:w-full"></span>
          </button>

          <button
            ref={el => navItemsRef.current[3] = el}
            onClick={goToContact}
            onMouseEnter={(e) => handleNavHover(e, true)}
            onMouseLeave={(e) => handleNavHover(e, false)}
            className="font-semibold text-gray-700 hover:text-[#1C244B] relative group transition-colors"
          >
            Contact
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#1C244B] transition-all duration-300 group-hover:w-full"></span>
          </button>
        </nav>

        {/* Contact Number & CTA */}
        <div className="hidden md:flex items-center gap-4">
          {/* Contact Badge */}
          <a
            ref={contactRef}
            href="tel:+919205596640"
            className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-xl border border-gray-200 hover:border-[#1C244B] hover:bg-[#1C244B]/5 transition-all duration-300 group"
          >
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#1C244B] flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div className="text-left">
                <p className="text-xs text-gray-500 font-medium">Contact Us</p>
                <p className="text-sm font-bold text-[#1C244B] group-hover:text-[#2a3561]">+91 9205596640</p>
              </div>
            </div>
          </a>

          {/* CTA Button */}
          <button
            ref={ctaRef}
            onMouseEnter={(e) => handleCtaHover(e, true)}
            onMouseLeave={(e) => handleCtaHover(e, false)}
            onClick={() => scrollToSection('enquiry')}
            className="px-6 py-2.5 bg-[#1C244B] text-white rounded-xl font-bold shadow-lg hover:bg-[#2a3561] transition-all"
          >
            Enquire Now
          </button>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden p-2 rounded-lg text-[#1C244B]"
        >
          {isMobileMenuOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      <div ref={mobileMenuRef} className="lg:hidden overflow-hidden bg-white border-t border-gray-200" style={{ height: 0, opacity: 0 }}>
        <nav className="container mx-auto px-6 py-4 flex flex-col space-y-4">
          <button onClick={() => { navigate('/'); setIsMobileMenuOpen(false); }} className="text-left font-semibold py-2 border-b border-gray-200 text-gray-700">Home</button>
          <button onClick={goToProperties} className="text-left font-semibold py-2 border-b border-gray-200 text-gray-700">Properties</button>
          <button onClick={goToAbout} className="text-left font-semibold py-2 border-b border-gray-200 text-gray-700">About</button>
          <button onClick={goToContact} className="text-left font-semibold py-2 border-b border-gray-200 text-gray-700">Contact</button>
          
          {/* Mobile Contact Number */}
          <a
            href="tel:+919205596640"
            className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl border border-gray-200"
          >
            <div className="w-10 h-10 rounded-full bg-[#1C244B] flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <div className="text-left">
              <p className="text-xs text-gray-500 font-medium">Contact Us</p>
              <p className="text-base font-bold text-[#1C244B]">+91 9205596640</p>
            </div>
          </a>

          <button
            onClick={() => { scrollToSection('enquiry'); setIsMobileMenuOpen(false); }}
            className="px-6 py-3 bg-[#1C244B] text-white rounded-xl font-bold mt-4"
          >
            Enquire Now
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
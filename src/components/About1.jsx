import React, { useState, useEffect, useRef } from 'react';
import { Building2, Briefcase, Warehouse, Users, X } from 'lucide-react';
import emailjs from '@emailjs/browser';
import AboutUsBanner from './About';
import PrimeDestinationSection from './About2';

export default function CommercialLeasingPage() {
  const [scrollRotation, setScrollRotation] = useState(0);
  const [showVisitModal, setShowVisitModal] = useState(false);
  const [showEnquireModal, setShowEnquireModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' });
  const leftSectionRef = useRef(null);

  // Initialize EmailJS (add this in useEffect or at component mount)
  useEffect(() => {
    emailjs.init("YOUR_PUBLIC_KEY"); // Replace with your EmailJS public key
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (leftSectionRef.current) {
        const scrollY = window.scrollY;
        const rotation = scrollY * 0.5;
        setScrollRotation(rotation);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const services = [
    {
      icon: <Building2 className="w-12 h-12" />,
      title: "Commercial Offices",
      description: "Premium office spaces in prime locations with modern amenities and flexible lease terms."
    },
    {
      icon: <Briefcase className="w-12 h-12" />,
      title: "Managed Offices",
      description: "Fully serviced office solutions with professional management and comprehensive support services."
    },
    {
      icon: <Warehouse className="w-12 h-12" />,
      title: "Warehouses",
      description: "Strategic warehouse facilities with excellent connectivity and modern logistics infrastructure."
    },
    {
      icon: <Users className="w-12 h-12" />,
      title: "Co-Working Spaces",
      description: "Dynamic collaborative environments designed for modern businesses and entrepreneurs."
    },
  ];

  const handleVisitSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: '', message: '' });

    const formData = {
      name: e.target.name.value,
      email: e.target.email.value,
      phone: e.target.phone.value,
      date: e.target.date.value,
      time: e.target.time.value,
      propertyType: e.target.propertyType.value,
      message: e.target.message.value,
    };

    try {
      await emailjs.send(
        'YOUR_SERVICE_ID', // Replace with your EmailJS service ID
        'YOUR_TEMPLATE_ID', // Replace with your EmailJS template ID for visit scheduling
        formData
      );
      
      setSubmitStatus({ 
        type: 'success', 
        message: 'Visit scheduled successfully! We will contact you soon.' 
      });
      e.target.reset();
      
      setTimeout(() => {
        setShowVisitModal(false);
        setSubmitStatus({ type: '', message: '' });
      }, 2000);
    } catch (error) {
      setSubmitStatus({ 
        type: 'error', 
        message: 'Failed to schedule visit. Please try again.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEnquireSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: '', message: '' });

    const formData = {
      name: e.target.name.value,
      phone: e.target.phone.value,
    };

    try {
      await emailjs.send(
        'YOUR_SERVICE_ID', // Replace with your EmailJS service ID
        'YOUR_ENQUIRY_TEMPLATE_ID', // Replace with your EmailJS template ID for enquiries
        formData
      );
      
      setSubmitStatus({ 
        type: 'success', 
        message: 'Enquiry submitted successfully! We will contact you soon.' 
      });
      e.target.reset();
      
      setTimeout(() => {
        setShowEnquireModal(false);
        setSubmitStatus({ type: '', message: '' });
      }, 2000);
    } catch (error) {
      setSubmitStatus({ 
        type: 'error', 
        message: 'Failed to submit enquiry. Please try again.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
    <AboutUsBanner />
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="flex flex-col lg:flex-row relative">
        {/* Left Section - Scrollable */}
        <div ref={leftSectionRef} className="w-full lg:w-1/2 p-8 lg:p-16 relative z-30">
          <div className="max-w-xl">
            <p className="text-sm font-semibold text-gray-600 tracking-widest mb-4">
              HOW WE ARE UNIQUE
            </p>
            
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              We Offer Comprehensive Commercial Real Estate Solutions.
            </h1>
            
            <p className="text-gray-600 text-lg mb-12 leading-relaxed">
              Discover premium commercial spaces tailored to your business needs. From modern offices to strategic warehouses, we provide flexible leasing options with professional management and world-class amenities.
            </p>

            {/* Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {services.map((service, index) => (
                <div 
                  key={index}
                  className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="text-blue-900 mb-4">
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {service.description}
                  </p>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => setShowVisitModal(true)}
                className="bg-gray-900 text-white px-8 py-4 rounded font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
              >
                SCHEDULE A VISIT →
              </button>
              <button 
                onClick={() => setShowEnquireModal(true)}
                className="bg-blue-100 text-gray-900 px-8 py-4 rounded font-semibold hover:bg-blue-200 transition-colors flex items-center justify-center gap-2"
              >
                ENQUIRE NOW →
              </button>
            </div>
          </div>
        </div>

        {/* Right Section - Fixed */}
        <div className="w-full lg:w-1/2 lg:sticky lg:top-40 lg:h-screen lg:flex lg:items-start lg:justify-center lg:self-start">
          <div className="relative w-full lg:w-5/6 lg:max-w-2xl">
            <div className="relative h-96 lg:h-[500px] rounded-lg overflow-visible shadow-lg">
              <img 
                src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=1200&fit=crop" 
                alt="Modern Commercial Building"
                className="w-full h-full object-cover rounded-lg"
              />
              
              {/* Rotating Text Circle */}
              <div className="absolute -bottom-8 -left-8 z-10">
                <div className="relative w-32 h-32 lg:w-36 lg:h-36">
                  {/* Background Circle */}
                  <div className="absolute inset-0 bg-gray-900 rounded-full"></div>
                  
                  {/* White Center Circle */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 lg:w-18 lg:h-18 bg-white rounded-full"></div>
                  </div>
                  
                  {/* Rotating Text */}
                  <svg 
                    className="absolute inset-0 w-full h-full"
                    style={{ transform: `rotate(${scrollRotation}deg)` }}
                    viewBox="0 0 160 160"
                  >
                    <defs>
                      <path
                        id="circlePath"
                        d="M 80, 80 m -60, 0 a 60,60 0 1,1 120,0 a 60,60 0 1,1 -120,0"
                      />
                    </defs>
                    <text className="text-[16px] fill-white font-medium tracking-wider">
                      <textPath href="#circlePath">
                        Delivering High Quality • Effective Flexibility • 
                      </textPath>
                    </text>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Schedule Visit Modal */}
      {showVisitModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Schedule a Visit</h2>
              <button 
                onClick={() => setShowVisitModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleVisitSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name *
                </label>
                <input 
                  type="text" 
                  name="name"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your name"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email *
                </label>
                <input 
                  type="email" 
                  name="email"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input 
                  type="tel" 
                  name="phone"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your phone number"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Preferred Date *
                </label>
                <input 
                  type="date" 
                  name="date"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Preferred Time *
                </label>
                <input 
                  type="time" 
                  name="time"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Property Type *
                </label>
                <select 
                  name="propertyType"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select property type</option>
                  <option value="Commercial Offices">Commercial Offices</option>
                  <option value="Managed Offices">Managed Offices</option>
                  <option value="Warehouses">Warehouses</option>
                  <option value="Co-Working Spaces">Co-Working Spaces</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Additional Message
                </label>
                <textarea 
                  name="message"
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Any specific requirements or questions..."
                />
              </div>

              {submitStatus.message && (
                <div className={`p-4 rounded-lg ${
                  submitStatus.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {submitStatus.message}
                </div>
              )}

              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gray-900 text-white py-4 rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'Schedule Visit'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Enquire Now Modal */}
      {showEnquireModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="bg-white border-b border-gray-200 p-6 flex justify-between items-center rounded-t-lg">
              <h2 className="text-2xl font-bold text-gray-900">Enquire Now</h2>
              <button 
                onClick={() => setShowEnquireModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleEnquireSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name *
                </label>
                <input 
                  type="text" 
                  name="name"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your name"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Mobile Number *
                </label>
                <input 
                  type="tel" 
                  name="phone"
                  required
                  pattern="[0-9]{10}"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your mobile number"
                />
              </div>

              {submitStatus.message && (
                <div className={`p-4 rounded-lg ${
                  submitStatus.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {submitStatus.message}
                </div>
              )}

              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gray-900 text-white py-4 rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Enquiry'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Scroll to Top Button */}
      <button 
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-8 right-8 bg-gray-900 text-white p-4 rounded shadow-lg hover:bg-gray-800 transition-colors z-50"
      >
        ↑
      </button>
    </div>
    <PrimeDestinationSection />
    </>
  );
}
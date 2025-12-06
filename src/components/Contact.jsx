import React, { useState, useRef } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle, AlertCircle, Building2, Users, Award, Headset } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    propertyType: '',
    message: ''
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  // Replace these with your EmailJS credentials
  const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID';
  const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';
  const EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY';

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      // Load EmailJS script dynamically
      if (!window.emailjs) {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
        script.async = true;
        document.body.appendChild(script);
        
        await new Promise((resolve) => {
          script.onload = resolve;
        });
        
        window.emailjs.init(EMAILJS_PUBLIC_KEY);
      }

      // Send email using EmailJS
      const result = await window.emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          from_name: formData.name,
          from_email: formData.email,
          phone: formData.phone,
          subject: formData.subject,
          property_type: formData.propertyType,
          message: formData.message,
          to_name: 'Commercial Real Estate Team',
        }
      );

      if (result.text === 'OK') {
        setStatus({
          type: 'success',
          message: 'Thank you! Your message has been sent successfully. We will get back to you soon.'
        });
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          propertyType: '',
          message: ''
        });
      }
    } catch (error) {
      setStatus({
        type: 'error',
        message: 'Oops! Something went wrong. Please try again or contact us directly.'
      });
      console.error('EmailJS Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: <MapPin className="w-6 h-6" />,
      title: 'Visit Our Office',
      details: ['M Floor, WTT Tower', 'Sector 16', 'Noida, UP 201301'],
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: 'Call Us',
      details: ['+91 920 559 6641','+91 920 559 6640'],
      color: 'from-emerald-500 to-emerald-600'
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: 'Email Us',
      details: ['info@officesearch.in'],
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: 'Business Hours',
      details: ['Mon - Sat: 10:00 AM - 6:30 PM', 'Sun: Closed'],
      color: 'from-amber-500 to-amber-600'
    }
  ];

  const features = [
    {
      icon: <Award className="w-6 h-6" />,
      text: '15+ years of commercial real estate expertise'
    },
    {
      icon: <Building2 className="w-6 h-6" />,
      text: 'Premium locations in prime business districts'
    },
    {
      icon: <Users className="w-6 h-6" />,
      text: 'Flexible lease terms tailored to your needs'
    },
    {
      icon: <CheckCircle className="w-6 h-6" />,
      text: 'Professional property management services'
    },
    {
      icon: <Headset className="w-6 h-6" />,
      text: '24/7 dedicated customer support'
    }
  ];

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white">
      {/* Section 1: Hero Banner */}
      <div className="relative bg-gradient-to-br from-[#1C244B] via-[#2a3660] to-[#1C244B] py-24 px-6 mt-12 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-400 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        {/* Geometric pattern overlay */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnptMCAzMGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9nPjwvc3ZnPg==')]"></div>
        </div>
        
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-6 py-2 rounded-full mb-6 border border-white/20">
            <Mail className="w-4 h-4 text-blue-300" />
            <span className="text-white/90 text-sm font-medium">We're Here to Help</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Get In Touch <br />
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              With Our Team
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Ready to find your perfect commercial space? Our expert team is here to help you every step of the way.
          </p>
        </div>
      </div>

      {/* Section 2: Contact Information Cards */}
      <div className="py-20 px-6 -mt-16 relative z-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 group"
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${info.color} flex items-center justify-center mb-5 transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg`}>
                  <div className="text-white">
                    {info.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-4 text-[#1C244B]">
                  {info.title}
                </h3>
                {info.details.map((detail, idx) => (
                  <p key={idx} className="text-gray-600 mb-2 text-sm leading-relaxed">
                    {detail}
                  </p>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section 3: Contact Form & Map */}
      <div className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Contact Form */}
            <div className="bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-gray-100">
              <div className="mb-8">
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#1C244B]/10 to-blue-500/10 px-4 py-1.5 rounded-full mb-4">
                  <Send className="w-4 h-4 text-[#1C244B]" />
                  <span className="text-sm font-semibold tracking-wide text-[#1C244B]">SEND US A MESSAGE</span>
                </div>
                
                <h2 className="text-4xl md:text-5xl font-bold mb-4 text-[#1C244B] leading-tight">
                  Let's Discuss Your <br />
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Requirements
                  </span>
                </h2>
                
                <p className="text-gray-600 text-lg">
                  Fill out the form below and our team will get back to you within 24 hours.
                </p>
              </div>

              <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-1 gap-5">
                  <div>
                    <label className="block text-sm font-bold mb-2 text-[#1C244B]">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#1C244B]/10 focus:border-[#1C244B] transition-all duration-300 bg-gray-50 hover:bg-white"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2 text-[#1C244B]">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#1C244B]/10 focus:border-[#1C244B] transition-all duration-300 bg-gray-50 hover:bg-white"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-bold mb-2 text-[#1C244B]">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#1C244B]/10 focus:border-[#1C244B] transition-all duration-300 bg-gray-50 hover:bg-white"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2 text-[#1C244B]">
                      Property Type
                    </label>
                    <select
                      name="propertyType"
                      value={formData.propertyType}
                      onChange={handleChange}
                      className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#1C244B]/10 focus:border-[#1C244B] transition-all duration-300 bg-gray-50 hover:bg-white"
                    >
                      <option value="">Select Property Type</option>
                      <option value="commercial-office">Commercial Office</option>
                      <option value="managed-office">Managed Office</option>
                      <option value="warehouse">Warehouse</option>
                      <option value="coworking">Co-Working Space</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

               

                

                {status.message && (
                  <div className={`p-4 rounded-xl flex items-center gap-3 border-2 ${
                    status.type === 'success' 
                      ? 'bg-green-50 text-green-800 border-green-200' 
                      : 'bg-red-50 text-red-800 border-red-200'
                  }`}>
                    {status.type === 'success' ? (
                      <CheckCircle className="w-5 h-5 flex-shrink-0" />
                    ) : (
                      <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    )}
                    <span className="font-medium text-sm">{status.message}</span>
                  </div>
                )}

                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-[#1C244B] to-[#2a3660] text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] hover:-translate-y-1 active:scale-[0.98]"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                      Sending Message...
                    </>
                  ) : (
                    <>
                      Send Message
                      <Send className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Map & Features */}
            <div className="space-y-6">
              {/* Map */}
              <div className="bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100 h-96">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3503.7614733126898!2d77.31717100000002!3d28.5769245!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce45b22a79785%3A0xac760eff02b41b9a!2sWorld%20Trade%20Tower!5e0!3m2!1sen!2sin!4v1764141206039!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Office Location"
                ></iframe>
              </div>

              {/* Features */}
              <div className="bg-gradient-to-br from-[#1C244B] to-[#2a3660] p-8 md:p-10 rounded-3xl shadow-xl text-white relative overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -mr-20 -mt-20"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full -ml-16 -mb-16"></div>
                
                <div className="relative z-10">
                  <h3 className="text-3xl font-bold mb-6 flex items-center gap-3">
                    <Award className="w-8 h-8 text-blue-400" />
                    Why Choose Us?
                  </h3>
                  
                  <ul className="space-y-4">
                    {features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-4 group">
                        <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center flex-shrink-0 group-hover:bg-white/20 transition-all duration-300 border border-white/20">
                          <div className="text-blue-400">
                            {feature.icon}
                          </div>
                        </div>
                        <span className="text-white/90 text-base leading-relaxed pt-2">
                          {feature.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBuilding, FaWarehouse, FaShoppingCart, FaChair, FaUsers } from 'react-icons/fa';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const PropertyTypes = () => {
  const navigate = useNavigate();
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const subtitleRef = useRef(null);
  const cardsRef = useRef([]);

  // Mapping from card title → what we search in JSON (category field)
  const typeMapping = {
    "Corporate Leasing": "Office Spaces",
    "Managed Offices": "Managed Offices",
    "Retail Leasing": "Retail Leasing",
    "Warehouses": "Warehouses",
  };

  const types = [
    { icon: <FaUsers size={50} />, title: "Corporate Leasing", desc: "Bulk deals for MNCs" },
    { icon: <FaChair size={50} />, title: "Managed Offices", desc: "Plug & play co-working" },
    { icon: <FaShoppingCart size={50} />, title: "Retail Leasing", desc: "High-street & mall shops" },
    { icon: <FaWarehouse size={50} />, title: "Warehouses", desc: "Logistics & storage solutions" }
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Heading animation on scroll
      gsap.fromTo(headingRef.current,
        {
          y: 50,
          opacity: 0
        },
        {
          scrollTrigger: {
            trigger: headingRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none'
          },
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out'
        }
      );

      // Subtitle animation
      gsap.fromTo(subtitleRef.current,
        {
          y: 30,
          opacity: 0
        },
        {
          scrollTrigger: {
            trigger: subtitleRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none'
          },
          y: 0,
          opacity: 1,
          duration: 0.8,
          delay: 0.2,
          ease: 'power3.out'
        }
      );

      // Cards stagger animation - set initial state visible
      cardsRef.current.forEach((card, index) => {
        if (card) {
          gsap.fromTo(card,
            {
              y: 60,
              opacity: 0
            },
            {
              scrollTrigger: {
                trigger: card,
                start: 'top 90%',
                toggleActions: 'play none none none'
              },
              y: 0,
              opacity: 1,
              duration: 0.6,
              delay: index * 0.1,
              ease: 'back.out(1.5)'
            }
          );
        }
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleClick = (title) => {
    const searchCategory = typeMapping[title];
    navigate(`/filtered-type?type=${encodeURIComponent(searchCategory)}`);
  };

  const handleCardHover = (e, isEntering) => {
    const card = e.currentTarget;
    const icon = card.querySelector('.icon-wrapper');
    
    if (isEntering) {
      gsap.to(card, { 
        y: -12, 
        boxShadow: '0 20px 40px rgba(28, 36, 75, 0.15)',
        duration: 0.3,
        ease: 'power2.out'
      });
      gsap.to(icon, {
        scale: 1.15,
        rotate: 5,
        duration: 0.3,
        ease: 'back.out(2)'
      });
    } else {
      gsap.to(card, { 
        y: 0, 
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        duration: 0.3,
        ease: 'power2.inOut'
      });
      gsap.to(icon, {
        scale: 1,
        rotate: 0,
        duration: 0.3,
        ease: 'power2.inOut'
      });
    }
  };

  return (
    <section ref={sectionRef} className="py-24 bg-white relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#1C244B]/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#1C244B]/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 ref={headingRef} className="text-5xl font-bold mb-4 text-[#1C244B]">
            Property Types We Offer
          </h2>
          <p ref={subtitleRef} className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our diverse range of commercial properties tailored to your business needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {types.map((item, i) => (
            <div
              key={i}
              ref={el => cardsRef.current[i] = el}
              onClick={() => handleClick(item.title)}
              onMouseEnter={(e) => handleCardHover(e, true)}
              onMouseLeave={(e) => handleCardHover(e, false)}
              className="bg-white p-8 rounded-2xl shadow-md border-2 border-gray-100 transition-all duration-300 text-center cursor-pointer group relative overflow-hidden"
            >
              {/* Hover background effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#1C244B]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              {/* Content */}
              <div className="relative z-10">
                <div className="icon-wrapper text-[#1C244B] mb-5 inline-block">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-[#1C244B] mb-2 group-hover:text-[#2a3561] transition-colors">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>

              {/* Bottom accent line */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#1C244B] to-[#2a3561] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PropertyTypes;
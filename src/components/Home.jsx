import React from 'react';
import HeroBanner from './HeroBanner';
import PropertyTypes from './PropertyTypes';
import FeaturedProperties from './FeaturedProperties';
import Projects from './Projects'; // New Projects component
import WhyChooseUs from './WhyChooseUs';
import Testimonials from './Testimonials';
import EnquiryForm from './EnquiryForm';
import ConnectSection from './ConnectSection';

const Home = () => {
  return (
    <>
      <HeroBanner />
     
      <PropertyTypes />
       <ConnectSection />
      <FeaturedProperties />
      <Projects />
      <WhyChooseUs />
      {/* <Testimonials /> */}
      <EnquiryForm />
    </>
  );
};

export default Home;
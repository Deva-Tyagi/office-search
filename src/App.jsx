import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Lenis from '@studio-freight/lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import FilteredByLocation from './components/FilteredByLocation';
import FilteredByType from './components/FilteredByType';
import FilteredByCombined from './components/FilteredByCombined';
import './index.css';
import PropertiesList from './components/PropertiesList';
import About1 from './components/About1';
import ContactPage from './components/Contact';

gsap.registerPlugin(ScrollTrigger);

// Smooth Scroll Wrapper Component
function SmoothScrollWrapper({ children }) {
  const location = useLocation();

  useEffect(() => {
    // Initialize Lenis
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    // Lenis scroll event
    lenis.on('scroll', ScrollTrigger.update);

    // GSAP Ticker for smooth animation frame
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    // Cleanup
    return () => {
      lenis.destroy();
      gsap.ticker.remove(lenis.raf);
    };
  }, []);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return <>{children}</>;
}

function App() {
  return (
    <Router>
      <SmoothScrollWrapper>
        <div className="App">
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/filtered-location" element={<FilteredByLocation />} />
            <Route path="/filtered-type" element={<FilteredByType />} />
            <Route path="/filtered-combined" element={<FilteredByCombined />} />
            <Route path="/properties" element={<PropertiesList />} />
            <Route path="/about" element={<About1 />} />
            <Route path="/contact" element={<ContactPage />} />
          </Routes>
          <Footer />
        </div>
      </SmoothScrollWrapper>
    </Router>
  );
}

export default App;
import React from 'react';
import Hero from '../components/Hero';
import Stats from '../components/Stats';
import Services from '../components/Services';
import Platforms from '../components/Platforms';
import About from '../components/About';
import Testimonials from '../components/Testimonials';
import Contact from '../components/Contact';

const Home: React.FC = () => {
  return (
    <>
      <Hero />
      <Stats />
      <Services />
      <Platforms />
      <About />
      <Testimonials />
      <Contact />
    </>
  );
};

export default Home;


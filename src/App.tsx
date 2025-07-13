import React from 'react';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';

// Landing page components
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import HowItWorks from './components/HowItWorks';
import Pricing from './components/Pricing';
import CallToAction from './components/CallToAction';
import Testimonials from './components/Testimonials';
import Download from './components/Download';
import FAQ from './components/FAQ';
import Footer from './components/Footer';

const LandingPage: React.FC = () => {
  return (
    <div className="font-sans text-gray-800 dark:text-gray-200 bg-white dark:bg-slate-900 antialiased overflow-x-hidden transition-colors duration-200">
      <Header />
      <main>
        <Hero />
        {/* <Features /> */}
        <HowItWorks />
        {/* <CallToAction /> */}
        <Download />
        <Pricing />
        {/* <Testimonials /> */}
        <FAQ />
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Landing page route */}
        <Route path="/" element={<LandingPage />} />
      </Routes>
    </Router>
  );
}

export default App;
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

// Privacy and data management pages
import PrivacyPolicy from './components/PrivacyPolicy';
import RequestDelete from './components/RequestDelete';
import RequestData from './components/RequestData';

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
        
        {/* Privacy and data management routes */}
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/request-delete" element={<RequestDelete />} />
        <Route path="/request-data" element={<RequestData />} />
      </Routes>
    </Router>
  );
}

export default App;
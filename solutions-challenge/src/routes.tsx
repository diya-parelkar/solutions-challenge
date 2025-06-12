import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Toaster } from 'sonner';
import LandingPage from './pages/landingPage';
import GeneratedWebsite from './pages/generatedWebsite';

const AppRoutes: React.FC = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/generated-website" element={<GeneratedWebsite />} />
      </Routes>
      <Toaster position="top-right" />
    </Layout>
  );
};

export default AppRoutes; 
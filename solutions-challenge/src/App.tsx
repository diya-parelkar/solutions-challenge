import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/landingPage";
import GeneratedWebsite from "./pages/generatedWebsite";
import ScrollToTop from "./components/scrollToTop";


function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/*" element={<LandingPage />} />
        <Route path="/generated-website" element={<GeneratedWebsite />} />
      </Routes>
    </>
  );
}

export default App;

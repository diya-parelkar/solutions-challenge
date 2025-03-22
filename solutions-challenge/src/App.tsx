import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/landingPage";
import GeneratedWebsite from "./pages/generatedWebsite";

function App() {
  return (
    <>
      <Routes>
        <Route path="/*" element={<LandingPage />} />
        <Route path="/generated-website" element={<GeneratedWebsite />} />
      </Routes>
    </>
  );
}

export default App;

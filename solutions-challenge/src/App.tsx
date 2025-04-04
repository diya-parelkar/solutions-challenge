import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/landingPage";
import GeneratedWebsite from "./pages/generatedWebsite";
import Login from "./pages/login";
import SignUp from "./pages/signup";


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

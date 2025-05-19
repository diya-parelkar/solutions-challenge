import { BrowserRouter } from 'react-router-dom';
import { useThemeContext } from './components/ThemeProvider';
import { theme } from './theme/theme';
import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/landingPage";
import GeneratedWebsite from "./pages/generatedWebsite";
import ScrollToTop from "./components/scrollToTop";

function App() {
  const { mode, colorblind, toggleMode, toggleColorblind, getClasses } = useThemeContext();

  return (
    <div className={`min-h-screen ${getClasses('background')}`}>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/*" element={<LandingPage />} />
          <Route path="/generated-website" element={<GeneratedWebsite />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

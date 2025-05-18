import { Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import LandingPage from "./pages/landingPage";
import GeneratedWebsite from "./pages/generatedWebsite";
import ScrollToTop from "./components/scrollToTop";

function App() {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      forcedTheme={undefined}
    >
      <ScrollToTop />
      <Routes>
        <Route path="/*" element={<LandingPage />} />
        <Route path="/generated-website" element={<GeneratedWebsite />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;

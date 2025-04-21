import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import NavBar from "./components/NavBar";
import NavMenu from "./components/NavMenu";

import Home from "./pages/Home";

import Athletes from "./pages/primary/Athletes";
import Teams from "./pages/primary/Teams";
import Results from "./pages/primary/Results";
import Records from "./pages/primary/Records";

import About from "./pages/primary/About";

import Footer from "./components/Footer";

import "./styles/App.css";
import AthleteDetail from "./pages/detail/AthleteDetail";
import TeamDetail from "./pages/detail/TeamDetail";
import ResultDetail from "./pages/detail/ResultDetail";
import RecordDetail from "./pages/detail/RecordDetail";
import Support from "./pages/secondary/Support";

function App(): React.ReactElement {
  const [isNavMenuOpen, setIsNavMenuOpen] = useState<boolean>(false);

  const toggleNavMenu = (): void => {
    setIsNavMenuOpen((prev) => !prev);
  };

  const closeNavMenu = (): void => {
    setIsNavMenuOpen(false);
  };

  return (
    <Router>
      <div className="screen">
        <NavBar onToggleMenu={toggleNavMenu} />
        <NavMenu isOpen={isNavMenuOpen} onCloseMenu={closeNavMenu} />
        <main className="content-area">
          <Routes>
            <Route path="/" element={<Navigate replace to="/home" />} />
            <Route path="/home" element={<Home />} />

            <Route path="/athletes" element={<Athletes />} />
            <Route path="/athlete/:athleteId" element={<AthleteDetail />} />
            <Route path="/teams" element={<Teams />} />
            <Route path="/teams/:teamId" element={<TeamDetail />} />
            <Route path="/results" element={<Results />} />
            <Route path="/results/:resultId" element={<ResultDetail />} />
            <Route path="/records" element={<Records />} />
            <Route path="/records/:recordId" element={<RecordDetail />} />
            <Route path="/about" element={<About />} />

            <Route path="/support" element={<Support />} />
            <Route path="*" element={<div>404: Page Not Found</div>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;

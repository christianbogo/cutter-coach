import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import NavBar from "./client/components/NavBar";
import NavMenu from "./client/components/NavMenu";

import Home from "./client/pages/Home";

import Athletes from "./client/pages/primary/Athletes";
import Teams from "./client/pages/primary/Teams";
import Results from "./client/pages/primary/Results";
import Records from "./client/pages/primary/Records";

import About from "./client/pages/primary/About";

import Footer from "./client/components/Footer";

import "./client/styles/App.css";
import AthleteDetail from "./client/pages/detail/AthleteDetail";
import TeamDetail from "./client/pages/detail/TeamDetail";
import ResultDetail from "./client/pages/detail/ResultDetail";
import RecordDetail from "./client/pages/detail/RecordDetail";
import Support from "./client/pages/secondary/Support";

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
          {/* <div className="under-construction">
            <h1>Under Construction</h1>
            <p>This site is currently under serious construction.</p>
            <p>Expect a working site Friday May 9th!</p>
          </div> */}
          <Routes>
            <Route path="/" element={<Navigate replace to="/home" />} />
            <Route path="/home" element={<Home />} />

            <Route path="/athletes" element={<Athletes />} />
            <Route path="/athlete/:personId" element={<AthleteDetail />} />
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

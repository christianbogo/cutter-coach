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
import Teams from "./pages/Teams";
import Results from "./pages/Results";
import Records from "./pages/Records";
import About from "./pages/About";
import "./App.css";

function App(): JSX.Element {
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
            <Route path="/teams" element={<Teams />} />
            <Route path="/results" element={<Results />} />
            <Route path="/records" element={<Records />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<div>404: Page Not Found</div>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;

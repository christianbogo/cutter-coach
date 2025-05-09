import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import NavBar from "./client/components/NavBar";
import NavMenu from "./client/components/NavMenu";
import Home from "./client/pages/Home";
import About from "./client/pages/About";
import Support from "./client/pages/Support";
import Footer from "./client/components/Footer";

import "./App.css";

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
            <Route path="/" element={<Home />} />
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

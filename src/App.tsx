import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import NavBar from "./client/components/NavBar";
import NavMenu from "./client/components/NavMenu";
import Home from "./client/pages/Home";
import About from "./client/pages/About";
import Support from "./client/pages/Support";
import Footer from "./client/components/Footer";

import "./App.css";
import Team from "./client/pages/Team";
import { AuthProvider } from "./admin/contexts/AuthContext";
import AdminRoute from "./admin/components/AdminRoute";
import AdminCheck from "./admin/components/AdminCheck";

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
      <AuthProvider>
        <div className="screen">
          <NavBar onToggleMenu={toggleNavMenu} />
          <NavMenu isOpen={isNavMenuOpen} onCloseMenu={closeNavMenu} />
          <main className="content-area">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/support" element={<Support />} />
              <Route path="/team" element={<Team />} />
              <Route path="*" element={<div>404: Page Not Found</div>} />
              <Route path="/admin-check" element={<AdminCheck />} />
              <Route path="/admin" element={<AdminRoute />}>
                <Route index element={<p>Hello there!</p>} />
              </Route>
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;

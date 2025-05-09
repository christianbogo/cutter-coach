import React, { useState } from "react"; // Import useState
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import SiteLogo from "../graphics/logo.svg";
import ArrowRight from "../graphics/nucleo/primary/20-arrow-right.svg";
import Programs from "../components/Programs";
import "../styles/Home.css";

function Home(): React.ReactElement {
  // State to hold the search input value
  const [searchTerm, setSearchTerm] = useState<string>("");
  // Hook for navigation
  const navigate = useNavigate();

  // Handler for input changes
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  // Updated handler for the search button click
  const handleSearchClick = () => {
    // Trim whitespace from the search term
    const trimmedSearchTerm = searchTerm.trim();
    if (trimmedSearchTerm) {
      // If there's a search term, navigate to /athletes with the query parameter
      navigate(`/athletes?search=${encodeURIComponent(trimmedSearchTerm)}`);
    } else {
      // If the search term is empty, just navigate to the base /athletes page
      navigate("/athletes");
    }
  };

  // Optional: Allow pressing Enter in the input to trigger search
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSearchClick();
    }
  };

  return (
    <div className="home-container">
      <section className="hero-section">
        <img
          src={SiteLogo}
          alt="Cutter's Coaching Logo"
          className="hero-logo"
        />
        <h1 className="hero-title">Coach Cutter's Database</h1>
        <p className="hero-subtitle">
          Tracking team data for related programs.
        </p>
        <Link to="/about" className="hero-learn-more">
          Learn More{" "}
          <img className="hero-arrow-icon" src={ArrowRight} alt="->" />
        </Link>
      </section>

      <section className="athlete-finder-section">
        <h2 className="athlete-finder-title">Athlete Finder</h2>
        {/* Note: Consider wrapping in a <form> element and using onSubmit */}
        <div className="athlete-finder-input-group">
          <input
            type="text"
            placeholder="Search for an athlete..."
            className="athlete-finder-input"
            aria-label="Athlete Search Input"
            value={searchTerm} // Control the input value with state
            onChange={handleInputChange} // Update state on change
            onKeyDown={handleKeyDown} // Add Enter key functionality
          />
          <button
            type="button" // Keep as type="button" if not using a form's onSubmit
            className="athlete-finder-button"
            onClick={handleSearchClick} // Use the updated handler
          >
            Search Database
          </button>
        </div>
      </section>

      <Programs />

      <section className="disclaimer-section">
        <h2 className="disclaimer-title">Disclaimer</h2>
        <div className="disclaimer-content card">
          <p className="disclaimer-text">
            Please note: Cutter's Coaching is currently a work-in-progress.
            Information presented may not always be fully up-to-date or
            comprehensive.
          </p>
          <p className="disclaimer-text">
            The database primarily focuses on specific teams and meets and does
            not include all historical data from USA Swimming.
          </p>
          <p className="disclaimer-text">
            As with any active development project, website bugs or unexpected
            behavior may occur. Your patience is appreciated! To report any
            issues, please reach out to the developer,{" "}
            <a
              href="https://gravatar.com/christianbcutter"
              target="_blank"
              rel="noopener noreferrer"
              className="disclaimer-link"
            >
              Christian Cutter
            </a>
            .
          </p>
        </div>
      </section>
    </div>
  );
}

export default Home;

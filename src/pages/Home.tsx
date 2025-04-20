import React from "react";
import { Link } from "react-router-dom";

// 1. Use imported icons
import SiteLogo from "../assets/logo.svg"; // Added SiteLogo import
import Calendar from "../assets/nucleo/primary/20-calendar.svg";
import Location from "../assets/nucleo/primary/20-pin.svg"; // Corrected Location import based on user code
import Users from "../assets/nucleo/primary/20-users.svg";
import ArrowRight from "../assets/nucleo/primary/20-arrow-right.svg"; // Corrected ArrowRight import based on user code

// Import styles specific to the Home page
import "../styles/Home.css";

// Placeholder data for Supported Programs section
const mockPrograms = [
  {
    id: 1,
    name: "Eastmont High School Wildcats",
    type: "High School Team",
    season: "08/19/2024 - 11/09/2024",
    location: "Eastmont Aquatic Center",
    size: "Approx. 45 athletes",
  },
  {
    id: 2,
    name: "Velocity Swimming",
    type: "Club Team",
    season: "09/03/2024 - 07/25/2025",
    location: "Wenatchee City Pool / Eastmont AC",
    size: "Approx. 120 athletes",
  },
  {
    id: 3,
    name: "Wenatchee High School Panthers",
    type: "High School Team",
    season: "02/24/2025 - 05/17/2025",
    location: "Wenatchee City Pool",
    size: "Approx. 50 athletes",
  },
];

// Define the Home component
function Home(): React.ReactElement {
  // Placeholder function for search button click (implement navigation later)
  const handleSearchClick = () => {
    console.log("Navigate to /search page (to be implemented)");
    // Example using react-router-dom's useNavigate hook (add import and hook call)
    // navigate('/search');
  };

  return (
    <div className="home-container">
      {/* --- Hero Section --- */}
      <section className="hero-section">
        {/* Added Site Logo */}
        <img
          src={SiteLogo}
          alt="Cutter's Coaching Logo"
          className="hero-logo"
        />
        <h1 className="hero-title">Coach Cutter's Database</h1>
        <p className="hero-subtitle">Tracking meet and practice results.</p>
        <Link to="/about" className="hero-learn-more">
          Learn More{" "}
          <img className="hero-arrow-icon" src={ArrowRight} alt="->" />
        </Link>
      </section>

      {/* --- Athlete Finder Section --- */}
      <section className="athlete-finder-section">
        <h2 className="athlete-finder-title">Athlete Finder</h2>
        <p className="athlete-finder-description">
          Search for meet results, time standards, and progress tracking.
        </p>
        <div className="athlete-finder-input-group">
          <input
            type="text"
            placeholder="Search for an athlete..."
            className="athlete-finder-input"
            aria-label="Athlete Search Input"
          />
          <button
            type="button"
            className="athlete-finder-button"
            onClick={handleSearchClick}
          >
            Search Database
          </button>
        </div>
      </section>

      {/* --- Supported Programs Section --- */}
      <section className="programs-section">
        <h2 className="programs-title">Supported Programs</h2>
        <div className="programs-list">
          {mockPrograms.map((program) => (
            <div key={program.id} className="card program-card">
              <h3 className="program-name">{program.name}</h3>
              <p className="program-type">{program.type}</p>
              <div className="program-details">
                <p className="program-detail">
                  <img
                    className="program-detail-icon"
                    src={Calendar}
                    alt="Calendar icon"
                  />
                  <span className="program-detail-text">{program.season}</span>
                </p>
                <p className="program-detail">
                  <img
                    className="program-detail-icon"
                    src={Location}
                    alt="Location icon"
                  />
                  <span className="program-detail-text">
                    {program.location}
                  </span>
                </p>
                <p className="program-detail">
                  <img
                    className="program-detail-icon"
                    src={Users}
                    alt="Users icon"
                  />
                  <span className="program-detail-text">{program.size}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- Disclaimer Section --- */}
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

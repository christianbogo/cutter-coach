import React from "react";
import "../styles/Team.css";
import "../../App.css";

function Team(): React.ReactElement {
  return (
    <div className="page">
      <section className="team-profile-header">
        <h1 className="team-name-long">Central Valley Sharks</h1>
        <div className="team-meta-info">
          <span className="team-code">CVS</span>
          <span className="team-type">High School</span>
          <span className="team-location">Springfield, USA</span>
        </div>
        <div className="team-stats-summary">
          <span className="team-stat">Seasons: 12</span>
          <span className="team-stat">Total Meets: 150</span>
          <span className="team-stat">Total Results: 3500+</span>
        </div>
      </section>

      <section className="team-records-section">
        <h2 className="section-title">Team Records</h2>
        <ul className="records-list team-records-list">
          <li className="record-item">
            <div className="record-info">
              <span className="record-event-name">50 Freestyle</span>
              <span className="record-time">21.05</span>
              <span className="record-holder-name">Michael Phelps</span>
              <span className="record-year">2023</span>
            </div>
            <button
              className="view-event-results-button"
              aria-expanded="false"
              aria-controls="event-results-50free"
            >
              View All Results
            </button>
            <div
              className="event-results-dropdown"
              id="event-results-50free"
              hidden
            >
              <h4 className="dropdown-title">All Team Results: 50 Freestyle</h4>
              <ul className="results-detailed-list">
                <li className="result-detail-item">
                  <span className="result-place">1st</span>
                  <span className="result-time-value">21.05</span>
                  <a href="#person-michael" className="person-link">
                    Michael Phelps
                  </a>
                  <span className="result-year-achieved">2023</span>
                </li>
                <li className="result-detail-item">
                  <span className="result-place">2nd</span>
                  <span className="result-time-value">21.15</span>
                  <a href="#person-ryan" className="person-link">
                    Ryan Lochte
                  </a>
                  <span className="result-year-achieved">2022</span>
                </li>
                <li className="result-detail-item">
                  <span className="result-place">3rd</span>
                  <span className="result-time-value">21.25</span>
                  <a href="#person-caeleb" className="person-link">
                    Caeleb Dressel
                  </a>
                  <span className="result-year-achieved">2023</span>
                </li>
              </ul>
              <button className="view-all-button">
                View All 50 Freestyle Results
              </button>
            </div>
          </li>
          <li className="record-item">
            <div className="record-info">
              <span className="record-event-name">100 Butterfly</span>
              <span className="record-time">49.82</span>
              <span className="record-holder-name">Caeleb Dressel</span>
              <span className="record-year">2024</span>
            </div>
            <button
              className="view-event-results-button"
              aria-expanded="false"
              aria-controls="event-results-100fly"
            >
              View All Results
            </button>
            <div
              className="event-results-dropdown"
              id="event-results-100fly"
              hidden
            >
              <h4 className="dropdown-title">
                All Team Results: 100 Butterfly
              </h4>
              <ul className="results-detailed-list">
                <li className="result-detail-item">
                  <span className="result-place">1st</span>
                  <span className="result-time-value">49.82</span>
                  <a href="#person-caeleb" className="person-link">
                    Caeleb Dressel
                  </a>
                  <span className="result-year-achieved">2024</span>
                </li>
              </ul>
            </div>
          </li>
        </ul>
        <button className="view-all-button team-records-view-all">
          View All Team Records
        </button>
      </section>

      <section className="team-seasons-section">
        <h2 className="section-title">Seasons</h2>
        <ul className="seasons-list">
          <li
            className="season-summary-item"
            data-season-id="season-2024-spring"
          >
            <div className="season-summary-info">
              <span className="season-year-quarter">Spring 2024</span>
              <span className="season-athlete-count">Athletes: 45</span>
              <span className="season-results-count">Results: 300</span>
            </div>
            <button className="view-season-details-button">View Details</button>
          </li>
          <li className="season-summary-item" data-season-id="season-2023-fall">
            <div className="season-summary-info">
              <span className="season-year-quarter">Fall 2023</span>
              <span className="season-athlete-count">Athletes: 52</span>
              <span className="season-results-count">Results: 410</span>
            </div>
            <button className="view-season-details-button">View Details</button>
          </li>
        </ul>
        <button className="view-all-button team-seasons-view-all">
          View All Seasons
        </button>

        <div
          className="season-details-card"
          id="season-details-placeholder"
          hidden
        >
          <div className="season-card-header">
            <h3 className="season-card-title">
              Season Details:
              <span className="dynamic-season-name">Spring 2024</span>
            </h3>
            <button className="close-season-card-button">Close</button>
          </div>
          <nav className="season-card-tabs">
            <button className="tab-button active" data-tab-target="roster">
              Roster
            </button>
            <button className="tab-button" data-tab-target="season-records">
              Season Records
            </button>
            <button className="tab-button" data-tab-target="season-meets">
              Meets
            </button>
          </nav>

          <div className="season-card-content">
            <div className="tab-content active" id="roster">
              <h4 className="tab-content-title">Roster (Spring 2024)</h4>
              <ul className="roster-list">
                <li className="roster-athlete-item">
                  <a
                    href="#person-jane"
                    className="person-link roster-athlete-name"
                  >
                    Jane Doe
                  </a>
                  <span className="roster-athlete-age">Age: 17</span>
                  <span className="roster-athlete-gender">Gender: F</span>
                  <span className="roster-athlete-grade">Grade: 11</span>
                </li>
                <li className="roster-athlete-item">
                  <a
                    href="#person-john"
                    className="person-link roster-athlete-name"
                  >
                    John Smith
                  </a>
                  <span className="roster-athlete-age">Age: 16</span>
                  <span className="roster-athlete-gender">Gender: M</span>
                  <span className="roster-athlete-grade">Grade: 10</span>
                </li>
              </ul>
              <button className="view-all-button roster-view-all">
                View Full Roster
              </button>
            </div>

            <div className="tab-content" id="season-records" hidden>
              <h4 className="tab-content-title">
                Season Records (Spring 2024)
              </h4>
              <ul className="records-list season-records-list">
                <li className="record-item">
                  <div className="record-info">
                    <span className="record-event-name">100 Backstroke</span>
                    <span className="record-time">58.02</span>
                    <span className="record-holder-name">Jane Doe</span>
                    <span className="record-year">2024</span>
                  </div>
                  <button className="view-event-results-button">
                    View All Results
                  </button>
                  <div className="event-results-dropdown" hidden>
                    <h4 className="dropdown-title">
                      All Season Results: 100 Backstroke
                    </h4>
                    <ul className="results-detailed-list">
                      <li className="result-detail-item">
                        <span className="result-place">1st</span>
                        <span className="result-time-value">58.02</span>
                        <a href="#person-jane" className="person-link">
                          Jane Doe
                        </a>
                        <span className="result-year-achieved">2024</span>
                      </li>
                    </ul>
                  </div>
                </li>
              </ul>
              <button className="view-all-button season-records-view-all">
                View All Season Records
              </button>
            </div>

            <div className="tab-content" id="season-meets" hidden>
              <h4 className="tab-content-title">Meets (Spring 2024)</h4>
              <ul className="meets-list">
                <li className="meet-summary-item">
                  <div className="meet-summary-info">
                    <span className="meet-name-short">District Champs</span>
                    <span className="meet-event-count">Events: 22</span>
                    <span className="meet-date">2024-05-15</span>
                  </div>
                  <button className="view-meet-results-button">
                    View Meet Results
                  </button>
                  <div className="meet-results-display" hidden>
                    <h5 className="meet-results-title">
                      Results: District Champs
                    </h5>
                    <div className="meet-event-results-group">
                      <h6 className="meet-event-title">
                        Event 1: 200 Medley Relay
                      </h6>
                      <ul className="results-detailed-list">
                        <li className="result-detail-item">
                          <span className="result-place">1st</span>
                          <span className="result-time-value">1:45.12</span>
                          <a href="#person-relay-team" className="person-link">
                            Team A
                          </a>
                          <span className="result-year-achieved">2024</span>
                        </li>
                      </ul>
                    </div>
                    <div className="meet-event-results-group">
                      <h6 className="meet-event-title">
                        Event 2: 200 Freestyle
                      </h6>
                      <ul className="results-detailed-list">
                        <li className="result-detail-item">
                          <span className="result-place">1st</span>
                          <span className="result-time-value">1:50.67</span>
                          <a href="#person-jane" className="person-link">
                            Jane Doe
                          </a>
                          <span className="result-year-achieved">2024</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </li>
                <li className="meet-summary-item">
                  <div className="meet-summary-info">
                    <span className="meet-name-short">Regional Qualifiers</span>
                    <span className="meet-event-count">Events: 18</span>
                    <span className="meet-date">2024-04-20</span>
                  </div>
                  <button className="view-meet-results-button">
                    View Meet Results
                  </button>
                  <div className="meet-results-display" hidden></div>
                </li>
              </ul>
              <button className="view-all-button season-meets-view-all">
                View All Meets
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Team;

import React from "react";
import "../styles/Team.css";
import "../../App.css";

function Team(): React.ReactElement {
  return (
    <div className="page">
      <section className="header">
        <h1 className="title name">Central Valley Sharks</h1>
        <div className="info">
          <span>CVS</span>
          <span>High School</span>
          <span>Springfield, USA</span>
        </div>
        <div className="stats">
          <span>Seasons: 12</span>
          <span>Total Meets: 150</span>
          <span>Total Results: 3500+</span>
        </div>
      </section>

      <section className="body">
        <h2 className="title">Team Records</h2>
        <ul className="records">
          <li className="item">
            <div className="info">
              <span className="event">50 Free</span>
              <span className="result">1:21.05</span>
              <span className="name">Michael Phelps</span>
              <span className="year">2023</span>
            </div>
            <button
              className="close-button"
              aria-expanded="false"
              aria-controls="event-results-50free"
            >
              Close Results
            </button>
            <div className="window">
              <h4 className="title">All Team 50 Free Results</h4>
              <ul className="results">
                <li className="item">
                  <span className="place">1st</span>
                  <span className="result">21.05</span>
                  <a href="#person-michael" className="person-link">
                    Michael Phelps
                  </a>
                  <span className="year">2023</span>
                </li>
                <li className="item">
                  <span className="place">2nd</span>
                  <span className="result">21.15</span>
                  <a href="#person-ryan" className="person-link">
                    Ryan Lochte
                  </a>
                  <span className="year">2022</span>
                </li>
                <li className="item">
                  <span className="place">3rd</span>
                  <span className="result">21.25</span>
                  <a href="#person-caeleb" className="person-link">
                    Caeleb Dressel
                  </a>
                  <span className="year">2023</span>
                </li>
              </ul>
              <button className="view-all-button">View Top 25</button>
            </div>
          </li>
          <li className="item">
            <div className="info">
              <span className="event">100 Butterfly</span>
              <span className="result">49.82</span>
              <span className="name">Caeleb Dressel</span>
              <span className="year">2024</span>
            </div>
            <button
              className="view-all-button"
              aria-expanded="false"
              aria-controls="event-results-100fly"
            >
              View All Results
            </button>
          </li>
        </ul>
        <button className="view-all-button">View All Records</button>
      </section>

      <section className="body">
        <h2 className="title">Seasons</h2>
        <ul className="seasons">
          <li className="item">
            <div className="info">
              <span className="season">Spring 2024</span>
              <span>Athletes: 45</span>
              <span>Results: 300</span>
            </div>
            <button className="open-season-button">Open Season</button>
          </li>
          <li className="item">
            <div className="info">
              <span className="season">Fall 2023</span>
              <span>Athletes: 52</span>
              <span>Results: 410</span>
            </div>
            <button className="open-season-button">Open Season</button>
          </li>
        </ul>
        <button className="view-all-button">View All Seasons</button>

        <div className="season-details">
          <div className="header">
            <h3 className="title">
              Season Details:
              <span className="name">Spring 2024</span>
            </h3>
            <button className="close-season-button">Close</button>
          </div>
          <nav className="tabs">
            <button className="active" data-tab-target="roster">
              Roster
            </button>
            <button data-tab-target="season-records">Records</button>
            <button data-tab-target="season-meets">Meets</button>
          </nav>

          <div className="season-content">
            <div className="tab-content active" id="roster">
              <h4 className="title">Roster (Spring 2024)</h4>
              <ul className="roster">
                <li className="item">
                  <a href="#person-jane" className="person-link name">
                    Jane Doe
                  </a>
                  <span className="age">Age: 17</span>
                  <span className="gender">Gender: F</span>
                  <span className="grade">Grade: 11</span>
                </li>
                <li className="item">
                  <a href="#person-john" className="person-link name">
                    John Smith
                  </a>
                  <span className="age">Age: 16</span>
                  <span className="gender">Gender: M</span>
                  <span className="grade">Grade: 10</span>
                </li>
              </ul>
              <button className="view-all-button">View Full Roster</button>
            </div>

            <div className="content" id="season-records">
              <h4 className="title">Season Records (Spring 2024)</h4>
              <ul className="records">
                <li className="item">
                  <div className="info">
                    <span className="name">100 Backstroke</span>
                    <span className="result">58.02</span>
                    <span className="name">Jane Doe</span>
                    <span className="year">2024</span>
                  </div>
                  <button className="view-all-button">View All Results</button>
                  <div className="window">
                    <h4 className="title">
                      All Season Results: 100 Backstroke
                    </h4>
                    <ul className="results">
                      <li className="item">
                        <span className="place">1st</span>
                        <span className="result">58.02</span>
                        <a href="#person-jane" className="person-link">
                          Jane Doe
                        </a>
                        <span className="year">2024</span>
                      </li>
                    </ul>
                  </div>
                </li>
              </ul>
              <button className="view-all-button">View All Records</button>
            </div>

            <div className="content" id="season-meets">
              <h4 className="title">Meets (Spring 2024)</h4>
              <ul className="meets">
                <li className="item">
                  <div className="info">
                    <span className="name">District Champs</span>
                    <span className="events">Events: 22</span>
                    <span className="date">2024-05-15</span>
                  </div>
                  <button className="view-meet-button">
                    View Meet Results
                  </button>
                  <div className="meet">
                    <h5 className="title">Results: District Champs</h5>
                    <div className="event-results">
                      <h6 className="title">Event 1: 200 Medley Relay</h6>
                      <ul className="results">
                        <li className="item">
                          <span className="place">1st</span>
                          <span className="result">1:45.12</span>
                          <a href="#person-relay-team" className="person-link">
                            Team A
                          </a>
                          <span className="year">2024</span>
                        </li>
                      </ul>
                    </div>
                    <div className="event-results">
                      <h6 className="title">Event 2: 200 Freestyle</h6>
                      <ul className="results">
                        <li className="item">
                          <span className="place">1st</span>
                          <span className="result">1:50.67</span>
                          <a href="#person-jane" className="person-link">
                            Jane Doe
                          </a>
                          <span className="year">2024</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </li>
                <li className="item">
                  <div className="info">
                    <span className="name">Regional Qualifiers</span>
                    <span className="events">Events: 18</span>
                    <span className="date">2024-04-20</span>
                  </div>
                  <button className="view-meet-button">
                    View Meet Results
                  </button>
                </li>
              </ul>
              <button className="view-all-button">View All Meets</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Team;

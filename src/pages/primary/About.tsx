import React from "react";
import "../../styles/About.css"; // Adjust the path as necessary
// Assuming you have an icon for this, like a lightbulb or gears for "philosophy"

const AboutPage: React.FC = () => {
  return (
    <div className="about-page-container screen">
      <header className="about-header">
        <h1>About Cutter's Coaching</h1>
        <p className="about-subtitle">Empowering Athletes Through Technology</p>
      </header>

      <section className="about-section">
        <h2>My Philosophy</h2>
        <p>
          This website was born from a passion to make swim results more
          accessible. I grew up swimming in the valley as a highly competitive
          kid in and out of the pool. Interestingly, my experience as a
          competitive student (proud mathlete here!) and video game player
          helped me understand the importance of comparable performance metrics.
        </p>

        <p>
          To race is to compare, and to compare is to measure. Whether you are
          racing with yourself or racing with others, the more you measure, the
          more you understand. The more you understand, the more you can
          improve.
        </p>
      </section>

      <section className="about-section">
        <h2>What I Aim To Solve</h2>
        <p>
          I started developing this database after experiencing the endlessly
          frustrating fragmentation and lack of historical data in swimming.
          Swim results are either painfully proprietary or completely
          inaccessible.
        </p>
        <p>For the curious, below is the general structure behind the site.</p>
        <ul>
          <li>
            <strong>Teams / Seasons / Meets:</strong> Teams run seasons
            annually, and seasons are made up of meets. These distinctions in
            this database allow for queries by team, season, or meet.
          </li>
          <li>
            <strong>Person / Athlete / Contacts:</strong> The person and athlete
            distinction is to allow for all-time or seasonal result queries.
            Athletes belong to a season and a person simultaneously to make this
            possible. These distinctions also provide a managerial benefit, as
            team email lists, emergency contacts, and other information are
            managed privately in this architecture.
          </li>
        </ul>
      </section>

      <section className="about-section about-cta-section">
        <h2>Explore My Work</h2>
        <p>
          Check out my other projects and portfolio at{" "}
          <a
            href="https://gravatar.com/christianbcutter"
            target="_blank"
            rel="noopener noreferrer"
          >
            gravatar.com/christianbcutter
          </a>
          . I specialize in creating tailored solutions for small businesses,
          including website development, digital design work such as vector
          graphics, and video editing.
        </p>
      </section>
    </div>
  );
};

export default AboutPage;

// AthleteDetail.tsx

import React from "react";
import {
  AthleteProvider,
  useAthleteContext,
} from "../../contexts/AthleteContext"; // Adjust path
import AthleteResults from "../../components/AthleteResults"; // Adjust path
import { getDisplayDate } from "../../utils/dateUtils"; // Adjust path
import "../../styles/AthleteDetail.css"; // Adjust path

// --- Main Detail Component Content ---
const AthleteDetailContent: React.FC = () => {
  // Consume context
  const {
    person,
    contacts,
    seasons,
    events,
    individualResults,
    loading,
    error,
    selectedSeason,
    selectedMeetType,
    selectedPresentation,
    selectedEvent,
    handleFilterChange, // Get the updated handler from context
    currentAge,
  } = useAthleteContext();

  if (loading)
    return <div className="loading-indicator">Loading athlete details...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!person)
    return (
      <div className="error-message">Athlete data could not be loaded.</div>
    );

  return (
    <div className="athlete-detail-page">
      <h1>
        {person.firstName} {person.lastName}{" "}
        {currentAge !== null && `${currentAge}`}
        {person.gender && `${person.gender}`}
      </h1>

      {/* Filters Section - Updated onChange handlers */}
      <section className="results-section">
        <h2>Results</h2>
        <div className="results-filters">
          <select
            value={selectedSeason}
            onChange={handleFilterChange("season")}
            aria-label="Filter by Season"
          >
            <option value="All-Time">All-Time</option>
            {seasons.map((s) => (
              <option key={s.id} value={s.id}>
                {" "}
                {s.nameShort}{" "}
              </option>
            ))}
          </select>
          <select
            value={selectedMeetType}
            onChange={handleFilterChange("meetType")}
            aria-label="Filter by Meet Type"
          >
            <option value="All-Meets">All Meets</option>
            <option value="Official">Official Meets</option>
            <option value="Benchmarks">Benchmark Meets</option>
          </select>
          <select
            value={selectedPresentation}
            onChange={handleFilterChange("presentation")}
            aria-label="Filter by Presentation Mode"
          >
            <option value="Best Efforts">Best Efforts</option>
            <option value="By Meet">By Meet</option>
            <option value="By Event">By Event</option>
          </select>
          {selectedPresentation !== "By Meet" && (
            <select
              value={selectedEvent}
              onChange={handleFilterChange("event")}
              aria-label="Filter by Event"
              disabled={events.length === 0}
            >
              <option value="All-Events">All Events</option>
              {events
                .sort((a, b) => a.nameShort.localeCompare(b.nameShort))
                .map((e) => (
                  <option key={e.id} value={e.id}>
                    {" "}
                    {e.nameShort}{" "}
                  </option>
                ))}
            </select>
          )}
        </div>

        {/* Results Display Area - Render AthleteResults component */}
        <AthleteResults />
      </section>
    </div>
  );
};

// --- Wrapper Component (remains the same) ---
const AthleteDetail: React.FC = () => {
  return (
    <AthleteProvider>
      <AthleteDetailContent />
    </AthleteProvider>
  );
};

export default AthleteDetail;

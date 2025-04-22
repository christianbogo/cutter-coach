// src/pages/AthleteDetail/AthleteDetail.tsx

import React, { useState } from "react";
import {
  AthleteProvider,
  useAthleteContext,
} from "../../contexts/AthleteContext"; // Adjust path
import AthleteResults from "../../components/AthleteResults"; // Adjust path
import "../../styles/AthleteDetail.css"; // Adjust path

// --- Main Detail Component Content ---
const AthleteDetailContent: React.FC = () => {
  const {
    person,
    contacts,
    seasons,
    loading,
    error,
    selectedSeason,
    selectedMeetType,
    applyFilters, // We'll need a new function in the context to apply batch changes
    currentAge,
  } = useAthleteContext();

  // State for filter visibility
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  // State to hold temporary filter selections before applying
  const [tempSelectedSeason, setTempSelectedSeason] =
    useState<string>(selectedSeason);
  const [tempSelectedMeetType, setTempSelectedMeetType] =
    useState<string>(selectedMeetType);

  const toggleFilters = () => setIsFilterOpen(!isFilterOpen);

  const handleTempFilterChange =
    (filterType: "season" | "meetType") =>
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      const value = event.target.value;
      if (filterType === "season") {
        setTempSelectedSeason(value);
      } else {
        setTempSelectedMeetType(value);
      }
    };

  const handleSetFilters = () => {
    // Call the context function to apply the temporary filters
    // This function (applyFilters) will need to update the context state
    // and potentially the URL search params. We'll define it in AthleteContext later.
    applyFilters(tempSelectedSeason, tempSelectedMeetType);
    setIsFilterOpen(false); // Close the filter section
  };

  // Update temp filters if context values change (e.g., initial load or URL change)
  React.useEffect(() => {
    setTempSelectedSeason(selectedSeason);
    setTempSelectedMeetType(selectedMeetType);
  }, [selectedSeason, selectedMeetType]);

  if (loading)
    return <div className="loading-indicator">Loading athlete details...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!person)
    return (
      <div className="error-message">Athlete data could not be loaded.</div>
    );

  // Determine the display text for the filter status
  const filterStatusText = `${
    selectedMeetType === "Official"
      ? "Official"
      : selectedMeetType === "Benchmarks"
      ? "Unofficial"
      : ""
  } ${
    selectedSeason === "All-Time"
      ? "All-Time"
      : seasons.find((s) => s.id === selectedSeason)?.nameShort || "Unknown"
  } Results for`;

  return (
    <div className="athlete-detail-page">
      <button onClick={toggleFilters} className="athlete-subtext-toggle">
        {filterStatusText}
      </button>

      <h1>
        {person.firstName} {person.lastName}{" "}
        {person.preferredName && person.preferredName !== person.firstName
          ? `(${person.preferredName})`
          : ""}
        ({currentAge && currentAge !== "NaN" && `${currentAge}`}
        {person.gender && `${person.gender}`})
      </h1>

      {contacts.length > 0 && (
        <p className="contacts-subtext">
          {contacts.map((c, i) => (
            <span key={i}>
              {c.personName} ({c.relationship}){i < contacts.length - 1 && ", "}
            </span>
          ))}
        </p>
      )}

      {isFilterOpen && (
        <section className="results-filters-simplified">
          {/* Add class for styling */}
          <div className="filter-group">
            <label htmlFor="season-filter">Season:</label>
            <select
              id="season-filter"
              value={tempSelectedSeason}
              onChange={handleTempFilterChange("season")}
              aria-label="Filter by Season"
            >
              <option value="All-Time">All-Time</option>
              {seasons.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.nameShort}
                </option>
              ))}
            </select>
          </div>
          <div className="filter-group">
            <label htmlFor="meet-type-filter">Meet Type:</label>
            <select
              id="meet-type-filter"
              value={tempSelectedMeetType}
              onChange={handleTempFilterChange("meetType")}
              aria-label="Filter by Meet Type"
            >
              <option value="All-Meets">All Meets</option>
              <option value="Official">Official Meets</option>
              <option value="Benchmarks">Benchmark Meets</option>
            </select>
          </div>
          <button onClick={handleSetFilters} className="set-filters-button">
            Set Filters
          </button>
        </section>
      )}

      {/* Results Display Area - Render the updated AthleteResults component */}
      <section className="results-section">
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

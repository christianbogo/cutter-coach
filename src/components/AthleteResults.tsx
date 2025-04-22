// AthleteResults.tsx

import React from "react";
import {
  useAthleteContext,
  BestEffortResult,
  MeetGroup,
  EventGroup,
} from "../contexts/AthleteContext"; // Adjust path
import { getDisplayDate } from "../utils/dateUtils"; // Adjust path

// --- Helper: Format Time ---
const formatResultTime = (resultSeconds: number): string => {
  if (resultSeconds === null || resultSeconds === undefined) return "N/A";
  const minutes = Math.floor(resultSeconds / 60);
  const seconds = resultSeconds % 60;
  return `${minutes}:${seconds.toFixed(2).padStart(5, "0")}`;
};

// --- Results Display Component ---
const AthleteResults: React.FC = () => {
  const { filteredResultsData, selectedPresentation } = useAthleteContext();

  if (filteredResultsData.length === 0) {
    return (
      <p className="results-empty-message">
        No results found matching the selected filters.
      </p>
    );
  }

  // --- Best Efforts Rendering ---
  if (selectedPresentation === "Best Efforts") {
    const data = filteredResultsData as BestEffortResult[];
    return (
      <table className="results-table best-efforts-table">
        {/* No thead */}
        <tbody>
          {data.map((r) => (
            <tr key={r.id}>
              <td>{formatResultTime(r.result)}</td>
              <td>{r.eventCode}</td>
              <td>{getDisplayDate(r.meetDate)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
  // --- By Meet Rendering ---
  else if (selectedPresentation === "By Meet") {
    const data = filteredResultsData as MeetGroup[];
    return (
      <div className="results-display-grouped">
        {data.map((meetGroup) => (
          <div key={meetGroup.meetId} className="result-group">
            <h3 className="result-group-heading">
              {meetGroup.meetName} ({getDisplayDate(meetGroup.meetDate)})
            </h3>
            <table className="results-table by-meet-table">
              {/* No thead */}
              <tbody>
                {meetGroup.results.map((r) => (
                  <tr key={r.id}>
                    <td> {r.dq ? "DQ" : formatResultTime(r.result)} </td>
                    <td>{r.eventCode}</td>
                    <td>{getDisplayDate(meetGroup.meetDate)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    );
  }
  // --- By Event Rendering ---
  else if (selectedPresentation === "By Event") {
    const data = filteredResultsData as EventGroup[];
    return (
      <div className="results-display-grouped">
        {data.map((eventGroup) => (
          <div key={eventGroup.eventId} className="result-group">
            <h3 className="result-group-heading">{eventGroup.eventName}</h3>
            <table className="results-table by-event-table">
              {/* No thead */}
              <tbody>
                {eventGroup.results.map((r) => (
                  <tr key={r.id}>
                    <td> {r.dq ? "DQ" : formatResultTime(r.result)} </td>
                    <td>{r.eventCode}</td>
                    <td>{r.meetName}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    );
  }

  return null; // Fallback
};

export default AthleteResults;

import React from "react";
import {
  useAthleteContext,
  BestEffortResult,
  MeetGroup,
  EventGroup,
} from "../contexts/AthleteContext"; // Adjust path
import { getDisplayDate } from "../utils/dateUtils"; // Adjust path

// --- Helper: Format Time (Copied from AthleteDetail) ---
// Consider moving this to a shared utils file if used elsewhere
const formatResultTime = (resultSeconds: number): string => {
  if (resultSeconds === null || resultSeconds === undefined) return "N/A";
  const minutes = Math.floor(resultSeconds / 60);
  const seconds = resultSeconds % 60;
  return `${minutes}:${seconds.toFixed(2).padStart(5, "0")}`;
};

// --- Results Display Component ---
const AthleteResults: React.FC = () => {
  // Consume context to get filtered data and presentation mode
  const { filteredResultsData, selectedPresentation } = useAthleteContext();

  // Render logic moved here
  if (filteredResultsData.length === 0) {
    return (
      <p className="results-empty-message">
        No results found matching the selected filters.
      </p>
    );
  }

  if (selectedPresentation === "Best Efforts") {
    const data = filteredResultsData as BestEffortResult[];
    return (
      <table className="results-table best-efforts-table">
        <thead>
          <tr>
            <th>Event</th>
            <th>Time</th>
            <th>Meet</th>
            <th>Date</th>
            <th>Age</th>
          </tr>
        </thead>
        <tbody>
          {data.map((r) => (
            <tr key={r.id}>
              <td data-label="Event">{r.eventName}</td>
              <td data-label="Time">{formatResultTime(r.result)}</td>
              <td data-label="Meet">{r.meetName}</td>
              <td data-label="Date">{getDisplayDate(r.meetDate)}</td>
              <td data-label="Age">{r.age}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  } else if (selectedPresentation === "By Meet") {
    const data = filteredResultsData as MeetGroup[];
    return (
      <div>
        {data.map((meetGroup) => (
          <div key={meetGroup.meetId} className="result-group">
            <h3 className="result-group-heading">
              {meetGroup.meetName} ({getDisplayDate(meetGroup.meetDate)})
            </h3>
            <table className="results-table by-meet-table">
              <thead>
                <tr>
                  <th>Event</th>
                  <th>Time</th>
                  <th>Age</th>
                  <th>DQ?</th>
                </tr>
              </thead>
              <tbody>
                {meetGroup.results.map((r) => (
                  <tr key={r.id}>
                    <td data-label="Event">{r.eventName}</td>
                    <td data-label="Time">
                      {r.dq ? "DQ" : formatResultTime(r.result)}
                    </td>
                    <td data-label="Age">{r.age}</td>
                    <td data-label="DQ?">{r.dq ? "Yes" : "No"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    );
  } else if (selectedPresentation === "By Event") {
    const data = filteredResultsData as EventGroup[];
    return (
      <div>
        {data.map((eventGroup) => (
          <div key={eventGroup.eventId} className="result-group">
            <h3 className="result-group-heading">{eventGroup.eventName}</h3>
            <table className="results-table by-event-table">
              <thead>
                <tr>
                  <th>Meet</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Age</th>
                  <th>DQ?</th>
                </tr>
              </thead>
              <tbody>
                {eventGroup.results.map((r) => (
                  <tr key={r.id}>
                    <td data-label="Meet">{r.meetName}</td>
                    <td data-label="Date">{getDisplayDate(r.meetDate)}</td>
                    <td data-label="Time">
                      {r.dq ? "DQ" : formatResultTime(r.result)}
                    </td>
                    <td data-label="Age">{r.age}</td>
                    <td data-label="DQ?">{r.dq ? "Yes" : "No"}</td>
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

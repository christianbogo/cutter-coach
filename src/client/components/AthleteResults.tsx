// src/components/AthleteResults.tsx

import React, { useMemo } from "react";
import { useAthleteContext } from "../contexts/AthleteContext"; // Adjust path
import { IndividualResult } from "../../models/index";
import { getDisplayShort } from "../../utils/dateUtils"; // Adjust path
import { formatResultTime } from "../../utils/resultTime"; // Adjust path

// --- Define simpler types for this component's needs ---
interface DisplayBestTime {
  result: number;
  eventCode: string;
  meetDate: string; // Formatted date string
  personId: string;
  eventId: string;
  resultId: string; // Keep the original result ID for potential linking
}

interface DisplayMeetResult {
  result: number;
  eventCode: string;
  dq: boolean;
  resultId: string; // Keep the original result ID
}

interface DisplayMeetGroup {
  meetId: string;
  meetShortName: string;
  meetDate: string; // Formatted date string
  results: DisplayMeetResult[];
}

// --- Results Display Component ---
const AthleteResults: React.FC = () => {
  const {
    personId, // Need this for best times output
    individualResults, // Use the raw, filtered results
    meets, // Need lookup for meet details
    events, // Need lookup for event details
    selectedSeason, // Needed to recalculate based on filters
    selectedMeetType, // Needed to recalculate based on filters
  } = useAthleteContext();

  // Create lookups for efficiency
  const meetsMap = useMemo(() => new Map(meets.map((m) => [m.id, m])), [meets]);
  const eventsMap = useMemo(
    () => new Map(events.map((e) => [e.id, e])),
    [events]
  );

  // --- Calculate Filtered Results ---
  // Recalculate based on selectedSeason and selectedMeetType here,
  // as the context's `filteredResultsData` was tied to presentation logic.
  const filteredResults = useMemo(() => {
    let results = individualResults;

    if (selectedSeason !== "All-Time") {
      results = results.filter((r) => r.season === selectedSeason);
    }

    if (selectedMeetType !== "All-Meets") {
      results = results.filter((r) => {
        const meet = meetsMap.get(r.meet);
        if (!meet) return false;
        return selectedMeetType === "Official" ? meet.official : !meet.official; // Assuming 'Benchmarks' means !official
      });
    }
    return results;
  }, [individualResults, selectedSeason, selectedMeetType, meetsMap]);

  // --- Calculate Best Times ---
  const bestTimes = useMemo((): DisplayBestTime[] => {
    if (!personId) return [];
    const bestEffortsMap = new Map<string, IndividualResult>(); // Key: eventId

    filteredResults.forEach((r) => {
      if (r.dq) return; // Skip disqualified results for best times
      const currentBest = bestEffortsMap.get(r.event);
      if (!currentBest || r.result < currentBest.result) {
        bestEffortsMap.set(r.event, r);
      }
    });

    return Array.from(bestEffortsMap.values())
      .map((r): DisplayBestTime | null => {
        const event = eventsMap.get(r.event);
        const meet = meetsMap.get(r.meet);
        if (!event || !meet) return null; // Should not happen if data is consistent

        return {
          resultId: r.id,
          result: r.result,
          eventCode: event.code || "N/A",
          meetDate: getDisplayShort(meet.date),
          personId: personId, // Add personId
          eventId: r.event, // Add eventId
        };
      })
      .filter((item): item is DisplayBestTime => item !== null) // Type guard
      .sort((a, b) => a.eventCode.localeCompare(b.eventCode)); // Sort alphabetically by event code
  }, [filteredResults, eventsMap, meetsMap, personId]);

  // --- Calculate Meet History ---
  const meetHistory = useMemo((): DisplayMeetGroup[] => {
    const resultsByMeet = new Map<string, DisplayMeetGroup>(); // Key: meetId

    filteredResults.forEach((r) => {
      const meet = meetsMap.get(r.meet);
      const event = eventsMap.get(r.event);
      if (!meet || !event) return; // Skip if meet or event data is missing

      const meetGroup: DisplayMeetGroup = resultsByMeet.get(meet.id) || {
        meetId: meet.id,
        meetShortName: meet.nameShort,
        meetDate: getDisplayShort(meet.date),
        results: [],
      };

      meetGroup.results.push({
        resultId: r.id,
        result: r.result,
        eventCode: event.code || "N/A",
        dq: r.dq || false, // Handle potential undefined dq
      });

      // Sort results within the meet (e.g., by event code)
      meetGroup.results.sort((a, b) => a.eventCode.localeCompare(b.eventCode));

      resultsByMeet.set(meet.id, meetGroup);
    });

    // Sort meets by date, newest first
    return Array.from(resultsByMeet.values()).sort(
      (a, b) =>
        new Date(meetsMap.get(b.meetId)?.date || 0).getTime() -
        new Date(meetsMap.get(a.meetId)?.date || 0).getTime()
    );
  }, [filteredResults, meetsMap, eventsMap]);

  // --- Render Output ---
  if (filteredResults.length === 0) {
    return (
      <p className="results-empty-message">
        No results found matching the selected filters.
      </p>
    );
  }

  return (
    <div className="athlete-results-display">
      {/* Best Times Section */}
      <div className="athlete-section">
        <h2>
          Bests in Database as of {new Date().toLocaleDateString("en-US")}
        </h2>
        {bestTimes.length > 0 ? (
          <table>
            <tbody>
              {bestTimes.map((bt) => (
                <tr key={bt.resultId}>
                  <td>{bt.eventCode}</td>
                  <td>{formatResultTime(bt.result)}</td>
                  <td>{bt.meetDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No best times found for these filters.</p>
        )}
      </div>

      {/* Meet History Section */}
      <div className="athlete-section">
        <h2>
          Meets in Database as of {new Date().toLocaleDateString("en-US")}
        </h2>
        {meetHistory.length > 0 ? (
          meetHistory.map((meetGroup) => (
            <div key={meetGroup.meetId} className="meet-group">
              <h3>
                {meetGroup.meetShortName} ({meetGroup.meetDate})
              </h3>
              <table>
                <tbody>
                  {meetGroup.results.map((res) => (
                    <tr key={res.resultId}>
                      <td>{res.eventCode}</td>
                      <td>{res.dq ? "DQ" : formatResultTime(res.result)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))
        ) : (
          <p>No meet participation found for these filters.</p>
        )}
      </div>
    </div>
  );
};

export default AthleteResults;

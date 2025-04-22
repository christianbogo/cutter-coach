import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import {
  collection,
  getDocs,
  Timestamp as FirestoreTimestamp,
} from "firebase/firestore";
// Assuming your firebase config is exported from 'firebase.ts' or adjust path
import { db } from "../../firebase/firebase"; // Adjust path as needed
import "../../styles/Teams.css"; // Styles specific to this component

// --- Data Interfaces (Copied from your prompt) ---
interface Team {
  id: string;
  code: string;
  type: string;
  nameLong: string;
  nameShort: string;
  currentSeason?: string;
  locationName: string;
  locationAddress: string;
  createdAt?: FirestoreTimestamp;
  updatedAt?: FirestoreTimestamp;
}

interface Season {
  id: string;
  team: string; // references teamId
  nameLong: string;
  nameShort: string;
  startDate: string;
  endDate: string;
  isComplete: boolean;
  createdAt?: FirestoreTimestamp;
  updatedAt?: FirestoreTimestamp;
}

interface Meet {
  id: string;
  nameLong: string;
  nameShort: string;
  date: string; // 'YYYY-MM-DD'
  locationName: string;
  locationAddress: string;
  team: string; // references teamId
  season: string; // references seasonId
  eventOrder: string[];
  isComplete: boolean;
  createdAt?: FirestoreTimestamp;
  updatedAt?: FirestoreTimestamp;
}

// --- Combined Structure for Display ---
interface DisplaySeason extends Season {
  meets: Meet[];
}

interface DisplayTeam extends Team {
  seasons: DisplaySeason[];
}

// --- Component ---
const Teams: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  // State for filters, initialized from URL Params
  const [selectedTeamId, setSelectedTeamId] = useState<string>(
    searchParams.get("team") || ""
  );
  const [selectedSeasonId, setSelectedSeasonId] = useState<string>(
    searchParams.get("season") || ""
  );

  // State for fetched data
  const [teams, setTeams] = useState<Team[]>([]);
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [meets, setMeets] = useState<Meet[]>([]);

  // State for loading and errors
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // --- Data Fetching ---
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [teamsSnap, seasonsSnap, meetsSnap] = await Promise.all([
          getDocs(collection(db, "teams")),
          getDocs(collection(db, "seasons")),
          getDocs(collection(db, "meets")),
        ]);

        setTeams(
          teamsSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Team))
        );
        // Sort seasons by start date descending (most recent first)
        setSeasons(
          seasonsSnap.docs
            .map((doc) => ({ id: doc.id, ...doc.data() } as Season))
            .sort(
              (a, b) =>
                new Date(b.startDate).getTime() -
                new Date(a.startDate).getTime()
            )
        );
        // Sort meets by date descending
        setMeets(
          meetsSnap.docs
            .map((doc) => ({ id: doc.id, ...doc.data() } as Meet))
            .sort(
              (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
            )
        );
      } catch (err) {
        console.error("Error fetching Firestore data:", err);
        setError("Failed to load data. Please try again later.");
        setTeams([]);
        setSeasons([]);
        setMeets([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Fetch only on initial mount

  // --- Filter Options ---
  const availableSeasons = useMemo(() => {
    if (!selectedTeamId) {
      return []; // No team selected, no seasons available for filtering
    }
    return seasons.filter((s) => s.team === selectedTeamId);
  }, [seasons, selectedTeamId]);

  // --- Event Handlers ---
  const handleTeamChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newTeamId = event.target.value;
    setSelectedTeamId(newTeamId);
    // Reset season filter when team changes
    setSelectedSeasonId("");
    // Update URL params
    setSearchParams(
      (prev) => {
        const params = new URLSearchParams(prev);
        if (newTeamId) params.set("team", newTeamId);
        else params.delete("team");
        params.delete("season"); // Remove season when team changes
        return params;
      },
      { replace: true }
    );
  };

  const handleSeasonChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newSeasonId = event.target.value;
    setSelectedSeasonId(newSeasonId);
    // Update URL params
    setSearchParams(
      (prev) => {
        const params = new URLSearchParams(prev);
        if (newSeasonId) params.set("season", newSeasonId);
        else params.delete("season");
        return params;
      },
      { replace: true }
    );
  };

  // --- Data Aggregation & Filtering for Display ---
  const displayData = useMemo((): DisplayTeam[] => {
    if (loading) return [];

    // Pre-group meets by season ID for efficient lookup
    const meetsBySeason = new Map<string, Meet[]>();
    meets.forEach((meet) => {
      const existing = meetsBySeason.get(meet.season) || [];
      meetsBySeason.set(meet.season, [...existing, meet]);
    });

    // Filter teams based on selection
    const filteredTeams = selectedTeamId
      ? teams.filter((t) => t.id === selectedTeamId)
      : teams; // Show all teams if none selected

    // Structure data
    return (
      filteredTeams
        .map((team) => {
          // Filter seasons for this team based on selection
          const teamSeasons = seasons.filter((s) => s.team === team.id);
          const filteredTeamSeasons = selectedSeasonId
            ? teamSeasons.filter((s) => s.id === selectedSeasonId)
            : teamSeasons; // Show all team's seasons if no season selected

          return {
            ...team,
            seasons: filteredTeamSeasons.map((season) => ({
              ...season,
              meets: meetsBySeason.get(season.id) || [], // Get meets for this season
            })),
          };
        })
        // Filter out teams that have no seasons matching the season filter (if applied)
        .filter((team) => team.seasons.length > 0)
    );
  }, [teams, seasons, meets, selectedTeamId, selectedSeasonId, loading]);

  // --- Render Logic ---
  return (
    <div className="teams-page">
      <h1>Teams & Seasons</h1>

      <div className="teams-controls">
        {/* Team Filter Dropdown */}
        <select
          value={selectedTeamId}
          onChange={handleTeamChange}
          className="team-filter"
          aria-label="Filter by Team"
        >
          <option value="">All Teams</option>
          {teams
            .sort((a, b) => a.nameLong.localeCompare(b.nameLong))
            .map((team) => (
              <option key={team.id} value={team.id}>
                {team.nameLong} ({team.nameShort})
              </option>
            ))}
        </select>

        {/* Season Filter Dropdown - Enabled only if a team is selected */}
        <select
          value={selectedSeasonId}
          onChange={handleSeasonChange}
          className="season-filter"
          disabled={!selectedTeamId} // Disable if no team is selected
          aria-label="Filter by Season"
        >
          <option value="">
            {selectedTeamId ? "All Seasons" : "Select a team first"}
          </option>
          {availableSeasons.map((season) => (
            <option key={season.id} value={season.id}>
              {season.nameLong} ({season.nameShort})
            </option>
          ))}
        </select>
      </div>

      {loading && <div className="loading-indicator">Loading data...</div>}
      {error && <div className="error-message">{error}</div>}

      {!loading && !error && (
        <div className="teams-content">
          {displayData.length > 0 ? (
            displayData.map((team) => (
              <section key={team.id} className="team-section">
                <h2 className="team-heading">
                  {team.nameLong} ({team.nameShort})
                </h2>
                <div className="team-seasons-list">
                  {team.seasons.length > 0 ? (
                    team.seasons.map((season) => (
                      <div key={season.id} className="season-card">
                        <div className="season-card-header">
                          <h3 className="season-name">{season.nameLong}</h3>
                          <span className="season-dates">
                            {season.startDate} to {season.endDate}
                          </span>
                        </div>
                        <div className="season-card-body">
                          {season.meets.length > 0 ? (
                            <>
                              <strong className="meets-title">Meets:</strong>
                              <ul className="meet-list">
                                {season.meets.map((meet) => (
                                  <li key={meet.id} className="meet-item">
                                    {meet.nameShort} ({meet.date})
                                  </li>
                                ))}
                              </ul>
                            </>
                          ) : (
                            <p className="no-meets-message">
                              No meets recorded for this season.
                            </p>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="no-seasons-message">
                      No seasons found matching filters for this team.
                    </p>
                  )}
                </div>
              </section>
            ))
          ) : (
            <div className="teams-empty-message">
              No teams or seasons found matching your criteria.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Teams;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import {
  collection,
  getDocs,
  getDoc,
  doc,
  query,
  where,
  getCountFromServer,
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import { getDisplayDate } from "../utils/dateUtils"; // Adjust path as needed

// Import required icons
import ShieldFilled from "../assets/nucleo/primary/20-shield-filled.svg";
import Apple from "../assets/nucleo/primary/20-apple.svg";
import GraduationCap from "../assets/nucleo/primary/20-graduation-cap.svg";
import Calendar from "../assets/nucleo/primary/20-calendar.svg";
import Location from "../assets/nucleo/primary/20-pin.svg";
import Users from "../assets/nucleo/primary/20-users.svg";
// Optional: Default icon if type doesn't match
// import DefaultIcon from '../assets/nucleo/primary/20-info.svg';

// Import styles specific to this component
import "../styles/Programs.css"; //

// Interfaces (assuming these match your Firestore structure)
interface Team {
  id: string;
  nameLong: string;
  type: string; // Expected values like "Club", "Middle School", "High School" or "Club Team" etc.
  locationName: string;
  currentSeason?: string;
}

interface Season {
  id: string;
  startDate: string; // 'YYYY-MM-DD'
  endDate: string; // 'YYYY-MM-DD'
}

interface ProgramDisplayData {
  id: string; // This is the Team ID
  name: string;
  type: string; // Store original type for mapping
  season: string; // Will store the formatted date range
  location: string;
  size: string;
}

const LoadingIndicator = () => (
  <div className="loading-indicator">Loading programs...</div>
);
const ErrorMessage = ({ message }: { message: string }) => (
  <div className="error-message">Error loading programs: {message}</div>
);

// Helper function to select the correct icon based on team type
const getTypeIcon = (type: string): string => {
  const lowerType = type.toLowerCase();
  if (lowerType.includes("club")) return ShieldFilled;
  if (lowerType.includes("middle school")) return Apple;
  if (lowerType.includes("high school")) return GraduationCap;
  return "";
};

function Programs(): React.ReactElement {
  const [programsData, setProgramsData] = useState<ProgramDisplayData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate(); // Initialize navigate hook

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const teamsCollectionRef = collection(db, "teams");
        const teamSnapshot = await getDocs(teamsCollectionRef);

        if (teamSnapshot.empty) {
          setProgramsData([]);
          setLoading(false);
          return;
        }

        const processedProgramsPromises = teamSnapshot.docs.map(
          async (teamDoc) => {
            const teamData = teamDoc.data() as Omit<Team, "id">;
            const teamId = teamDoc.id;

            let seasonString = "N/A";
            let athleteCount = 0;
            let seasonId: string | undefined = teamData.currentSeason;

            if (seasonId) {
              try {
                const seasonDocRef = doc(db, "seasons", seasonId);
                const seasonDocSnap = await getDoc(seasonDocRef);

                if (seasonDocSnap.exists()) {
                  const seasonData = seasonDocSnap.data() as Omit<Season, "id">;
                  const startDateFormatted = getDisplayDate(
                    seasonData.startDate
                  );
                  const endDateFormatted = getDisplayDate(seasonData.endDate);
                  seasonString = `${startDateFormatted} to ${endDateFormatted}`;

                  try {
                    const athletesCollectionRef = collection(db, "athletes");
                    const athleteQuery = query(
                      athletesCollectionRef,
                      where("season", "==", seasonId)
                    );
                    const athleteCountSnapshot = await getCountFromServer(
                      athleteQuery
                    );
                    athleteCount = athleteCountSnapshot.data().count;
                  } catch (countError) {
                    console.error(
                      `Error counting athletes for season ${seasonId}:`,
                      countError
                    );
                  }
                } else {
                  console.warn(
                    `Season document with ID ${seasonId} not found for team ${teamId}`
                  );
                  seasonString = "Season data unavailable";
                }
              } catch (seasonError) {
                console.error(
                  `Error fetching season ${seasonId} for team ${teamId}:`,
                  seasonError
                );
                seasonString = "Error loading season";
              }
            } else {
              seasonString = "No current season set";
            }

            return {
              id: teamId, // Ensure ID is correctly passed
              name: teamData.nameLong,
              type: teamData.type,
              season: seasonString,
              location: teamData.locationName,
              size: seasonId ? `${athleteCount} athletes` : "N/A",
            } as ProgramDisplayData;
          }
        );

        const resolvedPrograms = await Promise.all(processedProgramsPromises);
        setProgramsData(resolvedPrograms);
      } catch (err) {
        console.error("Error fetching programs data:", err);
        setError(
          err instanceof Error ? err.message : "An unexpected error occurred."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Removed navigate from dependency array as it's stable

  // --- Navigation Handler ---
  const handleCardClick = (teamId: string) => {
    // Navigate to the Teams page with the specific team ID as a query parameter
    navigate(`/teams?team=${encodeURIComponent(teamId)}`);
  };

  if (loading) {
    return (
      <section className="programs-section">
        <h2 className="programs-title">Supported Programs</h2>
        <LoadingIndicator />
      </section>
    );
  }

  if (error) {
    return (
      <section className="programs-section">
        <h2 className="programs-title">Supported Programs</h2>
        <ErrorMessage message={error} />
      </section>
    );
  }

  return (
    <section className="programs-section">
      <h2 className="programs-title">Supported Programs</h2>
      <div className="programs-list">
        {programsData.length > 0 ? (
          programsData.map((program) => {
            const iconSrc = getTypeIcon(program.type);
            return (
              // Add onClick handler to the card div
              <div
                key={program.id}
                className="card program-card"
                onClick={() => handleCardClick(program.id)} // Pass team ID
                role="link" // Add role for accessibility
                tabIndex={0} // Make it focusable
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ")
                    handleCardClick(program.id);
                }} // Keyboard accessibility
              >
                <div className="program-header">
                  {iconSrc && (
                    <img
                      src={iconSrc}
                      alt={`${program.type} icon`}
                      className="program-type-icon"
                    />
                  )}
                  <h3 className="program-name">{program.name}</h3>
                </div>
                <div className="program-details">
                  <p className="program-detail">
                    <img
                      className="program-detail-icon"
                      src={Calendar}
                      alt="Calendar icon"
                    />
                    <span className="program-detail-text">
                      {program.season}
                    </span>
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
            );
          })
        ) : (
          <p className="programs-empty-message">No supported programs found.</p>
        )}
      </div>
    </section>
  );
}

export default Programs;

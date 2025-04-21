import React, { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  getDoc,
  doc,
  query,
  where,
  getCountFromServer,
  Timestamp, // Import Timestamp if needed for comparison, though not directly used here
} from "firebase/firestore";
import { db } from "../firebase/firebase"; // Ensure this path is correct

// Import required icons
import ShieldFilled from "../assets/nucleo/primary/20-shield-filled.svg";
import Apple from "../assets/nucleo/primary/20-apple.svg";
import GraduationCap from "../assets/nucleo/primary/20-graduation-cap.svg";
import Calendar from "../assets/nucleo/primary/20-calendar.svg";
import Location from "../assets/nucleo/primary/20-pin.svg";
import Users from "../assets/nucleo/primary/20-users.svg";

// Import styles specific to this component
import "../styles/Programs.css";

// Interfaces based on your provided structure (simplified for relevance)
interface Team {
  id: string; // Firestore document ID
  nameLong: string;
  type: string;
  locationName: string;
  currentSeason?: string; // ID of the season document
  // Add other fields from your Team interface if needed
}

interface Season {
  id: string; // Firestore document ID
  startDate: string; // Assuming 'YYYY-MM-DD'
  endDate: string; // Assuming 'YYYY-MM-DD'
  // Add other fields from your Season interface if needed
}

// Interface for the data structure we will display in the component
interface ProgramDisplayData {
  id: string; // Use Firestore team ID as key
  name: string;
  type: string;
  season: string; // Formatted date range string
  location: string;
  size: string; // Formatted athlete count string
}

// --- Loading and Error Components (Simple Examples) ---
// You can replace these with more sophisticated spinner/error components
const LoadingIndicator = () => (
  <div className="loading-indicator">Loading programs...</div>
);

const ErrorMessage = ({ message }: { message: string }) => (
  <div className="error-message">Error loading programs: {message}</div>
);
// --------------------------------------------------------

function Programs(): React.ReactElement {
  // State for storing the fetched and processed program data
  const [programsData, setProgramsData] = useState<ProgramDisplayData[]>([]);
  // State to track loading status
  const [loading, setLoading] = useState<boolean>(true);
  // State to store any potential errors during fetch
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Define the async function to fetch and process data
    const fetchData = async () => {
      setLoading(true); // Start loading
      setError(null); // Reset error state

      try {
        // 1. Get all teams
        const teamsCollectionRef = collection(db, "teams");
        const teamSnapshot = await getDocs(teamsCollectionRef);

        if (teamSnapshot.empty) {
          setProgramsData([]); // No teams found
          setLoading(false);
          return;
        }

        // Process each team to get season and athlete count
        const processedProgramsPromises = teamSnapshot.docs.map(
          async (teamDoc) => {
            const teamData = teamDoc.data() as Omit<Team, "id">; // Cast data, ID is from teamDoc.id
            const teamId = teamDoc.id;

            let seasonString = "N/A";
            let athleteCount = 0;
            let seasonId: string | undefined = teamData.currentSeason;

            // 2. Get current season information if available
            if (seasonId) {
              try {
                const seasonDocRef = doc(db, "seasons", seasonId);
                const seasonDocSnap = await getDoc(seasonDocRef);

                if (seasonDocSnap.exists()) {
                  const seasonData = seasonDocSnap.data() as Omit<Season, "id">;
                  // Format season date range
                  seasonString = `${seasonData.startDate} - ${seasonData.endDate}`;

                  // 3. Get athlete count for the current season
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
                    // Decide how to handle count error, maybe show 'Error' or 'N/A' for size
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

            // 4. Format the final display object
            return {
              id: teamId,
              name: teamData.nameLong,
              type: teamData.type,
              season: seasonString,
              location: teamData.locationName,
              size: seasonId ? `${athleteCount} athletes` : "N/A", // Only show count if season was valid
            } as ProgramDisplayData;
          }
        );

        // Wait for all team processing promises to resolve
        const resolvedPrograms = await Promise.all(processedProgramsPromises);
        setProgramsData(resolvedPrograms);
      } catch (err) {
        console.error("Error fetching programs data:", err);
        setError(
          err instanceof Error ? err.message : "An unexpected error occurred."
        );
      } finally {
        setLoading(false); // Finish loading regardless of success or error
      }
    };

    fetchData(); // Call the fetching function when the component mounts

    // Cleanup function (optional, useful if you were using real-time listeners)
    // return () => { /* Cleanup logic here */ };
  }, []); // Empty dependency array ensures this runs only once on mount

  // --- Conditional Rendering based on state ---
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
          programsData.map((program) => (
            // Use the Firestore team ID as the key
            <div key={program.id} className="card program-card">
              <h3 className="program-name">{program.name}</h3>
              <p className="program-type">{program.type}</p>
              <div className="program-details">
                <p className="program-detail">
                  <img
                    className="program-detail-icon"
                    src={Calendar}
                    alt="Calendar icon"
                  />
                  <span className="program-detail-text">{program.season}</span>
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
          ))
        ) : (
          // Message shown if loading is complete but no programs were found/processed
          <p className="programs-empty-message">No supported programs found.</p>
        )}
      </div>
    </section>
  );
}

export default Programs;

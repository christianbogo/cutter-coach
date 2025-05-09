import React, { useState, useEffect, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  collection,
  getDocs,
  Timestamp as FirestoreTimestamp,
} from "firebase/firestore";
// Assuming your firebase config is exported from 'firebase.ts' in the same directory or adjust path
// e.g., import { db } from '../firebase';
import { db } from "../../../firebase/firebase"; // Adjust path as needed
import "../../styles/Athletes.css"; // Adjust path as needed

// --- Data Interfaces (Copied from your prompt) ---
interface Person {
  id: string;
  firstName: string;
  preferredName: string;
  lastName: string;
  birthday: string; // 'YYYY-MM-DD'
  gender: "M" | "F" | "O";
  phone: string;
  email: string;
  isArchived: boolean;
  createdAt?: FirestoreTimestamp;
  updatedAt?: FirestoreTimestamp;
}

interface Athlete {
  id: string;
  person: string; // references personId
  season: string; // references seasonId
  team: string; // references teamId
  grade: number | null;
  group: string;
  subgroup: string;
  lane: number | null;
  hasDisability: boolean;
  createdAt?: FirestoreTimestamp;
  updatedAt?: FirestoreTimestamp;
}

interface Contact {
  id: string;
  contact: string; // references personId
  relationship: string;
  recipient: string; // references personId
  isEmergency: boolean;
  recievesEmail: boolean; // Note: Typo 'recievesEmail' in original interface, kept for consistency
}

interface Season {
  id: string;
  team: string; // references teamId
  nameLong: string;
  nameShort: string;
  startDate: string; // Assuming 'YYYY-MM-DD' or similar parseable format
  endDate: string;
  isComplete: boolean;
  createdAt?: FirestoreTimestamp;
  updatedAt?: FirestoreTimestamp;
}

interface Team {
  id: string;
  code: string;
  type: string;
  nameLong: string;
  nameShort: string;
  currentSeason?: string; // references seasonId
  locationName: string;
  locationAddress: string;
  createdAt?: FirestoreTimestamp;
  updatedAt?: FirestoreTimestamp;
}

// --- Combined Interface for Display ---
interface DisplayAthlete extends Person {
  displayAgeGender: string;
  seasons: { nameShort: string; startDate: string }[];
  relationships: string[];
  teamIds: string[]; // Store all team IDs the person has been associated with
}

// --- Utility Functions ---
const calculateAge = (birthdayString: string): number | null => {
  if (!birthdayString) return null;
  try {
    const birthday = new Date(birthdayString);
    // Add check for invalid date if parsing fails subtly
    if (isNaN(birthday.getTime())) {
      console.error("Invalid date format for birthday:", birthdayString);
      return null;
    }
    const ageDifMs = Date.now() - birthday.getTime();
    const ageDate = new Date(ageDifMs); // Epoch is 1970 Jan 1
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  } catch (error) {
    console.error("Error calculating age for:", birthdayString, error);
    return null;
  }
};

const formatAgeGender = (person: Person): string => {
  const age = calculateAge(person.birthday);
  const ageString = age !== null ? String(age) : "";
  const genderInitial = person.gender
    ? person.gender.charAt(0).toUpperCase()
    : "?";
  return `${ageString}${genderInitial}`;
};

// --- Component ---
const Athletes: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState<string>(
    searchParams.get("search") || ""
  );
  const [selectedTeamId, setSelectedTeamId] = useState<string>(
    searchParams.get("team") || ""
  );

  const [people, setPeople] = useState<Person[]>([]);
  const [athletes, setAthletes] = useState<Athlete[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // --- Data Fetching ---
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [peopleSnap, athletesSnap, teamsSnap, seasonsSnap, contactsSnap] =
          await Promise.all([
            getDocs(collection(db, "people")),
            getDocs(collection(db, "athletes")),
            getDocs(collection(db, "teams")),
            getDocs(collection(db, "seasons")),
            getDocs(collection(db, "contacts")),
          ]);

        // Filter out archived people immediately
        setPeople(
          peopleSnap.docs
            .map((doc) => ({ id: doc.id, ...doc.data() } as Person))
            .filter((p) => !p.isArchived)
        );
        setAthletes(
          athletesSnap.docs.map(
            (doc) => ({ id: doc.id, ...doc.data() } as Athlete)
          )
        );
        setTeams(
          teamsSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Team))
        );
        setSeasons(
          seasonsSnap.docs.map(
            (doc) => ({ id: doc.id, ...doc.data() } as Season)
          )
        );
        setContacts(
          contactsSnap.docs.map(
            (doc) => ({ id: doc.id, ...doc.data() } as Contact)
          )
        );
      } catch (err) {
        console.error("Error fetching Firestore data:", err);
        setError("Failed to load athlete data. Please try again later.");
        // Set empty arrays on error to prevent processing undefined data
        setPeople([]);
        setAthletes([]);
        setTeams([]);
        setSeasons([]);
        setContacts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Fetch only on initial mount

  // --- Data Aggregation & Filtering ---
  const displayAthletes = useMemo((): DisplayAthlete[] => {
    // If any data is missing (e.g., during initial load or error), return empty
    if (!people.length && !loading) return []; // Avoid processing if people fetch failed or is empty

    // Create maps for efficient lookups - essential for performance!
    // Consider moving map creation outside if data sets are static or change infrequently
    const seasonsMap = new Map(seasons.map((s) => [s.id, s]));
    const peopleMap = new Map(people.map((p) => [p.id, p]));
    const athletesByPerson = new Map<string, Athlete[]>();
    athletes.forEach((a) => {
      const existing = athletesByPerson.get(a.person) || [];
      athletesByPerson.set(a.person, [...existing, a]);
    });
    const contactsByPerson = new Map<string, Contact[]>();
    contacts.forEach((c) => {
      // Add contact to both related persons for easier lookup
      const existingContact = contactsByPerson.get(c.contact) || [];
      contactsByPerson.set(c.contact, [...existingContact, c]);
      const existingRecipient = contactsByPerson.get(c.recipient) || [];
      contactsByPerson.set(c.recipient, [...existingRecipient, c]);
    });

    // Aggregate data for each person
    const aggregated = people.map((person): DisplayAthlete => {
      const personAthletes = athletesByPerson.get(person.id) || [];
      const personContacts = contactsByPerson.get(person.id) || [];

      const personSeasons = personAthletes
        .map((a) => seasonsMap.get(a.season))
        .filter((s): s is Season => s !== undefined) // Type guard
        .map((s) => ({ nameShort: s.nameShort, startDate: s.startDate }))
        // Optional: Sort seasons by start date, most recent first
        .sort(
          (a, b) =>
            new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
        );

      const personRelationships = personContacts.map((c) => {
        if (c.contact === person.id) {
          const recipientPerson = peopleMap.get(c.recipient);
          const recipientName = recipientPerson
            ? `${recipientPerson.firstName} ${recipientPerson.lastName}`
            : "Unknown";
          return `Is ${c.relationship} to ${recipientName}`;
        } else {
          // c.recipient === person.id
          const contactPerson = peopleMap.get(c.contact);
          const contactName = contactPerson
            ? `${contactPerson.firstName} ${contactPerson.lastName}`
            : "Unknown";
          return `Has ${contactName} as ${c.relationship}`;
        }
      });

      const personTeamIds = Array.from(
        new Set(personAthletes.map((a) => a.team))
      ); // Unique team IDs

      return {
        ...person,
        displayAgeGender: formatAgeGender(person),
        seasons: personSeasons,
        relationships: personRelationships,
        teamIds: personTeamIds,
      };
    });

    // Filter based on search term and selected team
    const lowerSearchTerm = searchTerm.toLowerCase();
    return aggregated.filter((athlete) => {
      const nameMatch =
        !lowerSearchTerm ||
        athlete.firstName.toLowerCase().includes(lowerSearchTerm) ||
        athlete.lastName.toLowerCase().includes(lowerSearchTerm) ||
        (athlete.preferredName &&
          athlete.preferredName.toLowerCase().includes(lowerSearchTerm));

      const teamMatch =
        !selectedTeamId || athlete.teamIds.includes(selectedTeamId);

      return nameMatch && teamMatch;
    });
  }, [
    people,
    athletes,
    seasons,
    contacts,
    searchTerm,
    selectedTeamId,
    loading,
  ]); // Recompute when data or filters change

  // --- Event Handlers with URL Update ---
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = event.target.value;
    setSearchTerm(newSearchTerm);
    // Update URL: Set search, keep team
    setSearchParams(
      (prev) => {
        const params = new URLSearchParams(prev);
        if (newSearchTerm) {
          params.set("search", newSearchTerm);
        } else {
          params.delete("search");
        }
        return params;
      },
      { replace: true }
    ); // Use replace to avoid bloating history
  };

  const handleTeamChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newTeamId = event.target.value;
    setSelectedTeamId(newTeamId);
    // Update URL: Set team, keep search
    setSearchParams(
      (prev) => {
        const params = new URLSearchParams(prev);
        if (newTeamId) {
          params.set("team", newTeamId);
        } else {
          params.delete("team");
        }
        return params;
      },
      { replace: true }
    );
  };

  // --- Render Logic ---
  return (
    <div className="athletes-page">
      <h1>Athlete Finder</h1>

      <div className="athletes-controls">
        <input
          type="search"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="athletes-search-input" // Apply CSS class
        />
        <select
          value={selectedTeamId}
          onChange={handleTeamChange}
          className="athletes-team-filter" // Apply CSS class
        >
          <option value="">All Teams</option>
          {/* Sort teams alphabetically for dropdown */}
          {teams
            .sort((a, b) => a.nameLong.localeCompare(b.nameLong))
            .map((team) => (
              <option key={team.id} value={team.id}>
                {team.nameLong} ({team.nameShort})
              </option>
            ))}
        </select>
      </div>

      {loading && <div className="loading-indicator">Loading athletes...</div>}
      {error && <div className="error-message">{error}</div>}

      {!loading && !error && (
        <div className="athletes-list">
          {displayAthletes.length > 0 ? (
            displayAthletes.map((athlete) => (
              <Link
                to={`/athlete/${athlete.id}`}
                key={athlete.id}
                className="athlete-card-link"
              >
                <div className="athlete-card card">
                  {" "}
                  {/* Use 'card' class for base styling */}
                  <div className="athlete-card-header">
                    <span className="athlete-name">
                      {athlete.firstName} {athlete.lastName}
                      {athlete.preferredName &&
                        athlete.preferredName !== athlete.firstName &&
                        ` (${athlete.preferredName})`}
                    </span>
                    <span className="athlete-age-gender">
                      {athlete.displayAgeGender}
                    </span>
                  </div>
                  <div className="athlete-card-body">
                    {athlete.seasons.length > 0 && (
                      <div className="athlete-detail-section">
                        <strong>Seasons:</strong>
                        <ul>
                          {/* Show only the 3 most recent seasons for brevity */}
                          {athlete.seasons.slice(0, 3).map((season, index) => (
                            <li key={`${season.nameShort}-${index}`}>
                              {season.nameShort} ({season.startDate})
                            </li>
                          ))}
                          {athlete.seasons.length > 3 && <li>...</li>}
                        </ul>
                      </div>
                    )}
                    {athlete.relationships.length > 0 && (
                      <div className="athlete-detail-section">
                        <strong>Relationships:</strong>
                        <ul>
                          {/* Show only the first 2 relationships for brevity */}
                          {athlete.relationships
                            .slice(0, 2)
                            .map((rel, index) => (
                              <li key={`${rel}-${index}`}>{rel}</li>
                            ))}
                          {athlete.relationships.length > 2 && <li>...</li>}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="athletes-empty-message">
              No athletes found matching your criteria.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Athletes;

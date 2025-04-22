import React, { useState, useEffect, useMemo } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import {
  doc,
  getDoc,
  getDocs,
  collection,
  query,
  where,
  documentId,
  Timestamp as FirestoreTimestamp,
} from "firebase/firestore";
import { db } from "../../firebase/firebase"; // Adjust path as needed
import "../../styles/AthleteDetail.css"; // Styles for this page
import { calculateAge, getDisplayDate } from "../../utils/dateUtils"; // Assuming age calculation exists

// --- Data Interfaces ---
interface Person {
  id: string;
  firstName: string;
  preferredName: string;
  lastName: string;
  birthday: string;
  gender: "M" | "F" | "O";
  phone: string;
  email: string;
  isArchived: boolean;
  createdAt?: FirestoreTimestamp;
  updatedAt?: FirestoreTimestamp;
}
interface Athlete {
  id: string;
  person: string;
  season: string;
  team: string;
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
  contact: string;
  relationship: string;
  recipient: string;
  isEmergency: boolean;
  recievesEmail: boolean;
}
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
  team: string;
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
  date: string;
  locationName: string;
  locationAddress: string;
  team: string;
  season: string;
  eventOrder: string[];
  official: boolean;
  benchmarks: boolean;
  isComplete: boolean;
  createdAt?: FirestoreTimestamp;
  updatedAt?: FirestoreTimestamp;
}
interface Event {
  id: string;
  code: string;
  nameLong: string;
  nameShort: string;
  course: string;
  distance: number;
  stroke: string;
  hs: boolean;
  ms: boolean;
  U14: boolean;
  O15: boolean;
}
interface IndividualResult {
  id: string;
  meet: string;
  event: string;
  athlete: string;
  team: string;
  season: string;
  age: number;
  result: number;
  dq: boolean;
  createdAt?: FirestoreTimestamp;
  updatedAt?: FirestoreTimestamp;
}
interface RelayResult {
  id: string;
  meet: string;
  event: string;
  athletes: string[];
  team: string;
  season: string;
  result: number;
  dq: boolean;
  createdAt?: FirestoreTimestamp;
  updatedAt?: FirestoreTimestamp;
}

// --- Derived Interfaces for Display Logic ---
interface ContactInfo {
  relationship: string;
  personName: string;
  personId: string;
}

// Interface for results when grouped by meet
interface IndividualResultWithEventName extends IndividualResult {
  eventName: string;
}
interface ResultsByMeetGroup {
  meetId: string;
  meetName: string;
  meetDate: string;
  results: IndividualResultWithEventName[];
}

// Interface for results when grouped by event
interface IndividualResultWithMeetInfo extends IndividualResult {
  meetName: string;
  meetDate: string;
}
interface ResultsByEventGroup {
  eventId: string;
  eventName: string;
  results: IndividualResultWithMeetInfo[];
}

// Interface for best efforts display
interface BestEffortResult extends IndividualResult {
  eventName: string;
  meetName: string;
  meetDate: string;
}

// --- Helper: Format Time ---
const formatResultTime = (resultSeconds: number): string => {
  if (resultSeconds === null || resultSeconds === undefined) return "N/A";
  const minutes = Math.floor(resultSeconds / 60);
  const seconds = resultSeconds % 60;
  return `${minutes}:${seconds.toFixed(2).padStart(5, "0")}`;
};

const AthleteDetail: React.FC = () => {
  const { personId } = useParams<{ personId: string }>();
  const [searchParams, setSearchParams] = useSearchParams();

  // Component State
  const [person, setPerson] = useState<Person | null>(null);
  const [athleteRecords, setAthleteRecords] = useState<Athlete[]>([]);
  const [contacts, setContacts] = useState<ContactInfo[]>([]);
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [meets, setMeets] = useState<Meet[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [individualResults, setIndividualResults] = useState<
    IndividualResult[]
  >([]);
  // const [relayResults, setRelayResults] = useState<RelayResult[]>([]); // TODO: Add relay results

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filter State
  const [selectedSeason, setSelectedSeason] = useState<string>(
    searchParams.get("season") || "All-Time"
  );
  const [selectedMeetType, setSelectedMeetType] = useState<string>(
    searchParams.get("meetType") || "All-Meets"
  );
  const [selectedPresentation, setSelectedPresentation] = useState<string>(
    searchParams.get("presentation") || "Best Efforts"
  );
  const [selectedEvent, setSelectedEvent] = useState<string>(
    searchParams.get("event") || "All-Events"
  );

  // --- Data Fetching ---
  useEffect(() => {
    // ... (existing data fetching logic - remains the same) ...
    if (!personId) {
      setError("Athlete ID not provided.");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // 1. Fetch Person
        const personDocRef = doc(db, "people", personId);
        const personSnap = await getDoc(personDocRef);
        if (!personSnap.exists()) throw new Error("Athlete not found.");
        const personData = {
          id: personSnap.id,
          ...personSnap.data(),
        } as Person;
        setPerson(personData);

        // 2. Fetch Athlete records for this person
        const athleteQuery = query(
          collection(db, "athletes"),
          where("person", "==", personId)
        );
        const athleteSnaps = await getDocs(athleteQuery);
        const fetchedAthleteRecords = athleteSnaps.docs.map(
          (d) => ({ id: d.id, ...d.data() } as Athlete)
        );
        setAthleteRecords(fetchedAthleteRecords);
        const seasonIds = Array.from(
          new Set(fetchedAthleteRecords.map((a) => a.season))
        );

        // 3. Fetch Contacts
        const contactQuery1 = query(
          collection(db, "contacts"),
          where("contact", "==", personId)
        );
        const contactQuery2 = query(
          collection(db, "contacts"),
          where("recipient", "==", personId)
        );
        const [contactSnaps1, contactSnaps2] = await Promise.all([
          getDocs(contactQuery1),
          getDocs(contactQuery2),
        ]);
        const combinedContacts = [
          ...contactSnaps1.docs,
          ...contactSnaps2.docs,
        ].map((d) => ({ id: d.id, ...d.data() } as Contact));
        const relatedPersonIds = Array.from(
          new Set(combinedContacts.flatMap((c) => [c.contact, c.recipient]))
        ).filter((id) => id !== personId);

        let relatedPeopleMap = new Map<string, Person>();
        if (relatedPersonIds.length > 0) {
          // Fetch related people in chunks if needed
          const CHUNK_SIZE = 10; // Firestore 'in' query limit
          const chunks = [];
          for (let i = 0; i < relatedPersonIds.length; i += CHUNK_SIZE) {
            chunks.push(relatedPersonIds.slice(i, i + CHUNK_SIZE));
          }
          const peoplePromises = chunks.map((chunk) =>
            getDocs(
              query(collection(db, "people"), where(documentId(), "in", chunk))
            )
          );
          const peopleSnapsArray = await Promise.all(peoplePromises);
          peopleSnapsArray.forEach((peopleSnaps) => {
            peopleSnaps.docs.forEach((doc) =>
              relatedPeopleMap.set(doc.id, {
                id: doc.id,
                ...doc.data(),
              } as Person)
            );
          });
        }

        const formattedContacts: ContactInfo[] = combinedContacts.map((c) => {
          const isContact = c.contact === personId;
          const relatedId = isContact ? c.recipient : c.contact;
          const relatedPerson = relatedPeopleMap.get(relatedId);
          const name = relatedPerson
            ? `${relatedPerson.firstName} ${relatedPerson.lastName}`
            : `ID: ${relatedId}`;
          return {
            relationship: c.relationship,
            personName: name,
            personId: relatedId,
          };
        });
        setContacts(formattedContacts);

        // 4. Fetch Relevant Seasons (if any)
        if (seasonIds.length > 0) {
          const CHUNK_SIZE = 10;
          const chunks = [];
          for (let i = 0; i < seasonIds.length; i += CHUNK_SIZE) {
            chunks.push(seasonIds.slice(i, i + CHUNK_SIZE));
          }
          const seasonPromises = chunks.map((chunk) =>
            getDocs(
              query(collection(db, "seasons"), where(documentId(), "in", chunk))
            )
          );
          const seasonSnapsArray = await Promise.all(seasonPromises);
          const fetchedSeasons = seasonSnapsArray.flatMap((seasonSnaps) =>
            seasonSnaps.docs.map((d) => ({ id: d.id, ...d.data() } as Season))
          );
          setSeasons(
            fetchedSeasons.sort(
              (a, b) =>
                new Date(b.startDate).getTime() -
                new Date(a.startDate).getTime()
            )
          );
        }

        // 5. Fetch All Individual Results for this person
        const resultsQuery = query(
          collection(db, "individualResults"),
          where("athlete", "==", personId)
        );
        const resultsSnaps = await getDocs(resultsQuery);
        const fetchedResults = resultsSnaps.docs.map(
          (d) => ({ id: d.id, ...d.data() } as IndividualResult)
        );
        setIndividualResults(fetchedResults);

        // 6. Fetch Meets and Events based on results
        const meetIds = Array.from(new Set(fetchedResults.map((r) => r.meet)));
        const eventIds = Array.from(
          new Set(fetchedResults.map((r) => r.event))
        );

        let fetchedMeets: Meet[] = [];
        if (meetIds.length > 0) {
          const CHUNK_SIZE = 10;
          const meetChunks = [];
          for (let i = 0; i < meetIds.length; i += CHUNK_SIZE) {
            meetChunks.push(meetIds.slice(i, i + CHUNK_SIZE));
          }
          const meetPromises = meetChunks.map((chunk) =>
            getDocs(
              query(collection(db, "meets"), where(documentId(), "in", chunk))
            )
          );
          const meetSnaps = await Promise.all(meetPromises);
          fetchedMeets = meetSnaps.flatMap((snap) =>
            snap.docs.map((d) => ({ id: d.id, ...d.data() } as Meet))
          );
          setMeets(
            fetchedMeets.sort(
              (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
            )
          );
        }

        let fetchedEvents: Event[] = [];
        if (eventIds.length > 0) {
          const CHUNK_SIZE = 10;
          const eventChunks = [];
          for (let i = 0; i < eventIds.length; i += CHUNK_SIZE) {
            eventChunks.push(eventIds.slice(i, i + CHUNK_SIZE));
          }
          const eventPromises = eventChunks.map((chunk) =>
            getDocs(
              query(collection(db, "events"), where(documentId(), "in", chunk))
            )
          );
          const eventSnaps = await Promise.all(eventPromises);
          fetchedEvents = eventSnaps.flatMap((snap) =>
            snap.docs.map((d) => ({ id: d.id, ...d.data() } as Event))
          );
          setEvents(fetchedEvents);
        }
        // TODO: Fetch Relay Results
      } catch (err) {
        console.error("Error fetching athlete details:", err);
        setError(
          err instanceof Error ? err.message : "An unexpected error occurred."
        );
        setPerson(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [personId]);

  // --- Filter & Presentation Logic (with improved typing) ---
  const filteredResultsData = useMemo(() => {
    const meetsMap = new Map(meets.map((m) => [m.id, m]));
    const eventsMap = new Map(events.map((e) => [e.id, e]));

    let results = individualResults;

    // 1. Filter by Season
    if (selectedSeason !== "All-Time") {
      results = results.filter((r) => r.season === selectedSeason);
    }

    // 2. Filter by Meet Type
    if (selectedMeetType !== "All-Meets") {
      results = results.filter((r) => {
        const meet = meetsMap.get(r.meet);
        if (!meet) return false;
        return selectedMeetType === "Official"
          ? meet.official
          : meet.benchmarks;
      });
    }

    // 3. Filter by Event
    if (selectedPresentation !== "By Meet" && selectedEvent !== "All-Events") {
      results = results.filter((r) => r.event === selectedEvent);
    }

    // --- Apply Presentation Logic ---
    if (selectedPresentation === "Best Efforts") {
      const bestEffortsMap = new Map<string, IndividualResult>(); // Map eventId to best result
      results.forEach((r) => {
        if (r.dq) return;
        const currentBest = bestEffortsMap.get(r.event);
        if (!currentBest || r.result < currentBest.result) {
          bestEffortsMap.set(r.event, r);
        }
      });
      return Array.from(bestEffortsMap.values())
        .map(
          (r): BestEffortResult => ({
            // Explicit return type
            ...r,
            eventName: eventsMap.get(r.event)?.nameShort || "Unknown Event",
            meetName: meetsMap.get(r.meet)?.nameShort || "Unknown Meet",
            meetDate: meetsMap.get(r.meet)?.date || "N/A",
          })
        )
        .sort((a, b) => a.eventName.localeCompare(b.eventName));
    } else if (selectedPresentation === "By Meet") {
      // Use explicit type for the map value
      const resultsByMeet = new Map<string, ResultsByMeetGroup>();
      results.forEach((r) => {
        const meet = meetsMap.get(r.meet);
        if (!meet) return;
        // Ensure the default object matches the interface
        const defaultGroup: ResultsByMeetGroup = {
          meetId: meet.id,
          meetName: meet.nameShort,
          meetDate: meet.date,
          results: [],
        };
        // Type the result being added
        const resultInfo: IndividualResultWithEventName = {
          ...r,
          eventName: eventsMap.get(r.event)?.nameShort || "Unknown Event",
        };

        const existing: ResultsByMeetGroup =
          resultsByMeet.get(meet.id) || defaultGroup; // Get or use default
        existing.results.push(resultInfo); // Now 'results' is known to exist
        existing.results.sort((a, b) => a.eventName.localeCompare(b.eventName)); // Sort typed results
        resultsByMeet.set(meet.id, existing); // Set the updated group back
      });
      // Explicitly type the sort parameters
      return Array.from(resultsByMeet.values()).sort(
        (a: ResultsByMeetGroup, b: ResultsByMeetGroup) =>
          new Date(b.meetDate).getTime() - new Date(a.meetDate).getTime()
      );
    } else if (selectedPresentation === "By Event") {
      // Use explicit type for the map value
      const resultsByEvent = new Map<string, ResultsByEventGroup>();
      results.forEach((r) => {
        const event = eventsMap.get(r.event);
        if (!event) return;
        // Ensure the default object matches the interface
        const defaultGroup: ResultsByEventGroup = {
          eventId: event.id,
          eventName: event.nameShort,
          results: [],
        };
        // Type the result being added
        const resultInfo: IndividualResultWithMeetInfo = {
          ...r,
          meetName: meetsMap.get(r.meet)?.nameShort || "Unknown Meet",
          meetDate: meetsMap.get(r.meet)?.date || "N/A",
        };

        const existing: ResultsByEventGroup =
          resultsByEvent.get(event.id) || defaultGroup; // Get or use default
        existing.results.push(resultInfo); // 'results' exists
        existing.results.sort(
          (a, b) =>
            new Date(b.meetDate).getTime() - new Date(a.meetDate).getTime()
        ); // Sort typed results
        resultsByEvent.set(event.id, existing); // Set back
      });
      // Explicitly type the sort parameters
      return Array.from(resultsByEvent.values()).sort(
        (a: ResultsByEventGroup, b: ResultsByEventGroup) =>
          a.eventName.localeCompare(b.eventName)
      );
    }

    return []; // Default case for safety
  }, [
    individualResults,
    meets,
    events,
    selectedSeason,
    selectedMeetType,
    selectedPresentation,
    selectedEvent,
  ]);

  // --- Event Handlers for Filters ---
  const handleFilterChange =
    (setter: React.Dispatch<React.SetStateAction<string>>, paramName: string) =>
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      const value = event.target.value;
      setter(value);
      setSearchParams(
        (prev) => {
          const params = new URLSearchParams(prev);
          // Simplified default check
          const defaultValues = [
            "All-Time",
            "All-Meets",
            "Best Efforts",
            "All-Events",
          ];
          if (value && !defaultValues.includes(value)) {
            params.set(paramName, value);
          } else {
            params.delete(paramName);
          }
          if (paramName === "presentation" && value === "By Meet") {
            params.delete("event");
            setSelectedEvent("All-Events");
          }
          return params;
        },
        { replace: true }
      );
    };

  // --- Render Logic ---
  if (loading)
    return <div className="loading-indicator">Loading athlete details...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!person)
    return (
      <div className="error-message">Athlete data could not be loaded.</div>
    );

  const currentAge = calculateAge(person.birthday);

  // Add data-label attributes for mobile CSS
  const renderInfoRow = (label: string, value: React.ReactNode) => (
    <tr>
      <th>{label}</th>
      <td data-label={label}>{value}</td>
    </tr>
  );

  return (
    <div className="athlete-detail-page">
      <h1>
        {" "}
        {person.firstName} {person.lastName}{" "}
        {person.preferredName && person.preferredName !== person.firstName
          ? `(${person.preferredName})`
          : ""}{" "}
      </h1>

      {/* Info Table with data-label attributes */}
      <table className="info-table">
        <tbody>
          {renderInfoRow("Full Name", `${person.firstName} ${person.lastName}`)}
          {person.preferredName &&
            person.preferredName !== person.firstName &&
            renderInfoRow("Preferred Name", person.preferredName)}
          {renderInfoRow("Age", currentAge ?? "N/A")}
          {renderInfoRow("Birthday", getDisplayDate(person.birthday) ?? "N/A")}
          {renderInfoRow("Gender", person.gender)}
          {renderInfoRow(
            "Email",
            <a href={`mailto:${person.email}`}>{person.email}</a>
          )}
          {renderInfoRow(
            "Phone",
            <a href={`tel:${person.phone}`}>{person.phone}</a>
          )}
          {renderInfoRow(
            "Contacts",
            contacts.length > 0 ? (
              <ul>
                {contacts.map((c, i) => (
                  <li key={i}>
                    {c.personName} ({c.relationship})
                  </li>
                ))}
              </ul>
            ) : (
              "None"
            )
          )}
          {renderInfoRow("Total Seasons", seasons.length)}
          {renderInfoRow(
            "Total Results",
            individualResults.length /* + relayResults.length */
          )}
        </tbody>
      </table>

      {/* Filters Section */}
      <section className="results-section">
        <h2>Results</h2>
        <div className="results-filters">
          <select
            value={selectedSeason}
            onChange={handleFilterChange(setSelectedSeason, "season")}
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
            onChange={handleFilterChange(setSelectedMeetType, "meetType")}
            aria-label="Filter by Meet Type"
          >
            <option value="All-Meets">All Meets</option>
            <option value="Official">Official Meets</option>
            <option value="Benchmarks">Benchmark Meets</option>
          </select>
          <select
            value={selectedPresentation}
            onChange={handleFilterChange(
              setSelectedPresentation,
              "presentation"
            )}
            aria-label="Filter by Presentation Mode"
          >
            <option value="Best Efforts">Best Efforts</option>
            <option value="By Meet">By Meet</option>
            <option value="By Event">By Event</option>
          </select>
          {selectedPresentation !== "By Meet" && (
            <select
              value={selectedEvent}
              onChange={handleFilterChange(setSelectedEvent, "event")}
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

        {/* Results Display Area */}
        <div className="results-display">
          {filteredResultsData.length > 0 ? (
            <>
              {/* TODO: Replace pre with actual rendering components/tables based on selectedPresentation */}
              {selectedPresentation === "Best Efforts" && (
                <>
                  <p>
                    Displaying {filteredResultsData.length} Best Effort results.
                  </p>
                  <pre>{JSON.stringify(filteredResultsData, null, 2)}</pre>
                </>
              )}
              {selectedPresentation === "By Meet" && (
                <>
                  <p>
                    Displaying results from {filteredResultsData.length} meets.
                  </p>
                  <pre>{JSON.stringify(filteredResultsData, null, 2)}</pre>
                </>
              )}
              {selectedPresentation === "By Event" && (
                <>
                  <p>
                    Displaying results for {filteredResultsData.length} events.
                  </p>
                  <pre>{JSON.stringify(filteredResultsData, null, 2)}</pre>
                </>
              )}
            </>
          ) : (
            <p className="results-empty-message">
              {" "}
              No results found matching the selected filters.{" "}
            </p>
          )}
        </div>
      </section>
    </div>
  );
};

export default AthleteDetail;

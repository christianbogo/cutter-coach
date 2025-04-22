// AthleteContext.tsx

import React, {
  createContext,
  useState,
  useEffect,
  useMemo,
  useContext,
  ReactNode,
} from "react";
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
import { db } from "../firebase/firebase"; // Adjust path
import { calculateAge, getDisplayDate } from "../utils/dateUtils"; // Adjust path
import {
  Person,
  Athlete,
  IndividualResult,
  Season,
  Meet,
  Event,
  Contact,
} from "../models/index"; // Adjust path

// Type for combined contact info
export interface ContactInfo {
  relationship: string;
  personName: string;
  personId: string;
}

// --- Helper Types for Processed Results ---
export interface BestEffortResult extends IndividualResult {
  eventName: string;
  meetName: string;
  meetDate: string;
}
export interface ResultWithEventName extends IndividualResult {
  eventName: string;
}
export interface ResultWithMeetInfo extends IndividualResult {
  meetName: string;
  meetDate: string;
}
export interface MeetGroup {
  meetId: string;
  meetName: string;
  meetDate: string;
  results: ResultWithEventName[];
}
export interface EventGroup {
  eventId: string;
  eventName: string;
  results: ResultWithMeetInfo[];
}

// --- Context Type Definition ---
interface AthleteContextType {
  person: Person | null;
  athleteRecords: Athlete[];
  contacts: ContactInfo[];
  seasons: Season[];
  meets: Meet[];
  events: Event[];
  individualResults: IndividualResult[];
  loading: boolean;
  error: string | null;
  selectedSeason: string;
  selectedMeetType: string;
  selectedPresentation: string;
  selectedEvent: string;
  filteredResultsData: BestEffortResult[] | MeetGroup[] | EventGroup[];
  // *** Updated handleFilterChange type ***
  handleFilterChange: (
    paramName: string
  ) => (event: React.ChangeEvent<HTMLSelectElement>) => void;
  personId?: string;
  currentAge: string | null; // Keep as string or number based on calculateAge output
}

// --- Create Context ---
const AthleteContext = createContext<AthleteContextType>({
  person: null,
  athleteRecords: [],
  contacts: [],
  seasons: [],
  meets: [],
  events: [],
  individualResults: [],
  loading: true,
  error: null,
  selectedSeason: "All-Time",
  selectedMeetType: "All-Meets",
  selectedPresentation: "Best Efforts",
  selectedEvent: "All-Events",
  filteredResultsData: [],
  handleFilterChange: () => () => {},
  personId: undefined,
  currentAge: null,
});

// --- Context Provider Component ---
interface AthleteProviderProps {
  children: ReactNode;
}

export const AthleteProvider: React.FC<AthleteProviderProps> = ({
  children,
}) => {
  const { personId } = useParams<{ personId: string }>();
  const [searchParams, setSearchParams] = useSearchParams();

  // State declarations (remain the same)
  const [person, setPerson] = useState<Person | null>(null);
  const [athleteRecords, setAthleteRecords] = useState<Athlete[]>([]);
  const [contacts, setContacts] = useState<ContactInfo[]>([]);
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [meets, setMeets] = useState<Meet[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [individualResults, setIndividualResults] = useState<
    IndividualResult[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
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

  // Data Fetching useEffect (remains the same)
  useEffect(() => {
    if (!personId) {
      setError("Athlete ID not provided in URL.");
      setLoading(false);
      return;
    }
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      setPerson(null);
      setAthleteRecords([]);
      setContacts([]);
      setSeasons([]);
      setMeets([]);
      setEvents([]);
      setIndividualResults([]);
      try {
        // 1. Fetch Person...
        const personDocRef = doc(db, "people", personId);
        const personSnap = await getDoc(personDocRef);
        if (!personSnap.exists()) throw new Error("Athlete not found.");
        const personData = {
          id: personSnap.id,
          ...personSnap.data(),
        } as Person;
        setPerson(personData);
        // 2. Fetch Athlete records...
        const athleteQuery = query(
          collection(db, "athletes"),
          where("person", "==", personId)
        );
        const athleteSnaps = await getDocs(athleteQuery);
        const fetchedAthleteRecords = athleteSnaps.docs.map(
          (d) => ({ id: d.id, ...d.data() } as Athlete)
        );
        setAthleteRecords(fetchedAthleteRecords);
        const athleteIds = fetchedAthleteRecords.map((a) => a.id);
        const seasonIds = Array.from(
          new Set(fetchedAthleteRecords.map((a) => a.season))
        );
        // 3. Fetch Contacts...
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
          const chunks = [];
          for (let i = 0; i < relatedPersonIds.length; i += 10) {
            chunks.push(relatedPersonIds.slice(i, i + 10));
          }
          const peoplePromises = chunks.map((chunk) =>
            getDocs(
              query(collection(db, "people"), where(documentId(), "in", chunk))
            )
          );
          const peopleSnaps = await Promise.all(peoplePromises);
          peopleSnaps.forEach((snap) =>
            snap.docs.forEach((doc) =>
              relatedPeopleMap.set(doc.id, {
                id: doc.id,
                ...doc.data(),
              } as Person)
            )
          );
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
        // 4. Fetch Relevant Seasons...
        let fetchedSeasons: Season[] = [];
        if (seasonIds.length > 0) {
          const chunks = [];
          for (let i = 0; i < seasonIds.length; i += 10) {
            chunks.push(seasonIds.slice(i, i + 10));
          }
          const seasonPromises = chunks.map((chunk) =>
            getDocs(
              query(collection(db, "seasons"), where(documentId(), "in", chunk))
            )
          );
          const seasonSnaps = await Promise.all(seasonPromises);
          fetchedSeasons = seasonSnaps
            .flatMap((snap) =>
              snap.docs.map((d) => ({ id: d.id, ...d.data() } as Season))
            )
            .sort(
              (a, b) =>
                new Date(b.startDate).getTime() -
                new Date(a.startDate).getTime()
            );
          setSeasons(fetchedSeasons);
        }
        // 5. Fetch Individual Results...
        let fetchedResults: IndividualResult[] = [];
        if (athleteIds.length > 0) {
          const chunks = [];
          for (let i = 0; i < athleteIds.length; i += 10) {
            chunks.push(athleteIds.slice(i, i + 10));
          }
          const resultsPromises = chunks.map((chunk) =>
            getDocs(
              query(
                collection(db, "individualResults"),
                where("athlete", "in", chunk)
              )
            )
          );
          const resultsSnaps = await Promise.all(resultsPromises);
          fetchedResults = resultsSnaps.flatMap((snap) =>
            snap.docs.map(
              (d) => ({ id: d.id, ...d.data() } as IndividualResult)
            )
          );
        }
        setIndividualResults(fetchedResults);
        // 6. Fetch Meets and Events...
        const meetIds = Array.from(new Set(fetchedResults.map((r) => r.meet)));
        const eventIds = Array.from(
          new Set(fetchedResults.map((r) => r.event))
        );
        let fetchedMeets: Meet[] = [];
        if (meetIds.length > 0) {
          const chunks = [];
          for (let i = 0; i < meetIds.length; i += 10) {
            chunks.push(meetIds.slice(i, i + 10));
          }
          const meetPromises = chunks.map((chunk) =>
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
          const chunks = [];
          for (let i = 0; i < eventIds.length; i += 10) {
            chunks.push(eventIds.slice(i, i + 10));
          }
          const eventPromises = chunks.map((chunk) =>
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
      } catch (err) {
        console.error("Error fetching athlete details:", err);
        setError(
          err instanceof Error ? err.message : "An unexpected error occurred."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [personId]);

  // Filter & Presentation Logic (remains the same)
  const filteredResultsData = useMemo(():
    | BestEffortResult[]
    | MeetGroup[]
    | EventGroup[] => {
    // ... same logic as before ...
    const meetsMap = new Map(meets.map((m) => [m.id, m]));
    const eventsMap = new Map(events.map((e) => [e.id, e]));
    let results = individualResults;

    if (selectedSeason !== "All-Time") {
      results = results.filter((r) => r.season === selectedSeason);
    }
    if (selectedMeetType !== "All-Meets") {
      results = results.filter((r) => {
        const meet = meetsMap.get(r.meet);
        if (!meet) return false;
        return selectedMeetType === "Official"
          ? meet.official
          : meet.benchmarks;
      });
    }
    if (selectedPresentation !== "By Meet" && selectedEvent !== "All-Events") {
      results = results.filter((r) => r.event === selectedEvent);
    }

    if (selectedPresentation === "Best Efforts") {
      const bestEffortsMap = new Map<string, IndividualResult>();
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
            ...r,
            eventName: eventsMap.get(r.event)?.nameShort || "Unknown Event",
            meetName: meetsMap.get(r.meet)?.nameShort || "Unknown Meet",
            meetDate: meetsMap.get(r.meet)?.date || "N/A",
          })
        )
        .sort((a, b) => a.eventName.localeCompare(b.eventName));
    } else if (selectedPresentation === "By Meet") {
      const resultsByMeet = new Map<string, MeetGroup>();
      results.forEach((r) => {
        const meet = meetsMap.get(r.meet);
        if (!meet) return;
        const meetInfo = {
          meetId: meet.id,
          meetName: meet.nameShort,
          meetDate: meet.date,
        };
        const resultInfo: ResultWithEventName = {
          ...r,
          eventName: eventsMap.get(r.event)?.nameShort || "Unknown Event",
        };
        const existing: MeetGroup = resultsByMeet.get(meet.id) || {
          ...meetInfo,
          results: [],
        };
        existing.results.push(resultInfo);
        existing.results.sort((a, b) => a.eventName.localeCompare(b.eventName));
        resultsByMeet.set(meet.id, existing);
      });
      return Array.from(resultsByMeet.values()).sort(
        (a, b) =>
          new Date(b.meetDate).getTime() - new Date(a.meetDate).getTime()
      );
    } else if (selectedPresentation === "By Event") {
      const resultsByEvent = new Map<string, EventGroup>();
      results.forEach((r) => {
        const event = eventsMap.get(r.event);
        if (!event) return;
        const eventInfo = { eventId: event.id, eventName: event.nameShort };
        const resultInfo: ResultWithMeetInfo = {
          ...r,
          meetName: meetsMap.get(r.meet)?.nameShort || "Unknown Meet",
          meetDate: meetsMap.get(r.meet)?.date || "N/A",
        };
        const existing: EventGroup = resultsByEvent.get(event.id) || {
          ...eventInfo,
          results: [],
        };
        existing.results.push(resultInfo);
        existing.results.sort(
          (a, b) =>
            new Date(b.meetDate).getTime() - new Date(a.meetDate).getTime()
        );
        resultsByEvent.set(event.id, existing);
      });
      return Array.from(resultsByEvent.values()).sort((a, b) =>
        a.eventName.localeCompare(b.eventName)
      );
    }
    return [];
  }, [
    individualResults,
    meets,
    events,
    selectedSeason,
    selectedMeetType,
    selectedPresentation,
    selectedEvent,
  ]);

  // --- *** UPDATED Event Handler for Filters *** ---
  const handleFilterChange =
    (paramName: string) => (event: React.ChangeEvent<HTMLSelectElement>) => {
      const value = event.target.value;

      // Call the correct state setter based on paramName
      switch (paramName) {
        case "season":
          setSelectedSeason(value);
          break;
        case "meetType":
          setSelectedMeetType(value);
          break;
        case "presentation":
          setSelectedPresentation(value);
          break;
        case "event":
          setSelectedEvent(value);
          break;
        default:
          console.warn("Unknown filter paramName:", paramName);
          return;
      }

      // Prepare params for URL update
      const currentParams = new URLSearchParams(searchParams);
      if (
        value &&
        !["All-Time", "All-Meets", "All-Events", "Best Efforts"].includes(value)
      ) {
        currentParams.set(paramName, value);
      } else {
        currentParams.delete(paramName);
      }

      // Special handling for presentation change affecting event filter
      if (paramName === "presentation" && value === "By Meet") {
        currentParams.delete("event");
        setSelectedEvent("All-Events"); // Reset event state directly
      }

      setSearchParams(currentParams, { replace: true });
    };

  // Calculate current age
  const currentAge = useMemo(
    () => (person ? calculateAge(person.birthday)?.toString() ?? null : null), // Ensure calculateAge returns string or handle null
    [person]
  );

  // Context Value
  const contextValue: AthleteContextType = {
    person,
    athleteRecords,
    contacts,
    seasons,
    meets,
    events,
    individualResults,
    loading,
    error,
    selectedSeason,
    selectedMeetType,
    selectedPresentation,
    selectedEvent,
    filteredResultsData,
    handleFilterChange,
    personId,
    currentAge,
  };

  return (
    <AthleteContext.Provider value={contextValue}>
      {children}
    </AthleteContext.Provider>
  );
};

// Custom Hook (remains the same)
export const useAthleteContext = () => {
  const context = useContext(AthleteContext);
  if (context === undefined) {
    throw new Error("useAthleteContext must be used within an AthleteProvider");
  }
  return context;
};

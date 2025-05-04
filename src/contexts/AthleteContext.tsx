// src/contexts/AthleteContext.tsx

import React, {
  createContext,
  useState,
  useEffect,
  useMemo,
  useContext,
  ReactNode,
  useCallback, // Import useCallback
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
} from "firebase/firestore";
import { db } from "../firebase/firebase"; // Adjust path
import { calculateAge } from "../utils/dateUtils"; // Adjust path
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

// --- Helper Types (kept for potential future reference, but not directly used in context value) ---
export interface BestEffortResult extends IndividualResult {
  eventName: string;
  eventCode: string;
  meetName: string;
  meetDate: string;
}
export interface ResultWithEventName extends IndividualResult {
  eventName: string;
  eventCode: string;
}
export interface ResultWithMeetInfo extends IndividualResult {
  meetName: string;
  meetDate: string;
  eventCode: string;
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
// --- End Helper Types ---

// --- Context Type Definition ---
interface AthleteContextType {
  person: Person | null;
  athleteRecords: Athlete[];
  contacts: ContactInfo[];
  seasons: Season[];
  meets: Meet[];
  events: Event[];
  individualResults: IndividualResult[]; // Provide the raw results
  loading: boolean;
  error: string | null;
  selectedSeason: string; // Keep track of the current filter
  selectedMeetType: string; // Keep track of the current filter
  applyFilters: (newSeason: string, newMeetType: string) => void; // Function to apply filters
  personId?: string;
  currentAge: string | null;
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
  applyFilters: () => {}, // Default empty function
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

  // --- State Declarations ---
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

  // State for selected filters, initialized from URL search params
  const [selectedSeason, setSelectedSeason] = useState<string>(
    searchParams.get("season") || "All-Time"
  );
  const [selectedMeetType, setSelectedMeetType] = useState<string>(
    searchParams.get("meetType") || "All-Meets"
  );
  // Removed selectedPresentation and selectedEvent state

  // --- Data Fetching useEffect (remains largely the same) ---
  useEffect(() => {
    // Reset state and fetch data when personId changes
    if (!personId) {
      setError("Athlete ID not provided in URL.");
      setLoading(false);
      return;
    }
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      // Reset all fetched data states
      setPerson(null);
      setAthleteRecords([]);
      setContacts([]);
      setSeasons([]);
      setMeets([]);
      setEvents([]);
      setIndividualResults([]);

      // Reset filters based on *initial* URL params for this personId
      // This prevents keeping filters from a previous athlete page
      const initialParams = new URLSearchParams(window.location.search);
      setSelectedSeason(initialParams.get("season") || "All-Time");
      setSelectedMeetType(initialParams.get("meetType") || "All-Meets");

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

        const athleteIds = fetchedAthleteRecords.map((a) => a.id);
        if (athleteIds.length === 0) {
          // Early exit if no athlete records found, prevents further fetches
          setLoading(false);
          return;
        }
        const seasonIds = [
          ...Array.from(new Set(fetchedAthleteRecords.map((a) => a.season))),
        ];

        // 3. Fetch Contacts
        // (Contact fetching logic remains the same)
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
          // Batch fetch related people (chunking logic remains the same)
          const chunks = [];
          for (let i = 0; i < relatedPersonIds.length; i += 30) {
            // Firebase v9 'in' supports up to 30
            chunks.push(relatedPersonIds.slice(i, i + 30));
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
            : `ID: ${relatedId}`; // Fallback name
          return {
            relationship: c.relationship,
            personName: name,
            personId: relatedId,
          };
        });
        setContacts(formattedContacts);

        // 4. Fetch Relevant Seasons
        let fetchedSeasons: Season[] = [];
        if (seasonIds.length > 0) {
          // Batch fetch seasons (chunking logic remains the same)
          const chunks = [];
          for (let i = 0; i < seasonIds.length; i += 30) {
            chunks.push(seasonIds.slice(i, i + 30));
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
              // Sort seasons by start date, newest first
              (a, b) =>
                new Date(b.startDate).getTime() -
                new Date(a.startDate).getTime()
            );
          setSeasons(fetchedSeasons);
        }

        // 5. Fetch Individual Results for the athlete records
        let fetchedResults: IndividualResult[] = [];
        if (athleteIds.length > 0) {
          // Batch fetch results (chunking logic remains the same)
          const chunks = [];
          for (let i = 0; i < athleteIds.length; i += 30) {
            chunks.push(athleteIds.slice(i, i + 30));
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
          setIndividualResults(fetchedResults);
        }

        // 6. Fetch Meets and Events referenced in the results
        const meetIds = Array.from(new Set(fetchedResults.map((r) => r.meet)));
        const eventIds = Array.from(
          new Set(fetchedResults.map((r) => r.event))
        );

        let fetchedMeets: Meet[] = [];
        if (meetIds.length > 0) {
          // Batch fetch meets (chunking logic remains the same)
          const chunks = [];
          for (let i = 0; i < meetIds.length; i += 30) {
            chunks.push(meetIds.slice(i, i + 30));
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
              // Sort meets by date, newest first
              (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
            )
          );
        }

        let fetchedEvents: Event[] = [];
        if (eventIds.length > 0) {
          // Batch fetch events (chunking logic remains the same)
          const chunks = [];
          for (let i = 0; i < eventIds.length; i += 30) {
            chunks.push(eventIds.slice(i, i + 30));
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
          // Optionally sort events, e.g., by nameShort or code
          setEvents(
            fetchedEvents.sort((a, b) =>
              (a.nameShort || "").localeCompare(b.nameShort || "")
            )
          );
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
    // Dependency array includes personId to refetch when the athlete changes
  }, [personId]);

  // --- Removed Filter & Presentation Logic ---
  // The complex `filteredResultsData` memoization is removed.
  // Filtering is now done within `AthleteResults` based on `selectedSeason` and `selectedMeetType`.

  // --- Function to Apply Filters and Update URL ---
  const applyFilters = useCallback(
    (newSeason: string, newMeetType: string) => {
      // Update state
      setSelectedSeason(newSeason);
      setSelectedMeetType(newMeetType);

      // Prepare params for URL update
      const currentParams = new URLSearchParams(searchParams);

      // Set or delete 'season' param
      if (newSeason && newSeason !== "All-Time") {
        currentParams.set("season", newSeason);
      } else {
        currentParams.delete("season");
      }

      // Set or delete 'meetType' param
      if (newMeetType && newMeetType !== "All-Meets") {
        currentParams.set("meetType", newMeetType);
      } else {
        currentParams.delete("meetType");
      }

      // Update URL search params without page reload
      setSearchParams(currentParams, { replace: true });
    },
    [searchParams, setSearchParams]
  ); // Dependencies for useCallback

  // --- Sync URL changes back to state ---
  // This useEffect ensures that if the user navigates using browser back/forward
  // buttons, the state reflects the URL parameters.
  useEffect(() => {
    const currentSeason = searchParams.get("season") || "All-Time";
    const currentMeetType = searchParams.get("meetType") || "All-Meets";

    if (currentSeason !== selectedSeason) {
      setSelectedSeason(currentSeason);
    }
    if (currentMeetType !== selectedMeetType) {
      setSelectedMeetType(currentMeetType);
    }
  }, [searchParams, selectedSeason, selectedMeetType]);

  // Calculate current age
  const currentAge = useMemo(
    () => (person ? calculateAge(person.birthday)?.toString() ?? null : null),
    [person]
  );

  // --- Context Value ---
  // Provide raw data and filter state/functions
  const contextValue: AthleteContextType = useMemo(
    () => ({
      person,
      athleteRecords,
      contacts,
      seasons,
      meets,
      events,
      individualResults, // Provide all fetched results for the athlete
      loading,
      error,
      selectedSeason, // Provide current filter state
      selectedMeetType, // Provide current filter state
      applyFilters, // Provide the function to change filters
      personId,
      currentAge,
    }),
    [
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
      applyFilters,
      personId,
      currentAge,
    ]
  ); // Memoize context value

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

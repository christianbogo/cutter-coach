# Cutter's Coaching Platform (Client & Admin)

Welcome to the repository for the Cutter's Coaching platform! This project serves as the central hub for managing athletic teams, built specifically with the needs of coaches and administrators in mind. It combines both the public-facing client application and the robust administrative tools into a unified system, designed to streamline data management for teams, seasons, meets, athletes, and results.

Built using TypeScript, React, and Firebase, this platform emphasizes a clean, modular architecture and a config-driven approach to data handling. It's designed to be both powerful and intuitive, respecting the mental flow of users while providing deep insights into team and athlete performance.

## Project Overview

This project represents the culmination of efforts to create a scalable, maintainable, and user-friendly system for athletic team management. Drawing on real-world coaching experience, it provides tools for:

- Organizing teams and their seasons.
- Scheduling and documenting meets.
- Tracking athlete information and performance.
- Storing and analyzing meet results.
- Managing contact information for athletes and their families.
- Facilitating data import and export.

The system is designed with flexibility in mind, aiming to be adaptable across different sports and organizational structures.

## Data Model: The System's Backbone

Understanding the data structure is key to grasping how the platform organizes information and why it's built the way it is. The system is centered around several core entities, linked together to provide a comprehensive view of team operations. Here's a breakdown of the key interfaces and their relationships, as defined in the codebase:

- **`Team`**: Represents a specific athletic team. This is the top-level entity, housing multiple seasons. Key properties include basic identification (`code`, `nameShort`, `nameLong`, `type`) and metadata like location and counts of associated data.
  ```typescript
  export interface Team {
    id: string;
    code: string;
    nameShort: string;
    nameLong: string;
    type: "Club" | "Masters" | "High School" | "Middle School" | "Other";
    location: string;
    address: string;
    // ... counts and timestamps
  }
  ```
- **`Season`**: Represents a specific period or season for a `Team`. A `Team` can have many `Season`s. This is where the context for athlete rosters and meets is set. Properties include dates, year, quarter, and counts of associated meets, athletes, and results within that season.
  ```typescript
  export interface Season {
    id: string;
    team: Team; // Link back to the parent Team
    startDate: string;
    endDate: string;
    quarter: "Spring" | "Summer" | "Fall" | "Winter";
    year: string;
    dataComplete: boolean;
    // ... counts and timestamps
  }
  ```
- **`Meet`**: Represents a specific competition or event within a `Season`. A `Season` can have many `Meet`s. This entity details the meet's name, date, location, and structure (via `eventOrder`). It also tracks whether the meet is `official` or used for `benchmarks`.
  ```typescript
  export interface Meet {
    id: string;
    season: Season; // Link back to the parent Season
    eventOrder: Event[]; // The sequence of events in the meet
    nameShort: string;
    nameLong: string;
    date: string;
    location: string;
    address: string;
    official: boolean;
    benchmarks: boolean;
    dataComplete: boolean;
    // ... counts and timestamps
  }
  ```
- **`Person`**: A foundational entity representing an individual. This is designed to be a single source of truth for personal information (`firstName`, `lastName`, `birthday`, `gender`, contact details like `phone` and `emails`). A `Person` can be associated with multiple `Athlete` or `Contact` records across different contexts or seasons.
  ```typescript
  export interface Person {
    id: string;
    firstName: string;
    preferredName: string;
    lastName: string;
    birthday: string;
    gender: "M" | "F" | "O";
    phone: string;
    emails: string[];
    // ... timestamps
  }
  ```
- **`Athlete`**: Represents a `Person` participating in a specific `Season`. This entity holds season-specific details about the athlete's role within the team, such as `grade`, `group`, `subgroup`, and `lane`. It links back to both the `Season` and the `Person`.
  ```typescript
  export interface Athlete {
    id: string;
    season: Season; // Link to the Season the athlete is in
    person: Person; // Link to the core Person record
    grade: string | null;
    group: string | null;
    subgroup: string | null;
    lane: string | null;
    // ... counts and timestamps
  }
  ```
- **`Contact`**: Represents a relationship between two `Person` entities, typically linking an `Athlete` (via their `Person` record) to a family member or guardian (`contact`). It defines the `relationship`, whether they are an `emergencyContact`, and if they should be an `emailRecipient`.
  ```typescript
  export interface Contact {
    id: string;
    contact: Person; // The person who is the contact
    recipient: Person; // The person they are a contact for (e.g., the athlete)
    relationship: "Father" | "Mother" | "Other";
    emergencyContact: boolean;
    emailRecipient: boolean;
    // ... timestamps
  }
  ```
- **`Event`**: Defines a specific athletic event (e.g., "50 Freestyle", "400 IM"). This is a descriptive entity used within `Meet`s and `Result`s. It includes details like `code`, `name`, `distance`, `stroke`, and eligibility flags (`hs`, `ms`, `U14`, `O15`).
  ```typescript
  export interface Event {
    id: string;
    code: string;
    nameShort: string;
    nameLong: string;
    course: string; // e.g., "SCY", "LCM"
    distance: number;
    stroke: string;
    hs: boolean;
    ms: boolean;
    U14: boolean;
    O15: boolean;
    // ... count and timestamps
  }
  ```
- **`Result`**: Captures the outcome of an `Athlete` (or multiple athletes for relays) participating in a specific `Event` within a `Meet`. This is where performance data is stored, including the actual `result` (time/score), whether there was a `dq` (disqualification), and if the result is `isOfficial` or `isBenchmark`. It links back to the `Meet`, `Event`, and the participating `Athlete`(s).
  ```typescript
  export interface Result {
    id: string;
    meet: Meet; // The meet the result occurred in
    event: Event; // The event the result is for
    athletes: Athlete[]; // The athlete(s) who achieved the result
    result: number; // The performance result (e.g., time in seconds)
    dq: boolean;
    isOfficial: boolean;
    isBenchmark: boolean;
    // ... timestamps
  }
  ```
- **`Imports`**: A utility interface likely used for processing data ingested into the system. It holds temporary or staged data points (`result`, `date`, `year`) and links them to relevant entities (`team`, `season`, `meet`, `athlete`, `event`, `person`) during the import process.
  ```typescript
  export interface Imports {
    id: string;
    team?: Team;
    season?: Season;
    meet?: Meet;
    athlete?: Athlete;
    event: Event;
    person: Person;
    result: number;
    date?: string;
    year?: string;
    // ... timestamps
  }
  ```

This structured approach ensures data integrity and allows for powerful querying and filtering, enabling coaches to quickly find the information they need, whether it's an athlete's progress over a season or a team's performance at a specific meet.

## Accessing the Platform

The live Cutter's Coaching platform can be accessed here:

[https://cutter.coach](https://cutter.coach)

Feel free to explore the public-facing features. Access to administrative features is role-based and requires appropriate credentials.

## Technical Questions & Collaboration

As a fellow builder and enthusiast for clean code and thoughtful systems, I welcome technical discussions and inquiries about this project. If you have questions about the architecture, data model implementation, or anything else under the hood, please feel free to reach out.

You can find my contact information and profile here:

[https://gravatar.com/christianbcutter](https://gravatar.com/christianbcutter)

Looking forward to connecting with those interested in the technical aspects and potential future directions of this platform!

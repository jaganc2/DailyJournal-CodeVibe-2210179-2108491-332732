# Journal and Mood Analyzer App Requirements

## Overview
A responsive web and mobile application for journaling and mood analysis, inspired by the minimalistic design of the Apple iOS Journal app.

## Core Features
- **User Authentication** (optional for MVP)
- **Daily Journal Entry**
  - Add, edit, and delete text entries
  - Attach photos or media (optional for MVP)
- **Mood Tracking**
  - Select mood using slider from Very Unpleasant to Very Pleasant
  - Show appropriate emoji based on mood level
  - Select specific emotions relevant to the selected mood level
- **Tag System**
  - Categorize entries with tags (Family, Personal, Office, Other)
- **Navigation Menu**
  - Top menu bar for switching between app views
  - Views: New Entry and All Entries
- **Journal List View**
  - Separate component to display all entries
  - Delete functionality for each entry
- **Mood Analytics**
  - Visualize mood trends over time (charts/graphs)
  - Filter by date range
- **Search & Filter**
  - Search journal entries by keyword
  - Filter by mood or date
- **Minimalistic UI/UX**
  - Clean, distraction-free interface
  - Responsive layout for web and mobile
  - Light and dark mode support
  - Glassmorphism design elements inspired by iOS
- **Data Storage**
  - IndexedDB for local storage
  - Cloud sync (optional for future)

## Design Inspiration
- Minimal color palette
- Glassmorphism (backdrop-filter effects)
- Rounded cards and soft shadows
- Large, readable fonts
- Subtle animations and transitions
- iOS-inspired elements

## Tech Stack
- React (with Vite)
- Responsive CSS (Flexbox/Grid)
- IndexedDB for data persistence
- Charting library (e.g., Chart.js or Recharts) - future implementation

## Stretch Goals
- Reminders/notifications
- Voice-to-text for journal entries
- Export data (PDF/CSV)
- Multi-device sync

---

*This document will be updated as requirements evolve.*

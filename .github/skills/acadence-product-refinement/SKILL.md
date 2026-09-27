---
name: acadence-product-refinement
description: 'Redesign or refine the ACADENCE academic workload intelligence product while preserving its existing app and LMS flows. Use for ACADENCE UI/UX changes, student dashboard and calendar work, assignments, academic changes, projects, exams, Lab Prep, LMS document repositories, or integration of the real DSA lab PDF.'
argument-hint: '[optional source document path or attached PDF]'
---

# ACADENCE Product Refinement

Refine the existing ACADENCE application into a clear, light, student-facing academic workload intelligence product. Preserve working behavior and the simulated faculty LMS integration. Do not replace the application with a static mockup or rebuild it from scratch.

## When to Use

- Redesigning or refining the ACADENCE student or faculty experience.
- Changing the calendar, dashboard, assignments, academic changes, projects, exams, Lab Prep, or LMS document repository.
- Integrating the provided DSA lab manual or another faculty document as a source of academic information.
- Removing demo-oriented presentation, planner-like UI, dark styling, or internal technical terminology.

## Product Rules

- ACADENCE means “From Academic Information to Action.” It helps students understand what is due, what changed, what is required, what it affects, and what needs attention. It is not a generic to-do app, chatbot, timetable, study planner, or calendar-only product.
- Keep technical complexity and matching logic behind the interface. Use concise, plain student-facing language.
- Preserve the current architecture and useful functionality. Trace existing state and event flow before changing it; do not break faculty/LMS actions that update student-facing academic data.
- Never invent requirements, dates, topics, experiment names, outputs, submission rules, or impact claims. Display “Not specified” when the source is silent. Do not guess at a document match.
- Use practical workload estimates such as “~45 min”, “~1 hr”, “~1 hr 30 min”, or “~2 hr”. Estimates are not study schedules, and students must not be assigned daily study capacity or hour-by-hour plans.
- Use a calm, professional light interface with readable type, prominent ACADENCE branding, generous spacing, subtle borders, and semantic color. Avoid dark dashboard styling, neon, excessive gradients, and technical AI labels.

## Procedure

### 1. Confirm the Source and Inspect the Existing App

1. Identify the requested outcome and any source documents supplied with the request. The provided DSA source is `Lab Manual 1-10 Programs.pdf` (a 44-page lab record); use the attached/provided file, not invented replacement content. Do not assume its temporary transfer path will be stable in future sessions.
2. Inspect the current frontend, backend/server, data structures, routes or navigation, and the components that own the requested behavior. For the current vanilla-JavaScript application, likely starting points include `index.html`, `server.js`, `js/app.js`, `js/store.js`, `js/ai-engine.js`, and `js/components/`.
3. Trace the relevant end-to-end path before editing. Check faculty/LMS actions, state mutation, derived processing, and student rendering for assignments, changes, projects, exams, calendar events, documents, and demo controls as applicable.
4. Record what already works and preserve it. Form one local hypothesis about the behavior to change and choose a focused check that could disprove it before editing.
5. If the source file is missing, unreadable, or ambiguous, continue unrelated work but do not fabricate its contents. Report the blocker or ask for the source only when the requested feature cannot be completed without it.

### 2. Plan a Focused Product Change

1. Make the Academic Calendar the first/main student page and use this navigation order: Academic Calendar, Dashboard, Assignments & Submissions, Lab Prep, Exams, Projects, Academic Changes.
2. Remove Tasks & Checklists from student navigation. Remove the normal-product split-screen appearance and visible demo walkthrough controls; retain internal demo/test functionality when needed for existing flows.
3. Replace study-planning and internal-engine concepts with student outcomes. Keep the change focused on the requested surfaces and use existing state and component patterns.
4. Before implementation, decide which details are primary and which belong behind “View Details”, “View Work Breakdown”, “View Full Requirements”, or “View Change History”. Avoid duplicate assignment, workload, or alert summaries.

### 3. Apply the Student-Facing Information Design

- **Academic Calendar:** Make the calendar grid the focus, without analytics or explanatory workload sections above it. Distinguish assignments, exams, labs, projects, and academic changes with semantic colors. Selecting an event must expose its details.
- **Dashboard:** Lead with “What Needs Attention” and show about three or four important items, followed by “Other Upcoming Work”. Use concise urgency groups: red for urgent/overdue, orange for soon, yellow for this week, blue for informational/upcoming, and green for complete/on track. Do not turn the dashboard into a checkbox list or study schedule. Remove the old summary-card row.
- **Assignments & Submissions:** Use concise colored academic cards showing course, title, due day/date/time, practical estimate, status, useful source-backed context, and an action. Detail views should prioritize title, deadline, estimate, requirements, submission information, and source. Place work breakdown, full requirements, and history behind expandable actions. Use “Not specified” for absent source fields.
- **Academic Changes:** Group changes for the same academic item. Make “What Changed” explicit (for example, old deadline → new deadline), then show “Why It Matters” only when the impact follows from available data. Use “Action Required”, “Needs Attention”, or “Academic Update”; never expose matching scores, confidence, or internal analysis.
- **Projects:** Show the project name and a simple visual sequence of member tasks and final submission. Only the assigned member can mark their task done. Completing a task updates downstream statuses. Explain effects in plain language; do not add lead/faculty approvals or permission workflows.
- **Exams:** Show subject, exam date, remaining days, faculty-sourced topics, and source. Do not allocate study hours or create a timetable. A changed exam date must update remaining days and appear once in Academic Changes.
- **Lab Prep:** Show only the confidently identified upcoming program, not the entire manual. Present the original title and relevant source content/code, output if available, and preparation/viva information only if supported. Preserve code as closely as possible and omit unrelated theory. If no confident match exists, show: “Unable to identify the upcoming program from the available lab material.” Never expose relevance/confidence scores or extraction details.
- **LMS document repository:** Use a document list or compact cards, not large inline previews. Show filename, course, type, page count, updated date, and “Used in”. Support PDF, PPT/PPTX, and DOC/DOCX uploads with course/context metadata. “Open PDF” must open a usable viewer with page display, page number, previous/next, zoom, close, and browser/download access when supported by the existing app.

### 4. Preserve Functional Data Flow

Keep the established faculty/LMS → academic state → processing → student UI behavior. Verify the relevant flows after changes:

- Assignment deadline/requirement edits update the assignment, create one understandable Academic Change, and alter attention ordering when warranted.
- A faculty lab announcement is matched to the correct program in the supplied manual before Lab Prep updates.
- Marking an assigned project task done updates downstream task status.
- An exam date edit updates the remaining-days display and produces one Academic Change.
- Document upload and “Open PDF” work with the actual file, not a placeholder or oversized repository preview.

Do not duplicate an item just to make it appear in another view. Reuse the canonical data and link or reference it from other views.

### 5. Verify and Report

1. Run the app using the repository’s documented command (currently `npm start`, serving `http://localhost:3000`) and inspect the changed UI in a browser.
2. Check each student navigation item, the calendar event details, assignment details, Academic Changes grouping, project completion behavior, exam date updates, Lab Prep source match, and repository PDF opening as applicable to the change.
3. Check a narrow desktop/laptop width and a smaller viewport for readable text, usable controls, no clipping, and no horizontal overflow.
4. Search visible UI strings for leftover internal terminology, including “AI Engine”, “AI Priority Engine”, “AI Change Detection”, “Institutional Feed”, “Institutional API”, “Confidence”, “Relevance”, “Temporal Intelligence”, and “Workload Distribution Analysis”. Use “LMS Connected” only when connection status is genuinely useful and keep it subtle.
5. Confirm there is no dark product background, normal-product split view, demo controller, daily capacity/study schedule, obsolete summary-card row, or duplicate academic alert.
6. Run available focused tests/checks after editing. Report what was verified and disclose any check blocked by missing source data or unavailable functionality.

## Completion Criteria

- The existing product and its working faculty-to-student flows remain functional.
- Student UI is light, readable, calm, and organized around the requested navigation and academic actions.
- All academic content is traceable to existing data or provided source documents; unknown values remain explicitly unspecified.
- Lab Prep uses the real supplied manual and either surfaces a supported program or declines to guess.
- Relevant interactions, PDF viewing, responsive layout, duplicate handling, and post-edit checks have been verified or their blockers are clearly reported.
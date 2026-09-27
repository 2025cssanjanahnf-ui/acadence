# ACADENCE
### **FROM ACADEMIC INFORMATION TO ACTION**

> **Academic Workload Intelligence Platform**  
> *Transforming scattered LMS updates, announcements, and lab materials into clear, actionable student decisions.*

---

## 1. Product Identity

**ACADENCE** is an academic workload intelligence platform. It helps students understand:

- **What they need to do**
- **When they need to do it**
- **What exactly is required**
- **How much effort it may take** (~45 min, ~1 hr, ~1 hr 30 min, ~2 hr)
- **What has changed** (e.g., deadline Friday → Wednesday)
- **What affects their project** (e.g., upstream milestone delays)
- **What they should prepare next** (e.g., upcoming lab program from the real manual)
- **What currently needs attention**

ACADENCE is **not**:
- A generic to-do app
- A reminder app
- A study planner or daily hour-by-hour scheduler
- A chatbot
- A calendar-only product

**Core Principle:** Technical complexity stays behind the interface; the student-facing UI remains simple, calm, and readable.

---

## 2. Architecture & Data Flow

```
   FACULTY / LMS PORTAL                        ACADENCE PLATFORM
   • Publish / Edit Assignments                1. Academic Calendar (Main Page)
   • Announce Lab Experiments                  2. Dashboard (What Needs Attention)
   • Upload Course Materials (PDF/PPT/DOC)     3. Assignments & Submissions
   • Reschedule Examinations                   4. Lab Prep (Real 44-Page DSA Manual)
               │                               5. Exams (Faculty Topics & Remaining Days)
               │ (Reactive Data Bridge)        6. Projects (Dependency Flow & Done Actions)
               ▼                               7. Academic Changes (What Changed & Impact)
   Reactive Academic State (Store) ───────────► Instant Student Re-render
```

---

## 3. Real DSA Lab PDF Integration

ACADENCE directly integrates the authentic 44-page **DSA Lab Record** (`Lab Manual 1-10 Programs.pdf`), containing Programs 1 to 10.

- **Faculty Announcement Flow:** When faculty announces an upcoming DSA experiment (e.g. Program 4, Program 5, Program 8, etc.), ACADENCE identifies the exact program in the uploaded manual.
- **Student Lab Prep:** Displays *only* the upcoming program:
  - Exact program title and page reference (e.g., Pages 11–19 of 44)
  - Original problem statement from the manual
  - Original C source code
  - Expected execution output from the manual
  - Preparation and viva topics supported by the document
  - Built-in **Interactive PDF Viewer** (`[Open PDF]`) with page navigation and zoom
- **Strict Matching:** If an announcement cannot be confidently matched, ACADENCE displays:
  > *"Unable to identify the upcoming program from the available lab material."*  
  *(Never guesses or invents content)*

---

## 4. Student Navigation Order

1. **Academic Calendar** *(First / Main Page)*: Clean calendar grid with color-coded assignments, labs, exams, and project milestones.
2. **Dashboard**: Features **WHAT NEEDS ATTENTION** (prioritized colored cards: RED for urgent, ORANGE for upcoming lab, YELLOW for this week) and **OTHER UPCOMING WORK**.
3. **Assignments & Submissions**: Colored cards showing subject, title, due date/time, practical workload estimate, status, context, and modal with progressive disclosure (*View Work Breakdown*, *View Full Requirements*, *View Change History*).
4. **Lab Prep**: Focused upcoming laboratory preparation powered by the real 44-page DSA PDF.
5. **Exams**: Subject, exam date, dynamically calculated remaining days, faculty-provided topics, and source.
6. **Projects**: Visual dependency chain (*Backend → Frontend → Testing → Documentation → Final Submission*) with individual *[Mark as Done]* buttons updating downstream task statuses.
7. **Academic Changes**: Grouped record of schedule and format modifications with data-grounded impact statements (*"You now have 2 fewer preparation days"*).

---

## 5. Running the Application Locally

The application runs using a zero-dependency Node.js HTTP server:

```bash
# 1. Start the server (port 3000)
node server.js

# Or via npm
npm start
```

Open your browser to:
```
http://localhost:3000
```

### Accessing the Simulated Faculty LMS:
- Click the **"Faculty LMS Simulation"** button in the ACADENCE header, or navigate directly to:
  ```
  http://localhost:3000/?faculty=1
  ```
- Edit an assignment deadline, announce a different DSA lab program, or upload a document to observe real-time reactive updates on the student platform.

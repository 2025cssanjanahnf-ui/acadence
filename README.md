# ACADENCE
### **FROM ACADEMIC INFORMATION TO ACTION**

> **AI-Powered Academic Workload Intelligence Platform**  
> *Transforming scattered LMS updates, announcements, and syllabi into actionable student decisions.*

---

## 1. Executive Overview

Traditional Learning Management Systems (LMS) present academic data as static silos: assignments, dates, announcements, and files. Students are left with fragmented answers to critical daily dilemmas:

- *"What do I need to do today?"*
- *"A deadline moved from Friday to Wednesday — how does that compress my week?"*
- *"Will this 6-hour assignment collide with my exam preparation?"*
- *"Is a teammate's delayed deliverable blocking my work on our group project?"*

**ACADENCE** is not a generic calendar, to-do app, or chatbot. It is an **Academic Workload Intelligence Layer** that sits on top of institutional LMS feeds to continuously ingest, extract, detect changes, calculate workload, trace dependencies, and synthesize a realistic daily action plan.

```
       FACULTY / VIRTUAL LMS
                 ↓
        Academic Data Layer
                 ↓
        AI Processing Engine
  [Extraction • Change Detection • Dependencies • Capacity]
                 ↓
     ACADENCE Intelligence Layer
                 ↓
[Today's Action Plan • Urgency Alerts • Study Balancer]
```

---

## 2. Core Capabilities

### 1. Dual Connected Portals
- **Side A: Virtual LMS / Faculty Portal**
  - Course Management (DBMS, Operating Systems, Computer Networks, Data Structures, Web Development)
  - Assignment Publishing & Rescheduling (Deadlines, submission formats, page constraints, mandatory sections)
  - Faculty Announcement Broadcaster (Lab notices, review chapters)
  - Document Repository with Context Tagging (`DBMS Lab Experiment 4.pdf`, `Unit 3 Notes.pdf`)
  - Examination Schedule Publisher
  - Team Project Management & Milestone Status

- **Side B: ACADENCE / Student Intelligence Platform**
  - **What Needs Attention**: Multi-attribute priority engine ranking with transparent **"WHY THIS IS PRIORITIZED"** rationales.
  - **Academic Change Detection**: Real-time diffing of previous vs. new parameters, lost preparation days, and plan ripple effects.
  - **Today's Action Plan**: Capacity-fitted daily execution schedule balancing available study hours against realistic task durations.
  - **Submission Checklist**: Auto-generated deliverables verification checklist.
  - **Deadline ≠ Workload Contrast**: Explicit analysis demonstrating why tasks with distant deadlines but heavy workloads must start early.
  - **Recurring Lab Intelligence**: Automated preparation synthesis linking announcements with lab manual documents and confidence scoring.
  - **Project Dependency Risk Intelligence**: Blameless critical path analysis showing how upstream delays ripple to downstream milestones.
  - **AI Exam Planner**: Dynamic syllabus balancer distributing revision modules across available days while throttling load on assignment deadline days.
  - **Academic Calendar & Workload Spikes**: Visual load heatmaps and spike explanations (e.g. Wednesday overlap).

---

## 3. The 9-Step Critical Demo Workflow

ACADENCE includes an interactive top walkthrough controller enabling 1-click execution of the hackathon demonstration:

| Step | Action | Engine Reaction |
|---|---|---|
| **Step 1** | Faculty publishes *DBMS Assignment 3* (Friday, PDF, ER diagram, SQL queries, Report) | Initial academic payload ingested into institutional feed. |
| **Step 2** | Student opens ACADENCE | AI extracts structured requirements (no guessing; "Not specified" for unmentioned fields), generates 6-item checklist, estimates 4–6h workload. |
| **Step 3** | Faculty edits assignment: Friday → Wednesday, PDF → DOCX | Version 2 published. |
| **Step 4** | ACADENCE detects change | **URGENT ACADEMIC UPDATE** triggered: 2 fewer preparation days, format shift to DOCX, priority escalated to High, Today's Plan rescheduled. |
| **Step 5** | Faculty broadcasts *"Experiment 4: Joins"* and uploads `DBMS Lab Experiment 4.pdf` | Document context evaluated. |
| **Step 6** | ACADENCE synthesizes Lab Prep | 94% High Confidence match confirmed; pre-lab action blueprint (Aim, Procedure, Queries, Output, Record, Viva) created for 45–60 min effort. |
| **Step 7** | Student opens Projects | Member A's Backend task is overdue; **PROJECT RISK DETECTED** visualizes downstream blockage (Backend → Frontend → Testing → Docs → Final) blamelessly. |
| **Step 8** | Student opens Exam Planner | DBMS Exam (Oct 20) topics distributed across available days; Oct 17 study block reduced due to Assignment submission overlap. |
| **Step 9** | Student opens Today's Action Plan | All priorities synthesized into a 3h 45m schedule fitted cleanly within student's 4.0h capacity with 15m buffer. |

---

## 4. Running the Prototype Locally

The project includes a built-in zero-dependency Node.js HTTP server:

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

### View Options:
- **Split View (LMS + ACADENCE)**: Recommended for live demonstrations to see immediate cause-and-effect.
- **Student View**: Focus exclusively on the ACADENCE student interface.
- **Faculty View**: Focus exclusively on the Virtual LMS administrative portal.

---

## 5. Technology Stack & Design Principles
- **Core Architecture**: Modern HTML5, ES Modules (Vanilla JavaScript), CSS Custom Properties (Vanilla CSS).
- **Design Philosophy**: Deep Slate Dark Mode (`#090d16`, `#0f172a`), Inter typography, harmonious accent tokens (Indigo, Emerald, Amber, Rose, Sky, Violet), accessible focus states, zero external dependencies.
- **Ethics & Privacy**: Zero personal names used (strictly generic identities: *Student*, *Professor*, *Member A*, *Member B*, *Member C*, *Member D*). Strict adherence to institutional API boundaries.

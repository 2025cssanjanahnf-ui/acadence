/**
 * ACADENCE - Student Intelligence Platform Component
 * Tagline: FROM ACADEMIC INFORMATION TO ACTION
 * 
 * Clean, light, student-facing academic workload intelligence platform.
 * 
 * Navigation:
 * 1. Academic Calendar (First / Main page)
 * 2. Dashboard
 * 3. Assignments & Submissions
 * 4. Lab Prep (Powered by real 44-page DSA manual)
 * 5. Exams
 * 6. Projects
 * 7. Academic Changes
 */

import { matchUpcomingLabProgram, DSA_PROGRAMS } from '../dsa-service.js';

export class AcadenceStudentComponent {
  constructor(store, aiEngine, containerId) {
    this.store = store;
    this.ai = aiEngine;
    this.container = document.getElementById(containerId);
    this.activeTab = 'calendar'; // Calendar is FIRST/main page per specification
    this.selectedEvent = null;
    this.selectedAssignmentId = null;
    this.selectedDocument = null;
    this.activeFilter = 'all'; // for calendar filter
    
    // PDF Viewer state
    this.pdfModalOpen = false;
    this.pdfUrl = 'docs/Lab Manual 1-10 Programs.pdf';
    this.pdfTitle = 'Lab Manual 1-10 Programs.pdf';
    this.pdfCurrentPage = 11; // default to program 4 start page
    this.pdfTotalPages = 44;
    this.pdfScale = 1.2;
    this.pdfDoc = null;
    this.renderingPdf = false;
  }

  render() {
    if (!this.container) return;
    const state = this.store.getState();
    const dashboardData = this.ai.getDashboardAttention(state);
    const labPrepData = this.ai.getLabPreparationItem(state);

    this.container.innerHTML = `
      <div class="acadence-app-shell">
        <!-- Prominent Brand Header -->
        <header class="acadence-main-header">
          <div class="header-brand-container">
            <div class="brand-symbol">
              <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
            <div class="brand-text-block">
              <div class="brand-title-line">
                <span class="brand-name">ACADENCE</span>
              </div>
              <span class="brand-tagline">FROM ACADEMIC INFORMATION TO ACTION</span>
            </div>
          </div>

          <div class="header-actions">
            <!-- Subtle LMS Connection Status -->
            <div class="lms-status-pill" title="Synchronized with Campus LMS">
              <span class="status-dot"></span>
              <span class="status-label">LMS Connected</span>
            </div>

            <!-- LMS Testing Switcher -->
            <a href="?faculty=1" target="_blank" class="btn btn-outline btn-sm" title="Open simulated Faculty LMS in a new tab">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15 3 21 3 21 9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
              </svg>
              Faculty LMS Simulation
            </a>

            <!-- User Badge -->
            <div class="student-profile-pill">
              <div class="student-avatar">S</div>
              <div class="student-info">
                <span class="student-name">Student</span>
                <span class="student-dept">Computer Science</span>
              </div>
            </div>
          </div>
        </header>

        <!-- Clean Main Navigation -->
        <nav class="acadence-navbar" aria-label="Student Navigation">
          <button class="nav-tab ${this.activeTab === 'calendar' ? 'active' : ''}" data-tab="calendar">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            Academic Calendar
          </button>

          <button class="nav-tab ${this.activeTab === 'dashboard' ? 'active' : ''}" data-tab="dashboard">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="3" width="7" height="7"></rect>
              <rect x="14" y="3" width="7" height="7"></rect>
              <rect x="14" y="14" width="7" height="7"></rect>
              <rect x="3" y="14" width="7" height="7"></rect>
            </svg>
            Dashboard
          </button>

          <button class="nav-tab ${this.activeTab === 'assignments' ? 'active' : ''}" data-tab="assignments">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
            </svg>
            Assignments & Submissions
            <span class="tab-badge">${state.assignments.length}</span>
          </button>

          <button class="nav-tab ${this.activeTab === 'lab' ? 'active' : ''}" data-tab="lab">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M10 2v7.31"></path>
              <path d="M14 9.3V2"></path>
              <path d="M8.5 2h7"></path>
              <path d="M14 9.3a6.5 6.5 0 1 1-4 0"></path>
              <path d="M5.52 16h12.96"></path>
            </svg>
            Lab Prep
            ${labPrepData.matched ? `<span class="tab-badge orange">Prog ${labPrepData.program.programNumber}</span>` : ''}
          </button>

          <button class="nav-tab ${this.activeTab === 'exams' ? 'active' : ''}" data-tab="exams">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
            </svg>
            Exams
            <span class="tab-badge">${state.exams.length}</span>
          </button>

          <button class="nav-tab ${this.activeTab === 'projects' ? 'active' : ''}" data-tab="projects">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
              <polyline points="2 17 12 22 22 17"></polyline>
              <polyline points="2 12 12 17 22 12"></polyline>
            </svg>
            Projects
          </button>

          <button class="nav-tab ${this.activeTab === 'changes' ? 'active' : ''}" data-tab="changes">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M23 4v6h-6"></path>
              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
            </svg>
            Academic Changes
            ${state.changes.length > 0 ? `<span class="tab-badge alert">${state.changes.length}</span>` : ''}
          </button>
        </nav>

        <!-- Main Content Surface -->
        <main class="acadence-main-surface">
          ${this.renderActiveTab(state, dashboardData, labPrepData)}
        </main>

        <!-- Modals -->
        ${this.selectedAssignmentId ? this.renderAssignmentDetailModal(state) : ''}
        ${this.selectedEvent ? this.renderEventDetailModal(state) : ''}
        ${this.pdfModalOpen ? this.renderPdfViewerModal() : ''}
      </div>
    `;

    this.bindEvents();

    if (this.pdfModalOpen) {
      this.initPdfViewer();
    }
  }

  renderActiveTab(state, dashboardData, labPrepData) {
    switch (this.activeTab) {
      case 'calendar':
        return this.renderCalendarPage(state);
      case 'dashboard':
        return this.renderDashboardPage(state, dashboardData);
      case 'assignments':
        return this.renderAssignmentsPage(state);
      case 'lab':
        return this.renderLabPrepPage(state, labPrepData);
      case 'exams':
        return this.renderExamsPage(state);
      case 'projects':
        return this.renderProjectsPage(state);
      case 'changes':
        return this.renderAcademicChangesPage(state);
      default:
        return this.renderCalendarPage(state);
    }
  }

  // =========================================================================
  // 1. ACADEMIC CALENDAR (MAIN PAGE)
  // =========================================================================
  renderCalendarPage(state) {
    const events = this.getCalendarEvents(state);

    return `
      <div class="calendar-page-layout">
        <div class="page-title-row">
          <div>
            <h2 class="page-main-heading">Academic Calendar</h2>
            <p class="page-subheading">View upcoming deadlines, lab sessions, exams, and academic updates.</p>
          </div>

          <!-- Calendar Category Legend / Filters -->
          <div class="calendar-filters">
            <button class="filter-pill ${this.activeFilter === 'all' ? 'active' : ''}" data-filter="all">All Events</button>
            <button class="filter-pill ${this.activeFilter === 'assignments' ? 'active' : ''}" data-filter="assignments">
              <span class="legend-dot red"></span> Assignments
            </button>
            <button class="filter-pill ${this.activeFilter === 'labs' ? 'active' : ''}" data-filter="labs">
              <span class="legend-dot orange"></span> Labs
            </button>
            <button class="filter-pill ${this.activeFilter === 'projects' ? 'active' : ''}" data-filter="projects">
              <span class="legend-dot yellow"></span> Projects
            </button>
            <button class="filter-pill ${this.activeFilter === 'exams' ? 'active' : ''}" data-filter="exams">
              <span class="legend-dot blue"></span> Exams
            </button>
          </div>
        </div>

        <!-- Clean Calendar Grid Container -->
        <div class="calendar-card">
          <div class="calendar-month-header">
            <h3 class="month-title">October 2026</h3>
            <span class="calendar-subtitle">Fall Semester • Active Term</span>
          </div>

          <div class="calendar-grid">
            <div class="day-label">Sun</div>
            <div class="day-label">Mon</div>
            <div class="day-label">Tue</div>
            <div class="day-label">Wed</div>
            <div class="day-label">Thu</div>
            <div class="day-label">Fri</div>
            <div class="day-label">Sat</div>

            <!-- Week 1: Sep 27 - Oct 3 -->
            <div class="cal-cell muted">
              <span class="date-num">27</span>
            </div>
            <div class="cal-cell muted">
              <span class="date-num">28</span>
              <div class="cal-event blue-card" data-event-id="proj_final">
                <span class="event-title">Project: Final Submission</span>
                <span class="event-time">11:59 PM</span>
              </div>
            </div>
            <div class="cal-cell muted">
              <span class="date-num">29</span>
            </div>
            <div class="cal-cell muted">
              <span class="date-num">30</span>
            </div>
            <div class="cal-cell highlight">
              <span class="date-num">1</span>
              <div class="cal-event red-card" data-event-id="asg_dbms_3">
                <span class="event-badge">NEEDS ATTENTION</span>
                <span class="event-title">DBMS Assignment 3</span>
                <span class="event-time">5:00 PM • ~1 hr</span>
              </div>
            </div>
            <div class="cal-cell">
              <span class="date-num">2</span>
              <div class="cal-event orange-card" data-event-id="dsa_lab_p4">
                <span class="event-badge">LAB PREP</span>
                <span class="event-title">DSA Lab: Program 4</span>
                <span class="event-time">~45 min</span>
              </div>
            </div>
            <div class="cal-cell">
              <span class="date-num">3</span>
            </div>

            <!-- Week 2: Oct 4 - Oct 10 -->
            <div class="cal-cell">
              <span class="date-num">4</span>
            </div>
            <div class="cal-cell">
              <span class="date-num">5</span>
            </div>
            <div class="cal-cell">
              <span class="date-num">6</span>
              <div class="cal-event yellow-card" data-event-id="asg_os_2">
                <span class="event-badge">THIS WEEK</span>
                <span class="event-title">OS Tutorial 2</span>
                <span class="event-time">11:59 PM • ~1 hr</span>
              </div>
            </div>
            <div class="cal-cell">
              <span class="date-num">7</span>
            </div>
            <div class="cal-cell">
              <span class="date-num">8</span>
            </div>
            <div class="cal-cell">
              <span class="date-num">9</span>
            </div>
            <div class="cal-cell">
              <span class="date-num">10</span>
              <div class="cal-event blue-card" data-event-id="asg_cn_1">
                <span class="event-title">CN Socket Programming</span>
                <span class="event-time">5:00 PM • ~2 hr</span>
              </div>
            </div>

            <!-- Week 3: Oct 11 - Oct 17 -->
            <div class="cal-cell"><span class="date-num">11</span></div>
            <div class="cal-cell"><span class="date-num">12</span></div>
            <div class="cal-cell"><span class="date-num">13</span></div>
            <div class="cal-cell"><span class="date-num">14</span></div>
            <div class="cal-cell"><span class="date-num">15</span></div>
            <div class="cal-cell"><span class="date-num">16</span></div>
            <div class="cal-cell"><span class="date-num">17</span></div>

            <!-- Week 4: Oct 18 - Oct 24 -->
            <div class="cal-cell"><span class="date-num">18</span></div>
            <div class="cal-cell"><span class="date-num">19</span></div>
            <div class="cal-cell exam-cell">
              <span class="date-num">20</span>
              <div class="cal-event blue-card exam-event" data-event-id="exam_dbms">
                <span class="event-badge">FINAL EXAM</span>
                <span class="event-title">DBMS Final Exam</span>
                <span class="event-time">10:00 AM • 40% Grade</span>
              </div>
            </div>
            <div class="cal-cell"><span class="date-num">21</span></div>
            <div class="cal-cell"><span class="date-num">22</span></div>
            <div class="cal-cell"><span class="date-num">23</span></div>
            <div class="cal-cell"><span class="date-num">24</span></div>

            <!-- Week 5: Oct 25 - Oct 31 -->
            <div class="cal-cell"><span class="date-num">25</span></div>
            <div class="cal-cell"><span class="date-num">26</span></div>
            <div class="cal-cell"><span class="date-num">27</span></div>
            <div class="cal-cell exam-cell">
              <span class="date-num">28</span>
              <div class="cal-event blue-card exam-event" data-event-id="exam_os">
                <span class="event-badge">FINAL EXAM</span>
                <span class="event-title">Operating Systems Exam</span>
                <span class="event-time">10:00 AM • 40% Grade</span>
              </div>
            </div>
            <div class="cal-cell"><span class="date-num">29</span></div>
            <div class="cal-cell"><span class="date-num">30</span></div>
            <div class="cal-cell"><span class="date-num">31</span></div>
          </div>
        </div>
      </div>
    `;
  }

  // =========================================================================
  // 2. DASHBOARD (WHAT NEEDS ATTENTION)
  // =========================================================================
  renderDashboardPage(state, dashboardData) {
    return `
      <div class="dashboard-page-layout">
        <!-- Top Section: WHAT NEEDS ATTENTION -->
        <div class="dashboard-section">
          <div class="section-title-wrap">
            <h2 class="section-title">WHAT NEEDS ATTENTION</h2>
            <p class="section-subtitle">Prioritized based on impending deadlines, recent changes, and upcoming lab requirements.</p>
          </div>

          <div class="attention-cards-grid">
            ${dashboardData.needsAttention.map(item => this.renderAttentionCard(item)).join('')}
          </div>
        </div>

        <!-- Second Section: OTHER UPCOMING WORK -->
        <div class="dashboard-section secondary">
          <div class="section-title-wrap">
            <h3 class="section-title">OTHER UPCOMING WORK</h3>
            <p class="section-subtitle">Scheduled coursework, final examinations, and team milestones.</p>
          </div>

          <div class="other-cards-grid">
            ${dashboardData.otherUpcoming.map(item => `
              <div class="other-work-card">
                <div class="other-card-left">
                  <span class="course-chip course-${item.subject.toLowerCase().replace(/[^a-z0-9]/g, '')}">${item.subject}</span>
                  <h4 class="other-card-title">${item.title}</h4>
                  <span class="other-card-meta">${item.dueDayTime} • ${item.workload}</span>
                </div>
                <div class="other-card-right">
                  <button class="btn btn-outline btn-sm btn-navigate-action" data-tab="${item.targetTab}" data-id="${item.targetId}">
                    ${item.actionLabel}
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  renderAttentionCard(item) {
    return `
      <div class="attention-box-card ${item.level}-box">
        <div class="box-top-row">
          <span class="box-status-chip ${item.level}">${item.levelLabel}</span>
          <span class="box-course-tag">${item.subject}</span>
        </div>

        <h3 class="box-item-title">${item.title}</h3>

        <div class="box-timing-row">
          <span class="box-timing-badge">${item.dueDayTime}</span>
          <span class="box-effort-badge">${item.workload}</span>
        </div>

        <p class="box-context-text">${item.context}</p>

        <div class="box-action-row">
          <button class="btn btn-action ${item.level}-btn btn-navigate-action" data-tab="${item.targetTab}" data-id="${item.targetId}">
            ${item.actionLabel}
          </button>
        </div>
      </div>
    `;
  }

  // =========================================================================
  // 3. ASSIGNMENTS & SUBMISSIONS
  // =========================================================================
  renderAssignmentsPage(state) {
    return `
      <div class="assignments-page-layout">
        <div class="page-title-row">
          <div>
            <h2 class="page-main-heading">Assignments & Submissions</h2>
            <p class="page-subheading">Coursework requirements, deadlines, submission specifications, and updates.</p>
          </div>
        </div>

        <div class="assignments-cards-grid">
          ${state.assignments.map(asg => this.renderAssignmentCard(asg)).join('')}
        </div>
      </div>
    `;
  }

  renderAssignmentCard(asg) {
    const isUrgent = asg.urgencyLevel === 'urgent';
    const boxColorClass = isUrgent ? 'red-box' : (asg.urgencyLevel === 'this_week' ? 'yellow-box' : 'blue-box');
    const badgeColorClass = isUrgent ? 'red' : (asg.urgencyLevel === 'this_week' ? 'yellow' : 'blue');

    return `
      <div class="assignment-card-box ${boxColorClass}" data-asg-id="${asg.id}">
        <div class="box-header-row">
          <span class="course-chip course-${asg.courseName.toLowerCase().replace(/[^a-z0-9]/g, '')}">${asg.courseName}</span>
          <span class="status-chip ${badgeColorClass}">${asg.status}</span>
        </div>

        <h3 class="assignment-card-title">${asg.title}</h3>

        <div class="assignment-timing-bar">
          <div class="timing-col">
            <span class="timing-label">Due</span>
            <span class="timing-val bold">${asg.dueDay}, ${asg.dueTime}</span>
          </div>
          <div class="timing-col">
            <span class="timing-label">Estimated Workload</span>
            <div class="workload-control-wrap">
              <span class="timing-val workload-badge">${asg.estimatedWorkload}</span>
              <button class="btn-adjust-workload" data-id="${asg.id}" title="Adjust estimate">Adjust</button>
            </div>
          </div>
        </div>

        <p class="assignment-context-message">${asg.context}</p>

        <div class="assignment-card-actions">
          <button class="btn btn-primary btn-view-assignment" data-id="${asg.id}">
            View Assignment
          </button>
        </div>
      </div>
    `;
  }

  // =========================================================================
  // 4. LAB PREP (AUTHENTIC 44-PAGE DSA PDF INTEGRATION)
  // =========================================================================
  renderLabPrepPage(state, labData) {
    if (!labData.matched) {
      return `
        <div class="lab-prep-page-layout">
          <div class="page-title-row">
            <div>
              <h2 class="page-main-heading">DSA LAB</h2>
              <p class="page-subheading">Preparation material for upcoming laboratory practical sessions.</p>
            </div>
          </div>

          <div class="lab-unmatched-notice">
            <div class="notice-icon">⚠️</div>
            <div class="notice-text">
              <h3>Unable to identify the upcoming program from the available lab material.</h3>
              <p>The faculty announcement does not match a verified program in the uploaded lab manual (Lab Manual 1-10 Programs.pdf). Please check back once faculty publishes the exact program number.</p>
            </div>
          </div>
        </div>
      `;
    }

    const prog = labData.program;

    return `
      <div class="lab-prep-page-layout">
        <div class="page-title-row">
          <div>
            <div class="lab-header-badge-row">
              <span class="course-chip course-dsa">Data Structures & Algorithms</span>
              <span class="source-tag">Source: Lab Manual 1-10 Programs.pdf (${labData.relevantPages})</span>
            </div>
            <h2 class="page-main-heading">DSA LAB — Upcoming Program</h2>
            <h3 class="program-headline">${prog.title}</h3>
          </div>

          <div class="lab-header-actions">
            <button class="btn btn-primary btn-open-lab-pdf" data-page="${prog.startPage}">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
              </svg>
              Open PDF (Page ${prog.startPage} of 44)
            </button>
          </div>
        </div>

        <div class="lab-prep-container">
          <!-- Problem Statement Section -->
          <div class="lab-section-card">
            <h4 class="lab-section-title">Problem Statement</h4>
            <div class="problem-statement-text">${prog.problemStatement.replace(/\n/g, '<br>')}</div>
          </div>

          <!-- What to Prepare / Original C Code -->
          <div class="lab-section-card">
            <div class="code-card-header">
              <h4 class="lab-section-title">What to Prepare (Original C Program)</h4>
              <button class="btn btn-outline btn-xs btn-copy-code" data-code="${encodeURIComponent(prog.code)}">
                Copy Code
              </button>
            </div>
            <pre class="code-snippet-box"><code>${this.escapeHtml(prog.code)}</code></pre>
          </div>

          <!-- Output Section -->
          <div class="lab-section-card">
            <h4 class="lab-section-title">Output</h4>
            <pre class="output-snippet-box"><code>${this.escapeHtml(prog.output)}</code></pre>
          </div>

          <!-- Preparation / Viva Voce Section -->
          <div class="lab-section-card">
            <h4 class="lab-section-title">Preparation / Viva</h4>
            <p class="text-muted text-sm" style="margin-bottom: 12px;">Essential concepts and examination questions grounded in this lab experiment:</p>
            <ul class="viva-topics-list">
              ${prog.vivaTopics.map(topic => `
                <li class="viva-topic-item">
                  <span class="viva-bullet">•</span>
                  <span>${topic}</span>
                </li>
              `).join('')}
            </ul>
          </div>
        </div>
      </div>
    `;
  }

  // =========================================================================
  // 5. EXAMS
  // =========================================================================
  renderExamsPage(state) {
    return `
      <div class="exams-page-layout">
        <div class="page-title-row">
          <div>
            <h2 class="page-main-heading">Exams</h2>
            <p class="page-subheading">Official examination dates, remaining timelines, and syllabus topics from faculty materials.</p>
          </div>
        </div>

        <div class="exams-grid">
          ${state.exams.map(exam => {
            const daysRemaining = this.ai.getExamDaysRemaining(exam.date);
            return `
              <div class="exam-card-surface">
                <div class="exam-card-header">
                  <div>
                    <span class="course-chip course-${exam.subject.toLowerCase().replace(/[^a-z0-9]/g, '')}">${exam.subject}</span>
                    <h3 class="exam-subject-title">${exam.subject} Final Examination</h3>
                    <span class="exam-course-code">${exam.courseCode} • Weightage: ${exam.weightage}</span>
                  </div>
                  <div class="exam-date-box">
                    <span class="exam-date-label">Exam Date</span>
                    <span class="exam-date-value">${exam.date}</span>
                    <span class="exam-days-tag">${daysRemaining}</span>
                  </div>
                </div>

                <div class="exam-syllabus-section">
                  <h4 class="syllabus-heading">Topics Included (Sourced from Faculty Document)</h4>
                  <ul class="exam-topics-list">
                    ${exam.topics.map(t => `
                      <li class="exam-topic-item">
                        <span class="check-bullet">✓</span>
                        <span class="topic-name">${t}</span>
                      </li>
                    `).join('')}
                  </ul>
                </div>

                <div class="exam-card-footer">
                  <span class="exam-source-note">Source: ${exam.source}</span>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }

  // =========================================================================
  // 6. PROJECTS (VISUAL DEPENDENCY FLOW & DONE BUTTONS)
  // =========================================================================
  renderProjectsPage(state) {
    const proj = state.projects[0];
    if (!proj) return '<p>No active team projects.</p>';

    return `
      <div class="projects-page-layout">
        <div class="page-title-row">
          <div>
            <h2 class="page-main-heading">${proj.title}</h2>
            <p class="page-subheading">${proj.courseName} • Team: ${proj.teamName}</p>
          </div>
        </div>

        <!-- Dependency Flow Status Explanation Box -->
        <div class="project-explanation-card">
          <div class="explanation-icon">ℹ️</div>
          <div class="explanation-body">
            <h4 class="explanation-title">Project Issue: Overdue Milestone</h4>
            <p class="explanation-text">
              <strong>Backend</strong> work is overdue. <strong>Frontend</strong> depends on Backend. This may delay final submission.
            </p>
          </div>
        </div>

        <!-- Visual Dependency Flow -->
        <div class="dependency-flow-container">
          <h3 class="flow-section-heading">Milestone Dependency Flow</h3>

          <div class="flow-nodes-sequence">
            ${proj.tasks.map((task, idx) => {
              const isLast = idx === proj.tasks.length - 1;
              const statusClass = task.status; // 'overdue', 'waiting', 'in_progress', 'done'
              const statusLabel = task.status === 'overdue' ? 'OVERDUE' : (task.status === 'waiting' ? 'WAITING' : (task.status === 'done' ? 'DONE' : 'IN PROGRESS'));

              return `
                <div class="flow-step-wrapper">
                  <div class="flow-node-card status-${statusClass} ${task.isMyTask ? 'my-task' : ''}">
                    <div class="node-top-row">
                      <h4 class="node-task-name">${task.name}</h4>
                      <span class="node-status-badge status-${statusClass}">${statusLabel}</span>
                    </div>

                    <div class="node-meta-row">
                      <span class="node-owner">${task.owner} ${task.isMyTask ? '<strong>(You)</strong>' : ''}</span>
                      <span class="node-due">Due ${task.dueDay}</span>
                    </div>

                    ${task.isMyTask && task.status !== 'done' ? `
                      <div class="node-action-row">
                        <button class="btn btn-sm btn-success btn-mark-done" data-proj="${proj.id}" data-task="${task.id}">
                          Mark as Done
                        </button>
                      </div>
                    ` : (task.status === 'done' ? `
                      <div class="node-done-check">✓ Completed</div>
                    ` : '')}
                  </div>

                  ${!isLast ? `
                    <div class="flow-arrow-connector">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <polyline points="19 12 12 19 5 12"></polyline>
                      </svg>
                    </div>
                  ` : ''}
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </div>
    `;
  }

  // =========================================================================
  // 7. ACADEMIC CHANGES
  // =========================================================================
  renderAcademicChangesPage(state) {
    return `
      <div class="changes-page-layout">
        <div class="page-title-row">
          <div>
            <h2 class="page-main-heading">Academic Changes</h2>
            <p class="page-subheading">Clear, actionable record of deadline shifts, syllabus alterations, and format adjustments.</p>
          </div>
        </div>

        <div class="changes-list-container">
          ${state.changes.length === 0 ? `
            <div class="empty-state-card">
              <p>No new academic changes detected.</p>
            </div>
          ` : state.changes.map(ch => `
            <div class="academic-change-card ${ch.urgency === 'high' ? 'urgent-border' : ''}">
              <div class="change-card-header">
                <div class="header-left">
                  <span class="course-chip course-${ch.courseName.toLowerCase().replace(/[^a-z0-9]/g, '')}">${ch.courseName}</span>
                  <h3 class="change-item-title">${ch.title}</h3>
                </div>
                <div class="header-right">
                  <span class="change-badge ${ch.urgency === 'high' ? 'action-required' : 'academic-update'}">${ch.badge}</span>
                  <span class="change-timestamp">${ch.timestamp}</span>
                </div>
              </div>

              <!-- WHAT CHANGED -->
              <div class="change-details-section">
                <span class="section-label">WHAT CHANGED</span>
                <div class="diff-boxes-row">
                  ${ch.changes.map(item => `
                    <div class="diff-pill">
                      <span class="diff-field">${item.field}:</span>
                      <span class="diff-old">${item.from}</span>
                      <span class="diff-arrow">→</span>
                      <span class="diff-new">${item.to}</span>
                    </div>
                  `).join('')}
                </div>
              </div>

              <!-- WHY IT MATTERS -->
              <div class="change-impact-section">
                <span class="section-label">WHY IT MATTERS</span>
                <p class="impact-message-text">${ch.whyItMatters}</p>
              </div>

              <div class="change-card-footer">
                <button class="btn btn-outline btn-sm btn-view-assignment" data-id="${ch.assignmentId}">
                  View Assignment Details
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // =========================================================================
  // ASSIGNMENT DETAILS MODAL (PROGRESSIVE DISCLOSURE)
  // =========================================================================
  renderAssignmentDetailModal(state) {
    const asg = state.assignments.find(a => a.id === this.selectedAssignmentId);
    if (!asg) return '';

    const breakdown = this.ai.getWorkloadBreakdown(asg);

    return `
      <div class="modal-backdrop" id="assignment-modal-backdrop">
        <div class="modal-dialog-card">
          <div class="modal-top-bar">
            <div>
              <span class="course-chip course-${asg.courseName.toLowerCase().replace(/[^a-z0-9]/g, '')}">${asg.courseName}</span>
              <h2 class="modal-assignment-title">${asg.title}</h2>
            </div>
            <button class="btn-close-modal" id="btn-close-asg-modal">✕</button>
          </div>

          <div class="modal-scroll-content">
            <!-- Key Metadata Strip -->
            <div class="modal-meta-strip">
              <div class="meta-strip-item">
                <span class="strip-label">Deadline</span>
                <span class="strip-val bold text-rose">${asg.deadline}</span>
              </div>
              <div class="meta-strip-item">
                <span class="strip-label">Estimated Workload</span>
                <span class="strip-val">${asg.estimatedWorkload}</span>
              </div>
              <div class="meta-strip-item">
                <span class="strip-label">Format</span>
                <span class="strip-val">${asg.submissionFormat}</span>
              </div>
              <div class="meta-strip-item">
                <span class="strip-label">Submission Location</span>
                <span class="strip-val">${asg.submissionLocation}</span>
              </div>
            </div>

            <!-- Description / Instructions -->
            <div class="modal-info-block">
              <h4 class="block-title">Description</h4>
              <p class="block-text">${asg.description || 'Not specified'}</p>
            </div>

            <!-- What Changed Section if applicable -->
            ${asg.context ? `
              <div class="modal-info-block alert-light">
                <h4 class="block-title">Recent Update</h4>
                <p class="block-text">${asg.context}</p>
              </div>
            ` : ''}

            <!-- Progressive Disclosure Controls -->
            <div class="progressive-actions-bar">
              <button class="btn btn-outline btn-sm btn-toggle-expand" data-target="expand-workload">
                View Work Breakdown
              </button>
              <button class="btn btn-outline btn-sm btn-toggle-expand" data-target="expand-requirements">
                View Full Requirements
              </button>
              <button class="btn btn-outline btn-sm btn-toggle-expand" data-target="expand-history">
                View Change History
              </button>
            </div>

            <!-- Expandable 1: Work Breakdown -->
            <div class="expandable-panel hidden" id="expand-workload">
              <h4 class="expand-heading">Estimated Work Breakdown (~${breakdown.totalEstimate})</h4>
              <ul class="subtask-breakdown-list">
                ${breakdown.subtasks.map(s => `
                  <li class="subtask-item">
                    <span class="subtask-bullet">•</span>
                    <span class="subtask-name">${s.name}</span>
                    <span class="subtask-time">${s.duration}</span>
                  </li>
                `).join('')}
              </ul>
            </div>

            <!-- Expandable 2: Full Requirements (Strict, 'Not specified' when silent) -->
            <div class="expandable-panel hidden" id="expand-requirements">
              <h4 class="expand-heading">Assignment Requirements</h4>
              <div class="requirements-table">
                <div class="req-row"><span class="req-col-name">Required Sections:</span><span class="req-col-val">${asg.requiredSections.join(', ') || 'Not specified'}</span></div>
                <div class="req-row"><span class="req-col-name">Required Files:</span><span class="req-col-val">${asg.requiredFiles.join(', ') || 'Not specified'}</span></div>
                <div class="req-row"><span class="req-col-name">Page Limit:</span><span class="req-col-val">${asg.pageLimit || 'Not specified'}</span></div>
                <div class="req-row"><span class="req-col-name">Marks:</span><span class="req-col-val">${asg.marks || 'Not specified'}</span></div>
                <div class="req-row"><span class="req-col-name">Presentation Required:</span><span class="req-col-val">${asg.presentationRequired || 'Not specified'}</span></div>
                <div class="req-row"><span class="req-col-name">Additional Instructions:</span><span class="req-col-val">${asg.additionalInstructions || 'Not specified'}</span></div>
              </div>
            </div>

            <!-- Expandable 3: Change History -->
            <div class="expandable-panel hidden" id="expand-history">
              <h4 class="expand-heading">Change History (LMS Audits)</h4>
              <div class="history-timeline">
                ${asg.history.map(h => `
                  <div class="history-item">
                    <span class="history-version">Version ${h.version}</span>
                    <span class="history-time">${h.timestamp}</span>
                    <p class="history-note">${h.note || `Deadline: ${h.deadline} • Format: ${h.format}`}</p>
                  </div>
                `).join('')}
              </div>
            </div>

            <div class="modal-footer-source">
              <span>Source: LMS Portal • Published by Faculty</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // =========================================================================
  // CALENDAR EVENT DETAIL MODAL
  // =========================================================================
  renderEventDetailModal(state) {
    if (!this.selectedEvent) return '';
    const ev = this.selectedEvent;

    return `
      <div class="modal-backdrop" id="event-modal-backdrop">
        <div class="modal-dialog-card modal-sm">
          <div class="modal-top-bar">
            <div>
              <span class="status-chip ${ev.color}">${ev.type.toUpperCase()}</span>
              <h3 class="modal-assignment-title">${ev.title}</h3>
            </div>
            <button class="btn-close-modal" id="btn-close-event-modal">✕</button>
          </div>

          <div class="modal-scroll-content">
            <div class="event-details-body">
              <p><strong>Date / Deadline:</strong> ${ev.date}</p>
              <p><strong>Estimated Effort:</strong> ${ev.workload}</p>
              <p><strong>Context:</strong> ${ev.description}</p>
            </div>

            <div class="modal-actions-right" style="margin-top: 20px;">
              <button class="btn btn-primary btn-sm btn-navigate-action" data-tab="${ev.targetTab}" data-id="${ev.targetId}">
                ${ev.actionLabel}
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // =========================================================================
  // INTERACTIVE PDF VIEWER MODAL
  // =========================================================================
  renderPdfViewerModal() {
    return `
      <div class="pdf-modal-backdrop" id="pdf-viewer-backdrop">
        <div class="pdf-viewer-dialog">
          <div class="pdf-viewer-toolbar">
            <div class="toolbar-left">
              <span class="pdf-document-title">${this.pdfTitle}</span>
              <span class="pdf-page-indicator">Page <span id="pdf-page-num">${this.pdfCurrentPage}</span> of <span id="pdf-total-pages">${this.pdfTotalPages}</span></span>
            </div>

            <div class="toolbar-center">
              <button class="btn-tool" id="btn-pdf-prev" title="Previous Page">◀ Previous</button>
              <button class="btn-tool" id="btn-pdf-next" title="Next Page">Next ▶</button>
              <button class="btn-tool" id="btn-pdf-zoom-out" title="Zoom Out">−</button>
              <button class="btn-tool" id="btn-pdf-zoom-in" title="Zoom In">+</button>
            </div>

            <div class="toolbar-right">
              <a href="${this.pdfUrl}" target="_blank" download class="btn btn-outline btn-xs" title="Download or open in new tab">Download</a>
              <button class="btn-close-modal" id="btn-close-pdf-modal" title="Close Viewer">✕</button>
            </div>
          </div>

          <div class="pdf-canvas-container" id="pdf-canvas-container">
            <canvas id="pdf-render-canvas"></canvas>
            <div id="pdf-fallback-container" style="display:none; width: 100%; height: 100%;">
              <iframe src="${this.pdfUrl}#page=${this.pdfCurrentPage}" style="width: 100%; height: 600px; border: none;"></iframe>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  initPdfViewer() {
    if (typeof window.pdfjsLib === 'undefined') {
      const fallback = document.getElementById('pdf-fallback-container');
      const canvas = document.getElementById('pdf-render-canvas');
      if (fallback && canvas) {
        canvas.style.display = 'none';
        fallback.style.display = 'block';
      }
      return;
    }

    window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

    window.pdfjsLib.getDocument(this.pdfUrl).promise.then(pdf => {
      this.pdfDoc = pdf;
      this.pdfTotalPages = pdf.numPages;
      const totalEl = document.getElementById('pdf-total-pages');
      if (totalEl) totalEl.innerText = this.pdfTotalPages;
      this.renderPdfPage(this.pdfCurrentPage);
    }).catch(err => {
      console.warn('PDF.js render fallback:', err);
      const fallback = document.getElementById('pdf-fallback-container');
      const canvas = document.getElementById('pdf-render-canvas');
      if (fallback && canvas) {
        canvas.style.display = 'none';
        fallback.style.display = 'block';
      }
    });
  }

  renderPdfPage(num) {
    if (!this.pdfDoc || this.renderingPdf) return;
    this.renderingPdf = true;

    this.pdfDoc.getPage(num).then(page => {
      const canvas = document.getElementById('pdf-render-canvas');
      if (!canvas) {
        this.renderingPdf = false;
        return;
      }
      const ctx = canvas.getContext('2d');
      const viewport = page.getViewport({ scale: this.pdfScale });

      canvas.height = viewport.height;
      canvas.width = viewport.width;

      const renderContext = {
        canvasContext: ctx,
        viewport: viewport
      };

      page.render(renderContext).promise.then(() => {
        this.renderingPdf = false;
        const pageNumEl = document.getElementById('pdf-page-num');
        if (pageNumEl) pageNumEl.innerText = num;
      });
    }).catch(() => {
      this.renderingPdf = false;
    });
  }

  // =========================================================================
  // CALENDAR EVENTS HELPER
  // =========================================================================
  getCalendarEvents(state) {
    return [
      {
        id: 'asg_dbms_3',
        title: 'DBMS Assignment 3',
        type: 'assignments',
        date: 'Wednesday, Oct 1, 5:00 PM',
        workload: '~1 hr',
        color: 'red',
        description: 'Deadline moved earlier from Friday. Submit ER diagram and SQL queries.',
        targetTab: 'assignments',
        targetId: 'asg_dbms_3',
        actionLabel: 'View Assignment'
      },
      {
        id: 'dsa_lab_p4',
        title: 'DSA Lab: Program 4',
        type: 'labs',
        date: 'Thursday, Oct 2',
        workload: '~45 min',
        color: 'orange',
        description: 'Prepare Singly Linked List operations from Lab Manual (Pages 11–19).',
        targetTab: 'lab',
        targetId: '4',
        actionLabel: 'Prepare Lab'
      },
      {
        id: 'asg_os_2',
        title: 'OS Tutorial 2',
        type: 'assignments',
        date: 'Monday, Oct 6, 11:59 PM',
        workload: '~1 hr',
        color: 'yellow',
        description: 'Bounded-buffer producer-consumer problem using semaphores.',
        targetTab: 'assignments',
        targetId: 'asg_os_2',
        actionLabel: 'View Assignment'
      },
      {
        id: 'asg_cn_1',
        title: 'CN Socket Programming',
        type: 'assignments',
        date: 'Friday, Oct 10, 5:00 PM',
        workload: '~2 hr',
        color: 'blue',
        description: 'TCP chat server with connection multiplexing using select().',
        targetTab: 'assignments',
        targetId: 'asg_cn_1',
        actionLabel: 'View Assignment'
      },
      {
        id: 'exam_dbms',
        title: 'DBMS Final Exam',
        type: 'exams',
        date: 'Tuesday, Oct 20, 10:00 AM',
        workload: '4 Topics',
        color: 'blue',
        description: 'Relational algebra, SQL, Normalization, Concurrency control.',
        targetTab: 'exams',
        targetId: 'exam_dbms',
        actionLabel: 'View Exam'
      },
      {
        id: 'exam_os',
        title: 'OS Final Exam',
        type: 'exams',
        date: 'Wednesday, Oct 28, 10:00 AM',
        workload: '4 Topics',
        color: 'blue',
        description: 'Processes, CPU scheduling, Deadlocks, Memory management.',
        targetTab: 'exams',
        targetId: 'exam_os',
        actionLabel: 'View Exam'
      }
    ];
  }

  // =========================================================================
  // EVENT BINDINGS
  // =========================================================================
  bindEvents() {
    if (!this.container) return;

    // Navigation tab switching
    this.container.querySelectorAll('.nav-tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        const targetTab = e.currentTarget.dataset.tab;
        if (targetTab) {
          this.activeTab = targetTab;
          this.render();
        }
      });
    });

    // In-page navigation actions
    this.container.querySelectorAll('.btn-navigate-action').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const tab = e.currentTarget.dataset.tab;
        const id = e.currentTarget.dataset.id;
        if (tab) {
          this.activeTab = tab;
          if (tab === 'assignments' && id) {
            this.selectedAssignmentId = id;
          }
          this.selectedEvent = null;
          this.render();
        }
      });
    });

    // Calendar Event click
    this.container.querySelectorAll('.cal-event').forEach(el => {
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        const evId = e.currentTarget.dataset.eventId;
        const allEvs = this.getCalendarEvents(this.store.getState());
        const found = allEvs.find(ev => ev.id === evId);
        if (found) {
          this.selectedEvent = found;
          this.render();
        }
      });
    });

    // Close Event Modal
    const btnCloseEvent = this.container.querySelector('#btn-close-event-modal');
    if (btnCloseEvent) {
      btnCloseEvent.addEventListener('click', () => {
        this.selectedEvent = null;
        this.render();
      });
    }

    // View Assignment button click
    this.container.querySelectorAll('.btn-view-assignment').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const asgId = e.currentTarget.dataset.id;
        if (asgId) {
          this.selectedAssignmentId = asgId;
          this.render();
        }
      });
    });

    // Close Assignment Modal
    const btnCloseAsg = this.container.querySelector('#btn-close-asg-modal');
    if (btnCloseAsg) {
      btnCloseAsg.addEventListener('click', () => {
        this.selectedAssignmentId = null;
        this.render();
      });
    }

    // Progressive disclosure in assignment modal
    this.container.querySelectorAll('.btn-toggle-expand').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const targetId = e.currentTarget.dataset.target;
        const panel = this.container.querySelector(`#${targetId}`);
        if (panel) {
          panel.classList.toggle('hidden');
          btn.classList.toggle('active');
        }
      });
    });

    // Adjust Workload control
    this.container.querySelectorAll('.btn-adjust-workload').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const asgId = e.currentTarget.dataset.id;
        const current = this.store.getState().assignments.find(a => a.id === asgId)?.estimatedWorkload || '~1 hr';
        const newVal = prompt(`Adjust workload estimate for this assignment:\nOptions: ~45 min, ~1 hr, ~1 hr 30 min, ~2 hr`, current);
        if (newVal && newVal.trim()) {
          this.store.adjustWorkload(asgId, newVal.trim());
        }
      });
    });

    // Mark project task as Done
    this.container.querySelectorAll('.btn-mark-done').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const projId = e.currentTarget.dataset.proj;
        const taskId = e.currentTarget.dataset.task;
        if (projId && taskId) {
          this.store.markProjectTaskDone(projId, taskId);
          this.render();
        }
      });
    });

    // Open Lab PDF Button
    this.container.querySelectorAll('.btn-open-lab-pdf').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const page = parseInt(e.currentTarget.dataset.page || '11', 10);
        this.pdfUrl = 'docs/Lab Manual 1-10 Programs.pdf';
        this.pdfTitle = 'Lab Manual 1-10 Programs.pdf';
        this.pdfCurrentPage = page;
        this.pdfModalOpen = true;
        this.render();
      });
    });

    // PDF Modal Close
    const btnClosePdf = this.container.querySelector('#btn-close-pdf-modal');
    if (btnClosePdf) {
      btnClosePdf.addEventListener('click', () => {
        this.pdfModalOpen = false;
        this.render();
      });
    }

    // PDF Page navigation controls
    const btnPdfPrev = this.container.querySelector('#btn-pdf-prev');
    if (btnPdfPrev) {
      btnPdfPrev.addEventListener('click', () => {
        if (this.pdfCurrentPage > 1) {
          this.pdfCurrentPage--;
          this.renderPdfPage(this.pdfCurrentPage);
        }
      });
    }

    const btnPdfNext = this.container.querySelector('#btn-pdf-next');
    if (btnPdfNext) {
      btnPdfNext.addEventListener('click', () => {
        if (this.pdfCurrentPage < this.pdfTotalPages) {
          this.pdfCurrentPage++;
          this.renderPdfPage(this.pdfCurrentPage);
        }
      });
    }

    const btnPdfZoomIn = this.container.querySelector('#btn-pdf-zoom-in');
    if (btnPdfZoomIn) {
      btnPdfZoomIn.addEventListener('click', () => {
        this.pdfScale += 0.2;
        this.renderPdfPage(this.pdfCurrentPage);
      });
    }

    const btnPdfZoomOut = this.container.querySelector('#btn-pdf-zoom-out');
    if (btnPdfZoomOut) {
      btnPdfZoomOut.addEventListener('click', () => {
        if (this.pdfScale > 0.6) {
          this.pdfScale -= 0.2;
          this.renderPdfPage(this.pdfCurrentPage);
        }
      });
    }

    // Copy Code button in Lab Prep
    this.container.querySelectorAll('.btn-copy-code').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const code = decodeURIComponent(e.currentTarget.dataset.code || '');
        if (navigator.clipboard) {
          navigator.clipboard.writeText(code).then(() => {
            const orig = btn.innerText;
            btn.innerText = 'Copied!';
            setTimeout(() => { btn.innerText = orig; }, 2000);
          });
        }
      });
    });

    // Calendar filter buttons
    this.container.querySelectorAll('.filter-pill').forEach(pill => {
      pill.addEventListener('click', (e) => {
        this.activeFilter = e.currentTarget.dataset.filter;
        this.render();
      });
    });
  }

  escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}

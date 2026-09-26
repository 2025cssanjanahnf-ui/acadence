/**
 * ACADENCE - Student Intelligence Platform Component
 * Tagline: FROM ACADEMIC INFORMATION TO ACTION
 * 
 * Provides the intelligent student decision engine:
 * 1. Top Summary Bar (Workload, Deadlines, Changes, Risks, Exam)
 * 2. What Needs Attention (Ranked by 10-factor Priority Engine with 'Why Prioritized')
 * 3. Academic Changes (Change Detection, Lost prep days, Why Plan Changed, Audit Log)
 * 4. Today's Action Plan (Capacity fitting, Buffer calculation, Interactive slider)
 * 5. Structured Requirements & Submission Checklist (Strict parsing, 'Not specified')
 * 6. Recurring Lab Prep (Announcement + PDF matching, Confidence scoring)
 * 7. Group Project Dependency Intelligence (Blameless risk propagation)
 * 8. Exam Planner (Study schedule distributed across days, assignment load balancing)
 * 9. Workload Spike Visualization (Daily hours & overlap explanations)
 * 10. Task Detail Page / Modal (Complete transparency & source tracking)
 */

export class AcadenceStudentComponent {
  constructor(store, aiEngine, containerId) {
    this.store = store;
    this.ai = aiEngine;
    this.container = document.getElementById(containerId);
    this.activeTab = 'dashboard'; // 'dashboard', 'plan', 'changes', 'tasks', 'lab', 'projects', 'exams', 'calendar'
    this.selectedTaskId = null;
    this.showNotifications = false;
  }

  render() {
    if (!this.container) return;
    const state = this.store.getState();

    // AI-derived views
    const todayPlan = this.ai.buildTodaysActionPlan(state);
    const projectRisks = this.ai.analyzeProjectRisks(state.projects);
    const labPrep = this.ai.generateLabPreparation(state.announcements, state.documents);
    const urgentChanges = state.changes.filter(c => c.field === 'Deadline' || c.priorityDelta?.includes('High'));
    const unreadNotifs = state.notifications.filter(n => n.unread).length;

    this.container.innerHTML = `
      <div class="acadence-wrapper">
        <!-- ACADENCE Main Top Navigation -->
        <header class="acadence-header">
          <div class="acadence-brand">
            <div class="logo-mark">
              <svg viewBox="0 0 24 24"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
            </div>
            <div>
              <div class="brand-title-wrap">
                <h1 class="brand-title">ACADENCE</h1>
                <span class="ai-chip">AI WORKLOAD INTELLIGENCE</span>
              </div>
              <p class="brand-tagline">FROM ACADEMIC INFORMATION TO ACTION</p>
            </div>
          </div>

          <div class="acadence-top-actions">
            <!-- Student Capacity Selector -->
            <div class="capacity-pill" title="Daily study capacity configured by student">
              <svg class="icon text-primary" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              <span>Capacity:</span>
              <input type="number" id="input-available-hours" min="1" max="16" step="0.5" value="${state.studentAvailableHours}" class="hours-input">
              <span>hrs/day</span>
            </div>

            <!-- Intelligent Notifications Bell -->
            <div class="notif-bell-wrap">
              <button class="btn-icon" id="btn-toggle-notifs" aria-label="Notifications">
                <svg class="icon" viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
                ${unreadNotifs > 0 ? `<span class="notif-badge">${unreadNotifs}</span>` : ''}
              </button>

              ${this.showNotifications ? this.renderNotificationsDropdown(state) : ''}
            </div>

            <!-- Generic User Identity -->
            <div class="user-profile-badge">
              <div class="avatar">S</div>
              <div class="user-meta">
                <span class="user-name">Student</span>
                <span class="user-role">Computer Science</span>
              </div>
            </div>
          </div>
        </header>

        <!-- ACADENCE Navigation Bar -->
        <nav class="acadence-nav" aria-label="Student Navigation">
          <button class="nav-btn ${this.activeTab === 'dashboard' ? 'active' : ''}" data-tab="dashboard">
            <svg class="icon" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
            Dashboard
          </button>
          <button class="nav-btn ${this.activeTab === 'plan' ? 'active' : ''}" data-tab="plan">
            <svg class="icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            Today's Plan
            <span class="badge-count">${todayPlan.tasks.length}</span>
          </button>
          <button class="nav-btn ${this.activeTab === 'changes' ? 'active' : ''}" data-tab="changes">
            <svg class="icon" viewBox="0 0 24 24"><path d="M23 4v6h-6"></path><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg>
            Academic Changes
            ${state.changes.length > 0 ? `<span class="badge-count pulse">${state.changes.length}</span>` : ''}
          </button>
          <button class="nav-btn ${this.activeTab === 'tasks' ? 'active' : ''}" data-tab="tasks">
            <svg class="icon" viewBox="0 0 24 24"><path d="M9 11l3 3L22 4"></path><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>
            Tasks & Checklists
          </button>
          <button class="nav-btn ${this.activeTab === 'lab' ? 'active' : ''}" data-tab="lab">
            <svg class="icon" viewBox="0 0 24 24"><path d="M10 2v7.31"></path><path d="M14 9.3V2"></path><path d="M8.5 2h7"></path><path d="M14 9.3a6.5 6.5 0 1 1-4 0"></path><path d="M5.52 16h12.96"></path></svg>
            Lab Prep
          </button>
          <button class="nav-btn ${this.activeTab === 'projects' ? 'active' : ''}" data-tab="projects">
            <svg class="icon" viewBox="0 0 24 24"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
            Projects & Risks
            ${projectRisks.length > 0 ? `<span class="badge-count alert-rose">!</span>` : ''}
          </button>
          <button class="nav-btn ${this.activeTab === 'exams' ? 'active' : ''}" data-tab="exams">
            <svg class="icon" viewBox="0 0 24 24"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
            Exam Planner
          </button>
          <button class="nav-btn ${this.activeTab === 'calendar' ? 'active' : ''}" data-tab="calendar">
            <svg class="icon" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
            Workload & Calendar
          </button>
        </nav>

        <!-- Main Content Area -->
        <main class="acadence-content">
          ${this.renderActiveTab(state, todayPlan, projectRisks, labPrep)}
        </main>

        <!-- Task Detail Modal -->
        ${this.selectedTaskId ? this.renderTaskDetailModal(state) : ''}
      </div>
    `;

    this.bindEvents();
  }

  renderActiveTab(state, todayPlan, projectRisks, labPrep) {
    switch (this.activeTab) {
      case 'dashboard':
        return this.renderDashboardView(state, todayPlan, projectRisks, labPrep);
      case 'plan':
        return this.renderPlanView(state, todayPlan);
      case 'changes':
        return this.renderChangesView(state);
      case 'tasks':
        return this.renderTasksView(state);
      case 'lab':
        return this.renderLabPrepView(state, labPrep);
      case 'projects':
        return this.renderProjectsView(state, projectRisks);
      case 'exams':
        return this.renderExamsView(state);
      case 'calendar':
        return this.renderCalendarView(state);
      default:
        return this.renderDashboardView(state, todayPlan, projectRisks, labPrep);
    }
  }

  // --- 1. DASHBOARD VIEW (PRIMARY SCREEN) ---
  renderDashboardView(state, todayPlan, projectRisks, labPrep) {
    return `
      <!-- Top Summary Metrics Strip -->
      <section class="metrics-strip">
        <div class="metric-card ${todayPlan.isOverloaded ? 'metric-card-warning' : ''}">
          <div class="metric-icon bg-indigo">
            <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
          </div>
          <div class="metric-data">
            <span class="metric-label">Today's Workload</span>
            <div class="metric-number">${todayPlan.totalEstimatedWorkloadStr}</div>
            <span class="metric-sub">${todayPlan.bufferStr} buffer (${todayPlan.availableHoursStr} max)</span>
          </div>
        </div>

        <div class="metric-card">
          <div class="metric-icon bg-sky">
            <svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
          </div>
          <div class="metric-data">
            <span class="metric-label">Active Assignments</span>
            <div class="metric-number">${state.assignments.length}</div>
            <span class="metric-sub">DBMS due next</span>
          </div>
        </div>

        <div class="metric-card ${state.changes.length > 0 ? 'metric-card-urgent' : ''}">
          <div class="metric-icon bg-amber">
            <svg viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
          </div>
          <div class="metric-data">
            <span class="metric-label">Urgent Academic Changes</span>
            <div class="metric-number">${state.changes.length}</div>
            <span class="metric-sub">${state.changes[0] ? state.changes[0].field + ' modified' : 'All schedules synced'}</span>
          </div>
        </div>

        <div class="metric-card ${projectRisks.length > 0 ? 'metric-card-danger' : ''}">
          <div class="metric-icon bg-rose">
            <svg viewBox="0 0 24 24"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
          </div>
          <div class="metric-data">
            <span class="metric-label">Project Risks</span>
            <div class="metric-number">${projectRisks.length}</div>
            <span class="metric-sub">${projectRisks[0] ? projectRisks[0].overdueTask + ' overdue' : 'On schedule'}</span>
          </div>
        </div>

        <div class="metric-card">
          <div class="metric-icon bg-violet">
            <svg viewBox="0 0 24 24"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
          </div>
          <div class="metric-data">
            <span class="metric-label">Upcoming Exam</span>
            <div class="metric-number">DBMS</div>
            <span class="metric-sub">Oct 20 • 4 topics remain</span>
          </div>
        </div>
      </section>

      <!-- URGENT ACADEMIC UPDATE BANNER (If Changes Detected) -->
      ${state.changes.length > 0 ? this.renderUrgentChangesBanner(state.changes) : ''}

      <!-- Core Intelligence Grid -->
      <div class="dashboard-grid">
        <!-- LEFT COLUMN: WHAT NEEDS ATTENTION & TODAY'S PLAN -->
        <div class="dash-col flex-3">
          <!-- WHAT NEEDS ATTENTION -->
          <section class="acadence-card card-attention">
            <div class="card-header">
              <div>
                <span class="badge-subtle badge-ai">AI PRIORITY ENGINE</span>
                <h3 class="section-title">What Needs Attention Now</h3>
              </div>
              <span class="priority-count">${todayPlan.tasks.length} High-Impact Items</span>
            </div>

            <div class="attention-list">
              ${todayPlan.tasks.slice(0, 3).map((task, idx) => `
                <div class="attention-item priority-${task.priority.toLowerCase()}">
                  <div class="item-ranking">${idx + 1}</div>
                  <div class="item-body">
                    <div class="item-top">
                      <span class="course-chip course-${task.course.toLowerCase().replace(/\\s+/g, '-')}">${task.course}</span>
                      <h4 class="item-title">${task.title}</h4>
                      <span class="item-duration">${task.durationStr}</span>
                    </div>

                    <!-- WHY THIS IS PRIORITIZED -->
                    <div class="why-prioritized-box">
                      <span class="why-label">
                        <svg class="icon-sm" viewBox="0 0 24 24"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
                        WHY THIS IS PRIORITIZED:
                      </span>
                      <p class="why-text">${task.whyPrioritized}</p>
                    </div>

                    <div class="item-footer">
                      <span class="text-muted text-xs">Deadline: <strong>${task.deadline}</strong></span>
                      <button class="btn btn-secondary btn-xs btn-open-task-detail" data-task-id="${task.sourceId}">
                        Inspect Requirements & Subtasks →
                      </button>
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>
          </section>

          <!-- TODAY'S ACTION PLAN (Interactive Checklist) -->
          <section class="acadence-card card-plan">
            <div class="card-header">
              <div>
                <span class="badge-subtle">OPTIMIZED EXECUTION</span>
                <h3 class="section-title">Today's Action Plan</h3>
              </div>
              <div class="capacity-indicator ${todayPlan.isOverloaded ? 'overloaded' : 'optimal'}">
                ${todayPlan.isOverloaded 
                  ? `<span class="icon-warn">⚠️</span> ${todayPlan.bufferStr}`
                  : `<span>✓ Optimal Capacity (${todayPlan.bufferStr} buffer)</span>`}
              </div>
            </div>

            <p class="card-desc">Personalized sequence calculated by balancing deadline urgency, workload estimation, and remaining study capacity.</p>

            <div class="action-tasks-checklist">
              ${todayPlan.tasks.map(task => `
                <div class="action-task-row ${task.completed ? 'task-done' : ''}">
                  <label class="custom-checkbox">
                    <input type="checkbox" class="chk-today-task" data-id="${task.id}" ${task.completed ? 'checked' : ''}>
                    <span class="checkmark"></span>
                  </label>
                  <div class="task-info">
                    <span class="task-name">${task.title}</span>
                    <span class="task-tags">
                      <span class="course-chip-mini">${task.course}</span>
                      <span class="task-est">Est: ${task.durationStr}</span>
                      <span class="task-dl">Due: ${task.deadline}</span>
                    </span>
                  </div>
                  <button class="btn-link-inspect btn-open-task-detail" data-task-id="${task.sourceId}">View Details</button>
                </div>
              `).join('')}
            </div>

            <div class="plan-summary-footer">
              <div class="summary-stat">
                <span class="stat-label">Total Workload</span>
                <span class="stat-value">${todayPlan.totalEstimatedWorkloadStr}</span>
              </div>
              <div class="summary-stat">
                <span class="stat-label">Available Capacity</span>
                <span class="stat-value">${todayPlan.availableHoursStr}</span>
              </div>
              <div class="summary-stat">
                <span class="stat-label">Buffer Window</span>
                <span class="stat-value ${todayPlan.isOverloaded ? 'text-rose' : 'text-emerald'}">${todayPlan.bufferStr}</span>
              </div>
            </div>
          </section>
        </div>

        <!-- RIGHT COLUMN: RISKS, LAB PREP & WORKLOAD SPIKES -->
        <div class="dash-col flex-2">
          <!-- PROJECT DEPENDENCY RISK CARD -->
          <section class="acadence-card card-risk">
            <div class="card-header">
              <div>
                <span class="badge-subtle badge-rose">DEPENDENCY INTELLIGENCE</span>
                <h4 class="section-title">Group Project Status</h4>
              </div>
            </div>

            ${projectRisks.length > 0 ? `
              <div class="risk-alert-box">
                <div class="risk-alert-title">
                  <svg class="icon-sm text-rose" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                  PROJECT RISK DETECTED
                </div>
                <p class="risk-blameless-msg">${projectRisks[0].blamelessAnalysis}</p>

                <div class="dependency-chain-diagram">
                  <span class="chain-label">Affected Downstream Chain:</span>
                  <div class="chain-nodes">
                    ${projectRisks[0].chain.map((node, i) => `
                      <span class="chain-node ${i === 0 ? 'node-overdue' : 'node-blocked'}">
                        ${node.split(' ')[0]}
                      </span>
                      ${i < projectRisks[0].chain.length - 1 ? '<span class="chain-arrow">↓</span>' : ''}
                    `).join('')}
                  </div>
                </div>

                <div class="risk-footer">
                  <span class="text-xs text-muted">Blameless risk analysis focusing on deliverable deadlines.</span>
                </div>
              </div>
            ` : `
              <div class="risk-clean-box">
                <span class="text-emerald">✓ All team dependency chains are currently on track.</span>
              </div>
            `}
          </section>

          <!-- LAB PREPARATION CARD -->
          <section class="acadence-card card-lab">
            <div class="card-header">
              <div>
                <span class="badge-subtle badge-cyan">RECURRING LAB WORK</span>
                <h4 class="section-title">Upcoming Lab Session</h4>
              </div>
              <span class="badge-confidence">${labPrep.confidence}</span>
            </div>

            <div class="lab-prep-box">
              <div class="lab-title-row">
                <span class="course-chip course-dbms">DBMS Lab</span>
                <h5 class="lab-experiment">Experiment ${labPrep.experimentNumber}: ${labPrep.topic}</h5>
              </div>

              <p class="text-muted text-xs">Estimated effort: <strong>${labPrep.estimatedEffort}</strong> • Source: <em>${labPrep.source}</em></p>

              <div class="lab-mini-checklist">
                ${labPrep.checklist.map(item => `
                  <div class="lab-chk-item">
                    <span class="bullet ${item.ready ? 'bullet-done' : 'bullet-pending'}"></span>
                    <span class="chk-label">${item.title}</span>
                  </div>
                `).join('')}
              </div>

              <button class="btn btn-secondary btn-sm w-100 mt-2 btn-nav-to-lab">
                Open Full Lab Preparation Blueprint →
              </button>
            </div>
          </section>

          <!-- WORKLOAD SPIKE HIGHLIGHT -->
          <section class="acadence-card card-workload-spike">
            <div class="card-header">
              <div>
                <span class="badge-subtle">WORKLOAD FORECAST</span>
                <h4 class="section-title">Weekly Load Distribution</h4>
              </div>
            </div>

            <div class="mini-workload-bars">
              <div class="bar-col">
                <div class="bar-fill" style="height: 40%;"><span>2.5h</span></div>
                <span class="bar-day">Mon</span>
              </div>
              <div class="bar-col">
                <div class="bar-fill" style="height: 60%;"><span>4.0h</span></div>
                <span class="bar-day">Tue</span>
              </div>
              <div class="bar-col spike">
                <div class="bar-fill" style="height: 95%;"><span>6.0h</span></div>
                <span class="bar-day">Wed</span>
              </div>
              <div class="bar-col">
                <div class="bar-fill" style="height: 50%;"><span>3.0h</span></div>
                <span class="bar-day">Thu</span>
              </div>
              <div class="bar-col">
                <div class="bar-fill" style="height: 35%;"><span>2.0h</span></div>
                <span class="bar-day">Fri</span>
              </div>
            </div>

            <div class="spike-explanation">
              <span class="spike-flag">⚠️ Workload Spike on Wednesday:</span>
              <p class="spike-text">Wednesday has a heavy 6-hour workload because <strong>DBMS Assignment 3</strong> and <strong>OS Tutorial</strong> overlap. ACADENCE has shifted preparatory tasks into today's action plan to prevent cramming.</p>
            </div>
          </section>
        </div>
      </div>
    `;
  }

  // --- URGENT CHANGES BANNER ---
  renderUrgentChangesBanner(changes) {
    const latestChange = changes[0];
    return `
      <section class="urgent-banner">
        <div class="urgent-banner-inner">
          <div class="urgent-badge-col">
            <span class="badge-urgent-pulse">URGENT ACADEMIC UPDATE</span>
          </div>
          <div class="urgent-content-col">
            <div class="urgent-header-row">
              <h3 class="urgent-title">${latestChange.taskTitle} (${latestChange.courseName})</h3>
              <span class="urgent-time">Detected: ${latestChange.detectedAt}</span>
            </div>

            <div class="change-diff-pill-row">
              <div class="diff-pill">
                <span class="diff-field">${latestChange.field}:</span>
                <span class="diff-old">${latestChange.oldValue}</span>
                <span class="diff-arrow">→</span>
                <span class="diff-new">${latestChange.newValue}</span>
              </div>
              <div class="diff-pill impact-pill">
                <span class="diff-field">Impact:</span>
                <span class="diff-impact">${latestChange.impact}</span>
              </div>
              <div class="diff-pill priority-pill">
                <span class="diff-field">Priority Shift:</span>
                <span class="diff-priority">${latestChange.priorityDelta}</span>
              </div>
            </div>

            <div class="why-plan-changed">
              <strong>Why this changed your plan:</strong> ${latestChange.whyItChangedPlan}
            </div>
          </div>
        </div>
      </section>
    `;
  }

  // --- 2. TODAY'S PLAN VIEW ---
  renderPlanView(state, todayPlan) {
    return `
      <div class="acadence-view-header">
        <div>
          <span class="badge-subtle badge-ai">REAL-TIME SCHEDULE SYNTHESIS</span>
          <h2>Today's Action Plan</h2>
          <p class="text-muted">A realistic, capacity-fitted action schedule that avoids wishful thinking.</p>
        </div>
        <div class="capacity-controls">
          <label for="slider-capacity" class="text-sm font-semibold">Adjust Available Hours Today:</label>
          <div class="slider-wrap">
            <input type="range" id="slider-capacity" min="1" max="10" step="0.5" value="${state.studentAvailableHours}">
            <span class="slider-val" id="capacity-val-display">${state.studentAvailableHours} hours</span>
          </div>
        </div>
      </div>

      <div class="plan-metrics-row">
        <div class="plan-metric-box">
          <span class="label">Total Workload Needed</span>
          <span class="value">${todayPlan.totalEstimatedWorkloadStr}</span>
        </div>
        <div class="plan-metric-box">
          <span class="label">Your Study Capacity</span>
          <span class="value">${todayPlan.availableHoursStr}</span>
        </div>
        <div class="plan-metric-box ${todayPlan.isOverloaded ? 'stat-danger' : 'stat-good'}">
          <span class="label">Buffer / Slack</span>
          <span class="value">${todayPlan.bufferStr}</span>
        </div>
      </div>

      <div class="capacity-alert-banner ${todayPlan.isOverloaded ? 'alert-danger' : 'alert-info'}">
        <svg class="icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
        <span>${todayPlan.capacityRecommendation}</span>
      </div>

      <div class="plan-tasks-detailed-list">
        ${todayPlan.tasks.map((task, i) => `
          <div class="plan-task-card ${task.completed ? 'task-done' : ''}">
            <div class="task-num">${i + 1}</div>
            <div class="task-main">
              <div class="task-header-row">
                <span class="course-chip course-${task.course.toLowerCase().replace(/\\s+/g, '-')}">${task.course}</span>
                <h4 class="task-heading">${task.title}</h4>
                <span class="duration-badge">${task.durationStr}</span>
              </div>

              <div class="why-box">
                <span class="why-tag">AI Rationale:</span>
                <span class="why-desc">${task.whyPrioritized}</span>
              </div>

              <div class="task-action-row">
                <span class="text-xs text-muted">Deadline: <strong>${task.deadline}</strong></span>
                <div class="button-group">
                  <button class="btn btn-secondary btn-xs btn-open-task-detail" data-task-id="${task.sourceId}">
                    View Requirements & Submission Checklist
                  </button>
                  <label class="toggle-btn-label">
                    <input type="checkbox" class="chk-today-task" data-id="${task.id}" ${task.completed ? 'checked' : ''}>
                    <span>${task.completed ? 'Completed' : 'Mark Done'}</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  // --- 3. ACADEMIC CHANGES VIEW ---
  renderChangesView(state) {
    return `
      <div class="acadence-view-header">
        <div>
          <span class="badge-subtle badge-amber">AUDIT LOG & CHANGE DETECTION</span>
          <h2>Academic Change History</h2>
          <p class="text-muted">ACADENCE continuously monitors virtual LMS feeds to isolate changes in deadlines, formats, and instructions.</p>
        </div>
      </div>

      ${state.changes.length === 0 ? `
        <div class="empty-state-card">
          <svg class="icon-lg text-muted" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 14 14"></polyline></svg>
          <h4>No Academic Changes Detected Yet</h4>
          <p class="text-muted">Head to the <strong>Virtual LMS (Left Pane)</strong> and edit an assignment's deadline or format to see real-time diffing and impact analysis!</p>
        </div>
      ` : `
        <div class="changes-timeline">
          ${state.changes.map(chg => `
            <div class="timeline-entry">
              <div class="timeline-marker"></div>
              <div class="timeline-card">
                <div class="timeline-card-header">
                  <div>
                    <span class="badge-urgent-tag">${chg.badge}</span>
                    <h4 class="chg-title">${chg.taskTitle} (${chg.courseName})</h4>
                  </div>
                  <span class="text-muted text-xs">Detected: ${chg.detectedAt}</span>
                </div>

                <div class="chg-diff-table-wrap">
                  <table class="diff-table">
                    <thead>
                      <tr>
                        <th>Parameter</th>
                        <th>Previous Value</th>
                        <th>New Broadcast Value</th>
                        <th>Impact on Your Schedule</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td><strong>${chg.field}</strong></td>
                        <td class="diff-cell-old"><del>${chg.oldValue}</del></td>
                        <td class="diff-cell-new"><strong>${chg.newValue}</strong></td>
                        <td class="diff-cell-impact">${chg.impact}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div class="chg-rationale-box">
                  <span class="rationale-label">Why This Changed Your Plan:</span>
                  <p class="rationale-text">${chg.whyItChangedPlan}</p>
                </div>

                <div class="chg-footer">
                  <span class="text-xs text-muted">Source: <strong>${chg.source}</strong> • Version: <strong>${chg.version}</strong></span>
                  <button class="btn btn-secondary btn-xs btn-open-task-detail" data-task-id="${chg.assignmentId}">
                    Inspect Updated Task Checklist →
                  </button>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      `}
    `;
  }

  // --- 4. TASKS & CHECKLISTS VIEW ---
  renderTasksView(state) {
    const comparisons = this.ai.getDeadlineVsWorkloadComparison(state);

    return `
      <div class="acadence-view-header">
        <div>
          <span class="badge-subtle badge-indigo">STRUCTURED WORKLOAD</span>
          <h2>My Tasks & Checklists</h2>
          <p class="text-muted">Structured academic requirements extracted without hallucination.</p>
        </div>
      </div>

      <!-- DEADLINE != WORKLOAD CONTRAST COMPONENT -->
      <section class="contrast-banner">
        <div class="contrast-header">
          <span class="badge-subtle">ACADENCE CORE INSIGHT</span>
          <h3>DEADLINE ≠ WORKLOAD</h3>
          <p class="text-muted text-sm">A short deadline does not always mean urgent effort; a distant deadline with massive effort requires immediate action.</p>
        </div>

        <div class="contrast-cards-grid">
          ${comparisons.map(c => `
            <div class="contrast-card">
              <div class="contrast-top">
                <span class="contrast-name">${c.taskName}</span>
                <span class="contrast-badge" style="background: ${c.urgencyColor}20; color: ${c.urgencyColor}; border: 1px solid ${c.urgencyColor}40;">
                  Due in ${c.daysAway} day${c.daysAway > 1 ? 's' : ''}
                </span>
              </div>
              <div class="contrast-metrics">
                <div>
                  <span class="c-label">Official Deadline:</span>
                  <span class="c-val">${c.deadline}</span>
                </div>
                <div>
                  <span class="c-label">Estimated Workload:</span>
                  <span class="c-val font-bold">${c.workload}</span>
                </div>
              </div>
              <p class="contrast-insight">${c.insight}</p>
            </div>
          `).join('')}
        </div>
      </section>

      <!-- Assignments List -->
      <div class="tasks-master-list">
        ${state.assignments.map(asg => {
          const reqs = this.ai.extractRequirements(asg);
          const checklist = this.ai.generateChecklist(asg);
          const workload = this.ai.getWorkloadBreakdown('assignment', asg.title, asg.courseName);

          return `
            <div class="acadence-card task-master-card" id="task-card-${asg.id}">
              <div class="task-card-header">
                <div>
                  <span class="course-chip course-${asg.courseName.toLowerCase().replace(/\\s+/g, '-')}">${asg.courseName}</span>
                  <h3 class="task-title-lg">${asg.title}</h3>
                </div>
                <div class="task-badges">
                  <span class="badge-workload">Estimated: ${workload.rangeStr}</span>
                  <span class="badge-deadline highlight">Due: ${asg.deadline}</span>
                </div>
              </div>

              <!-- EXTRACTED REQUIREMENTS TABLE -->
              <div class="req-table-wrap">
                <span class="table-title">Structured Requirements (AI Extracted from LMS):</span>
                <table class="acadence-table">
                  <thead>
                    <tr>
                      <th>Deadline</th>
                      <th>Format</th>
                      <th>Page Limit</th>
                      <th>Submission Destination</th>
                      <th>Mode</th>
                      <th>Presentation</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><strong>${reqs.deadline}</strong></td>
                      <td><span class="badge-subtle">${reqs.format}</span></td>
                      <td>${reqs.pageLimit}</td>
                      <td>${reqs.submissionLocation}</td>
                      <td>${reqs.isIndividual}</td>
                      <td>${reqs.presentationRequired}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- INTERACTIVE SUBMISSION CHECKLIST -->
              <div class="checklist-section">
                <span class="checklist-title">Submission Verification Checklist:</span>
                <div class="checklist-grid">
                  ${checklist.map(item => `
                    <label class="checklist-item">
                      <input type="checkbox" class="chk-task-item" data-id="${item.id}" ${state.checklistState[item.id] ? 'checked' : ''}>
                      <span class="item-text">${item.text}</span>
                      <span class="item-cat">${item.category}</span>
                    </label>
                  `).join('')}
                </div>
              </div>

              <!-- SUBTASK BREAKDOWN -->
              <div class="subtasks-accordion">
                <span class="subtasks-label">Recommended Step-by-Step Subtasks:</span>
                <div class="subtask-chips">
                  ${workload.subtasks.map(st => `
                    <div class="subtask-chip">
                      <span class="st-name">${st.name}</span>
                      <span class="st-duration">${st.duration}</span>
                    </div>
                  `).join('')}
                </div>
              </div>

              <div class="task-card-footer">
                <span class="text-muted text-xs">Source: <strong>${reqs.source}</strong> • Confidence: <strong>${reqs.confidence}</strong></span>
                <button class="btn btn-secondary btn-sm btn-open-task-detail" data-task-id="${asg.id}">
                  Open Task Details & Change Log →
                </button>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  // --- 5. LAB PREPARATION VIEW ---
  renderLabPrepView(state, labPrep) {
    const matchedDoc = labPrep.matchedDocument;
    const docConfidence = matchedDoc 
      ? this.ai.evaluateDocumentRelevance(matchedDoc, 'DBMS', state.announcements[0]) 
      : null;

    return `
      <div class="acadence-view-header">
        <div>
          <span class="badge-subtle badge-cyan">LAB INTELLIGENCE</span>
          <h2>Recurring Lab Preparation Blueprint</h2>
          <p class="text-muted">Synthesizes faculty lab announcements with uploaded lab manuals to build actionable pre-lab preparation.</p>
        </div>
      </div>

      <div class="lab-blueprint-card">
        <div class="lab-blueprint-header">
          <div>
            <span class="course-chip course-dbms">${labPrep.course} Practical Session</span>
            <h3 class="lab-title">Experiment ${labPrep.experimentNumber}: ${labPrep.topic}</h3>
            <span class="text-muted text-sm">Estimated Preparation Effort: <strong>${labPrep.estimatedEffort}</strong></span>
          </div>
          <div class="confidence-badge-box">
            <span class="conf-title">Relevance Confidence:</span>
            <span class="conf-val">${labPrep.confidence}</span>
          </div>
        </div>

        <div class="lab-sources-strip">
          <div class="source-item">
            <span class="src-icon">📢</span>
            <div>
              <span class="src-label">Faculty Announcement Context:</span>
              <p class="src-val">${state.announcements[0]?.content || 'DBMS Lab scheduled for Experiment 4'}</p>
            </div>
          </div>
          <div class="source-item">
            <span class="src-icon">📄</span>
            <div>
              <span class="src-label">Matched Laboratory Manual:</span>
              <p class="src-val">${matchedDoc ? matchedDoc.filename : 'DBMS Lab Experiment 4.pdf'}</p>
            </div>
          </div>
        </div>

        <!-- DOCUMENT RELEVANCE COMPARISON -->
        <div class="relevance-comparison-box">
          <span class="rc-title">Document Intelligence & Context Filtering:</span>
          <p class="text-xs text-muted mb-2">ACADENCE does not blindly apply every PDF. Relevance is evaluated against current course syllabus, announcements, and lab numbers:</p>

          <div class="relevance-list">
            ${state.documents.map(doc => {
              const evalRes = this.ai.evaluateDocumentRelevance(doc, 'DBMS', state.announcements[0]);
              return `
                <div class="relevance-item ${evalRes.tag.toLowerCase()}">
                  <div class="rel-top">
                    <span class="rel-filename">${doc.filename}</span>
                    <span class="rel-score-badge">${evalRes.label}</span>
                  </div>
                  <p class="rel-rationale">${evalRes.rationale}</p>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- ACTIONABLE LAB PREPARATION CHECKLIST -->
        <div class="lab-checklist-master">
          <span class="master-chk-title">Mandatory Pre-Lab Deliverables Checklist:</span>
          <div class="lab-deliverables-grid">
            ${labPrep.checklist.map(item => `
              <div class="lab-deliverable-card">
                <div class="del-header">
                  <label class="custom-checkbox">
                    <input type="checkbox" class="chk-lab-item" data-id="lab_dbms_${item.key}" ${state.checklistState[`lab_dbms_${item.key}`] ? 'checked' : ''}>
                    <span class="checkmark"></span>
                  </label>
                  <span class="del-title">${item.title}</span>
                </div>
                <p class="del-detail">${item.detail}</p>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  // --- 6. PROJECTS & RISKS VIEW ---
  renderProjectsView(state, projectRisks) {
    const project = state.projects[0];

    return `
      <div class="acadence-view-header">
        <div>
          <span class="badge-subtle badge-rose">DEPENDENCY INTELLIGENCE</span>
          <h2>Group Project Dependency Chains</h2>
          <p class="text-muted">Tracks upstream deliverables and identifies project risk without assigning blame.</p>
        </div>
      </div>

      <!-- BLAMELESS RISK CALLOUT -->
      ${projectRisks.length > 0 ? `
        <div class="blameless-alert-card">
          <div class="alert-icon-col">
            <svg class="icon-lg text-rose" viewBox="0 0 24 24"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
          </div>
          <div class="alert-body-col">
            <div class="alert-title-row">
              <span class="badge-urgent-tag">PROJECT RISK DETECTED</span>
              <h4>Critical Path Interruption in ${project.title}</h4>
            </div>
            <p class="alert-explanation">
              <strong>${projectRisks[0].overdueTask}</strong> is currently overdue. In a sequential dependency workflow, downstream milestones cannot begin until earlier dependencies are complete.
            </p>

            <div class="visual-chain-flow">
              <span class="chain-header">Downstream Ripple Effect:</span>
              <div class="flow-nodes">
                ${projectRisks[0].chain.map((taskName, idx) => `
                  <div class="flow-node ${idx === 0 ? 'overdue' : 'blocked'}">
                    <span class="node-order">Stage ${idx + 1}</span>
                    <span class="node-name">${taskName}</span>
                    <span class="node-status">${idx === 0 ? 'OVERDUE' : 'BLOCKED'}</span>
                  </div>
                  ${idx < projectRisks[0].chain.length - 1 ? '<div class="flow-connector">→</div>' : ''}
                `).join('')}
              </div>
            </div>

            <div class="blameless-recommendation">
              <strong>ACADENCE Actionable Recommendation:</strong> Notify relevant team members. Reallocate non-dependent tasks (such as initial CSS styling and boilerplate documentation) while the root schema deliverable is completed.
            </div>
          </div>
        </div>
      ` : `
        <div class="blameless-clean-card">
          <span class="text-emerald">✓ All team tasks are progressing within expected dependency windows.</span>
        </div>
      `}

      <!-- Project Tasks Detail Board -->
      <div class="project-board-card">
        <div class="project-board-header">
          <div>
            <span class="course-chip course-web-development">${project.courseName}</span>
            <h3>${project.title}</h3>
            <span class="text-muted text-sm">Team: ${project.teamName} • Members: ${project.teamMembers.join(', ')}</span>
          </div>
        </div>

        <div class="project-tasks-grid">
          ${project.tasks.map(task => `
            <div class="proj-task-card ${task.status}">
              <div class="proj-card-top">
                <span class="task-status-tag ${task.status}">${task.status.toUpperCase()}</span>
                <span class="task-owner">Owner: <strong>${task.owner}</strong></span>
              </div>
              <h4 class="proj-task-title">${task.name}</h4>
              <div class="proj-task-meta">
                <span>Deadline: <strong>${task.deadline}</strong></span>
                <span>Workload: <strong>${task.estimatedHours}h</strong></span>
              </div>
              <div class="proj-task-deps">
                ${task.dependsOn.length > 0
                  ? `<span class="text-xs text-muted">Depends on: <em>${task.dependsOn.map(d => project.tasks.find(t => t.id === d)?.name).join(', ')}</em></span>`
                  : '<span class="text-xs text-muted">No upstream dependency</span>'}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // --- 7. EXAM PLANNER VIEW ---
  renderExamsView(state) {
    const exam = state.exams[0];
    const studyPlan = this.ai.generateExamStudyPlan(exam, state.assignments);

    return `
      <div class="acadence-view-header">
        <div>
          <span class="badge-subtle badge-violet">EXAM INTELLIGENCE</span>
          <h2>AI Exam Planner & Topic Balancer</h2>
          <p class="text-muted">Distributes revision modules across available days while dynamically adjusting for assignment submission spikes.</p>
        </div>
      </div>

      <div class="exam-planner-master-card">
        <div class="planner-header">
          <div>
            <span class="course-chip course-dbms">${studyPlan.subject} (CS301)</span>
            <h3 class="exam-title">${studyPlan.subject} Final Examination</h3>
            <span class="exam-target-date">Official Exam Date: <strong>${studyPlan.examDate}</strong></span>
          </div>
          <div class="study-stats-pill">
            <span class="stat-h">${studyPlan.totalRemainingHours} Hours</span>
            <span class="stat-sub">Total Study Needed</span>
          </div>
        </div>

        <p class="strategy-banner">${studyPlan.strategyNote}</p>

        <!-- DAY-BY-DAY DISTRIBUTED STUDY SCHEDULE -->
        <div class="exam-topics-timeline">
          ${studyPlan.topics.map(topic => `
            <div class="study-day-card ${topic.status}">
              <div class="day-col">
                <span class="day-badge">${topic.targetDate}</span>
                <span class="day-status-label">${topic.status.toUpperCase()}</span>
              </div>
              <div class="topic-col">
                <h4 class="topic-name">${topic.name}</h4>
                <p class="workload-note">${topic.workloadNote}</p>
                ${topic.overlappingAssignment ? `
                  <div class="overlap-warning-pill">
                    ⚠️ Assignment Overlap: <strong>${topic.overlappingAssignment}</strong> due today. Study load reduced.
                  </div>
                ` : ''}
              </div>
              <div class="hours-col">
                <span class="hours-val">${topic.effectiveHours}h</span>
                <span class="hours-label">Study Allocation</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // --- 8. WORKLOAD & CALENDAR VIEW ---
  renderCalendarView(state) {
    return `
      <div class="acadence-view-header">
        <div>
          <span class="badge-subtle badge-indigo">TEMPORAL INTELLIGENCE</span>
          <h2>Academic Calendar & Workload Spikes</h2>
          <p class="text-muted">Synchronized view of assignments, exams, recurring labs, and team project milestones.</p>
        </div>
      </div>

      <!-- WORKLOAD SPIKE EXPLANATION CARD -->
      <div class="workload-explanation-card">
        <div class="card-header">
          <div>
            <span class="badge-subtle badge-amber">SPIKE DETECTION</span>
            <h4>Workload Distribution Analysis</h4>
          </div>
        </div>

        <div class="full-workload-bars">
          <div class="workload-bar-item">
            <div class="bar-track"><div class="bar-progress" style="height: 35%;"><span>2.5h</span></div></div>
            <span class="bar-label">Mon, Oct 14</span>
          </div>
          <div class="workload-bar-item">
            <div class="bar-track"><div class="bar-progress" style="height: 55%;"><span>4.0h</span></div></div>
            <span class="bar-label">Tue, Oct 15</span>
          </div>
          <div class="workload-bar-item spike-highlight">
            <div class="bar-track"><div class="bar-progress spike-fill" style="height: 90%;"><span>6.0h</span></div></div>
            <span class="bar-label">Wed, Oct 16</span>
          </div>
          <div class="workload-bar-item">
            <div class="bar-track"><div class="bar-progress" style="height: 45%;"><span>3.0h</span></div></div>
            <span class="bar-label">Thu, Oct 17</span>
          </div>
          <div class="workload-bar-item">
            <div class="bar-track"><div class="bar-progress" style="height: 30%;"><span>2.0h</span></div></div>
            <span class="bar-label">Fri, Oct 18</span>
          </div>
        </div>

        <div class="spike-alert-box">
          <strong>Why Wednesday Spikes to 6.0 Hours:</strong>
          <p>The deadline for <strong>DBMS Assignment 3</strong> moved to Wednesday, colliding directly with the scheduled <strong>OS Tutorial</strong> review session. ACADENCE reallocated foundational subtasks into Tuesday to flatten this surge.</p>
        </div>
      </div>

      <!-- ACADEMIC CALENDAR GRID -->
      <div class="academic-calendar-card">
        <div class="calendar-header-row">
          <h3>October 2026 Academic Schedule</h3>
          <div class="legend-strip">
            <span class="legend-item"><span class="dot asg"></span> Assignments</span>
            <span class="legend-item"><span class="dot exam"></span> Exams</span>
            <span class="legend-item"><span class="dot lab"></span> Labs</span>
            <span class="legend-item"><span class="dot proj"></span> Projects</span>
          </div>
        </div>

        <div class="calendar-grid">
          <div class="cal-day-header">Mon</div>
          <div class="cal-day-header">Tue</div>
          <div class="cal-day-header">Wed</div>
          <div class="cal-day-header">Thu</div>
          <div class="cal-day-header">Fri</div>
          <div class="cal-day-header">Sat</div>
          <div class="cal-day-header">Sun</div>

          <!-- Calendar Days -->
          <div class="cal-cell muted">12</div>
          <div class="cal-cell muted">13</div>
          <div class="cal-cell">
            <span class="cell-num">14</span>
            <div class="event-pill lab">DBMS Lab (Exp 4)</div>
          </div>
          <div class="cal-cell">
            <span class="cell-num">15</span>
            <div class="event-pill study">DBMS Exam Prep: ER Model</div>
          </div>
          <div class="cal-cell highlight-cell">
            <span class="cell-num">16</span>
            <div class="event-pill asg urgent">DBMS Asg 3 Due (5 PM)</div>
            <div class="event-pill study">DBMS Exam Prep: SQL</div>
          </div>
          <div class="cal-cell">
            <span class="cell-num">17</span>
            <div class="event-pill asg">OS Tutorial Due</div>
          </div>
          <div class="cal-cell">
            <span class="cell-num">18</span>
            <div class="event-pill proj">Web App Testing Milestone</div>
          </div>

          <div class="cal-cell">
            <span class="cell-num">19</span>
            <div class="event-pill study">Final Exam PYQ Revision</div>
          </div>
          <div class="cal-cell exam-sitting-cell">
            <span class="cell-num">20</span>
            <div class="event-pill exam">DBMS Final Exam (10 AM)</div>
          </div>
          <div class="cal-cell"><span class="cell-num">21</span></div>
          <div class="cal-cell">
            <span class="cell-num">22</span>
            <div class="event-pill study">OS Prep: Threads</div>
          </div>
          <div class="cal-cell"><span class="cell-num">23</span></div>
          <div class="cal-cell"><span class="cell-num">24</span></div>
          <div class="cal-cell"><span class="cell-num">25</span></div>
        </div>
      </div>
    `;
  }

  // --- 9. NOTIFICATIONS DROPDOWN ---
  renderNotificationsDropdown(state) {
    return `
      <div class="notifs-dropdown" id="notifs-dropdown-menu">
        <div class="notifs-header">
          <h4>Intelligent Academic Alerts</h4>
          <button class="btn-text-link" id="btn-mark-all-read">Mark all read</button>
        </div>
        <div class="notifs-list">
          ${state.notifications.length === 0 ? `
            <div class="p-3 text-muted text-center text-xs">No active notifications</div>
          ` : state.notifications.map(n => `
            <div class="notif-item ${n.unread ? 'unread' : ''}">
              <div class="notif-top">
                <span class="notif-tag notif-tag-${n.type}">${n.title}</span>
                <span class="notif-time">${n.timestamp}</span>
              </div>
              <p class="notif-msg">${n.message}</p>
              <span class="notif-source text-xs text-muted">Source: ${n.source}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // --- 10. TASK DETAIL MODAL ---
  renderTaskDetailModal(state) {
    const asg = state.assignments.find(a => a.id === this.selectedTaskId);
    if (!asg) return '';

    const reqs = this.ai.extractRequirements(asg);
    const checklist = this.ai.generateChecklist(asg);
    const workload = this.ai.getWorkloadBreakdown('assignment', asg.title, asg.courseName);
    const customHours = state.customWorkloadEstimates[asg.id] || workload.avgHours;

    return `
      <div class="modal-backdrop" id="modal-task-detail">
        <div class="modal-container modal-lg">
          <div class="modal-header">
            <div>
              <span class="course-chip course-${asg.courseName.toLowerCase().replace(/\\s+/g, '-')}">${asg.courseName}</span>
              <h3>${asg.title}</h3>
            </div>
            <button class="btn-close" id="btn-close-task-modal">&times;</button>
          </div>

          <div class="modal-body">
            <!-- Top Parameter Matrix -->
            <div class="detail-param-matrix">
              <div class="dp-box">
                <span class="dp-label">Official Deadline</span>
                <span class="dp-val highlight">${asg.deadline}</span>
              </div>
              <div class="dp-box">
                <span class="dp-label">Estimated Workload</span>
                <span class="dp-val">${workload.rangeStr}</span>
              </div>
              <div class="dp-box">
                <span class="dp-label">Priority Tier</span>
                <span class="dp-val priority-high">High</span>
              </div>
              <div class="dp-box">
                <span class="dp-label">Submission Format</span>
                <span class="dp-val">${asg.submissionFormat}</span>
              </div>
            </div>

            <!-- WHY IT MATTERS -->
            <div class="why-it-matters-card">
              <span class="wim-label">WHY THIS MATTERS:</span>
              <p class="wim-text">
                ${asg.version > 1 
                  ? `Deadline was moved earlier by faculty to ${asg.deadline}. With an estimated effort of ${workload.rangeStr}, deferring this task will create an unmanageable bottleneck alongside your upcoming exam preparation.`
                  : `Core academic deliverable with multiple required technical sections. Requires systematic staging across several study blocks.`}
              </p>
            </div>

            <!-- EXTRACTED REQUIREMENTS -->
            <div class="detail-section">
              <h4 class="section-subheading">Strict Requirement Extraction (Zero Guessing):</h4>
              <div class="req-chips-grid">
                <div class="req-chip-item">
                  <span class="rc-label">Required Sections:</span>
                  <span class="rc-val">${reqs.requiredSections.join(' • ')}</span>
                </div>
                <div class="req-chip-item">
                  <span class="rc-label">Page Limit:</span>
                  <span class="rc-val">${reqs.pageLimit}</span>
                </div>
                <div class="req-chip-item">
                  <span class="rc-label">Submission Location:</span>
                  <span class="rc-val">${reqs.submissionLocation}</span>
                </div>
                <div class="req-chip-item">
                  <span class="rc-label">Presentation Required:</span>
                  <span class="rc-val">${reqs.presentationRequired}</span>
                </div>
              </div>
            </div>

            <!-- SUBMISSION CHECKLIST -->
            <div class="detail-section">
              <h4 class="section-subheading">Actionable Submission Checklist:</h4>
              <div class="detail-checklist-grid">
                ${checklist.map(item => `
                  <label class="checklist-row-item">
                    <input type="checkbox" class="chk-task-item" data-id="${item.id}" ${state.checklistState[item.id] ? 'checked' : ''}>
                    <span class="chk-text">${item.text}</span>
                    <span class="chk-category">${item.category}</span>
                  </label>
                `).join('')}
              </div>
            </div>

            <!-- EDITABLE WORKLOAD ESTIMATION -->
            <div class="detail-section">
              <div class="d-flex justify-between align-center mb-2">
                <h4 class="section-subheading">AI Subtask Decomposition:</h4>
                <div class="edit-estimate-inline">
                  <span class="text-xs text-muted">Your Custom Estimate:</span>
                  <input type="number" id="input-edit-task-hours" step="0.5" min="1" max="20" value="${customHours}" class="hours-mini-input">
                  <span class="text-xs">hours</span>
                  <button class="btn btn-secondary btn-xs" id="btn-save-custom-estimate" data-id="${asg.id}">Save</button>
                </div>
              </div>

              <div class="detail-subtasks-table">
                ${workload.subtasks.map(st => `
                  <div class="subtask-row">
                    <span class="st-title">${st.name}</span>
                    <span class="st-time">${st.duration}</span>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- AUDIT & CHANGE HISTORY -->
            <div class="detail-section">
              <h4 class="section-subheading">Audit History & LMS Versioning:</h4>
              <div class="history-list">
                ${asg.history.map(h => `
                  <div class="history-entry">
                    <span class="h-version">Version ${h.version}</span>
                    <span class="h-details">Deadline: <strong>${h.deadline}</strong> • Format: <strong>${h.format}</strong></span>
                    <span class="h-meta">${h.timestamp} via ${h.source}</span>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <span class="text-xs text-muted">Source: ${reqs.source} • Confidence: ${reqs.confidence}</span>
            <button class="btn btn-secondary" id="btn-dismiss-task-modal">Close</button>
          </div>
        </div>
      </div>
    `;
  }

  bindEvents() {
    // Nav tabs
    this.container.querySelectorAll('.nav-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.activeTab = e.currentTarget.dataset.tab;
        this.render();
      });
    });

    // Capacity input
    const inputHours = this.container.querySelector('#input-available-hours');
    if (inputHours) {
      inputHours.addEventListener('change', (e) => {
        this.store.setAvailableHours(e.target.value);
        this.render();
      });
    }

    // Capacity slider in Today's Plan
    const sliderCapacity = this.container.querySelector('#slider-capacity');
    if (sliderCapacity) {
      sliderCapacity.addEventListener('input', (e) => {
        const val = e.target.value;
        const display = document.getElementById('capacity-val-display');
        if (display) display.textContent = `${val} hours`;
        this.store.setAvailableHours(val);
      });
      sliderCapacity.addEventListener('change', () => {
        this.render();
      });
    }

    // Toggle Notifications
    const btnNotifs = this.container.querySelector('#btn-toggle-notifs');
    if (btnNotifs) {
      btnNotifs.addEventListener('click', () => {
        this.showNotifications = !this.showNotifications;
        this.render();
      });
    }

    // Mark all notifications read
    const btnMarkAll = this.container.querySelector('#btn-mark-all-read');
    if (btnMarkAll) {
      btnMarkAll.addEventListener('click', () => {
        this.store.markAllNotificationsRead();
        this.showNotifications = false;
        this.render();
      });
    }

    // Open task detail modal
    this.container.querySelectorAll('.btn-open-task-detail').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.selectedTaskId = e.currentTarget.dataset.taskId;
        this.render();
      });
    });

    // Close task detail modal
    const btnCloseModal = this.container.querySelector('#btn-close-task-modal');
    const btnDismissModal = this.container.querySelector('#btn-dismiss-task-modal');
    if (btnCloseModal) btnCloseModal.addEventListener('click', () => { this.selectedTaskId = null; this.render(); });
    if (btnDismissModal) btnDismissModal.addEventListener('click', () => { this.selectedTaskId = null; this.render(); });

    // Save custom estimate in modal
    const btnSaveEst = this.container.querySelector('#btn-save-custom-estimate');
    if (btnSaveEst) {
      btnSaveEst.addEventListener('click', (e) => {
        const asgId = e.currentTarget.dataset.id;
        const hrsInput = document.getElementById('input-edit-task-hours');
        if (hrsInput) {
          this.store.updateTaskEstimate(asgId, hrsInput.value);
          this.render();
        }
      });
    }

    // Toggle Checklists
    this.container.querySelectorAll('.chk-task-item, .chk-today-task, .chk-lab-item').forEach(chk => {
      chk.addEventListener('change', (e) => {
        const id = e.currentTarget.dataset.id;
        this.store.toggleChecklist(id);
        this.render();
      });
    });

    // Quick nav to lab
    const btnNavLab = this.container.querySelector('.btn-nav-to-lab');
    if (btnNavLab) {
      btnNavLab.addEventListener('click', () => {
        this.activeTab = 'lab';
        this.render();
      });
    }
  }
}

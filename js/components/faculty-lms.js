/**
 * ACADENCE - Virtual LMS / Faculty Portal Component
 * 
 * Provides interactive faculty controls that feed the Academic Data Layer:
 * - Create & Edit Assignments (Triggers AI requirement extraction & change detection)
 * - Publish Announcements (Triggers Lab Prep synthesis)
 * - Upload Lab Materials (Triggers document intelligence & relevance evaluation)
 * - Manage Exams & Projects (Triggers dependency analysis & study plan updates)
 */

export class FacultyLMSComponent {
  constructor(store, containerId) {
    this.store = store;
    this.container = document.getElementById(containerId);
    this.activeTab = 'assignments'; // 'dashboard', 'assignments', 'announcements', 'materials', 'exams', 'groups'
    this.editingAssignmentId = null;
    this.showCreateModal = false;
  }

  render() {
    if (!this.container) return;
    const state = this.store.getState();

    this.container.innerHTML = `
      <div class="lms-wrapper">
        <!-- Faculty LMS Top Header -->
        <header class="lms-header">
          <div class="lms-branding">
            <span class="lms-badge">FACULTY PORTAL</span>
            <h2 class="lms-title">Virtual Campus LMS</h2>
            <span class="lms-user">Logged in as: <strong>Professor (Department of CS)</strong></span>
          </div>
          <div class="lms-system-pill">
            <span class="status-indicator online"></span>
            Institutional API Active
          </div>
        </header>

        <!-- LMS Navigation Tabs -->
        <nav class="lms-nav" aria-label="Faculty Navigation">
          <button class="lms-nav-tab ${this.activeTab === 'assignments' ? 'active' : ''}" data-tab="assignments">
            <svg class="icon" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
            Assignments (${state.assignments.length})
          </button>
          <button class="lms-nav-tab ${this.activeTab === 'announcements' ? 'active' : ''}" data-tab="announcements">
            <svg class="icon" viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
            Announcements (${state.announcements.length})
          </button>
          <button class="lms-nav-tab ${this.activeTab === 'materials' ? 'active' : ''}" data-tab="materials">
            <svg class="icon" viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
            Lab Materials (${state.documents.length})
          </button>
          <button class="lms-nav-tab ${this.activeTab === 'exams' ? 'active' : ''}" data-tab="exams">
            <svg class="icon" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
            Exams (${state.exams.length})
          </button>
          <button class="lms-nav-tab ${this.activeTab === 'groups' ? 'active' : ''}" data-tab="groups">
            <svg class="icon" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
            Students & Groups
          </button>
        </nav>

        <!-- Main Tab Content Area -->
        <main class="lms-content" id="lms-tab-content">
          ${this.renderActiveTab(state)}
        </main>

        <!-- Create Assignment Modal -->
        ${this.showCreateModal ? this.renderCreateModal(state) : ''}

        <!-- Edit Assignment Modal -->
        ${this.editingAssignmentId ? this.renderEditModal(state) : ''}
      </div>
    `;

    this.bindEvents();
  }

  renderActiveTab(state) {
    switch (this.activeTab) {
      case 'assignments':
        return this.renderAssignmentsView(state);
      case 'announcements':
        return this.renderAnnouncementsView(state);
      case 'materials':
        return this.renderMaterialsView(state);
      case 'exams':
        return this.renderExamsView(state);
      case 'groups':
        return this.renderGroupsView(state);
      default:
        return this.renderAssignmentsView(state);
    }
  }

  // --- 1. ASSIGNMENTS VIEW ---
  renderAssignmentsView(state) {
    return `
      <div class="lms-view-header">
        <div>
          <h3>Course Assignments</h3>
          <p class="text-muted">Manage coursework, deadlines, deliverables, and submission parameters.</p>
        </div>
        <button class="btn btn-primary" id="btn-open-create-asg">
          <svg class="icon" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          Publish New Assignment
        </button>
      </div>

      <!-- Quick Action Notice for Demo -->
      <div class="demo-interactive-hint">
        <span class="badge-hint">FACULTY ACTION TEST</span>
        <span>Click <strong>"Edit Assignment"</strong> on DBMS Assignment 3 to simulate shifting the deadline from <em>Friday</em> to <em>Wednesday</em> and format from <em>PDF</em> to <em>DOCX</em>. Observe instant AI Change Detection on ACADENCE!</span>
      </div>

      <div class="lms-assignments-list">
        ${state.assignments.map(asg => `
          <div class="lms-card assignment-card" data-asg-id="${asg.id}">
            <div class="lms-card-header">
              <div>
                <span class="course-chip course-${asg.courseName.toLowerCase().replace(/\\s+/g, '-')}">${asg.courseName}</span>
                <h4 class="asg-card-title">${asg.title}</h4>
              </div>
              <span class="version-tag">Version ${asg.version}</span>
            </div>

            <p class="asg-card-desc">${asg.description}</p>

            <div class="asg-param-grid">
              <div class="asg-param">
                <span class="param-label">Deadline</span>
                <span class="param-value highlight-deadline">${asg.deadline}</span>
              </div>
              <div class="asg-param">
                <span class="param-label">Format</span>
                <span class="param-value highlight-format">${asg.submissionFormat}</span>
              </div>
              <div class="asg-param">
                <span class="param-label">Page Limit</span>
                <span class="param-value">${asg.pageLimit}</span>
              </div>
              <div class="asg-param">
                <span class="param-label">Submission</span>
                <span class="param-value">${asg.submissionLocation}</span>
              </div>
              <div class="asg-param">
                <span class="param-label">Mode</span>
                <span class="param-value">${asg.isGroup ? 'Group Project' : 'Individual'}</span>
              </div>
              <div class="asg-param">
                <span class="param-label">Presentation</span>
                <span class="param-value">${asg.presentationRequired}</span>
              </div>
            </div>

            <div class="asg-card-requirements">
              <span class="req-title">Mandatory Sections:</span>
              <div class="tag-group">
                ${asg.requiredSections.map(sec => `<span class="badge-subtle">${sec}</span>`).join('')}
              </div>
            </div>

            <div class="lms-card-footer">
              <span class="text-muted text-xs">Last updated: ${asg.history[0]?.timestamp || 'Recently'}</span>
              <div class="button-group">
                <button class="btn btn-secondary btn-sm btn-edit-asg" data-id="${asg.id}">
                  <svg class="icon" viewBox="0 0 24 24"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                  Edit / Reschedule
                </button>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  // --- 2. ANNOUNCEMENTS VIEW ---
  renderAnnouncementsView(state) {
    return `
      <div class="lms-view-header">
        <div>
          <h3>Faculty Announcements</h3>
          <p class="text-muted">Broadcast official lab instructions and class notifications.</p>
        </div>
      </div>

      <!-- Quick Announcement Composer -->
      <div class="lms-card announcement-composer">
        <h4>Post New Institutional Announcement</h4>
        <form id="form-post-announcement">
          <div class="form-row">
            <div class="form-group flex-1">
              <label for="ann-course">Course</label>
              <select id="ann-course" required class="form-control">
                <option value="CS301|DBMS">DBMS (CS301)</option>
                <option value="CS302|Operating Systems">Operating Systems (CS302)</option>
                <option value="CS303|Computer Networks">Computer Networks (CS303)</option>
                <option value="CS305|Web Development">Web Development (CS305)</option>
              </select>
            </div>
            <div class="form-group flex-2">
              <label for="ann-title">Title</label>
              <input type="text" id="ann-title" class="form-control" placeholder="e.g. DBMS Lab Session Notice" required value="Upcoming DBMS Lab Session">
            </div>
          </div>
          <div class="form-group">
            <label for="ann-content">Announcement Text</label>
            <textarea id="ann-content" class="form-control" rows="3" required>DBMS Lab next week will cover Experiment 4: Joins. Students should prepare the experiment before attending.</textarea>
          </div>
          <div class="form-actions">
            <button type="button" class="btn btn-secondary btn-sm" id="btn-preset-exp5">
              Load Demo Variation: Experiment 5 (Triggers)
            </button>
            <button type="submit" class="btn btn-primary">
              <svg class="icon" viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
              Publish Announcement
            </button>
          </div>
        </form>
      </div>

      <div class="announcements-stream">
        <h4>Recent Published Announcements</h4>
        ${state.announcements.map(ann => `
          <div class="announcement-item lms-card">
            <div class="ann-item-header">
              <span class="course-chip course-${ann.courseName.toLowerCase().replace(/\\s+/g, '-')}">${ann.courseName}</span>
              <span class="text-muted text-xs">${ann.timestamp}</span>
            </div>
            <h5 class="ann-title">${ann.title}</h5>
            <p class="ann-content">${ann.content}</p>
            <div class="ann-footer">
              <span class="ann-author text-muted text-xs">Author: ${ann.author} • Source: ${ann.source}</span>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  // --- 3. LAB MATERIALS / DOCUMENTS VIEW ---
  renderMaterialsView(state) {
    return `
      <div class="lms-view-header">
        <div>
          <h3>Course & Lab Documents Repository</h3>
          <p class="text-muted">Repository of laboratory manuals, syllabi, and unit notes.</p>
        </div>
        <button class="btn btn-primary" id="btn-upload-material">
          <svg class="icon" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
          Upload Lab Material (.pdf)
        </button>
      </div>

      <div class="demo-interactive-hint">
        <span class="badge-hint">DOCUMENT INTELLIGENCE</span>
        <span>Notice how ACADENCE evaluates each file's context. <strong>DBMS Lab Experiment 4.pdf</strong> has <em>High Relevance</em>, while <strong>DBMS Unit 3 Notes.pdf</strong> is flagged as <em>Low Confidence</em> for lab prep.</span>
      </div>

      <div class="materials-grid">
        ${state.documents.map(doc => `
          <div class="lms-card doc-card">
            <div class="doc-card-top">
              <div class="pdf-icon">
                <svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>
                PDF
              </div>
              <div class="doc-meta">
                <span class="course-chip course-${doc.courseName.toLowerCase().replace(/\\s+/g, '-')}">${doc.courseName}</span>
                <h5 class="doc-filename">${doc.filename}</h5>
                <span class="text-muted text-xs">${doc.size} • Uploaded ${doc.uploadedAt}</span>
              </div>
            </div>

            <p class="doc-title">${doc.title}</p>

            <div class="doc-relevance-pill ${doc.relevanceTag.toLowerCase()}">
              <span class="rel-tag">LMS Relevance Status:</span>
              <strong>${doc.relevanceTag === 'HIGH' ? 'Direct Lab Match' : doc.relevanceTag === 'LOW' ? 'Theory / Supplementary' : 'Non-Target Course'}</strong>
            </div>

            <div class="doc-card-footer">
              <span class="text-muted text-xs">Category: ${doc.category}</span>
              <button class="btn btn-secondary btn-xs btn-doc-action" data-doc="${doc.id}">Inspect Metadata</button>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  // --- 4. EXAMS VIEW ---
  renderExamsView(state) {
    return `
      <div class="lms-view-header">
        <div>
          <h3>Official Exam Timetable & Syllabus</h3>
          <p class="text-muted">Academic schedule published by Examination Division.</p>
        </div>
      </div>

      <div class="demo-interactive-hint">
        <span class="badge-hint">EXAM PLANNER TEST</span>
        <span>Click <strong>"Reschedule Exam"</strong> on DBMS to test ACADENCE's dynamic recalculation of preparation study hours across remaining days!</span>
      </div>

      <div class="exams-list">
        ${state.exams.map(exam => `
          <div class="lms-card exam-card">
            <div class="exam-header">
              <div>
                <span class="course-chip course-${exam.subject.toLowerCase().replace(/\\s+/g, '-')}">${exam.subject}</span>
                <h4>${exam.subject} (${exam.courseCode}) Final Examination</h4>
              </div>
              <div class="exam-date-badge">
                <span class="date-label">Exam Sitting</span>
                <span class="date-val">${exam.date}</span>
              </div>
            </div>

            <div class="exam-body">
              <span class="text-muted text-sm">Weightage: ${exam.weightage}</span>
              <div class="syllabus-timeline">
                <span class="timeline-title">Published Syllabus Modules:</span>
                <div class="syllabus-chips">
                  ${exam.syllabus.map(topic => `
                    <div class="syllabus-chip ${topic.status}">
                      <span class="chip-day">${topic.targetDate}:</span>
                      <span class="chip-name">${topic.name}</span>
                    </div>
                  `).join('')}
                </div>
              </div>
            </div>

            <div class="exam-actions">
              <button class="btn btn-secondary btn-sm btn-reschedule-exam" data-id="${exam.id}">
                <svg class="icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                Reschedule Exam Date
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  // --- 5. STUDENTS / GROUPS VIEW ---
  renderGroupsView(state) {
    const project = state.projects[0];
    return `
      <div class="lms-view-header">
        <div>
          <h3>Team Projects & Workgroup Status</h3>
          <p class="text-muted">Manage group coursework, milestone owners, and cross-task dependencies.</p>
        </div>
      </div>

      <div class="demo-interactive-hint">
        <span class="badge-hint">DEPENDENCY RISK TEST</span>
        <span>Toggle the status of <strong>Member A's Backend task</strong> between <em>Overdue</em> and <em>In Progress</em>. Watch how ACADENCE updates the project risk alert and explains downstream ripple effects blamelessly!</span>
      </div>

      <div class="lms-card project-overview-card">
        <div class="lms-card-header">
          <div>
            <span class="course-chip course-web-development">Web Development</span>
            <h4>${project.title}</h4>
            <span class="text-muted text-sm">Team: ${project.teamName} • Members: ${project.teamMembers.join(', ')}</span>
          </div>
        </div>

        <p class="project-desc">${project.description}</p>

        <div class="team-tasks-table-wrapper">
          <table class="lms-table">
            <thead>
              <tr>
                <th>Task Name</th>
                <th>Owner</th>
                <th>Deadline</th>
                <th>Est. Hours</th>
                <th>Dependencies</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              ${project.tasks.map(task => `
                <tr class="task-row ${task.status}">
                  <td>
                    <strong>${task.name}</strong>
                    ${task.isMyTask ? '<span class="badge-subtle badge-you">Your Task</span>' : ''}
                  </td>
                  <td>${task.owner}</td>
                  <td>${task.deadline}</td>
                  <td>${task.estimatedHours}h</td>
                  <td>
                    ${task.dependsOn.length > 0 
                      ? task.dependsOn.map(depId => {
                          const depTask = project.tasks.find(t => t.id === depId);
                          return `<span class="badge-dep">Blocked by: ${depTask ? depTask.name.split(' ')[0] : 'Prev'}</span>`;
                        }).join('')
                      : '<span class="text-muted text-xs">Root Task</span>'}
                  </td>
                  <td>
                    <span class="status-pill ${task.status}">${task.status.toUpperCase()}</span>
                  </td>
                  <td>
                    <button class="btn btn-secondary btn-xs btn-toggle-task-status" data-project="${project.id}" data-task="${task.id}">
                      Toggle Status
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  // --- MODALS ---
  renderCreateModal(state) {
    return `
      <div class="modal-backdrop" id="modal-create-asg">
        <div class="modal-container">
          <div class="modal-header">
            <h3>Publish New Assignment</h3>
            <button class="btn-close" id="btn-close-create-modal">&times;</button>
          </div>
          <form id="form-create-assignment">
            <div class="modal-body">
              <div class="form-row">
                <div class="form-group flex-2">
                  <label for="create-asg-title">Assignment Title *</label>
                  <input type="text" id="create-asg-title" class="form-control" required value="DBMS Assignment 3">
                </div>
                <div class="form-group flex-1">
                  <label for="create-asg-course">Course *</label>
                  <select id="create-asg-course" class="form-control" required>
                    <option value="CS301|DBMS">DBMS (CS301)</option>
                    <option value="CS302|Operating Systems">Operating Systems (CS302)</option>
                    <option value="CS303|Computer Networks">Computer Networks (CS303)</option>
                    <option value="CS201|Data Structures">Data Structures (CS201)</option>
                    <option value="CS305|Web Development">Web Development (CS305)</option>
                  </select>
                </div>
              </div>

              <div class="form-group">
                <label for="create-asg-desc">Description *</label>
                <textarea id="create-asg-desc" class="form-control" rows="2" required>Submit DBMS Assignment 3 by Friday. Prepare ER diagram and SQL queries. Upload the report in PDF format through the LMS portal.</textarea>
              </div>

              <div class="form-row">
                <div class="form-group flex-1">
                  <label for="create-asg-deadline">Deadline *</label>
                  <input type="text" id="create-asg-deadline" class="form-control" required value="Friday, 5:00 PM">
                </div>
                <div class="form-group flex-1">
                  <label for="create-asg-format">Submission Format *</label>
                  <select id="create-asg-format" class="form-control">
                    <option value="PDF" selected>PDF</option>
                    <option value="DOCX">DOCX</option>
                    <option value="ZIP">ZIP</option>
                    <option value="Not specified">Not specified</option>
                  </select>
                </div>
                <div class="form-group flex-1">
                  <label for="create-asg-pagelimit">Page Limit</label>
                  <input type="text" id="create-asg-pagelimit" class="form-control" value="10 pages" placeholder="e.g. 10 pages or leave blank">
                </div>
              </div>

              <div class="form-row">
                <div class="form-group flex-1">
                  <label for="create-asg-location">Submission Location</label>
                  <input type="text" id="create-asg-location" class="form-control" value="LMS portal">
                </div>
                <div class="form-group flex-1">
                  <label for="create-asg-sections">Required Sections (comma-separated)</label>
                  <input type="text" id="create-asg-sections" class="form-control" value="ER diagram, SQL queries, Normalization explanation">
                </div>
              </div>
            </div>

            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" id="btn-cancel-create">Cancel</button>
              <button type="submit" class="btn btn-primary">
                Publish Assignment to Students
              </button>
            </div>
          </form>
        </div>
      </div>
    `;
  }

  renderEditModal(state) {
    const asg = state.assignments.find(a => a.id === this.editingAssignmentId);
    if (!asg) return '';

    return `
      <div class="modal-backdrop" id="modal-edit-asg">
        <div class="modal-container">
          <div class="modal-header">
            <div>
              <span class="badge-subtle">VIRTUAL LMS FACULTY EDITOR</span>
              <h3>Edit Assignment: ${asg.title}</h3>
            </div>
            <button class="btn-close" id="btn-close-edit-modal">&times;</button>
          </div>
          <form id="form-edit-assignment">
            <div class="modal-body">
              <div class="alert-box alert-info">
                <strong>Simulate Academic Change:</strong> Update the deadline to <em>Wednesday, 5:00 PM</em> and format to <em>DOCX</em> to observe ACADENCE's instant change detection, preparation days loss calculation, and priority increase!
              </div>

              <div class="form-row">
                <div class="form-group flex-1">
                  <label for="edit-asg-deadline">Deadline *</label>
                  <input type="text" id="edit-asg-deadline" class="form-control" required value="${asg.deadline === 'Friday, 5:00 PM' ? 'Wednesday, 5:00 PM' : asg.deadline}">
                  <span class="form-hint">Original: ${asg.deadline}</span>
                </div>
                <div class="form-group flex-1">
                  <label for="edit-asg-format">Submission Format *</label>
                  <select id="edit-asg-format" class="form-control">
                    <option value="DOCX" ${asg.submissionFormat === 'DOCX' ? 'selected' : ''}>DOCX</option>
                    <option value="PDF" ${asg.submissionFormat === 'PDF' ? 'selected' : ''}>PDF</option>
                    <option value="ZIP" ${asg.submissionFormat === 'ZIP' ? 'selected' : ''}>ZIP</option>
                    <option value="Not specified" ${asg.submissionFormat === 'Not specified' ? 'selected' : ''}>Not specified</option>
                  </select>
                  <span class="form-hint">Original: ${asg.submissionFormat}</span>
                </div>
                <div class="form-group flex-1">
                  <label for="edit-asg-pagelimit">Page Limit</label>
                  <input type="text" id="edit-asg-pagelimit" class="form-control" value="${asg.pageLimit}">
                </div>
              </div>

              <div class="form-group">
                <label for="edit-asg-sections">Required Sections (comma-separated)</label>
                <input type="text" id="edit-asg-sections" class="form-control" value="${asg.requiredSections.join(', ')}">
              </div>

              <div class="form-group">
                <label for="edit-asg-instructions">Additional Instructions</label>
                <textarea id="edit-asg-instructions" class="form-control" rows="2">${asg.additionalInstructions || ''}</textarea>
              </div>
            </div>

            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" id="btn-cancel-edit">Cancel</button>
              <button type="submit" class="btn btn-primary btn-save-edit">
                Save & Broadcast Update (Version ${asg.version + 1})
              </button>
            </div>
          </form>
        </div>
      </div>
    `;
  }

  bindEvents() {
    // Nav tabs
    this.container.querySelectorAll('.lms-nav-tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        this.activeTab = e.currentTarget.dataset.tab;
        this.render();
      });
    });

    // Open create modal
    const btnCreate = this.container.querySelector('#btn-open-create-asg');
    if (btnCreate) {
      btnCreate.addEventListener('click', () => {
        this.showCreateModal = true;
        this.render();
      });
    }

    // Close create modal
    const btnCloseCreate = this.container.querySelector('#btn-close-create-modal');
    const btnCancelCreate = this.container.querySelector('#btn-cancel-create');
    if (btnCloseCreate) btnCloseCreate.addEventListener('click', () => { this.showCreateModal = false; this.render(); });
    if (btnCancelCreate) btnCancelCreate.addEventListener('click', () => { this.showCreateModal = false; this.render(); });

    // Handle Create Submission
    const formCreate = this.container.querySelector('#form-create-assignment');
    if (formCreate) {
      formCreate.addEventListener('submit', (e) => {
        e.preventDefault();
        const courseParts = document.getElementById('create-asg-course').value.split('|');
        const sectionsStr = document.getElementById('create-asg-sections').value;
        const sections = sectionsStr.split(',').map(s => s.trim()).filter(Boolean);

        this.store.publishAssignment({
          title: document.getElementById('create-asg-title').value,
          courseId: courseParts[0],
          courseName: courseParts[1],
          description: document.getElementById('create-asg-desc').value,
          deadline: document.getElementById('create-asg-deadline').value,
          submissionFormat: document.getElementById('create-asg-format').value,
          pageLimit: document.getElementById('create-asg-pagelimit').value || 'Not specified',
          submissionLocation: document.getElementById('create-asg-location').value || 'LMS portal',
          isGroup: false,
          requiredSections: sections.length > 0 ? sections : ['Not specified'],
          requiredFiles: ['Report.' + (document.getElementById('create-asg-format').value || 'pdf').toLowerCase()]
        });

        this.showCreateModal = false;
        this.render();
      });
    }

    // Open edit modal
    this.container.querySelectorAll('.btn-edit-asg').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.editingAssignmentId = e.currentTarget.dataset.id;
        this.render();
      });
    });

    // Close edit modal
    const btnCloseEdit = this.container.querySelector('#btn-close-edit-modal');
    const btnCancelEdit = this.container.querySelector('#btn-cancel-edit');
    if (btnCloseEdit) btnCloseEdit.addEventListener('click', () => { this.editingAssignmentId = null; this.render(); });
    if (btnCancelEdit) btnCancelEdit.addEventListener('click', () => { this.editingAssignmentId = null; this.render(); });

    // Handle Edit Submission
    const formEdit = this.container.querySelector('#form-edit-assignment');
    if (formEdit) {
      formEdit.addEventListener('submit', (e) => {
        e.preventDefault();
        const sectionsStr = document.getElementById('edit-asg-sections').value;
        const sections = sectionsStr.split(',').map(s => s.trim()).filter(Boolean);

        this.store.updateAssignment(this.editingAssignmentId, {
          deadline: document.getElementById('edit-asg-deadline').value,
          submissionFormat: document.getElementById('edit-asg-format').value,
          pageLimit: document.getElementById('edit-asg-pagelimit').value || 'Not specified',
          requiredSections: sections,
          additionalInstructions: document.getElementById('edit-asg-instructions').value
        });

        this.editingAssignmentId = null;
        this.render();
      });
    }

    // Post announcement
    const formAnn = this.container.querySelector('#form-post-announcement');
    if (formAnn) {
      formAnn.addEventListener('submit', (e) => {
        e.preventDefault();
        const courseParts = document.getElementById('ann-course').value.split('|');
        const content = document.getElementById('ann-content').value;
        const expNum = content.includes('Experiment 5') ? 5 : (content.includes('Experiment 4') ? 4 : null);
        const topic = content.includes('Experiment 5') ? 'Triggers & Stored Procedures' : 'Joins';

        this.store.publishAnnouncement({
          courseId: courseParts[0],
          courseName: courseParts[1],
          title: document.getElementById('ann-title').value,
          content: content,
          author: 'Professor',
          experimentNum: expNum,
          topic: topic
        });

        this.render();
      });
    }

    // Preset Exp 5 button
    const btnPresetExp5 = this.container.querySelector('#btn-preset-exp5');
    if (btnPresetExp5) {
      btnPresetExp5.addEventListener('click', () => {
        const titleEl = document.getElementById('ann-title');
        const contentEl = document.getElementById('ann-content');
        if (titleEl && contentEl) {
          titleEl.value = 'Revised DBMS Lab Schedule: Experiment 5';
          contentEl.value = 'DBMS Lab next week has been revised: we will cover Experiment 5: Triggers and Stored Procedures. Students should prepare Experiment 5 before attending.';
        }
      });
    }

    // Upload Lab Material
    const btnUpload = this.container.querySelector('#btn-upload-material');
    if (btnUpload) {
      btnUpload.addEventListener('click', () => {
        this.store.uploadDocument({
          filename: 'DBMS Lab Experiment 4.pdf',
          courseId: 'CS301',
          courseName: 'DBMS',
          title: 'Lab Manual - Experiment 4: Implementation of Joins and Subqueries',
          size: '1.4 MB',
          category: 'Lab Manual',
          relevanceTag: 'HIGH',
          relevanceConfidence: 0.94,
          relevanceExplanation: 'High confidence — Analyzed document content matches faculty announcement ("Experiment 4: Joins").'
        });
        this.render();
      });
    }

    // Reschedule Exam Date
    this.container.querySelectorAll('.btn-reschedule-exam').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const examId = e.currentTarget.dataset.id;
        const exam = this.store.getState().exams.find(ex => ex.id === examId);
        const newDate = exam && exam.date === 'October 20' ? 'October 18' : 'October 20';
        this.store.updateExamDate(examId, newDate);
        this.render();
      });
    });

    // Toggle Project Task Status
    this.container.querySelectorAll('.btn-toggle-task-status').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const projId = e.currentTarget.dataset.project;
        const taskId = e.currentTarget.dataset.task;
        const project = this.store.getState().projects.find(p => p.id === projId);
        const task = project?.tasks.find(t => t.id === taskId);
        if (task) {
          const nextStatus = task.status === 'overdue' ? 'in_progress' : (task.status === 'in_progress' ? 'completed' : 'overdue');
          this.store.updateProjectTask(projId, taskId, { status: nextStatus });
          this.render();
        }
      });
    });
  }
}

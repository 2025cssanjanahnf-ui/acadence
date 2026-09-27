/**
 * ACADENCE - Faculty LMS Portal Component (Simulation & Testing)
 * Tagline: FROM ACADEMIC INFORMATION TO ACTION
 * 
 * Provides interactive faculty controls that feed the Academic Data Layer:
 * - Edit / Publish Assignments (Triggers deadline updates & Academic Changes)
 * - Publish Announcements (Surfaces programs from Lab Manual 1-10 Programs.pdf)
 * - Document Repository (Clean list/cards, Open PDF viewer, upload PDF/PPT/DOC)
 * - Reschedule Exams (Updates remaining days & records schedule recalculation)
 */

export class FacultyLMSComponent {
  constructor(store, containerId) {
    this.store = store;
    this.container = document.getElementById(containerId);
    this.activeTab = 'materials'; // 'assignments', 'announcements', 'materials', 'exams'
    this.editingAssignmentId = null;
    this.showCreateModal = false;
    this.selectedDocDetails = null;

    // PDF viewer state inside LMS
    this.pdfModalOpen = false;
    this.pdfUrl = 'docs/Lab Manual 1-10 Programs.pdf';
    this.pdfTitle = 'Lab Manual 1-10 Programs.pdf';
    this.pdfCurrentPage = 1;
    this.pdfTotalPages = 44;
    this.pdfScale = 1.2;
    this.pdfDoc = null;
    this.renderingPdf = false;
  }

  render() {
    if (!this.container) return;
    const state = this.store.getState();

    this.container.innerHTML = `
      <div class="lms-app-shell">
        <!-- Faculty Portal Top Header -->
        <header class="lms-main-header">
          <div class="lms-brand-row">
            <span class="lms-portal-tag">FACULTY PORTAL</span>
            <h1 class="lms-portal-title">Virtual Campus LMS</h1>
            <span class="lms-user-meta">Department of Computer Science • Professor</span>
          </div>

          <div class="lms-header-right">
            <div class="lms-status-pill">
              <span class="status-dot"></span>
              <span class="status-label">LMS Connected</span>
            </div>

            <a href="/" class="btn btn-primary btn-sm" title="Return to student ACADENCE platform">
              View ACADENCE Student Platform ↗
            </a>
          </div>
        </header>

        <!-- LMS Navigation Tabs -->
        <nav class="lms-navbar" aria-label="Faculty Navigation">
          <button class="lms-tab ${this.activeTab === 'materials' ? 'active' : ''}" data-tab="materials">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
            </svg>
            Course Documents Repository (${state.documents.length})
          </button>

          <button class="lms-tab ${this.activeTab === 'announcements' ? 'active' : ''}" data-tab="announcements">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
            Announcements & Lab Notices (${state.announcements.length})
          </button>

          <button class="lms-tab ${this.activeTab === 'assignments' ? 'active' : ''}" data-tab="assignments">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 11l3 3L22 4"></path>
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
            </svg>
            Assignments (${state.assignments.length})
          </button>

          <button class="lms-tab ${this.activeTab === 'exams' ? 'active' : ''}" data-tab="exams">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            Exams (${state.exams.length})
          </button>
        </nav>

        <!-- Main Surface -->
        <main class="lms-surface">
          ${this.renderActiveTab(state)}
        </main>

        <!-- Modals -->
        ${this.editingAssignmentId ? this.renderEditAssignmentModal(state) : ''}
        ${this.selectedDocDetails ? this.renderDocDetailsModal() : ''}
        ${this.pdfModalOpen ? this.renderPdfViewerModal() : ''}
      </div>
    `;

    this.bindEvents();

    if (this.pdfModalOpen) {
      this.initPdfViewer();
    }
  }

  renderActiveTab(state) {
    switch (this.activeTab) {
      case 'materials':
        return this.renderMaterialsView(state);
      case 'announcements':
        return this.renderAnnouncementsView(state);
      case 'assignments':
        return this.renderAssignmentsView(state);
      case 'exams':
        return this.renderExamsView(state);
      default:
        return this.renderMaterialsView(state);
    }
  }

  // =========================================================================
  // 1. COURSE DOCUMENTS REPOSITORY (CLEAN LIST/CARDS, NO HUGE PREVIEWS)
  // =========================================================================
  renderMaterialsView(state) {
    return `
      <div class="lms-view-container">
        <div class="lms-view-header">
          <div>
            <h2 class="view-title">Course Documents Repository</h2>
            <p class="view-subtitle">Laboratory manuals, assignment rubrics, lecture presentations, and unit notes.</p>
          </div>

          <button class="btn btn-primary" id="btn-open-upload-modal">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="17 8 12 3 7 8"></polyline>
              <line x1="12" y1="3" x2="12" y2="15"></line>
            </svg>
            Upload Document (PDF / PPT / DOCX)
          </button>
        </div>

        <!-- Clean Document List / Cards (Section 23: No huge PDF previews) -->
        <div class="doc-repository-list">
          ${state.documents.map(doc => `
            <div class="doc-item-card">
              <div class="doc-item-icon">
                <span class="file-type-badge">${doc.type}</span>
              </div>

              <div class="doc-item-main">
                <div class="doc-title-row">
                  <h3 class="doc-name">${doc.filename}</h3>
                  <span class="course-chip course-${doc.courseName.toLowerCase().replace(/[^a-z0-9]/g, '')}">${doc.courseName}</span>
                </div>
                <p class="doc-description">${doc.title}</p>
                <div class="doc-meta-strip">
                  <span class="meta-tag">Type: <strong>${doc.category}</strong></span>
                  <span class="meta-tag">Length: <strong>${doc.pageCount} pages</strong></span>
                  <span class="meta-tag">Size: <strong>${doc.size}</strong></span>
                  <span class="meta-tag">Updated: <strong>${doc.updatedAt}</strong></span>
                  <span class="meta-tag highlighted">Used in: <strong>${doc.usedIn}</strong></span>
                </div>
              </div>

              <div class="doc-item-actions">
                <button class="btn btn-primary btn-sm btn-open-pdf-viewer" data-url="${doc.filePath}" data-title="${doc.filename}" data-pages="${doc.pageCount}">
                  Open PDF
                </button>
                <button class="btn btn-outline btn-sm btn-view-doc-details" data-id="${doc.id}">
                  View Details
                </button>
              </div>
            </div>
          `).join('')}
        </div>

        <!-- Upload Form Container (Hidden or inline toggle) -->
        <div class="upload-dialog-panel hidden" id="upload-dialog-panel">
          <div class="upload-panel-header">
            <h3>Upload New Academic Material</h3>
            <button class="btn-close-modal" id="btn-close-upload-panel">✕</button>
          </div>
          <form id="form-upload-document" class="form-grid">
            <div class="form-row">
              <div class="form-group flex-1">
                <label>File Name</label>
                <input type="text" id="up-filename" class="form-input" placeholder="e.g. Unit 4 Trees and Graphs.pdf" required>
              </div>
              <div class="form-group flex-1">
                <label>Course</label>
                <select id="up-course" class="form-select">
                  <option value="DSA">Data Structures & Algorithms (CS201)</option>
                  <option value="DBMS">Database Management Systems (CS301)</option>
                  <option value="Operating Systems">Operating Systems (CS302)</option>
                  <option value="Computer Networks">Computer Networks (CS303)</option>
                </select>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group flex-1">
                <label>Document Category</label>
                <select id="up-category" class="form-select">
                  <option value="Lab Manual">Lab Manual</option>
                  <option value="Assignment Guide">Assignment</option>
                  <option value="Exam Material">Exam Material</option>
                  <option value="General Notes">General Notes</option>
                </select>
              </div>
              <div class="form-group flex-1">
                <label>Document Type</label>
                <select id="up-type" class="form-select">
                  <option value="PDF">PDF (.pdf)</option>
                  <option value="PPTX">PPT/PPTX (.pptx)</option>
                  <option value="DOCX">DOC/DOCX (.docx)</option>
                </select>
              </div>
            </div>

            <div class="form-group">
              <label>Document Title / Notes</label>
              <input type="text" id="up-title" class="form-input" placeholder="e.g. Official Lab Manual Experiment 5" required>
            </div>

            <div class="form-actions-right">
              <button type="button" class="btn btn-outline" id="btn-cancel-upload">Cancel</button>
              <button type="submit" class="btn btn-primary">Publish to Repository</button>
            </div>
          </form>
        </div>
      </div>
    `;
  }

  // =========================================================================
  // 2. ANNOUNCEMENTS (DYNAMICALLY SURFACES DSA LAB MANUAL PROGRAMS)
  // =========================================================================
  renderAnnouncementsView(state) {
    return `
      <div class="lms-view-container">
        <div class="lms-view-header">
          <div>
            <h2 class="view-title">Faculty Announcements & Lab Notices</h2>
            <p class="view-subtitle">Publishing upcoming lab notices causes ACADENCE to identify and surface the exact program from the 44-page DSA manual.</p>
          </div>
        </div>

        <!-- Publish Announcement Card -->
        <div class="lms-action-card">
          <h3 class="card-heading">Announce Upcoming Lab Experiment</h3>
          <p class="text-sm text-muted" style="margin-bottom: 16px;">
            Select any program from the uploaded DSA Lab Manual (Programs 1 to 10) to test how ACADENCE surfaces only the matching program:
          </p>

          <form id="form-publish-announcement">
            <div class="form-row">
              <div class="form-group flex-1">
                <label>Target Course</label>
                <select id="ann-course" class="form-select">
                  <option value="DSA">Data Structures & Algorithms (CS201)</option>
                  <option value="DBMS">Database Management Systems (CS301)</option>
                  <option value="Operating Systems">Operating Systems (CS302)</option>
                </select>
              </div>

              <div class="form-group flex-2">
                <label>Quick Preset (From 44-Page DSA Lab Manual)</label>
                <select id="select-dsa-preset" class="form-select">
                  <option value="">-- Choose a DSA Program to Announce --</option>
                  <option value="4">Program 4: Singly Linked List (Insert, Delete, Search, Display)</option>
                  <option value="5">Program 5: Circular Singly Linked List (Bus Stop Route)</option>
                  <option value="6">Program 6: Doubly Linked List (Music Streaming Playlist)</option>
                  <option value="7">Program 7: Circular Doubly Linked List (Tour Itinerary)</option>
                  <option value="8">Program 8: Stack Operations (Web Browser History)</option>
                  <option value="9">Program 9: Stack Applications (Infix to Postfix)</option>
                  <option value="10">Program 10: Recursion & Searching (Tower of Hanoi)</option>
                  <option value="1">Program 1: Array Operations on Student Marks</option>
                  <option value="2">Program 2: Pointers & Structures (Matrix & Time)</option>
                  <option value="3">Program 3: Bank Account Management System</option>
                  <option value="unmatched">Unmatched Test Notice (Triggers unable to identify)</option>
                </select>
              </div>
            </div>

            <div class="form-group">
              <label>Announcement Title</label>
              <input type="text" id="ann-title" class="form-input" value="Upcoming DSA Lab Session: Program 4" required>
            </div>

            <div class="form-group">
              <label>Announcement Body Text</label>
              <textarea id="ann-content" class="form-textarea" rows="3" required>Upcoming DSA Lab will cover Program 4: Singly Linked List operations. Students should prepare the required program before attending the lab session.</textarea>
            </div>

            <div class="form-actions-right">
              <button type="submit" class="btn btn-primary">
                Publish Announcement
              </button>
            </div>
          </form>
        </div>

        <!-- Recent Stream -->
        <div class="announcements-stream-section">
          <h3 class="section-title">Published Stream</h3>
          <div class="ann-cards-list">
            ${state.announcements.map(ann => `
              <div class="ann-stream-card">
                <div class="ann-stream-header">
                  <span class="course-chip course-${ann.courseName.toLowerCase().replace(/[^a-z0-9]/g, '')}">${ann.courseName}</span>
                  <span class="ann-time">${ann.timestamp}</span>
                </div>
                <h4 class="ann-item-title">${ann.title}</h4>
                <p class="ann-item-content">${ann.content}</p>
                <span class="ann-item-author">${ann.source}</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  // =========================================================================
  // 3. ASSIGNMENTS MANAGEMENT (EDIT DEADLINE & FORMAT)
  // =========================================================================
  renderAssignmentsView(state) {
    return `
      <div class="lms-view-container">
        <div class="lms-view-header">
          <div>
            <h2 class="view-title">Manage Coursework & Deadlines</h2>
            <p class="view-subtitle">Edit deadlines or submission formats to simulate real academic schedule updates.</p>
          </div>
        </div>

        <div class="lms-interactive-hint-box">
          <span class="hint-tag">SIMULATION TEST</span>
          <span>Click <strong>"Edit Assignment"</strong> on DBMS Assignment 3 to change the deadline (e.g. from <em>Friday</em> to <em>Wednesday</em>). Switch to the student tab to observe instant Academic Change and reprioritization into What Needs Attention!</span>
        </div>

        <div class="lms-assignments-grid">
          ${state.assignments.map(asg => `
            <div class="lms-asg-card">
              <div class="asg-card-top">
                <span class="course-chip course-${asg.courseName.toLowerCase().replace(/[^a-z0-9]/g, '')}">${asg.courseName}</span>
                <span class="asg-version-pill">Version ${asg.version}</span>
              </div>

              <h3 class="asg-title">${asg.title}</h3>
              <p class="asg-desc">${asg.description}</p>

              <div class="asg-specs-grid">
                <div><strong>Deadline:</strong> ${asg.deadline}</div>
                <div><strong>Format:</strong> ${asg.submissionFormat}</div>
                <div><strong>Page Limit:</strong> ${asg.pageLimit}</div>
                <div><strong>Location:</strong> ${asg.submissionLocation}</div>
              </div>

              <div class="asg-card-footer">
                <button class="btn btn-outline btn-sm btn-edit-asg" data-id="${asg.id}">
                  Edit Assignment
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // =========================================================================
  // 4. EXAMS TIMETABLE
  // =========================================================================
  renderExamsView(state) {
    return `
      <div class="lms-view-container">
        <div class="lms-view-header">
          <div>
            <h2 class="view-title">Examination Timetable</h2>
            <p class="view-subtitle">Published examination dates and syllabus topics.</p>
          </div>
        </div>

        <div class="lms-exams-list">
          ${state.exams.map(exam => `
            <div class="lms-exam-row-card">
              <div class="exam-row-left">
                <span class="course-chip course-${exam.subject.toLowerCase().replace(/[^a-z0-9]/g, '')}">${exam.subject}</span>
                <h3 class="exam-title">${exam.subject} Final Exam (${exam.courseCode})</h3>
                <p class="exam-date-str">Sitting Date: <strong>${exam.date}</strong> • Weightage: ${exam.weightage}</p>
                <div class="exam-topics-row">
                  ${exam.topics.map(t => `<span class="topic-tag">${t}</span>`).join('')}
                </div>
              </div>

              <div class="exam-row-right">
                <button class="btn btn-outline btn-sm btn-reschedule-exam" data-id="${exam.id}">
                  Reschedule Exam Date
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // =========================================================================
  // EDIT ASSIGNMENT MODAL
  // =========================================================================
  renderEditAssignmentModal(state) {
    const asg = state.assignments.find(a => a.id === this.editingAssignmentId);
    if (!asg) return '';

    return `
      <div class="modal-backdrop" id="lms-edit-backdrop">
        <div class="modal-dialog-card">
          <div class="modal-top-bar">
            <div>
              <span class="course-chip course-${asg.courseName.toLowerCase().replace(/[^a-z0-9]/g, '')}">${asg.courseName}</span>
              <h2 class="modal-assignment-title">Edit ${asg.title}</h2>
            </div>
            <button class="btn-close-modal" id="btn-close-lms-edit">✕</button>
          </div>

          <form id="form-update-assignment" class="modal-scroll-content">
            <div class="form-group">
              <label>Assignment Title</label>
              <input type="text" id="edit-asg-title" class="form-input" value="${asg.title}" required>
            </div>

            <div class="form-row">
              <div class="form-group flex-1">
                <label>Deadline (e.g. Wednesday, 5:00 PM)</label>
                <input type="text" id="edit-asg-deadline" class="form-input" value="${asg.deadline}" required>
              </div>

              <div class="form-group flex-1">
                <label>Submission Format</label>
                <select id="edit-asg-format" class="form-select">
                  <option value="PDF" ${asg.submissionFormat === 'PDF' ? 'selected' : ''}>PDF (.pdf)</option>
                  <option value="DOCX" ${asg.submissionFormat === 'DOCX' ? 'selected' : ''}>DOCX (.docx)</option>
                  <option value="ZIP" ${asg.submissionFormat === 'ZIP' ? 'selected' : ''}>ZIP Archive (.zip)</option>
                </select>
              </div>
            </div>

            <div class="form-group">
              <label>Page Limit</label>
              <input type="text" id="edit-asg-pages" class="form-input" value="${asg.pageLimit}">
            </div>

            <div class="form-group">
              <label>Description / Additional Instructions</label>
              <textarea id="edit-asg-desc" class="form-textarea" rows="3">${asg.description}</textarea>
            </div>

            <div class="form-actions-right">
              <button type="button" class="btn btn-outline" id="btn-cancel-edit-asg">Cancel</button>
              <button type="submit" class="btn btn-primary">Save Changes & Push Update</button>
            </div>
          </form>
        </div>
      </div>
    `;
  }

  // =========================================================================
  // DOCUMENT DETAILS MODAL
  // =========================================================================
  renderDocDetailsModal() {
    const doc = this.selectedDocDetails;
    if (!doc) return '';

    return `
      <div class="modal-backdrop" id="doc-details-backdrop">
        <div class="modal-dialog-card modal-sm">
          <div class="modal-top-bar">
            <div>
              <span class="course-chip course-${doc.courseName.toLowerCase().replace(/[^a-z0-9]/g, '')}">${doc.courseName}</span>
              <h3 class="modal-assignment-title">${doc.filename}</h3>
            </div>
            <button class="btn-close-modal" id="btn-close-doc-details">✕</button>
          </div>

          <div class="modal-scroll-content">
            <div class="doc-detail-rows">
              <p><strong>Title:</strong> ${doc.title}</p>
              <p><strong>Category:</strong> ${doc.category}</p>
              <p><strong>Length:</strong> ${doc.pageCount} pages</p>
              <p><strong>File Size:</strong> ${doc.size}</p>
              <p><strong>Last Updated:</strong> ${doc.updatedAt}</p>
              <p><strong>Used In:</strong> ${doc.usedIn}</p>
              <p><strong>Local Path:</strong> <code>${doc.filePath}</code></p>
            </div>

            <div class="modal-actions-right" style="margin-top: 20px;">
              <button class="btn btn-primary btn-sm btn-open-pdf-viewer" data-url="${doc.filePath}" data-title="${doc.filename}" data-pages="${doc.pageCount}">
                Open in PDF Viewer
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // =========================================================================
  // PDF VIEWER MODAL
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
              <a href="${this.pdfUrl}" target="_blank" download class="btn btn-outline btn-xs">Download</a>
              <button class="btn-close-modal" id="btn-close-pdf-modal">✕</button>
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
  // EVENT BINDINGS
  // =========================================================================
  bindEvents() {
    if (!this.container) return;

    // Tabs
    this.container.querySelectorAll('.lms-tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        this.activeTab = e.currentTarget.dataset.tab;
        this.render();
      });
    });

    // Preset selector for DSA Lab announcement
    const presetSelect = this.container.querySelector('#select-dsa-preset');
    if (presetSelect) {
      presetSelect.addEventListener('change', (e) => {
        const val = e.target.value;
        const titleInput = this.container.querySelector('#ann-title');
        const contentInput = this.container.querySelector('#ann-content');
        const courseSelect = this.container.querySelector('#ann-course');

        if (courseSelect) courseSelect.value = 'DSA';

        if (val === 'unmatched') {
          if (titleInput) titleInput.value = 'Guest Lecture on Cloud Microservices';
          if (contentInput) contentInput.value = 'A guest speaker will discuss distributed systems next Tuesday during laboratory hours. Attendance optional.';
        } else if (val) {
          const progNum = parseInt(val, 10);
          const prog = DSA_PROGRAMS.find(p => p.programNumber === progNum);
          if (prog) {
            if (titleInput) titleInput.value = `Upcoming DSA Lab Session: Program ${progNum}`;
            if (contentInput) contentInput.value = `Upcoming DSA Lab will cover Program ${progNum}: ${prog.title.split(':')[1]?.trim() || ''}. Students should prepare the program from the lab manual before attending.`;
          }
        }
      });
    }

    // Submit Announcement Form
    const formAnn = this.container.querySelector('#form-publish-announcement');
    if (formAnn) {
      formAnn.addEventListener('submit', (e) => {
        e.preventDefault();
        const course = this.container.querySelector('#ann-course')?.value || 'DSA';
        const title = this.container.querySelector('#ann-title')?.value || '';
        const content = this.container.querySelector('#ann-content')?.value || '';

        this.store.publishAnnouncement({
          courseName: course,
          courseId: course === 'DSA' ? 'CS201' : 'CS301',
          author: `${course} Faculty`,
          title: title,
          content: content
        });

        alert(`Announcement published! ACADENCE has analyzed the notice and updated Lab Prep.`);
        this.render();
      });
    }

    // Edit Assignment button click
    this.container.querySelectorAll('.btn-edit-asg').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.editingAssignmentId = e.currentTarget.dataset.id;
        this.render();
      });
    });

    // Close edit modal
    const btnCloseEdit = this.container.querySelector('#btn-close-lms-edit');
    const btnCancelEdit = this.container.querySelector('#btn-cancel-edit-asg');
    [btnCloseEdit, btnCancelEdit].forEach(btn => {
      if (btn) {
        btn.addEventListener('click', () => {
          this.editingAssignmentId = null;
          this.render();
        });
      }
    });

    // Submit Edit Assignment Form
    const formUpdateAsg = this.container.querySelector('#form-update-assignment');
    if (formUpdateAsg) {
      formUpdateAsg.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = this.container.querySelector('#edit-asg-title')?.value || '';
        const deadline = this.container.querySelector('#edit-asg-deadline')?.value || '';
        const format = this.container.querySelector('#edit-asg-format')?.value || 'PDF';
        const pageLimit = this.container.querySelector('#edit-asg-pages')?.value || '10 pages';
        const desc = this.container.querySelector('#edit-asg-desc')?.value || '';

        this.store.updateAssignment(this.editingAssignmentId, {
          title: title,
          deadline: deadline,
          submissionFormat: format,
          pageLimit: pageLimit,
          description: desc
        });

        this.editingAssignmentId = null;
        alert('Assignment updated! Schedule changes and impact statement pushed to ACADENCE.');
        this.render();
      });
    }

    // Reschedule Exam button click
    this.container.querySelectorAll('.btn-reschedule-exam').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const examId = e.currentTarget.dataset.id;
        const exam = this.store.getState().exams.find(ex => ex.id === examId);
        const current = exam?.date || 'October 20';
        const newDate = prompt(`Reschedule ${exam?.subject} Final Exam Sitting Date:`, current === 'October 20' ? 'October 24' : 'October 20');
        if (newDate && newDate.trim()) {
          this.store.updateExamDate(examId, newDate.trim());
          alert(`Exam date updated to ${newDate.trim()}! ACADENCE remaining timeline recalculated.`);
          this.render();
        }
      });
    });

    // Upload Material Modal toggle
    const btnOpenUpload = this.container.querySelector('#btn-open-upload-modal');
    const uploadPanel = this.container.querySelector('#upload-dialog-panel');
    const btnCloseUpload = this.container.querySelector('#btn-close-upload-panel');
    const btnCancelUpload = this.container.querySelector('#btn-cancel-upload');

    if (btnOpenUpload && uploadPanel) {
      btnOpenUpload.addEventListener('click', () => {
        uploadPanel.classList.toggle('hidden');
      });
    }
    [btnCloseUpload, btnCancelUpload].forEach(b => {
      if (b && uploadPanel) {
        b.addEventListener('click', () => {
          uploadPanel.classList.add('hidden');
        });
      }
    });

    // Form Upload Document
    const formUpload = this.container.querySelector('#form-upload-document');
    if (formUpload) {
      formUpload.addEventListener('submit', (e) => {
        e.preventDefault();
        const filename = this.container.querySelector('#up-filename')?.value || 'Document.pdf';
        const course = this.container.querySelector('#up-course')?.value || 'DSA';
        const category = this.container.querySelector('#up-category')?.value || 'Lab Manual';
        const type = this.container.querySelector('#up-type')?.value || 'PDF';
        const title = this.container.querySelector('#up-title')?.value || filename;

        this.store.uploadDocument({
          filename: filename,
          courseName: course,
          courseId: course === 'DSA' ? 'CS201' : 'CS301',
          title: title,
          category: category,
          type: type,
          pageCount: 14,
          size: '1.8 MB',
          usedIn: 'Reference'
        });

        if (uploadPanel) uploadPanel.classList.add('hidden');
        alert(`Document "${filename}" uploaded to course repository!`);
        this.render();
      });
    }

    // Open PDF button click
    this.container.querySelectorAll('.btn-open-pdf-viewer').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const url = e.currentTarget.dataset.url || 'docs/Lab Manual 1-10 Programs.pdf';
        const title = e.currentTarget.dataset.title || 'Lab Manual 1-10 Programs.pdf';
        const pages = parseInt(e.currentTarget.dataset.pages || '44', 10);
        this.pdfUrl = url;
        this.pdfTitle = title;
        this.pdfCurrentPage = 1;
        this.pdfTotalPages = pages;
        this.pdfModalOpen = true;
        this.selectedDocDetails = null;
        this.render();
      });
    });

    // View Doc Details
    this.container.querySelectorAll('.btn-view-doc-details').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const docId = e.currentTarget.dataset.id;
        const doc = this.store.getState().documents.find(d => d.id === docId);
        if (doc) {
          this.selectedDocDetails = doc;
          this.render();
        }
      });
    });

    // Close Doc Details
    const btnCloseDocDetails = this.container.querySelector('#btn-close-doc-details');
    if (btnCloseDocDetails) {
      btnCloseDocDetails.addEventListener('click', () => {
        this.selectedDocDetails = null;
        this.render();
      });
    }

    // Close PDF Modal
    const btnClosePdf = this.container.querySelector('#btn-close-pdf-modal');
    if (btnClosePdf) {
      btnClosePdf.addEventListener('click', () => {
        this.pdfModalOpen = false;
        this.render();
      });
    }

    // PDF Page controls
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
  }
}

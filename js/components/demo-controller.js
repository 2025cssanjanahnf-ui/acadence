/**
 * ACADENCE - Interactive Demo Controller
 * Supports the complete 9-Step Hackathon Critical Demo Workflow:
 * 
 * STEP 1: Faculty publishes DBMS Assignment 3 (Friday, PDF, ER diagram, SQL queries, Report)
 * STEP 2: Student opens ACADENCE (AI extracts requirements, checklist, workload estimate, priority)
 * STEP 3: Faculty edits assignment (Friday → Wednesday, PDF → DOCX)
 * STEP 4: ACADENCE detects change (URGENT ACADEMIC UPDATE, 2 days compressed, priority increased)
 * STEP 5: Faculty posts Announcement (Lab Exp 4: Joins) & uploads DBMS Lab Experiment 4.pdf
 * STEP 6: ACADENCE synthesizes Lab Prep checklist & validates high confidence document relevance
 * STEP 7: Student views Projects (Backend Overdue → PROJECT RISK DETECTED on downstream chain)
 * STEP 8: Student views Exams (AI Exam Planner distributes syllabus topics around assignment deadlines)
 * STEP 9: Student views Today's Action Plan (Full synthesis into prioritized actionable schedule)
 */

export class DemoController {
  constructor(store, facultyComponent, studentComponent, containerId) {
    this.store = store;
    this.faculty = facultyComponent;
    this.student = studentComponent;
    this.container = document.getElementById(containerId);
    this.currentStep = 1;

    this.steps = [
      {
        num: 1,
        title: 'Step 1: Faculty Publishes Assignment',
        desc: 'Faculty publishes DBMS Assignment 3 (Due: Friday 5 PM, PDF, ER Diagram, SQL Queries, Report).',
        actionName: 'Simulate Step 1'
      },
      {
        num: 2,
        title: 'Step 2: AI Requirement Extraction',
        desc: 'ACADENCE extracts structured requirements, generates submission checklist, and calculates workload (4–6 hrs).',
        actionName: 'View Step 2'
      },
      {
        num: 3,
        title: 'Step 3: Faculty Edits Deadline & Format',
        desc: 'Faculty shifts deadline from Friday to Wednesday and format from PDF to DOCX.',
        actionName: 'Execute Step 3'
      },
      {
        num: 4,
        title: 'Step 4: AI Detects Urgent Change',
        desc: 'ACADENCE detects 2 fewer prep days, escalates priority to High, and issues URGENT ACADEMIC UPDATE.',
        actionName: 'View Step 4'
      },
      {
        num: 5,
        title: 'Step 5: Faculty Lab Announcement & PDF',
        desc: 'Faculty broadcasts "Experiment 4: Joins" and uploads DBMS Lab Experiment 4.pdf.',
        actionName: 'Execute Step 5'
      },
      {
        num: 6,
        title: 'Step 6: AI Lab Prep & Document Intelligence',
        desc: 'ACADENCE matches PDF with high confidence and builds 45–60 min pre-lab action checklist.',
        actionName: 'View Step 6'
      },
      {
        num: 7,
        title: 'Step 7: Project Dependency Risk Detection',
        desc: 'Backend task is overdue; ACADENCE blamelessly analyzes ripple effect on Frontend, Testing & Final Delivery.',
        actionName: 'View Step 7'
      },
      {
        num: 8,
        title: 'Step 8: AI Exam Study Balancer',
        desc: 'DBMS Final Exam syllabus is distributed across study days, balancing around Assignment 3 submission.',
        actionName: 'View Step 8'
      },
      {
        num: 9,
        title: 'Step 9: Today\'s Action Plan Recalculated',
        desc: 'ACADENCE fuses changes, lab prep, and exam study into a realistic 3h 45m schedule with buffer.',
        actionName: 'View Step 9'
      }
    ];
  }

  render() {
    if (!this.container) return;

    this.container.innerHTML = `
      <div class="demo-controller-bar">
        <div class="demo-bar-left">
          <div class="demo-badge">
            <span class="pulse-dot"></span>
            HACKATHON DEMO WALKTHROUGH
          </div>
          <div class="demo-step-info">
            <span class="step-counter">Step ${this.currentStep} of 9:</span>
            <strong class="step-title">${this.steps[this.currentStep - 1].title}</strong>
            <span class="step-desc text-muted">${this.steps[this.currentStep - 1].desc}</span>
          </div>
        </div>

        <div class="demo-bar-right">
          <div class="step-pills">
            ${this.steps.map(s => `
              <button class="step-pill ${s.num === this.currentStep ? 'active' : (s.num < this.currentStep ? 'completed' : '')}" data-step="${s.num}" title="${s.title}">
                ${s.num}
              </button>
            `).join('')}
          </div>

          <div class="demo-nav-actions">
            <button class="btn btn-secondary btn-sm" id="btn-demo-prev" ${this.currentStep === 1 ? 'disabled' : ''}>
              ← Back
            </button>
            <button class="btn btn-primary btn-sm" id="btn-demo-trigger">
              ${this.steps[this.currentStep - 1].actionName}
            </button>
            <button class="btn btn-secondary btn-sm" id="btn-demo-next" ${this.currentStep === 9 ? 'disabled' : ''}>
              Next Step →
            </button>
            <button class="btn btn-secondary btn-xs btn-reset-demo" id="btn-reset-demo" title="Reset all state to initial demo">
              ↺ Reset
            </button>
          </div>
        </div>
      </div>
    `;

    this.bindEvents();
  }

  goToStep(stepNum) {
    this.currentStep = Math.max(1, Math.min(9, stepNum));
    this.render();
    this.executeStep(this.currentStep);
  }

  executeStep(stepNum) {
    switch (stepNum) {
      case 1:
        // Ensure Assignment 3 is at initial Friday, PDF
        this.store.setViewMode('split');
        this.faculty.activeTab = 'assignments';
        this.faculty.render();
        break;

      case 2:
        // Student views extracted requirements & checklist
        this.store.setViewMode('split');
        this.student.activeTab = 'tasks';
        this.student.render();
        break;

      case 3:
        // Faculty updates DBMS Assignment 3 to Wednesday, DOCX
        this.store.setViewMode('split');
        this.faculty.activeTab = 'assignments';
        this.faculty.render();
        // Trigger the actual update if not yet Wednesday
        const asg = this.store.getState().assignments.find(a => a.id === 'asg_dbms_3');
        if (asg && asg.deadline.includes('Friday')) {
          this.store.updateAssignment('asg_dbms_3', {
            deadline: 'Wednesday, 5:00 PM',
            submissionFormat: 'DOCX',
            pageLimit: '10 pages'
          });
        }
        break;

      case 4:
        // Student views Urgent Academic Update & Changed Plan
        this.store.setViewMode('split');
        this.student.activeTab = 'changes';
        this.student.render();
        break;

      case 5:
        // Faculty posts lab announcement & uploads material
        this.store.setViewMode('split');
        this.faculty.activeTab = 'announcements';
        this.faculty.render();
        break;

      case 6:
        // Student views Lab Prep Blueprint & Document Intelligence
        this.store.setViewMode('split');
        this.student.activeTab = 'lab';
        this.student.render();
        break;

      case 7:
        // Student views Project Dependency Risks
        this.store.setViewMode('split');
        this.student.activeTab = 'projects';
        this.student.render();
        break;

      case 8:
        // Student views Exam Planner
        this.store.setViewMode('split');
        this.student.activeTab = 'exams';
        this.student.render();
        break;

      case 9:
        // Student views Today's Action Plan
        this.store.setViewMode('split');
        this.student.activeTab = 'plan';
        this.student.render();
        break;
    }
  }

  bindEvents() {
    this.container.querySelectorAll('.step-pill').forEach(pill => {
      pill.addEventListener('click', (e) => {
        const stepNum = parseInt(e.currentTarget.dataset.step, 10);
        this.goToStep(stepNum);
      });
    });

    const btnTrigger = this.container.querySelector('#btn-demo-trigger');
    if (btnTrigger) {
      btnTrigger.addEventListener('click', () => {
        this.executeStep(this.currentStep);
        if (this.currentStep < 9) {
          this.goToStep(this.currentStep + 1);
        }
      });
    }

    const btnPrev = this.container.querySelector('#btn-demo-prev');
    if (btnPrev) {
      btnPrev.addEventListener('click', () => {
        if (this.currentStep > 1) {
          this.goToStep(this.currentStep - 1);
        }
      });
    }

    const btnNext = this.container.querySelector('#btn-demo-next');
    if (btnNext) {
      btnNext.addEventListener('click', () => {
        if (this.currentStep < 9) {
          this.goToStep(this.currentStep + 1);
        }
      });
    }

    const btnReset = this.container.querySelector('#btn-reset-demo');
    if (btnReset) {
      btnReset.addEventListener('click', () => {
        if (confirm('Reset prototype demo state to initial configuration?')) {
          this.store.resetToDefault();
          this.goToStep(1);
        }
      });
    }
  }
}

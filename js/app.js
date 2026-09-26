/**
 * ACADENCE - Application Bootstrapper
 * Tagline: FROM ACADEMIC INFORMATION TO ACTION
 * 
 * Coordinates the reactive bridge between Virtual LMS (Faculty) and ACADENCE (Student).
 */

import { store } from './store.js';
import { AcadenceAIEngine } from './ai-engine.js';
import { FacultyLMSComponent } from './components/faculty-lms.js';
import { AcadenceStudentComponent } from './components/acadence-student.js';
import { DemoController } from './components/demo-controller.js';

class AcadenceApp {
  constructor() {
    this.store = store;
    this.aiEngine = new AcadenceAIEngine(this.store);

    this.faculty = new FacultyLMSComponent(this.store, 'faculty-lms-container');
    this.student = new AcadenceStudentComponent(this.store, this.aiEngine, 'acadence-student-container');
    this.demoController = new DemoController(this.store, this.faculty, this.student, 'demo-controller-container');

    this.init();
  }

  init() {
    // Render components
    this.faculty.render();
    this.student.render();
    this.demoController.render();

    // Subscribe to store updates for automatic reactive re-render
    this.store.subscribe((state) => {
      this.updateViewMode(state.viewMode);
      this.faculty.render();
      this.student.render();
    });

    // Initial view mode
    this.updateViewMode(this.store.getState().viewMode);
    this.bindViewSwitcher();
  }

  bindViewSwitcher() {
    document.querySelectorAll('.view-switcher-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const mode = e.currentTarget.dataset.mode;
        this.store.setViewMode(mode);
      });
    });
  }

  updateViewMode(mode) {
    const mainContainer = document.getElementById('app-main-layout');
    const facultyPane = document.getElementById('faculty-lms-container');
    const studentPane = document.getElementById('acadence-student-container');

    document.querySelectorAll('.view-switcher-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.mode === mode);
    });

    if (mainContainer) {
      mainContainer.className = `app-layout layout-${mode}`;
    }

    if (mode === 'split') {
      if (facultyPane) facultyPane.style.display = 'block';
      if (studentPane) studentPane.style.display = 'block';
    } else if (mode === 'student') {
      if (facultyPane) facultyPane.style.display = 'none';
      if (studentPane) studentPane.style.display = 'block';
    } else if (mode === 'faculty') {
      if (facultyPane) facultyPane.style.display = 'block';
      if (studentPane) studentPane.style.display = 'none';
    }
  }
}

// Bootstrap on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  window.acadenceApp = new AcadenceApp();
});

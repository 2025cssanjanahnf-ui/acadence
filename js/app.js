/**
 * ACADENCE - Application Bootstrapper
 * Tagline: FROM ACADEMIC INFORMATION TO ACTION
 * 
 * Unifies the platform into ONE coherent, light ACADENCE product.
 * Preserves the reactive bridge between Faculty LMS actions and student intelligence.
 */

import { store } from './store.js';
import { AcadenceAIEngine } from './ai-engine.js';
import { FacultyLMSComponent } from './components/faculty-lms.js';
import { AcadenceStudentComponent } from './components/acadence-student.js';

class AcadenceApp {
  constructor() {
    this.store = store;
    this.aiEngine = new AcadenceAIEngine(this.store);

    this.student = new AcadenceStudentComponent(
      this.store,
      this.aiEngine,
      'acadence-student-container'
    );

    this.faculty = new FacultyLMSComponent(
      this.store,
      'faculty-lms-container'
    );

    this.init();
  }

  init() {
    const params = new URLSearchParams(window.location.search);
    const facultyMode = params.get('faculty') === '1';

    const studentContainer = document.getElementById('acadence-student-container');
    const facultyContainer = document.getElementById('faculty-lms-container');

    if (facultyMode) {
      document.body.classList.add('faculty-mode');
      if (studentContainer) studentContainer.style.display = 'none';
      if (facultyContainer) {
        facultyContainer.classList.remove('faculty-hidden');
        facultyContainer.style.display = 'block';
        this.faculty.render();
      }
    } else {
      if (facultyContainer) facultyContainer.style.display = 'none';
      if (studentContainer) {
        studentContainer.style.display = 'block';
        this.student.render();
      }
    }

    // Reactive store subscription: re-render on any LMS update
    this.store.subscribe(() => {
      if (facultyMode) {
        this.faculty.render();
      } else {
        this.student.render();
      }
    });
  }
}

new AcadenceApp();
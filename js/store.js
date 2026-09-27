/**
 * ACADENCE - Reactive Academic Data Layer & Store
 * Tagline: FROM ACADEMIC INFORMATION TO ACTION
 * 
 * Centralized state for ACADENCE.
 * Clean, student-facing academic data structures.
 * Connects LMS updates directly to the student platform.
 */

class AcadenceStore {
  constructor() {
    this.subscribers = [];
    this.initDefaultState();
  }

  initDefaultState() {
    this.state = {
      // Courses
      courses: [
        { id: 'CS301', name: 'Database Management Systems (DBMS)', code: 'CS301', faculty: 'Professor', credits: 4, color: '#4f46e5' },
        { id: 'CS201', name: 'Data Structures & Algorithms (DSA)', code: 'CS201', faculty: 'DSA Faculty', credits: 4, color: '#ea580c' },
        { id: 'CS302', name: 'Operating Systems (OS)', code: 'CS302', faculty: 'OS Faculty', credits: 4, color: '#d97706' },
        { id: 'CS303', name: 'Computer Networks (CN)', code: 'CS303', faculty: 'Professor', credits: 3, color: '#2563eb' },
        { id: 'CS305', name: 'Web Development', code: 'CS305', faculty: 'Professor', credits: 3, color: '#0d9488' }
      ],

      // Assignments & Submissions
      assignments: [
        {
          id: 'asg_dbms_3',
          title: 'DBMS Assignment 3',
          courseId: 'CS301',
          courseName: 'DBMS',
          description: 'Prepare ER diagram and SQL queries. Upload the report through the LMS portal.',
          deadline: 'Wednesday, 5:00 PM',
          rawDeadline: 'Wednesday, 5:00 PM',
          dueDay: 'Wednesday',
          dueDate: 'Oct 01',
          dueTime: '5:00 PM',
          estimatedWorkload: '~1 hr',
          urgencyLevel: 'urgent', // 'urgent' (red), 'upcoming' (orange), 'this_week' (yellow), 'normal' (blue), 'completed' (green)
          status: 'Needs Attention',
          context: 'Deadline changed from Friday to Wednesday.',
          submissionFormat: 'PDF',
          pageLimit: '10 pages',
          submissionLocation: 'LMS portal',
          isGroup: false,
          requiredSections: ['ER diagram', 'SQL queries', 'Normalization explanation'],
          requiredFiles: ['Report.pdf'],
          presentationRequired: 'Not specified',
          additionalInstructions: 'Ensure SQL queries are tested against PostgreSQL schema provided in Unit 2.',
          marks: 'Not specified',
          published: true,
          version: 2,
          createdAt: '2026-09-24T09:00:00Z',
          updatedAt: '2026-09-27T08:30:00Z',
          history: [
            {
              version: 2,
              deadline: 'Wednesday, 5:00 PM',
              format: 'PDF',
              pageLimit: '10 pages',
              timestamp: 'Today, 08:30 AM',
              note: 'Deadline shifted earlier from Friday to Wednesday'
            },
            {
              version: 1,
              deadline: 'Friday, 5:00 PM',
              format: 'PDF',
              pageLimit: '10 pages',
              timestamp: '3 days ago',
              note: 'Initial publishing'
            }
          ]
        },
        {
          id: 'asg_os_2',
          title: 'OS Tutorial 2',
          courseId: 'CS302',
          courseName: 'Operating Systems',
          description: 'Solve the bounded-buffer producer-consumer problem using POSIX semaphores and mutexes.',
          deadline: 'Monday, 11:59 PM',
          rawDeadline: 'Monday, 11:59 PM',
          dueDay: 'Monday',
          dueDate: 'Oct 06',
          dueTime: '11:59 PM',
          estimatedWorkload: '~1 hr',
          urgencyLevel: 'this_week',
          status: 'This Week',
          context: 'Practice problems on Semaphore synchronization and mutex locking.',
          submissionFormat: 'PDF',
          pageLimit: '5 pages',
          submissionLocation: 'LMS portal',
          isGroup: false,
          requiredSections: ['Synchronization Pseudo-code', 'Deadlock Analysis', 'Output Traces'],
          requiredFiles: ['solution.pdf', 'main.c'],
          presentationRequired: 'Not specified',
          additionalInstructions: 'Include terminal screenshots of execution without race conditions.',
          marks: '25 Marks',
          published: true,
          version: 1,
          createdAt: '2026-09-23T11:00:00Z',
          updatedAt: '2026-09-23T11:00:00Z',
          history: [
            {
              version: 1,
              deadline: 'Monday, 11:59 PM',
              format: 'PDF',
              pageLimit: '5 pages',
              timestamp: '4 days ago',
              note: 'Initial publishing'
            }
          ]
        },
        {
          id: 'asg_cn_1',
          title: 'CN Socket Programming Assignment',
          courseId: 'CS303',
          courseName: 'Computer Networks',
          description: 'Implement a multi-client TCP chat server with connection multiplexing using select() or poll().',
          deadline: 'Next Friday, 5:00 PM',
          rawDeadline: 'Next Friday, 5:00 PM',
          dueDay: 'Friday',
          dueDate: 'Oct 10',
          dueTime: '5:00 PM',
          estimatedWorkload: '~2 hr',
          urgencyLevel: 'normal',
          status: 'Upcoming',
          context: 'Multi-client TCP communication with connection multiplexing.',
          submissionFormat: 'ZIP',
          pageLimit: 'Not specified',
          submissionLocation: 'LMS portal',
          isGroup: true,
          requiredSections: ['Architecture Diagram', 'Socket Lifecycle Explanation', 'Performance Benchmarks'],
          requiredFiles: ['chat_server.c', 'chat_client.c', 'Makefile', 'report.pdf'],
          presentationRequired: 'Yes',
          additionalInstructions: 'Live demonstration will be conducted during lab hours.',
          marks: '50 Marks',
          published: true,
          version: 1,
          createdAt: '2026-09-22T14:30:00Z',
          updatedAt: '2026-09-22T14:30:00Z',
          history: [
            {
              version: 1,
              deadline: 'Next Friday, 5:00 PM',
              format: 'ZIP',
              pageLimit: 'Not specified',
              timestamp: '5 days ago',
              note: 'Initial publishing'
            }
          ]
        }
      ],

      // Announcements from Faculty
      announcements: [
        {
          id: 'ann_dsa_1',
          courseId: 'CS201',
          courseName: 'DSA',
          author: 'DSA Faculty',
          title: 'Upcoming DSA Lab Session: Program 4',
          content: 'Upcoming DSA Lab will cover Program 4: Singly Linked List operations. Students should prepare the required program before attending the lab session.',
          timestamp: 'Today, 08:30 AM',
          source: 'DSA Faculty Announcement',
          programNumber: 4,
          topic: 'Singly Linked List'
        },
        {
          id: 'ann_os_1',
          courseId: 'CS302',
          courseName: 'Operating Systems',
          author: 'OS Faculty',
          title: 'OS Tutorial 2 Notes Uploaded',
          content: 'Practice problems on Semaphore synchronization and mutex locking have been uploaded for Monday preparation.',
          timestamp: 'Yesterday, 04:15 PM',
          source: 'OS Faculty Announcement'
        }
      ],

      // LMS Document Repository (Real 44-Page DSA PDF as primary lab source)
      documents: [
        {
          id: 'doc_dsa_lab',
          filename: 'Lab Manual 1-10 Programs.pdf',
          filePath: 'docs/Lab Manual 1-10 Programs.pdf',
          courseId: 'CS201',
          courseName: 'DSA',
          title: 'DSA Lab Record (Programs 1 to 10)',
          type: 'PDF',
          category: 'Lab Manual',
          pageCount: 44,
          size: '245 KB',
          updatedAt: 'Sep 24, 2026',
          usedIn: 'Lab Prep'
        },
        {
          id: 'doc_dbms_guide',
          filename: 'DBMS Assignment 3 Guide.pdf',
          filePath: 'docs/Lab Manual 1-10 Programs.pdf', // Fallback accessible viewer path
          courseId: 'CS301',
          courseName: 'DBMS',
          title: 'Relational Schema & Query Specifications',
          type: 'PDF',
          category: 'Assignment Guide',
          pageCount: 8,
          size: '1.2 MB',
          updatedAt: 'Sep 22, 2026',
          usedIn: 'DBMS Assignment 3'
        },
        {
          id: 'doc_os_notes',
          filename: 'OS Semaphore & Mutex Notes.pdf',
          filePath: 'docs/Lab Manual 1-10 Programs.pdf',
          courseId: 'CS302',
          courseName: 'Operating Systems',
          title: 'Process Synchronization Lecture Slides',
          type: 'PDF',
          category: 'General Notes',
          pageCount: 16,
          size: '2.4 MB',
          updatedAt: 'Sep 20, 2026',
          usedIn: 'OS Tutorial 2'
        },
        {
          id: 'doc_cn_lab',
          filename: 'CN Socket Programming Manual.pdf',
          filePath: 'docs/Lab Manual 1-10 Programs.pdf',
          courseId: 'CS303',
          courseName: 'Computer Networks',
          title: 'TCP/IP Socket API Handbook',
          type: 'PDF',
          category: 'Lab Manual',
          pageCount: 22,
          size: '3.1 MB',
          updatedAt: 'Sep 18, 2026',
          usedIn: 'CN Assignment'
        }
      ],

      // Projects (Visual dependency chain with self-managed Done buttons)
      projects: [
        {
          id: 'proj_web_app',
          title: 'College Web Application',
          courseId: 'CS305',
          courseName: 'Web Development',
          teamName: 'Dev Squad 4',
          description: 'Full-stack university portal with course registration and student records.',
          currentStudentMember: 'Member B',
          tasks: [
            {
              id: 'task_backend',
              name: 'Backend',
              owner: 'Member A',
              dueDay: 'Sep 20',
              status: 'overdue', // 'overdue', 'waiting', 'in_progress', 'done'
              isMyTask: false,
              dependsOn: []
            },
            {
              id: 'task_frontend',
              name: 'Frontend',
              owner: 'Member B',
              dueDay: 'Sep 22',
              status: 'waiting',
              isMyTask: true, // Current student
              dependsOn: ['task_backend']
            },
            {
              id: 'task_testing',
              name: 'Testing',
              owner: 'Member C',
              dueDay: 'Sep 24',
              status: 'waiting',
              isMyTask: false,
              dependsOn: ['task_frontend']
            },
            {
              id: 'task_docs',
              name: 'Documentation',
              owner: 'Member D',
              dueDay: 'Sep 25',
              status: 'upcoming',
              isMyTask: false,
              dependsOn: ['task_testing']
            },
            {
              id: 'task_final',
              name: 'Final Submission',
              owner: 'Team',
              dueDay: 'Sep 28',
              status: 'upcoming',
              isMyTask: false,
              dependsOn: ['task_docs']
            }
          ]
        }
      ],

      // Exams (Faculty syllabus-backed topics, not a study planner)
      exams: [
        {
          id: 'exam_dbms',
          subject: 'DBMS',
          courseCode: 'CS301',
          date: 'October 20',
          isoDate: '2026-10-20',
          weightage: '40% of Final Grade',
          source: 'Faculty Examination Guide',
          topics: [
            'ER Model & Relational Algebra',
            'SQL & Complex Joins',
            'Normalization (1NF, 2NF, 3NF, BCNF)',
            'Transactions & Concurrency Control'
          ]
        },
        {
          id: 'exam_os',
          subject: 'Operating Systems',
          courseCode: 'CS302',
          date: 'October 28',
          isoDate: '2026-10-28',
          weightage: '40% of Final Grade',
          source: 'Faculty Syllabus Document',
          topics: [
            'Processes & Threads',
            'CPU Scheduling Algorithms',
            'Synchronization & Deadlocks',
            'Memory Management & Paging'
          ]
        }
      ],

      // Academic Changes (Grouped by assignment, student-facing impact)
      changes: [
        {
          id: 'change_dbms_deadline',
          assignmentId: 'asg_dbms_3',
          courseName: 'DBMS',
          title: 'DBMS Assignment 3',
          badge: 'Action Required',
          urgency: 'high',
          timestamp: 'Today, 08:30 AM',
          changes: [
            {
              field: 'Deadline',
              from: 'Friday, 5:00 PM',
              to: 'Wednesday, 5:00 PM'
            }
          ],
          whyItMatters: 'You now have 2 fewer preparation days.'
        }
      ],

      // User adjusted workload estimates
      adjustedWorkload: {}
    };

    // Restore state from localStorage if valid
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const saved = window.localStorage.getItem('acadence_v2_state');
        if (saved) {
          const parsed = JSON.parse(saved);
          this.state = { ...this.state, ...parsed };
        }
      }
    } catch (e) {
      console.warn('Could not restore state from storage', e);
    }
  }

  save() {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem('acadence_v2_state', JSON.stringify(this.state));
      }
    } catch (e) {
      console.warn('Could not save state', e);
    }
    this.notify();
  }

  resetToDefault() {
    localStorage.removeItem('acadence_v2_state');
    this.initDefaultState();
    this.save();
  }

  subscribe(listener) {
    this.subscribers.push(listener);
    return () => {
      this.subscribers = this.subscribers.filter(l => l !== listener);
    };
  }

  notify() {
    this.subscribers.forEach(cb => {
      try {
        cb(this.state);
      } catch (err) {
        console.error('Store subscriber error:', err);
      }
    });
  }

  getState() {
    return this.state;
  }

  // --- WORKLOAD ESTIMATION ADJUSTMENT ---
  adjustWorkload(itemId, newEstimate) {
    this.state.adjustedWorkload[itemId] = newEstimate;
    const asg = this.state.assignments.find(a => a.id === itemId);
    if (asg) {
      asg.estimatedWorkload = newEstimate;
    }
    this.save();
  }

  // --- PROJECT TASK COMPLETION FLOW ---
  markProjectTaskDone(projectId, taskId) {
    const project = this.state.projects.find(p => p.id === projectId);
    if (!project) return null;

    const task = project.tasks.find(t => t.id === taskId);
    if (!task) return null;

    // Mark task done
    task.status = 'done';

    // Update downstream tasks
    project.tasks.forEach(t => {
      if (t.dependsOn && t.dependsOn.includes(taskId)) {
        // Check if all dependencies are done
        const allDepsDone = t.dependsOn.every(depId => {
          const dep = project.tasks.find(pt => pt.id === depId);
          return dep && dep.status === 'done';
        });

        if (allDepsDone && t.status === 'waiting') {
          t.status = 'in_progress';
        }
      }
    });

    this.save();
    return task;
  }

  // --- FACULTY / LMS MUTATIONS ---

  publishAssignment(assignmentData) {
    const newAsg = {
      id: assignmentData.id || `asg_${Date.now()}`,
      title: assignmentData.title,
      courseId: assignmentData.courseId,
      courseName: assignmentData.courseName,
      description: assignmentData.description || '',
      deadline: assignmentData.deadline,
      rawDeadline: assignmentData.deadline,
      dueDay: assignmentData.dueDay || 'Upcoming',
      dueDate: assignmentData.dueDate || 'Soon',
      dueTime: assignmentData.dueTime || '5:00 PM',
      estimatedWorkload: assignmentData.estimatedWorkload || '~1 hr',
      urgencyLevel: 'this_week',
      status: 'Upcoming',
      context: assignmentData.context || 'New assignment published on LMS.',
      submissionFormat: assignmentData.submissionFormat || 'Not specified',
      pageLimit: assignmentData.pageLimit || 'Not specified',
      submissionLocation: assignmentData.submissionLocation || 'LMS portal',
      isGroup: Boolean(assignmentData.isGroup),
      requiredSections: assignmentData.requiredSections || ['Not specified'],
      requiredFiles: assignmentData.requiredFiles || ['Not specified'],
      presentationRequired: assignmentData.presentationRequired || 'Not specified',
      additionalInstructions: assignmentData.additionalInstructions || 'Not specified',
      marks: assignmentData.marks || 'Not specified',
      published: true,
      version: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      history: [
        {
          version: 1,
          deadline: assignmentData.deadline,
          format: assignmentData.submissionFormat || 'Not specified',
          pageLimit: assignmentData.pageLimit || 'Not specified',
          timestamp: 'Just now',
          note: 'Initial publishing'
        }
      ]
    };

    this.state.assignments.unshift(newAsg);
    this.save();
    return newAsg;
  }

  updateAssignment(assignmentId, updates) {
    const asg = this.state.assignments.find(a => a.id === assignmentId);
    if (!asg) return null;

    const oldDeadline = asg.deadline;
    const oldFormat = asg.submissionFormat;
    const oldPageLimit = asg.pageLimit;

    const changedFields = [];
    if (updates.deadline && updates.deadline !== oldDeadline) {
      changedFields.push({
        field: 'Deadline',
        from: oldDeadline,
        to: updates.deadline
      });
      asg.deadline = updates.deadline;
      asg.rawDeadline = updates.deadline;
    }
    if (updates.submissionFormat && updates.submissionFormat !== oldFormat) {
      changedFields.push({
        field: 'Format',
        from: oldFormat,
        to: updates.submissionFormat
      });
      asg.submissionFormat = updates.submissionFormat;
    }
    if (updates.pageLimit && updates.pageLimit !== oldPageLimit) {
      changedFields.push({
        field: 'Page Limit',
        from: oldPageLimit,
        to: updates.pageLimit
      });
      asg.pageLimit = updates.pageLimit;
    }

    if (updates.title) asg.title = updates.title;
    if (updates.description) asg.description = updates.description;

    asg.version = (asg.version || 1) + 1;
    asg.updatedAt = new Date().toISOString();

    // Determine impact statement grounded in data
    let impact = 'Review updated assignment requirements.';
    let badge = 'Academic Update';
    let urgency = 'medium';

    if (changedFields.some(c => c.field === 'Deadline')) {
      const isEarlier = updates.deadline.toLowerCase().includes('wednesday') && oldDeadline.toLowerCase().includes('friday');
      if (isEarlier) {
        impact = 'You now have 2 fewer preparation days.';
        badge = 'Action Required';
        urgency = 'high';
        asg.urgencyLevel = 'urgent';
        asg.status = 'Needs Attention';
        asg.context = `Deadline changed from ${oldDeadline} to ${updates.deadline}.`;
      } else {
        impact = `Deadline updated from ${oldDeadline} to ${updates.deadline}.`;
        badge = 'Needs Attention';
        urgency = 'medium';
      }
    }

    if (changedFields.some(c => c.field === 'Format')) {
      impact += ` Template re-export required for ${updates.submissionFormat}.`;
    }

    // Add grouped change record
    if (changedFields.length > 0) {
      asg.history.unshift({
        version: asg.version,
        deadline: asg.deadline,
        format: asg.submissionFormat,
        pageLimit: asg.pageLimit,
        timestamp: 'Just now',
        note: changedFields.map(c => `${c.field}: ${c.from} → ${c.to}`).join(', ')
      });

      this.state.changes.unshift({
        id: `change_${Date.now()}`,
        assignmentId: asg.id,
        courseName: asg.courseName,
        title: asg.title,
        badge: badge,
        urgency: urgency,
        timestamp: 'Just now',
        changes: changedFields,
        whyItMatters: impact
      });
    }

    this.save();
    return asg;
  }

  publishAnnouncement(annData) {
    const newAnn = {
      id: annData.id || `ann_${Date.now()}`,
      courseId: annData.courseId || 'CS201',
      courseName: annData.courseName || 'DSA',
      author: annData.author || 'Faculty',
      title: annData.title,
      content: annData.content,
      timestamp: 'Just now',
      source: `${annData.courseName || 'Faculty'} Announcement`,
      programNumber: annData.programNumber || null
    };

    this.state.announcements.unshift(newAnn);
    this.save();
    return newAnn;
  }

  uploadDocument(docData) {
    const newDoc = {
      id: docData.id || `doc_${Date.now()}`,
      filename: docData.filename,
      filePath: docData.filePath || 'docs/Lab Manual 1-10 Programs.pdf',
      courseId: docData.courseId || 'CS201',
      courseName: docData.courseName || 'DSA',
      title: docData.title || docData.filename,
      type: docData.type || 'PDF',
      category: docData.category || 'Lab Manual',
      pageCount: docData.pageCount || 10,
      size: docData.size || '1.0 MB',
      updatedAt: 'Just now',
      usedIn: docData.usedIn || 'Reference'
    };

    this.state.documents.unshift(newDoc);
    this.save();
    return newDoc;
  }

  updateExamDate(examId, newDate) {
    const exam = this.state.exams.find(e => e.id === examId);
    if (!exam) return null;

    const oldDate = exam.date;
    exam.date = newDate;

    this.state.changes.unshift({
      id: `change_exam_${Date.now()}`,
      assignmentId: exam.id,
      courseName: exam.subject,
      title: `${exam.subject} Final Exam Schedule`,
      badge: 'Academic Update',
      urgency: 'medium',
      timestamp: 'Just now',
      changes: [
        {
          field: 'Exam Date',
          from: oldDate,
          to: newDate
        }
      ],
      whyItMatters: `Exam date moved to ${newDate}. Remaining preparation timeline updated.`
    });

    this.save();
    return exam;
  }
}

export const store = new AcadenceStore();

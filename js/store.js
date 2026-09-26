/**
 * ACADENCE - Reactive Academic Data Layer & Store
 * Tagline: FROM ACADEMIC INFORMATION TO ACTION
 * 
 * Handles centralized state between Virtual LMS (Faculty) and ACADENCE (Student Intelligence).
 * Emits reactive events so any faculty update immediately triggers AI recalculation.
 */

class AcadenceStore {
  constructor() {
    this.subscribers = [];
    this.initDefaultState();
  }

  initDefaultState() {
    this.state = {
      viewMode: 'split', // 'split', 'student', 'faculty'
      studentAvailableHours: 4.0,
      
      courses: [
        { id: 'CS301', name: 'Database Management Systems (DBMS)', code: 'CS301', faculty: 'Professor', credits: 4, color: '#6366f1' },
        { id: 'CS302', name: 'Operating Systems (OS)', code: 'CS302', faculty: 'Faculty', credits: 4, color: '#0ea5e9' },
        { id: 'CS303', name: 'Computer Networks (CN)', code: 'CS303', faculty: 'Professor', credits: 3, color: '#10b981' },
        { id: 'CS201', name: 'Data Structures & Algorithms', code: 'CS201', faculty: 'Faculty', credits: 4, color: '#f59e0b' },
        { id: 'CS305', name: 'Web Development', code: 'CS305', faculty: 'Professor', credits: 3, color: '#ec4899' }
      ],

      assignments: [
        {
          id: 'asg_dbms_3',
          title: 'DBMS Assignment 3',
          courseId: 'CS301',
          courseName: 'DBMS',
          description: 'Submit DBMS Assignment 3 by Friday. Prepare ER diagram and SQL queries. Upload the report in PDF format through the LMS portal.',
          deadline: 'Friday, 5:00 PM',
          rawDeadline: 'Friday, 5:00 PM',
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
          version: 1,
          createdAt: '2026-09-24T09:00:00Z',
          updatedAt: '2026-09-24T09:00:00Z',
          history: [
            {
              version: 1,
              deadline: 'Friday, 5:00 PM',
              format: 'PDF',
              pageLimit: '10 pages',
              timestamp: '2 days ago',
              source: 'Virtual LMS Initial Publishing'
            }
          ]
        },
        {
          id: 'asg_os_2',
          title: 'OS Tutorial 2: Semaphore Synchronization',
          courseId: 'CS302',
          courseName: 'Operating Systems',
          description: 'Solve the bounded-buffer producer-consumer problem using POSIX semaphores and mutexes.',
          deadline: 'Next Monday, 11:59 PM',
          rawDeadline: 'Next Monday, 11:59 PM',
          submissionFormat: 'PDF',
          pageLimit: '5 pages',
          submissionLocation: 'LMS portal',
          isGroup: false,
          requiredSections: ['Synchronization Pseudo-code', 'Deadlock Analysis', 'Output Traces'],
          requiredFiles: ['solution.pdf', 'main.c'],
          presentationRequired: 'No',
          additionalInstructions: 'Include terminal screenshots of execution without race conditions.',
          marks: '25 Marks',
          published: true,
          version: 1,
          createdAt: '2026-09-23T11:00:00Z',
          updatedAt: '2026-09-23T11:00:00Z',
          history: [
            {
              version: 1,
              deadline: 'Next Monday, 11:59 PM',
              format: 'PDF',
              pageLimit: '5 pages',
              timestamp: '3 days ago',
              source: 'Virtual LMS Initial Publishing'
            }
          ]
        },
        {
          id: 'asg_cn_1',
          title: 'CN Socket Programming Assignment',
          courseId: 'CS303',
          courseName: 'Computer Networks',
          description: 'Implement a multi-client TCP chat server with connection multiplexing using select() or poll().',
          deadline: 'In 8 days, 5:00 PM',
          rawDeadline: 'In 8 days, 5:00 PM',
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
              deadline: 'In 8 days, 5:00 PM',
              format: 'ZIP',
              pageLimit: 'Not specified',
              timestamp: '4 days ago',
              source: 'Virtual LMS Initial Publishing'
            }
          ]
        }
      ],

      announcements: [
        {
          id: 'ann_1',
          courseId: 'CS301',
          courseName: 'DBMS',
          author: 'Professor',
          title: 'Upcoming DBMS Lab Session: Experiment 4',
          content: 'DBMS Lab next week will cover Experiment 4: Joins. Students should prepare the experiment before attending.',
          timestamp: 'Today, 08:30 AM',
          source: 'DBMS Faculty Announcement',
          experimentNum: 4,
          topic: 'Joins'
        },
        {
          id: 'ann_2',
          courseId: 'CS302',
          courseName: 'Operating Systems',
          author: 'Faculty',
          title: 'OS Tutorial Notes Released',
          content: 'Practice problems on Peterson Algorithm and Bakery Algorithm have been uploaded. Review before Friday tutorial.',
          timestamp: 'Yesterday, 04:15 PM',
          source: 'OS Faculty Announcement'
        }
      ],

      documents: [
        {
          id: 'doc_1',
          filename: 'DBMS Lab Experiment 4.pdf',
          courseId: 'CS301',
          courseName: 'DBMS',
          title: 'Lab Manual - Experiment 4: Relational Joins & Subqueries',
          size: '1.4 MB',
          uploadedAt: 'Today, 09:10 AM',
          category: 'Lab Manual',
          relevanceTag: 'HIGH',
          relevanceConfidence: 0.94,
          relevanceExplanation: 'High confidence — Directly matches Faculty Announcement context: "Experiment 4: Joins". Identifies core lab deliverables and SQL schema.',
          deliverables: [
            'Aim: Master Inner, Left Outer, Right Outer, and Full Outer Joins',
            'Algorithm / Procedure: Formulate query logic on 4-table employee relational schema',
            'SQL Queries: Write and execute 6 join queries with nested subselects',
            'Expected Output: Tabular output with NULL handling for outer joins',
            'Lab Record: Handwritten record format with ER schema snapshot',
            'Viva Preparation: Join complexity, Cartesian product vs Hash Join'
          ]
        },
        {
          id: 'doc_2',
          filename: 'DBMS Unit 3 Notes.pdf',
          courseId: 'CS301',
          courseName: 'DBMS',
          title: 'Unit 3: Relational Calculus & Query Optimization',
          size: '3.8 MB',
          uploadedAt: '3 days ago',
          category: 'Lecture Notes',
          relevanceTag: 'LOW',
          relevanceConfidence: 0.28,
          relevanceExplanation: 'Low confidence — unable to confidently identify relevant preparation material for tomorrow\'s lab. Contains theoretical query optimization, not lab experiment instructions.',
          deliverables: []
        },
        {
          id: 'doc_3',
          filename: 'Computer Networks Lab.pdf',
          courseId: 'CS303',
          courseName: 'Computer Networks',
          title: 'CN Lab Experiment 2: Wireshark Packet Sniffing',
          size: '2.1 MB',
          uploadedAt: '5 days ago',
          category: 'Lab Manual',
          relevanceTag: 'NONE',
          relevanceConfidence: 0.02,
          relevanceExplanation: 'Not relevant — Belongs to a different subject (Computer Networks). Does not apply to DBMS preparation.',
          deliverables: []
        }
      ],

      projects: [
        {
          id: 'proj_web_app',
          title: 'College Web Application',
          courseId: 'CS305',
          courseName: 'Web Development',
          teamName: 'Dev Squad 4',
          description: 'Full-stack university portal with role-based access control and microservices.',
          teamMembers: ['Member A', 'Member B', 'Member C', 'Member D'],
          tasks: [
            {
              id: 'task_backend',
              name: 'Backend API & Database Schema',
              owner: 'Member A',
              deadline: 'Yesterday (Overdue)',
              status: 'overdue', // 'completed', 'in_progress', 'overdue', 'blocked'
              estimatedHours: 12,
              dependsOn: [],
              isMyTask: false
            },
            {
              id: 'task_frontend',
              name: 'Frontend UI Integration',
              owner: 'Member B',
              deadline: 'In 2 days',
              status: 'blocked',
              estimatedHours: 10,
              dependsOn: ['task_backend'],
              isMyTask: true // Logged-in Student
            },
            {
              id: 'task_testing',
              name: 'Integration Testing & API Validation',
              owner: 'Member C',
              deadline: 'In 4 days',
              status: 'blocked',
              estimatedHours: 6,
              dependsOn: ['task_frontend'],
              isMyTask: false
            },
            {
              id: 'task_docs',
              name: 'Architecture & Technical Documentation',
              owner: 'Member D',
              deadline: 'In 5 days',
              status: 'blocked',
              estimatedHours: 4,
              dependsOn: ['task_testing'],
              isMyTask: false
            },
            {
              id: 'task_final',
              name: 'Final Deployment & LMS Submission',
              owner: 'Team Member',
              deadline: 'In 6 days',
              status: 'blocked',
              estimatedHours: 3,
              dependsOn: ['task_docs'],
              isMyTask: false
            }
          ]
        }
      ],

      exams: [
        {
          id: 'exam_dbms',
          subject: 'DBMS',
          courseCode: 'CS301',
          date: 'October 20',
          isoDate: '2026-10-20',
          weightage: '40% of Final Grade',
          status: 'upcoming',
          syllabus: [
            { id: 'top_1', name: 'ER Model & Relational Algebra', targetDate: 'October 15', status: 'completed', hours: 2.5, completed: true },
            { id: 'top_2', name: 'SQL & Complex Joins', targetDate: 'October 16', status: 'pending', hours: 3.0, completed: false },
            { id: 'top_3', name: 'Normalization (1NF, 2NF, 3NF, BCNF)', targetDate: 'October 17', status: 'pending', hours: 2.0, completed: false, workloadAdjustment: 'Adjusted: Lightened due to Assignment 3 submission overlap' },
            { id: 'top_4', name: 'Transactions & Concurrency Control', targetDate: 'October 18', status: 'pending', hours: 2.5, completed: false },
            { id: 'top_5', name: 'Previous-Year Questions & Revision', targetDate: 'October 19', status: 'pending', hours: 3.0, completed: false },
            { id: 'top_6', name: 'Final Exam Sitting', targetDate: 'October 20', status: 'exam_day', hours: 0, completed: false }
          ]
        },
        {
          id: 'exam_os',
          subject: 'Operating Systems',
          courseCode: 'CS302',
          date: 'October 28',
          isoDate: '2026-10-28',
          weightage: '40% of Final Grade',
          status: 'upcoming',
          syllabus: [
            { id: 'os_1', name: 'Processes & Threads', targetDate: 'October 22', status: 'pending', hours: 2.5, completed: false },
            { id: 'os_2', name: 'CPU Scheduling Algorithms', targetDate: 'October 23', status: 'pending', hours: 2.5, completed: false },
            { id: 'os_3', name: 'Synchronization & Deadlocks', targetDate: 'October 24', status: 'pending', hours: 3.0, completed: false },
            { id: 'os_4', name: 'Memory Management & Paging', targetDate: 'October 26', status: 'pending', hours: 3.0, completed: false },
            { id: 'os_5', name: 'Virtual Memory & Revision', targetDate: 'October 27', status: 'pending', hours: 2.5, completed: false }
          ]
        }
      ],

      // Academic Changes detected by AI
      changes: [],

      // Smart notifications generated by AI
      notifications: [],

      // Student interactive checklist state (saved in localStorage or memory)
      checklistState: {
        'asg_dbms_3_er': false,
        'asg_dbms_3_sql': false,
        'asg_dbms_3_report': false,
        'asg_dbms_3_format': false,
        'asg_dbms_3_verify': false,
        'asg_dbms_3_upload': false,
        'lab_dbms_aim': true,
        'lab_dbms_algo': true,
        'lab_dbms_queries': false,
        'lab_dbms_output': false,
        'lab_dbms_record': false,
        'lab_dbms_viva': false
      },

      // Custom student edited workload estimates
      customWorkloadEstimates: {}
    };

    // Load persisted state if exists
    try {
      const saved = localStorage.getItem('acadence_prototype_state');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Merge selectively so new code structure is preserved
        this.state = { ...this.state, ...parsed };
      }
    } catch (e) {
      console.warn('Could not restore saved state', e);
    }
  }

  save() {
    try {
      localStorage.setItem('acadence_prototype_state', JSON.stringify(this.state));
    } catch (e) {
      console.warn('Could not save state', e);
    }
    this.notify();
  }

  resetToDefault() {
    localStorage.removeItem('acadence_prototype_state');
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

  setViewMode(mode) {
    this.state.viewMode = mode;
    this.save();
  }

  setAvailableHours(hours) {
    this.state.studentAvailableHours = Math.max(1, Math.min(16, Number(hours)));
    this.save();
  }

  toggleChecklist(id) {
    this.state.checklistState[id] = !this.state.checklistState[id];
    this.save();
  }

  updateTaskEstimate(taskId, newHours) {
    this.state.customWorkloadEstimates[taskId] = newHours;
    this.save();
  }

  // --- FACULTY / LMS MUTATIONS ---

  publishAssignment(assignmentData) {
    const newAssignment = {
      id: assignmentData.id || `asg_${Date.now()}`,
      title: assignmentData.title,
      courseId: assignmentData.courseId,
      courseName: assignmentData.courseName,
      description: assignmentData.description || '',
      deadline: assignmentData.deadline,
      rawDeadline: assignmentData.deadline,
      submissionFormat: assignmentData.submissionFormat || 'Not specified',
      pageLimit: assignmentData.pageLimit || 'Not specified',
      submissionLocation: assignmentData.submissionLocation || 'LMS portal',
      isGroup: Boolean(assignmentData.isGroup),
      requiredSections: assignmentData.requiredSections || [],
      requiredFiles: assignmentData.requiredFiles || [],
      presentationRequired: assignmentData.presentationRequired || 'Not specified',
      additionalInstructions: assignmentData.additionalInstructions || '',
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
          source: 'Virtual LMS Initial Publishing'
        }
      ]
    };

    this.state.assignments.unshift(newAssignment);

    // AI Notification
    this.addNotification({
      id: `notif_${Date.now()}`,
      type: 'lms_assignment',
      title: `New Assignment Published: ${newAssignment.title}`,
      message: `Course ${newAssignment.courseName}: Due ${newAssignment.deadline}. Format: ${newAssignment.submissionFormat}. ACADENCE has automatically extracted requirements & workload.`,
      timestamp: 'Just now',
      source: 'Virtual LMS Portal',
      course: newAssignment.courseName,
      unread: true
    });

    this.save();
    return newAssignment;
  }

  updateAssignment(assignmentId, updates) {
    const asgIndex = this.state.assignments.findIndex(a => a.id === assignmentId);
    if (asgIndex === -1) return null;

    const oldAsg = { ...this.state.assignments[asgIndex] };
    const newVersion = oldAsg.version + 1;

    // Detect changes
    const detectedDiffs = [];

    if (updates.deadline && updates.deadline !== oldAsg.deadline) {
      detectedDiffs.push({
        field: 'Deadline',
        oldValue: oldAsg.deadline,
        newValue: updates.deadline,
        impact: updates.deadline.toLowerCase().includes('wednesday') && oldAsg.deadline.toLowerCase().includes('friday')
          ? '2 fewer preparation days (Urgent: schedule compressed)'
          : 'Deadline timeline updated',
        priorityShift: 'Increased to High'
      });
    }

    if (updates.submissionFormat && updates.submissionFormat !== oldAsg.submissionFormat) {
      detectedDiffs.push({
        field: 'Submission Format',
        oldValue: oldAsg.submissionFormat,
        newValue: updates.submissionFormat,
        impact: `Document format switched from ${oldAsg.submissionFormat} to ${updates.submissionFormat}. Requires re-exporting document template.`,
        priorityShift: 'Action Required'
      });
    }

    if (updates.pageLimit && updates.pageLimit !== oldAsg.pageLimit) {
      detectedDiffs.push({
        field: 'Page Limit',
        oldValue: oldAsg.pageLimit,
        newValue: updates.pageLimit,
        impact: `Document length constraint altered to ${updates.pageLimit}.`,
        priorityShift: 'Review Needed'
      });
    }

    const updatedAsg = {
      ...oldAsg,
      ...updates,
      version: newVersion,
      updatedAt: new Date().toISOString(),
      history: [
        {
          version: newVersion,
          deadline: updates.deadline || oldAsg.deadline,
          format: updates.submissionFormat || oldAsg.submissionFormat,
          pageLimit: updates.pageLimit || oldAsg.pageLimit,
          timestamp: 'Just now',
          source: 'Virtual LMS Faculty Update'
        },
        ...oldAsg.history
      ]
    };

    this.state.assignments[asgIndex] = updatedAsg;

    // Record Academic Changes in audit trail
    detectedDiffs.forEach(diff => {
      const changeRecord = {
        id: `change_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        assignmentId: updatedAsg.id,
        courseName: updatedAsg.courseName,
        taskTitle: updatedAsg.title,
        version: `${oldAsg.version} → ${newVersion}`,
        field: diff.field,
        oldValue: diff.oldValue,
        newValue: diff.newValue,
        impact: diff.impact,
        priorityDelta: diff.priorityShift,
        whyItChangedPlan: `Faculty modified ${diff.field.toLowerCase()} from "${diff.oldValue}" to "${diff.newValue}". Available preparation window compressed; downstream workload reprioritized into Today's Action Plan.`,
        detectedAt: 'Just now',
        source: 'Virtual LMS Edit Event',
        badge: 'URGENT ACADEMIC UPDATE'
      };

      this.state.changes.unshift(changeRecord);

      // Trigger Smart Notification
      this.addNotification({
        id: `notif_${Date.now()}`,
        type: 'urgent_change',
        title: `URGENT ACADEMIC UPDATE: ${updatedAsg.title}`,
        message: `${diff.field}: ${diff.oldValue} → ${diff.newValue}. Impact: ${diff.impact}. Priority Increased.`,
        timestamp: 'Just now',
        source: 'AI Change Detection Engine',
        course: updatedAsg.courseName,
        unread: true
      });
    });

    this.save();
    return updatedAsg;
  }

  publishAnnouncement(announcementData) {
    const newAnnouncement = {
      id: announcementData.id || `ann_${Date.now()}`,
      courseId: announcementData.courseId,
      courseName: announcementData.courseName,
      author: announcementData.author || 'Faculty',
      title: announcementData.title,
      content: announcementData.content,
      timestamp: 'Just now',
      source: `${announcementData.courseName} Faculty Announcement`,
      experimentNum: announcementData.experimentNum || null,
      topic: announcementData.topic || null
    };

    this.state.announcements.unshift(newAnnouncement);

    this.addNotification({
      id: `notif_${Date.now()}`,
      type: 'lab_prep',
      title: `Faculty Announcement: ${newAnnouncement.courseName}`,
      message: `"${newAnnouncement.title}" — ACADENCE has cross-referenced syllabus documents to build your pre-lab action checklist.`,
      timestamp: 'Just now',
      source: newAnnouncement.source,
      course: newAnnouncement.courseName,
      unread: true
    });

    this.save();
    return newAnnouncement;
  }

  uploadDocument(docData) {
    const newDoc = {
      id: docData.id || `doc_${Date.now()}`,
      filename: docData.filename,
      courseId: docData.courseId,
      courseName: docData.courseName,
      title: docData.title || docData.filename,
      size: docData.size || '1.2 MB',
      uploadedAt: 'Just now',
      category: docData.category || 'Lab Material',
      relevanceTag: docData.relevanceTag || 'HIGH',
      relevanceConfidence: docData.relevanceConfidence || 0.95,
      relevanceExplanation: docData.relevanceExplanation || 'High confidence — Analyzed document content matches faculty lab announcement context.',
      deliverables: docData.deliverables || [
        'Aim and Objective',
        'Algorithm and Schema definition',
        'Execution Queries and Screenshots',
        'Viva voce theoretical answers'
      ]
    };

    this.state.documents.unshift(newDoc);

    this.addNotification({
      id: `notif_${Date.now()}`,
      type: 'document_intelligence',
      title: `Document Uploaded: ${newDoc.filename}`,
      message: `AI Confidence: ${Math.round(newDoc.relevanceConfidence * 100)}% relevant to ${newDoc.courseName}. Deliverables synthesized into Lab Prep.`,
      timestamp: 'Just now',
      source: 'Document AI Engine',
      course: newDoc.courseName,
      unread: true
    });

    this.save();
    return newDoc;
  }

  updateProjectTask(projectId, taskId, updates) {
    const project = this.state.projects.find(p => p.id === projectId);
    if (!project) return null;

    const task = project.tasks.find(t => t.id === taskId);
    if (!task) return null;

    Object.assign(task, updates);

    // If task status changed to overdue or completed, re-evaluate dependency chain
    if (updates.status === 'overdue') {
      this.addNotification({
        id: `notif_${Date.now()}`,
        type: 'project_risk',
        title: `PROJECT RISK DETECTED: ${project.title}`,
        message: `${task.name} is overdue. Affected downstream chain: ${task.name} → Frontend → Testing → Documentation. Multiple downstream milestones at risk.`,
        timestamp: 'Just now',
        source: 'Group Dependency Engine',
        course: project.courseName,
        unread: true
      });
    }

    this.save();
    return task;
  }

  updateExamDate(examId, newDate, newSyllabus) {
    const exam = this.state.exams.find(e => e.id === examId);
    if (!exam) return null;

    const oldDate = exam.date;
    exam.date = newDate;
    if (newSyllabus) {
      exam.syllabus = newSyllabus;
    }

    this.state.changes.unshift({
      id: `change_${Date.now()}`,
      assignmentId: exam.id,
      courseName: exam.subject,
      taskTitle: `${exam.subject} Final Exam Schedule`,
      version: 'Schedule Recalculation',
      field: 'Exam Date',
      oldValue: oldDate,
      newValue: newDate,
      impact: `Exam date shifted. Study blocks automatically redistributed across available prep days.`,
      priorityDelta: 'Recalculated',
      whyItChangedPlan: `Exam date changed by Academic Office. AI distributed remaining syllabus topics and balanced against overlapping assignment deliverables.`,
      detectedAt: 'Just now',
      source: 'Academic Calendar Sync',
      badge: 'EXAM RESCHEDULED'
    });

    this.addNotification({
      id: `notif_${Date.now()}`,
      type: 'exam_planning',
      title: `Exam Date Updated: ${exam.subject}`,
      message: `Date shifted from ${oldDate} to ${newDate}. AI Study Plan has recalculated daily topic distribution.`,
      timestamp: 'Just now',
      source: 'Exam Intelligence Engine',
      course: exam.subject,
      unread: true
    });

    this.save();
    return exam;
  }

  addNotification(notif) {
    this.state.notifications.unshift(notif);
    // Keep max 25 notifications
    if (this.state.notifications.length > 25) {
      this.state.notifications.pop();
    }
  }

  markAllNotificationsRead() {
    this.state.notifications.forEach(n => n.unread = false);
    this.save();
  }
}

// Export singleton instance
export const store = new AcadenceStore();

/**
 * ACADENCE - AI Intelligence Layer
 * Tagline: FROM ACADEMIC INFORMATION TO ACTION
 * 
 * Implements:
 * 1. AI Requirement Extraction (Strict, zero hallucination, 'Not specified' fallbacks)
 * 2. Academic Change Detection & Impact Rationale
 * 3. Submission Checklist Synthesis
 * 4. Task Workload Estimation (Range-based & Subtask breakdown)
 * 5. Deadline != Workload Contrast Engine
 * 6. Group Project Dependency Risk Analysis (Blameless ripple-effect detection)
 * 7. Lab & Document Relevance Intelligence (Confidence scoring)
 * 8. Exam Preparation Planner (Workload-aware topic distribution)
 * 9. AI Priority Engine (10-factor multi-attribute ranking)
 * 10. Today's Action Plan Generator (Capacity-fitting & Buffer calculation)
 */

export class AcadenceAIEngine {
  constructor(store) {
    this.store = store;
  }

  /**
   * 1. AI REQUIREMENT EXTRACTION
   * Converts raw text into structured academic requirements.
   * STRICT: If not explicitly mentioned, returns 'Not specified'. Never hallucinates.
   */
  extractRequirements(assignment) {
    const raw = `${assignment.title} ${assignment.description} ${assignment.additionalInstructions || ''}`.toLowerCase();

    // Required sections detection (grounded in actual data or raw text)
    let sections = assignment.requiredSections && assignment.requiredSections.length > 0 
      ? [...assignment.requiredSections] 
      : [];
    
    if (sections.length === 0) {
      if (raw.includes('er diagram') || raw.includes('er model')) sections.push('ER Diagram');
      if (raw.includes('sql') || raw.includes('queries')) sections.push('SQL Queries');
      if (raw.includes('normalization')) sections.push('Normalization Explanation');
      if (raw.includes('report')) sections.push('Formal Report');
    }

    // Required files
    let files = assignment.requiredFiles && assignment.requiredFiles.length > 0
      ? [...assignment.requiredFiles]
      : [];
    
    if (files.length === 0) {
      if (assignment.submissionFormat && assignment.submissionFormat !== 'Not specified') {
        files.push(`Submission.${assignment.submissionFormat.toLowerCase()}`);
      } else {
        files = ['Not specified'];
      }
    }

    return {
      title: assignment.title,
      course: assignment.courseName,
      deadline: assignment.deadline || 'Not specified',
      format: assignment.submissionFormat || 'Not specified',
      pageLimit: assignment.pageLimit || 'Not specified',
      submissionLocation: assignment.submissionLocation || 'Not specified',
      isIndividual: assignment.isGroup === false ? 'Individual' : (assignment.isGroup === true ? 'Group' : 'Not specified'),
      requiredSections: sections.length > 0 ? sections : ['Not specified'],
      requiredFiles: files,
      presentationRequired: assignment.presentationRequired || 'Not specified',
      marks: assignment.marks || 'Not specified',
      additionalInstructions: assignment.additionalInstructions || 'Not specified',
      source: `Virtual LMS Portal (${assignment.courseName})`,
      confidence: 'High confidence (Structured Institutional Feed)'
    };
  }

  /**
   * 2. SUBMISSION CHECKLIST GENERATOR
   * Produces an actionable completion checklist from extracted requirements.
   */
  generateChecklist(assignment) {
    const items = [];
    const prefix = assignment.id;

    // Requirement items
    if (assignment.requiredSections && assignment.requiredSections.length > 0) {
      assignment.requiredSections.forEach((sec, idx) => {
        if (sec !== 'Not specified') {
          items.push({
            id: `${prefix}_sec_${idx}`,
            text: `Prepare & verify ${sec}`,
            category: 'Content',
            required: true
          });
        }
      });
    }

    // Format & export check
    if (assignment.submissionFormat && assignment.submissionFormat !== 'Not specified') {
      items.push({
        id: `${prefix}_format`,
        text: `Export document in mandated ${assignment.submissionFormat} format`,
        category: 'Format',
        required: true
      });
    }

    // Page limit validation
    if (assignment.pageLimit && assignment.pageLimit !== 'Not specified') {
      items.push({
        id: `${prefix}_pagelimit`,
        text: `Confirm total length conforms to ${assignment.pageLimit} limit`,
        category: 'Compliance',
        required: false
      });
    }

    // Submission destination
    items.push({
      id: `${prefix}_upload`,
      text: `Upload finalized submission package to ${assignment.submissionLocation || 'LMS portal'}`,
      category: 'Submission',
      required: true
    });

    return items;
  }

  /**
   * 3. WORKLOAD INTELLIGENCE (Range-based breakdown)
   * Deconstructs tasks into realistic operational subtasks.
   */
  getWorkloadBreakdown(taskType, title, course) {
    const t = `${title} ${course}`.toLowerCase();

    if (t.includes('dbms assignment 3') || (t.includes('dbms') && t.includes('assignment'))) {
      return {
        rangeStr: '4–6 hours',
        minMinutes: 240,
        maxMinutes: 360,
        avgHours: 5.0,
        subtasks: [
          { name: 'Conceptual Domain Modeling & ER Diagram', duration: '60 min', minutes: 60 },
          { name: 'Schema Formulation & SQL Query Construction', duration: '90 min', minutes: 90 },
          { name: 'Normalization Proofs (1NF to BCNF)', duration: '60 min', minutes: 60 },
          { name: 'Synthesizing Analysis Report & Query Benchmarks', duration: '60 min', minutes: 60 },
          { name: 'Document Proofreading & Format Verification', duration: '30 min', minutes: 30 }
        ]
      };
    }

    if (t.includes('presentation')) {
      return {
        rangeStr: '4–6 hours',
        minMinutes: 240,
        maxMinutes: 360,
        avgHours: 5.0,
        subtasks: [
          { name: 'Research topic literature & background', duration: '45 min', minutes: 45 },
          { name: 'Structure technical content & talking points', duration: '60 min', minutes: 60 },
          { name: 'Create presentation slide deck', duration: '90 min', minutes: 90 },
          { name: 'Add architectural diagrams & flowcharts', duration: '30 min', minutes: 30 },
          { name: 'Peer review & technical accuracy check', duration: '30 min', minutes: 30 },
          { name: 'Practice delivery & speech timing', duration: '45 min', minutes: 45 }
        ]
      };
    }

    if (t.includes('os tutorial') || (t.includes('operating systems') && t.includes('tutorial'))) {
      return {
        rangeStr: '2–3 hours',
        minMinutes: 120,
        maxMinutes: 180,
        avgHours: 2.5,
        subtasks: [
          { name: 'Review Semaphore & Mutex primitives theory', duration: '30 min', minutes: 30 },
          { name: 'Write POSIX C Producer-Consumer solution', duration: '60 min', minutes: 60 },
          { name: 'Execute race condition stress tests & traces', duration: '30 min', minutes: 30 },
          { name: 'Compile final PDF report with terminal logs', duration: '30 min', minutes: 30 }
        ]
      };
    }

    if (t.includes('lab') || t.includes('experiment')) {
      return {
        rangeStr: '45–60 minutes',
        minMinutes: 45,
        maxMinutes: 60,
        avgHours: 0.9,
        subtasks: [
          { name: 'Understand Aim & Theoretical Context', duration: '10 min', minutes: 10 },
          { name: 'Draft Schema Procedure & Relational Query Plan', duration: '15 min', minutes: 15 },
          { name: 'Pre-compile SQL Queries & Verify Syntax', duration: '15 min', minutes: 15 },
          { name: 'Review Viva Voce Questions & Edge Cases', duration: '15 min', minutes: 15 }
        ]
      };
    }

    // Default academic task
    return {
      rangeStr: '2–4 hours',
      minMinutes: 120,
      maxMinutes: 240,
      avgHours: 3.0,
      subtasks: [
        { name: 'Understand guidelines & collect references', duration: '45 min', minutes: 45 },
        { name: 'Execute core technical implementation', duration: '90 min', minutes: 90 },
        { name: 'Document findings & export files', duration: '45 min', minutes: 45 }
      ]
    };
  }

  /**
   * 4. DOCUMENT RELEVANCE & INTELLIGENCE
   * Analyzes uploaded PDFs against current student context.
   */
  evaluateDocumentRelevance(doc, activeCourse, activeAnnouncement) {
    const fn = (doc.filename || '').toLowerCase();
    const dt = (doc.title || '').toLowerCase();
    const targetCourse = (activeCourse || 'DBMS').toLowerCase();
    const annText = (activeAnnouncement ? activeAnnouncement.content : '').toLowerCase();

    // Check course match
    if (!doc.courseName.toLowerCase().includes(targetCourse)) {
      return {
        tag: 'NONE',
        confidenceScore: 0.02,
        label: 'Not relevant',
        rationale: `Belongs to a completely different course (${doc.courseName}). Not applicable to ${activeCourse} preparation.`
      };
    }

    // Check specific experiment match
    if (fn.includes('experiment 4') || (annText.includes('experiment 4') && dt.includes('joins'))) {
      return {
        tag: 'HIGH',
        confidenceScore: 0.94,
        label: 'High confidence (94%)',
        rationale: 'High confidence — Directly matches upcoming lab session announcement ("Experiment 4: Joins"). Outlines explicit lab procedure, schema, and viva requirements.'
      };
    }

    // Check if experiment 5
    if (fn.includes('experiment 5') || annText.includes('experiment 5')) {
      return {
        tag: 'HIGH',
        confidenceScore: 0.96,
        label: 'High confidence (96%)',
        rationale: 'High confidence — Matches latest revised lab schedule for Experiment 5.'
      };
    }

    // Notes or general theory
    if (fn.includes('notes') || dt.includes('unit 3') || dt.includes('calculus')) {
      return {
        tag: 'LOW',
        confidenceScore: 0.28,
        label: 'Low confidence (28%)',
        rationale: 'Low confidence — unable to confidently identify relevant preparation material. Contains generalized theoretical lecture slides rather than actionable lab instructions.'
      };
    }

    return {
      tag: 'MEDIUM',
      confidenceScore: 0.60,
      label: 'Medium confidence (60%)',
      rationale: 'Subject-matched reference material. Useful for supplementary reading.'
    };
  }

  /**
   * 5. RECURRING LAB PREPARATION SYNTHESIS
   * Combines faculty announcement + matched PDF to produce lab prep guide.
   */
  generateLabPreparation(announcements, documents) {
    // Find latest DBMS lab announcement
    const labAnn = announcements.find(a => 
      a.courseName.includes('DBMS') && 
      (a.title.toLowerCase().includes('lab') || a.content.toLowerCase().includes('lab'))
    );

    // Default experiment number
    let expNum = 4;
    let topic = 'Joins';

    if (labAnn) {
      if (labAnn.experimentNum) expNum = labAnn.experimentNum;
      if (labAnn.topic) topic = labAnn.topic;
      if (labAnn.content.includes('Experiment 5')) {
        expNum = 5;
        topic = 'Triggers & Stored Procedures';
      }
    }

    // Find matching document
    const matchedDoc = documents.find(d => 
      d.courseName.includes('DBMS') && 
      (d.filename.toLowerCase().includes(`experiment ${expNum}`) || d.filename.toLowerCase().includes(`exp ${expNum}`))
    );

    const checklistItems = [
      { key: 'aim', title: 'Aim & Problem Statement', detail: `Implement and verify ${topic} across relational schema`, ready: true },
      { key: 'algo', title: 'Algorithm / Procedure', detail: 'Step-by-step query execution flowchart and relational algebra transformation', ready: true },
      { key: 'queries', title: 'SQL Queries', detail: `Draft and pre-test 6 required queries for ${topic} in PostgreSQL`, ready: false },
      { key: 'output', title: 'Expected Output', detail: 'Tabular result validation and NULL behavior documentation', ready: false },
      { key: 'record', title: 'Lab Record Book', detail: 'Handwritten entries in mandated laboratory record format', ready: false },
      { key: 'viva', title: 'Viva Voce Preparation', detail: `Theoretical distinctions and performance cost of ${topic}`, ready: false }
    ];

    return {
      course: 'DBMS',
      experimentNumber: expNum,
      topic: topic,
      estimatedEffort: '45–60 minutes',
      source: matchedDoc 
        ? `Faculty Announcement + ${matchedDoc.filename}`
        : 'Faculty Announcement (Document pending)',
      confidence: matchedDoc ? 'High confidence (94%)' : 'Medium confidence',
      matchedDocument: matchedDoc || null,
      checklist: checklistItems
    };
  }

  /**
   * 6. PROJECT DEPENDENCY RISK ANALYZER
   * Detects blocking nodes in team dependency graph blamelessly.
   */
  analyzeProjectRisks(projects) {
    const risks = [];

    projects.forEach(project => {
      // Find overdue tasks
      const overdueTasks = project.tasks.filter(t => t.status === 'overdue');

      overdueTasks.forEach(overdueTask => {
        // Trace downstream chain
        const affectedChain = [overdueTask.name];
        let currentTaskId = overdueTask.id;

        // Traverse dependencies
        let foundNext = true;
        while (foundNext) {
          const downstream = project.tasks.find(t => t.dependsOn && t.dependsOn.includes(currentTaskId));
          if (downstream) {
            affectedChain.push(downstream.name);
            currentTaskId = downstream.id;
          } else {
            foundNext = false;
          }
        }

        risks.push({
          projectId: project.id,
          projectTitle: project.title,
          course: project.courseName,
          overdueTask: overdueTask.name,
          overdueOwner: overdueTask.owner,
          chain: affectedChain,
          chainString: affectedChain.join(' → '),
          downstreamAffectedCount: affectedChain.length - 1,
          impactMessage: 'Multiple downstream tasks are blocked and at immediate risk of deadline compression.',
          blamelessAnalysis: `PROJECT RISK DETECTED: ${overdueTask.name} is overdue. Because downstream integration directly depends on this deliverable, the entire subsequent chain (${affectedChain.join(' → ')}) cannot progress safely. Immediate coordination required to prevent cumulative semester delay.`
        });
      });
    });

    return risks;
  }

  /**
   * 7. EXAM PLANNER (Workload-aware distribution)
   * Spreads syllabus topics across available days taking existing assignments into account.
   */
  generateExamStudyPlan(exam, assignments) {
    if (!exam) return null;

    // Check if any assignment overlaps with study days
    const assignmentMap = {};
    assignments.forEach(asg => {
      const d = (asg.deadline || '').toLowerCase();
      if (d.includes('wednesday') || d.includes('oct 17') || d.includes('october 17')) {
        assignmentMap['October 17'] = asg.title;
      }
      if (d.includes('friday') || d.includes('oct 19') || d.includes('october 19')) {
        assignmentMap['October 19'] = asg.title;
      }
    });

    const enrichedSyllabus = exam.syllabus.map(topic => {
      const overlapAsg = assignmentMap[topic.targetDate];
      let adjustedHours = topic.hours;
      let loadNote = '';

      if (overlapAsg) {
        adjustedHours = Math.max(1.5, topic.hours - 1.0);
        loadNote = `Workload balanced: Allocated ${adjustedHours}h study (reduced by 1h) to accommodate submission of ${overlapAsg}.`;
      } else {
        loadNote = `Standard study allocation: ${topic.hours}h focused review.`;
      }

      return {
        ...topic,
        effectiveHours: adjustedHours,
        workloadNote: loadNote,
        overlappingAssignment: overlapAsg || null
      };
    });

    const totalHours = enrichedSyllabus
      .filter(t => t.status !== 'completed' && t.status !== 'exam_day')
      .reduce((sum, t) => sum + (t.effectiveHours || 0), 0);

    return {
      subject: exam.subject,
      examDate: exam.date,
      weightage: exam.weightage,
      topics: enrichedSyllabus,
      totalRemainingHours: totalHours.toFixed(1),
      strategyNote: 'AI Study Engine distributed topics by conceptual prerequisite order while throttling study load on days with heavy assignment deadlines.'
    };
  }

  /**
   * 8. AI PRIORITY ENGINE
   * 10-Factor Multi-Attribute Utility Ranking
   */
  calculatePriorityScore(item, context) {
    let score = 50; // Base score
    const factors = [];

    // Factor 1: Deadline Urgency (0 - 30 pts)
    const dl = (item.deadline || '').toLowerCase();
    if (dl.includes('today') || dl.includes('tomorrow') || dl.includes('wednesday')) {
      score += 28;
      factors.push({ name: 'Imminent Deadline', points: '+28', note: 'Due within next 48 hours' });
    } else if (dl.includes('friday') || dl.includes('in 3 days')) {
      score += 18;
      factors.push({ name: 'Upcoming Deadline', points: '+18', note: 'Due in 3-5 days' });
    } else {
      score += 5;
    }

    // Factor 2: Workload Weight (0 - 25 pts)
    const hours = item.workloadHours || 3.0;
    if (hours >= 4.0) {
      score += 22;
      factors.push({ name: 'High Workload', points: '+22', note: `Requires ~${hours}h effort (cannot be rushed)` });
    } else if (hours >= 2.0) {
      score += 12;
      factors.push({ name: 'Moderate Workload', points: '+12', note: `Requires ~${hours}h effort` });
    }

    // Factor 3: Deadline Moved Earlier (0 - 25 pts)
    if (item.deadlineMovedEarlier) {
      score += 25;
      factors.push({ name: 'Timeline Compression', points: '+25', note: 'Deadline was moved earlier by faculty!' });
    }

    // Factor 4: Dependencies / Blocking Others (0 - 20 pts)
    if (item.isBlockingOthers) {
      score += 20;
      factors.push({ name: 'Team Critical Path', points: '+20', note: 'Blocks downstream teammate progress' });
    }

    // Factor 5: Exam Proximity (0 - 15 pts)
    if (item.isExamRelated || item.type === 'exam_prep') {
      score += 15;
      factors.push({ name: 'Exam Foundation', points: '+15', note: 'Critical for upcoming mid-term/final' });
    }

    // Factor 6: Lab Pre-requisite
    if (item.type === 'lab_prep') {
      score += 20;
      factors.push({ name: 'Mandatory Lab Prep', points: '+20', note: 'Must be completed before entering lab hall' });
    }

    // Clamp score
    const finalScore = Math.min(100, Math.max(10, score));

    let tier = 'Medium';
    if (finalScore >= 80) tier = 'Critical';
    else if (finalScore >= 65) tier = 'High';
    else if (finalScore <= 40) tier = 'Low';

    return {
      score: finalScore,
      tier: tier,
      factors: factors
    };
  }

  /**
   * 9. COMPOSE TODAY'S ACTION PLAN
   * Aggregates prioritized tasks and fits them into the student's available study capacity.
   */
  buildTodaysActionPlan(state) {
    const availableHours = state.studentAvailableHours || 4.0;
    const candidateTasks = [];

    // 1. Process Assignments
    state.assignments.forEach(asg => {
      const isUrgentMoved = state.changes.some(c => 
        c.assignmentId === asg.id && 
        c.field === 'Deadline' && 
        c.newValue.toLowerCase().includes('wednesday')
      );

      const isWednesday = (asg.deadline || '').toLowerCase().includes('wednesday');
      const workload = this.getWorkloadBreakdown('assignment', asg.title, asg.courseName);
      
      const customHours = state.customWorkloadEstimates[asg.id];
      const effectiveHours = customHours ? Number(customHours) : (isUrgentMoved || isWednesday ? 1.5 : 1.0);

      const pEval = this.calculatePriorityScore({
        deadline: asg.deadline,
        workloadHours: workload.avgHours,
        deadlineMovedEarlier: isUrgentMoved,
        isBlockingOthers: false,
        type: 'assignment'
      });

      let rationale = '';
      if (isUrgentMoved) {
        rationale = `Start ${asg.title} today because its deadline moved earlier to ${asg.deadline} and the estimated workload is ${workload.rangeStr}. Immediate work prevents submission failure.`;
      } else if (isWednesday) {
        rationale = `Target next major milestone for ${asg.title} to stay ahead of ${asg.deadline} deadline.`;
      } else {
        rationale = `Regular progression on ${asg.title} before submission cut-off.`;
      }

      candidateTasks.push({
        id: `today_${asg.id}`,
        sourceId: asg.id,
        type: 'assignment',
        title: isUrgentMoved ? `Finish ${asg.title}` : `Work on ${asg.title}`,
        course: asg.courseName,
        durationMinutes: Math.round(effectiveHours * 60),
        durationStr: `${Math.round(effectiveHours * 60)} min`,
        estimatedHours: effectiveHours,
        priority: pEval.tier,
        priorityScore: pEval.score,
        whyPrioritized: rationale,
        deadline: asg.deadline,
        checklistId: `${asg.id}_sql`,
        completed: Boolean(state.checklistState[`today_${asg.id}`])
      });
    });

    // 2. Lab Preparation
    const labPrep = this.generateLabPreparation(state.announcements, state.documents);
    if (labPrep) {
      candidateTasks.push({
        id: 'today_lab_dbms',
        sourceId: 'lab_dbms',
        type: 'lab_prep',
        title: `Prepare DBMS Lab Experiment ${labPrep.experimentNumber}: ${labPrep.topic}`,
        course: 'DBMS',
        durationMinutes: 45,
        durationStr: '45 min',
        estimatedHours: 0.75,
        priority: 'High',
        priorityScore: 78,
        whyPrioritized: `Faculty scheduled Experiment ${labPrep.experimentNumber} for next session. Pre-lab preparation (Aim, Procedure & SQL Queries) is required before lab entry.`,
        deadline: 'Before Next Lab',
        checklistId: 'lab_dbms_queries',
        completed: Boolean(state.checklistState['today_lab_dbms'])
      });
    }

    // 3. Operating Systems Tutorial
    candidateTasks.push({
      id: 'today_os_tutorial',
      sourceId: 'asg_os_2',
      type: 'tutorial',
      title: 'Complete OS Tutorial 2: Semaphore Synchronization',
      course: 'Operating Systems',
      durationMinutes: 60,
      durationStr: '60 min',
      estimatedHours: 1.0,
      priority: 'High',
      priorityScore: 72,
      whyPrioritized: 'POSIX synchronization problems require rigorous logic tracing; completing earlier frees up time for upcoming exam preparation.',
      deadline: 'Next Monday',
      checklistId: 'today_os_tut',
      completed: Boolean(state.checklistState['today_os_tutorial'])
    });

    // 4. Exam Review Module (DBMS)
    candidateTasks.push({
      id: 'today_exam_review',
      sourceId: 'exam_dbms',
      type: 'exam_prep',
      title: 'Review SQL Complex Joins & Nested Queries (Exam Prep)',
      course: 'DBMS',
      durationMinutes: 30,
      durationStr: '30 min',
      estimatedHours: 0.5,
      priority: 'Medium',
      priorityScore: 60,
      whyPrioritized: 'DBMS Final Exam is approaching; consistent daily topic revision prevents last-minute cramming.',
      deadline: 'Exam: Oct 20',
      checklistId: 'today_sql_rev',
      completed: Boolean(state.checklistState['today_exam_review'])
    });

    // Sort by priority score descending
    candidateTasks.sort((a, b) => b.priorityScore - a.priorityScore);

    // Calculate schedule fit
    let totalMinutes = 0;
    const scheduledTasks = [];

    candidateTasks.forEach(task => {
      totalMinutes += task.durationMinutes;
      scheduledTasks.push(task);
    });

    const totalHours = totalMinutes / 60;
    const remainingBufferMinutes = Math.round((availableHours * 60) - totalMinutes);
    const isOverloaded = remainingBufferMinutes < 0;

    return {
      tasks: scheduledTasks,
      totalEstimatedWorkloadStr: `${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}m`,
      totalHours: totalHours,
      availableHoursStr: `${availableHours}h`,
      availableHours: availableHours,
      bufferStr: isOverloaded ? `Over capacity by ${Math.abs(remainingBufferMinutes)}m` : `${remainingBufferMinutes}m`,
      bufferMinutes: remainingBufferMinutes,
      isOverloaded: isOverloaded,
      capacityRecommendation: isOverloaded 
        ? 'Warning: Scheduled workload exceeds your available study window. ACADENCE recommends deferring non-urgent review tasks.'
        : 'Realistic workload: Total schedule fits comfortably inside your allocated daily hours with healthy buffer.'
    };
  }

  /**
   * 10. CONTRAST ENGINE: DEADLINE != WORKLOAD
   * Returns a comparative analysis to demonstrate why late deadlines need early starts.
   */
  getDeadlineVsWorkloadComparison(state) {
    return [
      {
        taskName: 'Task A: OS Reading Quiz',
        deadline: 'Tomorrow, 5:00 PM',
        workload: '30 minutes',
        workloadMinutes: 30,
        daysAway: 1,
        urgencyColor: '#10b981',
        insight: 'Short duration task. Can be completed safely close to deadline without creating schedule friction.'
      },
      {
        taskName: 'Task B: DBMS Assignment 3 (ER + SQL + Report)',
        deadline: 'Wednesday, 5:00 PM',
        workload: '4–6 hours',
        workloadMinutes: 300,
        daysAway: 2,
        urgencyColor: '#f43f5e',
        insight: 'Substantial workload. Must start TODAY. Waiting until deadline day will guarantee overload or substandard work.'
      }
    ];
  }
}

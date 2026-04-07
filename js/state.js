// ============================================================
// state.js — Single source of truth. All other files read/write
// through AppState and the two helper functions below.
// ============================================================

window.AppState = {
    currentRole: 'PROJECT_TEAM',
    currentEditingId: null,
    currentArtifactKey: null,
    projects: [
        // ── Project 1: Agile / Active (partial completion for demo) ──
        {
            id: '10293',
            name: 'Solaris Phase II',
            pm: 'Alex Chen',
            method: 'Agile',
            status: 'Active',
            reviewRound: 1,
            r1: '2026-01-10 — 2026-02-15',
            r2: '2026-03-01 — 2026-04-20',
            artifacts: {
                'Sprint Planning': {
                    fields: {
                        sprintNumber: '3',
                        sprintGoal: 'Complete user authentication module and integrate with the payment gateway API',
                        sprintStartDate: '2026-01-10',
                        sprintEndDate: '2026-01-24',
                        teamCapacity: '42',
                        storiesCommitted: '8',
                        plannedVelocity: '38',
                        notes: 'Team at full capacity. No PTO planned this sprint.'
                    },
                    files: [],
                    reviews: [],
                    comments: [
                        { user: 'Alex Chen', role: 'PROJECT_TEAM', text: 'Capacity updated after Bob confirmed full availability this sprint.', timestamp: '1/8/2026, 9:30:00 AM' }
                    ],
                    history: [
                        { timestamp: '1/8/2026, 9:30:00 AM', actor: 'Alex Chen', action: 'Updated Sprint Goal and Team Capacity' },
                        { timestamp: '1/7/2026, 2:15:00 PM', actor: 'System', action: 'Artifact record created' }
                    ]
                },
                'User Stories': {
                    fields: {
                        totalStoryCount: '14',
                        acceptanceCriteriaSummary: 'Each story includes Given/When/Then criteria. Authentication stories require 2FA validation.',
                        storyPointTotal: '38',
                        priorityBreakdown: '',
                        notes: ''
                    },
                    files: [],
                    reviews: [],
                    comments: [],
                    history: [
                        { timestamp: '1/9/2026, 11:00:00 AM', actor: 'Alex Chen', action: 'Saved Total Story Count, Acceptance Criteria, Story Point Total' },
                        { timestamp: '1/7/2026, 2:15:00 PM', actor: 'System', action: 'Artifact record created' }
                    ]
                }
            }
        },

        // ── Project 2: Waterfall / Remediation (all artifacts complete, R1 reviews done) ──
        {
            id: '10294',
            name: 'Nebula Workflow',
            pm: 'Jane Doe',
            method: 'Waterfall',
            status: 'Remediation',
            reviewRound: 1,
            r1: '2026-02-01 — 2026-03-01',
            r2: '2026-03-15 — 2026-05-10',
            artifacts: {
                'Project Charter': {
                    fields: {
                        projectTitle: 'Nebula Workflow Automation Platform',
                        sponsor: 'Sarah Mitchell',
                        objectives: 'Automate the end-to-end procurement workflow to reduce processing time by 60% and eliminate manual data entry errors across all business units.',
                        scope: 'In scope: vendor onboarding, PO generation, invoice matching, approval routing. Out of scope: ERP replacement, financial reporting module.',
                        budget: '450000',
                        timeline: '2026-02-01 — 2026-05-10',
                        approvedBy: 'Michael Torres, Sarah Mitchell',
                        notes: 'Board approval received 2026-01-28.'
                    },
                    files: [],
                    reviews: [{ round: 1, rating: 'Satisfactory', comment: 'Charter is comprehensive and well-structured. All mandatory sections present and approved signatures confirmed.', reviewerRole: 'PMO_REVIEWER', reviewer: 'PMO Reviewer', timestamp: '3/5/2026, 10:00:00 AM' }],
                    comments: [],
                    history: [
                        { timestamp: '3/5/2026, 10:00:00 AM', actor: 'PMO Reviewer', action: 'Review Completed: Satisfactory' },
                        { timestamp: '2/5/2026, 9:00:00 AM', actor: 'Jane Doe', action: 'Saved all fields' },
                        { timestamp: '2/2/2026, 8:00:00 AM', actor: 'System', action: 'Artifact record created' }
                    ]
                },
                'Business Requirements': {
                    fields: {
                        requirementCount: '34',
                        businessAnalyst: 'Rachel Kim',
                        stakeholdersReviewedBy: 'Finance Director, Procurement Lead, IT Security',
                        reviewDate: '2026-02-15',
                        keyRequirementsSummary: 'System must process 500+ invoices per day, integrate with SAP, maintain 99.5% uptime, and provide a full audit trail for compliance.',
                        outOfScopeItems: 'Legacy system decommission, end-user training delivery, mobile app interface.'
                    },
                    files: [],
                    reviews: [{ round: 1, rating: 'Needs Improvement', comment: 'Requirement BR-12 (data retention policy) is missing. Please add the retention period and archival requirements per compliance standards.', reviewerRole: 'PMO_REVIEWER', reviewer: 'PMO Reviewer', timestamp: '3/5/2026, 10:15:00 AM' }],
                    comments: [{ user: 'PMO Reviewer', role: 'PMO_REVIEWER', text: 'BR-12 is flagged in the review modal. Please address before Round 2.', timestamp: '3/5/2026, 10:16:00 AM' }],
                    history: [
                        { timestamp: '3/5/2026, 10:15:00 AM', actor: 'PMO Reviewer', action: 'Review Completed: Needs Improvement' },
                        { timestamp: '2/14/2026, 4:00:00 PM', actor: 'Jane Doe', action: 'Saved all fields' },
                        { timestamp: '2/2/2026, 8:00:00 AM', actor: 'System', action: 'Artifact record created' }
                    ]
                },
                'System Design': {
                    fields: {
                        architectureType: 'Microservices on Azure',
                        leadArchitect: 'David Park',
                        designReviewDate: '2026-02-22',
                        componentsListed: 'API Gateway, Workflow Engine, Document Parser, Notification Service, Audit Logger, Admin Dashboard',
                        integrationPoints: 'SAP ERP via REST API, Azure AD for authentication, SharePoint Online for document storage',
                        designApprovedBy: 'David Park, Sarah Mitchell'
                    },
                    files: [],
                    reviews: [{ round: 1, rating: 'Satisfactory', comment: 'Architecture is clearly documented. Integration points well defined with fallback patterns noted.', reviewerRole: 'DELIVERY_REVIEWER', reviewer: 'Delivery Team Reviewer', timestamp: '3/5/2026, 11:00:00 AM' }],
                    comments: [],
                    history: [
                        { timestamp: '3/5/2026, 11:00:00 AM', actor: 'Delivery Team Reviewer', action: 'Review Completed: Satisfactory' },
                        { timestamp: '2/20/2026, 3:00:00 PM', actor: 'Jane Doe', action: 'Saved all fields' },
                        { timestamp: '2/2/2026, 8:00:00 AM', actor: 'System', action: 'Artifact record created' }
                    ]
                },
                'Gantt Chart': {
                    fields: {
                        projectStartDate: '2026-02-01',
                        projectEndDate: '2026-05-10',
                        numberOfPhases: '4',
                        criticalPathSummary: 'Requirements → Design → Development → UAT → Deployment. UAT is on the critical path with a 2-week duration and no float.',
                        lastUpdated: '2026-03-01',
                        toolUsed: 'Microsoft Project'
                    },
                    files: [],
                    reviews: [{ round: 1, rating: 'Satisfactory', comment: 'Timeline is realistic. Dependencies clearly mapped and milestones are measurable.', reviewerRole: 'PMO_REVIEWER', reviewer: 'PMO Reviewer', timestamp: '3/5/2026, 10:30:00 AM' }],
                    comments: [],
                    history: [
                        { timestamp: '3/5/2026, 10:30:00 AM', actor: 'PMO Reviewer', action: 'Review Completed: Satisfactory' },
                        { timestamp: '3/1/2026, 1:00:00 PM', actor: 'Jane Doe', action: 'Saved all fields' },
                        { timestamp: '2/2/2026, 8:00:00 AM', actor: 'System', action: 'Artifact record created' }
                    ]
                },
                'Risk Management Plan': {
                    fields: {
                        topRisks: '1. SAP API instability during peak invoice processing hours\n2. User adoption resistance from procurement team\n3. Data migration errors from the legacy system',
                        mitigationStrategies: '1. Implement retry logic and circuit breaker pattern\n2. Conduct workshops and provide training materials\n3. Dry-run migration with full test dataset before cutover',
                        riskOwner: 'Jane Doe',
                        reviewDate: '2026-03-05',
                        riskLevel: 'Medium',
                        residualRiskNotes: 'SAP dependency remains the highest residual risk after all mitigations are applied.'
                    },
                    files: [],
                    reviews: [{ round: 1, rating: 'Unsatisfactory', comment: 'Risk register does not include probability or impact ratings for any risk. Missing risk response owner for Risks 2 and 3. Template requires all mandatory fields to be completed before submission.', reviewerRole: 'PMO_REVIEWER', reviewer: 'PMO Reviewer', timestamp: '3/5/2026, 10:45:00 AM' }],
                    comments: [{ user: 'PMO Reviewer', role: 'PMO_REVIEWER', text: 'Please add probability/impact matrix and assign owners to Risks 2 and 3 before Round 2 submission.', timestamp: '3/5/2026, 10:46:00 AM' }],
                    history: [
                        { timestamp: '3/5/2026, 10:45:00 AM', actor: 'PMO Reviewer', action: 'Review Completed: Unsatisfactory' },
                        { timestamp: '2/28/2026, 5:00:00 PM', actor: 'Jane Doe', action: 'Saved all fields' },
                        { timestamp: '2/2/2026, 8:00:00 AM', actor: 'System', action: 'Artifact record created' }
                    ]
                },
                'Quality Assurance Plan': {
                    fields: {
                        qaLead: 'Omar Yusuf',
                        testingTypes: 'Unit, Integration, UAT, Performance, Security Penetration',
                        qaStartDate: '2026-04-01',
                        qaEndDate: '2026-04-25',
                        acceptanceCriteria: 'All P1 defects resolved. 95% test case pass rate. Load test confirms 500 invoices/day at <2s response time.',
                        knownDefects: 'Minor UI rendering issue on IE11 — deferred to post-launch maintenance.'
                    },
                    files: [],
                    reviews: [{ round: 1, rating: 'Satisfactory', comment: 'Test coverage is comprehensive. Acceptance criteria are measurable and aligned with requirements.', reviewerRole: 'DELIVERY_REVIEWER', reviewer: 'Delivery Team Reviewer', timestamp: '3/5/2026, 11:15:00 AM' }],
                    comments: [],
                    history: [
                        { timestamp: '3/5/2026, 11:15:00 AM', actor: 'Delivery Team Reviewer', action: 'Review Completed: Satisfactory' },
                        { timestamp: '3/1/2026, 2:00:00 PM', actor: 'Jane Doe', action: 'Saved all fields' },
                        { timestamp: '2/2/2026, 8:00:00 AM', actor: 'System', action: 'Artifact record created' }
                    ]
                },
                'Deployment Plan': {
                    fields: {
                        deploymentDate: '2026-05-05',
                        deploymentLead: 'Jane Doe',
                        rollbackPlan: 'Maintain legacy system in parallel for 30 days post-launch. Rollback trigger: more than 5 critical errors in any 24-hour window.',
                        goNoCriteria: 'All P1 defects closed, sign-off from Finance Director, UAT completed with 95%+ pass rate, security sign-off received.',
                        stakeholdersNotified: 'Finance Director, Procurement Team (45 users), IT Help Desk, Executive Sponsor',
                        postDeployMonitoring: '72-hour hypercare with on-call engineering team, daily status reports for 2 weeks post-launch.'
                    },
                    files: [],
                    reviews: [{ round: 1, rating: 'Needs Improvement', comment: 'Rollback plan does not specify who is authorized to approve the rollback decision. Please add a RACI for rollback authorization.', reviewerRole: 'PMO_REVIEWER', reviewer: 'PMO Reviewer', timestamp: '3/5/2026, 11:30:00 AM' }],
                    comments: [],
                    history: [
                        { timestamp: '3/5/2026, 11:30:00 AM', actor: 'PMO Reviewer', action: 'Review Completed: Needs Improvement' },
                        { timestamp: '3/2/2026, 3:00:00 PM', actor: 'Jane Doe', action: 'Saved all fields' },
                        { timestamp: '2/2/2026, 8:00:00 AM', actor: 'System', action: 'Artifact record created' }
                    ]
                },
                'Post-Implementation Review': {
                    fields: {
                        reviewDate: '2026-05-15',
                        facilitator: 'Jane Doe',
                        objectivesMet: 'Partially — 60% processing time reduction achieved; full automation target deferred to Phase 2.',
                        budgetVariance: '+$12,000 (2.7% over budget due to additional UAT cycles)',
                        scheduleVariance: '+3 days (delayed by SAP API access issues in UAT)',
                        lessonsLearned: 'Earlier stakeholder engagement in requirements phase would have reduced rework. Performance testing should begin during development, not only in UAT.',
                        recommendations: 'Schedule quarterly system health reviews. Document SAP integration patterns as a reusable asset for future projects.'
                    },
                    files: [],
                    reviews: [{ round: 1, rating: 'Satisfactory', comment: 'PIR is thorough. Lessons learned are specific and actionable. Variance explanations are clear.', reviewerRole: 'PMO_REVIEWER', reviewer: 'PMO Reviewer', timestamp: '3/5/2026, 11:45:00 AM' }],
                    comments: [],
                    history: [
                        { timestamp: '3/5/2026, 11:45:00 AM', actor: 'PMO Reviewer', action: 'Review Completed: Satisfactory' },
                        { timestamp: '3/3/2026, 10:00:00 AM', actor: 'Jane Doe', action: 'Saved all fields' },
                        { timestamp: '2/2/2026, 8:00:00 AM', actor: 'System', action: 'Artifact record created' }
                    ]
                }
            }
        },

        // ── Project 3: Agile / Completed (full R1 + R2 cycle — for Leadership demo) ──
        {
            id: '10291',
            name: 'Aurora Connect',
            pm: 'Alex Chen',
            method: 'Agile',
            status: 'Completed',
            reviewRound: 2,
            r1: '2025-11-01 — 2025-11-30',
            r2: '2025-12-10 — 2025-12-24',
            artifacts: {
                'Sprint Planning': {
                    fields: { sprintNumber: '5', sprintGoal: 'Deliver real-time notification system and complete the analytics dashboard module.', sprintStartDate: '2025-11-10', sprintEndDate: '2025-11-24', teamCapacity: '38', storiesCommitted: '7', plannedVelocity: '35', notes: 'End-of-year sprint — team fully allocated.' },
                    files: [],
                    reviews: [
                        { round: 1, rating: 'Satisfactory', comment: 'Well documented. Sprint goal is clear and capacity is realistic.', reviewerRole: 'PMO_REVIEWER', reviewer: 'PMO Reviewer', timestamp: '12/2/2025, 9:00:00 AM' },
                        { round: 2, rating: 'Satisfactory', comment: 'No changes required from Round 1.', reviewerRole: 'PMO_REVIEWER', reviewer: 'PMO Reviewer', timestamp: '12/15/2025, 9:00:00 AM' }
                    ],
                    comments: [],
                    history: [{ timestamp: '12/15/2025, 9:00:00 AM', actor: 'PMO Reviewer', action: 'R2 Review Completed: Satisfactory' }, { timestamp: '12/2/2025, 9:00:00 AM', actor: 'PMO Reviewer', action: 'R1 Review Completed: Satisfactory' }]
                },
                'User Stories': {
                    fields: { totalStoryCount: '18', acceptanceCriteriaSummary: 'All stories follow Given/When/Then format. Notification stories include delivery confirmation criteria.', storyPointTotal: '45', priorityBreakdown: 'Must: 12, Should: 4, Could: 2', notes: '' },
                    files: [], reviews: [{ round: 1, rating: 'Satisfactory', comment: 'Stories are well-formed with clear acceptance criteria.', reviewerRole: 'PMO_REVIEWER', reviewer: 'PMO Reviewer', timestamp: '12/2/2025, 9:10:00 AM' }, { round: 2, rating: 'Satisfactory', comment: 'No changes required.', reviewerRole: 'PMO_REVIEWER', reviewer: 'PMO Reviewer', timestamp: '12/15/2025, 9:05:00 AM' }],
                    comments: [], history: [{ timestamp: '12/2/2025, 9:10:00 AM', actor: 'PMO Reviewer', action: 'R1 Review Completed: Satisfactory' }]
                },
                'Product Backlog': {
                    fields: { backlogOwner: 'Alex Chen', totalBacklogItems: '52', lastGroomedDate: '2025-11-08', topPriorityItem: 'Real-time push notification engine', groomingCadence: 'Bi-weekly', notes: 'Backlog refined and re-prioritized after stakeholder review on Nov 6.' },
                    files: [], reviews: [{ round: 1, rating: 'Satisfactory', comment: 'Backlog is well-maintained and prioritized.', reviewerRole: 'PMO_REVIEWER', reviewer: 'PMO Reviewer', timestamp: '12/2/2025, 9:20:00 AM' }, { round: 2, rating: 'Satisfactory', comment: 'No changes required.', reviewerRole: 'PMO_REVIEWER', reviewer: 'PMO Reviewer', timestamp: '12/15/2025, 9:10:00 AM' }],
                    comments: [], history: [{ timestamp: '12/2/2025, 9:20:00 AM', actor: 'PMO Reviewer', action: 'R1 Review Completed: Satisfactory' }]
                },
                'Sprint Backlog': {
                    fields: { sprintNumber: '5', itemsInBacklog: '7', itemsCompleted: '6', itemsCarriedOver: '1', notes: 'Story AC-47 carried to Sprint 6 due to third-party dependency delay.' },
                    files: [], reviews: [{ round: 1, rating: 'Satisfactory', comment: 'Good completion rate. Carry-over is explained and justified.', reviewerRole: 'PMO_REVIEWER', reviewer: 'PMO Reviewer', timestamp: '12/2/2025, 9:30:00 AM' }, { round: 2, rating: 'Satisfactory', comment: 'No changes required.', reviewerRole: 'PMO_REVIEWER', reviewer: 'PMO Reviewer', timestamp: '12/15/2025, 9:15:00 AM' }],
                    comments: [], history: [{ timestamp: '12/2/2025, 9:30:00 AM', actor: 'PMO Reviewer', action: 'R1 Review Completed: Satisfactory' }]
                },
                'Daily Standup': {
                    fields: { facilitator: 'Alex Chen', standupTimeFrequency: 'Daily at 9:30am — 15 minutes', blockersIdentified: 'Push service rate limiting from third-party vendor (resolved Nov 18).', attendanceRate: '94', notes: '' },
                    files: [], reviews: [{ round: 1, rating: 'Satisfactory', comment: 'Standup structure is consistent. Blockers are documented and tracked to resolution.', reviewerRole: 'PMO_REVIEWER', reviewer: 'PMO Reviewer', timestamp: '12/2/2025, 9:40:00 AM' }, { round: 2, rating: 'Satisfactory', comment: 'No changes required.', reviewerRole: 'PMO_REVIEWER', reviewer: 'PMO Reviewer', timestamp: '12/15/2025, 9:20:00 AM' }],
                    comments: [], history: [{ timestamp: '12/2/2025, 9:40:00 AM', actor: 'PMO Reviewer', action: 'R1 Review Completed: Satisfactory' }]
                },
                'Sprint Review': {
                    fields: { sprintNumber: '5', demoDate: '2025-11-25', stakeholdersInvited: 'Product Owner, UX Lead, QA Lead, Business Sponsor', storiesAccepted: '6', storiesRejected: '0', feedbackSummary: 'Stakeholders approved all delivered stories. Minor UX adjustments requested for the notification preference screen — added to backlog.', notes: '' },
                    files: [], reviews: [{ round: 1, rating: 'Satisfactory', comment: 'Sprint review is well-documented with clear stakeholder feedback recorded.', reviewerRole: 'PMO_REVIEWER', reviewer: 'PMO Reviewer', timestamp: '12/2/2025, 9:50:00 AM' }, { round: 2, rating: 'Satisfactory', comment: 'No changes required.', reviewerRole: 'PMO_REVIEWER', reviewer: 'PMO Reviewer', timestamp: '12/15/2025, 9:25:00 AM' }],
                    comments: [], history: [{ timestamp: '12/2/2025, 9:50:00 AM', actor: 'PMO Reviewer', action: 'R1 Review Completed: Satisfactory' }]
                },
                'Retrospective Notes': {
                    fields: { sprintNumber: '5', wentWell: 'Cross-team collaboration on the notification engine was excellent. Early design review prevented three rework cycles.', needsImprovement: 'Sprint planning overcommitted by 10%. Need better buffer for third-party dependencies.', actionItems: '1. Add 10% buffer to capacity during sprint planning.\n2. Create a vendor dependency tracker shared with the team.', actionItemOwner: 'Alex Chen', dueDate: '2025-12-05' },
                    files: [], reviews: [{ round: 1, rating: 'Satisfactory', comment: 'Retrospective is specific and action items are assigned with due dates.', reviewerRole: 'PMO_REVIEWER', reviewer: 'PMO Reviewer', timestamp: '12/2/2025, 10:00:00 AM' }, { round: 2, rating: 'Satisfactory', comment: 'No changes required.', reviewerRole: 'PMO_REVIEWER', reviewer: 'PMO Reviewer', timestamp: '12/15/2025, 9:30:00 AM' }],
                    comments: [], history: [{ timestamp: '12/2/2025, 10:00:00 AM', actor: 'PMO Reviewer', action: 'R1 Review Completed: Satisfactory' }]
                },
                'Burn-down Charts': {
                    fields: { sprintNumber: '5', idealPointsRemaining: '0', actualPointsRemaining: '5', varianceNotes: 'AC-47 carry-over (5 points) caused the end-of-sprint variance. No other slippage.', chartLastUpdated: '2025-11-24' },
                    files: [], reviews: [{ round: 1, rating: 'Satisfactory', comment: 'Chart is up to date. Variance is explained and acceptable given the documented dependency issue.', reviewerRole: 'DELIVERY_REVIEWER', reviewer: 'Delivery Team Reviewer', timestamp: '12/2/2025, 10:10:00 AM' }, { round: 2, rating: 'Satisfactory', comment: 'No changes required.', reviewerRole: 'DELIVERY_REVIEWER', reviewer: 'Delivery Team Reviewer', timestamp: '12/15/2025, 9:35:00 AM' }],
                    comments: [], history: [{ timestamp: '12/2/2025, 10:10:00 AM', actor: 'Delivery Team Reviewer', action: 'R1 Review Completed: Satisfactory' }]
                },
                'Definition of Done': {
                    fields: { dodVersion: 'v2.1', lastReviewedDate: '2025-10-30', dodCriteria: '1. All acceptance criteria passed\n2. Unit test coverage ≥ 80%\n3. Code reviewed and approved by 1 peer\n4. No open P1/P2 defects\n5. Deployed to staging and smoke tested\n6. Product Owner sign-off received', approvedBy: 'Alex Chen, Product Owner', notes: 'Updated from v2.0 to include staging deployment requirement.' },
                    files: [], reviews: [{ round: 1, rating: 'Satisfactory', comment: 'DoD is comprehensive and version-controlled. Criteria are clear and measurable.', reviewerRole: 'PMO_REVIEWER', reviewer: 'PMO Reviewer', timestamp: '12/2/2025, 10:20:00 AM' }, { round: 2, rating: 'Satisfactory', comment: 'No changes required.', reviewerRole: 'PMO_REVIEWER', reviewer: 'PMO Reviewer', timestamp: '12/15/2025, 9:40:00 AM' }],
                    comments: [], history: [{ timestamp: '12/2/2025, 10:20:00 AM', actor: 'PMO Reviewer', action: 'R1 Review Completed: Satisfactory' }]
                }
            }
        }
    ]
};

// ── Helpers ──────────────────────────────────────────────────

window.getProject = function (id) {
    return AppState.projects.find(function (p) { return p.id === id; });
};

window.getArtifactData = function (projectId, artifactKey) {
    var p = getProject(projectId);
    if (!p.artifacts[artifactKey]) {
        p.artifacts[artifactKey] = {
            fields: {},
            files: [],
            reviews: [],
            comments: [],
            history: [{ timestamp: new Date().toLocaleString(), actor: 'System', action: 'Artifact record created' }]
        };
    }
    return p.artifacts[artifactKey];
};

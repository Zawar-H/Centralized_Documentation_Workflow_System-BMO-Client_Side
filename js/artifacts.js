// ============================================================
// artifacts.js — Schema definitions for all 17 artifact types.
// editor.js reads these to render guided forms dynamically.
// ============================================================

window.AGILE_ARTIFACTS = [
    'Sprint Planning', 'User Stories', 'Product Backlog', 'Sprint Backlog',
    'Daily Standup', 'Sprint Review', 'Retrospective Notes', 'Burn-down Charts', 'Definition of Done'
];

window.WATERFALL_ARTIFACTS = [
    'Project Charter', 'Business Requirements', 'System Design', 'Gantt Chart',
    'Risk Management Plan', 'Quality Assurance Plan', 'Deployment Plan', 'Post-Implementation Review'
];

window.ARTIFACT_SCHEMAS = {

    // ── AGILE ──────────────────────────────────────────────────

    'Sprint Planning': { fields: [
        { key: 'sprintNumber',      label: 'Sprint Number',                  type: 'number',   required: true,  placeholder: 'e.g. 3' },
        { key: 'sprintGoal',        label: 'Sprint Goal',                    type: 'textarea', required: true,  placeholder: 'Describe the primary goal for this sprint...' },
        { key: 'sprintStartDate',   label: 'Sprint Start Date',              type: 'date',     required: true },
        { key: 'sprintEndDate',     label: 'Sprint End Date',                type: 'date',     required: true },
        { key: 'teamCapacity',      label: 'Team Capacity (story points)',   type: 'number',   required: true,  placeholder: 'e.g. 40' },
        { key: 'storiesCommitted',  label: 'Stories Committed',              type: 'number',   required: true,  placeholder: 'e.g. 8' },
        { key: 'plannedVelocity',   label: 'Planned Velocity',               type: 'number',   required: false, placeholder: 'e.g. 35' },
        { key: 'notes',             label: 'Notes',                          type: 'textarea', required: false, placeholder: 'Additional context or decisions made during planning...' }
    ]},

    'User Stories': { fields: [
        { key: 'totalStoryCount',              label: 'Total Story Count',             type: 'number',   required: true,  placeholder: 'e.g. 14' },
        { key: 'acceptanceCriteriaSummary',    label: 'Acceptance Criteria Summary',   type: 'textarea', required: true,  placeholder: 'Summarize the acceptance criteria approach...' },
        { key: 'storyPointTotal',              label: 'Total Story Points',            type: 'number',   required: true,  placeholder: 'e.g. 42' },
        { key: 'priorityBreakdown',            label: 'Priority Breakdown (MoSCoW)',   type: 'text',     required: false, placeholder: 'e.g. Must: 10, Should: 3, Could: 1' },
        { key: 'notes',                        label: 'Notes',                         type: 'textarea', required: false, placeholder: 'Any additional notes on story quality or gaps...' }
    ]},

    'Product Backlog': { fields: [
        { key: 'backlogOwner',       label: 'Backlog Owner',           type: 'text',     required: true,  placeholder: 'e.g. Product Manager name' },
        { key: 'totalBacklogItems',  label: 'Total Backlog Items',     type: 'number',   required: true,  placeholder: 'e.g. 52' },
        { key: 'lastGroomedDate',    label: 'Last Groomed Date',       type: 'date',     required: true },
        { key: 'topPriorityItem',    label: 'Top Priority Item',       type: 'text',     required: true,  placeholder: 'Title of the highest priority backlog item' },
        { key: 'groomingCadence',    label: 'Grooming Cadence',        type: 'text',     required: false, placeholder: 'e.g. Bi-weekly' },
        { key: 'notes',              label: 'Notes',                   type: 'textarea', required: false, placeholder: 'Notes on backlog health, prioritization changes, etc.' }
    ]},

    'Sprint Backlog': { fields: [
        { key: 'sprintNumber',       label: 'Sprint Number',        type: 'number',   required: true,  placeholder: 'e.g. 3' },
        { key: 'itemsInBacklog',     label: 'Items in Sprint',      type: 'number',   required: true,  placeholder: 'Total items committed to this sprint' },
        { key: 'itemsCompleted',     label: 'Items Completed',      type: 'number',   required: true,  placeholder: 'Number of items delivered' },
        { key: 'itemsCarriedOver',   label: 'Items Carried Over',   type: 'number',   required: false, placeholder: 'Items moved to next sprint' },
        { key: 'notes',              label: 'Notes',                type: 'textarea', required: false, placeholder: 'Explain any carry-overs or blockers...' }
    ]},

    'Daily Standup': { fields: [
        { key: 'facilitator',          label: 'Facilitator',                  type: 'text',     required: true,  placeholder: 'Name of standup facilitator' },
        { key: 'standupTimeFrequency', label: 'Time & Frequency',             type: 'text',     required: true,  placeholder: 'e.g. Daily at 9:30am, 15 minutes' },
        { key: 'blockersIdentified',   label: 'Blockers Identified',          type: 'textarea', required: false, placeholder: 'List any blockers raised and their current resolution status...' },
        { key: 'attendanceRate',       label: 'Attendance Rate (%)',          type: 'number',   required: false, placeholder: 'e.g. 92' },
        { key: 'notes',                label: 'Notes',                        type: 'textarea', required: false, placeholder: 'Additional observations...' }
    ]},

    'Sprint Review': { fields: [
        { key: 'sprintNumber',         label: 'Sprint Number',             type: 'number',   required: true,  placeholder: 'e.g. 3' },
        { key: 'demoDate',             label: 'Demo Date',                 type: 'date',     required: true },
        { key: 'stakeholdersInvited',  label: 'Stakeholders Invited',      type: 'text',     required: true,  placeholder: 'List all stakeholders who attended the review' },
        { key: 'storiesAccepted',      label: 'Stories Accepted',          type: 'number',   required: true,  placeholder: 'e.g. 7' },
        { key: 'storiesRejected',      label: 'Stories Rejected',          type: 'number',   required: false, placeholder: 'e.g. 0' },
        { key: 'feedbackSummary',      label: 'Feedback Summary',          type: 'textarea', required: true,  placeholder: 'Summarize stakeholder feedback and any decisions made...' },
        { key: 'notes',                label: 'Notes',                     type: 'textarea', required: false, placeholder: 'Additional notes...' }
    ]},

    'Retrospective Notes': { fields: [
        { key: 'sprintNumber',        label: 'Sprint Number',              type: 'number',   required: true,  placeholder: 'e.g. 3' },
        { key: 'wentWell',            label: 'What Went Well',             type: 'textarea', required: true,  placeholder: 'List positives from this sprint...' },
        { key: 'needsImprovement',    label: 'What Needs Improvement',     type: 'textarea', required: true,  placeholder: 'Identify areas for improvement...' },
        { key: 'actionItems',         label: 'Action Items',               type: 'textarea', required: true,  placeholder: 'List specific, assignable action items...' },
        { key: 'actionItemOwner',     label: 'Action Item Owner(s)',       type: 'text',     required: true,  placeholder: 'Name(s) responsible for follow-through' },
        { key: 'dueDate',             label: 'Action Items Due Date',      type: 'date',     required: false }
    ]},

    'Burn-down Charts': { fields: [
        { key: 'sprintNumber',             label: 'Sprint Number',                    type: 'number',   required: true,  placeholder: 'e.g. 3' },
        { key: 'idealPointsRemaining',     label: 'Ideal Points Remaining (end)',     type: 'number',   required: true,  placeholder: 'Should be 0 at sprint end' },
        { key: 'actualPointsRemaining',    label: 'Actual Points Remaining (end)',    type: 'number',   required: true,  placeholder: 'e.g. 5' },
        { key: 'varianceNotes',            label: 'Variance Notes',                   type: 'textarea', required: false, placeholder: 'Explain any deviation from the ideal burn-down...' },
        { key: 'chartLastUpdated',         label: 'Chart Last Updated',               type: 'date',     required: true }
    ]},

    'Definition of Done': { fields: [
        { key: 'dodVersion',         label: 'DoD Version',           type: 'text',     required: true,  placeholder: 'e.g. v2.1' },
        { key: 'lastReviewedDate',   label: 'Last Reviewed Date',    type: 'date',     required: true },
        { key: 'dodCriteria',        label: 'DoD Criteria',          type: 'textarea', required: true,  placeholder: 'List each criterion that must be met before a story is considered done...' },
        { key: 'approvedBy',         label: 'Approved By',           type: 'text',     required: true,  placeholder: 'Names of approvers (PM, Product Owner, etc.)' },
        { key: 'notes',              label: 'Notes',                 type: 'textarea', required: false, placeholder: 'Change history or clarifications...' }
    ]},

    // ── WATERFALL ──────────────────────────────────────────────

    'Project Charter': { fields: [
        { key: 'projectTitle',   label: 'Project Title',      type: 'text',     required: true,  placeholder: 'Official project title' },
        { key: 'sponsor',        label: 'Project Sponsor',    type: 'text',     required: true,  placeholder: 'Executive sponsor name' },
        { key: 'objectives',     label: 'Objectives',         type: 'textarea', required: true,  placeholder: 'What the project aims to achieve...' },
        { key: 'scope',          label: 'Scope',              type: 'textarea', required: true,  placeholder: 'In scope and out of scope items...' },
        { key: 'budget',         label: 'Budget ($)',         type: 'number',   required: true,  placeholder: 'Total approved budget' },
        { key: 'timeline',       label: 'Timeline',           type: 'text',     required: true,  placeholder: 'e.g. 2026-02-01 — 2026-05-10' },
        { key: 'approvedBy',     label: 'Approved By',        type: 'text',     required: true,  placeholder: 'Name(s) of charter approvers' },
        { key: 'notes',          label: 'Notes',              type: 'textarea', required: false, placeholder: 'Additional context...' }
    ]},

    'Business Requirements': { fields: [
        { key: 'requirementCount',          label: 'Requirement Count',             type: 'number',   required: true,  placeholder: 'Total number of documented requirements' },
        { key: 'businessAnalyst',           label: 'Business Analyst',              type: 'text',     required: true,  placeholder: 'BA responsible for this document' },
        { key: 'stakeholdersReviewedBy',    label: 'Reviewed By (Stakeholders)',    type: 'text',     required: true,  placeholder: 'List stakeholders who reviewed and signed off' },
        { key: 'reviewDate',                label: 'Review Date',                   type: 'date',     required: true },
        { key: 'keyRequirementsSummary',    label: 'Key Requirements Summary',      type: 'textarea', required: true,  placeholder: 'Summarize the most critical requirements...' },
        { key: 'outOfScopeItems',           label: 'Out-of-Scope Items',            type: 'textarea', required: false, placeholder: 'Explicitly excluded requirements...' }
    ]},

    'System Design': { fields: [
        { key: 'architectureType',    label: 'Architecture Type',       type: 'text',     required: true,  placeholder: 'e.g. Microservices, Monolith, Serverless' },
        { key: 'leadArchitect',       label: 'Lead Architect',          type: 'text',     required: true,  placeholder: 'Name of the architect responsible' },
        { key: 'designReviewDate',    label: 'Design Review Date',      type: 'date',     required: true },
        { key: 'componentsListed',    label: 'Components / Modules',    type: 'textarea', required: true,  placeholder: 'List all major system components...' },
        { key: 'integrationPoints',   label: 'Integration Points',      type: 'textarea', required: false, placeholder: 'External systems and APIs this solution integrates with...' },
        { key: 'designApprovedBy',    label: 'Design Approved By',      type: 'text',     required: true,  placeholder: 'Names of design reviewers and approvers' }
    ]},

    'Gantt Chart': { fields: [
        { key: 'projectStartDate',       label: 'Project Start Date',       type: 'date',     required: true },
        { key: 'projectEndDate',         label: 'Project End Date',         type: 'date',     required: true },
        { key: 'numberOfPhases',         label: 'Number of Phases',         type: 'number',   required: true,  placeholder: 'e.g. 4' },
        { key: 'criticalPathSummary',    label: 'Critical Path Summary',    type: 'textarea', required: true,  placeholder: 'Describe the critical path and key dependencies...' },
        { key: 'lastUpdated',            label: 'Last Updated',             type: 'date',     required: true },
        { key: 'toolUsed',               label: 'Tool Used',                type: 'text',     required: false, placeholder: 'e.g. Microsoft Project, Excel' }
    ]},

    'Risk Management Plan': { fields: [
        { key: 'topRisks',               label: 'Top Risks',                type: 'textarea', required: true,  placeholder: 'List each risk on a new line with a brief description...' },
        { key: 'mitigationStrategies',   label: 'Mitigation Strategies',    type: 'textarea', required: true,  placeholder: 'Corresponding mitigation for each risk listed above...' },
        { key: 'riskOwner',              label: 'Risk Owner',               type: 'text',     required: true,  placeholder: 'Person accountable for managing and monitoring risks' },
        { key: 'reviewDate',             label: 'Review Date',              type: 'date',     required: true },
        { key: 'riskLevel',              label: 'Overall Risk Level',       type: 'text',     required: true,  placeholder: 'High / Medium / Low' },
        { key: 'residualRiskNotes',      label: 'Residual Risk Notes',      type: 'textarea', required: false, placeholder: 'Risks remaining after mitigation...' }
    ]},

    'Quality Assurance Plan': { fields: [
        { key: 'qaLead',              label: 'QA Lead',                  type: 'text',     required: true,  placeholder: 'Name of the QA lead' },
        { key: 'testingTypes',        label: 'Testing Types',            type: 'text',     required: true,  placeholder: 'e.g. Unit, Integration, UAT, Performance' },
        { key: 'qaStartDate',         label: 'QA Start Date',            type: 'date',     required: true },
        { key: 'qaEndDate',           label: 'QA End Date',              type: 'date',     required: true },
        { key: 'acceptanceCriteria',  label: 'Acceptance Criteria',      type: 'textarea', required: true,  placeholder: 'Define measurable criteria for QA sign-off...' },
        { key: 'knownDefects',        label: 'Known Defects / Waivers',  type: 'textarea', required: false, placeholder: 'Any deferred defects or accepted waivers...' }
    ]},

    'Deployment Plan': { fields: [
        { key: 'deploymentDate',          label: 'Deployment Date',              type: 'date',     required: true },
        { key: 'deploymentLead',          label: 'Deployment Lead',              type: 'text',     required: true,  placeholder: 'Person responsible for deployment execution' },
        { key: 'rollbackPlan',            label: 'Rollback Plan',                type: 'textarea', required: true,  placeholder: 'Steps and triggers for rolling back the deployment...' },
        { key: 'goNoCriteria',            label: 'Go / No-Go Criteria',          type: 'textarea', required: true,  placeholder: 'Conditions that must be met to proceed with deployment...' },
        { key: 'stakeholdersNotified',    label: 'Stakeholders Notified',        type: 'text',     required: true,  placeholder: 'All parties who must be informed before go-live' },
        { key: 'postDeployMonitoring',    label: 'Post-Deploy Monitoring Plan',  type: 'text',     required: false, placeholder: 'e.g. 72-hour hypercare, daily status reports for 2 weeks' }
    ]},

    'Post-Implementation Review': { fields: [
        { key: 'reviewDate',         label: 'Review Date',              type: 'date',     required: true },
        { key: 'facilitator',        label: 'Facilitator',              type: 'text',     required: true,  placeholder: 'Name of the PIR facilitator' },
        { key: 'objectivesMet',      label: 'Objectives Met?',          type: 'text',     required: true,  placeholder: 'Yes / No / Partially' },
        { key: 'budgetVariance',     label: 'Budget Variance',          type: 'text',     required: true,  placeholder: 'e.g. +$12,000 (2.7% over budget)' },
        { key: 'scheduleVariance',   label: 'Schedule Variance',        type: 'text',     required: true,  placeholder: 'e.g. +3 days' },
        { key: 'lessonsLearned',     label: 'Lessons Learned',          type: 'textarea', required: true,  placeholder: 'What would you do differently next time?...' },
        { key: 'recommendations',    label: 'Recommendations',          type: 'textarea', required: false, placeholder: 'Specific recommendations for future projects...' }
    ]}
};

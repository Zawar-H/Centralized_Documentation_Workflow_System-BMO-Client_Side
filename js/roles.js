// ============================================================
// roles.js — Role constants and permission helpers.
// ============================================================

window.ROLES = {
    PROJECT_TEAM:      'PROJECT_TEAM',
    PMO_REVIEWER:      'PMO_REVIEWER',
    DELIVERY_REVIEWER: 'DELIVERY_REVIEWER',
    PMO_LEADERSHIP:    'PMO_LEADERSHIP'
};

window.ROLE_LABELS = {
    PROJECT_TEAM:      'Project Team',
    PMO_REVIEWER:      'PMO Reviewer',
    DELIVERY_REVIEWER: 'Delivery Team Reviewer',
    PMO_LEADERSHIP:    'PMO Leadership'
};

// Can this role fill in / save artifact fields?
window.canEditArtifact = function (role) {
    return role === ROLES.PROJECT_TEAM;
};

// Can this role submit a review rating on this artifact?
window.canReviewArtifact = function (role, artifactKey) {
    if (role === ROLES.PMO_REVIEWER) return true;
    if (role === ROLES.DELIVERY_REVIEWER) return AGILE_ARTIFACTS.includes(artifactKey);
    return false;
};

// Should the New Project / Delete / Duplicate buttons appear?
window.canSeeProjectControls = function (role) {
    return role === ROLES.PROJECT_TEAM;
};

// Can this role click "Initiate Review" on the dashboard?
window.canInitiateReview = function (role) {
    return role === ROLES.PMO_REVIEWER || role === ROLES.DELIVERY_REVIEWER;
};

// Can this role click "Complete Project Review"?
window.canCompleteReview = function (role) {
    return role === ROLES.PMO_REVIEWER;
};

// Can this role mark a project "Ready for Review"?
window.canMarkReady = function (role) {
    return role === ROLES.PROJECT_TEAM;
};

// Is this the read-only leadership role?
window.isLeadership = function (role) {
    return role === ROLES.PMO_LEADERSHIP;
};

// Is this any reviewer role?
window.isReviewer = function (role) {
    return role === ROLES.PMO_REVIEWER || role === ROLES.DELIVERY_REVIEWER;
};

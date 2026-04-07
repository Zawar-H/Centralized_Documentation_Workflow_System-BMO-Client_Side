// ============================================================
// validation.js — Completion logic, artifact status, dot colors.
// ============================================================

// Returns { completed, total, incompleteList }
window.getProjectCompletion = function (project) {
    var artifacts = project.method === 'Agile' ? AGILE_ARTIFACTS : WATERFALL_ARTIFACTS;
    var completed = 0;
    var incompleteList = [];

    artifacts.forEach(function (name) {
        var data = project.artifacts[name];
        var schema = ARTIFACT_SCHEMAS[name];
        if (!schema) return;
        var requiredFields = schema.fields.filter(function (f) { return f.required; });

        var isComplete = data && data.fields && requiredFields.every(function (f) {
            var val = data.fields[f.key];
            return val !== undefined && val !== null && String(val).trim() !== '';
        });

        if (isComplete) {
            completed++;
        } else {
            incompleteList.push(name);
        }
    });

    return { completed: completed, total: artifacts.length, incompleteList: incompleteList };
};

// Returns 'empty' | 'partial' | 'complete' | 'flagged'
window.getArtifactStatus = function (artifactData, schemaFields) {
    if (!artifactData || !artifactData.fields) return 'empty';

    // If most recent review is Unsatisfactory → flag it red
    if (artifactData.reviews && artifactData.reviews.length > 0) {
        var latest = artifactData.reviews[artifactData.reviews.length - 1];
        if (latest.rating === 'Unsatisfactory') return 'flagged';
    }

    var requiredFields = schemaFields.filter(function (f) { return f.required; });
    var filled = requiredFields.filter(function (f) {
        var val = artifactData.fields[f.key];
        return val !== undefined && val !== null && String(val).trim() !== '';
    });

    if (filled.length === 0) return 'empty';
    if (filled.length < requiredFields.length) return 'partial';
    return 'complete';
};

// Returns { allowed: bool, incompleteList: [] }
window.canMarkReadyForReview = function (project) {
    var result = getProjectCompletion(project);
    return { allowed: result.incompleteList.length === 0, incompleteList: result.incompleteList };
};

// Maps status string → Tailwind class for the colored dot in the sidebar
window.getDotClass = function (status) {
    var map = { empty: 'dot-gray', partial: 'dot-amber', complete: 'dot-green', flagged: 'dot-red' };
    return map[status] || 'dot-gray';
};

// Maps project status → Tailwind badge classes
window.getStatusStyle = function (status) {
    var map = {
        'Active':             'bg-green-100 text-green-700',
        'Ready for Review':   'bg-amber-100 text-amber-700',
        'Review In Progress': 'bg-indigo-100 text-indigo-700',
        'Remediation':        'bg-orange-100 text-orange-700',
        'Completed':          'bg-blue-100 text-blue-700'
    };
    return map[status] || 'bg-gray-100 text-gray-600';
};

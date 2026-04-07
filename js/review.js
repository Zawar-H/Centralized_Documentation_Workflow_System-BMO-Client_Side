// ============================================================
// review.js — Review modal: open, submit, complete project.
// ============================================================

function openReviewModal() {
    var label = document.getElementById('review-artifact-label');
    if (label) label.textContent = AppState.currentArtifactKey;
    document.getElementById('review-rating').value = 'Satisfactory';
    document.getElementById('review-comment-popup').value = '';
    document.getElementById('review-modal').classList.remove('hidden');
}

function closeReviewModal() {
    document.getElementById('review-modal').classList.add('hidden');
}

function submitArtifactReview() {
    var rating  = document.getElementById('review-rating').value;
    var comment = document.getElementById('review-comment-popup').value.trim();
    var p       = getProject(AppState.currentEditingId);
    var round   = p.reviewRound || 1;
    var data    = getArtifactData(AppState.currentEditingId, AppState.currentArtifactKey);
    var ts      = new Date().toLocaleString();

    data.reviews.push({
        round:       round,
        rating:      rating,
        comment:     comment,
        reviewerRole: AppState.currentRole,
        reviewer:    ROLE_LABELS[AppState.currentRole] || AppState.currentRole,
        timestamp:   ts
    });

    data.history.unshift({
        timestamp: ts,
        actor:     ROLE_LABELS[AppState.currentRole] || AppState.currentRole,
        action:    'Round ' + round + ' Review: ' + rating + (comment ? ' — "' + comment.substring(0, 60) + (comment.length > 60 ? '…' : '') + '"' : '')
    });

    // Add reviewer comment to comments panel
    if (comment) {
        data.comments.push({
            user:      ROLE_LABELS[AppState.currentRole] || AppState.currentRole,
            role:      AppState.currentRole,
            text:      '[' + rating + '] ' + comment,
            timestamp: ts
        });
    }

    closeReviewModal();
    renderHistory();
    renderComments();

    // Re-render sidebar (dot may change to red if Unsatisfactory)
    renderArtifactSidebar(p, AppState.currentArtifactKey);

    // Re-render header actions (review count updates)
    renderHeaderActions(p);

    showToast('Review submitted: ' + rating);
}

function completeProjectReview() {
    var p     = getProject(AppState.currentEditingId);
    var list  = p.method === 'Agile' ? AGILE_ARTIFACTS : WATERFALL_ARTIFACTS;
    var round = p.reviewRound || 1;

    // Check if all artifacts have been reviewed this round
    var reviewed   = list.filter(function (name) {
        var data = p.artifacts[name];
        return data && data.reviews && data.reviews.some(function (r) { return r.round === round; });
    });
    var unreviewed = list.filter(function (name) {
        var data = p.artifacts[name];
        return !(data && data.reviews && data.reviews.some(function (r) { return r.round === round; }));
    });

    if (unreviewed.length > 0) {
        var names = unreviewed.slice(0, 3).join(', ') + (unreviewed.length > 3 ? '…' : '');
        showToast('Not yet reviewed: ' + names);
        return;
    }

    // Determine outcome
    var hasNegative = list.some(function (name) {
        var data = p.artifacts[name];
        if (!data || !data.reviews) return false;
        var roundReviews = data.reviews.filter(function (r) { return r.round === round; });
        if (roundReviews.length === 0) return false;
        var latest = roundReviews[roundReviews.length - 1];
        return latest.rating === 'Needs Improvement' || latest.rating === 'Unsatisfactory';
    });

    var newStatus = (round === 1 && hasNegative) ? 'Remediation' : 'Completed';
    p.status = newStatus;

    var ts = new Date().toLocaleString();
    var msg = newStatus === 'Remediation'
        ? 'Round 1 complete — some artifacts require remediation. Project team notified.'
        : 'Round ' + round + ' review complete — all artifacts Satisfactory. Project marked Completed.';

    showToast(msg);

    // Update UI
    renderHeaderActions(p);
    renderTable();
    showPage('dashboard-page');
}

// ── Rating badge helper (used in leadership.js detail view) ──

function getRatingBadge(rating) {
    var cls = 'rating-satisfactory';
    if (rating === 'Needs Improvement') cls = 'rating-needs-imp';
    if (rating === 'Unsatisfactory')    cls = 'rating-unsatisfactory';
    return '<span class="px-2 py-0.5 rounded text-[10px] font-bold ' + cls + '">' + rating + '</span>';
}

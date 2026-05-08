// ============================================================
// app.js — Bootstrap, navigation, toast, role switching.
//          Loaded last — all other globals are available.
// ============================================================

// ── Page navigation ───────────────────────────────────────

function showPage(pageId) {
    ['login-page', 'dashboard-page', 'edit-page', 'leadership-page', 'leadership-detail-page'].forEach(function (id) {
        var el = document.getElementById(id);
        if (el) el.classList.add('hidden');
    });
    var target = document.getElementById(pageId);
    if (target) target.classList.remove('hidden');

    // Refresh table when returning to dashboard
    if (pageId === 'dashboard-page') renderTable();
}

// ── Toast ─────────────────────────────────────────────────

function showToast(text) {
    var el  = document.getElementById('toast-notification');
    var txt = document.getElementById('toast-text');
    if (!el || !txt) return;
    txt.textContent = text;
    el.classList.add('show');
    clearTimeout(showToast._timer);
    showToast._timer = setTimeout(function () { el.classList.remove('show'); }, 3000);
}

// ── Role switching ────────────────────────────────────────

function openLoginNoticeModal() {
    var modal = document.getElementById('login-notice-modal');
    if (modal) modal.classList.remove('hidden');
}

function closeLoginNoticeModal() {
    var modal = document.getElementById('login-notice-modal');
    if (modal) modal.classList.add('hidden');
}
function handleMockLogin(event) {
    if (event) event.preventDefault();

    AppState.currentRole = ROLES.PROJECT_TEAM;

    document.querySelectorAll('.role-selector').forEach(function (s) {
        s.value = AppState.currentRole;
    });

    var pmActions = document.getElementById('pm-actions');
    if (pmActions) {
        pmActions.classList.toggle('hidden', !canSeeProjectControls(AppState.currentRole));
    }

    document.querySelectorAll('.sel-col').forEach(function (el) {
        el.classList.toggle('hidden', !canSeeProjectControls(AppState.currentRole));
    });

    showPage('dashboard-page');
    renderTable();
    openLoginNoticeModal();
    showToast('Mock login successful');
}

function switchRole(selectEl) {
    var newRole = selectEl.value;
    AppState.currentRole = newRole;

    // Sync all role selectors to the same value
    document.querySelectorAll('.role-selector').forEach(function (s) {
        s.value = newRole;
    });

    // Toggle dashboard PM action controls
    var pmActions = document.getElementById('pm-actions');
    if (pmActions) {
        pmActions.classList.toggle('hidden', !canSeeProjectControls(newRole));
    }

    // Toggle selection column header visibility
    document.querySelectorAll('.sel-col').forEach(function (el) {
        el.classList.toggle('hidden', !canSeeProjectControls(newRole));
    });

    // Navigate to the appropriate starting page for the role
    if (isLeadership(newRole)) {
        showPage('leadership-page');
        renderLeadershipPage();
    } else {
        showPage('dashboard-page');
        renderTable();
    }
}

// ── Leadership search wiring ──────────────────────────────

function wireLeadershipSearch() {
    var input = document.getElementById('leadership-search');
    if (input) {
        input.addEventListener('input', renderLeadershipPage);
    }
}

// ── Bootstrap ─────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', function () {
    // Wire dashboard filters
    wireDashboardFilters();

    // Wire leadership search
    wireLeadershipSearch();

    // Set all role selectors to the default role
    document.querySelectorAll('.role-selector').forEach(function (s) {
        s.value = AppState.currentRole;
    });

    // Initial render
    renderTable();
    showPage('login-page');
});

// ============================================================
// dashboard.js — Project table rendering, filters, CRUD.
// ============================================================

function renderTable() {
    var body = document.getElementById('project-table-body');
    if (!body) return;

    var searchTerm = (document.getElementById('search-filter').value || '').toLowerCase();
    var selStatus  = Array.from(document.querySelectorAll('.status-check:checked')).map(function (cb) { return cb.value; });
    var selMethod  = Array.from(document.querySelectorAll('.method-check:checked')).map(function (cb) { return cb.value; });
    var selPM      = document.getElementById('pm-filter').value;
    var role       = AppState.currentRole;

    var filtered = AppState.projects.filter(function (p) {
        var sMatch = selStatus.length === 0 || selStatus.includes(p.status);
        var mMatch = selMethod.length === 0 || selMethod.includes(p.method);
        var pMatch = selPM === 'All' || p.pm === selPM;
        var nMatch = p.name.toLowerCase().includes(searchTerm);
        return sMatch && mMatch && pMatch && nMatch;
    });

    var showSel = canSeeProjectControls(role);

    body.innerHTML = filtered.map(function (p) {
        var comp = getProjectCompletion(p);
        var pct  = comp.total > 0 ? Math.round((comp.completed / comp.total) * 100) : 0;

        var methodStyle = p.method === 'Agile'
            ? 'background:#e6f3fb;color:#0079c1'
            : 'background:#e2e8f0;color:#475569';

        var initiateBtn = (canInitiateReview(role) && p.status === 'Ready for Review')
            ? '<button onclick="initiateReview(\'' + p.id + '\')" class="text-white px-3 py-1.5 rounded text-[10px] font-bold shadow-sm transition-colors" style="background:#0079c1" onmouseover="this.style.background=\'#005f99\'" onmouseout="this.style.background=\'#0079c1\'">Initiate Review</button>'
            : '';

        var remediateBtn = (role === ROLES.PROJECT_TEAM && p.status === 'Remediation')
            ? '<span class="text-[10px] font-bold px-2 py-1 rounded" style="background:#fff3cd;color:#a16207">Remediation — re-submit when ready</span>'
            : '';

        var selCell = showSel
            ? '<td class="p-4 text-center sel-col" onclick="event.stopPropagation()"><input type="checkbox" class="project-selector w-4 h-4 rounded" data-id="' + p.id + '" style="accent-color:#0079c1"></td>'
            : '';

        return [
            '<tr class="border-b border-gray-100 cursor-pointer transition-colors">',
            selCell,
            '<td class="p-4 text-gray-400 font-mono text-xs" onclick="openEditPage(\'' + p.id + '\')">#' + p.id + '</td>',
            '<td class="p-4 font-bold brand-text" onclick="openEditPage(\'' + p.id + '\')">' + p.name + '</td>',
            '<td class="p-4" onclick="openEditPage(\'' + p.id + '\')"><span class="px-2 py-0.5 rounded text-[10px] font-bold" style="' + methodStyle + '">' + p.method + '</span></td>',
            '<td class="p-4 font-medium text-gray-700" onclick="openEditPage(\'' + p.id + '\')">' + p.pm + '</td>',
            '<td class="p-4 hide-sm" onclick="openEditPage(\'' + p.id + '\')"><span class="px-2 py-1 rounded-md text-[10px] font-bold" style="background:#e6f3fb;color:#0079c1">' + p.r1 + '</span></td>',
            '<td class="p-4 hide-sm" onclick="openEditPage(\'' + p.id + '\')"><span class="px-2 py-1 rounded-md text-[10px] font-bold" style="background:#cce5f5;color:#005f99">' + p.r2 + '</span></td>',
            '<td class="p-4" onclick="openEditPage(\'' + p.id + '\')"><span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold ' + getStatusStyle(p.status) + '">' + p.status + '</span></td>',
            '<td class="p-4" onclick="openEditPage(\'' + p.id + '\')">',
            '  <div class="flex items-center gap-2">',
            '    <div class="w-16 bg-gray-200 rounded-full h-1.5"><div class="h-1.5 rounded-full" style="width:' + pct + '%;background:#0079c1"></div></div>',
            '    <span class="text-[10px] text-gray-500 font-medium">' + pct + '%</span>',
            '  </div>',
            '</td>',
            '<td class="p-4 text-center" onclick="event.stopPropagation()">',
            '  <div class="flex justify-center gap-2 flex-wrap">',
            initiateBtn,
            remediateBtn,
            '    <button onclick="openEditPage(\'' + p.id + '\')" class="text-gray-500 hover:text-gray-700 text-xs font-bold px-3 py-1 rounded hover:bg-gray-100 transition-colors border border-gray-200">Edit</button>',
            '  </div>',
            '</td>',
            '</tr>'
        ].join('');
    }).join('');
}

function initiateReview(id) {
    var p = getProject(id);
    p.status = 'Review In Progress';
    p.reviewRound = p.reviewRound || 1;
    renderTable();
    showToast('Review initiated — PM access locked');
}

// ── New project modal ─────────────────────────────────────

function openNewProjectModal() {
    document.getElementById('new-project-modal').classList.remove('hidden');
}

function closeNewProjectModal() {
    document.getElementById('new-project-modal').classList.add('hidden');
}

function createNewProject() {
    var name = (document.getElementById('new-name').value || '').trim();
    if (!name) { showToast('Project name is required'); return; }

    var r1Start = document.getElementById('new-r1-start').value;
    var r1End   = document.getElementById('new-r1-end').value;
    var r2Start = document.getElementById('new-r2-start').value;
    var r2End   = document.getElementById('new-r2-end').value;

    var r1 = (r1Start && r1End) ? r1Start + ' — ' + r1End : 'TBD';
    var r2 = (r2Start && r2End) ? r2Start + ' — ' + r2End : 'TBD';

    AppState.projects.push({
        id:          document.getElementById('new-id').value.trim() || String(10000 + Math.floor(Math.random() * 89999)),
        name:        name,
        pm:          document.getElementById('new-pm').value,
        method:      document.getElementById('new-method').value,
        status:      'Active',
        reviewRound: 1,
        r1:          r1,
        r2:          r2,
        artifacts:   {}
    });

    // Reset form
    ['new-id','new-name','new-r1-start','new-r1-end','new-r2-start','new-r2-end'].forEach(function (id) {
        document.getElementById(id).value = '';
    });

    closeNewProjectModal();
    renderTable();
    showToast('Project created');
}

// ── Bulk actions ──────────────────────────────────────────

function deleteSelected() {
    var ids = Array.from(document.querySelectorAll('.project-selector:checked')).map(function (cb) { return cb.dataset.id; });
    if (ids.length === 0) { showToast('No projects selected'); return; }
    AppState.projects = AppState.projects.filter(function (p) { return !ids.includes(p.id); });
    renderTable();
    showToast(ids.length + ' project(s) deleted');
}

function duplicateSelected() {
    var ids = Array.from(document.querySelectorAll('.project-selector:checked')).map(function (cb) { return cb.dataset.id; });
    if (ids.length === 0) { showToast('No projects selected'); return; }
    ids.forEach(function (id) {
        var p = getProject(id);
        if (!p) return;
        var copy = JSON.parse(JSON.stringify(p));
        copy.id   = String(10000 + Math.floor(Math.random() * 89999));
        copy.name = p.name + ' (Copy)';
        copy.status = 'Active';
        copy.artifacts = {};
        AppState.projects.push(copy);
    });
    renderTable();
    showToast('Duplicated ' + ids.length + ' project(s)');
}

// ── Filter event wiring (called from app.js DOMContentLoaded) ──

function wireDashboardFilters() {
    document.querySelectorAll('.filter-check').forEach(function (el) {
        el.addEventListener('change', renderTable);
    });
    document.getElementById('pm-filter').addEventListener('change', renderTable);
    document.getElementById('search-filter').addEventListener('input', renderTable);
}

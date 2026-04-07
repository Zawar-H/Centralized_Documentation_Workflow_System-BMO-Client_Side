// ============================================================
// leadership.js — PMO Leadership read-only views.
// ============================================================

var _leadershipDetailProjectId  = null;
var _leadershipDetailArtifactKey = null;

// ── Leadership summary table ──────────────────────────────

function renderLeadershipPage() {
    var body = document.getElementById('leadership-table-body');
    if (!body) return;

    var searchTerm = (document.getElementById('leadership-search') || {}).value || '';

    var filtered = AppState.projects.filter(function (p) {
        return p.name.toLowerCase().includes(searchTerm.toLowerCase());
    });

    body.innerHTML = filtered.map(function (p) {
        var comp = getProjectCompletion(p);
        var pct  = comp.total > 0 ? Math.round((comp.completed / comp.total) * 100) : 0;
        var r1   = buildRatingSummary(p, 1);
        var r2   = buildRatingSummary(p, 2);

        var methodStyle = p.method === 'Agile'
            ? 'background:#e6f3fb;color:#0079c1'
            : 'background:#e2e8f0;color:#475569';

        return [
            '<tr class="border-b border-gray-100 cursor-pointer transition-colors" onclick="openLeadershipDetail(\'' + p.id + '\')">',
            '<td class="p-4">',
            '  <p class="font-bold brand-text">' + p.name + '</p>',
            '  <p class="text-[10px] text-gray-400 font-mono">#' + p.id + '</p>',
            '</td>',
            '<td class="p-4"><span class="px-2 py-0.5 rounded text-[10px] font-bold" style="' + methodStyle + '">' + p.method + '</span></td>',
            '<td class="p-4 text-sm text-gray-700">' + p.pm + '</td>',
            '<td class="p-4"><span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold ' + getStatusStyle(p.status) + '">' + p.status + '</span></td>',
            '<td class="p-4">',
            '  <div class="flex items-center gap-2">',
            '    <div class="w-20 bg-gray-200 rounded-full h-2"><div class="h-2 rounded-full" style="width:' + pct + '%;background:#0079c1"></div></div>',
            '    <span class="text-xs font-bold text-gray-600">' + pct + '%</span>',
            '  </div>',
            '  <p class="text-[10px] text-gray-400 mt-0.5">' + comp.completed + ' / ' + comp.total + ' artifacts</p>',
            '</td>',
            '<td class="p-4">' + formatRatingSummary(r1) + '</td>',
            '<td class="p-4">' + formatRatingSummary(r2) + '</td>',
            '</tr>'
        ].join('');
    }).join('');
}

function buildRatingSummary(project, round) {
    var list = project.method === 'Agile' ? AGILE_ARTIFACTS : WATERFALL_ARTIFACTS;
    var s = 0, ni = 0, u = 0, total = 0;

    list.forEach(function (name) {
        var data = project.artifacts[name];
        if (!data || !data.reviews) return;
        var roundRevs = data.reviews.filter(function (r) { return r.round === round; });
        if (roundRevs.length === 0) return;
        var latest = roundRevs[roundRevs.length - 1];
        total++;
        if (latest.rating === 'Satisfactory')      s++;
        else if (latest.rating === 'Needs Improvement') ni++;
        else if (latest.rating === 'Unsatisfactory')    u++;
    });

    return { satisfactory: s, needsImprovement: ni, unsatisfactory: u, total: total };
}

function formatRatingSummary(r) {
    if (r.total === 0) return '<span class="text-gray-400 text-xs">—</span>';
    var html = '<div class="flex gap-1 flex-wrap">';
    if (r.satisfactory > 0)    html += '<span class="px-1.5 py-0.5 rounded text-[9px] font-bold bg-green-100 text-green-700">' + r.satisfactory + ' S</span>';
    if (r.needsImprovement > 0) html += '<span class="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-100 text-amber-700">' + r.needsImprovement + ' NI</span>';
    if (r.unsatisfactory > 0)  html += '<span class="px-1.5 py-0.5 rounded text-[9px] font-bold bg-red-100 text-red-700">' + r.unsatisfactory + ' U</span>';
    html += '</div>';
    return html;
}

// ── Leadership detail (read-only artifact viewer) ─────────

function openLeadershipDetail(projectId, artifactKey) {
    _leadershipDetailProjectId = projectId;
    var p    = getProject(projectId);
    var list = p.method === 'Agile' ? AGILE_ARTIFACTS : WATERFALL_ARTIFACTS;
    if (!artifactKey) artifactKey = list[0];
    _leadershipDetailArtifactKey = artifactKey;

    // Header
    document.getElementById('detail-project-name').innerText  = p.name;
    document.getElementById('detail-method-badge').innerText  = p.method;
    document.getElementById('detail-artifact-name').innerText = artifactKey;
    document.getElementById('detail-artifact-title').innerText = p.method + ' Artifacts';

    // Sidebar
    var nav = document.getElementById('detail-sidebar-artifacts');
    nav.innerHTML = list.map(function (name) {
        var schema = ARTIFACT_SCHEMAS[name];
        var data   = p.artifacts[name];
        var status = schema ? getArtifactStatus(data, schema.fields) : 'empty';
        var dot    = getDotClass(status);
        var active = name === artifactKey;

        return '<a href="javascript:void(0)" onclick="openLeadershipDetail(\'' + projectId + '\', \'' + name.replace(/'/g, "\\'") + '\')" ' +
            'class="artifact-link flex items-center justify-between px-4 py-2.5 rounded hover:bg-slate-800 transition-colors ' + (active ? 'active' : 'text-slate-400') + '">' +
            '<span class="truncate">' + name + '</span>' +
            '<span class="w-2 h-2 rounded-full flex-shrink-0 ml-2 ' + dot + '"></span>' +
            '</a>';
    }).join('');

    // Content
    renderLeadershipDetailContent(p, artifactKey);
    showPage('leadership-detail-page');
}

function renderLeadershipDetailContent(project, artifactKey) {
    var schema = ARTIFACT_SCHEMAS[artifactKey];
    var data   = project.artifacts[artifactKey];

    // Read-only form fields
    var formHtml = '<div class="bg-white rounded-xl border border-gray-200 shadow-sm p-6">';
    formHtml += '<h3 class="text-sm font-bold text-gray-800 mb-4 border-b pb-2">Submitted Documentation Fields</h3>';

    if (!schema) {
        formHtml += '<p class="text-sm text-gray-400 italic">No schema for this artifact.</p>';
    } else if (!data || !data.fields || Object.keys(data.fields).length === 0) {
        formHtml += '<p class="text-sm text-gray-400 italic">No data submitted for this artifact yet.</p>';
    } else {
        var singleFields   = schema.fields.filter(function (f) { return f.type !== 'textarea'; });
        var textareaFields = schema.fields.filter(function (f) { return f.type === 'textarea'; });

        if (singleFields.length > 0) {
            formHtml += '<div class="grid grid-cols-2 gap-4 mb-4">';
            singleFields.forEach(function (field) {
                var val = (data.fields && data.fields[field.key]) || '';
                formHtml += '<div class="space-y-1">';
                formHtml += '<label class="text-[10px] font-bold text-gray-500 uppercase tracking-widest">' + field.label + '</label>';
                formHtml += '<p class="p-2.5 bg-gray-50 border border-gray-100 rounded-lg text-sm text-gray-700">' + (val ? escapeHtml(String(val)) : '<span class="text-gray-400 italic text-xs">—</span>') + '</p>';
                formHtml += '</div>';
            });
            formHtml += '</div>';
        }

        textareaFields.forEach(function (field) {
            var val = (data.fields && data.fields[field.key]) || '';
            formHtml += '<div class="space-y-1 mb-4">';
            formHtml += '<label class="text-[10px] font-bold text-gray-500 uppercase tracking-widest">' + field.label + '</label>';
            formHtml += '<p class="p-2.5 bg-gray-50 border border-gray-100 rounded-lg text-sm text-gray-700 whitespace-pre-wrap min-h-[60px]">' + (val ? escapeHtml(String(val)) : '<span class="text-gray-400 italic text-xs">—</span>') + '</p>';
            formHtml += '</div>';
        });
    }

    // Attached files
    if (data && data.files && data.files.length > 0) {
        formHtml += '<div class="mt-4 pt-4 border-t">';
        formHtml += '<p class="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Attached Files</p>';
        data.files.forEach(function (f) {
            formHtml += '<span class="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded text-xs font-medium text-gray-700 mr-2 mb-1">' + escapeHtml(f.name) + '</span>';
        });
        formHtml += '</div>';
    }

    formHtml += '</div>';

    // Reviews section
    var reviewsHtml = '<div class="bg-white rounded-xl border border-gray-200 shadow-sm p-6">';
    reviewsHtml += '<h3 class="text-sm font-bold text-gray-800 mb-4 border-b pb-2">Review History</h3>';

    if (!data || !data.reviews || data.reviews.length === 0) {
        reviewsHtml += '<p class="text-sm text-gray-400 italic">No reviews submitted for this artifact yet.</p>';
    } else {
        reviewsHtml += '<div class="space-y-3">';
        data.reviews.forEach(function (r) {
            reviewsHtml += '<div class="border border-gray-100 rounded-xl p-4">';
            reviewsHtml += '<div class="flex justify-between items-center mb-2">';
            reviewsHtml += '<div class="flex items-center gap-2">' +
                '<span class="text-xs font-bold text-gray-600">Round ' + r.round + '</span>' +
                getRatingBadge(r.rating) +
                '</div>';
            reviewsHtml += '<span class="text-[10px] text-gray-400">' + escapeHtml(r.reviewer || '') + ' · ' + escapeHtml(r.timestamp || '') + '</span>';
            reviewsHtml += '</div>';
            if (r.comment) {
                reviewsHtml += '<p class="text-sm text-gray-700">' + escapeHtml(r.comment) + '</p>';
            }
            reviewsHtml += '</div>';
        });
        reviewsHtml += '</div>';
    }
    reviewsHtml += '</div>';

    document.getElementById('detail-form-content').innerHTML     = formHtml;
    document.getElementById('detail-reviews-section').innerHTML  = reviewsHtml;
}

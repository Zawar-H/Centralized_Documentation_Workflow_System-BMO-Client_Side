// ============================================================
// editor.js — Artifact edit page: guided forms, file upload,
//             history, comments, header actions, sidebar dots.
// ============================================================

function openEditPage(projectId, artifactKey) {
    // Leadership role goes to read-only detail view
    if (isLeadership(AppState.currentRole)) {
        openLeadershipDetail(projectId, artifactKey);
        return;
    }

    AppState.currentEditingId  = projectId;
    var p    = getProject(projectId);
    var list = p.method === 'Agile' ? AGILE_ARTIFACTS : WATERFALL_ARTIFACTS;
    if (!artifactKey) artifactKey = list[0];
    AppState.currentArtifactKey = artifactKey;

    // Header
    document.getElementById('edit-project-name').innerText   = p.name;
    document.getElementById('edit-method-badge').innerText   = p.method;
    document.getElementById('current-artifact-name').innerText = artifactKey;
    document.getElementById('artifact-title').innerText      = p.method + ' Artifacts';

    var data = getArtifactData(projectId, artifactKey);

    renderArtifactSidebar(p, artifactKey);
    updateCompletionBar(p);

    var isLocked = (p.status === 'Review In Progress');
    document.getElementById('edit-form-container') &&
        document.getElementById('edit-form-container').classList.toggle('locked-overlay', isLocked);

    // Render the dynamic sections
    document.getElementById('guided-form-fields').innerHTML = renderGuidedForm(artifactKey, data, isLocked);
    document.getElementById('upload-section').innerHTML      = renderUploadSection(data, isLocked);
    renderHistory();
    renderComments();
    renderHeaderActions(p);

    showPage('edit-page');
}

// ── Sidebar ───────────────────────────────────────────────

function renderArtifactSidebar(project, activeKey) {
    var list = project.method === 'Agile' ? AGILE_ARTIFACTS : WATERFALL_ARTIFACTS;
    var nav  = document.getElementById('sidebar-artifacts');
    if (!nav) return;

    nav.innerHTML = list.map(function (name) {
        var schema  = ARTIFACT_SCHEMAS[name];
        var data    = project.artifacts[name];
        var status  = schema ? getArtifactStatus(data, schema.fields) : 'empty';
        var dotCls  = getDotClass(status);
        var isActive = name === activeKey;

        return '<a href="javascript:void(0)" onclick="openEditPage(\'' + project.id + '\', \'' + escapeSingleQuotes(name) + '\')" ' +
            'class="artifact-link flex items-center justify-between px-4 py-2.5 rounded hover:bg-slate-800 transition-colors ' + (isActive ? 'active' : 'text-slate-400') + '">' +
            '<span class="truncate">' + name + '</span>' +
            '<span class="w-2 h-2 rounded-full flex-shrink-0 ml-2 ' + dotCls + '"></span>' +
            '</a>';
    }).join('');
}

function updateCompletionBar(project) {
    var comp = getProjectCompletion(project);
    var pct  = comp.total > 0 ? Math.round((comp.completed / comp.total) * 100) : 0;
    var bar  = document.getElementById('completion-progress-bar');
    var txt  = document.getElementById('completion-progress-text');
    if (bar) bar.style.width = pct + '%';
    if (txt) txt.textContent = comp.completed + ' / ' + comp.total;
}

// ── Guided form rendering (schema-driven) ─────────────────

function renderGuidedForm(artifactKey, artifactData, isLocked) {
    var schema = ARTIFACT_SCHEMAS[artifactKey];
    if (!schema) return '<p class="text-sm text-gray-400 italic">No schema defined for this artifact.</p>';

    var role      = AppState.currentRole;
    var editable  = canEditArtifact(role) && !isLocked;

    var html = '<div class="grid grid-cols-1 gap-4">';

    // Group: single-line fields in a 2-col grid, textareas full width
    var singleFields = schema.fields.filter(function (f) { return f.type !== 'textarea'; });
    var textareaFields = schema.fields.filter(function (f) { return f.type === 'textarea'; });

    if (singleFields.length > 0) {
        html += '<div class="grid grid-cols-2 gap-4">';
        singleFields.forEach(function (field) {
            var val = (artifactData && artifactData.fields && artifactData.fields[field.key]) || '';
            var req = field.required ? '<span class="text-red-500 ml-0.5">*</span>' : '';
            html += '<div class="space-y-1">';
            html += '<label class="text-[10px] font-bold text-gray-500 uppercase tracking-widest">' + field.label + req + '</label>';
            if (editable) {
                html += '<input type="' + field.type + '" data-key="' + field.key + '" value="' + escapeHtml(String(val)) + '" placeholder="' + escapeHtml(field.placeholder || '') + '" class="guided-input w-full p-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 transition-colors">';
            } else {
                html += '<p class="p-2.5 bg-gray-50 border border-gray-100 rounded-lg text-sm text-gray-700">' + (val ? escapeHtml(String(val)) : '<span class="text-gray-400 italic text-xs">Not provided</span>') + '</p>';
            }
            html += '</div>';
        });
        html += '</div>';
    }

    textareaFields.forEach(function (field) {
        var val = (artifactData && artifactData.fields && artifactData.fields[field.key]) || '';
        var req = field.required ? '<span class="text-red-500 ml-0.5">*</span>' : '';
        html += '<div class="space-y-1">';
        html += '<label class="text-[10px] font-bold text-gray-500 uppercase tracking-widest">' + field.label + req + '</label>';
        if (editable) {
            html += '<textarea data-key="' + field.key + '" rows="3" placeholder="' + escapeHtml(field.placeholder || '') + '" class="guided-textarea w-full p-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 transition-colors resize-none">' + escapeHtml(String(val)) + '</textarea>';
        } else {
            html += '<p class="p-2.5 bg-gray-50 border border-gray-100 rounded-lg text-sm text-gray-700 whitespace-pre-wrap min-h-[60px]">' + (val ? escapeHtml(String(val)) : '<span class="text-gray-400 italic text-xs">Not provided</span>') + '</p>';
        }
        html += '</div>';
    });

    // Show required field notice
    if (editable) {
        html += '<p class="text-[11px] text-gray-400"><span class="text-red-500">*</span> Required fields must be completed before marking the project Ready for Review.</p>';
    }

    html += '</div>';
    return html;
}

// ── File upload section ───────────────────────────────────

function renderUploadSection(artifactData, isLocked) {
    var files = (artifactData && artifactData.files) ? artifactData.files : [];
    var role  = AppState.currentRole;
    var canUpload = canEditArtifact(role) && !isLocked;

    var html = '';

    if (canUpload) {
        html += '<div class="mb-4">';
        html += '<label class="flex items-center gap-3 px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-400 transition-colors bg-gray-50 hover:bg-blue-50">';
        html += '<span class="text-sm text-gray-600">Attach files <span class="text-gray-400">(Word, Excel, PowerPoint, PDF)</span></span>';
        html += '<input type="file" class="hidden" multiple accept=".docx,.xlsx,.pptx,.pdf,.doc,.xls,.ppt" onchange="handleFileUpload(event)">';
        html += '</label>';
        html += '</div>';
    }

    if (files.length === 0) {
        html += '<p class="text-sm text-gray-400 italic">No files attached yet.</p>';
    } else {
        html += '<div class="space-y-2">';
        files.forEach(function (f, i) {
            var sizeKb  = f.size ? (f.size / 1024).toFixed(1) + ' KB' : '';

            html += '<div class="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5">';
            html += '<div class="flex items-center gap-3">';
            html += '<div>';
            html += '<p class="text-sm font-medium text-gray-800">' + escapeHtml(f.name) + '</p>';
            if (sizeKb) html += '<p class="text-[10px] text-gray-400">' + sizeKb + '</p>';
            html += '</div>';
            html += '</div>';
            if (canUpload) {
                html += '<button onclick="handleRemoveFile(' + i + ')" class="text-red-400 hover:text-red-600 text-xs font-bold px-2 py-1 rounded hover:bg-red-50 transition-colors">Remove</button>';
            }
            html += '</div>';
        });
        html += '</div>';
    }

    return html;
}

function handleFileUpload(event) {
    var data = getArtifactData(AppState.currentEditingId, AppState.currentArtifactKey);
    var newFiles = Array.from(event.target.files);
    newFiles.forEach(function (file) {
        data.files.push({ name: file.name, size: file.size, fileObject: file });
    });
    var isLocked = getProject(AppState.currentEditingId).status === 'Review In Progress';
    document.getElementById('upload-section').innerHTML = renderUploadSection(data, isLocked);
    showToast(newFiles.length + ' file(s) attached');
}

function handleRemoveFile(index) {
    var data = getArtifactData(AppState.currentEditingId, AppState.currentArtifactKey);
    var removed = data.files.splice(index, 1);
    var isLocked = getProject(AppState.currentEditingId).status === 'Review In Progress';
    document.getElementById('upload-section').innerHTML = renderUploadSection(data, isLocked);
    showToast('File removed');
}

// ── Save ──────────────────────────────────────────────────

function handleSaveChanges() {
    var data = getArtifactData(AppState.currentEditingId, AppState.currentArtifactKey);

    // Collect all guided form field values by data-key attribute
    var changed = [];
    document.querySelectorAll('#guided-form-fields [data-key]').forEach(function (el) {
        var key = el.dataset.key;
        if (data.fields[key] !== el.value) changed.push(key);
        data.fields[key] = el.value;
    });

    var actionText = changed.length > 0
        ? 'Saved: ' + changed.map(function (k) { return k; }).join(', ')
        : 'Saved ' + AppState.currentArtifactKey + ' (no changes)';

    data.history.unshift({
        timestamp: new Date().toLocaleString(),
        actor:     ROLE_LABELS[AppState.currentRole] || AppState.currentRole,
        action:    actionText
    });

    // Re-render sidebar dots + progress bar
    var p = getProject(AppState.currentEditingId);
    renderArtifactSidebar(p, AppState.currentArtifactKey);
    updateCompletionBar(p);
    renderHistory();

    showToast('Saved: ' + AppState.currentArtifactKey);
}

// ── Mark Ready for Review ────────────────────────────────

function markReadyForReview() {
    var p      = getProject(AppState.currentEditingId);
    var result = canMarkReadyForReview(p);

    if (!result.allowed) {
        var missing = result.incompleteList.slice(0, 3).join(', ');
        var more    = result.incompleteList.length > 3 ? ' (+' + (result.incompleteList.length - 3) + ' more)' : '';
        showToast('Incomplete artifacts: ' + missing + more);

        // Re-render sidebar to show dots
        renderArtifactSidebar(p, AppState.currentArtifactKey);
        return;
    }

    // If coming back from Remediation, increment round
    if (p.status === 'Remediation') {
        p.reviewRound = 2;
    }

    p.status = 'Ready for Review';
    renderHeaderActions(p);
    renderTable();
    showToast('Project marked Ready for Review');
}

// ── Header actions ────────────────────────────────────────

function renderHeaderActions(project) {
    var role     = AppState.currentRole;
    var actions  = document.getElementById('edit-header-actions');
    if (!actions) return;

    var isLocked = project.status === 'Review In Progress';
    actions.innerHTML = '';

    if (role === ROLES.PROJECT_TEAM) {
        if (isLocked) {
            actions.innerHTML = '<span class="bg-red-50 text-red-600 px-4 py-2 rounded-lg font-bold border border-red-200 text-sm">Locked — Review In Progress</span>';
        } else if (project.status === 'Completed') {
            actions.innerHTML = '<span class="bg-blue-50 px-4 py-2 rounded-lg font-bold border text-sm" style="color:#0079c1;border-color:#cce5f5">Project Completed</span>';
        } else {
            var readyLabel = project.status === 'Remediation' ? 'Re-submit for Round 2 Review' : 'Mark Ready for Review';
            actions.innerHTML =
                '<button onclick="markReadyForReview()" class="bg-amber-50 text-amber-600 border border-amber-200 px-4 py-2 rounded-lg text-sm font-bold hover:bg-amber-100 transition-colors">' + readyLabel + '</button>' +
                '<button onclick="handleSaveChanges()" class="text-white px-6 py-2 rounded-lg text-sm font-bold transition-colors" style="background:#0079c1" onmouseover="this.style.background=\'#005f99\'" onmouseout="this.style.background=\'#0079c1\'">Save Changes</button>';
        }

    } else if (isReviewer(role)) {
        var canReview = canReviewArtifact(role, AppState.currentArtifactKey);

        if (project.status === 'Review In Progress' || project.status === 'Remediation') {
            var reviewedCount = countReviewedArtifacts(project);
            var totalCount    = (project.method === 'Agile' ? AGILE_ARTIFACTS : WATERFALL_ARTIFACTS).length;

            if (canReview) {
                actions.innerHTML +=
                    '<button onclick="openReviewModal()" class="text-white px-5 py-2 rounded-lg text-sm font-bold transition-colors" style="background:#0079c1" onmouseover="this.style.background=\'#005f99\'" onmouseout="this.style.background=\'#0079c1\'">Review This Artifact</button>';
            } else {
                actions.innerHTML += '<span class="text-xs text-slate-400 italic">Not in your review scope</span>';
            }

            if (canCompleteReview(role) && project.status === 'Review In Progress') {
                actions.innerHTML +=
                    '<button onclick="completeProjectReview()" class="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg text-sm font-bold transition-colors ml-2">Complete Review (' + reviewedCount + '/' + totalCount + ')</button>';
            }
        } else {
            actions.innerHTML = '<span class="text-xs text-gray-400 italic">Project not under review</span>';
        }
    }
}

function countReviewedArtifacts(project) {
    var list  = project.method === 'Agile' ? AGILE_ARTIFACTS : WATERFALL_ARTIFACTS;
    var round = project.reviewRound || 1;
    return list.filter(function (name) {
        var data = project.artifacts[name];
        return data && data.reviews && data.reviews.some(function (r) { return r.round === round; });
    }).length;
}

// ── History & Comments ────────────────────────────────────

function renderHistory() {
    var el   = document.getElementById('history-log');
    if (!el) return;
    var data = getArtifactData(AppState.currentEditingId, AppState.currentArtifactKey);

    if (!data.history || data.history.length === 0) {
        el.innerHTML = '<p class="text-gray-400 text-xs italic">No history yet.</p>';
        return;
    }

    el.innerHTML = data.history.map(function (h) {
        return '<div class="border-l-2 pl-3 py-1" style="border-color:#cce5f5">' +
            '<p class="text-[9px] font-bold text-gray-400 uppercase">' + escapeHtml(h.timestamp) + (h.actor ? ' · ' + escapeHtml(h.actor) : '') + '</p>' +
            '<p class="text-gray-700 text-[11px]">' + escapeHtml(h.action) + '</p>' +
            '</div>';
    }).join('');
}

function renderComments() {
    var el   = document.getElementById('comments-container');
    if (!el) return;
    var data = getArtifactData(AppState.currentEditingId, AppState.currentArtifactKey);

    if (!data.comments || data.comments.length === 0) {
        el.innerHTML = '<p class="text-gray-400 text-xs italic">No comments yet.</p>';
        return;
    }

    el.innerHTML = data.comments.map(function (c) {
        var roleStyle = c.role === 'PMO_REVIEWER' || c.role === 'DELIVERY_REVIEWER'
            ? 'background:#e6f3fb;color:#0079c1'
            : 'background:#f3f4f6;color:#374151';
        return '<div class="p-3 border border-gray-100 rounded-lg text-xs shadow-sm" style="' + roleStyle + '">' +
            '<div class="flex justify-between mb-1"><span class="font-bold">' + escapeHtml(c.user) + '</span><span class="text-[9px] opacity-70">' + escapeHtml(c.time || c.timestamp || '') + '</span></div>' +
            '<p>' + escapeHtml(c.text) + '</p>' +
            '</div>';
    }).join('');
}

function handleSendComment() {
    var input = document.getElementById('comment-input');
    if (!input || !input.value.trim()) return;
    var data = getArtifactData(AppState.currentEditingId, AppState.currentArtifactKey);
    data.comments.push({
        user:      ROLE_LABELS[AppState.currentRole] || AppState.currentRole,
        role:      AppState.currentRole,
        text:      input.value.trim(),
        timestamp: new Date().toLocaleString()
    });
    input.value = '';
    renderComments();
}

// ── Utility ───────────────────────────────────────────────

function escapeHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function escapeSingleQuotes(str) {
    return String(str).replace(/'/g, "\\'");
}

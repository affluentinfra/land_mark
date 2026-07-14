/* =========================================================================
   LANDMARK REALTORS - ADMIN PLATFORM MOTOR (admin.js)
   ========================================================================= */

// Local state caches
let adminPropertiesList = [];
let adminInquiriesList = [];
let currentEditingPropertyId = null;

// =========================================================================
// 1. AUTHENTICATION & INITIALIZATION GATE
// =========================================================================
document.addEventListener('DOMContentLoaded', () => {
    // Check if Supabase credentials exist, set form placeholders
    const localUrl = localStorage.getItem('LANDMARK_SUPABASE_URL');
    const localKey = localStorage.getItem('LANDMARK_SUPABASE_ANON_KEY');
    
    if (document.getElementById('config-url') && localUrl) {
        document.getElementById('config-url').value = localUrl;
    }
    if (document.getElementById('config-key') && localKey) {
        document.getElementById('config-key').value = localKey;
    }

    // Auth verification check
    checkAdminSession();

    // Bind Auth controls
    const loginForm = document.getElementById('admin-login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    const devBypassBtn = document.getElementById('btn-dev-bypass');
    if (devBypassBtn) {
        devBypassBtn.addEventListener('click', handleBypass);
    }

    const logoutBtn = document.getElementById('btn-admin-logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }

    // Bind DB config controls
    const dbConfigForm = document.getElementById('db-config-form');
    if (dbConfigForm) {
        dbConfigForm.addEventListener('submit', saveDbConfig);
    }

    const clearConfigBtn = document.getElementById('btn-clear-config');
    if (clearConfigBtn) {
        clearConfigBtn.addEventListener('click', clearDbConfig);
    }
});

async function checkAdminSession() {
    const authContainer = document.getElementById('admin-auth-container');
    const dashboardLayout = document.getElementById('admin-dashboard-layout');
    
    const isBypass = sessionStorage.getItem('LANDMARK_ADMIN_BYPASS') === 'true';
    let isDbAuth = false;

    if (supabaseClient) {
        try {
            const { data, error } = await supabaseClient.auth.getSession();
            if (data && data.session) {
                isDbAuth = true;
            }
        } catch (e) {
            console.warn("Could not check auth session, database might not be configured.", e);
        }
    }

    if (isBypass || isDbAuth) {
        // Authenticated! Show dashboard
        if (authContainer) authContainer.style.display = 'none';
        if (dashboardLayout) {
            dashboardLayout.style.display = 'grid';
            initAdminDashboard();
        }
    } else {
        // Not authenticated, show login form
        if (authContainer) authContainer.style.display = 'block';
        if (dashboardLayout) dashboardLayout.style.display = 'none';
    }
}

async function handleLogin(e) {
    e.preventDefault();
    const status = document.getElementById('auth-form-status');
    status.innerText = "";
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const submitBtn = document.getElementById('btn-login-submit');

    if (!supabaseClient) {
        status.innerHTML = "Supabase client not initialized. Please connect your DB config below first or use Bypass Mode.";
        return;
    }

    submitBtn.disabled = true;
    status.innerHTML = "<span style='color: var(--color-gold-premium);'><i class='fa-solid fa-spinner fa-spin'></i> Authenticating user...</span>";

    try {
        const { data, error } = await supabaseClient.auth.signInWithPassword({
            email: email,
            password: password
        });

        if (error) throw error;
        
        status.innerHTML = "<span style='color: #4ade80;'>Success! Access Granted.</span>";
        setTimeout(() => {
            checkAdminSession();
        }, 800);
    } catch (err) {
        console.error("Auth error:", err);
        status.innerHTML = `Error: ${err.message || 'Invalid credentials'}`;
        submitBtn.disabled = false;
    }
}

function handleBypass() {
    sessionStorage.setItem('LANDMARK_ADMIN_BYPASS', 'true');
    checkAdminSession();
}

async function handleLogout() {
    sessionStorage.removeItem('LANDMARK_ADMIN_BYPASS');
    if (supabaseClient) {
        try {
            await supabaseClient.auth.signOut();
        } catch (e) {
            console.error("Sign out error", e);
        }
    }
    location.reload();
}

// Save DB credentials locally in browser
function saveDbConfig(e) {
    e.preventDefault();
    const status = document.getElementById('config-form-status');
    const url = document.getElementById('config-url').value.trim();
    const key = document.getElementById('config-key').value.trim();

    localStorage.setItem('LANDMARK_SUPABASE_URL', url);
    localStorage.setItem('LANDMARK_SUPABASE_ANON_KEY', key);

    status.innerHTML = "<span style='color: #4ade80;'>Settings saved! Re-initializing database client...</span>";
    
    setTimeout(() => {
        location.reload();
    }, 1000);
}

function clearDbConfig() {
    localStorage.removeItem('LANDMARK_SUPABASE_URL');
    localStorage.removeItem('LANDMARK_SUPABASE_ANON_KEY');
    location.reload();
}

// =========================================================================
// 2. DASHBOARD ENGINE & CONTROLS
// =========================================================================
function initAdminDashboard() {
    console.log("Admin Dashboard Loaded.");

    // Setup Sidebar Menu Tab switching
    const menuItems = document.querySelectorAll('.admin-menu-item');
    const tabContents = document.querySelectorAll('.admin-tab-content');

    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            const targetTab = item.getAttribute('data-tab');
            
            // Toggle active menu class
            menuItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');

            // Toggle active content panel
            tabContents.forEach(content => {
                if (content.id === targetTab) {
                    content.style.display = 'block';
                } else {
                    content.style.display = 'none';
                }
            });

            // Trigger data loads when switching tabs
            if (targetTab === 'tab-properties-list') {
                loadAdminProperties();
            } else if (targetTab === 'tab-inquiries-inbox') {
                loadAdminInquiries();
            } else if (targetTab === 'tab-property-form' && !currentEditingPropertyId) {
                // If opening add form fresh, clear it
                resetPropertyForm();
            }
        });
    });

    // Sub-buttons binders
    const addShortcut = document.getElementById('btn-add-new-shortcut');
    if (addShortcut) {
        addShortcut.addEventListener('click', () => {
            currentEditingPropertyId = null;
            resetPropertyForm();
            document.getElementById('menu-add-property').click();
        });
    }

    const cancelFormBtn = document.getElementById('btn-cancel-form');
    if (cancelFormBtn) {
        cancelFormBtn.addEventListener('click', () => {
            document.getElementById('menu-properties').click();
        });
    }

    // Dynamic Images URL List builder binders
    const addImageBtn = document.getElementById('btn-add-image-url');
    if (addImageBtn) {
        addImageBtn.addEventListener('click', () => addImageUrlField(""));
    }

    // Dynamic Custom Specs builder binders
    const addSpecBtn = document.getElementById('btn-add-custom-field');
    if (addSpecBtn) {
        addSpecBtn.addEventListener('click', () => addCustomFieldRow("", ""));
    }

    // CRUD Property Form submission
    const crudForm = document.getElementById('property-crud-form');
    if (crudForm) {
        crudForm.addEventListener('submit', handlePropertySubmit);
    }

    // Live search filters on Admin listings table
    const tableSearch = document.getElementById('admin-search-property');
    if (tableSearch) {
        tableSearch.addEventListener('input', () => {
            filterPropertiesTable(tableSearch.value);
        });
    }

    // Initial Load lists
    loadAdminProperties();
    loadAdminInquiries();
}

// =========================================================================
// 3. PROPERTY MANAGEMENT (CREATE / READ / UPDATE / DELETE)
// =========================================================================
async function loadAdminProperties() {
    const tableBody = document.getElementById('admin-properties-table-body');
    if (!tableBody) return;

    try {
        let properties = [];
        if (supabaseClient) {
            const { data, error } = await supabaseClient
                .from('properties')
                .select('*')
                .order('created_at', { ascending: false });
            
            if (data) properties = data;
        }
        
        // Fallback placeholder checks for mockup presentation
        if (properties.length === 0) {
            properties = PLACEHOLDER_PROPERTIES;
        }

        adminPropertiesList = properties;
        renderPropertiesTable(properties);

    } catch (err) {
        console.error("Failed loading admin listings:", err);
        tableBody.innerHTML = `<tr><td colspan="7" style="color: #f87171; text-align: center; padding: 2rem;">Error accessing database structure: ${err.message}</td></tr>`;
    }
}

function renderPropertiesTable(properties) {
    const tableBody = document.getElementById('admin-properties-table-body');
    if (!tableBody) return;

    if (properties.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="7" style="text-align: center; padding: 3rem;">No property listings in your index. Click "Add New Property" to start.</td></tr>`;
        return;
    }

    tableBody.innerHTML = properties.map(prop => {
        const cover = (prop.images && prop.images.length > 0) ? prop.images[0] : 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=80';
        return `
            <tr id="admin-row-${prop.id}">
                <td>
                    <img src="${cover}" alt="cover" width="60" height="45" style="object-fit: cover; border: 1px solid var(--border-glass);">
                </td>
                <td style="font-weight: 500; color: var(--text-primary);">${prop.title}</td>
                <td>${prop.location}</td>
                <td style="font-family: var(--font-heading); color: var(--color-gold-premium); font-size: 1.1rem; font-weight: 600;">${prop.price_display}</td>
                <td><span class="badge-type ${prop.type}">${prop.type}</span></td>
                <td style="text-transform: capitalize; font-size: 0.8rem;">${prop.category}</td>
                <td>
                    <div class="action-btns">
                        <button class="action-btn edit" onclick="startPropertyEdit('${prop.id}')" title="Edit listing">
                            <i class="fa-solid fa-pen-to-square"></i> Edit
                        </button>
                        <button class="action-btn delete" onclick="deletePropertyItem('${prop.id}')" title="Delete listing">
                            <i class="fa-solid fa-trash"></i> Delete
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

function filterPropertiesTable(query) {
    const term = query.toLowerCase();
    const rows = document.querySelectorAll('#admin-properties-table-body tr');
    
    rows.forEach(row => {
        const text = row.innerText.toLowerCase();
        if (text.includes(term) || row.id.includes('no-results')) {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }
    });
}

// Delete Property item trigger
window.deletePropertyItem = async function(id) {
    if (!confirm("Are you sure you want to permanently delete this property listing? This cannot be undone.")) return;

    const row = document.getElementById(`admin-row-${id}`);
    if (row) row.style.opacity = "0.4";

    try {
        if (id.startsWith('placeholder-')) {
            // Local memory delete (Bypass)
            alert("Placeholder property deleted locally. Setup Supabase to save changes permanently.");
            adminPropertiesList = adminPropertiesList.filter(p => p.id !== id);
            renderPropertiesTable(adminPropertiesList);
        } else if (supabaseClient) {
            const { error } = await supabaseClient
                .from('properties')
                .delete()
                .eq('id', id);

            if (error) throw error;
            
            alert("Property deleted successfully.");
            loadAdminProperties();
        } else {
            throw new Error("Supabase client offline.");
        }
    } catch (err) {
        console.error("Deletion failed:", err);
        alert(`Failed to delete: ${err.message}`);
        if (row) row.style.opacity = "1";
    }
};

// =========================================================================
// 4. FORM DYNAMICS & SAVE HANDLER
// =========================================================================
function addImageUrlField(url = "") {
    const container = document.getElementById('image-urls-container');
    if (!container) return;

    const div = document.createElement('div');
    div.className = 'list-builder-item';
    div.innerHTML = `
        <input type="url" class="form-control prop-image-url" value="${url}" placeholder="https://images.unsplash.com/photo-..." required>
        <button type="button" class="remove-field-btn"><i class="fa-solid fa-trash"></i></button>
    `;
    
    // bind delete event
    div.querySelector('.remove-field-btn').addEventListener('click', () => {
        div.remove();
        updateImageTrashButtons();
    });

    container.appendChild(div);
    updateImageTrashButtons();
}

function updateImageTrashButtons() {
    const items = document.querySelectorAll('#image-urls-container .list-builder-item');
    if (items.length <= 1) {
        items[0].querySelector('.remove-field-btn').disabled = true;
    } else {
        items.forEach(item => {
            item.querySelector('.remove-field-btn').disabled = false;
        });
    }
}

function addCustomFieldRow(key = "", val = "") {
    const container = document.getElementById('custom-fields-container');
    if (!container) return;

    const div = document.createElement('div');
    div.className = 'dynamic-field-row';
    div.innerHTML = `
        <input type="text" class="form-control spec-key" value="${key}" placeholder="e.g., Carpet Area" required>
        <input type="text" class="form-control spec-value" value="${val}" placeholder="e.g., 2,500 Sq.Ft" required>
        <button type="button" class="remove-field-btn"><i class="fa-solid fa-trash"></i></button>
    `;

    div.querySelector('.remove-field-btn').addEventListener('click', () => {
        div.remove();
    });

    container.appendChild(div);
}

function resetPropertyForm() {
    const form = document.getElementById('property-crud-form');
    if (!form) return;

    form.reset();
    document.getElementById('property-id-field').value = "";
    document.getElementById('form-section-title').innerText = "Add Commercial Listing";
    
    // reset image fields (keep exactly one empty field)
    const imagesContainer = document.getElementById('image-urls-container');
    if (imagesContainer) {
        imagesContainer.innerHTML = "";
        addImageUrlField("");
    }

    // reset specs
    const specsContainer = document.getElementById('custom-fields-container');
    if (specsContainer) {
        specsContainer.innerHTML = "";
    }
    
    document.getElementById('form-submit-status').innerHTML = "";
}

// Edit Property Trigger
window.startPropertyEdit = function(id) {
    const prop = adminPropertiesList.find(p => p.id === id);
    if (!prop) return;

    currentEditingPropertyId = id;
    resetPropertyForm();

    document.getElementById('property-id-field').value = prop.id;
    document.getElementById('form-section-title').innerText = `Edit: ${prop.title}`;

    document.getElementById('prop-title').value = prop.title;
    document.getElementById('prop-desc').value = prop.description;
    document.getElementById('prop-location').value = prop.location;
    document.getElementById('prop-price').value = prop.price;
    document.getElementById('prop-price-display').value = prop.price_display;
    document.getElementById('prop-type').value = prop.type;
    document.getElementById('prop-category').value = prop.category;
    document.getElementById('prop-video').value = prop.video_url || "";

    // load images URLs
    const imagesContainer = document.getElementById('image-urls-container');
    if (imagesContainer && prop.images && prop.images.length > 0) {
        imagesContainer.innerHTML = ""; // clear single template one
        prop.images.forEach(img => addImageUrlField(img));
    }

    // load custom fields specs
    if (prop.custom_fields && Object.keys(prop.custom_fields).length > 0) {
        Object.entries(prop.custom_fields).forEach(([key, val]) => {
            addCustomFieldRow(key, val);
        });
    }

    // Navigate to Form Tab
    document.getElementById('menu-add-property').click();
};

async function handlePropertySubmit(e) {
    e.preventDefault();
    const status = document.getElementById('form-submit-status');
    const submitBtn = document.getElementById('btn-save-property');

    submitBtn.disabled = true;
    status.innerHTML = "<span style='color: var(--color-gold-premium);'><i class='fa-solid fa-spinner fa-spin'></i> Submitting property package...</span>";

    const id = document.getElementById('property-id-field').value;
    const title = document.getElementById('prop-title').value;
    const description = document.getElementById('prop-desc').value;
    const location = document.getElementById('prop-location').value;
    const price = Number(document.getElementById('prop-price').value);
    const price_display = document.getElementById('prop-price-display').value;
    const type = document.getElementById('prop-type').value;
    const category = document.getElementById('prop-category').value;
    const video_url = document.getElementById('prop-video').value;

    // Collect images array
    const imageInputs = document.querySelectorAll('.prop-image-url');
    const images = Array.from(imageInputs).map(inp => inp.value.trim()).filter(val => val !== "");

    // Collect custom specifications JSON
    const custom_fields = {};
    const specRows = document.querySelectorAll('.dynamic-field-row');
    specRows.forEach(row => {
        const key = row.querySelector('.spec-key').value.trim();
        const val = row.querySelector('.spec-value').value.trim();
        if (key && val) {
            custom_fields[key] = val;
        }
    });

    const payload = {
        title,
        description,
        location,
        price,
        price_display,
        type,
        category,
        video_url,
        images,
        custom_fields
    };

    try {
        if (id.startsWith('placeholder-') || (!supabaseClient && sessionStorage.getItem('LANDMARK_ADMIN_BYPASS') === 'true')) {
            // Local mockup insert/update (Bypass Mode)
            if (id) {
                // Update
                const index = adminPropertiesList.findIndex(p => p.id === id);
                if (index !== -1) {
                    adminPropertiesList[index] = { ...adminPropertiesList[index], ...payload };
                }
            } else {
                // Insert
                payload.id = `placeholder-${Date.now()}`;
                payload.created_at = new Date().toISOString();
                adminPropertiesList.unshift(payload);
            }
            
            status.innerHTML = "<span style='color: var(--color-gold-premium);'><i class='fa-solid fa-triangle-exclamation'></i> Dev Mode: Saved locally in browser storage! Setup Supabase client credentials to save to cloud.</span>";
            
            setTimeout(() => {
                resetPropertyForm();
                document.getElementById('menu-properties').click();
                renderPropertiesTable(adminPropertiesList);
            }, 1500);

        } else if (supabaseClient) {
            let resultError = null;

            if (id) {
                // UPDATE
                const { error } = await supabaseClient
                    .from('properties')
                    .update(payload)
                    .eq('id', id);
                resultError = error;
            } else {
                // INSERT
                const { error } = await supabaseClient
                    .from('properties')
                    .insert([payload]);
                resultError = error;
            }

            if (resultError) throw resultError;

            status.innerHTML = "<span style='color: #4ade80;'><i class='fa-solid fa-circle-check'></i> Property saved successfully!</span>";
            
            setTimeout(() => {
                resetPropertyForm();
                document.getElementById('menu-properties').click();
                loadAdminProperties();
            }, 1200);

        } else {
            throw new Error("Supabase client is not connected.");
        }

    } catch (err) {
        console.error("Form submit error:", err);
        status.innerHTML = `<span style='color: #f87171;'><i class='fa-solid fa-circle-exclamation'></i> Failed saving property: ${err.message}</span>`;
    } finally {
        submitBtn.disabled = false;
    }
}

// =========================================================================
// 5. CLIENT INQUIRIES & COLLABS INBOX VIEWER
// =========================================================================
async function loadAdminInquiries() {
    const tableBody = document.getElementById('admin-inquiries-table-body');
    const badge = document.getElementById('inquiry-count-badge');
    if (!tableBody) return;

    try {
        let inquiries = [];
        if (supabaseClient) {
            const { data, error } = await supabaseClient
                .from('inquiries')
                .select('*')
                .order('created_at', { ascending: false });
            
            if (data) inquiries = data;
        }

        // Check local storage fallback queries for mockup view
        const localQueries = JSON.parse(localStorage.getItem('LANDMARK_LOCAL_QUERIES') || '[]');
        inquiries = [...inquiries, ...localQueries];

        // Sort combined list newest first
        inquiries.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

        adminInquiriesList = inquiries;
        if (badge) badge.innerText = `${inquiries.length} Inbox`;

        renderInquiriesTable(inquiries);

    } catch (err) {
        console.error("Failed loading inquiries inbox:", err);
        tableBody.innerHTML = `<tr><td colspan="7" style="color: #f87171; text-align: center; padding: 2rem;">Error reading enquiries table: ${err.message}</td></tr>`;
    }
}

function renderInquiriesTable(inquiries) {
    const tableBody = document.getElementById('admin-inquiries-table-body');
    if (!tableBody) return;

    if (inquiries.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="7" style="text-align: center; padding: 3rem;">No client inquiry submissions found in the inbox.</td></tr>`;
        return;
    }

    tableBody.innerHTML = inquiries.map(inq => {
        const date = new Date(inq.created_at).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        // link back to details page if property query exists
        const propReference = inq.property_id ? 
            `<a href="property-details.html?id=${inq.property_id}" target="_blank" style="color: var(--color-gold-premium); font-size:0.8rem; text-decoration: underline;">Open Listing Card</a>` : 
            `<span style="color: var(--text-muted); font-size: 0.8rem;">General Inquiry</span>`;

        return `
            <tr id="inq-row-${inq.id || inq.created_at}">
                <td style="font-weight: 500; color: var(--text-primary);">${inq.name}</td>
                <td>
                    <div style="font-size:0.85rem;"><i class="fa-solid fa-phone" style="font-size: 0.75rem; color:var(--color-gold-premium);"></i> ${inq.phone}</div>
                    <div style="font-size:0.85rem;"><i class="fa-solid fa-envelope" style="font-size: 0.75rem; color:var(--color-gold-premium);"></i> ${inq.email || 'N/A'}</div>
                </td>
                <td><span class="badge-type ${inq.type === 'collab' ? 'sale' : 'lease'}">${inq.type}</span></td>
                <td style="max-width: 300px; font-size: 0.85rem; line-height: 1.4;">${inq.message}</td>
                <td>${propReference}</td>
                <td style="font-size: 0.8rem;">${date}</td>
                <td>
                    <button class="action-btn delete" onclick="deleteInquiryRow('${inq.id}', '${inq.created_at}')" title="Delete Inquiry">
                        <i class="fa-solid fa-trash"></i> Delete
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

// Delete inquiry row trigger
window.deleteInquiryRow = async function(id, createdAt) {
    if (!confirm("Are you sure you want to delete this customer inquiry from the database?")) return;

    // Check if it's a local storage mock inquiry
    const localQueries = JSON.parse(localStorage.getItem('LANDMARK_LOCAL_QUERIES') || '[]');
    const hasLocal = localQueries.some(q => q.created_at === createdAt);

    try {
        if (hasLocal) {
            const filtered = localQueries.filter(q => q.created_at !== createdAt);
            localStorage.setItem('LANDMARK_LOCAL_QUERIES', JSON.stringify(filtered));
            alert("Inquiry deleted successfully.");
            loadAdminInquiries();
        } else if (supabaseClient && id && id !== 'undefined') {
            const { error } = await supabaseClient
                .from('inquiries')
                .delete()
                .eq('id', id);

            if (error) throw error;
            
            alert("Inquiry deleted from database successfully.");
            loadAdminInquiries();
        } else {
            alert("Could not process delete. Connection offline or local cache cleared.");
        }
    } catch (err) {
        console.error("Deletion of inquiry failed:", err);
        alert(`Failed to delete: ${err.message}`);
    }
};

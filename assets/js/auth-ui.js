// auth-ui.js – Handles login/signup UI forms and updates navbar auth state

// Update Header Navigation based on authentication status
function updateHeaderUI(session) {
    const authLink = document.getElementById('auth-link');
    const userInfo = document.getElementById('user-info');
    const userEmail = document.getElementById('user-email');
    const logoutBtn = document.getElementById('logout-btn');

    if (!authLink && !userInfo) return; // Not present on this page

    if (session && session.user) {
        if (authLink) authLink.style.display = 'none';
        if (userInfo) {
            userInfo.style.display = 'inline-flex';
            userInfo.style.alignItems = 'center';
            userInfo.classList.remove('hidden');
        }
        if (userEmail) userEmail.textContent = session.user.email;

        // Hook up logout button if not already bound
        if (logoutBtn && !logoutBtn.dataset.bound) {
            logoutBtn.dataset.bound = "true";
            logoutBtn.addEventListener('click', async (e) => {
                e.preventDefault();
                logoutBtn.disabled = true;
                logoutBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Signing Out...';
                try {
                    await window.signOut();
                    sessionStorage.removeItem('LANDMARK_ADMIN_BYPASS');
                    window.location.reload();
                } catch (err) {
                    console.error("Sign out error:", err);
                    alert("Failed to sign out. Please try again.");
                    logoutBtn.disabled = false;
                    logoutBtn.textContent = 'Logout';
                }
            });
        }
    } else {
        if (authLink) authLink.style.display = 'list-item';
        if (userInfo) {
            userInfo.style.display = 'none';
            userInfo.classList.add('hidden');
        }
        if (userEmail) userEmail.textContent = '';
    }
}

// Bind Authentication Forms (Login / Signup)
document.addEventListener('DOMContentLoaded', () => {
    // 1. LOGIN FORM HANDLER
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const emailInput = document.getElementById('login-email');
            const passwordInput = document.getElementById('login-password');
            const messageDiv = document.getElementById('login-message');
            const submitBtn = loginForm.querySelector('button[type="submit"]');

            if (!emailInput || !passwordInput || !messageDiv || !submitBtn) return;

            const email = emailInput.value.trim();
            const password = passwordInput.value;
            const originalBtnText = submitBtn.innerHTML;

            // Loading state
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Signing In...';
            messageDiv.style.color = 'var(--color-gold-premium)';
            messageDiv.textContent = 'Authenticating...';

            try {
                const data = await window.signIn(email, password);
                messageDiv.style.color = '#4ade80';
                messageDiv.textContent = '✓ Login successful! Redirecting...';
                
                setTimeout(() => {
                    if (window.location.pathname.includes('admin.html')) {
                        window.location.reload();
                    } else {
                        window.location.href = 'index.html';
                    }
                }, 1000);
            } catch (err) {
                console.error("Login failed:", err);
                messageDiv.style.color = '#f87171';
                messageDiv.textContent = err.message || 'Invalid email or password.';
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
            }
        });
    }

    // 2. SIGNUP FORM HANDLER
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const emailInput = document.getElementById('signup-email');
            const passwordInput = document.getElementById('signup-password');
            const messageDiv = document.getElementById('signup-message');
            const submitBtn = signupForm.querySelector('button[type="submit"]');

            if (!emailInput || !passwordInput || !messageDiv || !submitBtn) return;

            const email = emailInput.value.trim();
            const password = passwordInput.value;
            const originalBtnText = submitBtn.innerHTML;

            // Loading state
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Creating Account...';
            messageDiv.style.color = 'var(--color-gold-premium)';
            messageDiv.textContent = 'Registering user...';

            try {
                const data = await window.signUp(email, password);
                
                messageDiv.style.color = '#4ade80';
                if (data.session) {
                    messageDiv.textContent = '✓ Account created successfully! Logging in...';
                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 1500);
                } else {
                    messageDiv.textContent = '✓ Registration successful! Check email for verification link.';
                    signupForm.reset();
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalBtnText;
                }
            } catch (err) {
                console.error("Signup failed:", err);
                messageDiv.style.color = '#f87171';
                messageDiv.textContent = err.message || 'Failed to register account.';
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
            }
        });
    }
});

// Setup initialization hooks for Supabase ready
async function initializeAuthUI() {
    const client = window.supabase;
    if (client && typeof client.createClient === 'undefined') {
        try {
            const { data: { session } } = await client.auth.getSession();
            updateHeaderUI(session);
        } catch (e) {
            console.warn("Failed to retrieve Supabase session on load:", e);
        }
    }
}

// Listen for custom state changes
window.addEventListener('authStateChange', (e) => {
    if (e.detail) {
        updateHeaderUI(e.detail.session);
    }
});

// Run load session check if supabase is ready, or wait for init event
if (window.supabase && typeof window.supabase.createClient === 'undefined') {
    initializeAuthUI();
} else {
    window.addEventListener('supabaseInitialized', initializeAuthUI);
}

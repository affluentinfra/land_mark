// Supabase Client Initialization Configuration
// Secure credential handling: first try localStorage, then fetch from server endpoint /api/supabase-config
async function getSupabaseCredentials() {
    const localUrl = localStorage.getItem('LANDMARK_SUPABASE_URL');
    const localKey = localStorage.getItem('LANDMARK_SUPABASE_ANON_KEY');
    if (localUrl && localKey) {
        return { url: localUrl, key: localKey };
    }
    // Attempt to retrieve from server (useful for production deployment)
    try {
        const resp = await fetch('/api/supabase-config');
        if (resp.ok) {
            const data = await resp.json();
            return { url: data.url, key: data.key };
        }
    } catch (e) {
        console.warn('Failed to fetch Supabase config from server:', e);
    }
    // Fallback placeholders (will trigger warning in initSupabase)
    return { url: null, key: null };
}

let supabaseClient = null;

async function initSupabase() {
    const { url, key } = await getSupabaseCredentials();
    if (!url || !key) {
        console.warn("Supabase is not configured yet. Please set credentials via localStorage or ensure /api/supabase-config is reachable.");
        return null;
    }
    try {
        if (typeof supabase !== 'undefined') {
            supabaseClient = supabase.createClient(url, key);
            return supabaseClient;
        } else {
            console.error("Supabase CDN library not loaded. Make sure to include the Supabase JS script tag.");
            return null;
        }
    } catch (error) {
        console.error("Failed to initialize Supabase client:", error);
        return null;
    }
}

// Automatically try to initialize on load
document.addEventListener('DOMContentLoaded', () => {
    initSupabase();
});
// Deprecated duplicate implementation removed

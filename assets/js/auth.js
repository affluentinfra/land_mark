// auth.js – Handles Supabase authentication (sign‑up, sign‑in, sign‑out)
// Assumes supabase client is initialized in supabase-config.js and available as global `supabase`

// Helper to check if Supabase is initialized
function getSupabase() {
  if (window.supabase && typeof window.supabase.createClient === 'undefined') {
    return window.supabase;
  }
  return null;
}

// Sign up a new user with email & password
async function signUp(email, password) {
  const client = getSupabase();
  if (!client) throw new Error("Database connection not established. Please configure Supabase first.");
  const { data, error } = await client.auth.signUp({ email, password });
  if (error) throw error;
  return data;
}
window.signUp = signUp;

// Sign in an existing user
async function signIn(email, password) {
  const client = getSupabase();
  if (!client) throw new Error("Database connection not established. Please configure Supabase first.");
  const { data, error } = await client.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}
window.signIn = signIn;

// Sign out current user
async function signOut() {
  const client = getSupabase();
  if (!client) return;
  const { error } = await client.auth.signOut();
  if (error) throw error;
}
window.signOut = signOut;

// Get currently authenticated user (or null)
async function getCurrentUser() {
  const client = getSupabase();
  if (!client) return null;
  try {
    const { data: { user } } = await client.auth.getUser();
    return user;
  } catch (e) {
    console.warn("Failed to get current user:", e);
    return null;
  }
}
window.getCurrentUser = getCurrentUser;

// Listen for auth state changes to update UI (dispatch custom event)
function initAuthListener() {
  const client = getSupabase();
  if (client) {
    client.auth.onAuthStateChange((event, session) => {
      const ev = new CustomEvent('authStateChange', { detail: { event, session } });
      window.dispatchEvent(ev);
    });
  }
}

// Wire up the auth listener once Supabase is ready
if (getSupabase()) {
  initAuthListener();
} else {
  window.addEventListener('supabaseInitialized', initAuthListener);
}


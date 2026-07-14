// auth.js – Handles Supabase authentication (sign‑up, sign‑in, sign‑out)
// Assumes supabase client is initialized in supabase-config.js and available as global `supabase`

// Sign up a new user with email & password
async function signUp(email, password) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;
  return data;
}
window.signUp = signUp;

// Sign in an existing user
async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  // Store credentials in localStorage for client init (optional)
  const session = data.session;
  if (session) {
    localStorage.setItem('LANDMARK_SUPABASE_URL', process.env.SUPABASE_URL || '');
    localStorage.setItem('LANDMARK_SUPABASE_ANON_KEY', process.env.SUPABASE_ANON_KEY || '');
  }
  return data;
}
window.signIn = signIn;

// Sign out current user
async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
  localStorage.removeItem('LANDMARK_SUPABASE_URL');
  localStorage.removeItem('LANDMARK_SUPABASE_ANON_KEY');
}
window.signOut = signOut;

// Get currently authenticated user (or null)
function getCurrentUser() {
  const { data: { user } } = supabase.auth.getUser();
  return user;
}
window.getCurrentUser = getCurrentUser;

// Listen for auth state changes to update UI (dispatch custom event)
supabase.auth.onAuthStateChange((event, session) => {
  const ev = new CustomEvent('authStateChange', { detail: { event, session } });
  window.dispatchEvent(ev);
});

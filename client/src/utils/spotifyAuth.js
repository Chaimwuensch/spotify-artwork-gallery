// Get the current access token (no refresh - token expires in 1 hour from login)
export function getAccessToken() {
  return localStorage.getItem("spotify_access_token");
}

// Check if user is authenticated
export function isAuthenticated() {
  return !!localStorage.getItem("spotify_access_token");
}

// Logout
export function logout() {
  localStorage.removeItem("spotify_access_token");
  localStorage.removeItem("spotify_refresh_token");
  localStorage.removeItem("spotify_expires_at");
}

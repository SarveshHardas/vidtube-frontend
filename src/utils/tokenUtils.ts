/**
 * Decode a JWT payload without a library (browser-safe).
 * Returns null if the token is malformed.
 */
function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

/**
 * Check if a valid, non-expired accessToken exists in localStorage.
 */
export function isAuthenticated(): boolean {
  const token = localStorage.getItem("accessToken");
  if (!token) return false;

  const payload = decodeJwtPayload(token);
  if (!payload || typeof payload.exp !== "number") {
    // Token is malformed or has no expiry — treat as invalid
    localStorage.removeItem("accessToken");
    return false;
  }

  const nowInSeconds = Math.floor(Date.now() / 1000);
  if (payload.exp < nowInSeconds) {
    // Token has expired — clean it up
    localStorage.removeItem("accessToken");
    return false;
  }

  return true;
}

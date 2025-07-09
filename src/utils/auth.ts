export function isLoggedInFromCookie(): boolean {
    const cookie = document.cookie;
    return cookie.includes("auth=true");
  }
  
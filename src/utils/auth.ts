export function isLoggedInFromSession(): boolean {
  const accessToken = sessionStorage.getItem("access_token");
  return !!accessToken;
}

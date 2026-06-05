export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

// Simplified login path, now handled by Supabase Auth on the /auth/login route
export const getLoginUrl = () => {
  return "/auth/login";
};

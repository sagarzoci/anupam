/**
 * /admin
 *
 * This page is never actually rendered — the middleware in middleware.ts
 * intercepts /admin and redirects to:
 *   - /admin/dashboard  (if the user is logged in)
 *   - /admin/login      (if the user is not logged in)
 *
 * This file must exist so Next.js App Router registers the route segment.
 */
export default function AdminIndexPage() {
  return null;
}

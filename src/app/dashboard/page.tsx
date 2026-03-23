import { redirect } from 'next/navigation';

export default function DashboardIndex() {
  // Redirect /dashboard to /dashboard/inbox
  redirect('/dashboard/inbox');
}

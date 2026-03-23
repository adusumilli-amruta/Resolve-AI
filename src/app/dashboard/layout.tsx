import styles from './layout.module.css';
import Link from 'next/link';
import { Home, Inbox, BarChart2, Settings, LogOut } from 'lucide-react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import LogoutButton from '@/components/LogoutButton';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  
  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}></div>
          <span className={styles.logoText}>ResolveAI</span>
        </div>
        
        <nav className={styles.nav}>
          <Link href="/dashboard" className={styles.navItem}>
            <Home size={18} />
            Home
          </Link>
          <Link href="/dashboard/inbox" className={`${styles.navItem} ${styles.active}`}>
            <Inbox size={18} />
            Inbox
            <span className={styles.badge}>12</span>
          </Link>
          <Link href="/dashboard/analytics" className={styles.navItem}>
            <BarChart2 size={18} />
            Analytics
          </Link>
        </nav>

        <div className={styles.footer}>
          <Link href="/dashboard/settings" className={styles.navItem}>
            <Settings size={18} />
            Settings
          </Link>
          <div className={styles.userProfile}>
            <div className={styles.avatar}>
              {session?.user?.name?.charAt(0) || 'U'}
            </div>
            <div className={styles.userInfo}>
              <div className={styles.userName}>{session?.user?.name || 'User'}</div>
              <div className={styles.userRole}>
                {(session?.user as any)?.workspaceName || 'Acme'} • {(session?.user as any)?.role || 'AGENT'}
              </div>
            </div>
            <LogoutButton />
          </div>
        </div>
      </aside>
      
      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  );
}

import { prisma } from '@/lib/prisma';
import styles from './page.module.css';
import { Activity, Clock, CheckCircle, TrendingUp } from 'lucide-react';

export default async function AnalyticsDashboard() {
  const totalTickets = await prisma.ticket.count();
  const openTickets = await prisma.ticket.count({ where: { status: 'OPEN' } });
  
  // Simulated analytics data for the demo
  const metrics = [
    {
      title: 'Total Tickets',
      value: totalTickets.toString(),
      trend: '+12.5%',
      trendUp: true,
      icon: <Activity className={styles.iconBlue} />
    },
    {
      title: 'Open Issues',
      value: openTickets.toString(),
      trend: '-2.4%',
      trendUp: false,
      icon: <CheckCircle className={styles.iconGreen} />
    },
    {
      title: 'Avg Resolution Time',
      value: '1.2 hr',
      trend: '-15%',
      trendUp: true,
      icon: <Clock className={styles.iconOrange} />
    },
    {
      title: 'AI Triage Accuracy',
      value: '94.2%',
      trend: '+1.1%',
      trendUp: true,
      icon: <TrendingUp className={styles.iconPurple} />
    }
  ];

  // Dummy chart data representing tickets over last 7 days
  const chartData = [
    { day: 'Mon', count: 12, height: '40%' },
    { day: 'Tue', count: 19, height: '60%' },
    { day: 'Wed', count: 15, height: '50%' },
    { day: 'Thu', count: 25, height: '80%' },
    { day: 'Fri', count: 22, height: '70%' },
    { day: 'Sat', count: 8, height: '25%' },
    { day: 'Sun', count: 5, height: '15%' },
  ];

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Analytics Overview</h1>
        <p className={styles.subtitle}>Key workspace metrics and AI performance</p>
      </header>

      <div className={styles.grid}>
        {metrics.map((m, i) => (
          <div key={i} className={styles.metricCard}>
            <div className={styles.metricHeader}>
              <h3 className={styles.metricTitle}>{m.title}</h3>
              <div className={styles.iconContainer}>{m.icon}</div>
            </div>
            <div className={styles.metricValue}>{m.value}</div>
            <div className={`${styles.trend} ${m.trendUp ? styles.trendGood : styles.trendBad}`}>
              {m.trendUp ? '↑' : '↓'} {m.trend} from last week
            </div>
          </div>
        ))}
      </div>

      <div className={styles.chartsRow}>
        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>Ticket Volume (Last 7 Days)</h3>
          <div className={styles.barChart}>
            {chartData.map((d, i) => (
              <div key={i} className={styles.barCol}>
                <div className={styles.barWrapper}>
                  <div className={styles.bar} style={{ height: d.height }}></div>
                </div>
                <div className={styles.barLabel}>{d.day}</div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>AI Categorization Distribution</h3>
          <div className={styles.categoriesList}>
            <div className={styles.categoryItem}>
              <div className={styles.catLabel}>Bug Reports</div>
              <div className={styles.catTrack}>
                <div className={styles.catFill} style={{ width: '45%', backgroundColor: 'var(--danger)' }}></div>
              </div>
              <div className={styles.catValue}>45%</div>
            </div>
            <div className={styles.categoryItem}>
              <div className={styles.catLabel}>Feature Requests</div>
              <div className={styles.catTrack}>
                <div className={styles.catFill} style={{ width: '30%', backgroundColor: 'var(--primary)' }}></div>
              </div>
              <div className={styles.catValue}>30%</div>
            </div>
            <div className={styles.categoryItem}>
              <div className={styles.catLabel}>Billing & Account</div>
              <div className={styles.catTrack}>
                <div className={styles.catFill} style={{ width: '25%', backgroundColor: 'var(--warning)' }}></div>
              </div>
              <div className={styles.catValue}>25%</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

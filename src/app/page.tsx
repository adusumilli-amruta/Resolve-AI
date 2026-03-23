import styles from './page.module.css';

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.hero}>
        <div className={styles.badge}>AI-Powered Support Platform</div>
        
        <h1 className={styles.title}>
          Resolve tickets<br />before they escalate
        </h1>
        
        <p className={styles.subtitle}>
          AI-powered triage, smart drafts, and real-time analytics. 
          Built for support teams that move fast.
        </p>

        <div className={styles.features}>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon} style={{ background: 'var(--primary-subtle)', color: 'var(--primary-hover)' }}>🧠</div>
            <div className={styles.featureTitle}>AI Triage</div>
            <div className={styles.featureDesc}>Auto-classify urgency, sentiment, and category for every ticket</div>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon} style={{ background: 'var(--success-subtle)', color: 'var(--success)' }}>⚡</div>
            <div className={styles.featureTitle}>Smart Drafts</div>
            <div className={styles.featureDesc}>AI-generated responses ready to send in one click</div>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon} style={{ background: 'var(--info-subtle)', color: 'var(--info)' }}>📊</div>
            <div className={styles.featureTitle}>Live Analytics</div>
            <div className={styles.featureDesc}>Track resolution times, ticket volume, and AI accuracy</div>
          </div>
        </div>
        
        <div className={styles.actions}>
          <a href="/dashboard" className={styles.button}>
            Enter Dashboard →
          </a>
          <a href="https://github.com" className={styles.buttonSecondary} target="_blank" rel="noopener noreferrer">
            View Source
          </a>
        </div>

        <div className={styles.stats}>
          <div className={styles.stat}>
            <div className={styles.statValue}>94.2%</div>
            <div className={styles.statLabel}>AI Accuracy</div>
          </div>
          <div className={styles.stat}>
            <div className={styles.statValue}>1.2hr</div>
            <div className={styles.statLabel}>Avg Resolution</div>
          </div>
          <div className={styles.stat}>
            <div className={styles.statValue}>3x</div>
            <div className={styles.statLabel}>Faster Response</div>
          </div>
        </div>
      </div>
    </main>
  );
}

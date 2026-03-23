import styles from './layout.module.css';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import SimulateButton from '@/components/SimulateButton';

export default async function InboxLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const tickets = await prisma.ticket.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      aiTriageData: true,
    }
  });

  return (
    <div className={styles.splitView}>
      <div className={styles.ticketList}>
        <div className={styles.listHeader}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Inbox</h2>
            <SimulateButton />
          </div>
        </div>
        
        <div className={styles.scrollArea}>
          {tickets.map(ticket => (
            <Link href={`/dashboard/inbox/${ticket.id}`} key={ticket.id} className={styles.ticketRow}>
              <div className={styles.ticketHeader}>
                <span className={styles.customer}>{ticket.customerName}</span>
                <span className={styles.time}>
                  {new Date(ticket.createdAt).toLocaleDateString()}
                </span>
              </div>
              <h3 className={styles.ticketTitle}>{ticket.title}</h3>
              <p className={styles.ticketPreview}>{ticket.description}</p>
              
              <div className={styles.tags}>
                {ticket.priority === 'HIGH' && (
                  <span className={`${styles.tag} ${styles.tagHigh}`}>Urgent</span>
                )}
                <span className={styles.tag}>{ticket.aiTriageData?.category || 'Uncategorized'}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
      
      <div className={styles.ticketDetail}>
        {children}
      </div>
    </div>
  );
}

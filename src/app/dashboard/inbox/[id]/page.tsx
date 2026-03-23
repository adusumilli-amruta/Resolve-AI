import { prisma } from '@/lib/prisma';
import styles from './page.module.css';
import { notFound } from 'next/navigation';

export default async function TicketDetail({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;

  const ticket = await prisma.ticket.findUnique({
    where: { id },
    include: {
      messages: { orderBy: { createdAt: 'asc' } },
      aiTriageData: true,
    }
  });

  if (!ticket) {
    notFound();
  }

  const urgency = ticket.aiTriageData?.urgencyScore || 0;
  const urgencyColor = urgency > 80 ? 'var(--danger)' : urgency > 40 ? 'var(--warning)' : 'var(--success)';
  const urgencyGlow = urgency > 80 ? 'rgba(244, 63, 94, 0.3)' : urgency > 40 ? 'rgba(245, 158, 11, 0.3)' : 'rgba(16, 185, 129, 0.3)';

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerTop}>
          <div className={styles.headerTitle}>
            <h2>{ticket.title}</h2>
          </div>
          <div className={styles.badges}>
            <span className={`${styles.statusBadge} ${ticket.status === 'OPEN' ? styles.statusOpen : styles.statusResolved}`}>
              <span className={styles.statusDot}></span>
              {ticket.status}
            </span>
            <span className={`${styles.priorityBadge} ${ticket.priority === 'HIGH' ? styles.priorityHigh : ticket.priority === 'LOW' ? styles.priorityLow : ''}`}>
              {ticket.priority}
            </span>
          </div>
        </div>
        <div className={styles.customerRow}>
          <div className={styles.customerAvatar}>{ticket.customerName.charAt(0)}</div>
          <div className={styles.customerDetails}>
            <span className={styles.customerName}>{ticket.customerName}</span>
            <span className={styles.customerEmail}>{ticket.customerEmail}</span>
          </div>
        </div>
      </div>

      <div className={styles.content}>
        {/* Thread */}
        <div className={styles.thread}>
          <div className={styles.messages}>
            {ticket.messages.map((msg, index) => (
              <div
                key={msg.id}
                className={`${styles.message} ${
                  msg.senderId ? styles.messageAgent : styles.messageCustomer
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={styles.messageAvatar}>
                  {msg.senderId ? '🤖' : ticket.customerName.charAt(0)}
                </div>
                <div className={styles.messageBubble}>
                  <div className={styles.messageHeader}>
                    <span className={styles.messageSender}>
                      {msg.senderId ? 'AI Agent' : ticket.customerName}
                    </span>
                    <span className={styles.messageTime}>
                      {msg.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className={styles.messageBody}>{msg.content}</div>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.composer}>
            <div className={styles.composerLabel}>
              <span className={styles.aiSparkle}>✨</span> AI-Generated Draft
            </div>
            <textarea
              className={styles.textarea}
              placeholder="Type your reply..."
              defaultValue={ticket.aiTriageData?.suggestedResponse || ''}
            />
            <div className={styles.composerActions}>
              <div className={styles.composerHints}>
                <span className={styles.hintChip}>⌘ + Enter to send</span>
              </div>
              <button className={styles.sendButton}>
                Send Reply
                <span className={styles.sendIcon}>→</span>
              </button>
            </div>
          </div>
        </div>

        {/* AI Triage Sidebar */}
        <div className={styles.aiSidebar}>
          <div className={styles.sidebarHeader}>
            <h3 className={styles.sidebarTitle}>
              <span className={styles.aiSparkle}>✨</span> AI Insights
            </h3>
            <span className={styles.sidebarBadge}>Auto-generated</span>
          </div>
          
          <div className={styles.urgencyCard}>
            <div className={styles.urgencyHeader}>
              <span className={styles.insightLabel}>Urgency Score</span>
              <span className={styles.urgencyNumber} style={{ color: urgencyColor }}>{urgency}</span>
            </div>
            <div className={styles.urgencyTrack}>
              <div 
                className={styles.urgencyFill}
                style={{ 
                  width: `${urgency}%`,
                  background: `linear-gradient(90deg, ${urgencyColor}, ${urgencyColor})`,
                  boxShadow: `0 0 12px ${urgencyGlow}`
                }}
              />
            </div>
          </div>

          <div className={styles.insightGrid}>
            <div className={styles.insightCard}>
              <div className={styles.insightIcon} style={{ background: 'var(--info-subtle)', color: 'var(--info)' }}>🏷️</div>
              <div>
                <div className={styles.insightLabel}>Category</div>
                <div className={styles.insightValue}>{ticket.aiTriageData?.category || 'Unknown'}</div>
              </div>
            </div>

            <div className={styles.insightCard}>
              <div className={styles.insightIcon} style={{ background: 'var(--warning-subtle)', color: 'var(--warning)' }}>💬</div>
              <div>
                <div className={styles.insightLabel}>Sentiment</div>
                <div className={styles.insightValue}>{ticket.aiTriageData?.sentiment || 'Neutral'}</div>
              </div>
            </div>
          </div>

          <div className={styles.confidenceCard}>
            <div className={styles.insightLabel}>AI Confidence</div>
            <div className={styles.confidenceBar}>
              <div className={styles.confidenceFill} style={{ width: '92%' }}></div>
            </div>
            <div className={styles.confidenceValue}>92% confident</div>
          </div>
        </div>
      </div>
    </div>
  );
}

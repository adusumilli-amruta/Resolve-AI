import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { triageTicket } from '@/lib/ai-service';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const sampleTickets = [
  { title: 'Cannot invite team member', description: 'I keep getting an error 500 when trying to invite my colleague john@example.com to our workspace.', name: 'Sarah Connor', email: 'sarah@techcorp.com' },
  { title: 'Billing cycle question', description: 'Hi, we are currently on the Pro plan but want to upgrade to Enterprise next month. How does the prorated billing work?', name: 'Mike Ross', email: 'mike@lawfirm.com' },
  { title: 'App crashing on mobile Safari', description: 'Whenever I open the dashboard on my iPhone using Safari, the screen just goes white after 3 seconds.', name: 'Emily Davis', email: 'emily@startup.io' },
];

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Pick a random sample ticket
  const sample = sampleTickets[Math.floor(Math.random() * sampleTickets.length)];
  
  // Get user's workspace
  const user = await prisma.user.findUnique({
    where: { email: session.user.email! }
  });

  if (!user) {
    return NextResponse.json({ error: 'User not found in DB' }, { status: 404 });
  }

  // Create ticket
  const ticket = await prisma.ticket.create({
    data: {
      title: sample.title,
      description: sample.description,
      customerName: sample.name,
      customerEmail: sample.email,
      workspaceId: user.workspaceId,
      status: 'OPEN',
      priority: 'MEDIUM',
    }
  });

  // Create initial message
  await prisma.message.create({
    data: {
      content: sample.description,
      ticketId: ticket.id,
    }
  });

  // Call the AI Service
  const aiResult = await triageTicket(sample.title, sample.description);

  // Determine updated priority based on urgency score
  const newPriority = aiResult.urgencyScore >= 80 ? 'HIGH' : aiResult.urgencyScore <= 30 ? 'LOW' : 'MEDIUM';

  // Save AI Triage data
  await prisma.aITriageData.create({
    data: {
      ticketId: ticket.id,
      urgencyScore: aiResult.urgencyScore,
      category: aiResult.category,
      sentiment: aiResult.sentiment,
      suggestedResponse: aiResult.suggestedResponse
    }
  });

  // Update ticket priority
  await prisma.ticket.update({
    where: { id: ticket.id },
    data: { priority: newPriority }
  });

  return NextResponse.json({ success: true, ticketId: ticket.id });
}

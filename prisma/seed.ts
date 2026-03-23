import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Clean up
  await prisma.aITriageData.deleteMany();
  await prisma.message.deleteMany();
  await prisma.ticket.deleteMany();
  await prisma.user.deleteMany();
  await prisma.workspace.deleteMany();

  // Create workspace
  const workspace = await prisma.workspace.create({
    data: {
      name: 'Acme Corp',
    },
  });

  const hashedPassword = await bcrypt.hash('password123', 10);

  // Create users
  const admin = await prisma.user.create({
    data: {
      email: 'admin@acme.com',
      name: 'Sarah Admin',
      password: hashedPassword,
      role: 'ADMIN',
      workspaceId: workspace.id,
    },
  });

  const agent = await prisma.user.create({
    data: {
      email: 'j.doe@acme.com',
      name: 'John Doe',
      password: hashedPassword,
      role: 'AGENT',
      workspaceId: workspace.id,
    },
  });

  // Create an urgent ticket with AI triage and suggested response
  const ticket1 = await prisma.ticket.create({
    data: {
      title: 'Production database is down!',
      description: 'We are getting connection time out errors across all our services. Please help ASAP.',
      status: 'OPEN',
      priority: 'HIGH',
      customerName: 'Alice Smith',
      customerEmail: 'alice@client1.com',
      workspaceId: workspace.id,
    },
  });

  await prisma.message.create({
    data: {
      content: 'We are getting connection time out errors across all our services. Please help ASAP.',
      ticketId: ticket1.id,
      // No senderId means customer
    },
  });

  await prisma.aITriageData.create({
    data: {
      ticketId: ticket1.id,
      urgencyScore: 98,
      category: 'Outage',
      sentiment: 'Panic',
      suggestedResponse: 'Hello Alice,\n\nI am escalating this ticket immediately to our engineering team. We are seeing some database connection anomalies on our end as well, and are investigating right now. I will provide an update within the next 15 minutes.\n\nBest,\nJohn',
    },
  });

  // Create a low priority feature request
  const ticket2 = await prisma.ticket.create({
    data: {
      title: 'Dark mode request',
      description: 'Would love to have a dark mode option in the dashboard. Is this on the roadmap?',
      status: 'OPEN',
      priority: 'LOW',
      customerName: 'Bob Jones',
      customerEmail: 'bob@client2.com',
      workspaceId: workspace.id,
    },
  });

  await prisma.message.create({
    data: {
      content: 'Would love to have a dark mode option in the dashboard. Is this on the roadmap?',
      ticketId: ticket2.id,
    },
  });

  await prisma.aITriageData.create({
    data: {
      ticketId: ticket2.id,
      urgencyScore: 15,
      category: 'Feature Request',
      sentiment: 'Positive',
      suggestedResponse: 'Hi Bob,\n\nThanks for reaching out! Dark mode is indeed on our roadmap for Q3. I\'ve added your vote to the feature request tracker.\n\nLet me know if you need anything else.',
    },
  });

  console.log('Seed completed successfully. You can login with admin@acme.com / password123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

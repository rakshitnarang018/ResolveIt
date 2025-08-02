const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // --- Clean up existing data and RESET auto-increment counters ---
  // Using TRUNCATE...RESTART IDENTITY to ensure IDs start from 1
  console.log('Clearing existing data and resetting IDs...');
  await prisma.$executeRawUnsafe(`TRUNCATE "User", "Case", "OppositeParty", "Evidence", "PanelMember", "Witness" RESTART IDENTITY CASCADE;`);
  console.log('Cleared existing data.');

  // --- Create Users ---
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('password123', salt);

  const user1 = await prisma.user.create({
    data: {
      name: 'Priya Sharma',
      email: 'priya.sharma@example.com',
      password: hashedPassword,
    },
  });

  const user2 = await prisma.user.create({
    data: {
      name: 'Amit Patel',
      email: 'amit.patel@example.com',
      password: hashedPassword,
    },
  });
  
  const adminUser = await prisma.user.create({
    data: {
        name: 'Admin User',
        email: 'admin@resolveit.com',
        password: hashedPassword,
        role: 'ADMIN'
    }
  });

  console.log(`Created users: ${user1.name}, ${user2.name}, and ${adminUser.name}`);

  // --- Create Cases with different statuses and evidence ---
  
  // Case 1: Pending (Awaiting Response)
  await prisma.case.create({
    data: {
      user_id: user1.id,
      case_type: 'BUSINESS',
      description: 'Dispute over a software development contract. Payment has been withheld despite project completion.',
      status: 'AWAITING_RESPONSE',
      opposite_parties: {
        create: {
          name: 'Tech Solutions Inc.',
          email: 'contact@techsolutions.com',
          notified: true,
        },
      },
      evidence: {
        create: [
            { file_type: 'DOCUMENT', file_url: '/uploads/sample-contract.pdf' },
            { file_type: 'IMAGE', file_url: '/uploads/sample-screenshot.png' },
        ]
      }
    },
  });

  // Case 2: In Progress (Mediation In Progress)
  await prisma.case.create({
    data: {
      user_id: user2.id,
      case_type: 'FAMILY',
      description: 'A disagreement regarding inheritance of family property located in Aligarh.',
      status: 'MEDIATION_IN_PROGRESS',
      opposite_parties: {
        create: {
          name: 'Sanjay Patel',
          email: 'sanjay.p@example.com',
          notified: true,
          agreed_to_mediate: true,
        },
      },
      panel_members: {
        create: [
            { name: 'Advocate Verma', type: 'LAWYER' },
            { name: 'Mr. Gupta', type: 'CIVIL' }
        ]
      },
      evidence: {
        create: { file_type: 'DOCUMENT', file_url: '/uploads/sample-property-deed.pdf' }
      }
    },
  });

  // Case 3: Processed (Resolved)
  await prisma.case.create({
    data: {
      user_id: user1.id,
      case_type: 'OTHER',
      description: 'A conflict with a neighbor over property line and fence construction.',
      status: 'RESOLVED',
      opposite_parties: {
        create: {
          name: 'Rakesh Singh',
          email: 'rakesh.s@example.com',
          notified: true,
          agreed_to_mediate: true,
        },
      },
       evidence: {
        create: { file_type: 'IMAGE', file_url: '/uploads/sample-fence-photo.jpg' }
      }
    },
  });
  
  // Case 4: Pending (Registered)
  await prisma.case.create({
    data: {
      user_id: user2.id,
      case_type: 'COMMUNITY',
      description: 'Dispute regarding the use of common society area for personal events.',
      status: 'REGISTERED',
      opposite_parties: {
        create: {
          name: 'Greenwood Society Committee',
          email: 'committee@greenwood.com',
        },
      },
    },
  });

  console.log('Created sample cases with various statuses and evidence.');
  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

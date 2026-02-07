import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = "justepupu@yahoo.com";
  const password = "123456";
  const hashedPassword = await bcrypt.hash(password, 10);

  const admin = await prisma.user.upsert({
    where: { email },
    update: {
      password: hashedPassword,
      role: "ADMIN",
    },
    create: {
      email,
      password: hashedPassword,
      firstName: "Admin",
      lastName: "ImmoJuste",
      role: "ADMIN",
      emailVerified: new Date(),
      consentTerms: true,
      consentPrivacy: true,
    },
  });

  console.log(`Admin user created/updated: ${admin.email} (id: ${admin.id})`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

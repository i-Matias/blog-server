import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
prisma.$connect();

const main = async () => {};

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

export default prisma;

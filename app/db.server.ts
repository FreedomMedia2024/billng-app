import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient;
}

// Create or reuse a Prisma Client instance
if (process.env.NODE_ENV !== "production") {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
    global.prisma
      .$connect()
      .then(() => console.log("Connected to the database"))
      .catch((err) => {
        console.error("Error connecting to the database:", err);
        process.exit(1); // Exit process if the connection fails
      });
  }
}

const prisma: PrismaClient = global.prisma || new PrismaClient();

// Ensure database connection in production mode
if (process.env.NODE_ENV === "production") {
  prisma
    .$connect()
    .then(() => console.log("Connected to the database"))
    .catch((err) => {
      console.error("Error connecting to the database:", err);
      process.exit(1); // Exit process if the connection fails
    });
}

export default prisma;

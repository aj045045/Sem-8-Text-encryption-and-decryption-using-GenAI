import { PrismaClient } from "@prisma/client";

declare global {
    var prisma: PrismaClient | undefined;
}

const prisma =
    global.prisma ||
    new PrismaClient({
        log: ["warn", "error"],
        transactionOptions: {
            maxWait: 5000,
            timeout: 5000,
        },
    });

if (process.env.NODE_ENV !== "production") {
    global.prisma = prisma;
}

export default prisma;

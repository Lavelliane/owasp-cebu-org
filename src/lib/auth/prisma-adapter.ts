import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/lib/db";

// Use the PrismaAdapter for NextAuth.js
export default PrismaAdapter(prisma); 
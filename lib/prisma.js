import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
    // Append connection_limit to DATABASE_URL to prevent PostgreSQL
    // max_connections exhaustion under load (default pg limit is 100).
    // This sets the Prisma connection pool to max 10 connections per process.
    const baseUrl = process.env.DATABASE_URL || '';
    const url = baseUrl && !baseUrl.includes('connection_limit')
        ? baseUrl + (baseUrl.includes('?') ? '&' : '?') + 'connection_limit=10&pool_timeout=20'
        : baseUrl;

    return new PrismaClient({
        datasources: { db: { url } },
        log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    });
}

const globalForPrisma = globalThis

const prisma = globalForPrisma.prisma ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

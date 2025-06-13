import { NextRequest } from 'next/server'
import { PrismaAdapter, RouteType } from '@premieroctet/next-crud'
import NextCrud from '@premieroctet/next-crud'
import prisma from '@/lib/prisma'
import { Prisma } from '@prisma/client'

const handler = async (req: NextRequest): Promise<unknown> => {
    try {
        const nextCrudHandler = await NextCrud({
            adapter: new PrismaAdapter({
                prismaClient: prisma,
            }),
            models: {
                [Prisma.ModelName.Image]: {
                    name: 'images',
                    only: [RouteType.DELETE, RouteType.CREATE, RouteType.READ_ALL, RouteType.READ_ONE, RouteType.UPDATE]
                }
            },
            defaultExposeStrategy: 'all'
        })
        return nextCrudHandler(req)
    } catch (error) {
        console.error('NextCrud handler error:', error)
        return new Response('Internal Server Error', { status: 500 })
    }
}

// Export for all HTTP methods
export { handler as GET, handler as POST, handler as PUT, handler as DELETE }

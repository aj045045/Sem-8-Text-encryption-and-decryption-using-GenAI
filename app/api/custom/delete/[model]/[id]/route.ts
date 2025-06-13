// app/api/delete/[model]/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// Define your model map with explicit typing
const modelMap = {
  post: prisma.post,
  user: prisma.user,
  admin: prisma.admin,
  image: prisma.image
}

// Define a generic type for your Prisma models
type PrismaModel = 'post' | 'user' | 'admin' | 'image';

// Helper function to get the correct Prisma model type
function getPrismaModel(modelName: PrismaModel) {
  return modelMap[modelName]
}

export async function DELETE(req: NextRequest, { params }: { params: { model: string; id: string } }) {
  const modelName = params.model.toLowerCase() as PrismaModel
  const recordId = Number(params.id)

  // Get the Prisma model using the helper function
  const prismaModel = getPrismaModel(modelName)

  if (!prismaModel) {
    return NextResponse.json({ error: 'Invalid model' }, { status: 400 })
  }

  try {
    const deleted = await (prismaModel as any).delete({
      where: { id: recordId },
    })

    return NextResponse.json({ success: true, data: deleted })
  } catch (error) {
    console.error('Delete error:', error)
    return NextResponse.json({ error: 'Failed to delete record' }, { status: 500 })
  }
}

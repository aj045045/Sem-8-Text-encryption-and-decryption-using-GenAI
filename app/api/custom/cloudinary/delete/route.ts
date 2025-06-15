import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import prisma from "@/lib/prisma";

// Route Handler
export async function DELETE(req: Request) {
    try {
        const { imageId, dbId } = await req.json();

        if (!imageId || !dbId) {
            return NextResponse.json({ error: "Missing imageId or dbId" }, { status: 400 });
        }

        // 1. Delete from Cloudinary
        await cloudinary.uploader.destroy(imageId);

        // 2. Delete from DB
        await prisma.image.delete({
            where: { id: dbId },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Delete error:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

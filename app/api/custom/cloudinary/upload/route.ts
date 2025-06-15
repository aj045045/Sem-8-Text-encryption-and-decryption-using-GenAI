import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import prisma from "@/lib/prisma";
import type { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { imageBase64, userEmail } = await req.json();

        if (!imageBase64 || !userEmail) {
            return NextResponse.json({ error: "Missing data" }, { status: 400 });
        }

        // Look up user by email
        const user = await prisma.user.findUnique({
            where: { email: userEmail },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Upload to Cloudinary
        const uploaded = await cloudinary.uploader.upload(imageBase64);

        // Save image info to DB
        const image = await prisma.image.create({
            data: {
                imageId: uploaded.public_id,
                userId: user.id,
            },
        });

        return NextResponse.json({ success: true, image });
    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }
}

"use client";

import { useSession } from "next-auth/react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useSWR, { mutate } from "swr";
import { EncryptMessageDialog } from "./encrypt-message";
import { CldImage } from "next-cloudinary";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface User {
        id: number;
        name: string;
        username: string;
        email: string;
        createdAt: string;
}

interface Image {
        id: number;
        imageId: string;
        createdAt: string;
}

export default function ProfilePage() {
        const { data: session } = useSession();
        const urlUser = `/api/crud/users?where=${encodeURIComponent(
                JSON.stringify({ email: { $eq: session?.user?.email } })
        )}`;
        const { data: dataUser, isLoading: isUserLoading } = useSWR<User[]>(urlUser);

        const urlImage =
                dataUser && dataUser.length > 0
                        ? `/api/crud/images?where=${encodeURIComponent(
                                JSON.stringify({ userId: { $eq: dataUser[0].id } })
                        )}`
                        : null;
        const { data: dataImage, isLoading: isImageLoading } = useSWR<Image[]>(urlImage);

        const [copiedId, setCopiedId] = useState<number | null>(null);

        const handleCopyUrl = async (imageId: string, imageDbId: number) => {
                const url = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${imageId}`;
                await navigator.clipboard.writeText(url);
                setCopiedId(imageDbId);
                setTimeout(() => setCopiedId(null), 2000); // Clear copy state after 2s
        };

        if (isUserLoading || isImageLoading) {
                return (
                        <div className="flex items-center justify-center min-h-screen">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900 dark:border-white"></div>
                        </div>
                );
        }

        if (!dataUser || !dataImage) {
                return (
                        <div className="flex items-center justify-center min-h-screen">
                                <p className="text-xl text-gray-600">Please sign in to view your profile</p>
                        </div>
                );
        }

        const user = dataUser[0];
        const images = dataImage;

        const handleDeleteImage = async (imageId: string, dbId: number) => {
                const confirmDelete = confirm("Are you sure you want to delete this image?");
                if (!confirmDelete) return;

                try {
                        const res = await fetch("/api/custom/cloudinary/delete", {
                                method: "DELETE",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ imageId, dbId }),
                        });

                        const data = await res.json();
                        if (!res.ok) throw new Error(data.error || "Delete failed");

                        // Refresh SWR cache
                        mutate(urlImage);
                } catch (err: any) {
                        console.error("Delete error:", err.message);
                        alert("Failed to delete image");
                }
        };

        return (
                <div className="container mx-auto px-4 py-8">
                        <div className="max-w-4xl mx-auto">
                                <Card className="mb-8 shadow-md">
                                        <CardContent className="p-6">
                                                <div className="flex items-center space-x-6">
                                                        <Avatar className="h-24 w-24">
                                                                <AvatarImage
                                                                        src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`}
                                                                        alt={`${user.name} avatar`}
                                                                />
                                                                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                                <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
                                                                <p className="text-gray-600">@{user.username}</p>
                                                                <p className="text-gray-600">{user.email}</p>
                                                                <p className="text-sm text-gray-500">
                                                                        Member since {new Date(user.createdAt).toLocaleDateString()}
                                                                </p>
                                                        </div>
                                                </div>
                                        </CardContent>
                                </Card>

                                <div className="flex justify-between items-center mb-4">
                                        <h2 className="text-2xl font-semibold text-gray-800">Your Assets</h2>
                                        <EncryptMessageDialog />
                                </div>

                                {images.length === 0 ? (
                                        <p className="text-gray-500">No images uploaded yet.</p>
                                ) : (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                                {images.map((image) => (
                                                        <Card key={image.id} className="relative group overflow-hidden shadow-md border">
                                                                <div className="relative w-full aspect-square">
                                                                        <CldImage
                                                                                src={image.imageId}
                                                                                alt="Uploaded Image"
                                                                                fill
                                                                                sizes="(max-width: 768px) 100vw, 33vw"
                                                                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                                                                        />
                                                                        {/* Copy Button Overlay */}
                                                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                                                <button
                                                                                        onClick={() => handleCopyUrl(image.imageId, image.id)}
                                                                                        className="px-4 py-2 bg-white text-black text-sm font-medium rounded hover:bg-gray-200 transition"
                                                                                >
                                                                                        {copiedId === image.id ? "Copied!" : "Copy URL"}
                                                                                </button>
                                                                        </div>
                                                                </div>
                                                                <div className="p-4 text-sm text-gray-500 border-t relative group">
                                                                        Created At {new Date(image.createdAt).toLocaleDateString()}

                                                                        {/* Delete Button */}
                                                                        <Button
                                                                                onClick={() => handleDeleteImage(image.imageId, image.id)}
                                                                                variant={"destructive"}
                                                                                className="absolute top-1/2 right-4 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition">
                                                                                Delete
                                                                        </Button>
                                                                </div>

                                                        </Card>
                                                ))}
                                        </div>
                                )}
                        </div>
                </div>
        );
}

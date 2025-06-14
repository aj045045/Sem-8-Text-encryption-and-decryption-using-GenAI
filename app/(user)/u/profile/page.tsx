"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useSWR from "swr";
import { EncryptMessageDialog } from "./encrypt-message";

interface User {
        id: number;
        name: string;
        username: string;
        email: string;
        createdAt: string;
};

interface Image {
        id: number;
        imageId: string;
        createdAt: string;
};

export default function ProfilePage() {
        const { data: session } = useSession();
        const urlUser = `/api/crud/users?where=${encodeURIComponent(JSON.stringify({ email: { $eq: session?.user?.email } }))}`;
        const { data: dataUser, isLoading: isUserLoading } = useSWR<User[]>(urlUser);
        const urlImage =
                dataUser && dataUser.length > 0
                        ? `/api/crud/images?where=${encodeURIComponent(JSON.stringify({ userId: { $eq: dataUser[0].id } }))}`
                        : null;
        const { data: dataImage, isLoading: isImageLoading } = useSWR<Image[]>(urlImage);

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
                                <p className="text-xl text-gray-600">
                                        Please sign in to view your profile
                                </p>
                        </div>
                );
        }
        const user = dataUser[0];
        const images = dataImage;
        return (
                <div className="container mx-auto px-4 py-8">
                        <div className="max-w-4xl mx-auto">
                                <Card className="mb-8">
                                        <CardContent className="p-6">
                                                <div className="flex items-center space-x-6">
                                                        <Avatar className="h-24 w-24">
                                                                <AvatarImage
                                                                        src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name.charAt(0)}`}
                                                                />
                                                                <AvatarFallback>{user.username}</AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                                <h1 className="text-3xl font-bold">{user.name}</h1>
                                                                <p className="text-gray-600">@{user.username}</p>
                                                                <p className="text-gray-600">{user.email}</p>
                                                                <p className="text-sm text-gray-500">
                                                                        Member since {new Date(user.createdAt).toLocaleDateString()}
                                                                </p>
                                                        </div>
                                                </div>
                                        </CardContent>
                                </Card>

                                <div className="flex justify-between">
                                        <div className="text-2xl font-bold mb-4">Your Assets</div>
                                        <EncryptMessageDialog />
                                </div>
                                {images.length === 0 ? (
                                        <p className="text-gray-600">No images uploaded yet.</p>
                                ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                {images.map((image) => (
                                                        <Card key={image.id} className="overflow-hidden">
                                                                <CardContent className="p-0">
                                                                        <div className="relative aspect-square">
                                                                                <Image
                                                                                        src={`/api/images/${image.imageId}`}
                                                                                        alt={`Image uploaded on ${new Date(image.createdAt).toLocaleDateString()}`}
                                                                                        fill
                                                                                        className="object-cover"
                                                                                />
                                                                        </div>
                                                                        <div className="p-4">
                                                                                <p className="text-sm text-gray-500">
                                                                                        Uploaded on{" "}
                                                                                        {new Date(image.createdAt).toLocaleDateString()}
                                                                                </p>
                                                                        </div>
                                                                </CardContent>
                                                        </Card>
                                                ))}
                                        </div>
                                )}
                        </div>
                </div>
        );
}

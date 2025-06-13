'use client'
import { CloudinaryUploader } from "@/components/cloudinary-uploader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Image } from "lucide-react";
import { useEffect, useState } from "react";
import { ImageDialog } from "./gallery";
import { UtilityHandler } from "@/lib/form-handler";
import useSWR from "swr";
import { ImageInterface } from "@/interface/user";


export default function ImagesPage() {
    const [imageId, setImageId] = useState<string | null>(null);
    useEffect(() => {
        if (imageId && typeof imageId === 'string') {
            UtilityHandler.onSubmitPost("/api/crud/images", { "imageId": imageId })
        }
    }, [imageId]);

    const { data, isLoading, error } = useSWR<ImageInterface[]>("/api/crud/images");
    if (isLoading) return isLoading;
    if (error) return null;
    return (
        <div className="container px-10">
            <h1 className="text-3xl font-bold tracking-tight flex space-x-10 items-center"><Image className="mr-2" />Image Management</h1>
            <Tabs defaultValue="gallery">
                <TabsList className="grid w-80 mt-5 grid-cols-2">
                    <TabsTrigger value="gallery">Gallery</TabsTrigger>
                    <TabsTrigger value="uploader">Uploader</TabsTrigger>
                </TabsList>
                <TabsContent value="gallery" className="flex flex-wrap gap-5 mt-5">
                    {data?.map((image, idx) => (
                        <ImageDialog key={idx} {...image} />
                    ))}
                </TabsContent>
                <TabsContent value="uploader">
                    <CloudinaryUploader onUploadSuccess={setImageId} />
                </TabsContent>
            </Tabs>
        </div>
    )
}

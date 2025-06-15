"use client";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useState, useEffect } from "react";
import * as z from "zod";
import { ArrowUpIcon, FileUp, LinkIcon } from "lucide-react";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useZodForm } from "@/lib/use-zod-form";
import { Button } from "@/components/ui/button";

// Schema for input validation
const schema = z.object({
    url: z.string().url("Please enter a valid URL").optional(),
    file: z.instanceof(File).nullable().optional(),
});

export default function DecryptMessagePage() {
    const form = useZodForm(schema, {
        defaultValues: {
            url: "",
            file: undefined,
        },
    });

    const file = form.watch("file");
    const url = form.watch("url");
    const [filePreview, setFilePreview] = useState<string | null>(null);
    const [decryptedMessage, setDecryptedMessage] = useState<string | null>(null);

    useEffect(() => {
        if (file && typeof file === "object" && file instanceof File) {
            const reader = new FileReader();
            reader.onloadend = () => setFilePreview(reader.result as string);
            reader.readAsDataURL(file);
        } else {
            setFilePreview(null);
        }
    }, [file]);

    const onSubmit = async (data: z.infer<typeof schema>) => {
        setDecryptedMessage(null);

        if (!data.url || !data.file) {
            alert("Please provide both an image URL and a second image file.");
            return;
        }

        try {
            // Fetch the image from Cloudinary URL and convert to Blob
            const response = await fetch(data.url);
            const blob = await response.blob();
            const filenameFromUrl = data.url.split("/").pop() || "cloudinary_image.png";
            const cloudinaryFile = new File([blob], filenameFromUrl, { type: blob.type });

            // Create FormData with both files
            const formData = new FormData();
            formData.append("image1", cloudinaryFile);
            formData.append("image2", data.file);

            const res = await fetch("/f/decrypt", {
                method: "POST",
                body: formData,
            });

            const result = await res.json();

            if (!res.ok) {
                throw new Error(result.error || "Decryption failed");
            }

            setDecryptedMessage(result.decrypted_message);
        } catch (error: any) {
            console.error("Decryption error:", error);
            setDecryptedMessage("Error: " + error.message);
        }
    };


    return (
        <div className="relative w-full min-h-screen pt-8 pb-20">
            <div className="max-w-4xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 gap-6">

                {/* Preview from URL */}
                {url && (
                    <PreviewCard
                        title="Public Image"
                        imageSrc={url}
                        description={url}
                    />
                )}

                {/* Preview from uploaded file */}
                {filePreview && file && (
                    <PreviewCard
                        title="Private Image"
                        imageSrc={filePreview}
                        description={file.name}
                    />
                )}
            </div>
            {decryptedMessage && (
                <div className="max-w-4xl mx-auto mt-6 px-4 text-center">
                    <div className="bg-green-100 text-green-800 p-4 rounded-lg shadow">
                        <strong>Decrypted Message:</strong> {decryptedMessage}
                    </div>
                </div>
            )}

            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="fixed bottom-6 left-1/2 transform -translate-x-1/2 w-full max-w-4xl bg-white border rounded-xl shadow-md px-4 py-3 flex flex-col sm:flex-row gap-4 items-center justify-between">

                    {/* File Upload Field */}

                    <FormField
                        control={form.control}
                        name="file"
                        render={({ field }) => (
                            <FormItem className="flex items-center gap-3">
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <FormLabel className="cursor-pointer flex items-center gap-2">
                                                <FileUp className="w-5 h-5 text-blue-500 hover:scale-105 transition-transform" />
                                                <FormControl>
                                                    <Input
                                                        type="file"
                                                        className="hidden"
                                                        accept="image/*"
                                                        onChange={(e) =>
                                                            field.onChange(e.target.files?.[0] ?? null)
                                                        }
                                                    />
                                                </FormControl>
                                            </FormLabel>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            Upload an image file for decryption
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                                <FormMessage />
                            </FormItem>
                        )}
                    />


                    {/* URL Input Field */}
                    <FormField
                        control={form.control}
                        name="url"
                        render={({ field }) => (
                            <FormItem className="flex items-center gap-2 w-full">
                                <LinkIcon className="w-5 h-5 text-green-500" />
                                <FormControl>
                                    <Input
                                        placeholder="Enter image URL..."
                                        className="w-full text-sm border-b focus:outline-none focus:border-blue-500 py-1"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="flex items-center gap-2">

                        {/* Tooltip Icon */}
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        type="submit"
                                        className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-md transition-all"
                                    >
                                        <ArrowUpIcon className="w-5 h-5" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent >
                                    Submit to decrypt
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>


                </form>
            </Form>
        </div>
    );
}

function PreviewCard({ title, imageSrc, description }: {
    title: string;
    imageSrc: string;
    description: string;
}) {
    return (
        <div className=" flex flex-col">
            <div className="w-full h-[400px] flex flex-col items-center justify-start bg-white rounded-lg shadow-sm border overflow-hidden">
                <h2 className="text-lg font-semibold text-gray-700 mt-4">{title}</h2>
                <div className="w-full flex-1 px-2">
                    <img
                        src={imageSrc}
                        alt={`${title} Preview`}
                        className="w-full h-full object-contain rounded-md"
                    />
                </div>
            </div>
            <p className="text-sm text-gray-500 mt-2 px-2 break-words text-center">{description}</p>
        </div>
    );
}

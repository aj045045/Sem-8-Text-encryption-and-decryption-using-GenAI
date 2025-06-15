import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Plus } from "lucide-react";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { z } from "zod";
import { useZodForm } from "@/lib/use-zod-form";
import { toast } from "sonner";


export function EncryptMessageDialog() {
    const MAX_CHAR = 1000;
    const [charCount, setCharCount] = useState(0);
    const [preview, setPreview] = useState<string | null>(null);
    const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

    const formSchema = z.object({
        message: z
            .string()
            .min(1, "Message is required")
            .max(MAX_CHAR, `Message must be under ${MAX_CHAR} characters`),
    });

    const form = useZodForm(formSchema, { defaultValues: { message: "" } });

    const handleEncrypt = async (values: { message: string }) => {
        setPreview(null);
        setDownloadUrl(null);
        const toastId = toast.loading("Encrypting message");

        try {
            const res = await fetch('/f/encrypt', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: values.message }),
            });

            const data = await res.json();
            console.log(data);
            if (!res.ok) {
                toast.error(data.error || 'Encryption failed.');
                return;
            }
            setPreview(`data:image/png;base64,${data.display}`);
            setDownloadUrl(`/f${data.download}`);
        } catch (err: any) {
            toast.error('Network error: ' + err.message);
        } finally {
            toast.dismiss(toastId);
        }
    };
    return (
        <Dialog>
            <Tooltip>
                <TooltipTrigger asChild>
                    <DialogTrigger asChild>
                        <Button variant="ghost" className="p-1 bg-accent/30 hover:bg-accent rounded-full border">
                            <Plus size={24} />
                        </Button>
                    </DialogTrigger>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Encrypt a new message</p>
                </TooltipContent>
            </Tooltip>

            <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Encrypt Message</DialogTitle>
                    <DialogDescription>
                        Enter your message below. Click "Encrypt" to secure it.
                    </DialogDescription>
                </DialogHeader>

                {!preview && !downloadUrl && (
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(handleEncrypt)}
                            className="space-y-6 w-full"
                        >
                            <FormField
                                control={form.control}
                                name="message"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Message</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Type a secret message here..."
                                                className="resize-none overflow-y-auto hide-scrollbar max-h-40"
                                                maxLength={MAX_CHAR}
                                                {...field}
                                                onChange={(e) => {
                                                    setCharCount(e.target.value.length);
                                                    field.onChange(e);
                                                }}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            {charCount}/{MAX_CHAR} characters
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <DialogFooter className="pt-4">
                                <DialogClose asChild>
                                    <Button variant="outline" type="button">
                                        Cancel
                                    </Button>
                                </DialogClose>
                                <Button type="submit">Encrypt</Button>
                            </DialogFooter>
                        </form>
                    </Form>
                )}

                {preview && (
                    <div className="pt-6 border-t mt-6 text-center">
                        <p className="text-sm text-muted-foreground mb-2">Encrypted Preview</p>

                        <div className="relative flex justify-center group">
                            <img
                                src={preview}
                                alt="Encrypted Message Preview"
                                className="max-w-full max-h-48 object-contain border rounded shadow"
                            />

                            {/* Button centered on image */}
                            <a
                                href={preview}
                                download="encrypt-image.png"
                                className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 rounded"
                            >
                                <Button size="sm" variant="secondary" className="z-10">
                                    Download Encrypt Public Image
                                </Button>
                            </a>
                        </div>

                        {downloadUrl && (
                            <a
                                href={downloadUrl}
                                download="decrypt-image.png"
                                className="inline-block mt-4 px-4 py-2 text-sm font-medium bg-primary text-white rounded hover:bg-primary/90 transition"
                            >
                                Download Decrypt Image Key
                            </a>
                        )}

                        <DialogFooter className="pt-4">
                            <DialogClose asChild>
                                <Button variant="outline" type="button">
                                    Cancel
                                </Button>
                            </DialogClose>
                        </DialogFooter>
                    </div>
                )}


            </DialogContent>

        </Dialog>
    );
}

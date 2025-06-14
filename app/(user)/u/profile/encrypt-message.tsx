import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Plus } from "lucide-react";

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { z } from "zod";
import { useZodForm } from "@/lib/use-zod-form";
import { UtilityHandler } from "@/lib/form-handler";

const MAX_CHAR = 1000;

export function EncryptMessageDialog() {
    const [charCount, setCharCount] = useState(0);

    const formSchema = z.object({
        message: z
            .string()
            .min(1, "Message is required")
            .max(MAX_CHAR, `Message must be under ${MAX_CHAR} characters`),
    });

    const form = useZodForm(formSchema, { defaultValues: { message: "" } });

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

            <DialogContent className="sm:max-w-[425px] max-h-96">
                <DialogHeader>
                    <DialogTitle>Encrypt Message</DialogTitle>
                    <DialogDescription>
                        Enter your message below. Click "Encrypt" to secure it.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit((data) => UtilityHandler.onSubmitPost("", data))}
                        className="space-y-6 w-full">
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
            </DialogContent>
        </Dialog>
    );
}

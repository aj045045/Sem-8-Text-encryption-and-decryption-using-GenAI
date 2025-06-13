import { z } from "zod";
import { UserZodSchema } from "./form";
export interface ImageInterface {
    id: number;
    imageId: string;
    createdAt: string;
}

export type UserInterface = z.infer<typeof UserZodSchema>
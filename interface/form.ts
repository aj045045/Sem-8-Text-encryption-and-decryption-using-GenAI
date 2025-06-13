import { z } from "zod";

/* This block of code is defining a schema using Zod for a sign-up form. Each field in the form is
specified with certain validation rules using Zod methods. Here's a breakdown of what each field is
doing: */
export const signUpFormSchema = z.object({
    name: z.string().min(6, { message: "User name must be at least 6 characters long." }).max(50, { message: "User name cannot be longer than 50 characters." }),
    username: z.string().min(6, { message: "User name must be at least 6 characters long." }).max(50, { message: "User name cannot be longer than 50 characters." }),
    email: z.string().email({ message: "Invalid email format." }),
    password: z.string().min(6, { message: "Password must be at least 6 characters long." }),
    pin: z.string().length(7, { message: "Your one-time password must be exactly 6 characters." }),  // Exact length for pin
    sendPin: z.string().length(7, { message: "Send Pin must be exactly 6 characters." }),  // Ensuring sendPin is also exactly 6 characters
});

/* This block of code is defining a schema using Zod for a login form. It specifies the validation
rules for the fields in the login form. Here's a breakdown of what each field is doing: */
export const loginFormScheme = z.object({
    email_id: z.string().email(),
    password: z.string().min(6),
});

/* This block of code is defining a schema using Zod for a forget password form. It specifies the
validation rules for each field in the form: */
export const forgetPasswordFormScheme = z.object({
    id: z.number().nullable(),
    email: z.string().email(),
    password: z.string().min(6),
    confirmPassword: z.string().min(6),
    pin: z.string().min(6, {
        message: "Your one-time password must be 6 characters.",
    }),
    sendPin: z.string().min(6)
});


export const UserZodSchema =  z.object({
  id: z.number().int().nonnegative(), // Auto-incremented ID
  name: z.string(),
  username: z.string(), // Unique constraint handled at DB level
  password: z.string(),
  email: z.string().email(), // Validate email format
  bio: z.string().optional(),
  image: z.string().optional(),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
  posts: z.array(z.any()).optional(),
  comments: z.array(z.any()).optional(),
  reactions: z.array(z.any()).optional(),
  bookmarks: z.array(z.any()).optional(),
})

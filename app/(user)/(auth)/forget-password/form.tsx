"use client"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { PasswordInput } from "@/components/ui/password-input"
import Link from "next/link"
import { pageLinks } from "@/constant/page-links"
import { UtilityHandler } from "@/lib/form-handler"
import * as z from "zod"
import { forgetPasswordFormScheme, signUpFormSchema } from "@/interface/form"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { useState } from "react"
import { OTPEmailProps } from "@/interface/email"
import { OTPGeneratorUtil } from "@/lib/otp-generator"
import { toast } from "sonner"
import { useZodForm } from "@/lib/use-zod-form"
import { hashPassword } from "@/lib/utils"
import { redirect } from "next/navigation"


export function ForgetPasswordForm() {
    const [sendOTP, setSendOTP] = useState(false);

    const form = useZodForm(forgetPasswordFormScheme, { defaultValues: { confirmPassword: "", password: "", email: "", pin: "", sendPin: "", id: null } });

    const showButton = form.watch("email")?.length > 12 ? false : true;

    const sendOTPButton = async () => {
        const email = form.watch("email").trim();

        // Step 1: Check if the email is valid
        if (!email) {
            form.setError('email', {
                type: 'manual',
                message: 'Please enter a valid email address.'
            });
            return;
        }

        // Optional: You can use a regex for email format validation, if needed
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (!emailRegex.test(email)) {
            form.setError('email', {
                type: 'manual',
                message: 'Please enter a valid email format.'
            });
            return;
        }

        // Step 2: Check if the email exists in the database
        const url = `/api/crud/users?where=${encodeURIComponent(JSON.stringify({ email: { $eq: email } }))}`;
        const userData = await UtilityHandler.onSubmitGet<{ id: number, email: string; }[]>(url);

        // If no user data found for the email, show an error
        if (!userData || userData.length === 0 || userData[0].email !== email) {
            form.setError('email', {
                type: 'manual',
                message: 'This email does not exist.'
            });
            return;
        }

        form.setValue("id", userData[0].id);

        // Step 3: Generate OTP and send email
        const sendPin = OTPGeneratorUtil();
        setSendOTP(true);
        form.setValue("sendPin", sendPin);

        const payload: OTPEmailProps = {
            name: "User",
            emailId: email,
            code: sendPin,
            task: "Forget Password"
        };

        // Send OTP email
        UtilityHandler.onSubmitPost('/api/emails/otp', payload,
            `An OTP is being sent to ${email}. Please check your email.`,
            'Please check your email for the OTP and enter it to proceed');
    };

    // Step 4: Handle form submission
    const handleForgetSubmit = async (payload: z.infer<typeof forgetPasswordFormScheme>) => {
        const { email, password, pin, sendPin, confirmPassword, id } = payload;
        if (sendPin !== pin) {
            form.setError('pin', {
                type: 'manual',
                message: 'Invalid OTP. Please try again.'
            });
            return;
        }
        if (password !== confirmPassword) {
            form.setError('confirmPassword', {
                type: 'manual',
                message: 'Password and Confirm Password do not match.'
            });
            return;
        }
        const filterPayload = { email, password: await hashPassword(password) };
        UtilityHandler.onSubmitPut(`/api/crud/users/${form.watch("id")}`, filterPayload, `Trying to update your password`, 'You have successfully update for password try to login');
        redirect(pageLinks.login);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleForgetSubmit)}
                className="row-span-2 py-10 mx-auto space-y-8 text-green-950">
                <div>
                    <div className="font-sans text-3xl">Forget Password</div>
                    <div className="flex items-center text-sm text-neutral-600">
                        <span>Doesn&apos;t have an account yet?</span>
                        <Link href={pageLinks.sign_up}>
                            <Button variant={"link"}>Sign Up</Button>
                        </Link>
                    </div>
                </div>

                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email Address<span className="text-red-500">*</span></FormLabel>
                            <FormControl>
                                <Input
                                    required
                                    placeholder="user@example.com"
                                    type="email"
                                    {...field} />
                            </FormControl>
                            <FormDescription>Enter your email-id</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {
                    sendOTP ?
                        <>
                            <FormField
                                control={form.control}
                                name="pin"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>One-Time Password<span className="text-red-500">*</span></FormLabel>
                                        <FormControl>
                                            <InputOTP maxLength={7} {...field}>
                                                <InputOTPGroup>
                                                    <InputOTPSlot index={0} />
                                                    <InputOTPSlot index={1} />
                                                    <InputOTPSlot index={2} />
                                                    <InputOTPSlot index={3} />
                                                    <InputOTPSlot index={4} />
                                                    <InputOTPSlot index={5} />
                                                    <InputOTPSlot index={6} />
                                                </InputOTPGroup>
                                            </InputOTP>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password<span className="text-red-500">*</span></FormLabel>
                                        <FormControl>
                                            <PasswordInput required placeholder="U$er123" {...field} />
                                        </FormControl>
                                        <FormDescription>Enter your password.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Confirm Password<span className="text-red-500">*</span></FormLabel>
                                        <FormControl>
                                            <PasswordInput required placeholder="U$er123" {...field} />
                                        </FormControl>
                                        <FormDescription>Enter your password again.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </>
                        :
                        <div className="space-y-2">
                            <Button disabled={showButton} onClick={sendOTPButton}>Send OTP</Button>
                            <div className="text-sm text-neutral-600">
                                Please enter your email address to receive the one-time password.
                            </div>
                        </div>
                }
                {sendOTP && <Button type="submit">Submit</Button>}
            </form>
        </Form >
    )
}
'use client'
import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, } from '@/components/ui/card';
import { useZodForm } from '@/lib/use-zod-form';
import { UserZodSchema } from '@/interface/form';
import useSWR from 'swr';
import { UserInterface } from '@/interface/user';
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { UtilityHandler } from '@/lib/form-handler';
import { useSession } from 'next-auth/react';
const ProfilePage = () => {
        const { data: sessionData } = useSession();
        // const url = `/api/crud/users?where=${encodeURIComponent(JSON.stringify({ email: { $eq: sessionData?.user.email } }))}`;
        // const { data, isLoading } = useSWR<UserInterface[]>(url);
        const form = useZodForm(UserZodSchema, {
                defaultValues: {
                        bio: "",
                        bookmarks: undefined,
                        comments: undefined,
                        email: "",
                        id: -1,
                        
                }
        });
        // useEffect(() => {
        //         if (data && data[0]) {
        //                 form.reset(data[0]);
        //         }
        // }, [data, form]);

        // if (isLoading) {
        //         return <div>Loading...</div>;
        // }
        // if (!data || data.length === 0) {
        //         return <div>No data found</div>;
        // }
        return (
                <div className="flex justify-center items-center min-h-[80vh] bg-gradient-to-br from-green-50 to-blue-50 py-8">
                        <Card className="w-full max-w-2xl shadow-xl border-2 border-blue-100">
                                <CardHeader className="flex flex-col items-center gap-2">
                                        <CardTitle className="text-3xl font-bold text-blue-900">Profile</CardTitle>
                                        <CardDescription className="text-base text-blue-700">View and update your personal information</CardDescription>
                                </CardHeader>
                                {JSON.stringify(sessionData?.user)}
                                {/* {JSON.stringify(data[0])} */}
                                <CardContent>
                                        <Form {...form}>
                                                <form onSubmit={form.handleSubmit((data: UserInterface) => UtilityHandler.onSubmitPut("/api/crud/user", data))} className="space-y-8 max-w-3xl mx-auto py-10">

                                                        <div className="grid grid-cols-12 gap-4">

                                                                <div className="col-span-6">

                                                                        <FormField
                                                                                control={form.control}
                                                                                name="name"
                                                                                render={({ field }) => (
                                                                                        <FormItem>
                                                                                                <FormLabel>Full name</FormLabel>
                                                                                                <FormControl>
                                                                                                        <Input
                                                                                                                placeholder="Full name"

                                                                                                                type="text"
                                                                                                                {...field} />
                                                                                                </FormControl>
                                                                                                <FormDescription>Enter your full name</FormDescription>
                                                                                                <FormMessage />
                                                                                        </FormItem>
                                                                                )}
                                                                        />
                                                                </div>

                                                                <div className="col-span-6">

                                                                        <FormField
                                                                                control={form.control}
                                                                                name="username"
                                                                                render={({ field }) => (
                                                                                        <FormItem>
                                                                                                <FormLabel>User name</FormLabel>
                                                                                                <FormControl>
                                                                                                        <Input
                                                                                                                placeholder="user"

                                                                                                                type="text"
                                                                                                                {...field} />
                                                                                                </FormControl>
                                                                                                <FormDescription>This is your user name</FormDescription>
                                                                                                <FormMessage />
                                                                                        </FormItem>
                                                                                )}
                                                                        />
                                                                </div>

                                                        </div>

                                                        <FormField
                                                                control={form.control}
                                                                name="email"
                                                                render={({ field }) => (
                                                                        <FormItem>
                                                                                <FormLabel>Email Id</FormLabel>
                                                                                <FormControl>
                                                                                        <Input
                                                                                                placeholder="email"

                                                                                                type="email"
                                                                                                {...field} />
                                                                                </FormControl>
                                                                                <FormDescription>Enter your email-id</FormDescription>
                                                                                <FormMessage />
                                                                        </FormItem>
                                                                )}
                                                        />

                                                        <FormField
                                                                control={form.control}
                                                                name="bio"
                                                                render={({ field }) => (
                                                                        <FormItem>
                                                                                <FormLabel>Bio</FormLabel>
                                                                                <FormControl>
                                                                                        <Textarea
                                                                                                placeholder="Placeholder"
                                                                                                className="resize-none"
                                                                                                {...field}
                                                                                        />
                                                                                </FormControl>
                                                                                <FormDescription>You can @mention other users and organizations.</FormDescription>
                                                                                <FormMessage />
                                                                        </FormItem>
                                                                )}
                                                        />
                                                        <Button type="submit">Submit</Button>
                                                </form>
                                        </Form>
                                </CardContent>
                        </Card>
                </div>
        );
};

export default ProfilePage;
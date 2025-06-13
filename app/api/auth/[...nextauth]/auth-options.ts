import { NextAuthOptions } from "next-auth";
import { credentialsProvider } from "./credentialProvider";

const callbacksProvider: NextAuthOptions['callbacks'] = {
    async jwt({ token, user }) {
        return token;
    },

    async session({ session, token }) {
        return session;
    },
};

export const authOptions: NextAuthOptions = {
    session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },// 30 days
    providers: [credentialsProvider],
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: callbacksProvider,
    pages: {
        error: '/error',
        signIn: '/login',
        signOut: '/home',
    }
};
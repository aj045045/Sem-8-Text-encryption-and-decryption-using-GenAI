'use client';

import Link from 'next/link';
import Lottie, { useLottie } from 'lottie-react';
import NotFoundIcon from '@/public/icons/404.json';

export default function NotFound() {
    const style = {
        height: 160,
        width: 160,
        marginBottom: 50,
    };

    const options = {
        animationData: NotFoundIcon,
        loop: true,
        autoplay: true,
    };

    const { View, setSpeed } = useLottie(options, style);
    setSpeed(3);
    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-slate-800 px-4">
            {View}
            <h1 className="text-xl font-semibold mb-2">
                Resource Not Found
            </h1>
            <p className="mb-4">The page you're looking for doesn't exist.</p>
            <Link
                href="/"
                className="inline-block bg-red-100 text-red-600 font-medium px-4 py-2 rounded hover:bg-red-100/50 transition"
            >
                Return Home
            </Link>
        </div>
    );
}

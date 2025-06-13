import type { Metadata } from "next";
import { RootLayout } from "./config";

export const metadata: Metadata = {
  title: {
    default: "AJ Blog",
    template: "%s |  AJ Blog",
  },
  description: "A modern blog application built with Next.js, allowing users to create and manage blog posts while providing admins with insightful analytics and management tools.",
};

export default RootLayout;
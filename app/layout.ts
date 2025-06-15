import type { Metadata } from "next";
import { RootLayout } from "./config";

export const metadata: Metadata = {
  title: {
    default: "TED Gen AI",
    template: "%s | TED Gen AI",
  },
  description:
    "TED Gen AI is a modern platform powered by Next.js. It enables users to publish content and gives administrators powerful tools for analytics and content management.",
};

export default RootLayout;

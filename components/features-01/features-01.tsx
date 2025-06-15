import { Download, EyeOff, ImagePlus, KeyRound, MessageSquareCode, Share2 } from "lucide-react";
import React from "react";

const features = [
  {
    icon: MessageSquareCode, // Icon idea: AI-enhanced text
    title: "Smart Message Processing",
    description:
      "AI cleans, formats, and prepares your input message before encryption, ensuring clarity and consistency across platforms.",
  },
  {
    icon: KeyRound, // Represents keys or encryption
    title: "AI-Guided Key Generation",
    description:
      "Generates cryptographic keys optimized for secure embedding using advanced AI entropy and pattern avoidance.",
  },
  {
    icon: ImagePlus, // Represents image creation
    title: "Intelligent Image Generation",
    description:
      "AI designs visually distinct images for each encryption key, enhancing recognition without compromising security.",
  },
  {
    icon: EyeOff, // Represents hiding or obfuscation
    title: "AI-Powered Steganography",
    description:
      "Conceals your private keys within images using deep learning to avoid detection by traditional steganalysis tools.",
  },
  {
    icon: Download, // For downloading private key image
    title: "Secure Asset Delivery",
    description:
      "Ensures that the private image is downloaded securely and protected using AI-driven anomaly detection.",
  },
  {
    icon: Share2, // Sharing icon
    title: "Smart Sharing Assistant",
    description:
      "AI recommends optimal hosting and sharing settings for your public image, ensuring it’s easy to access but hard to misuse.",
  },
];


const Features01Page = () => {
  return (
    <div className="min-h-screen flex items-center justify-center py-12">
      <div>
        <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-center">
          Features we provide
        </h2>
        <div className="mt-10 sm:mt-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-screen-lg mx-auto px-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="flex flex-col border rounded-xl py-6 px-5"
            >
              <div className="mb-3 h-10 w-10 flex items-center justify-center bg-muted rounded-full">
                <feature.icon className="h-6 w-6" />
              </div>
              <span className="text-lg font-semibold">{feature.title}</span>
              <p className="mt-1 text-foreground/80 text-[15px]">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Features01Page;

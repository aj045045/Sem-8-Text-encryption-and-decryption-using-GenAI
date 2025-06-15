import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

const steps = [
  {
    title: "1. Secure Communication",
    description:
      "Protect sensitive messages by embedding them in images using AI-assisted encryption and steganography.",
    completed: true,
  },
  {
    title: "2. Keyless Authentication",
    description:
      "Replace complex cryptographic key sharing with intuitive, image-based key exchange powered by AI-generated visuals.",
    completed: true,
  },
  {
    title: "3. Encrypted File Delivery",
    description:
      "Send confidential files or contracts hidden in images with private access control and AI-based anomaly detection.",
    completed: true,
  },
  {
    title: "4. Digital Identity Verification",
    description:
      "Use AI to embed identity tokens or verification data inside images, enabling secure, decentralized identity systems.",
    completed: true,
  },
  {
    title: "5. Secure Voting & Polling",
    description:
      "Enable private and tamper-proof voting using steganographically hidden ballots backed by AI content validation.",
    completed: true,
  },
  {
    title: "6. Monetized Content Sharing",
    description:
      "Deliver premium content securely by distributing public and private image keys, unlocking hidden educational or media material.",
    completed: true,
  },
  {
    title: "7.Proof of Ownership (NFTs/Assets)",
    description:
      "Embed proof-of-ownership metadata inside media files to verify originality, protect creators, and prevent duplication.",
    completed: true,
  },
];


export default function Timeline() {
  return (
    <>
      <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-center">
        Use Cases
      </h2>
      <div className="max-w-screen-sm mx-auto py-12 md:py-20 px-6">
        <div className="relative ml-6">
          {/* Timeline line */}
          <div className="absolute left-0 inset-y-0 border-l-2" />

          {steps.map(({ title, description, completed }, index) => (
            <div key={index} className="relative pl-10 pb-10 last:pb-0">
              {/* Timeline Icon */}
              <div
                className={cn(
                  "absolute left-px -translate-x-1/2 h-9 w-9 border-2 border-muted-foreground flex items-center justify-center rounded-full bg-accent ring-8 ring-background",
                  {
                    "bg-primary border-primary text-primary-foreground":
                      completed,
                  }
                )}
              >
                <span className="font-semibold text-lg">
                  {completed ? <Check className="h-5 w-5" /> : index + 1}
                </span>
              </div>

              {/* Content */}
              <div className="pt-1 space-y-2">
                <h3 className="text-xl font-semibold">{title}</h3>
                <p className="text-muted-foreground">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

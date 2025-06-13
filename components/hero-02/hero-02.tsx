import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { assetsLinks } from "@/constant/assets-links";
import { ArrowUpRight, CirclePlay } from "lucide-react";
import Image from "next/image";
import React from "react";

const Hero02 = () => {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-background/80">
      <div className="max-w-screen-xl w-full mx-auto grid lg:grid-cols-2 gap-16 px-8 py-16">
        <div className="flex flex-col justify-center">
          <Badge className="bg-gradient-to-br from-primary to-primary/60 rounded-full py-1.5 px-4 text-sm font-medium text-primary-foreground border-none">
            Version 2.0 Now Available
          </Badge>
          <h1 className="mt-6 max-w-[20ch] text-4xl md:text-5xl lg:text-6xl xl:text-[3.5rem] font-extrabold tracking-tight !leading-[1.15]">
            Secure Text Encryption with Advanced AI
          </h1>
          <p className="mt-6 max-w-[65ch] text-xl text-muted-foreground leading-relaxed">
            Protect your sensitive communications with cutting-edge AI-driven encryption and decryption solutions.
          </p>
          <div className="mt-12 flex items-center gap-6">
            <Button size="lg" className="rounded-full text-lg font-semibold px-8 py-6 shadow-lg hover:shadow-xl transition-shadow">
              Start Now <ArrowUpRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="rounded-full text-lg font-semibold px-8 py-6 border-2 shadow-none hover:bg-primary/5 transition-colors"
            >
              <CirclePlay className="mr-2 h-5 w-5" /> View Demo
            </Button>
          </div>
        </div>
        <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-2xl">
          <Image
            src={assetsLinks.home_image_creation.src}
            alt={assetsLinks.home_image_creation.alt}
            fill
            className="object-center"
            priority
            quality={90}
          />
        </div>
      </div>
    </section>
  );
};

export default Hero02;
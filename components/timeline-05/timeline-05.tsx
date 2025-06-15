const steps = [
  {
    title: "Enter Your Message",
    description:
      "Start by entering the message you want to secure. This message will later be encrypted and hidden using advanced techniques.",
  },
  {
    title: "Generate Encryption Keys",
    description:
      "We create a pair of cryptographic keys – one private and one public – used to lock and unlock your message securely.",
  },
  {
    title: "Create Visual Keys",
    description:
      "Each key is converted into a unique image. These images represent your keys visually, making them easier to manage and store.",
  },
  {
    title: "Embed Keys Into Images",
    description:
      "The keys are securely embedded into the image files using steganography, so they’re hidden in plain sight.",
  },
  {
    title: "Download Private Key Image",
    description:
      "You can now download the private image. Keep this file safe – it’s the only way to decrypt your original message.",
  },
  {
    title: "Share Public Key Image",
    description:
      "The public key image can be shared through a URL (e.g., via Cloudinary or any file host). Others use this to encrypt messages for you.",
  },
];


export default function Timeline() {
  return (
    <>
      <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-center">
        How we works?
      </h2>
      <div className="max-w-screen-sm mx-auto py-12 md:py-20 px-6">
        <div className="relative ml-6">
          {/* Timeline line */}
          <div className="absolute left-0 inset-y-0 border-l-2" />
          {steps.map(({ title, description }, index) => (
            <div key={index} className="relative pl-10 pb-10 last:pb-0">
              {/* Timeline Icon */}
              <div className="absolute left-px -translate-x-1/2 h-9 w-9 border-2 border-muted-foreground flex items-center justify-center rounded-full bg-accent ring-8 ring-background">
                <span className="font-semibold text-lg">{index + 1}</span>
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

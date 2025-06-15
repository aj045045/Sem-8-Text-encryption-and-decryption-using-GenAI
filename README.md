# Text encryption and decryption using Gen AI

## Pages

- Home page
- Login page
- Sign Up page
- Decryption page
- User profile (also Image generation page)

## Libraries

- npx shadcn@latest init
- npm install lucide-react
- npm install prisma --save-dev
- npx prisma init --datasource-provider sqlite
- npx prisma migrate dev --name init
- npm install @prisma/client
- npm install zod@3 @hookform/resolvers@2 react-hook-form@7
- npm install react-email -D -E
- npm install @react-email/components -E
- npm install next-auth
- npm install bcryptjs
- npm i swr
- npm install next-cloudinary cloudinary
- npm i nodemailer
- npm i --save-dev @types/nodemailer
- npm install lottie-react
- npm install next-themes

# Home page

- Hero section
- How it works
- Key features
- Use Cases
- Call to Action (CTA)

## Use cases

#### **1. Secure Messaging in High-Risk Environments**

> **For:** Journalists, whistleblowers, human rights activists
> **Use Case:**
> Users can safely compose and encrypt sensitive information (like witness testimonies or whistleblower reports) using AI-powered formatting. The message is embedded into an image and shared publicly, while the private image is securely downloaded and stored offline.

- **AI Enhancements:** Smart message redaction, anomaly detection in download requests, secure key embedding.
- **Business Angle:** Builds trust for privacy-first platforms or secure communication apps.

---

#### **2. Digital Key Exchange Without Traditional Key Management**

> **For:** Developers or teams sharing encryption keys
> **Use Case:**
> Instead of manually handling PEM files or QR codes, developers can use AI to create images with embedded public/private keys. Public keys are uploaded and shared via a URL, while private keys are downloaded and stored locally.

- **AI Enhancements:** Pattern-resistant key generation, image-based key validation.
- **Developer Benefit:** Easier onboarding for less technical users in security workflows.

---

#### **3. AI-Secured Voting or Polling Systems**

> **For:** DAO governance, online elections, feedback collection
> **Use Case:**
> A system can generate encrypted votes embedded into user-specific images. Each vote is uniquely signed and stored, with images functioning as private tokens.

- **AI Enhancements:** Detection of duplicate submissions, image tampering analysis.
- **Scalability:** Works at mass scale while preserving anonymity and traceability.

---

#### **4. Confidential Contract Delivery**

> **For:** Freelancers, legal teams, business owners
> **Use Case:**
> Instead of emailing PDFs, users can upload and convert contracts into secure images. AI helps clean and structure the text, encrypts it, and hides it inside an image. Only the intended recipient can decrypt using the private key image.

- **AI Enhancements:** Auto-formatting of legal text, translation to recipient's language, AI validation of contract completeness.
- **Business Edge:** Avoids email-based leaks, boosts professional trust.

---

#### **5. Educational Content with Access Control**

> **For:** Online instructors, premium content creators
> **Use Case:**
> Instructors share public images that hint at or unlock hidden educational content (like answers, deeper material). Users receive private key images after completing tasks (e.g., payments, quizzes).

- **AI Enhancements:** Content scoring, reward logic, content embedding.
- **Monetization Opportunity:** Turns educational access into gamified, secure transactions.

---

#### **6. Proof-of-Ownership or Authenticated NFTs**

> **For:** Digital artists, NFT creators
> **Use Case:**
> Creators embed ownership metadata and private signatures inside an image without revealing the full contract on-chain. AI helps structure the ownership proof and detects unauthorized duplicates.

- **AI Enhancements:** Image fingerprinting, steganography-based digital signature embedding.
- **Differentiator:** Adds utility + protection layer to traditional NFTs.

---

import { OTPEmailProps } from "@/interface/email";
import { OTPGeneratorUtil } from "@/lib/otp-generator";
import { Html, Head, Body, Tailwind, Text, Section, Img, Preview, Container, Heading, Hr, Button } from "@react-email/components";

export default function OTPEmailComp(props: OTPEmailProps) {
    return (
        <Html>
            <Head />
            <Preview>Blog Email Verification</Preview>
            <Tailwind>
                <Body className="bg-gray-50 py-6 select-none">
                    <Container className="bg-white max-w-xl mx-auto rounded-lg shadow-lg p-6 text-center font-sans">
                        <Section>
                            <Img
                                alt="Logo"
                                src="https://res.cloudinary.com/dq50dyxba/image/upload/v1743331599/logo_tqjree.png"
                                className="w-80 h-52 rounded-full mx-auto mb-4"
                            />
                        </Section>
                        <Section>
                            <Heading className="text-3xl font-semibold text-gray-800 mb-2">Verify Your Email Address</Heading>
                            <Text className="text-lg text-gray-600 mb-4">Hi {props.name},</Text>
                        </Section>
                        <Section>
                            <Text className="text-base text-gray-700 mb-3">
                                We received a request to {props.task} your email address: <strong>{props.emailId}</strong>.
                            </Text>
                            <Text className="text-base text-gray-700 mb-6">Use the code below to complete the process:</Text>
                        </Section>
                        <Section className="bg-purple-100 rounded-lg py-4 mb-4">
                            <Text className="text-4xl font-bold text-purple-700">{props.code}</Text>
                            <Text className="text-sm text-gray-500 mt-2">This code will expire in 5 minutes.</Text>
                        </Section>
                        <Section>
                            <Text className="text-base text-gray-700 mb-4">
                                If you did not request this action, please disregard this email. It’s safe to ignore.
                            </Text>
                            <Text className="text-base text-gray-700">This code will securely {props.task} your account using:</Text>
                            <Text className="text-blue-500">{props.emailId}</Text>
                        </Section>
                        <Section className="mt-6">
                            <Hr className="border-gray-300" />
                            <Text className="text-gray-500 text-sm mt-4">If you didn’t request this action, just ignore this message.</Text>
                        </Section>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
}

OTPEmailComp.PreviewProps = {
    name: "Ansh Yadav",
    task: "Register",
    code: OTPGeneratorUtil(),
    emailId: "aj045045@gmail.com"
};

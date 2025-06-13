export interface OTPEmailProps {
    name: string;
    task: string;
    code: string;
    emailId: string;
}

export interface WelcomeEmailProps {
    name: string;
    email: string;
    createdAt: string;
}
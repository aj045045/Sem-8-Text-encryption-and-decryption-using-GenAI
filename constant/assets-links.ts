/* This block of code is defining an object named `assetsLinks` in TypeScript. The object contains
various properties such as `logo`, `sign_up`, `login`, `forget_password`, and `social`, each with
their own nested properties like `src` (source URL) and `alt` (alternative text) for images. */
export const assetsLinks = {
    logo: {
        src: '/logo.svg',
        alt: 'Logo Image'
    },
    sign_up: {
        src: '/sign-up.svg',
        alt: 'Sign up Image',
    },
    login: {
        src: '/login.svg',
        alt: 'Login Image',
    },
    forget_password: {
        src: '/forget-password.svg',
        alt: 'Forget Password Image',
    },
    social: {
        github: {
            src: '/social-logo/github.svg',
            alt: 'Github Icon Image'
        },
        instagram: {
            src: '/social-logo/instagram.svg',
            alt: 'Instagram Icon Image'
        },
        linkedIn: {
            src: '/social-logo/linkedin.svg',
            alt: 'LinkedIn Icon Image'
        },
        twitter: {
            src: '/social-logo/twitter.svg',
            alt: 'Twitter Icon Image'
        },
        youtube: {
            src: '/social-logo/youtube.svg',
            alt: 'Twitter Icon Image'
        }
    }
}
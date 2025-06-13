import { NavbarComp } from "@/components/navbar";

export default function UserLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <NavbarComp />
            <div className="py-20">
                {children}
            </div>
        </>
    );
}
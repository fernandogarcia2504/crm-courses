import { Outlet } from "react-router-dom";

export default function AuthLayout() {
    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-canvas text-ink">
            <main className="w-full">
                <Outlet />
            </main>
        </div>
    );
}

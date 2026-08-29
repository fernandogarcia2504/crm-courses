import { Routes, Route, BrowserRouter } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";
import AuthLayout from "../layouts/AuthLayout";
import PortalLayout from "../layouts/PortalLayout";

import LoginPage from "../../features/auth/LoginPage";
import CoursePage from "../../features/course/pages/CoursePage";

import { AuthProvider } from "../context/AuthProvider";

export default function AppRouter() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route element={<AuthLayout />}>
                        <Route path="/" element={<LoginPage />} />
                    </Route>

                    <Route element={<ProtectedRoute />}>
                        <Route element={<PortalLayout />}>
                            <Route path="/curso" element={<CoursePage />} />
                        </Route>
                    </Route>
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

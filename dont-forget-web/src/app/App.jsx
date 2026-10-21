import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LanguageProvider } from "@/shared/i18n/LanguageContext";
import { ROUTES } from "@/shared/constants/app";
import LoginPage from "@/features/auth/pages/login/LoginPage";
import SignupPage from "@/features/auth/pages/signup/SignupPage";
import FindIdPage from "@/features/auth/pages/findid/FindIdPage";
import FindPwPage from "@/features/auth/pages/findpw/FindPwPage";
import MainPage from "@/features/todos/pages/MainPage";
import ProfilePage from "@/features/profile/pages/ProfilePage";
import ContactAdminPage from "@/features/admin/pages/ContactAdminPage";

export default function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to={ROUTES.login} replace />} />
          <Route path={ROUTES.login} element={<LoginPage />} />
          <Route path={ROUTES.signup} element={<SignupPage />} />
          <Route path={ROUTES.findId} element={<FindIdPage />} />
          <Route path={ROUTES.findPassword} element={<FindPwPage />} />
          <Route path={ROUTES.todos} element={<MainPage />} />
          <Route path={ROUTES.profile} element={<ProfilePage />} />
          <Route path={ROUTES.contact} element={<ContactAdminPage />} />
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  );
}




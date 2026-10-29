import { useState } from "react";
import { Link } from "react-router-dom";
import { signOut } from "firebase/auth";
import { ROUTES } from "@/shared/constants/app";
import Sidebar from "@/shared/components/layout/Sidebar";
import { auth } from "@/shared/services/firebase/firebase";
import { registerBrowserPush } from "@/shared/services/notifications/notification";
import "@/features/todos/components/sidebar/Sidebar.css";
import "./AppLayout.css";

export default function AppLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const userName = localStorage.getItem("userName") || "친구";

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      localStorage.removeItem("userName");
      window.location.href = ROUTES.login;
    }
  };

  const handleEnableNotifications = async () => {
    try {
      const result = await registerBrowserPush();
      window.alert(result.message);
    } catch (error) {
      window.alert(error?.message || "브라우저 푸시를 등록하지 못했습니다.");
    }
  };

  return (
    <div className="app-layout">
      <header className="app-layout-header">
        <Link className="app-layout-brand" to={ROUTES.todos}>
          <span aria-hidden="true">✓</span>
          <span>Don't forget</span>
        </Link>
        <div className="app-layout-account">
          <span className="app-layout-user">
            <span className="app-layout-avatar" aria-hidden="true">
              {userName.charAt(0)}
            </span>
            <span>{userName}</span>
          </span>
          <button
            type="button"
            className="app-layout-menu-button"
            onClick={() => setIsSidebarOpen((isOpen) => !isOpen)}
            aria-expanded={isSidebarOpen}
            aria-label="메뉴 열기"
          >
            <span aria-hidden="true">☰</span>
          </button>
        </div>
      </header>
      {children}
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        handleLogout={handleLogout}
        onEnableNotifications={handleEnableNotifications}
      />
    </div>
  );
}

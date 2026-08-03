import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import MainPage from "./pages/MainPage";
import FindIdPage from "./pages/FindIdPage";
import FindPwPage from "./pages/FindPwPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/Signup" element={<SignupPage />} />
        <Route path="/find-id" element={<FindIdPage />} /> {/* 👈 추가 */}
        <Route path="/find-pw" element={<FindPwPage />} /> {/* 👈 추가 */}
        <Route path="/todo" element={<MainPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

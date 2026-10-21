import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/shared/i18n/LanguageContext";
import { getFirebaseAuthHeaders } from "@/shared/services/firebase/idToken";
import { apiUrl } from "@/shared/config/api";
import { PROFILE_DEFAULTS } from "@/shared/constants/app";
import ContactForm from "./ContactForm";
import ContactPageHeader from "./ContactPageHeader";
import ContactProfileCard from "./ContactProfileCard";
import "./ContactAdminPage.css";

export default function ContactAdminPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const userName = localStorage.getItem("userName") || PROFILE_DEFAULTS.name;
  const profileImg = localStorage.getItem("profileImg") || PROFILE_DEFAULTS.imageUrl;

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert("제목과 내용을 모두 입력해 주세요!");
      return;
    }

    try {
      const response = await fetch(apiUrl("/contact"), {
        method: "POST",
        headers: await getFirebaseAuthHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify({ userName, title, content }),
      });
      const result = await response.json();
      if (result.success) {
        alert(result.message);
        navigate(-1);
      } else {
        alert("앗! 접수 실패: " + result.message);
      }
    } catch (error) {
      console.log("문의 접수 통신 에러 ㅠㅠ", error);
      alert("서버와 통신이 끊어졌습니다!");
    }
  };

  return (
    <div className="contact-page">
      <ContactPageHeader
        backLabel={t.btnBack || "⬅ 뒤로"}
        title={t.contactTitle}
        onBack={() => navigate(-1)}
      />
      <ContactProfileCard name={userName} image={profileImg} />
      <ContactForm
        title={title}
        content={content}
        onTitleChange={setTitle}
        onContentChange={setContent}
        onSubmit={handleSubmit}
        translations={t}
      />
    </div>
  );
}

import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/shared/i18n/LanguageContext";
import { getFirebaseAuthHeaders } from "@/shared/services/firebase/idToken";
import { apiUrl } from "@/shared/config/api";
import { PROFILE_DEFAULTS } from "@/shared/constants/app";
import ProfileDetails from "../components/ProfileDetails";
import ProfileHeader from "../components/ProfileHeader";
import ProfileImageEditor from "../components/ProfileImageEditor";
import ProfileStats from "../components/ProfileStats";
import "./ProfilePage.css";

export default function ProfilePage() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [isEditing, setIsEditing] = useState(false);
  const [nickname, setNickname] = useState(localStorage.getItem("userName") || PROFILE_DEFAULTS.name);
  const [statusMessage, setStatusMessage] = useState(localStorage.getItem("statusMessage") || PROFILE_DEFAULTS.statusMessage);
  const [profileImg, setProfileImg] = useState(localStorage.getItem("profileImg") || PROFILE_DEFAULTS.imageUrl);
  const [completedCount, setCompletedCount] = useState(0);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchCompletedTodos = async () => {
      try {
        const response = await fetch(apiUrl(`/todos/${encodeURIComponent(userId)}`), {
          headers: await getFirebaseAuthHeaders(),
        });
        const result = await response.json();
        if (result.success) {
          setCompletedCount(result.todos.filter((todo) => todo.completed === true).length);
        }
      } catch (error) {
        console.log(error);
      }
    };
    if (userId && userId !== "undefined") fetchCompletedTodos();
  }, [userId]);

  const handleSave = async () => {
    try {
      const response = await fetch(apiUrl(`/users/${encodeURIComponent(userId)}`), {
        method: "PUT",
        headers: await getFirebaseAuthHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify({ userName: nickname, statusMessage, profileImg }),
      });
      const result = await response.json();
      if (result.success) {
        localStorage.setItem("userName", nickname);
        localStorage.setItem("statusMessage", statusMessage);
        localStorage.setItem("profileImg", profileImg);
        setIsEditing(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setProfileImg(reader.result);
    reader.readAsDataURL(file);
  };

  return (
    <div className="profile-container">
      <div className="profile-box">
        <div className="page-brand" aria-label="Don't Forget">
          <span className="page-brand-mark" aria-hidden="true">✓</span>
          <span>don't forget</span>
        </div>
        <ProfileHeader
          isEditing={isEditing}
          onBack={() => navigate(-1)}
          onStartEdit={() => setIsEditing(true)}
          onSave={handleSave}
          translations={t}
        />
        <ProfileImageEditor
          image={profileImg}
          isEditing={isEditing}
          inputRef={fileInputRef}
          onImageChange={handleImageChange}
          hint={t.txtProfilePicHint}
        />
        <ProfileDetails
          isEditing={isEditing}
          nickname={nickname}
          statusMessage={statusMessage}
          onNicknameChange={setNickname}
          onStatusChange={setStatusMessage}
          translations={t}
        />
        <ProfileStats completedCount={completedCount} translations={t} />
      </div>
    </div>
  );
}

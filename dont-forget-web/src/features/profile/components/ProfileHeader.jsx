export default function ProfileHeader({ isEditing, onBack, onStartEdit, onSave, translations }) {
  return (
    <header className="profile-header daylight-page-header">
      <button
        type="button"
        className="daylight-page-back-button"
        onClick={onBack}
        aria-label={translations.btnBack}
      >
        ‹
      </button>
      <div className="daylight-page-heading">
        <p>MY PROFILE</p>
        <h1>{translations.menuProfile?.replace(/^👤\s*/, "") || "내 프로필"}</h1>
      </div>
      {isEditing ? (
        <button type="button" className="save-btn" onClick={onSave}>
          {translations.btnSaveProfile}
        </button>
      ) : (
        <button type="button" className="edit-btn" onClick={onStartEdit}>
          {translations.btnEditProfile}
        </button>
      )}
    </header>
  );
}

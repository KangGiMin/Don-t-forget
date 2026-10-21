export default function ProfileHeader({ isEditing, onBack, onStartEdit, onSave, translations }) {
  return (
    <div className="profile-header">
      <button className="back-btn" onClick={onBack}>{translations.btnBack}</button>
      {isEditing ? (
        <button className="save-btn" onClick={onSave}>{translations.btnSaveProfile}</button>
      ) : (
        <button className="edit-btn" onClick={onStartEdit}>{translations.btnEditProfile}</button>
      )}
    </div>
  );
}

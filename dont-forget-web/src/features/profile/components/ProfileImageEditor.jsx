export default function ProfileImageEditor({ image, isEditing, inputRef, onImageChange, hint }) {
  return (
    <div className="profile-img-section">
      <img
        src={image}
        alt="내 프로필"
        className={`profile-image ${isEditing ? "editable" : ""}`}
        onClick={() => isEditing && inputRef.current?.click()}
      />
      {isEditing && <div className="img-edit-hint">{hint}</div>}
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        onChange={onImageChange}
        className="profile-file-input"
      />
    </div>
  );
}

export default function ProfileDetails({ isEditing, nickname, statusMessage, onNicknameChange, onStatusChange, translations }) {
  return (
    <div className="profile-info-section">
      {isEditing ? (
        <>
          <input
            type="text"
            className="edit-input nickname-input"
            value={nickname}
            onChange={(event) => onNicknameChange(event.target.value)}
            placeholder={translations.phNewNickname}
          />
          <input
            type="text"
            className="edit-input status-input"
            value={statusMessage}
            onChange={(event) => onStatusChange(event.target.value)}
            placeholder={translations.phStatusMessage}
          />
        </>
      ) : (
        <>
          <h2 className="profile-nickname">{nickname}</h2>
          <p className="profile-status">"{statusMessage}"</p>
        </>
      )}
    </div>
  );
}

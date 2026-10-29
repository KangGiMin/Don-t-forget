export default function ContactPageHeader({ backLabel, title, onBack }) {
  return (
    <header className="contact-page-header daylight-page-header">
      <button
        type="button"
        onClick={onBack}
        className="daylight-page-back-button"
        aria-label={backLabel}
      >
        ‹
      </button>
      <div className="daylight-page-heading">
        <p>CONTACT</p>
        <h1>{title}</h1>
      </div>
    </header>
  );
}

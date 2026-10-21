export default function ContactPageHeader({ backLabel, title, onBack }) {
  return (
    <div className="contact-page-header">
      <button type="button" onClick={onBack} className="contact-back-button">{backLabel}</button>
      <h1>{title}</h1>
    </div>
  );
}

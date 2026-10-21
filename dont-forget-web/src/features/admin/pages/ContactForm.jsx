export default function ContactForm({ title, content, onTitleChange, onContentChange, onSubmit, translations }) {
  return (
    <form onSubmit={onSubmit} className="contact-form">
      <input
        type="text"
        maxLength={160}
        value={title}
        onChange={(event) => onTitleChange(event.target.value)}
        placeholder={translations.phContactTitle}
      />
      <textarea
        maxLength={5000}
        value={content}
        onChange={(event) => onContentChange(event.target.value)}
        placeholder={translations.phContactContent}
      />
      <button type="submit">{translations.btnSubmitContact}</button>
    </form>
  );
}

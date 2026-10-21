export default function ContactProfileCard({ name, image }) {
  return (
    <div className="contact-profile-card">
      <img src={image} alt="profile" />
      <div>{name}</div>
    </div>
  );
}

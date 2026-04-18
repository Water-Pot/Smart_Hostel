export default function ProfilePage() {
  return (
    <section className="card">
      <h2>My Profile</h2>
      <p className="muted">Update personal info connected with your backend user profile API.</p>
      <div className="profile-grid">
        <div><strong>Name:</strong> Student Name</div>
        <div><strong>Email:</strong> student@email.com</div>
        <div><strong>Room:</strong> A-204</div>
        <div><strong>Phone:</strong> +91-XXXXXXXXXX</div>
      </div>
    </section>
  );
}
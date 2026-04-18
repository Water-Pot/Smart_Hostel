export default function DashboardPage() {
  return (
    <section className="grid">
      <article className="card">
        <h3>Room Status</h3>
        <p className="muted">View your room details and allocation status.</p>
      </article>
      <article className="card">
        <h3>Fee & Payments</h3>
        <p className="muted">Track due fees and payment history.</p>
      </article>
      <article className="card">
        <h3>Mess Menu</h3>
        <p className="muted">Check daily and weekly meal schedule.</p>
      </article>
      <article className="card">
        <h3>Attendance</h3>
        <p className="muted">Monitor in/out hostel logs and notices.</p>
      </article>
    </section>
  );
}
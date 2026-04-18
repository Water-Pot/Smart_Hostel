import { FormEvent, useState } from "react";

export default function ComplaintsPage() {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  async function submitComplaint(e: FormEvent) {
    e.preventDefault();

    try {
      const res = await fetch("/api/complaints", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
        body: JSON.stringify({ subject, message }),
      });

      if (!res.ok) {
        alert("Failed to submit complaint");
        return;
      }

      alert("Complaint submitted successfully");
      setSubject("");
      setMessage("");
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  }

  return (
    <section className="card">
      <h2>Raise Complaint</h2>
      <p className="muted">Submit maintenance or hostel related complaints.</p>

      <form className="form" onSubmit={submitComplaint}>
        <label>Subject</label>
        <input
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Electricity issue, water issue..."
          required
        />

        <label>Message</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Describe your issue..."
          rows={5}
          required
        />

        <button className="solid-btn" type="submit">
          Submit
        </button>
      </form>
    </section>
  );
}
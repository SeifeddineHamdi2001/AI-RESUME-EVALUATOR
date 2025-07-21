import React from 'react';

export default function Contact() {
  return (
    <div className="contact-page">
      <h1>Contact Us</h1>
      <p>We'd love to hear from you! Fill out the form below or email us at <a href="mailto:support@skillsync.com">support@skillsync.com</a>.</p>
      <form className="contact-form" style={{ maxWidth: 400, margin: '20px auto' }}>
        <div style={{ marginBottom: 12 }}>
          <label htmlFor="name">Name</label>
          <input type="text" id="name" name="name" required style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }} />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label htmlFor="email">Email</label>
          <input type="email" id="email" name="email" required style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }} />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label htmlFor="message">Message</label>
          <textarea id="message" name="message" rows={4} required style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }} />
        </div>
        <button type="submit" style={{ background: '#00695c', color: '#fff', border: 'none', borderRadius: 4, padding: '10px 20px', fontWeight: 600, cursor: 'pointer' }}>Send Message</button>
      </form>
      <h2>Other Ways to Reach Us</h2>
      <ul>
        <li>Email: <a href="mailto:support@skillsync.com">support@skillsync.com</a></li>
        <li>Phone: +1 (555) 123-4567</li>
        <li>Address: 123 Main St, City, Country</li>
      </ul>
    </div>
  );
}
import React from 'react';

export default function Help() {
  return (
    <div className="help-page">
      <h1>Help Center</h1>
      <h2>Frequently Asked Questions</h2>
      <h3>How do I create an account?</h3>
      <p>Click the "Register" button on the homepage and fill in your details to create a new account.</p>
      <h3>How do I apply for a job?</h3>
      <p>Browse available jobs, select one that interests you, and click "Apply". You may need to upload your resume and fill out an application form.</p>
      <h3>How do I contact an employer?</h3>
      <p>Employers will contact you if your application is shortlisted. You can also use the messaging feature if available on the job post.</p>
      <h3>How do I reset my password?</h3>
      <p>Click "Login", then select "Forgot Password?" and follow the instructions to reset your password.</p>
      <h3>I'm a recruiter. How do I post a job?</h3>
      <p>Log in as a recruiter, go to your dashboard, and click "Post a Job". Fill in the job details and submit.</p>
      <h2>Need More Help?</h2>
      <p>Contact our support team at <a href="mailto:support@skillsync.com">support@skillsync.com</a>.</p>
    </div>
  );
}
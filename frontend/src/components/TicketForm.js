import React, { useState } from 'react';

const initialState = { title: '', description: '', priority: 'Low' };

const TicketForm = ({ onCreate }) => {
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState('');

  const validate = () => {
    const next = {};
    if (!form.title.trim()) next.title = 'Title is required.';
    if (!form.description.trim()) next.description = 'Description is required.';
    if (!['Low', 'Medium', 'High'].includes(form.priority)) next.priority = 'Priority is required.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback('');
    if (!validate()) return;

    setSubmitting(true);
    try {
      await onCreate(form);
      setForm(initialState);
      setFeedback('Ticket submitted successfully.');
    } catch (err) {
      setFeedback(err.response?.data?.message || 'Failed to submit ticket.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="ticket-form" onSubmit={handleSubmit} noValidate>
      <label htmlFor="title">Title</label>
      <input
        id="title"
        name="title"
        value={form.title}
        onChange={handleChange}
        placeholder="e.g. Laptop won't power on"
      />
      {errors.title && <span className="field-error">{errors.title}</span>}

      <label htmlFor="description">Description</label>
      <textarea
        id="description"
        name="description"
        rows={4}
        value={form.description}
        onChange={handleChange}
        placeholder="Describe the issue in as much detail as possible..."
      />
      {errors.description && <span className="field-error">{errors.description}</span>}

      <label htmlFor="priority">Priority</label>
      <select id="priority" name="priority" value={form.priority} onChange={handleChange}>
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </select>

      <button type="submit" className="primary-btn" disabled={submitting}>
        {submitting ? 'Submitting...' : 'Submit Ticket'}
      </button>

      {feedback && <div className="form-feedback">{feedback}</div>}
    </form>
  );
};

export default TicketForm;

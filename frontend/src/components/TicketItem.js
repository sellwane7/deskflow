import React, { useState } from 'react';

const STATUS_OPTIONS = ['Open', 'In Progress', 'Resolved'];

const priorityClass = (priority) => `priority-pill priority-${priority.toLowerCase()}`;
const statusClass = (status) => `status-pill status-${status.toLowerCase().replace(' ', '-')}`;
const railClass = (priority) => `ticket-rail rail-${priority.toLowerCase()}`;

const formatDate = (iso) =>
  new Date(iso).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });

const TicketItem = ({ ticket, isAdmin, onStatusChange }) => {
  const [updating, setUpdating] = useState(false);

  const handleChange = async (e) => {
    const nextStatus = e.target.value;
    setUpdating(true);
    try {
      await onStatusChange(ticket._id, nextStatus);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <li className="ticket-item">
      <span className={railClass(ticket.priority)} aria-hidden="true" />

      <div className="ticket-item-body">
        <div className="ticket-item-header">
          <div>
            <h3>{ticket.title}</h3>
            <span className="ticket-id">#{ticket._id.slice(-6).toUpperCase()}</span>
          </div>
          <span className={priorityClass(ticket.priority)}>{ticket.priority}</span>
        </div>

        <p className="ticket-description">{ticket.description}</p>

        <div className="ticket-meta">
          {isAdmin && <span className="ticket-owner">Submitted by {ticket.createdByName}</span>}
          <span className="ticket-date">{formatDate(ticket.createdAt)}</span>
        </div>

        <div className="ticket-footer">
          {isAdmin ? (
            <select
              className="status-select"
              value={ticket.status}
              onChange={handleChange}
              disabled={updating}
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          ) : (
            <span className={statusClass(ticket.status)}>
              {ticket.status === 'Open' && <span className="pulse-dot pulse-dot--inline" aria-hidden="true" />}
              {ticket.status}
            </span>
          )}
        </div>
      </div>
    </li>
  );
};

export default TicketItem;

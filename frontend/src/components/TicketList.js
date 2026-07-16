import React from 'react';
import TicketItem from './TicketItem';

const TicketList = ({ tickets, isAdmin, onStatusChange, loading, error }) => {
  if (loading) return <p className="empty-state">Loading tickets…</p>;
  if (error) return <p className="empty-state error-text">{error}</p>;
  if (!tickets.length) {
    return (
      <div className="empty-state">
        <p className="empty-state-title">Nothing here yet</p>
        <p>{isAdmin ? 'No tickets match this filter.' : 'Submit your first request using the form above.'}</p>
      </div>
    );
  }

  return (
    <ul className="ticket-list">
      {tickets.map((ticket) => (
        <TicketItem
          key={ticket._id}
          ticket={ticket}
          isAdmin={isAdmin}
          onStatusChange={onStatusChange}
        />
      ))}
    </ul>
  );
};

export default TicketList;

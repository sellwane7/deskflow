import React, { useCallback, useEffect, useState } from 'react';
import { getTickets, createTicket } from '../api/api';
import TicketForm from './TicketForm';
import TicketList from './TicketList';

const EmployeeDashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchTickets = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getTickets();
      setTickets(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load tickets.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const handleCreate = async (form) => {
    const res = await createTicket(form);
    setTickets((prev) => [res.data.data, ...prev]);
  };

  return (
    <div className="dashboard employee-dashboard">
      <section className="panel">
        <div className="panel-header-text">
          <h2>Submit a new ticket</h2>
          <p className="panel-subtitle">Give IT what they need to fix it fast.</p>
        </div>
        <TicketForm onCreate={handleCreate} />
      </section>

      <section className="panel">
        <div className="panel-header-text">
          <h2>My requests</h2>
          <p className="panel-subtitle">Everything you've submitted, and where it stands.</p>
        </div>
        <TicketList tickets={tickets} isAdmin={false} loading={loading} error={error} />
      </section>
    </div>
  );
};

export default EmployeeDashboard;

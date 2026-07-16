import React, { useCallback, useEffect, useState } from 'react';
import { getTickets, updateTicketStatus } from '../api/api';
import TicketList from './TicketList';

const FILTERS = ['All', 'Open', 'In Progress', 'Resolved'];

const AdminDashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('All');

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

  const handleStatusChange = async (id, status) => {
    const previous = tickets;
    setTickets((prev) => prev.map((t) => (t._id === id ? { ...t, status } : t)));
    try {
      await updateTicketStatus(id, status);
    } catch (err) {
      setTickets(previous); // revert on failure
      setError(err.response?.data?.message || 'Failed to update status.');
    }
  };

  const visibleTickets =
    filter === 'All' ? tickets : tickets.filter((t) => t.status === filter);

  return (
    <div className="dashboard admin-dashboard">
      <section className="panel">
        <div className="panel-header">
          <div className="panel-header-text">
            <h2>All company tickets</h2>
            <p className="panel-subtitle">{tickets.length} total &middot; triage and update status below.</p>
          </div>
          <div className="filter-bar">
            {FILTERS.map((f) => (
              <button
                key={f}
                className={filter === f ? 'filter-btn active' : 'filter-btn'}
                onClick={() => setFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
        <TicketList
          tickets={visibleTickets}
          isAdmin={true}
          onStatusChange={handleStatusChange}
          loading={loading}
          error={error}
        />
      </section>
    </div>
  );
};

export default AdminDashboard;

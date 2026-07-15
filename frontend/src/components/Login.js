import React, { useState } from 'react';
import { login as loginRequest } from '../api/api';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';

const DEMO_CREDENTIALS = {
  Employee: { email: 'employee@deskflow.com', password: 'password123' },
  Admin: { email: 'admin@deskflow.com', password: 'password123' },
};

const FEATURES = [
  { title: 'Submit in seconds', copy: 'Log an issue with a title, description, and priority — no ticket-desk jargon.' },
  { title: 'Track your status live', copy: 'Every request shows exactly where it stands: Open, In Progress, or Resolved.' },
  { title: 'Admins triage the full queue', copy: 'One feed of every request across the company, sortable by status.' },
];

const Login = () => {
  const { signIn } = useAuth();
  const [role, setRole] = useState('Employee');
  const [email, setEmail] = useState(DEMO_CREDENTIALS.Employee.email);
  const [password, setPassword] = useState(DEMO_CREDENTIALS.Employee.password);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRoleToggle = (nextRole) => {
    setRole(nextRole);
    setEmail(DEMO_CREDENTIALS[nextRole].email);
    setPassword(DEMO_CREDENTIALS[nextRole].password);
    setError('');
  };

  const fillDemo = (demoRole) => {
    handleRoleToggle(demoRole);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await loginRequest(email, password);
      const { user, token } = res.data;
      signIn(user, token);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-screen">
      <div className="auth-frame">
        {/* Brand / story panel */}
        <div className="auth-panel-left">
          <Logo theme="dark" size="lg" />

          <p className="auth-eyebrow">Internal IT Service Desk</p>
          <h1 className="auth-headline">
            From report to resolve,
            <br />
            tracked at every step.
          </h1>

          <ul className="auth-feature-list">
            {FEATURES.map((f) => (
              <li key={f.title} className="auth-feature">
                <span className="auth-feature-icon" aria-hidden="true">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M2.5 7.2L5.5 10.2L11.5 3.6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <div>
                  <p className="auth-feature-title">{f.title}</p>
                  <p className="auth-feature-copy">{f.copy}</p>
                </div>
              </li>
            ))}
          </ul>

          <div className="auth-status-line">
            <span className="pulse-dot" aria-hidden="true" />
            All systems operational
          </div>
        </div>

        {/* Form panel */}
        <div className="auth-panel-right">
          <div className="auth-card">
            <div className="auth-card-mobile-logo">
              <Logo theme="light" size="md" />
            </div>

            <h2 className="auth-card-title">Sign in</h2>
            <p className="auth-card-subtitle">Choose your role to continue.</p>

            <div className="role-toggle">
              <button
                type="button"
                className={role === 'Employee' ? 'toggle-btn active' : 'toggle-btn'}
                onClick={() => handleRoleToggle('Employee')}
              >
                Employee
              </button>
              <button
                type="button"
                className={role === 'Admin' ? 'toggle-btn active' : 'toggle-btn'}
                onClick={() => handleRoleToggle('Admin')}
              >
                Admin
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              {error && <div className="error-banner">{error}</div>}

              <button type="submit" className="primary-btn" disabled={loading}>
                {loading ? 'Signing in...' : `Sign in as ${role}`}
              </button>
            </form>

            <div className="demo-access">
              <p className="demo-access-label">Demo access</p>
              <button type="button" className="demo-chip" onClick={() => fillDemo('Employee')}>
                <span className="demo-chip-role">Employee</span>
                <code>employee@deskflow.com / password123</code>
              </button>
              <button type="button" className="demo-chip" onClick={() => fillDemo('Admin')}>
                <span className="demo-chip-role">Admin</span>
                <code>admin@deskflow.com / password123</code>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

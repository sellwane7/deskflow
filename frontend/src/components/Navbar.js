import React from 'react';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';

const Navbar = () => {
  const { user, signOut } = useAuth();

  return (
    <header className="navbar">
      <Logo theme="light" size="sm" />

      <div className="navbar-user">
        <div className="navbar-user-info">
          <span className="user-name">{user?.name}</span>
          <span className={`badge badge-${user?.role?.toLowerCase()}`}>{user?.role}</span>
        </div>
        <button className="link-btn" onClick={signOut}>
          Sign out
        </button>
      </div>
    </header>
  );
};

export default Navbar;

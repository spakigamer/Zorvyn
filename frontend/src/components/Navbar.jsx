import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LayoutDashboard, FileText, Users, LogOut, Wallet } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!user) return null;

    return (
        <nav className="navbar">
            <Link to="/" className="nav-logo flex items-center gap-2">
                <Wallet size={32} />
                <span>Zovryn</span>
            </Link>
            <div className="flex gap-4 items-center">
                <Link to="/" className="flex items-center gap-2" style={{ fontWeight: '600' }}>
                    <LayoutDashboard size={18} /> Dashboard
                </Link>
                <Link to="/records" className="flex items-center gap-2" style={{ fontWeight: '600' }}>
                    <FileText size={18} /> Records
                </Link>
                {user.role === 'admin' && (
                    <Link to="/users" className="flex items-center gap-2" style={{ fontWeight: '600' }}>
                        <Users size={18} /> Users
                    </Link>
                )}
                <div style={{ height: '24px', width: '1px', background: 'var(--border)', margin: '0 0.5rem' }}></div>
                <div className="flex items-center gap-4">
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-main)' }}>{user.name}</div>
                        <div className="badge" style={{ fontSize: '0.65rem', background: 'var(--bg-card)', color: 'var(--primary)', border: '1px solid var(--border)' }}>{user.role}</div>
                    </div>
                    <button onClick={handleLogout} className="btn-secondary" style={{ padding: '0.6rem', borderRadius: '50%' }}>
                        <LogOut size={18} />
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

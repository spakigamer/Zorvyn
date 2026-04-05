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
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: '800', fontSize: '1.25rem', color: 'var(--primary)' }}>
                <Wallet size={32} /> Zovryn Finance
            </Link>
            <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '500' }}>
                    <LayoutDashboard size={18} /> Dashboard
                </Link>
                <Link to="/records" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '500' }}>
                    <FileText size={18} /> Records
                </Link>
                {user.role === 'admin' && (
                    <Link to="/users" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '500' }}>
                        <Users size={18} /> Users
                    </Link>
                )}
                <div style={{ height: '24px', width: '1px', background: 'var(--border)' }}></div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.85rem', fontWeight: '600' }}>{user.name}</div>
                        <div className="badge" style={{ padding: '0 0.4rem', fontSize: '0.65rem' }}>{user.role}</div>
                    </div>
                    <button onClick={handleLogout} className="btn" style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', padding: '0.5rem' }}>
                        <LogOut size={20} />
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

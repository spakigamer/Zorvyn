import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { Shield, User, Trash2, Edit2, BadgeCheck } from 'lucide-react';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchUsers = async () => {
        try {
            const res = await api.get('/users');
            setUsers(res.data.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Delete user?')) return;
        try {
            await api.delete(`/users/${id}`);
            fetchUsers();
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <div className="container">Loading user ecosystem...</div>;

    return (
        <div className="container animate-fade-in">
            <header className="mb-4">
                <h1 style={{ fontSize: '2.5rem', fontWeight: '800', letterSpacing: '-1px', marginBottom: '0.5rem' }}>User Management</h1>
                <p style={{ color: 'var(--text-dim)', fontSize: '1.1rem' }}>Manage roles, permissions, and active members of the Zovryn ecosystem.</p>
            </header>

            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>IDENTIFIER</th>
                            <th>EMAIL ADDRESS</th>
                            <th>SECURED ROLE</th>
                            <th>SYSTEM STATUS</th>
                            <th style={{ textAlign: 'right' }}>ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(u => (
                            <tr key={u._id}>
                                <td>
                                    <div className="flex items-center gap-4">
                                        <div style={{ width: '45px', height: '45px', borderRadius: '14px', background: 'linear-gradient(135deg, var(--primary), var(--accent))', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)' }}>
                                            <User size={22} color="white" />
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: '700', fontSize: '1rem', color: 'var(--text-main)' }}>{u.name}</div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: {u._id.slice(-6).toUpperCase()}</div>
                                        </div>
                                    </div>
                                </td>
                                <td style={{ color: 'var(--text-dim)', fontSize: '0.95rem' }}>{u.email}</td>
                                <td>
                                    <div className="flex items-center gap-2" style={{ fontWeight: '700', color: u.role === 'admin' ? 'var(--primary)' : 'var(--text-dim)' }}>
                                        {u.role === 'admin' ? <Shield size={18} /> : <BadgeCheck size={18} />}
                                        <span style={{ fontSize: '0.8rem', letterSpacing: '0.05em' }}>{u.role.toUpperCase()}</span>
                                    </div>
                                </td>
                                <td>
                                    <span className="badge" style={{ 
                                        background: u.status === 'active' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', 
                                        color: u.status === 'active' ? 'var(--success)' : 'var(--danger)',
                                        border: `1px solid ${u.status === 'active' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`
                                    }}>
                                        {u.status || 'active'}
                                    </span>
                                </td>
                                <td style={{ textAlign: 'right' }}>
                                    <div className="flex gap-2" style={{ justifyContent: 'flex-end' }}>
                                        <button className="btn-secondary" style={{ padding: '0.5rem', borderRadius: '10px' }}>
                                            <Edit2 size={16} color="var(--primary)" />
                                        </button>
                                        <button onClick={() => handleDelete(u._id)} className="btn-secondary" style={{ padding: '0.5rem', borderRadius: '10px' }}>
                                            <Trash2 size={16} color="var(--danger)" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Users;

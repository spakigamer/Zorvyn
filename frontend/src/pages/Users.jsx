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
            <header style={{ marginBottom: '2.5rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: '800' }}>User Management</h1>
                <p style={{ color: 'var(--text-muted)' }}>Managing roles and monitoring active members of the Zovryn organization.</p>
            </header>

            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>IDENTIFIER</th>
                            <th>EMAIL</th>
                            <th>ROLE</th>
                            <th>STATUS</th>
                            <th>ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(u => (
                            <tr key={u._id}>
                                <td style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: '600' }}>
                                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--accent))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <User size={20} />
                                    </div>
                                    {u.name}
                                </td>
                                <td style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{u.email}</td>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '600', color: u.role === 'admin' ? 'var(--primary)' : 'var(--text-muted)' }}>
                                        {u.role === 'admin' ? <Shield size={16} /> : <BadgeCheck size={16} />}
                                        {u.role.toUpperCase()}
                                    </div>
                                </td>
                                <td><span className="badge" style={{ background: u.status === 'active' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', color: u.status === 'active' ? 'var(--success)' : 'var(--danger)' }}>{u.status}</span></td>
                                <td>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)', padding: '0.4rem', borderRadius: '4px' }}><Edit2 size={16} /></button>
                                        <button onClick={() => handleDelete(u._id)} style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', padding: '0.4rem', borderRadius: '4px' }}><Trash2 size={16} /></button>
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

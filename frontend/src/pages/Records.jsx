import React, { useState, useEffect, useContext } from 'react';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import { Plus, Search, Trash2, Edit2, Filter, ChevronLeft, ChevronRight, X } from 'lucide-react';

const Records = () => {
    const { user } = useContext(AuthContext);
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [users, setUsers] = useState([]);
    const [filters, setFilters] = useState({ 
        type: '', 
        category: '', 
        userId: '',
        startDate: '',
        endDate: ''
    });
    const [showModal, setShowModal] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);
    const [formData, setFormData] = useState({ amount: '', type: 'income', category: '', notes: '' });

    useEffect(() => {
        if (user.role === 'admin') {
            api.get('/users').then(res => setUsers(res.data.data)).catch(console.error);
        }
    }, [user.role]);

    const fetchRecords = async () => {
        setLoading(true);
        try {
            const params = {
                page,
                limit: 10,
                sort: '-date',
                ...(filters.type && { type: filters.type }),
                ...(filters.category && { category: filters.category }),
                ...(filters.userId && { createdBy: filters.userId })
            };

            // Timeline filtering
            if (filters.startDate) params['date[gte]'] = filters.startDate;
            if (filters.endDate) params['date[lte]'] = filters.endDate;

            const res = await api.get('/records', { params });
            setRecords(res.data.data);
            setTotal(res.data.total);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRecords();
    }, [page, filters]);

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            if (editingRecord) {
                await api.put(`/records/${editingRecord._id}`, formData);
            } else {
                await api.post('/records', formData);
            }
            setShowModal(false);
            setEditingRecord(null);
            setFormData({ amount: '', type: 'income', category: '', notes: '' });
            fetchRecords();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this record?')) return;
        try {
            await api.delete(`/records/${id}`);
            fetchRecords();
        } catch (err) {
            console.error(err);
        }
    };

    const isEditAllowed = user.role === 'admin' || user.role === 'analyst';

    return (
        <div className="container animate-fade-in">
            <header className="mb-4 flex justify-between items-center">
                <div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: '800', letterSpacing: '-1px', marginBottom: '0.5rem' }}>Financial Records</h1>
                    <p style={{ color: 'var(--text-dim)', fontSize: '1.1rem' }}>Track, audit, and manage every financial movement with precision.</p>
                </div>
                {isEditAllowed && (
                    <button className="btn-primary" onClick={() => { setShowModal(true); setEditingRecord(null); }}>
                        <Plus size={20} /> New Entry
                    </button>
                )}
            </header>

            <div className="glass-card mb-2" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                    <div className="flex items-center gap-2" style={{ flex: 1, position: 'relative' }}>
                        <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '1rem' }} />
                        <input type="text" placeholder="Search category..." 
                            style={{ paddingLeft: '3rem', background: 'rgba(15,23,42,0.5)', borderRadius: '10px' }} 
                            value={filters.category} onChange={(e) => setFilters({ ...filters, category: e.target.value })} />
                    </div>
                    <div className="flex items-center gap-2">
                        <Filter size={18} color="var(--text-muted)" />
                        <select style={{ background: 'rgba(15,23,42,0.5)', borderRadius: '10px', minWidth: '130px' }}
                                value={filters.type} onChange={(e) => setFilters({ ...filters, type: e.target.value })}>
                            <option value="">All Types</option>
                            <option value="income">Income</option>
                            <option value="expense">Expense</option>
                        </select>
                    </div>
                    {user.role === 'admin' && (
                        <select style={{ background: 'rgba(15,23,42,0.5)', borderRadius: '10px', minWidth: '150px' }}
                                value={filters.userId} onChange={(e) => setFilters({ ...filters, userId: e.target.value })}>
                            <option value="">All Users</option>
                            {users.map(u => (
                                <option key={u._id} value={u._id}>{u.name}</option>
                            ))}
                        </select>
                    )}
                </div>
                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
                    <div className="flex items-center gap-3">
                        <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)' }}>TIMELINE:</span>
                        <input type="date" style={{ width: '150px', fontSize: '0.8rem' }} value={filters.startDate} onChange={e => setFilters({...filters, startDate: e.target.value})} />
                        <span style={{ color: 'var(--text-muted)' }}>to</span>
                        <input type="date" style={{ width: '150px', fontSize: '0.8rem' }} value={filters.endDate} onChange={e => setFilters({...filters, endDate: e.target.value})} />
                    </div>
                    <button onClick={() => setFilters({ type: '', category: '', userId: '', startDate: '', endDate: '' })} 
                            style={{ fontSize: '0.8rem', background: 'rgba(255,255,255,0.05)', padding: '0.4rem 0.8rem', borderRadius: '8px' }}>
                        Clear Filters
                    </button>
                    <p style={{ marginLeft: 'auto', fontSize: '0.85rem', color: 'var(--text-dim)' }}>
                        Found <b>{total}</b> matching records
                    </p>
                </div>
            </div>

            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>DATE</th>
                            <th>CATEGORY</th>
                            <th>TYPE</th>
                            <th>AMOUNT</th>
                            <th>AUDITOR</th>
                            {isEditAllowed && <th style={{ textAlign: 'right' }}>ACTIONS</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {records.map(r => (
                            <tr key={r._id}>
                                <td style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>{new Date(r.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: '2-digit' })}</td>
                                <td style={{ fontWeight: '600' }}>{r.category}</td>
                                <td><span className={`badge badge-${r.type}`}>{r.type}</span></td>
                                <td style={{ fontWeight: '700', fontSize: '1rem', color: r.type === 'income' ? 'var(--success)' : 'var(--danger)' }}>
                                    {r.type === 'income' ? '+' : '-'} ${r.amount.toLocaleString()}
                                </td>
                                <td>
                                    <div className="flex items-center gap-2">
                                        <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', fontWeight: '800' }}>
                                            {(r.createdBy?.name || 'S')[0].toUpperCase()}
                                        </div>
                                        <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>{r.createdBy?.name || 'System'}</span>
                                    </div>
                                </td>
                                {isEditAllowed && (
                                    <td style={{ textAlign: 'right' }}>
                                        <div className="flex gap-2" style={{ justifyContent: 'flex-end' }}>
                                            <button onClick={() => { setEditingRecord(r); setFormData({ amount: r.amount, type: r.type, category: r.category, notes: r.notes || '' }); setShowModal(true); }}
                                                    className="btn-secondary" style={{ padding: '0.5rem', borderRadius: '10px' }}>
                                                <Edit2 size={16} color="var(--primary)" />
                                            </button>
                                            <button onClick={() => handleDelete(r._id)}
                                                    className="btn-secondary" style={{ padding: '0.5rem', borderRadius: '10px' }}>
                                                <Trash2 size={16} color="var(--danger)" />
                                            </button>
                                        </div>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <footer style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center' }}>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-dim)' }}>
                    Showing <b>{records.length}</b> of <b>{total}</b> movements
                </p>
                <div className="flex gap-2 items-center">
                    <button className="btn-secondary" style={{ padding: '0.5rem', borderRadius: '10px' }} disabled={page === 1} onClick={() => setPage(p => p - 1)}>
                        <ChevronLeft size={20} />
                    </button>
                    <div className="flex items-center justify-center" style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--primary-glow)', fontWeight: '800', color: 'var(--primary)', border: '1px solid var(--border)' }}>
                        {page}
                    </div>
                    <button className="btn-secondary" style={{ padding: '0.5rem', borderRadius: '10px' }} disabled={page * 10 >= total} onClick={() => setPage(p => p + 1)}>
                        <ChevronRight size={20} />
                    </button>
                </div>
                {/* Empty div to balance the grid for center alignment */}
                <div />
            </footer>

            {showModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(2, 6, 23, 0.9)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
                    <div className="glass-card animate-fade-in" style={{ width: '100%', maxWidth: '500px', position: 'relative', border: '1px solid var(--primary-glow)' }}>
                        <button onClick={() => setShowModal(false)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'rgba(255,255,255,0.05)', color: 'var(--text-dim)', padding: '0.4rem', borderRadius: '50%' }}><X size={18} /></button>
                        <h2 className="mb-2" style={{ fontSize: '1.75rem', fontWeight: '800' }}>{editingRecord ? 'Edit Record' : 'Create Record'}</h2>
                        <p className="mb-4" style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>Fill in the details below to log a new financial entry.</p>
                        
                        <form onSubmit={handleSave}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                <div className="mb-2">
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-muted)' }}>Amount ($)</label>
                                    <input type="number" value={formData.amount} onChange={e => setFormData({ ...formData, amount: e.target.value })} required placeholder="0.00" />
                                </div>
                                <div className="mb-2">
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-muted)' }}>Type</label>
                                    <select value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })}>
                                        <option value="income">Income</option>
                                        <option value="expense">Expense</option>
                                    </select>
                                </div>
                            </div>
                            <div className="mb-2">
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-muted)' }}>Category</label>
                                <input type="text" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} required placeholder="e.g. Salary, Rent, Food" />
                            </div>
                            <div className="mb-4">
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-muted)' }}>Additional Notes</label>
                                <textarea rows="3" value={formData.notes} onChange={e => setFormData({ ...formData, notes: e.target.value })} placeholder="Describe this transaction..." />
                            </div>
                            <button type="submit" className="btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1rem' }}>
                                {editingRecord ? 'Update Record' : 'Save Entry'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Records;

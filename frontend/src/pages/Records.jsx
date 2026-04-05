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
    const [filters, setFilters] = useState({ type: '', category: '' });
    const [showModal, setShowModal] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);
    const [formData, setFormData] = useState({ amount: '', type: 'income', category: '', notes: '' });

    const fetchRecords = async () => {
        setLoading(true);
        try {
            const queryParams = new URLSearchParams({
                page,
                limit: 10,
                ...(filters.type && { type: filters.type }),
                ...(filters.category && { category: filters.category })
            });
            const res = await api.get(`/records?${queryParams}`);
            setRecords(res.data.data);
            setTotal(res.data.count);
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
            <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: '800' }}>Financial Records</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Managing entries, filtering logs, and auditing your movements.</p>
                </div>
                {isEditAllowed && (
                    <button className="btn btn-primary" onClick={() => { setShowModal(true); setEditingRecord(null); }}>
                        <Plus size={20} /> New Entry
                    </button>
                )}
            </header>

            <div className="glass-card" style={{ padding: '1rem', marginBottom: '1.5rem', display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1 }}>
                    <Search size={18} color="var(--text-muted)" />
                    <input type="text" placeholder="Search category..." style={{ background: 'transparent', border: 'none', color: 'white', width: '100%', outline: 'none' }} 
                           value={filters.category} onChange={(e) => setFilters({ ...filters, category: e.target.value })} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Filter size={18} color="var(--text-muted)" />
                    <select style={{ background: '#0f172a', border: '1px solid var(--border)', padding: '0.4rem', color: 'white', borderRadius: '4px' }}
                            value={filters.type} onChange={(e) => setFilters({ ...filters, type: e.target.value })}>
                        <option value="">All Types</option>
                        <option value="income">Income</option>
                        <option value="expense">Expense</option>
                    </select>
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
                            <th>CREATED BY</th>
                            {isEditAllowed && <th>ACTIONS</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {records.map(r => (
                            <tr key={r._id}>
                                <td style={{ fontSize: '0.85rem' }}>{new Date(r.date).toLocaleDateString()}</td>
                                <td style={{ fontWeight: '600' }}>{r.category}</td>
                                <td><span className={`badge badge-${r.type}`}>{r.type}</span></td>
                                <td style={{ fontWeight: '700', color: r.type === 'income' ? 'var(--success)' : 'var(--danger)' }}>
                                    {r.type === 'income' ? '+' : '-'} ${r.amount.toLocaleString()}
                                </td>
                                <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{r.createdBy?.name || 'System'}</td>
                                {isEditAllowed && (
                                    <td>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button onClick={() => { setEditingRecord(r); setFormData({ amount: r.amount, type: r.type, category: r.category, notes: r.notes || '' }); setShowModal(true); }}
                                                    style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)', padding: '0.4rem', borderRadius: '4px' }}>
                                                <Edit2 size={16} />
                                            </button>
                                            <button onClick={() => handleDelete(r._id)}
                                                    style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', padding: '0.4rem', borderRadius: '4px' }}>
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <footer style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Showing {records.length} of {total} records</p>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn" style={{ background: 'var(--bg-card)', padding: '0.5rem' }} disabled={page === 1} onClick={() => setPage(p => p - 1)}><ChevronLeft size={20} /></button>
                    <button className="btn" style={{ background: 'var(--bg-card)', padding: '0.5rem' }} disabled={page * 10 >= total} onClick={() => setPage(p => p + 1)}><ChevronRight size={20} /></button>
                </div>
            </footer>

            {showModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div className="glass-card" style={{ width: '500px', position: 'relative' }}>
                        <button onClick={() => setShowModal(false)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'transparent', color: 'var(--text-muted)' }}><X /></button>
                        <h2 style={{ marginBottom: '1.5rem' }}>{editingRecord ? 'Edit Entry' : 'New Entry'}</h2>
                        <form onSubmit={handleSave}>
                            <div className="input-group">
                                <label>Amount ($)</label>
                                <input type="number" value={formData.amount} onChange={e => setFormData({ ...formData, amount: e.target.value })} required />
                            </div>
                            <div className="input-group">
                                <label>Type</label>
                                <select value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })}>
                                    <option value="income">Income</option>
                                    <option value="expense">Expense</option>
                                </select>
                            </div>
                            <div className="input-group">
                                <label>Category</label>
                                <input type="text" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} required />
                            </div>
                            <div className="input-group">
                                <label>Notes</label>
                                <textarea rows="3" value={formData.notes} onChange={e => setFormData({ ...formData, notes: e.target.value })} />
                            </div>
                            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>Save Record</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Records;

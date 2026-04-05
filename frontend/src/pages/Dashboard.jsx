import React, { useState, useEffect, useContext } from 'react';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import { 
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, BarChart, Bar, PieChart, Pie, Cell 
} from 'recharts';
import { TrendingUp, TrendingDown, Wallet, PieChart as PieIcon, BarChart2, Layers } from 'lucide-react';

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const [summary, setSummary] = useState(null);
    const [trends, setTrends] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState('');

    const COLORS = ['#8B5CF6', '#EC4899', '#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

    // Fetch users for admin selection
    useEffect(() => {
        if (user.role === 'admin') {
            api.get('/users').then(res => setUsers(res.data.data)).catch(console.error);
        }
    }, [user.role]);

    // Main data fetching logic - triggered by selectedUser change
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Use params for cleaner API calls
                const params = selectedUser ? { userId: selectedUser } : {};
                
                // Fetch summary
                const summaryRes = await api.get('/dashboard/summary', { params });
                setSummary(summaryRes.data.data);
                
                // Fetch trends
                try {
                    const trendsRes = await api.get('/dashboard/trends', { params });
                    const formattedTrends = trendsRes.data.data.reduce((acc, curr) => {
                        const monthYear = `${curr._id.month}/${curr._id.year}`;
                        let existing = acc.find(t => t.period === monthYear);
                        if (!existing) {
                            existing = { period: monthYear, income: 0, expense: 0 };
                            acc.push(existing);
                        }
                        if (curr._id.type === 'income') existing.income = curr.totalAmount;
                        if (curr._id.type === 'expense') existing.expense = curr.totalAmount;
                        return acc;
                    }, []);
                    setTrends(formattedTrends);
                } catch (e) {
                    console.error("Trends not available:", e.message);
                    setTrends([]);
                }

                // Fetch categories
                try {
                    const catRes = await api.get('/dashboard/categories', { params });
                    setCategories(catRes.data.data.map(item => ({
                        name: item._id.category,
                        value: item.totalAmount,
                        type: item._id.type
                    })));
                } catch (e) {
                    console.error("Categories fail:", e.message);
                    setCategories([]);
                }
            } catch (err) {
                console.error("Failed to fetch dashboard data:", err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [selectedUser]);

    if (loading) return <div>Loading...</div>;

    const data = summary || { totalIncome: 0, totalExpense: 0, balance: 0 };

    return (
        <div className="container animate-fade-in">
            <header className="mb-4 flex justify-between items-end">
                <div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: '800', letterSpacing: '-1px', marginBottom: '0.5rem' }}>Dashboard Overview</h1>
                    <p style={{ color: 'var(--text-dim)', fontSize: '1.1rem' }}>
                        {selectedUser 
                            ? `Showing analysis for ${users.find(u => u._id === selectedUser)?.name || 'User'}` 
                            : `Welcome back, ${user.name}! Global economic summary.`}
                    </p>
                </div>
                {user.role === 'admin' && (
                    <div style={{ minWidth: '200px' }}>
                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Filter By User</label>
                        <select 
                            value={selectedUser} 
                            onChange={(e) => setSelectedUser(e.target.value)}
                            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '0.6rem 1rem' }}
                        >
                            <option value="">All Users Data</option>
                            {users.map(u => (
                                <option key={u._id} value={u._id}>{u.name} ({u.role})</option>
                            ))}
                        </select>
                    </div>
                )}
            </header>

            <div className="grid stats-grid mb-4">
                <div className="stat-card" style={{ borderTop: '3px solid var(--success)' }}>
                    <div className="flex justify-between items-center">
                        <div>
                            <div className="label">Total Income</div>
                            <div className="value" style={{ color: 'var(--success)' }}>${data.totalIncome.toLocaleString()}</div>
                        </div>
                        <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '1rem', borderRadius: '50%' }}>
                            <TrendingUp color="var(--success)" size={24} />
                        </div>
                    </div>
                </div>
                <div className="stat-card" style={{ borderTop: '3px solid var(--danger)' }}>
                    <div className="flex justify-between items-center">
                        <div>
                            <div className="label">Total Expenses</div>
                            <div className="value" style={{ color: 'var(--danger)' }}>${data.totalExpense.toLocaleString()}</div>
                        </div>
                        <div style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '1rem', borderRadius: '50%' }}>
                            <TrendingDown color="var(--danger)" size={24} />
                        </div>
                    </div>
                </div>
                <div className="stat-card" style={{ borderTop: '3px solid var(--primary)' }}>
                    <div className="flex justify-between items-center">
                        <div>
                            <div className="label">Current Balance</div>
                            <div className="value">${data.balance.toLocaleString()}</div>
                        </div>
                        <div style={{ background: 'var(--primary-glow)', padding: '1rem', borderRadius: '50%' }}>
                            <Wallet color="var(--primary)" size={24} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
                <div className="glass-card" style={{ padding: '2rem', height: '450px' }}>
                    <h3 className="mb-2 flex items-center gap-2" style={{ fontSize: '1.25rem', fontWeight: '700' }}>
                        <TrendingUp size={22} color="var(--accent)" /> Growth Trends
                    </h3>
                    <div style={{ height: '320px', marginTop: '1rem' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={trends}>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                                <XAxis dataKey="period" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} tick={{dy: 10}} />
                                <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip 
                                    contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', boxShadow: 'var(--shadow-lg)' }}
                                    itemStyle={{ fontWeight: '600' }}
                                />
                                <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ paddingBottom: '20px' }} />
                                <Line type="monotone" dataKey="income" stroke="var(--success)" strokeWidth={4} dot={{ r: 4, fill: 'var(--success)' }} activeDot={{ r: 8 }} />
                                <Line type="monotone" dataKey="expense" stroke="var(--danger)" strokeWidth={4} dot={{ r: 4, fill: 'var(--danger)' }} activeDot={{ r: 8 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
                <div className="glass-card" style={{ padding: '2rem', height: '450px' }}>
                    <h3 className="mb-2 flex items-center gap-2" style={{ fontSize: '1.25rem', fontWeight: '700' }}>
                        <PieIcon size={22} color="var(--accent)" /> Category Allocation
                    </h3>
                    <div style={{ height: '320px', marginTop: '1rem' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={categories}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={80}
                                    outerRadius={120}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {categories.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip 
                                    contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px' }}
                                />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="glass-card" style={{ padding: '2rem', height: '450px' }}>
                    <h3 className="mb-2 flex items-center gap-2" style={{ fontSize: '1.25rem', fontWeight: '700' }}>
                        <Layers size={22} color="var(--primary)" /> Expenditure Breakdown
                    </h3>
                    <div style={{ height: '320px', marginTop: '1rem' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={categories.filter(c => c.type === 'expense')}>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                                <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip 
                                    contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px' }}
                                    cursor={{fill: 'rgba(255,255,255,0.05)'}}
                                />
                                <Bar dataKey="value" fill="var(--danger)" radius={[6, 6, 0, 0]} barSize={30} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

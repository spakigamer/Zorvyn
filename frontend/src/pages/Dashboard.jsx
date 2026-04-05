import React, { useState, useEffect, useContext } from 'react';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import { 
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, BarChart, Bar 
} from 'recharts';
import { TrendingUp, TrendingDown, Wallet, PieChart, BarChart2 } from 'lucide-react';

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const [summary, setSummary] = useState(null);
    const [trends, setTrends] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [summaryRes, trendsRes] = await Promise.all([
                    api.get('/dashboard/summary'),
                    api.get('/dashboard/trends')
                ]);
                setSummary(summaryRes.data.data);
                
                // Format trends data for Recharts
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
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div>Loading...</div>;

    const data = summary || { totalIncome: 0, totalExpense: 0, balance: 0 };

    return (
        <div className="container animate-fade-in">
            <header style={{ marginBottom: '2.5rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: '800' }}>Dashboard Overview</h1>
                <p style={{ color: 'var(--text-muted)' }}>Welcome back, {user.name}! Here's what's happening with your finances.</p>
            </header>

            <div className="grid stats-grid" style={{ marginBottom: '3rem' }}>
                <div className="stat-card" style={{ borderLeft: '4px solid var(--success)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <div className="label">Total Income</div>
                            <div className="value" style={{ color: 'var(--success)' }}>${data.totalIncome.toLocaleString()}</div>
                        </div>
                        <TrendingUp color="var(--success)" size={32} style={{ opacity: 0.5 }} />
                    </div>
                </div>
                <div className="stat-card" style={{ borderLeft: '4px solid var(--danger)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <div className="label">Total Expenses</div>
                            <div className="value" style={{ color: 'var(--danger)' }}>${data.totalExpense.toLocaleString()}</div>
                        </div>
                        <TrendingDown color="var(--danger)" size={32} style={{ opacity: 0.5 }} />
                    </div>
                </div>
                <div className="stat-card" style={{ borderLeft: '4px solid var(--primary)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <div className="label">Current Balance</div>
                            <div className="value">${data.balance.toLocaleString()}</div>
                        </div>
                        <Wallet color="var(--primary)" size={32} style={{ opacity: 0.5 }} />
                    </div>
                </div>
            </div>

            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
                <div className="glass-card" style={{ padding: '1.5rem', height: '400px' }}>
                    <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <PieChart size={20} color="var(--accent)" /> Growth Trends
                    </h3>
                    <ResponsiveContainer width="100%" height="85%">
                        <LineChart data={trends}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                            <XAxis dataKey="period" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }} />
                            <Legend verticalAlign="top" align="right" height={36} />
                            <Line type="monotone" dataKey="income" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                            <Line type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                <div className="glass-card" style={{ padding: '1.5rem', height: '400px' }}>
                    <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <BarChart2 size={20} color="var(--primary)" /> Monthly Split
                    </h3>
                    <ResponsiveContainer width="100%" height="85%">
                        <BarChart data={trends}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                            <XAxis dataKey="period" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }} />
                            <Bar dataKey="income" fill="var(--success)" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="expense" fill="var(--danger)" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

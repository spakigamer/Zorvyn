import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Records from './pages/Records';
import Users from './pages/Users';
import Login from './pages/Login';
import Register from './pages/Register';

const PrivateRoute = ({ children, roles }) => {
    const { user, loading } = useContext(AuthContext);
    
    if (loading) return <div>Auth in progress...</div>;
    if (!user) return <Navigate to="/login" />;
    if (roles && !roles.includes(user.role)) return <Navigate to="/" />;
    
    return children;
};

function App() {
    return (
        <AuthProvider>
            <Router>
                <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
                    <Navbar />
                    <main style={{ flex: 1 }}>
                        <Routes>
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            
                            <Route path="/" element={
                                <PrivateRoute>
                                    <Dashboard />
                                </PrivateRoute>
                            } />
                            
                            <Route path="/records" element={
                                <PrivateRoute>
                                    <Records />
                                </PrivateRoute>
                            } />
                            
                            <Route path="/users" element={
                                <PrivateRoute roles={['admin']}>
                                    <Users />
                                </PrivateRoute>
                            } />

                            <Route path="*" element={<Navigate to="/" />} />
                        </Routes>
                    </main>
                    <footer style={{ padding: '2rem', textAlign: 'center', borderTop: '1px solid var(--border)', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        &copy; 2026 Zovryn Finance System. All rights reserved.
                    </footer>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;

import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import LogWorkout from './pages/LogWorkout';

function App() {
    const { user, loading } = useAuth();

    if (loading) {
        return <div style={{ padding: '2rem' }}>Loading...</div>;
    }

    return (
        <Routes>
            <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
            <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
            <Route path="/" element={user ? <Dashboard /> : <Navigate to="/login" />} />
            <Route path="/workouts/new" element={user ? <LogWorkout /> : <Navigate to="/login" />}></Route>
        </Routes>
    );
}

export default App;
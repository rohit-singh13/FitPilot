import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Plans from './pages/Plans';
import Shop from './pages/Shop';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import LogWorkout from './pages/LogWorkout';
import Exercises from './pages/Exercises';

function App() {
    const { user, loading } = useAuth();

    if (loading) {
        return <div style={{ padding: '2rem' }}>Loading...</div>;
    }

    return (
        <Routes>
            {/* accessible to everyone */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/plans" element={<Plans />} />
            <Route path="/shop" element={<Shop />} />

            {/* Redirects to dashboard if already logged in */}
            <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
            <Route path="/register" element={!user ? <Register /> : <Navigate to="/dashboard" />} />

            {/* Protected app pages */}
            <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
            <Route path="/workouts/new" element={user ? <LogWorkout /> : <Navigate to="/login" />} />
            <Route path="/exercises" element={user ? <Exercises /> : <Navigate to="/login" />} />
        </Routes>
    );
}

export default App;
import { useAuth } from '../context/AuthContext';

function Dashboard() {
    const { user, logout } = useAuth();
    return (
        <div style={{ padding: '2rem' }}>
            <h1>Welcome, {user?.fullName}</h1>
            <button onClick={logout}>Logout</button>
        </div>
    );
}

export default Dashboard;
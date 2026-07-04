import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
    const { user, logout } = useAuth();

    return (
        <nav style={styles.nav}>
            <Link to="/" style={styles.brand}>FitPilot</Link>
            <div style={styles.links}>
                <Link to="/" style={styles.link}>Dashboard</Link>
                <Link to="/workouts/new" style={styles.link}>Log Workout</Link>
                <Link to="/exercises" style={styles.link}>Exercises</Link>
                <span style={styles.userName}>{user?.fullName}</span>
                <button onClick={logout} style={styles.logoutBtn}>Logout</button>
            </div>
        </nav>
    );
}

const styles = {
    nav: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem 2rem',
        background: '#1e293b',
        color: '#fff'
    },
    brand: { color: '#fff', fontWeight: 'bold', fontSize: '1.2rem', textDecoration: 'none'},
    links: { display: 'flex', alignItems: 'center', gap: '1.2rem'},
    link: { color: '#cbd5e1', textDecoration: 'none', fontSize: '0.95rem'},
    userName: { color: '#94a3b8', fontSize: '0.85rem'},
    logoutBtn: {
        background: '#ef4444',
        color: '#fff',
        border: 'none',
        padding: '0.4rem 0.8rem',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '0.85rem'
    },
};

export default Navbar;
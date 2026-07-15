import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme';

function Navbar() {
    const { user, logout } = useAuth();

    return (
        <nav style={styles.nav}>
            <Link to="/dashboard" style={styles.brand}> FitPilot</Link>
            <div style={styles.links}>
                <Link to="/dashboard" style={styles.link}>Dashboard</Link>
                <Link to="/workouts/new" style={styles.link}>Log Workout</Link>
                <Link to="/exercises" style={styles.link}>Exercises</Link>
            </div>
            <div style={styles.right}>
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
        background: colors.surface,
        borderBottom: `1px solid ${colors.border}`,
    },
    brand: { color: colors.text, fontWeight: 600, fontSize: '2rem', textDecoration: 'none' },
    links: { display: 'flex', alignItems: 'center', gap: '2rem' },
    link: { color: '#ffffff', textDecoration: 'none', fontSize: '1rem' },
    right: { display: 'flex', alignItems: 'center', gap: '1.5rem' },
    userName: { color: '#a3e635', fontSize: '1rem' },
    logoutBtn: {
        background: 'transparent',
        color: '#fca5a5',
        border: '1px solid rgba(239, 68, 68, 0.4)',
        padding: '0.4rem 0.9rem',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '1rem',
    },
};

export default Navbar;
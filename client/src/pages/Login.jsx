import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { colors, btnPrimary } from '../theme';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSubmitting(true);
        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div style={styles.page}>
            <form onSubmit={handleSubmit} style={styles.form}>
                <Link to="/" style={styles.brand}>⚡ FitPilot</Link>
                <p style={styles.subtitle}>Log in to your account</p>

                {error && <div style={styles.error}>{error}</div>}

                <label style={styles.label}>Email</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={styles.input}
                />

                <label style={styles.label}>Password</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={styles.input}
                />

                <button type="submit" disabled={submitting} style={{ ...btnPrimary, width: '100%', border: 'none', cursor: 'pointer', marginTop: '1.5rem' }}>
                    {submitting ? 'Logging in...' : 'Log In'}
                </button>

                <p style={styles.footerText}>
                    Don't have an account? <Link to="/register" style={{ color: colors.accent }}>Register</Link>
                </p>
            </form>
        </div>
    );
}

const styles = {
    page: {
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        minHeight: '100vh', background: colors.bg,
    },
    form: {
        background: colors.surface, padding: '2.5rem', borderRadius: '10px',
        width: '340px', border: `1px solid ${colors.border}`,
    },
    brand: { color: colors.text, fontWeight: 600, fontSize: '1.3rem', textDecoration: 'none' },
    subtitle: { color: colors.textMuted, marginBottom: '1.5rem', fontSize: '0.9rem' },
    label: { display: 'block', color: colors.textMuted, marginTop: '1rem', marginBottom: '0.3rem', fontSize: '0.85rem' },
    input: {
        width: '100%', padding: '0.6rem', borderRadius: '6px',
        border: `1px solid ${colors.border}`, background: '#0d1117', color: colors.text,
        boxSizing: 'border-box', fontFamily: 'inherit',
    },
    error: {
        background: 'rgba(239, 68, 68, 0.15)', color: '#fca5a5', padding: '0.6rem',
        borderRadius: '6px', fontSize: '0.85rem', marginBottom: '0.5rem',
    },
    footerText: { marginTop: '1.2rem', fontSize: '0.85rem', textAlign: 'center', color: colors.textMuted },
};

export default Login;
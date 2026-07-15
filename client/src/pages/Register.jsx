import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Register() {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSubmitting(true);
        try {
            await register(fullName, email, password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div style={styles.container}>
            <form onSubmit={handleSubmit} style={styles.form}>
                <h1 style={styles.title}>FitPilot</h1>
                <p style={styles.subtitle}>Create your account</p>

                {error && <div style={styles.error}>{error}</div>}

                <label style={styles.label}>Full Name</label>
                <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    style={styles.input}
                />

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
                    minLength={6}
                    style={styles.input}
                />

                <button type="submit" disabled={submitting} style={styles.button}>
                    {submitting ? 'Creating account...' : 'Register'}
                </button>

                <p style={styles.footerText}>
                    Already have an account? <Link to="/login">Log in</Link>
                </p>
            </form>
        </div>
    );
}

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: '#f4f4f4',
    },
    form: {
        background: '#fff',
        padding: '2.5rem',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        width: '320px',
    },
    title: { margin: 0, fontSize: '1.8rem' },
    subtitle: { color: '#666', marginBottom: '1.5rem' },
    label: { display: 'block', marginTop: '1rem', marginBottom: '0.3rem', fontSize: '0.9rem' },
    input: {
        width: '100%',
        padding: '0.6rem',
        borderRadius: '4px',
        border: '1px solid #ccc',
        boxSizing: 'border-box',
    },
    button: {
        width: '100%',
        marginTop: '1.5rem',
        padding: '0.7rem',
        background: '#2563eb',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '1rem',
    },
    error: {
        background: '#fee2e2',
        color: '#b91c1c',
        padding: '0.6rem',
        borderRadius: '4px',
        fontSize: '0.85rem',
        marginBottom: '0.5rem',
    },
    footerText: { marginTop: '1.2rem', fontSize: '0.85rem', textAlign: 'center' },
};

export default Register;
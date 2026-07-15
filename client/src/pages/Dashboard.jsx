import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import aiApi from '../api/aiClient';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { colors, btnPrimary } from '../theme';
import ReactMarkdown from 'react-markdown';

function Dashboard() {
    const { user } = useAuth();
    const [workouts, setWorkouts] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [advice, setAdvice] = useState('');
    const [coachError, setCoachError] = useState('');
    const [coachLoading, setCoachLoading] = useState(false);

    useEffect(() => {
        Promise.all([
            api.get('/workouts'),
            api.get('/stats/summary'),
        ])
            .then(([workoutsRes, statsRes]) => {
                setWorkouts(workoutsRes.data);
                setStats(statsRes.data);
            })
            .catch(() => setError('Failed to load dashboard data'))
            .finally(() => setLoading(false));
    }, []);

    const handleGetCoaching = async () => {
        setCoachError('');
        setAdvice('');
        setCoachLoading(true);
        try {
            const recentWorkouts = workouts.slice(0, 5).map((w) => ({
                name: w.name,
                workoutDate: new Date(w.workoutDate).toISOString().split('T')[0],
                sets: w.sets.map((s) => ({
                    exerciseName: s.exercise?.name || 'Unknown',
                    reps: s.reps,
                    weightKg: s.weightKg,
                })),
            }));

            const res = await aiApi.post('/coach/analyze', {
                userName: user?.fullName || 'there',
                fitnessGoal: user?.fitnessGoal || 'general_fitness',
                recentWorkouts,
            });

            setAdvice(res.data.advice);
        } catch (err) {
            setCoachError(
                err.response?.data?.detail || 'Failed to get coaching tips. Is the AI service running?'
            );
        } finally {
            setCoachLoading(false);
        }
    };

    return (
        <div style={{ background: colors.bg, minHeight: '100vh' }}>
            <Navbar />
            <div style={styles.container}>
                <div style={styles.header}>
                    <h1 style={styles.h1}>Your Workouts</h1>
                    <Link to="/workouts/new" style={btnPrimary}>+ Log Workout</Link>
                </div>

                {loading && <p style={{ color: colors.textMuted }}>Loading...</p>}
                {error && <p style={{ color: '#fca5a5' }}>{error}</p>}

                {stats && (
                    <div style={styles.statsRow}>
                        <div style={styles.statCard}>
                            <div style={styles.statValue}>{stats.totalWorkouts}</div>
                            <div style={styles.statLabel}>Workouts logged</div>
                        </div>
                        <div style={styles.statCard}>
                            <div style={styles.statValue}>{stats.totalSets}</div>
                            <div style={styles.statLabel}>Total sets</div>
                        </div>
                        <div style={styles.statCard}>
                            <div style={styles.statValue}>{stats.totalVolumeKg.toLocaleString()} kg</div>
                            <div style={styles.statLabel}>Total volume lifted</div>
                        </div>
                    </div>
                )}

                <div style={styles.coachBox}>
                    <div style={styles.coachHeader}>
                        <h3 style={styles.coachTitle}>✨ AI Coach</h3>
                        <button
                            onClick={handleGetCoaching}
                            disabled={coachLoading || workouts.length === 0}
                            style={{ ...btnPrimary, border: 'none', cursor: 'pointer', opacity: (coachLoading || workouts.length === 0) ? 0.5 : 1 }}
                        >
                            {coachLoading ? 'Thinking...' : 'Get Coaching Tips'}
                        </button>
                    </div>

                    {workouts.length === 0 && (
                        <p style={styles.coachHint}>Log a workout first to get personalized tips.</p>
                    )}
                    {coachError && <p style={{ color: '#fca5a5', fontSize: '0.9rem' }}>{coachError}</p>}
                    {advice && (
                        <div style={styles.adviceText}>
                            <ReactMarkdown>{advice}</ReactMarkdown>
                        </div>
                    )}
                </div>

                {!loading && workouts.length === 0 && (
                    <p style={styles.empty}>No workouts logged yet. Start by logging your first one.</p>
                )}

                <div style={styles.list}>
                    {workouts.map((w) => (
                        <div key={w._id} style={styles.card}>
                            <div style={styles.cardHeader}>
                                <h3 style={styles.cardTitle}>{w.name}</h3>
                                <span style={styles.date}>
                                    {new Date(w.workoutDate).toLocaleDateString()}
                                </span>
                            </div>
                            <p style={styles.setCount}>{w.sets.length} set{w.sets.length !== 1 ? 's' : ''}</p>
                            {w.sets.map((s) => (
                                <div key={s._id} style={styles.setRow}>
                                    {s.exercise?.name || 'Unknown exercise'} — {s.reps} reps @ {s.weightKg}kg
                                </div>
                            ))}
                            {w.notes && <p style={styles.notes}>{w.notes}</p>}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

const styles = {
    container: { maxWidth: '700px', margin: '0 auto', padding: '2rem' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    h1: { color: colors.text, fontSize: '1.8rem', fontWeight: 600, margin: 0 },
    statsRow: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '1rem',
        margin: '1.5rem 0',
    },
    statCard: {
        background: colors.surface,
        border: `1px solid ${colors.border}`,
        borderRadius: '8px',
        padding: '1rem',
        textAlign: 'center',
    },
    statValue: { fontSize: '1.6rem', fontWeight: 600, color: colors.accent },
    statLabel: { fontSize: '0.8rem', color: colors.textFaint, marginTop: '0.2rem' },
    coachBox: {
        background: colors.surface,
        border: `1px solid ${colors.border}`,
        borderRadius: '8px',
        padding: '1.2rem',
        marginBottom: '1.5rem',
    },
    coachHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    coachTitle: { color: colors.text, margin: 0, fontSize: '1.05rem', fontWeight: 600 },
    coachHint: { color: colors.textFaint, fontSize: '0.85rem', marginTop: '0.5rem' },
    adviceText: {
        marginTop: '1rem',
        whiteSpace: 'pre-wrap',
        fontSize: '0.95rem',
        lineHeight: '1.5',
        color: '#ffffff',
    },
    empty: { color: colors.textMuted, marginTop: '2rem' },
    list: { marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' },
    card: {
        border: `1px solid ${colors.border}`,
        borderRadius: '8px',
        padding: '1rem 1.2rem',
        background: colors.surface,
    },
    cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    cardTitle: { color: colors.text, margin: 0, fontSize: '1.05rem', fontWeight: 600 },
    date: { color: colors.textFaint, fontSize: '0.85rem' },
    setCount: { color: colors.textMuted, fontSize: '0.85rem', margin: '0.3rem 0' },
    setRow: { fontSize: '0.9rem', padding: '0.2rem 0', color: colors.text },
    notes: { marginTop: '0.5rem', fontSize: '0.85rem', color: colors.textFaint, fontStyle: 'italic' },
};

export default Dashboard;
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
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [advice, setAdvice] = useState('');
    const [coachError, setCoachError] = useState('');
    const [coachLoading, setCoachLoading] = useState(false);

    useEffect(() => {
        api.get('/workouts')
            .then((res) => setWorkouts(res.data))
            .catch(() => setError('Failed to load dashboard data'))
            .finally(() => setLoading(false));
    }, []);

    const isToday = (dateStr) =>
        new Date(dateStr).toDateString() === new Date().toDateString();

    const todayWorkouts = workouts.filter((w) => isToday(w.workoutDate));

    const todayStats = todayWorkouts.reduce(
        (acc, w) => {
            acc.totalSets += w.sets.length;
            acc.totalVolumeKg += w.sets.reduce((sum, s) => sum + s.reps * s.weightKg, 0);
            return acc;
        },
        { totalSets: 0, totalVolumeKg: 0 }
    );

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
                    <h1 style={styles.h1}>Today's Workouts</h1>
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <Link to="/workouts/history" style={styles.secondaryBtn}>View History</Link>
                        <Link to="/workouts/new" style={btnPrimary}>+ Log Workout</Link>
                    </div>
                </div>

                {loading && <p style={{ color: colors.textMuted }}>Loading...</p>}
                {error && <p style={{ color: '#fca5a5' }}>{error}</p>}

                {!loading && !error && (
                    <div style={styles.statsRow}>
                        <div style={styles.statCard}>
                            <div style={styles.statValue}>{todayWorkouts.length}</div>
                            <div style={styles.statLabel}>Workouts today</div>
                        </div>
                        <div style={styles.statCard}>
                            <div style={styles.statValue}>{todayStats.totalSets}</div>
                            <div style={styles.statLabel}>Sets today</div>
                        </div>
                        <div style={styles.statCard}>
                            <div style={styles.statValue}>{todayStats.totalVolumeKg.toLocaleString()} kg</div>
                            <div style={styles.statLabel}>Volume today</div>
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

                {!loading && todayWorkouts.length === 0 && (
                    <div style={styles.empty}>
                        <p style={{ margin: 0, marginBottom: '1rem' }}>No workouts logged today.</p>
                        <Link to="/workouts/new" style={btnPrimary}>+ Log Workout</Link>
                    </div>
                )}

                <div style={styles.list}>
                    {todayWorkouts.map((w) => (
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
    secondaryBtn: {
        color: colors.text,
        textDecoration: 'none',
        border: `1px solid ${colors.border}`,
        borderRadius: '6px',
        padding: '0.5rem 1rem',
        fontSize: '0.95rem',
        display: 'flex',
        alignItems: 'center',
    },
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
    empty: {
        color: colors.textMuted,
        marginTop: '1rem',
        marginBottom: '1.5rem',
        textAlign: 'center',
        border: `1px dashed ${colors.border}`,
        borderRadius: '8px',
        padding: '2rem 1rem',
    },
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
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import aiApi from '../api/aiClient';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

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
        <div>
            <Navbar />
            <div style={styles.container}>
                <div style={styles.header}>
                    <h1>Your Workouts</h1>
                    <Link to="/workouts/new" style={styles.newBtn}>+ Log Workout</Link>
                </div>

                {loading && <p>Loading...</p>}
                {error && <p style={{ color: 'red' }}>{error}</p>}

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
                        <h3 style={{ margin: 0 }}>AI Coach</h3>
                        <button
                            onClick={handleGetCoaching}
                            disabled={coachLoading || workouts.length === 0}
                            style={styles.coachBtn}
                        >
                            {coachLoading ? 'Thinking...' : 'Get Coaching Tips'}
                        </button>
                    </div>

                    {workouts.length === 0 && (
                        <p style={styles.coachHint}>Log a workout first to get personalized tips.</p>
                    )}
                    {coachError && <p style={{ color: 'red', fontSize: '0.9rem' }}>{coachError}</p>}
                    {advice && <div style={styles.adviceText}>{advice}</div>}
                </div>

                {!loading && workouts.length === 0 && (
                    <p style={styles.empty}>No workouts logged yet. Start by logging your first one.</p>
                )}

                <div style={styles.list}>
                    {workouts.map((w) => (
                        <div key={w._id} style={styles.card}>
                            <div style={styles.cardHeader}>
                                <h3 style={{ margin: 0 }}>{w.name}</h3>
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
    newBtn: {
        background: '#2563eb',
        color: '#fff',
        padding: '0.5rem 1rem',
        borderRadius: '4px',
        textDecoration: 'none',
        fontSize: '0.9rem',
    },
    statsRow: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '1rem',
        margin: '1.5rem 0',
    },
    statCard: {
        background: '#fff',
        border: '1px solid #e2e8f0',
        borderRadius: '8px',
        padding: '1rem',
        textAlign: 'center',
    },
    statValue: { fontSize: '1.6rem', fontWeight: 'bold', color: '#2563eb' },
    statLabel: { fontSize: '0.8rem', color: '#666', marginTop: '0.2rem' },
    coachBox: {
        background: '#f0f9ff',
        border: '1px solid #bae6fd',
        borderRadius: '8px',
        padding: '1.2rem',
        marginBottom: '1.5rem',
    },
    coachHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    coachBtn: {
        background: '#0ea5e9',
        color: '#fff',
        border: 'none',
        padding: '0.5rem 1rem',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '0.9rem',
    },
    coachHint: { color: '#666', fontSize: '0.85rem', marginTop: '0.5rem' },
    adviceText: {
        marginTop: '1rem',
        whiteSpace: 'pre-wrap',
        fontSize: '0.95rem',
        lineHeight: '1.5',
        color: '#0c4a6e',
    },
    empty: { color: '#666', marginTop: '2rem' },
    list: { marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' },
    card: {
        border: '1px solid #e2e8f0',
        borderRadius: '8px',
        padding: '1rem 1.2rem',
        background: '#fff',
    },
    cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    date: { color: '#888', fontSize: '0.85rem' },
    setCount: { color: '#555', fontSize: '0.85rem', margin: '0.3rem 0' },
    setRow: { fontSize: '0.9rem', padding: '0.2rem 0', color: '#333' },
    notes: { marginTop: '0.5rem', fontSize: '0.85rem', color: '#666', fontStyle: 'italic' },
};

export default Dashboard;
import { useState, useEffect } from 'react';
import api from '../api/client';
import Navbar from '../components/Navbar';
import { colors } from '../theme';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts';

function History() {
    const [workouts, setWorkouts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [openDates, setOpenDates] = useState({});

    useEffect(() => {
        api.get('/workouts')
            .then((res) => setWorkouts(res.data))
            .catch(() => setError('Failed to load workout history'))
            .finally(() => setLoading(false));
    }, []);

    // Group workouts by day (YYYY-MM-DD), newest first
    const groups = {};
    workouts.forEach((w) => {
        const key = new Date(w.workoutDate).toISOString().split('T')[0];
        if (!groups[key]) groups[key] = [];
        groups[key].push(w);
    });
    const sortedDates = Object.keys(groups).sort((a, b) => new Date(b) - new Date(a));

    const toggleDate = (date) => {
        setOpenDates((prev) => ({ ...prev, [date]: !prev[date] }));
    };

    const muscleRadarData = (dateWorkouts) => {
        const counts = {};
        dateWorkouts.forEach((w) => {
            w.sets.forEach((s) => {
                const group = s.exercise?.muscleGroup || 'unknown';
                counts[group] = (counts[group] || 0) + 1;
            });
        });
        return Object.entries(counts).map(([muscleGroup, sets]) => ({ muscleGroup, sets }));
    };

    return (
        <div style={{ background: colors.bg, minHeight: '100vh' }}>
            <Navbar />
            <div style={styles.container}>
                <h1 style={styles.h1}>Workout History</h1>

                {loading && <p style={{ color: colors.textMuted }}>Loading...</p>}
                {error && <p style={{ color: '#fca5a5' }}>{error}</p>}
                {!loading && sortedDates.length === 0 && (
                    <p style={{ color: colors.textMuted }}>No workouts logged yet.</p>
                )}

                <div style={styles.dateList}>
                    {sortedDates.map((date) => {
                        const dateWorkouts = groups[date];
                        const isOpen = !!openDates[date];
                        const radarData = muscleRadarData(dateWorkouts);
                        const totalSets = dateWorkouts.reduce((sum, w) => sum + w.sets.length, 0);

                        return (
                            <div key={date} style={styles.dateCard}>
                                <button style={styles.dateHeader} onClick={() => toggleDate(date)}>
                                    <span style={styles.dateTitle}>
                                        {new Date(date).toLocaleDateString(undefined, {
                                            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
                                        })}
                                    </span>
                                    <span style={styles.dateMeta}>
                                        {dateWorkouts.length} workout{dateWorkouts.length !== 1 ? 's' : ''} · {totalSets} sets · {isOpen ? '▲' : '▼'}
                                    </span>
                                </button>

                                {isOpen && (
                                    <div style={styles.dateBody}>
                                        {radarData.length > 0 && (
                                            <div style={styles.radarWrap}>
                                                <ResponsiveContainer width="100%" height={260}>
                                                    <RadarChart data={radarData}>
                                                        <PolarGrid stroke={colors.border} />
                                                        <PolarAngleAxis dataKey="muscleGroup" tick={{ fill: colors.textMuted, fontSize: 12 }} />
                                                        <PolarRadiusAxis tick={{ fill: colors.textFaint, fontSize: 10 }} allowDecimals={false} />
                                                        <Radar
                                                            dataKey="sets"
                                                            stroke={colors.accent}
                                                            fill={colors.accent}
                                                            fillOpacity={0.4}
                                                        />
                                                    </RadarChart>
                                                </ResponsiveContainer>
                                            </div>
                                        )}

                                        {dateWorkouts.map((w) => (
                                            <div key={w._id} style={styles.workoutCard}>
                                                <h3 style={styles.workoutTitle}>{w.name}</h3>
                                                {w.sets.map((s) => (
                                                    <div key={s._id} style={styles.setRow}>
                                                        {s.exercise?.name || 'Unknown'} ({s.exercise?.muscleGroup || '—'}) — {s.reps} reps @ {s.weightKg}kg
                                                    </div>
                                                ))}
                                                {w.notes && <p style={styles.notes}>{w.notes}</p>}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

const styles = {
    container: { maxWidth: '700px', margin: '0 auto', padding: '2rem' },
    h1: { color: colors.text, fontSize: '1.8rem', fontWeight: 600, marginBottom: '1.5rem' },
    dateList: { display: 'flex', flexDirection: 'column', gap: '1rem' },
    dateCard: {
        border: `1px solid ${colors.border}`,
        borderRadius: '8px',
        background: colors.surface,
        overflow: 'hidden',
    },
    dateHeader: {
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem 1.2rem',
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        textAlign: 'left',
    },
    dateTitle: { color: colors.text, fontWeight: 600, fontSize: '1rem' },
    dateMeta: { color: colors.textFaint, fontSize: '0.85rem' },
    dateBody: { padding: '0 1.2rem 1.2rem' },
    radarWrap: { marginBottom: '1rem' },
    workoutCard: {
        borderTop: `1px solid ${colors.border}`,
        paddingTop: '0.8rem',
        marginTop: '0.8rem',
    },
    workoutTitle: { color: colors.text, fontSize: '0.95rem', fontWeight: 600, margin: '0 0 0.4rem' },
    setRow: { fontSize: '0.9rem', padding: '0.15rem 0', color: colors.text },
    notes: { marginTop: '0.4rem', fontSize: '0.85rem', color: colors.textFaint, fontStyle: 'italic' },
};

export default History;
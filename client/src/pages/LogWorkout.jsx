import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';
import Navbar from '../components/Navbar';
import { colors, btnPrimary } from '../theme';
import ExercisePicker from '../components/ExercisePicker';

function LogWorkout() {
    const [name, setName] = useState('');
    const [notes, setNotes] = useState('');
    const [exercises, setExercises] = useState([]);
    const [sets, setSets] = useState([{ exercise: '', reps: '', weightKg: '' }]);
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        api.get('/exercises').then((res) => setExercises(res.data));
    }, []);

    const updateSet = (index, field, value) => {
        const updated = [...sets];
        updated[index][field] = value;
        setSets(updated);
    };

    const addSetRow = () => {
        setSets([...sets, { exercise: '', reps: '', weightKg: '' }]);
    };

    const removeSetRow = (index) => {
        setSets(sets.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (setError.some((s) => !s.exercise)) {
            setError('Please select an exercise for every set');
            return;
        }
        setSubmitting(true);
        try {
            const formattedSets = sets.map((s, i) => ({
                exercise: s.exercise,
                setNumber: i + 1,
                reps: Number(s.reps),
                weightKg: Number(s.weightKg) || 0,
            }));

            await api.post('/workouts', { name, notes, sets: formattedSets });
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save workout');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div style={{ background: colors.bg, minHeight: '100vh' }}>
            <Navbar />
            <div style={styles.container}>
                <h1 style={styles.h1}>Log a Workout</h1>
                <form onSubmit={handleSubmit}>
                    <label style={styles.label}>Workout Name</label>
                    <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Push Day"
                        required
                        style={styles.input}
                    />

                    <label style={styles.label}>Notes (optional)</label>
                    <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        style={{ ...styles.input, minHeight: '60px', resize: 'vertical' }}
                    />

                    <h3 style={styles.h3}>Sets</h3>
                    {sets.map((s, i) => (
                        <div key={i} style={styles.setRow}>
                            <ExercisePicker
                                exercises={exercises}
                                value={s.exercise}
                                onChange={(id) => updateSet(i, 'exercise', id)}
                            />
                            <input
                                type="number"
                                placeholder="Reps"
                                value={s.reps}
                                onChange={(e) => updateSet(i, 'reps', e.target.value)}
                                required
                                style={styles.smallInput}
                            />
                            <input
                                type="number"
                                placeholder="Weight (kg)"
                                value={s.weightKg}
                                onChange={(e) => updateSet(i, 'weightKg', e.target.value)}
                                style={styles.smallInput}
                            />
                            {sets.length > 1 && (
                                <button type="button" onClick={() => removeSetRow(i)} style={styles.removeBtn}>×</button>
                            )}
                        </div>
                    ))}

                    <button type="button" onClick={addSetRow} style={styles.addBtn}>+ Add Set</button>

                    {error && <p style={{ color: '#fca5a5' }}>{error}</p>}

                    <button type="submit" disabled={submitting} style={{ ...btnPrimary, width: '100%', border: 'none', cursor: 'pointer', fontSize: '1rem' }}>
                        {submitting ? 'Saving...' : 'Save Workout'}
                    </button>
                </form>
            </div>
        </div>
    );
}

const styles = {
    container: { maxWidth: '600px', margin: '0 auto', padding: '2rem' },
    h1: { color: colors.text, fontSize: '1.8rem', fontWeight: 600, marginBottom: '1.5rem' },
    h3: { color: colors.text, fontSize: '1.1rem', fontWeight: 600, marginTop: '1.5rem', marginBottom: '0.8rem' },
    label: { display: 'block', color: colors.textMuted, marginTop: '1rem', marginBottom: '0.3rem', fontSize: '0.85rem' },
    input: {
        width: '100%', padding: '0.6rem', borderRadius: '6px',
        border: `1px solid ${colors.border}`, background: colors.surface, color: colors.text,
        boxSizing: 'border-box', fontFamily: 'inherit',
    },
    setRow: { display: 'flex', gap: '0.5rem', marginBottom: '0.6rem', alignItems: 'center' },
    select: {
        flex: 2, padding: '0.5rem', borderRadius: '6px',
        border: `1px solid ${colors.border}`, background: colors.surface, color: colors.text, fontFamily: 'inherit',
    },
    smallInput: {
        flex: 1, padding: '0.5rem', borderRadius: '6px',
        border: `1px solid ${colors.border}`, background: colors.surface, color: colors.text, fontFamily: 'inherit',
    },
    removeBtn: {
        background: 'rgba(239, 68, 68, 0.15)', color: '#fca5a5', border: '1px solid rgba(239, 68, 68, 0.4)',
        borderRadius: '6px', width: '32px', height: '36px', cursor: 'pointer', fontSize: '1rem',
    },
    addBtn: {
        background: colors.surface, color: colors.textMuted, border: `1px solid ${colors.border}`,
        padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer', marginBottom: '1rem', fontSize: '0.9rem',
    },
};

export default LogWorkout;
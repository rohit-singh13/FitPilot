import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';
import Navbar from '../components/Navbar';

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
        setSubmitting(true);
        try {
            const formattedSets = sets.map((s, i) => ({
                exercise: s.exercise,
                setNumber: i + 1,
                reps: Number(s.reps),
                weightKg: Number(s.weightKg) || 0,
            }));

            await api.post('/workouts', { name, notes, sets: formattedSets });
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save workout');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div>
            <Navbar />
            <div style={styles.container}>
                <h1>Log a Workout</h1>
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
                        style={{ ...styles.input, minHeight: '60px' }}
                    />

                    <h3 style={{ marginTop: '1.5rem' }}>Sets</h3>
                    {sets.map((s, i) => (
                        <div key={i} style={styles.setRow}>
                            <select
                                value={s.exercise}
                                onChange={(e) => updateSet(i, 'exercise', e.target.value)}
                                required
                                style={styles.select}
                            >
                                <option value="">Select exercise</option>
                                {exercises.map((ex) => (
                                    <option key={ex._id} value={ex._id}>{ex.name}</option>
                                ))}
                            </select>
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

                    {error && <p style={{ color: 'red' }}>{error}</p>}

                    <button type="submit" disabled={submitting} style={styles.submitBtn}>
                        {submitting ? 'Saving...' : 'Save Workout'}
                    </button>
                </form>
            </div>
        </div>
    );
}

const styles = {
    container: { maxWidth: '600px', margin: '0 auto', padding: '2rem' },
    label: { display: 'block', marginTop: '1rem', marginBottom: '0.3rem', fontSize: '0.9rem' },
    input: {
        width: '100%', padding: '0.6rem', borderRadius: '4px',
        border: '1px solid #ccc', boxSizing: 'border-box',
    },
    setRow: { display: 'flex', gap: '0.5rem', marginBottom: '0.6rem', alignItems: 'center' },
    select: { flex: 2, padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' },
    smallInput: { flex: 1, padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' },
    removeBtn: {
        background: '#ef4444', color: '#fff', border: 'none',
        borderRadius: '4px', width: '28px', height: '32px', cursor: 'pointer',
    },
    addBtn: {
        background: '#e2e8f0', border: 'none', padding: '0.5rem 1rem',
        borderRadius: '4px', cursor: 'pointer', marginBottom: '1rem',
    },
    submitBtn: {
        display: 'block', width: '100%', padding: '0.7rem', background: '#2563eb',
        color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '1rem',
    },
};

export default LogWorkout;
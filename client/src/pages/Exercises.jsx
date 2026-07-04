import { useState, useEffect } from 'react';
import api from '../api/client';
import Navbar from '../components/Navbar';

function Exercises() {
    const [exercises, setExercises] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [name, setName] = useState('');
    const [category, setCategory] = useState('push');
    const [muscleGroup, setMuscleGroup] = useState('');
    const [equipment, setEquipment] = useState('bodyweight');
    const [submitting, setSubmitting] = useState(false);
    const [formError, setFormError] = useState('');

    const loadExercises = () => {
        setLoading(true);
        api.get('/exercises')
            .then((res) => setExercises(res.data))
            .catch(() => setError('Failed to load exercises'))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        loadExercises();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError('');
        setSubmitting(true);
        try {
            await api.post('/exercises', { name, category, muscleGroup, equipment });
            setName('');
            setMuscleGroup('');
            loadExercises();
        } catch (err) {
            setFormError(err.response?.data?.message || 'Failed to add exercise');
        } finally {
            setSubmitting(false);
        }
    };

    // Group exercises by category for a cleaner display
    const grouped = exercises.reduce((acc, ex) => {
        acc[ex.category] = acc[ex.category] || [];
        acc[ex.category].push(ex);
        return acc;
    }, {});

    return (
        <div>
            <Navbar />
            <div style={styles.container}>
                <h1>Exercise Library</h1>

                <form onSubmit={handleSubmit} style={styles.form}>
                    <h3 style={{ marginTop: 0 }}>Add New Exercise</h3>
                    {formError && <p style={{ color: 'red', fontSize: '0.85rem' }}>{formError}</p>}
                    <div style={styles.formRow}>
                        <input
                            placeholder="Exercise name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            style={styles.input}
                        />
                        <select value={category} onChange={(e) => setCategory(e.target.value)} style={styles.input}>
                            <option value="push">Push</option>
                            <option value="pull">Pull</option>
                            <option value="legs">Legs</option>
                            <option value="core">Core</option>
                            <option value="cardio">Cardio</option>
                            <option value="full_body">Full Body</option>
                        </select>
                    </div>
                    <div style={styles.formRow}>
                        <input
                            placeholder="Muscle group (e.g. chest)"
                            value={muscleGroup}
                            onChange={(e) => setMuscleGroup(e.target.value)}
                            required
                            style={styles.input}
                        />
                        <select value={equipment} onChange={(e) => setEquipment(e.target.value)} style={styles.input}>
                            <option value="bodyweight">Bodyweight</option>
                            <option value="barbell">Barbell</option>
                            <option value="dumbbell">Dumbbell</option>
                            <option value="machine">Machine</option>
                            <option value="cable">Cable</option>
                            <option value="kettlebell">Kettlebell</option>
                        </select>
                    </div>
                    <button type="submit" disabled={submitting} style={styles.submitBtn}>
                        {submitting ? 'Adding...' : '+ Add Exercise'}
                    </button>
                </form>

                {loading && <p>Loading...</p>}
                {error && <p style={{ color: 'red' }}>{error}</p>}

                {!loading && Object.keys(grouped).length === 0 && (
                    <p style={styles.empty}>No exercises yet. Add one above.</p>
                )}

                {Object.entries(grouped).map(([cat, list]) => (
                    <div key={cat} style={styles.group}>
                        <h3 style={styles.groupTitle}>{cat.replace('_', ' ')}</h3>
                        <div style={styles.grid}>
                            {list.map((ex) => (
                                <div key={ex._id} style={styles.card}>
                                    <strong>{ex.name}</strong>
                                    <div style={styles.meta}>{ex.muscleGroup} · {ex.equipment}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

const styles = {
    container: { maxWidth: '700px', margin: '0 auto', padding: '2rem' },
    form: {
        background: '#fff',
        border: '1px solid #e2e8f0',
        borderRadius: '8px',
        padding: '1.2rem',
        marginBottom: '2rem',
    },
    formRow: { display: 'flex', gap: '0.6rem', marginBottom: '0.6rem' },
    input: {
        flex: 1,
        padding: '0.5rem',
        borderRadius: '4px',
        border: '1px solid #ccc',
    },
    submitBtn: {
        background: '#2563eb',
        color: '#fff',
        border: 'none',
        padding: '0.5rem 1rem',
        borderRadius: '4px',
        cursor: 'pointer',
    },
    empty: { color: '#666' },
    group: { marginBottom: '1.5rem' },
    groupTitle: { textTransform: 'capitalize', color: '#334155', marginBottom: '0.5rem' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.6rem' },
    card: {
        border: '1px solid #e2e8f0',
        borderRadius: '6px',
        padding: '0.7rem',
        background: '#fff',
    },
    meta: { fontSize: '0.8rem', color: '#888', textTransform: 'capitalize', marginTop: '0.2rem' },
};

export default Exercises;
import { useState, useEffect } from 'react';
import api from '../api/client';
import Navbar from '../components/Navbar';
import { colors, btnPrimary } from '../theme';

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
    const [showSuggestions, setShowSuggestions] = useState(false);

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

    const suggestions = name.trim().length > 0
        ? exercises.filter((ex) =>
            ex.name.toLowerCase().includes(name.trim().toLowerCase())
          )
        : [];

    const exactMatch = exercises.some(
        (ex) => ex.name.trim().toLowerCase() === name.trim().toLowerCase()
    );

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

    const grouped = exercises.reduce((acc, ex) => {
        acc[ex.category] = acc[ex.category] || [];
        acc[ex.category].push(ex);
        return acc;
    }, {});

    return (
        <div style={{ background: colors.bg, minHeight: '100vh' }}>
            <Navbar />
            <div style={styles.container}>
                <h1 style={styles.h1}>Exercise Library</h1>

                <form onSubmit={handleSubmit} style={styles.form}>
                    <h3 style={styles.h3}>Add New Exercise</h3>
                    {formError && <p style={{ color: '#fca5a5', fontSize: '0.85rem' }}>{formError}</p>}
                    {exactMatch && (
                        <p style={styles.warning}>
                            An exercise named "{name.trim()}" already exists.
                        </p>
                    )}

                    <div style={styles.formRow}>
                        <div style={{ position: 'relative', flex: 1 }}>
                            <input
                                placeholder="Exercise name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                onFocus={() => setShowSuggestions(true)}
                                onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                                required
                                style={styles.input}
                                autoComplete="off"
                            />
                            {showSuggestions && suggestions.length > 0 && (
                                <div style={styles.suggestionBox}>
                                    {suggestions.slice(0, 6).map((ex) => (
                                        <div
                                            key={ex._id}
                                            style={styles.suggestionItem}
                                            onMouseDown={() => setName(ex.name)}
                                        >
                                            {ex.name}
                                            <span style={styles.suggestionMeta}>
                                                {ex.category} · {ex.muscleGroup}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
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
                    <button type="submit" disabled={submitting} style={{ ...btnPrimary, border: 'none', cursor: 'pointer' }}>
                        {submitting ? 'Adding...' : '+ Add Exercise'}
                    </button>
                </form>

                {loading && <p style={{ color: colors.textMuted }}>Loading...</p>}
                {error && <p style={{ color: '#fca5a5' }}>{error}</p>}

                {!loading && Object.keys(grouped).length === 0 && (
                    <p style={{ color: colors.textMuted }}>No exercises yet. Add one above.</p>
                )}

                {Object.entries(grouped).map(([cat, list]) => (
                    <div key={cat} style={styles.group}>
                        <h3 style={styles.groupTitle}>{cat.replace('_', ' ')}</h3>
                        <div style={styles.grid}>
                            {list.map((ex) => (
                                <div key={ex._id} style={styles.card}>
                                    <strong style={{ color: colors.text }}>{ex.name}</strong>
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
    h1: { color: colors.text, fontSize: '1.8rem', fontWeight: 600, marginBottom: '1.5rem' },
    h3: { color: colors.text, fontSize: '1.05rem', fontWeight: 600, marginTop: 0 },
    form: {
        background: colors.surface,
        border: `1px solid ${colors.border}`,
        borderRadius: '8px',
        padding: '1.2rem',
        marginBottom: '2rem',
    },
    formRow: { display: 'flex', gap: '0.6rem', marginBottom: '0.6rem' },
    input: {
        flex: 1,
        padding: '0.5rem',
        borderRadius: '6px',
        border: `1px solid ${colors.border}`,
        background: '#0d1117',
        color: colors.text,
        fontFamily: 'inherit',
    },
    warning: {
        background: 'rgba(245, 158, 11, 0.15)',
        color: '#fbbf24',
        padding: '0.5rem 0.7rem',
        borderRadius: '6px',
        fontSize: '0.85rem',
        marginBottom: '0.6rem',
    },
    suggestionBox: {
        position: 'absolute',
        top: '100%',
        left: 0,
        right: 0,
        background: colors.surface,
        border: `1px solid ${colors.border}`,
        borderRadius: '6px',
        marginTop: '2px',
        zIndex: 10,
        boxShadow: '0 4px 10px rgba(0,0,0,0.4)',
        maxHeight: '220px',
        overflowY: 'auto',
    },
    suggestionItem: {
        padding: '0.5rem 0.7rem',
        cursor: 'pointer',
        fontSize: '0.9rem',
        color: colors.text,
        borderBottom: `1px solid ${colors.border}`,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    suggestionMeta: { fontSize: '0.75rem', color: colors.textFaint, textTransform: 'capitalize' },
    group: { marginBottom: '1.5rem' },
    groupTitle: { textTransform: 'capitalize', color: colors.textMuted, marginBottom: '0.5rem', fontSize: '0.95rem' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.6rem' },
    card: {
        border: `1px solid ${colors.border}`,
        borderRadius: '6px',
        padding: '0.7rem',
        background: colors.surface,
    },
    meta: { fontSize: '0.8rem', color: colors.textFaint, textTransform: 'capitalize', marginTop: '0.2rem' },
};

export default Exercises;
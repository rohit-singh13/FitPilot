import { useState, useMemo, useRef } from 'react';
import { colors } from '../theme';

function ExercisePicker({ exercises, value, onChange }) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const containerRef = useRef(null);

    const selected = exercises.find((ex) => ex._id === value);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        const list = q
            ? exercises.filter(
                  (ex) =>
                      ex.name.toLowerCase().includes(q) ||
                      ex.muscleGroup.toLowerCase().includes(q)
              )
            : exercises;

        return [...list].sort((a, b) => {
            if (a.muscleGroup === b.muscleGroup) return a.name.localeCompare(b.name);
            return a.muscleGroup.localeCompare(b.muscleGroup);
        });
    }, [exercises, query]);

    const handleSelect = (ex) => {
        onChange(ex._id);
        setQuery('');
        setOpen(false);
    };

    let lastGroup = null;

    return (
        <div style={styles.wrap} ref={containerRef}>
            <input
                type="text"
                value={open ? query : selected?.name || ''}
                onChange={(e) => {
                    setQuery(e.target.value);
                    if (!open) setOpen(true);
                }}
                onFocus={() => {
                    setOpen(true);
                    setQuery('');
                }}
                onBlur={() => setTimeout(() => setOpen(false), 150)}
                placeholder="Search exercise..."
                style={styles.input}
            />
            {open && (
                <div style={styles.dropdown}>
                    {filtered.length === 0 && <div style={styles.empty}>No exercises found</div>}
                    {filtered.map((ex) => {
                        const showHeader = ex.muscleGroup !== lastGroup;
                        lastGroup = ex.muscleGroup;
                        return (
                            <div key={ex._id}>
                                {showHeader && <div style={styles.groupHeader}>{ex.muscleGroup}</div>}
                                <div
                                    onMouseDown={(e) => {
                                        e.preventDefault();
                                        handleSelect(ex);
                                    }}
                                    style={{
                                        ...styles.option,
                                        background: ex._id === value ? colors.bg : 'transparent',
                                    }}
                                >
                                    {ex.name}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

const styles = {
    wrap: { position: 'relative', flex: 2 },
    input: {
        width: '100%', padding: '0.5rem', borderRadius: '6px',
        border: `1px solid ${colors.border}`, background: colors.surface, color: colors.text,
        fontFamily: 'inherit', boxSizing: 'border-box',
    },
    dropdown: {
        position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0,
        maxHeight: '240px', overflowY: 'auto', background: colors.surface,
        border: `1px solid ${colors.border}`, borderRadius: '6px', zIndex: 20,
        boxShadow: '0 8px 20px rgba(0,0,0,0.4)',
    },
    groupHeader: {
        padding: '0.4rem 0.7rem', fontSize: '0.7rem', textTransform: 'uppercase',
        letterSpacing: '0.05em', color: colors.textFaint, background: colors.bg,
        position: 'sticky', top: 0,
    },
    option: { padding: '0.5rem 0.8rem', fontSize: '0.9rem', color: colors.text, cursor: 'pointer' },
    empty: { padding: '0.6rem 0.8rem', color: colors.textFaint, fontSize: '0.85rem' },
};

export default ExercisePicker;
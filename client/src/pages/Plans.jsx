import { Link } from 'react-router-dom';
import { colors, btnPrimary, btnSecondary } from '../theme';

const plans = [
    {
        name: 'Weight Loss',
        tagline: 'Fat-loss focused programming with AI-adjusted intensity',
        price: '₹499/mo',
        features: ['AI coaching tuned for calorie deficit training', 'Cardio + strength hybrid plans', 'Weekly progress check-ins'],
    },
    {
        name: 'Weight Gain',
        tagline: 'Progressive overload plans built for lean muscle gain',
        price: '₹599/mo',
        features: ['Strength-focused AI coaching', 'Progressive overload tracking', 'Recovery & volume guidance'],
        highlight: true,
    },
    {
        name: 'General Fitness',
        tagline: 'Balanced training for overall health and consistency',
        price: '₹399/mo',
        features: ['Flexible AI coaching tips', 'Full exercise library access', 'Habit & consistency tracking'],
    },
];

function Plans() {
    return (
        <div style={{ background: colors.bg, minHeight: '100vh', color: colors.text, fontFamily: 'system-ui, sans-serif' }}>
            <nav style={styles.nav}>
                <Link to="/" style={styles.brand}>⚡ FitPilot</Link>
                <div style={styles.navLinks}>
                    <Link to="/" style={styles.navLink}>Home</Link>
                    <Link to="/about" style={styles.navLink}>About</Link>
                    <Link to="/plans" style={{ color: colors.text, textDecoration: 'none', fontSize: '0.9rem' }}>Plans</Link>
                    <Link to="/shop" style={styles.navLink}>Shop</Link>
                    <Link to="/contact" style={styles.navLink}>Contact</Link>
                </div>
                <Link to="/register" style={btnPrimary}>Sign up</Link>
            </nav>

            <div style={styles.container}>
                <h1 style={styles.h1}>Choose your plan</h1>
                <p style={styles.p}>Personalized programs, matched to your specific goal.</p>

                <div style={styles.grid}>
                    {plans.map((plan) => (
                        <div key={plan.name} style={{ ...styles.card, ...(plan.highlight ? styles.cardHighlight : {}) }}>
                            {plan.highlight && <div style={styles.badge}>Most popular</div>}
                            <div style={styles.planName}>{plan.name}</div>
                            <div style={styles.planTagline}>{plan.tagline}</div>
                            <div style={styles.planPrice}>{plan.price}</div>
                            <ul style={styles.featureList}>
                                {plan.features.map((f) => (
                                    <li key={f} style={styles.featureItem}>✓ {f}</li>
                                ))}
                            </ul>
                            <Link
                                to="/register"
                                style={plan.highlight ? btnPrimary : btnSecondary}
                            >
                                Get started
                            </Link>
                        </div>
                    ))}
                </div>

                <p style={styles.note}>
                    All plans include full access to workout logging, the exercise library, and AI coaching.
                </p>
            </div>
        </div>
    );
}

const styles = {
    nav: {
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '1.2rem 3rem', borderBottom: `1px solid ${colors.border}`,
    },
    brand: { color: colors.text, fontWeight: 600, fontSize: '1.1rem', textDecoration: 'none' },
    navLinks: { display: 'flex', gap: '1.5rem' },
    navLink: { color: colors.textMuted, textDecoration: 'none', fontSize: '0.9rem' },
    container: { maxWidth: '900px', margin: '0 auto', padding: '3.5rem 2rem', textAlign: 'center' },
    h1: { fontSize: '2rem', fontWeight: 600, marginBottom: '0.6rem' },
    p: { color: colors.textMuted, marginBottom: '2.5rem' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.2rem', textAlign: 'left' },
    card: {
        background: colors.surface, borderRadius: '10px', padding: '1.5rem',
        border: `1px solid ${colors.border}`, position: 'relative',
    },
    cardHighlight: { border: `1px solid ${colors.accent}` },
    badge: {
        position: 'absolute', top: '-10px', right: '1.2rem', background: colors.accent,
        color: colors.accentDark, fontSize: '0.7rem', fontWeight: 600, padding: '0.2rem 0.6rem', borderRadius: '4px',
    },
    planName: { fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.3rem' },
    planTagline: { color: colors.textFaint, fontSize: '0.85rem', marginBottom: '1rem', lineHeight: 1.4 },
    planPrice: { fontSize: '1.6rem', fontWeight: 600, marginBottom: '1rem' },
    featureList: { listStyle: 'none', padding: 0, marginBottom: '1.5rem' },
    featureItem: { color: colors.textMuted, fontSize: '0.85rem', marginBottom: '0.5rem' },
    note: { color: colors.textFaint, fontSize: '0.85rem', marginTop: '2.5rem' },
};

export default Plans;
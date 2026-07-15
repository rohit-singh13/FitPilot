import { Link } from 'react-router-dom';
import { colors, btnPrimary, btnSecondary } from '../theme';

const features = [
    { icon: '📋', title: 'Workout logging', desc: 'Track sets, reps, and weight for every session.' },
    { icon: '📚', title: 'Exercise library', desc: '55+ exercises across every muscle group.' },
    { icon: '✨', title: 'AI coaching', desc: 'Personalized tips based on your real history.' },
    { icon: '📈', title: 'Progress tracking', desc: 'See volume and strength trends over time.' },
];

function Home() {
    return (
        <div style={{ background: colors.bg, minHeight: '100vh', color: colors.text, fontFamily: 'system-ui, sans-serif' }}>
            <nav style={styles.nav}>
                <Link to="/" style={styles.brand}>FitPilot</Link>
                <div style={styles.navLinks}>
                    <Link to="/" style={{ color: colors.text, textDecoration: 'none', fontSize: '1 rem' }}>Home</Link>
                    <Link to="/about" style={styles.navLink}>About</Link>
                    <Link to="/plans" style={styles.navLink}>Plans</Link>
                    <Link to="/shop" style={styles.navLink}>Shop</Link>
                    <Link to="/contact" style={styles.navLink}>Contact</Link>
                </div>
                <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
                    <Link to="/login" style={{ color: colors.textMuted, textDecoration: 'none', fontSize: '1rem' }}>Log in</Link>
                    <Link to="/register" style={btnPrimary}>Sign up</Link>
                </div>
            </nav>

            <div style={styles.hero}>
                <div style={styles.eyebrow}>AI-POWERED FITNESS TRACKING</div>
                <h1 style={styles.headline}>Log your training</h1>
                <h1 style={styles.headline}>Get coached by AI.</h1>
                <p style={styles.subtext}>
                    FitPilot tracks every set and rep, then turns your history into personalized
                    coaching tips — automatically, after every workout.
                </p>
                <div style={{ display: 'flex', gap: '0.8rem', justifyContent: 'center' }}>
                    <Link to="/register" style={btnPrimary}>Get started free</Link>
                    <Link to="/plans" style={btnSecondary}>Explore plans</Link>
                </div>
            </div>

            <div style={styles.section}>
                <h2 style={styles.sectionTitle}>Everything you need to train smarter</h2>
                <div style={styles.featureGrid}>
                    {features.map((f) => (
                        <div key={f.title} style={styles.featureCard}>
                            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{f.icon}</div>
                            <div style={{ fontWeight: 500, marginBottom: '0.3rem' }}>{f.title}</div>
                            <div style={{ color: colors.textFaint, fontSize: '0.85rem' }}>{f.desc}</div>
                        </div>
                    ))}
                </div>

                <div style={styles.ctaGrid}>
                    <Link to="/plans" style={styles.ctaCard}>
                        <div>
                            <div style={{ fontWeight: 500, marginBottom: '0.3rem' }}>Personalized plans</div>
                            <div style={{ color: colors.textFaint, fontSize: '0.85rem' }}>
                                Weight loss, weight gain and general fitness programs.
                            </div>
                        </div>
                        <span style={{ color: colors.accent }}>→</span>
                    </Link>
                    <Link to="/shop" style={styles.ctaCard}>
                        <div>
                            <div style={{ fontWeight: 500, marginBottom: '0.3rem' }}>Shop gear and supplements</div>
                            <div style={{ color: colors.textFaint, fontSize: '0.85rem' }}>
                                Accessories and supplements, hand-picked for your goals.
                            </div>
                        </div>
                        <span style={{ color: colors.accent }}>→</span>
                    </Link>
                </div>
            </div>

            <footer style={styles.footer}>
                © {new Date().getFullYear()} FitPilot. Built with React, Express, MongoDB & Python.
            </footer>
        </div>
    );
}

const styles = {
    nav: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1.2rem 3rem',
        borderBottom: `1px solid ${colors.border}`,
    },
    brand: {
    fontSize: "2rem",
    fontWeight: 800,
    textDecoration: "none",
    background: "linear-gradient(90deg, #f4f4f2, #a3e635)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    color: "transparent",
  },
    navLinks: { display: 'flex', gap: '2rem' },
    navLink: { color: colors.textMuted, textDecoration: 'none', fontSize: '1rem' },
    hero: {
        textAlign: 'center',
        maxWidth: '600px',
        margin: '0 auto',
        padding: '5rem 2rem 4rem',
    },
    eyebrow: { color: colors.accent, fontSize: '0.75rem', fontWeight: 600, letterSpacing: '1.5px', marginBottom: '0.8rem' },
    headline: { fontSize: '2.4rem', fontWeight: 600, lineHeight: 1.25, marginBottom: '1rem' },
    subtext: { color: colors.textMuted, fontSize: '1rem', lineHeight: 1.6, marginBottom: '2rem' },
    section: { maxWidth: '900px', margin: '0 auto', padding: '0 2rem 4rem' },
    sectionTitle: {
        textAlign: 'center',
        fontSize: '0.85rem',
        fontWeight: 600,
        letterSpacing: '1px',
        textTransform: 'uppercase',
        color: colors.text,
        marginBottom: '1.5rem',
    },
    featureGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '1rem',
        marginBottom: '2rem',
    },
    featureCard: { background: colors.surface, borderRadius: '8px', padding: '1.2rem' },
    ctaGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' },
    ctaCard: {
        background: colors.surface,
        borderRadius: '8px',
        padding: '1.3rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        textDecoration: 'none',
        color: colors.text,
    },
    footer: {
        textAlign: 'center',
        padding: '2rem',
        color: colors.textFaint,
        fontSize: '0.8rem',
        borderTop: `1px solid ${colors.border}`,
    },
};

export default Home;
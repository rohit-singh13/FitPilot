import { Link } from 'react-router-dom';
import { colors, btnPrimary } from '../theme';

function About() {
    return (
        <div style={{ background: colors.bg, minHeight: '100vh', color: colors.text, fontFamily: 'system-ui, sans-serif' }}>
            <nav style={styles.nav}>
                <Link to="/" style={styles.brand}>⚡ FitPilot</Link>
                <div style={styles.navLinks}>
                    <Link to="/" style={styles.navLink}>Home</Link>
                    <Link to="/about" style={{ color: colors.text, textDecoration: 'none', fontSize: '0.9rem' }}>About</Link>
                    <Link to="/plans" style={styles.navLink}>Plans</Link>
                    <Link to="/shop" style={styles.navLink}>Shop</Link>
                    <Link to="/contact" style={styles.navLink}>Contact</Link>
                </div>
                <Link to="/register" style={btnPrimary}>Sign up</Link>
            </nav>

            <div style={styles.container}>
                <h1 style={styles.h1}>About FitPilot</h1>
                <p style={styles.p}>
                    FitPilot is an AI-powered fitness tracking app built to make logging workouts
                    effortless and turn raw training data into real coaching advice — not just charts.
                </p>
                <p style={styles.p}>
                    Every workout you log — sets, reps, weight — feeds into an AI coach that reviews
                    your recent training and gives you specific, actionable feedback: what to adjust,
                    what you've been neglecting, and how to keep progressing.
                </p>

                <h2 style={styles.h2}>How it's built</h2>
                <div style={styles.grid}>
                    <div style={styles.card}>
                        <div style={styles.cardTitle}>React frontend</div>
                        <div style={styles.cardDesc}>The interface you're using right now — fast, responsive, and connected live to your data.</div>
                    </div>
                    <div style={styles.card}>
                        <div style={styles.cardTitle}>Node & Express API</div>
                        <div style={styles.cardDesc}>Handles authentication, workout logging, and the exercise library, backed by MongoDB.</div>
                    </div>
                    <div style={styles.card}>
                        <div style={styles.cardTitle}>Python AI service</div>
                        <div style={styles.cardDesc}>A dedicated microservice that analyzes your training history and generates coaching tips.</div>
                    </div>
                </div>

                <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
                    <Link to="/register" style={btnPrimary}>Get started free</Link>
                </div>
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
    container: { maxWidth: '700px', margin: '0 auto', padding: '3.5rem 2rem' },
    h1: { fontSize: '2rem', fontWeight: 600, marginBottom: '1.2rem' },
    h2: { fontSize: '1.2rem', fontWeight: 600, margin: '2rem 0 1rem' },
    p: { color: colors.textMuted, lineHeight: 1.7, marginBottom: '1rem' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' },
    card: { background: colors.surface, borderRadius: '8px', padding: '1.2rem' },
    cardTitle: { fontWeight: 500, marginBottom: '0.4rem' },
    cardDesc: { color: colors.textFaint, fontSize: '0.85rem', lineHeight: 1.5 },
};

export default About;
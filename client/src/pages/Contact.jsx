import { useState } from 'react';
import { Link } from 'react-router-dom';
import { colors, btnPrimary } from '../theme';

function Contact() {
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
    };

    return (
        <div style={{ background: colors.bg, minHeight: '100vh', color: colors.text, fontFamily: 'system-ui, sans-serif' }}>
            <nav style={styles.nav}>
                <Link to="/" style={styles.brand}>⚡ FitPilot</Link>
                <div style={styles.navLinks}>
                    <Link to="/" style={styles.navLink}>Home</Link>
                    <Link to="/about" style={styles.navLink}>About</Link>
                    <Link to="/plans" style={styles.navLink}>Plans</Link>
                    <Link to="/shop" style={styles.navLink}>Shop</Link>
                    <Link to="/contact" style={{ color: colors.text, textDecoration: 'none', fontSize: '0.9rem' }}>Contact</Link>
                </div>
                <Link to="/register" style={btnPrimary}>Sign up</Link>
            </nav>

            <div style={styles.container}>
                <h1 style={styles.h1}>Get in touch</h1>
                <p style={styles.p}>Questions, feedback, or partnership ideas — we'd love to hear from you.</p>

                {submitted ? (
                    <div style={styles.success}>Thanks for reaching out — we'll get back to you soon.</div>
                ) : (
                    <form onSubmit={handleSubmit} style={styles.form}>
                        <input placeholder="Rohit Singh" required style={styles.input} />
                        <input type="email" placeholder="singhrohit82013@gmail.com" required style={styles.input} />
                        <textarea placeholder="We will appreciate your views" required rows={5} style={{ ...styles.input, resize: 'vertical' }} />
                        <button type="submit" style={{ ...btnPrimary, border: 'none', cursor: 'pointer' }}>Send message</button>
                    </form>
                )}
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
    container: { maxWidth: '500px', margin: '0 auto', padding: '3.5rem 2rem' },
    h1: { fontSize: '2rem', fontWeight: 600, marginBottom: '0.6rem' },
    p: { color: colors.textMuted, marginBottom: '2rem' },
    form: { display: 'flex', flexDirection: 'column', gap: '0.9rem' },
    input: {
        background: colors.surface, border: `1px solid ${colors.border}`, color: colors.text,
        padding: '0.7rem', borderRadius: '6px', fontSize: '0.9rem', fontFamily: 'inherit',
    },
    success: { background: colors.surface, padding: '1.2rem', borderRadius: '8px', color: colors.accent },
};

export default Contact;
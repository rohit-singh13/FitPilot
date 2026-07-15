import { Link } from 'react-router-dom';
import { colors, btnPrimary } from '../theme';

const accessories = [
    { name: 'Lifting Straps', desc: 'Cotton wrist straps for heavy pulls', link: 'https://www.amazon.in/s?k=lifting+straps' },
    { name: 'Gym Gloves', desc: 'Grip support for weight training', link: 'https://www.amazon.in/s?k=gym+gloves' },
    { name: 'Shaker Bottle', desc: 'Leak-proof bottle with mixer ball', link: 'https://www.amazon.in/s?k=shaker+bottle' },
    { name: 'Resistance Bands Set', desc: 'For warmups and accessory work', link: 'https://www.amazon.in/s?k=resistance+bands' },
];

const supplements = [
    { name: 'Whey Protein', desc: 'Post-workout recovery and muscle repair', link: 'https://www.amazon.in/s?k=whey+protein' },
    { name: 'Creatine Monohydrate', desc: 'Strength and performance support', link: 'https://www.amazon.in/s?k=creatine+monohydrate' },
    { name: 'Multivitamin', desc: 'Daily micronutrient support', link: 'https://www.amazon.in/s?k=multivitamin' },
    { name: 'Electrolyte Powder', desc: 'Hydration for intense sessions', link: 'https://www.amazon.in/s?k=electrolyte+powder' },
];

function ProductGrid({ items }) {
    return (
        <div style={styles.grid}>
            {items.map((item) => (
                <a key={item.name} href={item.link} target="_blank" rel="noopener noreferrer" style={styles.card}>
                    <div style={styles.cardTitle}>{item.name}</div>
                    <div style={styles.cardDesc}>{item.desc}</div>
                    <div style={styles.shopLink}>Shop on Amazon →</div>
                </a>
            ))}
        </div>
    );
}

function Shop() {
    return (
        <div style={{ background: colors.bg, minHeight: '100vh', color: colors.text, fontFamily: 'system-ui, sans-serif' }}>
            <nav style={styles.nav}>
                <Link to="/" style={styles.brand}>⚡ FitPilot</Link>
                <div style={styles.navLinks}>
                    <Link to="/" style={styles.navLink}>Home</Link>
                    <Link to="/about" style={styles.navLink}>About</Link>
                    <Link to="/plans" style={styles.navLink}>Plans</Link>
                    <Link to="/shop" style={{ color: colors.text, textDecoration: 'none', fontSize: '0.9rem' }}>Shop</Link>
                    <Link to="/contact" style={styles.navLink}>Contact</Link>
                </div>
                <Link to="/register" style={btnPrimary}>Sign up</Link>
            </nav>

            <div style={styles.container}>
                <h1 style={styles.h1}>Gear & Supplements</h1>
                <p style={styles.p}>Hand-picked recommendations to support your training.</p>

                <h2 style={styles.h2}>Gym Wear & Accessories</h2>
                <ProductGrid items={accessories} />

                <h2 style={styles.h2}>Supplements</h2>
                <ProductGrid items={supplements} />

                <p style={styles.disclaimer}>
                    FitPilot may earn a commission from purchases made through these links, at no extra cost to you.
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
    container: { maxWidth: '900px', margin: '0 auto', padding: '3.5rem 2rem' },
    h1: { fontSize: '2rem', fontWeight: 600, marginBottom: '0.6rem' },
    h2: { fontSize: '1.1rem', fontWeight: 600, margin: '2rem 0 1rem' },
    p: { color: colors.textMuted, marginBottom: '1rem' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' },
    card: {
        background: colors.surface, borderRadius: '8px', padding: '1.1rem',
        textDecoration: 'none', color: colors.text, display: 'block',
    },
    cardTitle: { fontWeight: 500, fontSize: '0.9rem', marginBottom: '0.3rem' },
    cardDesc: { color: colors.textFaint, fontSize: '0.8rem', lineHeight: 1.4, marginBottom: '0.8rem' },
    shopLink: { color: colors.accent, fontSize: '0.8rem', fontWeight: 500 },
    disclaimer: { color: colors.textFaint, fontSize: '0.75rem', marginTop: '2rem', textAlign: 'center' },
};

export default Shop;
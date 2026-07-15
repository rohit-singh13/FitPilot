export const colors = {
    bg: '#0d1117',
    surface: '#161b22',
    border: '#1f2937',
    borderLight: '#374151',
    accent: '#a3e635',
    accentDark: '#1a2e05',
    text: '#f4f4f2',
    textMuted: '#9ca3af',
    textFaint: '#6b7280',
};

export const navLinkStyle = { color: colors.textMuted, textDecoration: 'none', fontSize: '0.9rem' };
export const navLinkActiveStyle = { ...navLinkStyle, color: colors.text };

export const btnPrimary = {
    background: colors.accent,
    color: colors.accentDark,
    border: 'none',
    padding: '0.6rem 1.4rem',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 500,
    fontSize: '0.9rem',
    textDecoration: 'none',
    display: 'inline-block',
};

export const btnSecondary = {
    background: 'transparent',
    color: colors.text,
    border: `1px solid ${colors.borderLight}`,
    padding: '0.6rem 1.4rem',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 500,
    fontSize: '0.9rem',
    textDecoration: 'none',
    display: 'inline-block',
};
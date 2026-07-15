import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import aiApi from '../api/aiClient';
import { colors } from '../theme';

function ChatWidget() {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [sending, setSending] = useState(false);
    const [error, setError] = useState('');
    const messagesEndRef = useRef(null);
    const typingIntervalRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, open]);

    // Cleanup any running typing animation if the component unmounts mid-type
    useEffect(() => {
        return () => {
            if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
        };
    }, []);

    // Reveals `fullText` into the message at `messageIndex` a few characters at a time
    const typeOutMessage = (fullText, messageIndex) => {
        let charIndex = 0;
        const chunkSize = 2; // characters revealed per tick — raise for faster typing

        typingIntervalRef.current = setInterval(() => {
            charIndex += chunkSize;
            setMessages((prev) => {
                const updated = [...prev];
                updated[messageIndex] = {
                    ...updated[messageIndex],
                    content: fullText.slice(0, charIndex),
                };
                return updated;
            });

            if (charIndex >= fullText.length) {
                clearInterval(typingIntervalRef.current);
                typingIntervalRef.current = null;
            }
        }, 15); // ms between ticks — lower for faster typing
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || sending) return;

        const userMessage = { role: 'user', content: input.trim() };
        const updatedMessages = [...messages, userMessage];
        setMessages(updatedMessages);
        setInput('');
        setError('');
        setSending(true);

        try {
            const res = await aiApi.post('/chat', { messages: updatedMessages });
            const fullReply = res.data.reply;

            // Add an empty assistant message first, then type into it
            const messagesWithEmptyReply = [...updatedMessages, { role: 'assistant', content: '' }];
            const newMessageIndex = messagesWithEmptyReply.length - 1;
            setMessages(messagesWithEmptyReply);
            setSending(false);

            typeOutMessage(fullReply, newMessageIndex);
        } catch (err) {
            setError('Failed to get a response. Is the AI service running?');
            setSending(false);
        }
    };

    return (
        <>
            <button onClick={() => setOpen(!open)} style={styles.fab}>
                {open ? '✕' : '💬'}
            </button>

            {open && (
                <div style={styles.panel}>
                    <div style={styles.header}>
                        <span style={styles.headerTitle}>✨ Ask FitPilot AI</span>
                        <button onClick={() => setOpen(false)} style={styles.closeBtn}>✕</button>
                    </div>

                    <div style={styles.messagesArea}>
                        {messages.length === 0 && (
                            <div style={styles.emptyState}>
                                Ask me anything about exercises, nutrition, or your training.
                            </div>
                        )}
                        {messages.map((m, i) => (
                            <div
                                key={i}
                                style={{
                                    ...styles.bubble,
                                    ...(m.role === 'user' ? styles.userBubble : styles.assistantBubble),
                                }}
                            >
                                <ReactMarkdown>{m.content}</ReactMarkdown>
                            </div>
                        ))}
                        {sending && <div style={{ ...styles.bubble, ...styles.assistantBubble }}>Thinking...</div>}
                        {error && <div style={styles.errorText}>{error}</div>}
                        <div ref={messagesEndRef} />
                    </div>

                    <form onSubmit={handleSend} style={styles.inputRow}>
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask about exercises, nutrition..."
                            style={styles.input}
                        />
                        <button type="submit" disabled={sending} style={styles.sendBtn}>➤</button>
                    </form>
                </div>
            )}
        </>
    );
}

const styles = {
    fab: {
        position: 'fixed', bottom: '24px', right: '24px', width: '56px', height: '56px',
        borderRadius: '50%', background: colors.accent, color: colors.accentDark, border: 'none',
        fontSize: '1.4rem', cursor: 'pointer', boxShadow: '0 4px 14px rgba(0,0,0,0.4)', zIndex: 1000,
    },
    panel: {
        position: 'fixed', bottom: '92px', right: '24px', width: '340px', height: '460px',
        background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: '12px',
        display: 'flex', flexDirection: 'column', boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
        zIndex: 1000, overflow: 'hidden',
    },
    header: {
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '0.8rem 1rem', borderBottom: `1px solid ${colors.border}`, background: '#0d1117',
    },
    headerTitle: { color: colors.text, fontSize: '0.9rem', fontWeight: 600 },
    closeBtn: { background: 'none', border: 'none', color: colors.textMuted, cursor: 'pointer', fontSize: '0.9rem' },
    messagesArea: {
        flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem',
    },
    emptyState: { color: colors.textFaint, fontSize: '0.85rem', textAlign: 'center', marginTop: '2rem' },
    bubble: { padding: '0.6rem 0.8rem', borderRadius: '10px', fontSize: '0.85rem', lineHeight: 1.5, maxWidth: '85%' },
    userBubble: { background: colors.accent, color: colors.accentDark, alignSelf: 'flex-end' },
    assistantBubble: { background: '#0d1117', color: colors.text, alignSelf: 'flex-start' },
    errorText: { color: '#fca5a5', fontSize: '0.8rem', textAlign: 'center' },
    inputRow: { display: 'flex', gap: '0.5rem', padding: '0.8rem', borderTop: `1px solid ${colors.border}` },
    input: {
        flex: 1, padding: '0.5rem 0.7rem', borderRadius: '8px', border: `1px solid ${colors.border}`,
        background: '#0d1117', color: colors.text, fontSize: '0.85rem', fontFamily: 'inherit',
    },
    sendBtn: {
        background: colors.accent, color: colors.accentDark, border: 'none', borderRadius: '8px',
        width: '36px', cursor: 'pointer', fontSize: '1rem',
    },
};

export default ChatWidget;
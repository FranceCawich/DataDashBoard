export function ErrorBanner({ msg }) {
  if (!msg) return null;
  return (
    <div style={{
      background: 'rgba(220,38,38,0.06)',
      border: '1px solid rgba(220,38,38,0.3)',
      color: '#EF4444',
      padding: '10px 16px',
      borderRadius: 4,
      fontSize: 12,
      letterSpacing: '0.01em',
      marginBottom: 16,
      display: 'flex',
      alignItems: 'center',
      gap: 8,
    }}>
      <span style={{ fontSize: 14 }}>⚠</span> {msg}
    </div>
  );
}

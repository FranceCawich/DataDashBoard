import { useState, useRef } from 'react';
import { useTheme } from '../theme/ThemeContext';

export function UploadZone({ accept, multiple, label, onFiles }) {
  const t = useTheme();
  const [drag, setDrag] = useState(false);
  const [name, setName] = useState('');
  const ref = useRef();

  const process = (files) => {
    if (!files.length) return;
    setName(Array.from(files).map(f => f.name).join(', '));
    onFiles(files);
  };

  return (
    <div
      onClick={() => ref.current.click()}
      onDragOver={e => { e.preventDefault(); setDrag(true); }}
      onDragLeave={() => setDrag(false)}
      onDrop={e => { e.preventDefault(); setDrag(false); process(e.dataTransfer.files); }}
      style={{
        border: `1px dashed ${drag ? t.borderActive : t.border}`,
        borderRadius: 4,
        padding: '36px 24px',
        textAlign: 'center',
        cursor: 'pointer',
        background: drag ? t.blueBg : t.surfaceAlt,
        transition: 'all .15s',
        marginBottom: 16,
      }}>
      <div style={{ fontSize: 22, color: t.textDim, marginBottom: 10, fontFamily: 'monospace' }}>↑</div>
      <div style={{ fontSize: 13, fontWeight: 500, color: name ? t.blue : t.text, marginBottom: 4, fontFamily: "'DM Sans', sans-serif" }}>
        {name || label}
      </div>
      <div style={{ fontSize: 11, color: t.textMuted, letterSpacing: '0.06em', fontFamily: "'DM Mono', monospace" }}>
        {accept.toUpperCase()} · {multiple ? 'Multiple files supported' : 'Single file'}
      </div>
      <input ref={ref} type="file" accept={accept} multiple={multiple} style={{ display: 'none' }} onChange={e => process(e.target.files)} />
    </div>
  );
}

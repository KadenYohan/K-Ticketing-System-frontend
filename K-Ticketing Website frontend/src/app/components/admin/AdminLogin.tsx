import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { ShieldCheck, Eye, EyeOff, AlertCircle } from 'lucide-react';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setTimeout(() => {
      if (username === 'admin' && password === 'admin123') {
        localStorage.setItem('k_admin_auth', '1');
        navigate('/admin/dashboard');
      } else {
        setError('Invalid username or password. Try: admin / admin123');
        setLoading(false);
      }
    }, 800);
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#16171D', fontFamily: 'Inter, system-ui, sans-serif', position: 'relative', overflow: 'hidden',
    }}>
      {/* Background blobs */}
      {[
        { w: 500, h: 500, top: '-150px', left: '-100px', color: 'rgba(212, 168, 0,0.12)' },
        { w: 400, h: 400, bottom: '-100px', right: '-80px', color: 'rgba(59,130,246,0.1)' },
      ].map((b, i) => (
        <motion.div key={i}
          animate={{ scale: [1, 1.1, 1], opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 8 + i * 3, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute', borderRadius: '50%', width: b.w, height: b.h,
            background: `radial-gradient(circle, ${b.color}, transparent 70%)`,
            top: (b as any).top, left: (b as any).left, right: (b as any).right, bottom: (b as any).bottom,
            pointerEvents: 'none',
          }}
        />
      ))}

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4 }}
        style={{
          width: 420, background: '#1E1F27', borderRadius: 24, padding: '40px 36px',
          border: '1px solid #2E303A', boxShadow: '0 24px 64px rgba(0,0,0,0.4)',
          position: 'relative', zIndex: 1,
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 64, height: 64, borderRadius: 18, background: '#D4A800',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px', boxShadow: '0 8px 24px rgba(212, 168, 0,0.4)',
          }}>
            <ShieldCheck size={32} color="#fff" />
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#F3F4F6', marginBottom: 6 }}>K-Ticketing Admin</h1>
          <p style={{ fontSize: 14, color: '#6B7280' }}>Sign in to access the dashboard</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#9CA3AF', marginBottom: 6, letterSpacing: '0.3px' }}>
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="admin"
              autoFocus
              style={{
                width: '100%', height: 48, padding: '0 14px', borderRadius: 10,
                border: '1.5px solid #2E303A', background: '#16171D',
                color: '#F3F4F6', fontSize: 15, outline: 'none', boxSizing: 'border-box',
                transition: 'border-color 0.15s', fontFamily: 'Inter, sans-serif',
              }}
              onFocus={e => (e.target as HTMLInputElement).style.borderColor = '#D4A800'}
              onBlur={e => (e.target as HTMLInputElement).style.borderColor = '#2E303A'}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#9CA3AF', marginBottom: 6, letterSpacing: '0.3px' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{
                  width: '100%', height: 48, padding: '0 44px 0 14px', borderRadius: 10,
                  border: '1.5px solid #2E303A', background: '#16171D',
                  color: '#F3F4F6', fontSize: 15, outline: 'none', boxSizing: 'border-box',
                  transition: 'border-color 0.15s', fontFamily: 'Inter, sans-serif',
                }}
                onFocus={e => (e.target as HTMLInputElement).style.borderColor = '#D4A800'}
                onBlur={e => (e.target as HTMLInputElement).style.borderColor = '#2E303A'}
              />
              <button
                type="button"
                onClick={() => setShowPw(v => !v)}
                style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280', padding: 0 }}
              >
                {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: 'rgba(239,68,68,0.1)', borderRadius: 8, border: '1px solid rgba(239,68,68,0.2)' }}>
              <AlertCircle size={15} color="#EF4444" />
              <span style={{ fontSize: 13, color: '#EF4444' }}>{error}</span>
            </motion.div>
          )}

          <button
            type="submit"
            disabled={loading || !username || !password}
            style={{
              marginTop: 8, width: '100%', height: 48, borderRadius: 10, border: 'none',
              background: username && password ? '#D4A800' : '#2E303A',
              color: username && password ? '#fff' : '#6B7280',
              fontSize: 15, fontWeight: 700, cursor: username && password ? 'pointer' : 'not-allowed',
              boxShadow: username && password ? '0 4px 16px rgba(212, 168, 0,0.35)' : 'none',
              transition: 'all 0.2s', fontFamily: 'Inter, sans-serif',
            }}
          >
            {loading ? 'Signing in…' : 'Sign In →'}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: 12, color: '#4B5563', marginTop: 24 }}>
          Authorized personnel only. Hint: admin / admin123
        </p>
      </motion.div>
    </div>
  );
}

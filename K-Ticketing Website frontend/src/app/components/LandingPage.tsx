import { Link } from 'react-router';
import { motion } from 'motion/react';
import { ArrowRight, Ticket, Smartphone, CheckCircle2, MapPin, Clock, ChevronRight } from 'lucide-react';
import { DESTINATIONS } from '../data/mockData';

const FEATURED = [
  { id: 'calamba', name: 'Calamba', tagline: 'South Luzon Express', duration: '1.5 hrs', price: 120, gradient: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)' },
  { id: 'alabang', name: 'Alabang Town Center', tagline: 'Metro South Hub', duration: '45 min', price: 80, gradient: 'linear-gradient(135deg, #0f172a 0%, #334155 100%)' },
  { id: 'nuvali', name: 'Nuvali', tagline: 'Santa Rosa Lifestyle City', duration: '2 hrs', price: 150, gradient: 'linear-gradient(135deg, #b45309 0%, #d97706 100%)' },
];

const HOW_IT_WORKS = [
  { step: 1, title: 'Choose Your Destination', desc: 'Browse available routes from One Ayala Makati to your destination.', icon: MapPin, color: '#D4A800' },
  { step: 2, title: 'Select Your Seat', desc: 'Pick your preferred seat from the live seat map — see availability in real time.', icon: Ticket, color: '#3B82F6' },
  { step: 3, title: 'Pay via GCash or Cash', desc: 'Instant payment via GCash QR code, or pay with cash at the terminal kiosk.', icon: Smartphone, color: '#22C55E' },
  { step: 4, title: 'Show QR to Board', desc: 'Your digital ticket QR code is your boarding pass. The conductor scans it.', icon: CheckCircle2, color: '#F59E0B' },
];

const FEATURES = [
  { icon: Ticket, title: 'Instant Booking', body: 'Select your seat and pay via GCash or cash at the terminal — your ticket is issued in seconds.' },
  { icon: Smartphone, title: 'No App Required', body: 'Open K-Ticketing in any browser. No download, no account needed. Just book and go.' },
  { icon: CheckCircle2, title: 'Scan & Board', body: 'Your QR ticket is your boarding pass. The conductor scans it directly from your screen.' },
];

export default function LandingPage() {
  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* HERO */}
      <section style={{
        position: 'relative', overflow: 'hidden',
        minHeight: '92vh', display: 'flex', alignItems: 'center',
        background: 'linear-gradient(135deg, #020617 0%, #0f172a 40%, #1e293b 100%)',
      }}>
        {/* Animated blobs */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
          {[
            { w: 600, h: 600, top: '-200px', left: '-150px', color: 'rgba(212, 168, 0,0.25)' },
            { w: 500, h: 500, top: '100px', right: '-100px', color: 'rgba(59,130,246,0.2)' },
            { w: 400, h: 400, bottom: '-100px', left: '30%', color: 'rgba(212, 168, 0,0.2)' },
          ].map((b, i) => (
            <motion.div
              key={i}
              animate={{ scale: [1, 1.15, 1], opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 6 + i * 2, repeat: Infinity, ease: 'easeInOut', delay: i * 1.5 }}
              style={{
                position: 'absolute', borderRadius: '50%',
                width: b.w, height: b.h,
                background: `radial-gradient(circle, ${b.color}, transparent 70%)`,
                top: (b as any).top, left: (b as any).left,
                right: (b as any).right, bottom: (b as any).bottom,
              }}
            />
          ))}
        </div>

        <div style={{ position: 'relative', maxWidth: 1280, margin: '0 auto', padding: '80px 40px', textAlign: 'center', width: '100%' }}>
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px',
              background: 'rgba(212, 168, 0,0.15)', border: '1px solid rgba(212, 168, 0,0.4)',
              borderRadius: 999, marginBottom: 32 }}
          >
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22C55E', boxShadow: '0 0 8px #22C55E' }} />
            <span style={{ fontSize: 13, fontWeight: 600, color: '#facc15', letterSpacing: '0.6px' }}>LIVE — P2P BUS TERMINAL BOOKING</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{ fontSize: 'clamp(48px, 8vw, 80px)', fontWeight: 700, color: '#F3F4F6', lineHeight: 1.1, letterSpacing: '-3px', marginBottom: 24 }}
          >
            K-Ticketing
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{ fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: 600, color: '#facc15', marginBottom: 16, letterSpacing: '-0.5px' }}
          >
            Fast. Simple. Reliable.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            style={{ fontSize: 18, color: '#9CA3AF', maxWidth: 560, margin: '0 auto 48px', lineHeight: 1.7 }}
          >
            Bus tickets for Calamba, Alabang, Nuvali, and more — directly from One Ayala Makati. No queuing required.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}
          >
            <Link
              to="/book"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '16px 32px', borderRadius: 12, textDecoration: 'none',
                background: '#D4A800', color: '#fff', fontSize: 17, fontWeight: 700,
                boxShadow: '0 8px 32px rgba(212, 168, 0,0.45)',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 40px rgba(212, 168, 0,0.55)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 32px rgba(212, 168, 0,0.45)'; }}
            >
              Book a Ticket Now <ArrowRight size={18} />
            </Link>
            <Link
              to="/routes"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '16px 32px', borderRadius: 12, textDecoration: 'none',
                background: 'rgba(255,255,255,0.08)', color: '#F3F4F6', fontSize: 17, fontWeight: 600,
                border: '1px solid rgba(255,255,255,0.15)', transition: 'all 0.2s',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.14)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)'; }}
            >
              View Routes
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            style={{ display: 'flex', justifyContent: 'center', gap: 48, marginTop: 72, flexWrap: 'wrap' }}
          >
            {[
              { label: 'Routes Available', value: '7' },
              { label: 'Daily Departures', value: '30+' },
              { label: 'Passengers Today', value: '847' },
            ].map(({ label, value }) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 40, fontWeight: 700, color: '#F3F4F6', letterSpacing: '-1.5px' }}>{value}</div>
                <div style={{ fontSize: 13, color: '#6B7280', marginTop: 4 }}>{label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FEATURE STRIP */}
      <section style={{ background: '#F9F8FD', padding: '80px 40px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#D4A800', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 12 }}>WHY K-TICKETING</div>
            <h2 style={{ fontSize: 40, fontWeight: 700, color: '#0f172a', letterSpacing: '-1px', marginBottom: 16 }}>
              Commuting, reimagined
            </h2>
            <p style={{ fontSize: 17, color: '#6B6375', maxWidth: 520, margin: '0 auto', lineHeight: 1.7 }}>
              Built for the modern Filipino commuter — fast, accessible, and designed to work on any device.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            {FEATURES.map(({ icon: Icon, title, body }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                style={{
                  background: '#fff', borderRadius: 16, padding: 32,
                  border: '1px solid #E5E4E7', boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 10px 30px rgba(0,0,0,0.08)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(212, 168, 0,0.3)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)'; (e.currentTarget as HTMLElement).style.borderColor = '#E5E4E7'; }}
              >
                <div style={{
                  width: 52, height: 52, borderRadius: 14, background: 'rgba(212, 168, 0,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20,
                }}>
                  <Icon size={24} color="#D4A800" />
                </div>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: '#0f172a', marginBottom: 10 }}>{title}</h3>
                <p style={{ fontSize: 15, color: '#6B6375', lineHeight: 1.7 }}>{body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* DESTINATION CARDS */}
      <section style={{ padding: '80px 40px', background: '#fff' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 40, flexWrap: 'wrap', gap: 16 }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#D4A800', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 12 }}>POPULAR DESTINATIONS</div>
              <h2 style={{ fontSize: 40, fontWeight: 700, color: '#0f172a', letterSpacing: '-1px' }}>
                Where are you headed?
              </h2>
            </div>
            <Link to="/routes" style={{ display: 'flex', alignItems: 'center', gap: 6, textDecoration: 'none', color: '#D4A800', fontSize: 15, fontWeight: 600 }}>
              View all routes <ChevronRight size={18} />
            </Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
            {FEATURED.map(({ id, name, tagline, duration, price, gradient }, i) => (
              <motion.div
                key={id}
                initial={{ opacity: 0, scale: 0.96 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                style={{ borderRadius: 20, overflow: 'hidden', position: 'relative', background: gradient, cursor: 'pointer', minHeight: 240 }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 20px 40px rgba(0,0,0,0.18)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}
                >
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.55))' }} />
                <div style={{ position: 'relative', padding: 28, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: 240 }}>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.7)', letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: 8 }}>{tagline}</div>
                    <h3 style={{ fontSize: 28, fontWeight: 700, color: '#fff', letterSpacing: '-0.5px', lineHeight: 1.2, marginBottom: 8 }}>{name}</h3>
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.2)', padding: '5px 12px', borderRadius: 999 }}>
                        <Clock size={13} color="#fff" />
                        <span style={{ fontSize: 13, color: '#fff', fontWeight: 500 }}>{duration}</span>
                      </div>
                      <div style={{ fontSize: 15, color: '#fff', fontWeight: 700 }}>from ₱{price}</div>
                    </div>
                    <Link
                      to={`/book?dest=${id}`}
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: 6,
                        padding: '10px 20px', borderRadius: 10, textDecoration: 'none',
                        background: '#fff', color: '#0f172a', fontSize: 14, fontWeight: 700,
                        transition: 'all 0.15s',
                      }}
                    >
                      Book Now <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ background: 'linear-gradient(135deg, #020617 0%, #0f172a 100%)', padding: '80px 40px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#facc15', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 12 }}>SIMPLE PROCESS</div>
            <h2 style={{ fontSize: 40, fontWeight: 700, color: '#F3F4F6', letterSpacing: '-1px', marginBottom: 16 }}>
              How It Works
            </h2>
            <p style={{ fontSize: 17, color: '#9CA3AF', maxWidth: 480, margin: '0 auto', lineHeight: 1.7 }}>
              From choosing your seat to boarding the bus — the whole process takes under two minutes.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24, position: 'relative' }}>
            {HOW_IT_WORKS.map(({ step, title, desc, icon: Icon, color }, i) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                style={{
                  background: '#1E1F27', borderRadius: 16, padding: 28,
                  border: '1px solid #2E303A', position: 'relative',
                }}
              >
                <div style={{
                  width: 48, height: 48, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: `rgba(${color === '#D4A800' ? '212, 168, 0' : color === '#3B82F6' ? '59,130,246' : color === '#22C55E' ? '34,197,94' : '245,158,11'},0.15)`,
                  marginBottom: 16,
                }}>
                  <Icon size={22} color={color} />
                </div>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#4B5563', letterSpacing: '1px', marginBottom: 8 }}>STEP {step}</div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: '#F3F4F6', marginBottom: 10, lineHeight: 1.3 }}>{title}</h3>
                <p style={{ fontSize: 14, color: '#9CA3AF', lineHeight: 1.7 }}>{desc}</p>
              </motion.div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: 56 }}>
            <Link
              to="/book"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '18px 36px', borderRadius: 12, textDecoration: 'none',
                background: '#D4A800', color: '#fff', fontSize: 17, fontWeight: 700,
                boxShadow: '0 8px 32px rgba(212, 168, 0,0.45)',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
            >
              Ready? Book Your Seat <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ALL DESTINATIONS */}
      <section style={{ background: '#F9F8FD', padding: '80px 40px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <h2 style={{ fontSize: 36, fontWeight: 700, color: '#0f172a', letterSpacing: '-0.8px', marginBottom: 12 }}>
              All Destinations
            </h2>
            <p style={{ fontSize: 16, color: '#6B6375' }}>From One Ayala Makati to your destination</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
            {DESTINATIONS.map(({ id, name, duration, priceFrom }) => (
              <Link
                key={id}
                to={`/book?dest=${id}`}
                style={{
                  display: 'flex', flexDirection: 'column', gap: 4, padding: '20px 24px',
                  background: '#fff', borderRadius: 12, border: '1px solid #E5E4E7',
                  textDecoration: 'none', transition: 'all 0.15s',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(212, 168, 0,0.4)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 20px rgba(0,0,0,0.07)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '#E5E4E7'; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <MapPin size={16} color="#D4A800" />
                  <span style={{ fontSize: 15, fontWeight: 600, color: '#0f172a' }}>{name}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                  <span style={{ fontSize: 13, color: '#9CA3AF' }}>{duration}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#D4A800' }}>from ₱{priceFrom}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

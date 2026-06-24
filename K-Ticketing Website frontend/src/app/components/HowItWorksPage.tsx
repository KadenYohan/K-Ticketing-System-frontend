import { Link } from 'react-router';
import { motion } from 'motion/react';
import { ChevronDown, ChevronUp, ArrowRight, Ticket, MapPin, Smartphone, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';

const STEPS = [
  {
    step: 1, title: 'Choose Your Destination & Bus', icon: MapPin, color: '#D4A800',
    desc: 'Start by selecting where you\'re headed. Browse all available routes from One Ayala Makati — Calamba, Alabang Town Center, Nuvali, Imus Cavite, Robinsons Antipolo, and more. Then pick a departure time that works for you.',
    details: ['Real-time seat availability shown for each departure', 'Departed buses are clearly marked so you don\'t waste time', 'Prices displayed upfront — no hidden fees'],
  },
  {
    step: 2, title: 'Select Your Preferred Seat', icon: Ticket, color: '#3B82F6',
    desc: 'Our live seat map shows you exactly which seats are available, reserved, or already booked. Click to select your seats — you can pick multiple seats for your group. The map updates in real time.',
    details: ['Color-coded seat states: green=available, grey=reserved, red=booked', 'Select multiple seats for group bookings', 'Refresh button to get the latest availability'],
  },
  {
    step: 3, title: 'Pay via GCash or Cash', icon: Smartphone, color: '#22C55E',
    desc: 'Once you\'ve picked your seats, you have 5 minutes to complete payment before your reservation expires. On the website, pay via GCash — scan the QR code or tap "Open GCash Checkout." At the terminal kiosk, you can also pay with cash.',
    details: ['GCash payment via PayMongo — instant confirmation', 'Cash payment available at the kiosk terminal only', '5-minute countdown timer keeps your reservation active'],
  },
  {
    step: 4, title: 'Show Your QR Code to Board', icon: CheckCircle2, color: '#F59E0B',
    desc: 'After payment, you\'ll receive a digital ticket with a unique QR code. Screenshot it or find it anytime at kticketing.ph/tickets. When boarding, show the QR code to the conductor who will scan it with the handheld scanner.',
    details: ['QR code is your boarding pass — no printed ticket needed', 'Find your ticket anytime by visiting My Tickets', 'The conductor\'s scanner validates your ticket in under a second'],
  },
];

const FAQS = [
  { q: 'Can I cancel my booking?', a: 'Cancellations are handled at the terminal. Please approach the ticketing staff at least 30 minutes before your departure for assistance. Cancellation policies may apply.' },
  { q: 'What if I miss my bus?', a: 'Your QR ticket is tied to a specific departure. If you miss your bus, please contact the terminal staff. Rebooking is subject to availability on the next scheduled departure.' },
  { q: 'How many seats can I book at once?', a: 'You can select up to 10 seats in a single booking. For larger groups, please contact the terminal directly.' },
  { q: 'Is my QR ticket transferable?', a: 'QR tickets are meant for the passenger who booked them. However, there is no name verification on standard fares — the conductor only scans the code. Please keep your QR code private.' },
  { q: 'What if the payment fails?', a: 'If your GCash payment fails or times out, your seat reservation will be automatically released after the 5-minute window. You can start a new booking and try again.' },
  { q: 'Can I book for tomorrow or future dates?', a: 'The system currently supports same-day bookings only. Advance booking for future dates is coming in the next update.' },
  { q: 'What does "Reserved" mean on the seat map?', a: 'A "Reserved" seat is temporarily held by another passenger who is currently in the payment step. If they don\'t complete payment within 5 minutes, the seat will be released back to available.' },
  { q: 'Is this system available on mobile?', a: 'Yes! K-Ticketing is a web-based system that works on any device with a browser — smartphone, tablet, or desktop. No app download required.' },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: '1px solid #E5E4E7' }}>
      <button
        onClick={() => setOpen(v => !v)}
        style={{
          width: '100%', padding: '20px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
        }}
      >
        <span style={{ fontSize: 16, fontWeight: 600, color: '#0f172a', paddingRight: 16 }}>{q}</span>
        {open ? <ChevronUp size={20} color="#D4A800" /> : <ChevronDown size={20} color="#9CA3AF" />}
      </button>
      <motion.div
        initial={false}
        animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        style={{ overflow: 'hidden' }}
      >
        <p style={{ fontSize: 15, color: '#6B6375', lineHeight: 1.8, paddingBottom: 20 }}>{a}</p>
      </motion.div>
    </div>
  );
}

export default function HowItWorksPage() {
  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', background: '#fff' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #020617, #0f172a)', padding: '56px 40px 48px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#facc15', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 12 }}>GETTING STARTED</div>
          <h1 style={{ fontSize: 52, fontWeight: 700, color: '#F3F4F6', letterSpacing: '-2px', marginBottom: 16 }}>How It Works</h1>
          <p style={{ fontSize: 18, color: '#9CA3AF', maxWidth: 560, margin: '0 auto', lineHeight: 1.7 }}>
            Everything you need to know about booking your P2P bus ticket in four simple steps.
          </p>
        </div>
      </div>

      {/* Steps */}
      <div style={{ padding: '80px 40px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 64 }}>
          {STEPS.map(({ step, title, icon: Icon, color, desc, details }, i) => (
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              style={{
                display: 'grid',
                gridTemplateColumns: i % 2 === 0 ? '1fr 1fr' : '1fr 1fr',
                gap: 64, alignItems: 'center',
                direction: i % 2 === 1 ? 'rtl' : 'ltr',
              }}
              className="hiw-step"
            >
              {/* Visual side */}
              <div style={{ direction: 'ltr' }}>
                <div style={{
                  background: `linear-gradient(135deg, rgba(${color === '#D4A800' ? '212, 168, 0' : color === '#3B82F6' ? '59,130,246' : color === '#22C55E' ? '34,197,94' : '245,158,11'},0.08), rgba(${color === '#D4A800' ? '212, 168, 0' : color === '#3B82F6' ? '59,130,246' : color === '#22C55E' ? '34,197,94' : '245,158,11'},0.03))`,
                  borderRadius: 24, padding: 48, border: `1px solid rgba(${color === '#D4A800' ? '212, 168, 0' : color === '#3B82F6' ? '59,130,246' : color === '#22C55E' ? '34,197,94' : '245,158,11'},0.15)`,
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20, minHeight: 280,
                }}>
                  <div style={{
                    width: 96, height: 96, borderRadius: 28, background: `rgba(${color === '#D4A800' ? '212, 168, 0' : color === '#3B82F6' ? '59,130,246' : color === '#22C55E' ? '34,197,94' : '245,158,11'},0.12)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: `2px solid rgba(${color === '#D4A800' ? '212, 168, 0' : color === '#3B82F6' ? '59,130,246' : color === '#22C55E' ? '34,197,94' : '245,158,11'},0.3)`,
                  }}>
                    <Icon size={48} color={color} />
                  </div>
                  <div style={{ fontSize: 80, fontWeight: 800, color: `rgba(${color === '#D4A800' ? '212, 168, 0' : color === '#3B82F6' ? '59,130,246' : color === '#22C55E' ? '34,197,94' : '245,158,11'},0.12)`, lineHeight: 1 }}>
                    {step}
                  </div>
                </div>
              </div>

              {/* Text side */}
              <div style={{ direction: 'ltr' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: color, letterSpacing: '1.2px', textTransform: 'uppercase', marginBottom: 12 }}>STEP {step}</div>
                <h2 style={{ fontSize: 32, fontWeight: 700, color: '#0f172a', letterSpacing: '-0.6px', marginBottom: 16, lineHeight: 1.2 }}>{title}</h2>
                <p style={{ fontSize: 16, color: '#6B6375', lineHeight: 1.8, marginBottom: 24 }}>{desc}</p>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {details.map((d, j) => (
                    <li key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                      <div style={{ width: 20, height: 20, borderRadius: '50%', background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                        <span style={{ color: '#fff', fontSize: 11, fontWeight: 800 }}>✓</span>
                      </div>
                      <span style={{ fontSize: 15, color: '#6B6375', lineHeight: 1.6 }}>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div style={{ background: '#F9F8FD', padding: '80px 40px' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#D4A800', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 12 }}>GOT QUESTIONS?</div>
            <h2 style={{ fontSize: 40, fontWeight: 700, color: '#0f172a', letterSpacing: '-1px' }}>Frequently Asked Questions</h2>
          </div>
          <div>
            {FAQS.map(({ q, a }) => <FaqItem key={q} q={q} a={a} />)}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{ background: 'linear-gradient(135deg, #020617, #0f172a)', padding: '80px 40px', textAlign: 'center' }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <h2 style={{ fontSize: 40, fontWeight: 700, color: '#F3F4F6', letterSpacing: '-1px', marginBottom: 16 }}>Ready to book?</h2>
          <p style={{ fontSize: 17, color: '#9CA3AF', marginBottom: 32, lineHeight: 1.7 }}>
            Your bus seat is waiting. Book in under two minutes — no account needed.
          </p>
          <Link
            to="/book"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '18px 36px', borderRadius: 12, textDecoration: 'none',
              background: '#D4A800', color: '#fff', fontSize: 17, fontWeight: 700,
              boxShadow: '0 8px 32px rgba(212, 168, 0,0.45)',
            }}
          >
            Book a Ticket Now <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
}

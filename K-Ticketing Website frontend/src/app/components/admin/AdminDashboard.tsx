import { motion } from 'motion/react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Bus, Ticket, TrendingUp, Users, ArrowUpRight } from 'lucide-react';
import { ADMIN_KPI, BOOKING_TIMELINE, PAYMENT_SPLIT, DESTINATION_BREAKDOWN, TICKETS, BUSES } from '../../data/mockData';

const DARK = { bg: '#16171D', surface: '#1E1F27', border: '#2E303A', text: '#F3F4F6', muted: '#9CA3AF', accent: '#facc15' };

function KpiCard({ label, value, icon: Icon, color, trend }: { label: string; value: string; icon: any; color: string; trend?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        background: DARK.surface, borderRadius: 16, padding: 24, border: `1px solid ${DARK.border}`,
        display: 'flex', flexDirection: 'column', gap: 16,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: `rgba(${color},0.12)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={22} color={`rgb(${color})`} />
        </div>
        {trend && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 10px', background: 'rgba(34,197,94,0.1)', borderRadius: 999 }}>
            <ArrowUpRight size={12} color="#22C55E" />
            <span style={{ fontSize: 12, fontWeight: 600, color: '#22C55E' }}>{trend}</span>
          </div>
        )}
      </div>
      <div>
        <div style={{ fontSize: 32, fontWeight: 700, color: DARK.text, letterSpacing: '-1px', lineHeight: 1.1 }}>{value}</div>
        <div style={{ fontSize: 13, color: DARK.muted, marginTop: 4, fontWeight: 500 }}>{label}</div>
      </div>
    </motion.div>
  );
}

const chartTooltipStyle = {
  background: '#1E1F27', border: '1px solid #2E303A', borderRadius: 8,
  color: '#F3F4F6', fontSize: 13,
};

export default function AdminDashboard() {
  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', color: DARK.text }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: '#6B7280', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 6 }}>
          OVERVIEW — JUNE 23, 2026
        </div>
        <h1 style={{ fontSize: 32, fontWeight: 700, color: DARK.text, letterSpacing: '-0.8px' }}>Dashboard</h1>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 28 }}>
        <KpiCard label="Total Buses Today" value={String(ADMIN_KPI.totalBuses)} icon={Bus} color="212, 168, 0" trend="+2" />
        <KpiCard label="Tickets Issued" value={String(ADMIN_KPI.ticketsIssued)} icon={Ticket} color="59,130,246" trend="+15%" />
        <KpiCard label="Revenue Today" value={`₱${ADMIN_KPI.revenue.toLocaleString()}`} icon={TrendingUp} color="34,197,94" trend="+8%" />
        <KpiCard label="Occupancy Rate" value={`${ADMIN_KPI.occupancyRate}%`} icon={Users} color="245,158,11" />
      </div>

      {/* Charts row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 280px', gap: 20, marginBottom: 28 }}>
        {/* Booking timeline */}
        <div style={{ background: DARK.surface, borderRadius: 16, padding: 24, border: `1px solid ${DARK.border}` }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: DARK.text, marginBottom: 20 }}>Bookings Timeline</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={BOOKING_TIMELINE}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2E303A" />
              <XAxis dataKey="hour" tick={{ fill: '#6B7280', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#6B7280', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={chartTooltipStyle} />
              <Line type="monotone" dataKey="bookings" stroke="#D4A800" strokeWidth={2.5} dot={{ fill: '#D4A800', r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Destination breakdown */}
        <div style={{ background: DARK.surface, borderRadius: 16, padding: 24, border: `1px solid ${DARK.border}` }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: DARK.text, marginBottom: 20 }}>Buses by Destination</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={DESTINATION_BREAKDOWN} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#2E303A" horizontal={false} />
              <XAxis type="number" tick={{ fill: '#6B7280', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fill: '#9CA3AF', fontSize: 12 }} axisLine={false} tickLine={false} width={70} />
              <Tooltip contentStyle={chartTooltipStyle} />
              <Bar dataKey="buses" fill="#D4A800" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Payment split */}
        <div style={{ background: DARK.surface, borderRadius: 16, padding: 24, border: `1px solid ${DARK.border}` }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: DARK.text, marginBottom: 20 }}>Payment Split</h3>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={PAYMENT_SPLIT} cx="50%" cy="50%" innerRadius={50} outerRadius={72} dataKey="value" paddingAngle={3}>
                {PAYMENT_SPLIT.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={chartTooltipStyle} formatter={(v, n) => [`${v} txns`, n]} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
            {PAYMENT_SPLIT.map(({ name, value, color }) => (
              <div key={name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 3, background: color }} />
                  <span style={{ fontSize: 13, color: '#9CA3AF' }}>{name}</span>
                </div>
                <span style={{ fontSize: 13, fontWeight: 700, color: DARK.text }}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent tickets table */}
      <div style={{ background: DARK.surface, borderRadius: 16, border: `1px solid ${DARK.border}` }}>
        <div style={{ padding: '20px 24px', borderBottom: `1px solid ${DARK.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: DARK.text }}>Recent Tickets</h3>
          <span style={{ fontSize: 12, color: '#6B7280', fontWeight: 500 }}>Last 10 transactions</span>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${DARK.border}` }}>
              {['TICKET ID', 'ROUTE', 'SEATS', 'PAYMENT', 'AMOUNT', 'BOARDED'].map(h => (
                <th key={h} style={{ padding: '10px 20px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#6B7280', letterSpacing: '0.6px', background: '#1F2028' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TICKETS.slice(0, 10).map((t, i) => (
              <tr key={t.id} style={{ borderBottom: i < 9 ? `1px solid #1F2028` : 'none', transition: 'background 0.15s' }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.02)'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}>
                <td style={{ padding: '12px 20px' }}>
                  <span style={{ fontSize: 12, fontFamily: 'monospace', color: DARK.accent, background: 'rgba(192,132,252,0.1)', padding: '3px 8px', borderRadius: 6 }}>{t.id}</span>
                </td>
                <td style={{ padding: '12px 20px', fontSize: 13, color: '#9CA3AF', maxWidth: 200 }}>{t.destination}</td>
                <td style={{ padding: '12px 20px', fontSize: 13, color: DARK.text, fontWeight: 500 }}>{t.seats.join(', ')}</td>
                <td style={{ padding: '12px 20px' }}>
                  <span style={{
                    padding: '3px 8px', borderRadius: 999, fontSize: 11, fontWeight: 700,
                    background: t.paymentMethod === 'gcash' ? 'rgba(0,125,255,0.1)' : 'rgba(22,163,74,0.1)',
                    color: t.paymentMethod === 'gcash' ? '#3B82F6' : '#22C55E',
                  }}>{t.paymentMethod.toUpperCase()}</span>
                </td>
                <td style={{ padding: '12px 20px', fontSize: 14, fontWeight: 700, color: DARK.text }}>₱{t.amount}</td>
                <td style={{ padding: '12px 20px' }}>
                  <span style={{
                    padding: '3px 8px', borderRadius: 999, fontSize: 11, fontWeight: 700,
                    background: t.boarded ? 'rgba(34,197,94,0.1)' : 'rgba(107,99,117,0.1)',
                    color: t.boarded ? '#22C55E' : '#9CA3AF',
                  }}>{t.boarded ? 'BOARDED' : 'PENDING'}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

import { createBrowserRouter } from 'react-router';
import Layout from './components/Layout';
import LandingPage from './components/LandingPage';
import BookingWizard from './components/BookingWizard';
import RoutesPage from './components/RoutesPage';
import HowItWorksPage from './components/HowItWorksPage';
import TicketLookupPage from './components/TicketLookupPage';
import AdminLogin from './components/admin/AdminLogin';
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './components/admin/AdminDashboard';
import AdminBuses from './components/admin/AdminBuses';
import AdminBusDetail from './components/admin/AdminBusDetail';
import AdminTickets from './components/admin/AdminTickets';
import AdminPayments from './components/admin/AdminPayments';
import AdminSettings from './components/admin/AdminSettings';
import AdminSeed from './components/admin/AdminSeed';
import AdminScanner from './components/admin/AdminScanner';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      { index: true, Component: LandingPage },
      { path: 'book', Component: BookingWizard },
      { path: 'routes', Component: RoutesPage },
      { path: 'how-it-works', Component: HowItWorksPage },
      { path: 'tickets', Component: TicketLookupPage },
    ],
  },
  { path: '/admin', Component: AdminLogin },
  {
    Component: AdminLayout,
    children: [
      { path: '/admin/dashboard', Component: AdminDashboard },
      { path: '/admin/buses', Component: AdminBuses },
      { path: '/admin/buses/:busId', Component: AdminBusDetail },
      { path: '/admin/tickets', Component: AdminTickets },
      { path: '/admin/payments', Component: AdminPayments },
      { path: '/admin/scanner', Component: AdminScanner },
      { path: '/admin/settings', Component: AdminSettings },
      { path: '/admin/seed', Component: AdminSeed },
    ],
  },
]);

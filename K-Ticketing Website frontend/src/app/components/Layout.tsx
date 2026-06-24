import { Outlet } from 'react-router';
import { NavBar } from './NavBar';
import { Footer } from './Footer';

export default function Layout() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#fff', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <NavBar />
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

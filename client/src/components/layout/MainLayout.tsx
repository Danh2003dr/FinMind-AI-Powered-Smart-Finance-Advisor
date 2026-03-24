import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';

export function MainLayout() {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return (
    <div className="dark fin-app-bg min-h-screen font-inter text-on-background selection:bg-primary/30">
      <Sidebar />
      <div className="flex min-h-screen min-w-0 flex-col md:ml-64">
        <Navbar />
        <main className="flex min-h-0 min-w-0 flex-1 flex-col overflow-x-hidden px-6 py-6 md:px-10 md:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

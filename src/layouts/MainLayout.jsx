import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function MainLayout({ children }) {
  return (
    <div className="relative flex min-h-screen w-full min-w-0 flex-col overflow-x-clip text-[#0F3040]">
      <Navbar />

      <div className="relative z-10 w-full min-w-0 flex-1">{children}</div>

      <Footer />
    </div>
  );
}

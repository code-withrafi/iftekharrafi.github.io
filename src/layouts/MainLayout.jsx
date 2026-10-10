import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function MainLayout({ children }) {
  return (
    <div className="relative min-h-screen w-full overflow-x-hidden text-[#0F3040]">
      <Navbar />

      <main className="relative z-10 w-full">{children}</main>

      <Footer />
    </div>
  );
}

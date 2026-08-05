import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function MainLayout({ children }) {
  return (
    <div className="relative min-h-screen overflow-x-hidden text-[#0F3040]">
      {/* Navigation */}

      <Navbar />

      {/* Page Content */}

      <main className="relative z-10">{children}</main>

      {/* Footer */}

      <Footer />
    </div>
  );
}

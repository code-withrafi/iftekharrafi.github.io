import { useEffect } from 'react';

import Lenis from 'lenis';

export default function useSmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      smoothWheel: true,

      duration: 1.2,
    });

    function raf(time) {
      lenis.raf(time);

      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);
}

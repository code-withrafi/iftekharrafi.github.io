import { useEffect, useState } from 'react';

export default function useMousePosition() {
  const [position, setPosition] = useState({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    function handleMouseMove(event) {
      setPosition({
        x: event.clientX / window.innerWidth - 0.5,

        y: -(event.clientY / window.innerHeight - 0.5),
      });
    }

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return position;
}

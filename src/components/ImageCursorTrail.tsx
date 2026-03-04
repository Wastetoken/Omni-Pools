import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const TRAIL_IMAGES = [
  'https://pub-5a76c67414e24796a5bd7ac87486acd0.r2.dev/pexels-alexander-f-ungerer-157458816-19830216.jpg',
  'https://pub-5a76c67414e24796a5bd7ac87486acd0.r2.dev/pexels-artbovich-8134746.jpg',
  'https://pub-5a76c67414e24796a5bd7ac87486acd0.r2.dev/pexels-artbovich-8134750.jpg',
  'https://pub-5a76c67414e24796a5bd7ac87486acd0.r2.dev/pexels-bertellifotografia-9056671.jpg',
  'https://pub-5a76c67414e24796a5bd7ac87486acd0.r2.dev/pexels-eric-mufasa-578798-1746876.jpg',
  'https://pub-5a76c67414e24796a5bd7ac87486acd0.r2.dev/pexels-jamily-chaves-136935520-14402819.jpg',
  'https://pub-5a76c67414e24796a5bd7ac87486acd0.r2.dev/pexels-jokassis-5515733.jpg',
  'https://pub-5a76c67414e24796a5bd7ac87486acd0.r2.dev/pexels-jonathanborba-5563468.jpg',
];

export const ImageCursorTrail = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentIndex = useRef(0);
  const lastMousePos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMove = (e: MouseEvent | TouchEvent) => {
      const rect = container.getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      // Only trigger if mouse is within the container bounds
      if (
        clientX < rect.left ||
        clientX > rect.right ||
        clientY < rect.top ||
        clientY > rect.bottom
      ) {
        return;
      }

      const x = clientX - rect.left;
      const y = clientY - rect.top;
      const dist = Math.hypot(clientX - lastMousePos.current.x, clientY - lastMousePos.current.y);
      
      if (dist > 100) {
        const img = imagesRef.current[currentIndex.current];
        if (img) {
          gsap.set(img, {
            x: x,
            y: y,
            opacity: 1,
            scale: 1,
            rotation: Math.random() * 20 - 10,
          });

          gsap.to(img, {
            opacity: 0,
            scale: 0.5,
            duration: 1,
            ease: 'power2.out',
            overwrite: true,
          });

          currentIndex.current = (currentIndex.current + 1) % TRAIL_IMAGES.length;
          lastMousePos.current = { x: clientX, y: clientY };
        }
      }
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('touchmove', handleMove);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('touchmove', handleMove);
    };
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0" ref={containerRef}>
      {TRAIL_IMAGES.map((src, i) => (
        <img
          key={i}
          ref={(el) => { if (el) imagesRef.current[i] = el; }}
          src={src}
          className="absolute top-0 left-0 w-48 h-64 object-cover rounded-xl opacity-0 pointer-events-none -translate-x-1/2 -translate-y-1/2"
          alt=""
          referrerPolicy="no-referrer"
        />
      ))}
    </div>
  );
};

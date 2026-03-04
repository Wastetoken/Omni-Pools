import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';

const IMAGES = [
  'https://pub-5a76c67414e24796a5bd7ac87486acd0.r2.dev/pexels-jose-franco-2157655172-35015141.jpg',
  'https://pub-5a76c67414e24796a5bd7ac87486acd0.r2.dev/pexels-k3ithvision-27847373.jpg',
  'https://pub-5a76c67414e24796a5bd7ac87486acd0.r2.dev/pexels-mia-dalisay-594958-15948530.jpg',
  'https://pub-5a76c67414e24796a5bd7ac87486acd0.r2.dev/pexels-myburgh-2513972.jpg',
  'https://pub-5a76c67414e24796a5bd7ac87486acd0.r2.dev/pexels-ninobur-17410701.jpg',
  'https://pub-5a76c67414e24796a5bd7ac87486acd0.r2.dev/pexels-pixabay-261041.jpg',
];

export const ThreeDCarousel = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const rotationY = useRef(0);
  const targetRotationY = useRef(0);

  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    containerRef.current.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    const radius = 4;
    const count = IMAGES.length;
    const loader = new THREE.TextureLoader();

    IMAGES.forEach((url, i) => {
      const texture = loader.load(url);
      const geometry = new THREE.PlaneGeometry(2.5, 1.8);
      const material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });
      const mesh = new THREE.Mesh(geometry, material);

      const angle = (i / count) * Math.PI * 2;
      mesh.position.x = Math.cos(angle) * radius;
      mesh.position.z = Math.sin(angle) * radius;
      mesh.rotation.y = -angle + Math.PI / 2;

      group.add(mesh);
    });

    let startX = 0;

    const onMouseDown = (e: MouseEvent | TouchEvent) => {
      setIsDragging(true);
      startX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    };

    const onMouseMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return;
      const x = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const delta = x - startX;
      targetRotationY.current += delta * 0.005;
      startX = x;
    };

    const onMouseUp = () => {
      setIsDragging(false);
    };

    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('touchstart', onMouseDown);
    window.addEventListener('touchmove', onMouseMove);
    window.addEventListener('touchend', onMouseUp);

    const animate = () => {
      if (!isDragging) {
        targetRotationY.current += 0.002; // Auto rotate
      }
      rotationY.current += (targetRotationY.current - rotationY.current) * 0.1;
      group.rotation.y = rotationY.current;

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('touchstart', onMouseDown);
      window.removeEventListener('touchmove', onMouseMove);
      window.removeEventListener('touchend', onMouseUp);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, [isDragging]);

  return <div ref={containerRef} className="w-full h-[600px] cursor-grab active:cursor-grabbing" />;
};

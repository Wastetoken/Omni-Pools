import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const WarpBackground = ({ src }: { src: string }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    containerRef.current.appendChild(renderer.domElement);

    const loader = new THREE.TextureLoader();
    const texture = loader.load(src);
    
    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTexture: { value: texture },
        uTime: { value: 0 },
        uVelocity: { value: 0 },
        uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
      },
      vertexShader: `
        varying vec2 vUv;
        uniform float uVelocity;
        uniform float uTime;
        
        void main() {
          vUv = uv;
          vec3 pos = position;
          
          // Warp based on velocity
          float warp = sin(pos.y * 5.0 + uTime) * uVelocity * 0.2;
          pos.x += warp;
          
          gl_Position = vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        uniform sampler2D uTexture;
        
        void main() {
          vec4 color = texture2D(uTexture, vUv);
          gl_FragColor = color;
        }
      `
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const animate = (time: number) => {
      material.uniforms.uTime.value = time * 0.001;
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);

    ScrollTrigger.create({
      onUpdate: (self) => {
        const velocity = self.getVelocity() / 1000;
        gsap.to(material.uniforms.uVelocity, {
          value: velocity,
          duration: 0.5,
          ease: 'power2.out'
        });
      }
    });

    const handleResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      material.uniforms.uResolution.value.set(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
    };
  }, [src]);

  return <div ref={containerRef} className="absolute inset-0 z-0 opacity-40" />;
};

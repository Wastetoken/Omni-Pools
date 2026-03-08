import React, { useRef, useEffect, Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { useGLTF, Float, Environment, ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface ModelProps {
  url: string;
  scrollTriggerProps: any;
  initialPosition: [number, number, number];
  scale?: number;
  isMobile: boolean;
}

const Model = ({ url, scrollTriggerProps, initialPosition, scale = 1, isMobile }: ModelProps) => {
  const { scene } = useGLTF(url);
  const modelRef = useRef<THREE.Group>(null);

  useEffect(() => {
    if (!modelRef.current) return;

    const adjustedScale = isMobile ? scale * 0.6 : scale;
    const adjustedInitialPos = [...initialPosition] as [number, number, number];
    if (isMobile) {
      adjustedInitialPos[0] *= 0.5; // Bring closer to center on mobile
    }

    // Set initial state
    gsap.set(modelRef.current.position, {
      x: adjustedInitialPos[0],
      y: adjustedInitialPos[1],
      z: adjustedInitialPos[2],
    });
    gsap.set(modelRef.current.scale, {
      x: adjustedScale,
      y: adjustedScale,
      z: adjustedScale,
    });

    // Scroll animation
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: scrollTriggerProps.trigger,
        start: scrollTriggerProps.start || "top bottom",
        end: scrollTriggerProps.end || "bottom top",
        scrub: 1.5,
      },
    });

    // Initial state
    modelRef.current.visible = true; // Keep visible to ensure smooth transitions

    const targetX = isMobile ? (scrollTriggerProps.targetX ?? initialPosition[0]) * 0.7 : (scrollTriggerProps.targetX ?? initialPosition[0]);
    const startX = isMobile ? initialPosition[0] * 0.7 : initialPosition[0];

    // Reset position to startX
    gsap.set(modelRef.current.position, { x: startX });

    tl.to(modelRef.current.position, {
      x: targetX,
      y: scrollTriggerProps.targetY ?? initialPosition[1] - 5,
      z: scrollTriggerProps.targetZ ?? initialPosition[2],
      ease: "none", // Use none for scrub to match scroll exactly
    })
    .to(modelRef.current.rotation, {
      x: Math.PI * 4,
      y: Math.PI * 8,
      z: Math.PI * 2,
      ease: "none",
    }, 0);

    return () => {
      if (tl.scrollTrigger) tl.scrollTrigger.kill();
      tl.kill();
    };
  }, [url, initialPosition, scrollTriggerProps, isMobile, scale]);

  return (
    <primitive 
      ref={modelRef} 
      object={scene} 
      dispose={null} 
    />
  );
};

interface Floating3DElementProps {
  url: string;
  trigger: string;
  start?: string;
  end?: string;
  initialPosition: [number, number, number];
  targetX?: number;
  targetY?: number;
  targetZ?: number;
  scale?: number;
  className?: string;
}

export const Floating3DElement = ({
  url,
  trigger,
  initialPosition,
  targetX,
  targetY,
  targetZ,
  scale = 1,
  className = "",
}: Floating3DElementProps) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    
    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  return (
    <div className={`fixed inset-0 pointer-events-none z-[15] ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 10], fov: isMobile ? 45 : 35 }}
        gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
        dpr={1}
        onCreated={({ gl, scene }) => {
          scene.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
              const mesh = child as THREE.Mesh;
              if (mesh.material) {
                if (Array.isArray(mesh.material)) {
                  mesh.material.forEach((m: any) => { m.dithering = false; });
                } else {
                  (mesh.material as any).dithering = false;
                }
              }
            }
          });
        }}
      >
        <ambientLight intensity={0.7} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1.5} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        <Environment preset="city" />
        
        <Suspense fallback={null}>
          <Float speed={2.5} rotationIntensity={1.5} floatIntensity={1.5}>
            <Model
              url={url}
              initialPosition={initialPosition}
              scale={scale}
              isMobile={isMobile}
              scrollTriggerProps={{
                trigger,
                targetX,
                targetY,
                targetZ,
              }}
            />
          </Float>
        </Suspense>
        
        <ContactShadows 
          position={[0, -4.5, 0]} 
          opacity={0.3} 
          scale={15} 
          blur={2.5} 
          far={4.5} 
        />
      </Canvas>
    </div>
  );
};

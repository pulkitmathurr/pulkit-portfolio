"use client";

import { useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sparkles } from "@react-three/drei";
import { AdditiveBlending, type Group } from "three";

type Props = {
  /** Fewer particles + lower DPR on phones */
  lite?: boolean;
  /** Stop rendering when the hero is off screen */
  active?: boolean;
};

/** Pointer position in -1..1, read from window so the canvas can ignore pointer events. */
function usePointer() {
  const p = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      p.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      p.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);
  return p;
}

/** Projector beam with dust drifting through it, tilting gently toward the mouse. */
function Beam({ lite }: { lite: boolean }) {
  const group = useRef<Group>(null);
  const pointer = usePointer();

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    const k = 1 - Math.exp(-delta * 2.5);
    g.rotation.y += (pointer.current.x * 0.18 - g.rotation.y) * k;
    g.rotation.x += (pointer.current.y * 0.1 - g.rotation.x) * k;
    g.position.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.05;
  });

  return (
    <group ref={group}>
      {/* soft light cone coming from behind the viewer, top-right */}
      <mesh position={[1.6, 1.4, -2]} rotation={[0.35, 0, -0.85]}>
        <coneGeometry args={[3.2, 9, 48, 1, true]} />
        <meshBasicMaterial color="#f0e2c8" transparent opacity={0.035} blending={AdditiveBlending} depthWrite={false} />
      </mesh>
      <Sparkles count={lite ? 140 : 420} scale={[10, 6, 4]} size={lite ? 2.2 : 2.6} speed={0.25} opacity={0.55} noise={0.8} color="#f3e6d0" />
      <Sparkles count={lite ? 30 : 90} scale={[9, 5, 3]} size={4} speed={0.18} opacity={0.6} noise={1.2} color="#c0392b" />
    </group>
  );
}

export default function HeroScene({ lite = false, active = true }: Props) {
  return (
    <Canvas
      className="!pointer-events-none"
      frameloop={active ? "always" : "never"}
      dpr={lite ? [1, 1.25] : [1, 1.75]}
      camera={{ position: [0, 0, 5], fov: 50 }}
      gl={{ antialias: false, alpha: true, powerPreference: "low-power" }}
    >
      <Beam lite={lite} />
    </Canvas>
  );
}

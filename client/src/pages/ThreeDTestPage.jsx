import React, { useRef, useLayoutEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ScrollControls, useScroll, Environment, Sky, Text } from '@react-three/drei';
import * as THREE from 'three';

// A simple stylized Low-Poly Villa constructed from basic geometries
const LowPolyVilla = () => {
  return (
    <group position={[0, -1, 0]}>
      {/* Main Floor / Base */}
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[10, 1, 10]} />
        <meshStandardMaterial color="#dddddd" />
      </mesh>
      
      {/* Walls */}
      <mesh position={[-4.5, 2.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[1, 3, 10]} />
        <meshStandardMaterial color="#f0f0f0" />
      </mesh>
      <mesh position={[4.5, 2.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[1, 3, 10]} />
        <meshStandardMaterial color="#f0f0f0" />
      </mesh>
      <mesh position={[0, 2.5, -4.5]} castShadow receiveShadow>
        <boxGeometry args={[8, 3, 1]} />
        <meshStandardMaterial color="#e0e0e0" />
      </mesh>
      
      {/* Roof */}
      <mesh position={[0, 5, 0]} castShadow receiveShadow>
        <coneGeometry args={[8, 4, 4]} />
        <meshStandardMaterial color="#8b0000" />
      </mesh>

      {/* Interior Furniture (Abstract) */}
      {/* Living Room Area */}
      <group position={[-2, 1.5, -2]}>
        {/* Couch */}
        <mesh position={[0, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[3, 1, 1]} />
          <meshStandardMaterial color="#336699" />
        </mesh>
        {/* TV */}
        <mesh position={[0, 0.5, 2]} castShadow receiveShadow>
          <boxGeometry args={[2.5, 1.5, 0.2]} />
          <meshStandardMaterial color="#111111" />
        </mesh>
      </group>

      {/* Modern Art Statue */}
      <mesh position={[2, 2, 2]} castShadow>
        <torusKnotGeometry args={[0.5, 0.2, 100, 16]} />
        <meshPhysicalMaterial color="#ffd700" metalness={1} roughness={0.1} />
      </mesh>
    </group>
  );
};

// The camera controller that responds to scrolling
const ScrollCamera = () => {
  const scroll = useScroll();
  const cameraGroup = useRef();

  useFrame((state, delta) => {
    // scroll.offset goes from 0 (top) to 1 (bottom)
    const offset = scroll.offset;
    
    // Define waypoints for the 3D tour
    // We interpolate between these positions based on scroll offset
    
    // Start: Outside looking at the villa
    let targetZ = 15 - (offset * 20); // Move forward as you scroll
    let targetX = Math.sin(offset * Math.PI * 2) * 5; // Swoop side to side
    let targetY = 3 + Math.sin(offset * Math.PI) * 2; // Bob up and down
    
    // Look at target
    const lookAtPos = new THREE.Vector3(0, 2, -2);
    
    // Smooth camera movement
    cameraGroup.current.position.lerp(new THREE.Vector3(targetX, targetY, targetZ), 0.1);
    state.camera.lookAt(lookAtPos);
  });

  return (
    <group ref={cameraGroup}>
      <perspectiveCamera makeDefault fov={50} />
    </group>
  );
};

// Scenarios/Text that appear at different scroll depths
const ScenarioText = () => {
  const scroll = useScroll();
  const text1 = useRef();
  const text2 = useRef();
  const text3 = useRef();

  useFrame(() => {
    // Fade text in and out based on scroll percentage
    const o = scroll.offset;
    
    // Scenario 1: Exterior (0 - 0.3)
    text1.current.material.opacity = o < 0.3 ? 1 - (o * 3) : 0;
    
    // Scenario 2: Living Room (0.3 - 0.7)
    const p2 = Math.max(0, Math.min(1, 1 - Math.abs(o - 0.5) * 4));
    text2.current.material.opacity = p2;
    
    // Scenario 3: Golden Statue / End (0.7 - 1.0)
    const p3 = Math.max(0, Math.min(1, (o - 0.7) * 3));
    text3.current.material.opacity = p3;
  });

  return (
    <>
      <Text ref={text1} position={[0, 6, 8]} fontSize={1} color="#ffffff" outlineWidth={0.05} outlineColor="#000000" transparent>
        Welcome to the Villa
      </Text>
      <Text ref={text2} position={[-2, 3.5, 0]} fontSize={0.6} color="#ffffff" outlineWidth={0.03} outlineColor="#000000" transparent>
        Scenario 1: The Modern Living Space
      </Text>
      <Text ref={text3} position={[2, 4, 2]} fontSize={0.6} color="#ffd700" outlineWidth={0.03} outlineColor="#000000" transparent>
        Scenario 2: The Golden Artifact
      </Text>
    </>
  );
};

const ThreeDTestPage = () => {
  return (
    <div className="w-full h-[calc(100vh-64px)] bg-sky-200 relative">
      {/* 2D Overlay UI */}
      <div className="absolute top-6 left-6 z-10 pointer-events-none">
        <h1 className="text-4xl font-bold text-gray-900 drop-shadow-md">Scroll to Tour</h1>
        <p className="text-gray-700 font-medium mt-2">Use your mouse wheel or trackpad to explore the 3D space.</p>
      </div>

      <Canvas shadows>
        <Sky sunPosition={[100, 20, 100]} turbidity={0.1} rayleigh={0.5} />
        <ambientLight intensity={0.4} />
        <directionalLight 
          castShadow 
          position={[10, 20, 10]} 
          intensity={1.5} 
          shadow-mapSize={[1024, 1024]}
        />
        
        {/* ScrollControls allows scrolling to control the 3D scene (pages=3 means 3 screens worth of scroll height) */}
        <ScrollControls pages={4} damping={0.2}>
          <ScrollCamera />
          <ScenarioText />
          <LowPolyVilla />
        </ScrollControls>
      </Canvas>
    </div>
  );
};

export default ThreeDTestPage;

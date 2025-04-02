'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ThreeBackground({ darkMode }) {
  const mountRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true,
      antialias: true // Add antialiasing for smoother rendering
    });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(darkMode ? 0x1a202c : 0xf7fafc, 0.3); // Add slight background color
    mountRef.current.appendChild(renderer.domElement);

    // Create particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 2000; // Reduced for better performance
    const posArray = new Float32Array(particlesCount * 3);

    for(let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 10; // Increased spread
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    // Material with improved visibility
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.008, // Increased size
      color: darkMode ? 0x4a5568 : 0xe2e8f0,
      transparent: true,
      opacity: 0.6,
      sizeAttenuation: true,
    });

    // Mesh
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // Camera position
    camera.position.z = 3;

    // Mouse movement effect
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (event) => {
      mouseX = (event.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (event.clientY / window.innerHeight - 0.5) * 2;
    };

    document.addEventListener('mousemove', handleMouseMove);

    // Animation
    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      particlesMesh.rotation.x += 0.0003;
      particlesMesh.rotation.y += 0.0005;

      // Smooth mouse follow with damping
      particlesMesh.rotation.x += (mouseY * 0.0003 - particlesMesh.rotation.x) * 0.05;
      particlesMesh.rotation.y += (mouseX * 0.0003 - particlesMesh.rotation.y) * 0.05;

      renderer.render(scene, camera);
    };

    // Handle resize
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    animate();

    // Cleanup
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('mousemove', handleMouseMove);
      scene.remove(particlesMesh);
      particlesGeometry.dispose();
      particlesMaterial.dispose();
      renderer.dispose();
    };
  }, [darkMode]);

  return (
    <div 
      ref={mountRef} 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1, // Changed to -1 to ensure it stays behind content
        pointerEvents: 'none',
        overflow: 'hidden'
      }}
    />
  );
}
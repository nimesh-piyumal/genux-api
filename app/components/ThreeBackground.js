'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ThreeBackground({ darkMode }) {
  const mountRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup with improved visuals
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true,
      antialias: true,
      powerPreference: "high-performance"
    });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(darkMode ? 0x111827 : 0xf8fafc, 0.2); // Subtle background color
    mountRef.current.appendChild(renderer.domElement);

    // Create particles with improved aesthetics
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = darkMode ? 2500 : 2000; // More particles in dark mode
    const posArray = new Float32Array(particlesCount * 3);

    for(let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 12; // Wider spread
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    // Create two particle systems for depth effect
    const particlesMaterial1 = new THREE.PointsMaterial({
      size: 0.01,
      color: darkMode ? 0x4a5568 : 0xdbe4ff,
      transparent: true,
      opacity: 0.7,
      sizeAttenuation: true,
    });

    const particlesMaterial2 = new THREE.PointsMaterial({
      size: 0.005,
      color: darkMode ? 0x2d3748 : 0xbfdbfe,
      transparent: true,
      opacity: 0.5,
      sizeAttenuation: true,
    });

    // Create meshes
    const particlesMesh1 = new THREE.Points(particlesGeometry, particlesMaterial1);
    const particlesMesh2 = new THREE.Points(particlesGeometry.clone(), particlesMaterial2);
    
    // Position second mesh slightly differently
    particlesMesh2.position.z = -5;
    particlesMesh2.rotation.x = Math.PI * 0.2;
    
    scene.add(particlesMesh1);
    scene.add(particlesMesh2);

    // Camera position
    camera.position.z = 3;

    // Mouse movement effect with improved responsiveness
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (event) => {
      mouseX = (event.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (event.clientY / window.innerHeight - 0.5) * 2;
    };

    document.addEventListener('mousemove', handleMouseMove);

    // Animation with smoother transitions
    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      targetX = mouseX * 0.001;
      targetY = mouseY * 0.001;
      
      particlesMesh1.rotation.x += 0.0003;
      particlesMesh1.rotation.y += 0.0005;
      
      particlesMesh2.rotation.x += 0.0002;
      particlesMesh2.rotation.y += 0.0003;

      // Smooth mouse follow with improved damping
      particlesMesh1.rotation.x += (targetY - particlesMesh1.rotation.x) * 0.03;
      particlesMesh1.rotation.y += (targetX - particlesMesh1.rotation.y) * 0.03;
      
      particlesMesh2.rotation.x += (targetY - particlesMesh2.rotation.x) * 0.02;
      particlesMesh2.rotation.y += (targetX - particlesMesh2.rotation.y) * 0.02;

      renderer.render(scene, camera);
    };

    // Handle resize with debouncing
    let resizeTimeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        const width = window.innerWidth;
        const height = window.innerHeight;

        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
      }, 100);
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
      
      scene.remove(particlesMesh1);
      scene.remove(particlesMesh2);
      particlesGeometry.dispose();
      particlesMaterial1.dispose();
      particlesMaterial2.dispose();
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
        zIndex: -1,
        pointerEvents: 'none',
        overflow: 'hidden'
      }}
    />
  );
}
'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import styles from './Hero.module.scss';

function disposeObject(object) {
  object.traverse((child) => {
    if (child.geometry) child.geometry.dispose();
    if (child.material) {
      if (Array.isArray(child.material)) {
        child.material.forEach((material) => material.dispose());
      } else {
        child.material.dispose();
      }
    }
  });
}

export default function HeroObject3D() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
    camera.position.set(0, 0.1, 7.2);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    container.appendChild(renderer.domElement);

    const group = new THREE.Group();
    group.rotation.set(-0.16, -0.36, 0.05);
    scene.add(group);

    const ambient = new THREE.AmbientLight(0x5d7dff, 1.1);
    const key = new THREE.DirectionalLight(0xb8ecff, 2.4);
    key.position.set(3, 4, 5);
    const rim = new THREE.PointLight(0x5bbcff, 24, 10);
    rim.position.set(-2.8, -1.4, 3.2);
    scene.add(ambient, key, rim);

    const coreMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x102340,
      roughness: 0.26,
      metalness: 0.18,
      clearcoat: 1,
      clearcoatRoughness: 0.14,
      transparent: true,
      opacity: 0.78,
      emissive: 0x06152c,
      emissiveIntensity: 0.45
    });

    const core = new THREE.Mesh(new THREE.IcosahedronGeometry(1.14, 2), coreMaterial);
    group.add(core);

    const coreWire = new THREE.LineSegments(
      new THREE.EdgesGeometry(core.geometry),
      new THREE.LineBasicMaterial({ color: 0x9ee8ff, transparent: true, opacity: 0.62 })
    );
    core.add(coreWire);

    const panelMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x9ee8ff,
      roughness: 0.18,
      metalness: 0.05,
      transparent: true,
      opacity: 0.16,
      side: THREE.DoubleSide,
      clearcoat: 1
    });

    const edgeMaterial = new THREE.LineBasicMaterial({
      color: 0xb9f0ff,
      transparent: true,
      opacity: 0.42
    });

    const panels = [
      { position: [-1.45, 0.7, -0.7], rotation: [0.12, 0.28, -0.12], scale: [1.15, 0.72, 1] },
      { position: [1.35, -0.2, -0.35], rotation: [-0.08, -0.32, 0.08], scale: [1.08, 0.65, 1] },
      { position: [-0.15, -1.12, 0.35], rotation: [0.26, -0.12, 0.15], scale: [0.92, 0.55, 1] }
    ];

    panels.forEach((panel) => {
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(2.2, 1.2, 0.035), panelMaterial.clone());
      mesh.position.set(...panel.position);
      mesh.rotation.set(...panel.rotation);
      mesh.scale.set(...panel.scale);
      group.add(mesh);

      const edges = new THREE.LineSegments(new THREE.EdgesGeometry(mesh.geometry), edgeMaterial.clone());
      mesh.add(edges);
    });

    const ringMaterial = new THREE.MeshBasicMaterial({
      color: 0x76d8ff,
      transparent: true,
      opacity: 0.52
    });

    const ringA = new THREE.Mesh(new THREE.TorusGeometry(2.05, 0.008, 8, 160), ringMaterial);
    ringA.rotation.set(Math.PI / 2.25, 0.18, 0.12);
    const ringB = new THREE.Mesh(new THREE.TorusGeometry(2.62, 0.006, 8, 180), ringMaterial.clone());
    ringB.material.opacity = 0.28;
    ringB.rotation.set(Math.PI / 1.9, -0.45, 0.75);
    group.add(ringA, ringB);

    const particleCount = 96;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i += 1) {
      const radius = 2.2 + Math.random() * 1.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta) * 0.72;
      positions[i * 3 + 2] = radius * Math.cos(phi) * 0.78;
    }
    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particles = new THREE.Points(
      particleGeometry,
      new THREE.PointsMaterial({
        color: 0xdaf8ff,
        size: 0.024,
        transparent: true,
        opacity: 0.62,
        depthWrite: false
      })
    );
    group.add(particles);

    const resize = () => {
      const width = Math.max(1, container.clientWidth);
      const height = Math.max(1, container.clientHeight);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    resize();

    let animationId = 0;
    let visible = true;
    const pointer = { x: 0, y: 0 };
    const clock = new THREE.Clock();

    const onPointerMove = (event) => {
      const rect = container.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      pointer.y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    };
    container.addEventListener('pointermove', onPointerMove);

    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    }, { threshold: 0.01 });
    intersectionObserver.observe(container);

    const animate = () => {
      if (visible) {
        const elapsed = clock.getElapsedTime();
        core.rotation.y = elapsed * 0.18;
        core.rotation.x = Math.sin(elapsed * 0.7) * 0.08;
        ringA.rotation.z = elapsed * 0.12;
        ringB.rotation.z = -elapsed * 0.08;
        particles.rotation.y = elapsed * 0.035;
        particles.rotation.x = Math.sin(elapsed * 0.22) * 0.04;

        group.rotation.y += ((-0.36 + pointer.x * 0.16) - group.rotation.y) * 0.045;
        group.rotation.x += ((-0.16 - pointer.y * 0.1) - group.rotation.x) * 0.045;

        renderer.render(scene, camera);
      }
      animationId = window.requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.cancelAnimationFrame(animationId);
      container.removeEventListener('pointermove', onPointerMove);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      disposeObject(group);
      renderer.dispose();
      renderer.forceContextLoss();
      if (renderer.domElement.parentNode === container) container.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={containerRef} className={styles.scene3d} aria-hidden="true" />;
}

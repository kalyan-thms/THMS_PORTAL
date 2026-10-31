import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Maximize2, Minimize2, RotateCcw, Info, Activity, ShieldCheck, AlertTriangle } from 'lucide-react';

export default function TransformerDigitalTwin({
  highlightedComponent = null,
  onSelectComponent,
  physicalData = {},
  compact = false
}) {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const meshesRef = useRef({});
  const raycasterRef = useRef(new THREE.Raycaster());
  const mouseRef = useRef(new THREE.Vector2());
  const animFrameRef = useRef(null);

  const [activeInfo, setActiveInfo] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Sync prop changes for highlighting
  useEffect(() => {
    if (!highlightedComponent || !meshesRef.current) return;
    const item = meshesRef.current[highlightedComponent];
    if (item) {
      flashHighlight(highlightedComponent);
      setActiveInfo(item.info);
    }
  }, [highlightedComponent]);

  const flashHighlight = (key) => {
    Object.keys(meshesRef.current).forEach(k => {
      const entry = meshesRef.current[k];
      if (!entry.mesh) return;
      if (k === key) {
        if (entry.mesh.material) {
          entry.mesh.material.emissive = new THREE.Color(0x06b6d4);
          entry.mesh.material.emissiveIntensity = 0.8;
        }
      } else {
        if (entry.mesh.material) {
          entry.mesh.material.emissive = new THREE.Color(0x000000);
          entry.mesh.material.emissiveIntensity = 0;
        }
      }
    });
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x0c1322);

    // Camera
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(7.5, 4.8, 8.5);
    camera.lookAt(0, 0.6, 0);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 2.2);
    dirLight.position.set(10, 15, 8);
    dirLight.castShadow = true;
    scene.add(dirLight);

    const blueLight = new THREE.DirectionalLight(0x0284c7, 1.8);
    blueLight.position.set(-8, 5, -8);
    scene.add(blueLight);

    // Subtle grid
    const grid = new THREE.GridHelper(16, 20, 0x1e3a8a, 0x1e293b);
    grid.position.y = -1.5;
    scene.add(grid);

    // Materials
    const tankMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.7, roughness: 0.35 });
    const coverMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.75, roughness: 0.3 });
    const hvBushMat = new THREE.MeshStandardMaterial({ color: 0x7c2d12, metalness: 0.1, roughness: 0.15 });
    const lvBushMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.1, roughness: 0.2 });
    const brassMat = new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.85, roughness: 0.2 });
    const consMat = new THREE.MeshStandardMaterial({ color: 0x1d4ed8, metalness: 0.6, roughness: 0.35 });
    const pipeMat = new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.7, roughness: 0.3 });
    const buchMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.6, roughness: 0.3 });
    const prvMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, metalness: 0.6, roughness: 0.3 });
    const radMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.75, roughness: 0.4 });
    const oltcMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.8, roughness: 0.3 });

    const meshRegistry = {};

    // 1. Tank
    const tankGeo = new THREE.BoxGeometry(3.2, 2.4, 2.0);
    const tankMesh = new THREE.Mesh(tankGeo, tankMat);
    tankMesh.position.y = 0;
    tankMesh.castShadow = true;
    tankMesh.receiveShadow = true;
    scene.add(tankMesh);
    meshRegistry.oil = {
      mesh: tankMesh,
      name: "Main Tank & Insulation Oil",
      info: `Oil Temperature: ${physicalData.oilTemp || 52.6}°C • Status: Normal`
    };

    // Stiffener ribs
    [-0.6, 0.6].forEach(y => {
      const rib = new THREE.Mesh(new THREE.BoxGeometry(3.3, 0.08, 2.1), coverMat);
      rib.position.y = y;
      scene.add(rib);
    });

    // Skids
    [-0.7, 0.7].forEach(z => {
      const skid = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.2, 0.25), coverMat);
      skid.position.set(0, -1.3, z);
      scene.add(skid);
    });

    // 2. Cover
    const cover = new THREE.Mesh(new THREE.BoxGeometry(3.4, 0.12, 2.2), coverMat);
    cover.position.y = 1.26;
    cover.castShadow = true;
    scene.add(cover);

    // 3. HV Bushings
    const hvGroup = new THREE.Group();
    [-0.9, 0, 0.9].forEach(x => {
      const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.12, 1.2, 16), hvBushMat);
      stem.position.set(x, 1.9, 0.5);
      stem.castShadow = true;
      hvGroup.add(stem);
      for (let s = 1.5; s <= 2.3; s += 0.2) {
        const shed = new THREE.Mesh(new THREE.ConeGeometry(0.24, 0.1, 16), hvBushMat);
        shed.position.set(x, s, 0.5);
        hvGroup.add(shed);
      }
      const term = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.25, 8), brassMat);
      term.position.set(x, 2.6, 0.5);
      hvGroup.add(term);
    });
    scene.add(hvGroup);
    meshRegistry.hvBushings = {
      mesh: hvGroup.children[0],
      name: "132 kV High Voltage Bushings",
      info: "HV Porcelain Bushings • Sealed oil-filled porcelain"
    };

    // 4. LV Bushings
    const lvGroup = new THREE.Group();
    [-0.9, -0.3, 0.3, 0.9].forEach(x => {
      const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 0.7, 16), lvBushMat);
      stem.position.set(x, 1.65, -0.5);
      stem.castShadow = true;
      lvGroup.add(stem);
      for (let s = 1.45; s <= 1.9; s += 0.18) {
        const shed = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.08, 16), lvBushMat);
        shed.position.set(x, s, -0.5);
        lvGroup.add(shed);
      }
    });
    scene.add(lvGroup);
    meshRegistry.lvBushings = {
      mesh: lvGroup.children[0],
      name: "33 kV Low Voltage Bushings",
      info: "LV Porcelain Bushings • Heavy-duty copper palms"
    };

    // 5. Conservator Tank & MOG
    const consTank = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 2.4, 20), consMat);
    consTank.rotation.z = Math.PI / 2;
    consTank.position.set(0, 2.45, -0.75);
    consTank.castShadow = true;
    scene.add(consTank);

    // MOG dial
    const mogMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.06, 16), lvBushMat);
    mogMesh.rotation.z = Math.PI / 2;
    mogMesh.position.set(1.22, 2.45, -0.75);
    scene.add(mogMesh);
    meshRegistry.mog = {
      mesh: mogMesh,
      name: "Magnetic Oil Gauge (MOG)",
      info: `Oil Level: ${physicalData.mog?.levelPercent || 68.5}% • Status: ${physicalData.mog?.status || 'Normal'}`
    };

    // 6. Buchholz Relay
    const bRelay = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.22, 0.32), buchMat);
    bRelay.position.set(0.4, 1.85, -0.45);
    bRelay.rotation.x = 0.3;
    scene.add(bRelay);
    meshRegistry.buchholz = {
      mesh: bRelay,
      name: "Buchholz Protective Relay",
      info: `Buchholz Relay Status: ${physicalData.buchholzRelay || 'Normal'}`
    };

    // Pipe connecting cover to conservator
    const pipePoints = [
      new THREE.Vector3(0.4, 1.35, -0.15),
      new THREE.Vector3(0.4, 1.85, -0.45),
      new THREE.Vector3(0.4, 2.45, -0.75)
    ];
    const pipeCurve = new THREE.CatmullRomCurve3(pipePoints);
    const pipeGeo = new THREE.TubeGeometry(pipeCurve, 16, 0.06, 10, false);
    const pipe = new THREE.Mesh(pipeGeo, pipeMat);
    scene.add(pipe);

    // 7. Pressure Relief Valve (PRV)
    const prvMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.18, 0.2, 16), prvMat);
    prvMesh.position.set(-0.9, 1.45, 0.15);
    scene.add(prvMesh);
    meshRegistry.prv = {
      mesh: prvMesh,
      name: "Pressure Relief Device (PRV)",
      info: `PRV Status: ${physicalData.prv || 'Normal'}`
    };

    // 8. Radiators
    const radLeft = new THREE.Group();
    for (let z = -0.7; z <= 0.7; z += 0.18) {
      const fin = new THREE.Mesh(new THREE.BoxGeometry(0.55, 1.6, 0.02), radMat);
      fin.position.set(-2.0, 0, z);
      radLeft.add(fin);
    }
    scene.add(radLeft);

    const radRight = new THREE.Group();
    for (let z = -0.7; z <= 0.7; z += 0.18) {
      const fin = new THREE.Mesh(new THREE.BoxGeometry(0.55, 1.6, 0.02), radMat);
      fin.position.set(2.0, 0, z);
      radRight.add(fin);
    }
    scene.add(radRight);
    meshRegistry.radiators = {
      mesh: radLeft.children[0],
      name: "Radiator Cooling Banks",
      info: "Natural / Forced Air Cooling (ONAN/ONAF)"
    };

    // 9. OLTC (On-Load Tap Changer)
    const oltcMesh = new THREE.Mesh(new THREE.BoxGeometry(0.65, 1.6, 0.7), oltcMat);
    oltcMesh.position.set(1.4, 0.15, 1.15);
    scene.add(oltcMesh);
    meshRegistry.oltc = {
      mesh: oltcMesh,
      name: "On-Load Tap Changer (OLTC)",
      info: `Position: Tap #${physicalData.oltc?.position || 9} • Operations: ${(physicalData.oltc?.operationCounter || 14820).toLocaleString()}`
    };

    // 10. Winding / Core association
    meshRegistry.winding = {
      mesh: tankMesh,
      name: "Primary & Secondary Windings",
      info: `Primary: ${physicalData.primaryWindingTemp || 64.2}°C • Secondary: ${physicalData.secondaryWindingTemp || 67.8}°C`
    };

    meshRegistry.octc = {
      mesh: oltcMesh,
      name: "Off-Circuit Tap Changer (OCTC)",
      info: `Position: Tap #${physicalData.octc?.position || 3}`
    };

    meshRegistry.ambient = {
      mesh: tankMesh,
      name: "Ambient Substation Sensor",
      info: `Ambient Temperature: ${physicalData.ambientTemp || 31.4}°C`
    };

    meshesRef.current = meshRegistry;

    // Interactive Orbit
    let isDragging = false;
    let prevMouse = { x: 0, y: 0 };
    let theta = 0.8;
    let phi = 0.55;
    let radius = 10.5;

    const updateCam = () => {
      const x = radius * Math.cos(phi) * Math.sin(theta);
      const y = radius * Math.sin(phi);
      const z = radius * Math.cos(phi) * Math.cos(theta);
      camera.position.set(x, Math.max(y, 1.0), z);
      camera.lookAt(0, 0.4, 0);
    };

    const onMouseDown = (e) => {
      isDragging = true;
      prevMouse = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e) => {
      if (!isDragging) return;
      const dx = e.clientX - prevMouse.x;
      const dy = e.clientY - prevMouse.y;
      theta -= dx * 0.008;
      phi = Math.max(0.1, Math.min(Math.PI / 2.2, phi + dy * 0.008));
      prevMouse = { x: e.clientX, y: e.clientY };
      updateCam();
    };

    const onMouseUp = () => { isDragging = false; };
    const onWheel = (e) => {
      e.preventDefault();
      radius = Math.max(5, Math.min(18, radius + e.deltaY * 0.01));
      updateCam();
    };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    dom.addEventListener('wheel', onWheel, { passive: false });

    // Click selection raycaster
    const onCanvasClick = (e) => {
      const rect = dom.getBoundingClientRect();
      mouseRef.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycasterRef.current.setFromCamera(mouseRef.current, camera);
      const intersects = raycasterRef.current.intersectObjects(scene.children, true);

      if (intersects.length > 0) {
        const hit = intersects[0].object;
        // Find matched registry key
        for (const [key, val] of Object.entries(meshRegistry)) {
          if (val.mesh === hit || (hit.parent && val.mesh === hit.parent)) {
            flashHighlight(key);
            setActiveInfo(val.info);
            if (onSelectComponent) onSelectComponent(key);
            break;
          }
        }
      }
    };
    dom.addEventListener('click', onCanvasClick);

    // Animation Loop
    let time = 0;
    const renderLoop = () => {
      time += 0.01;
      // Gentle idle turntable rotation if not dragging
      if (!isDragging) {
        theta += 0.0015;
        updateCam();
      }
      renderer.render(scene, camera);
      animFrameRef.current = requestAnimationFrame(renderLoop);
    };
    renderLoop();

    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      dom.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      dom.removeEventListener('wheel', onWheel);
      dom.removeEventListener('click', onCanvasClick);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (rendererRef.current && rendererRef.current.domElement) {
        container.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }
    };
  }, [physicalData]);

  const handleReset = () => {
    if (cameraRef.current) {
      cameraRef.current.position.set(7.5, 4.8, 8.5);
      cameraRef.current.lookAt(0, 0.4, 0);
    }
  };

  return (
    <div className={`relative w-full rounded-xl overflow-hidden border border-slate-700/60 bg-slate-900 shadow-md ${compact ? 'h-[280px]' : 'h-[360px]'}`}>
      {/* 3D Canvas */}
      <div ref={mountRef} className="absolute inset-0 cursor-grab active:cursor-grabbing" />

      {/* Header Bar */}
      <div className="absolute top-2.5 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-md border border-slate-700/60">
          <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span className="text-xs font-semibold text-slate-200 tracking-wide">3D Digital Twin</span>
          <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-800/40">
            Live Link
          </span>
        </div>

        <div className="flex items-center gap-1.5 pointer-events-auto">
          <button
            onClick={handleReset}
            className="p-1 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs transition"
            title="Reset Camera View"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Active Component Inspection Pill */}
      {activeInfo && (
        <div className="absolute bottom-2.5 left-3 right-3 z-10 bg-slate-900/90 backdrop-blur-md px-3 py-2 rounded-lg border border-cyan-500/40 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2 text-xs">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
            <span className="font-mono text-slate-200">{activeInfo}</span>
          </div>
          <button
            onClick={() => setActiveInfo(null)}
            className="text-[10px] text-slate-400 hover:text-white ml-2"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Subtle Hint */}
      {!activeInfo && (
        <div className="absolute bottom-2 right-3 z-10 text-[10px] text-slate-500 font-mono pointer-events-none">
          Click parameter cards to highlight components
        </div>
      )}
    </div>
  );
}

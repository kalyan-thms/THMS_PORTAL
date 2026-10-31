import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Play, Pause, RotateCcw, Eye, Compass, Layers } from 'lucide-react';

export default function TransformerAssembly3D({ onAssembledChange }) {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const componentsRef = useRef({});
  const animationFrameRef = useRef(null);
  const isDraggingRef = useRef(false);
  const previousMousePosition = useRef({ x: 0, y: 0 });

  // Animation states
  const [assemblyProgress, setAssemblyProgress] = useState(0); // 0 = fully separated, 1 = fully assembled
  const [isPlaying, setIsPlaying] = useState(true);
  const [cinematicMode, setCinematicMode] = useState(true);
  const [activePreset, setActivePreset] = useState('iso');

  // Animation timing reference
  const animState = useRef({
    progress: 0, // starts separated
    direction: 1, // 1 = assembling, 0 = paused
    speed: 0.35, // progress units per second
    cameraAngle: 0.6,
    assembledNotified: false
  });

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Background: Dark gradient ambient studio
    scene.background = new THREE.Color(0x0a101d);
    scene.fog = new THREE.FogExp2(0x0a101d, 0.025);

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(11, 7, 13);
    camera.lookAt(0, 1.2, 0);
    cameraRef.current = camera;

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Lighting - Premium industrial lighting setup
    const ambientLight = new THREE.AmbientLight(0xdce7f5, 1.2);
    scene.add(ambientLight);

    // Main key light (cool white industrial spotlight)
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.8);
    keyLight.position.set(12, 18, 10);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.camera.near = 1;
    keyLight.shadow.camera.far = 40;
    keyLight.shadow.bias = -0.001;
    const d = 8;
    keyLight.shadow.camera.left = -d;
    keyLight.shadow.camera.right = d;
    keyLight.shadow.camera.top = d;
    keyLight.shadow.camera.bottom = -d;
    scene.add(keyLight);

    // Warm fill light (amber glow representing electrical energy)
    const fillLight = new THREE.DirectionalLight(0x0284c7, 1.6);
    fillLight.position.set(-10, 8, -8);
    scene.add(fillLight);

    // Blue rim light for high-tech contours
    const rimLight = new THREE.DirectionalLight(0x38bdf8, 2.2);
    rimLight.position.set(0, -6, -12);
    scene.add(rimLight);

    // Subtle overhead point light
    const pointLight = new THREE.PointLight(0x60a5fa, 1.5, 20);
    pointLight.position.set(0, 5, 0);
    scene.add(pointLight);

    // 5. Floor Grid and Shadow Plane
    const gridHelper = new THREE.GridHelper(30, 40, 0x1e3a8a, 0x172554);
    gridHelper.position.y = -2.2;
    scene.add(gridHelper);

    const shadowPlaneGeo = new THREE.PlaneGeometry(24, 24);
    const shadowPlaneMat = new THREE.ShadowMaterial({ opacity: 0.45 });
    const shadowPlane = new THREE.Mesh(shadowPlaneGeo, shadowPlaneMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -2.19;
    shadowPlane.receiveShadow = true;
    scene.add(shadowPlane);

    // 6. Realistic Industrial Materials
    // Substation Tank: Industrial battleship slate steel with subtle specular sheen
    const tankMaterial = new THREE.MeshStandardMaterial({
      color: 0x334155,
      metalness: 0.65,
      roughness: 0.35,
    });

    const tankCoverMaterial = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.7,
      roughness: 0.3,
    });

    // Copper Windings
    const copperMaterial = new THREE.MeshStandardMaterial({
      color: 0xb45309,
      metalness: 0.85,
      roughness: 0.25,
    });

    // Magnetic Silicon Steel Core
    const coreMaterial = new THREE.MeshStandardMaterial({
      color: 0x1f2937,
      metalness: 0.8,
      roughness: 0.4,
    });

    // Porcelain Bushings (High-voltage ceramic brown glaze)
    const hvPorcelainMaterial = new THREE.MeshStandardMaterial({
      color: 0x7c2d12, // Glazed brown ceramic
      metalness: 0.1,
      roughness: 0.15,
    });

    // LV Bushings (Off-white / cream ceramic glaze)
    const lvPorcelainMaterial = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      metalness: 0.1,
      roughness: 0.18,
    });

    // Brass / Bronze Terminals
    const brassMaterial = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      metalness: 0.9,
      roughness: 0.2,
    });

    // Radiator Fins (Zinc / Galvanized steel)
    const radiatorMaterial = new THREE.MeshStandardMaterial({
      color: 0x475569,
      metalness: 0.75,
      roughness: 0.38,
    });

    // Conservator Tank
    const conservatorMaterial = new THREE.MeshStandardMaterial({
      color: 0x2563eb,
      metalness: 0.6,
      roughness: 0.32,
    });

    // Pipe / Buchholz / PRV
    const pipeMaterial = new THREE.MeshStandardMaterial({
      color: 0x64748b,
      metalness: 0.7,
      roughness: 0.3,
    });

    const buchholzMaterial = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      metalness: 0.5,
      roughness: 0.3,
    });

    const prvMaterial = new THREE.MeshStandardMaterial({
      color: 0xdc2626, // Industrial safety red/orange
      metalness: 0.5,
      roughness: 0.3,
    });

    const cabinetMaterial = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      metalness: 0.7,
      roughness: 0.25,
    });

    // ==========================================
    // 7. BUILD TRANSFORMER PROCEDURAL COMPONENTS
    // ==========================================
    const components = {};

    // --- Component A: Main Transformer Tank (Base, Skid Rails, Stiffeners) ---
    const tankGroup = new THREE.Group();
    // Tank body
    const tankBodyGeo = new THREE.BoxGeometry(4.2, 3.4, 2.6);
    const tankBody = new THREE.Mesh(tankBodyGeo, tankMaterial);
    tankBody.position.y = 0;
    tankBody.castShadow = true;
    tankBody.receiveShadow = true;
    tankGroup.add(tankBody);

    // Stiffener ribs around tank
    for (let i = -1.2; i <= 1.2; i += 0.8) {
      const ribGeo = new THREE.BoxGeometry(4.3, 0.1, 2.7);
      const rib = new THREE.Mesh(ribGeo, tankCoverMaterial);
      rib.position.y = i;
      tankGroup.add(rib);
    }

    // Skid base rails with foundation rollers
    const skidGeo = new THREE.BoxGeometry(4.8, 0.25, 0.35);
    const skid1 = new THREE.Mesh(skidGeo, tankCoverMaterial);
    skid1.position.set(0, -1.85, 0.9);
    skid1.castShadow = true;
    const skid2 = new THREE.Mesh(skidGeo, tankCoverMaterial);
    skid2.position.set(0, -1.85, -0.9);
    skid2.castShadow = true;
    tankGroup.add(skid1, skid2);

    // Rollers under skids
    for (const z of [-0.9, 0.9]) {
      for (const x of [-1.8, 0, 1.8]) {
        const rollerGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.4, 16);
        const roller = new THREE.Mesh(rollerGeo, coreMaterial);
        roller.rotation.z = Math.PI / 2;
        roller.position.set(x, -2.05, z);
        roller.castShadow = true;
        tankGroup.add(roller);
      }
    }

    // Drain & sampling valves
    const valveGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.4, 12);
    const valve = new THREE.Mesh(valveGeo, brassMaterial);
    valve.rotation.x = Math.PI / 2;
    valve.position.set(1.6, -1.4, 1.35);
    tankGroup.add(valve);

    // Lifting lugs on tank corners
    for (const [x, z] of [[-2.15, -1.35], [-2.15, 1.35], [2.15, -1.35], [2.15, 1.35]]) {
      const lugGeo = new THREE.BoxGeometry(0.15, 0.5, 0.15);
      const lug = new THREE.Mesh(lugGeo, tankCoverMaterial);
      lug.position.set(x, 1.2, z);
      tankGroup.add(lug);
    }

    scene.add(tankGroup);
    components.tank = {
      group: tankGroup,
      origin: new THREE.Vector3(0, 0, 0),
      exploded: new THREE.Vector3(0, -1.8, 0), // Moves downward when exploded
    };

    // --- Component B: Core & Coil Winding Assembly (Visible during explosion) ---
    const coreGroup = new THREE.Group();
    // 3 Limbs of laminated core
    const limbGeo = new THREE.CylinderGeometry(0.42, 0.42, 2.6, 24);
    const yokeGeo = new THREE.BoxGeometry(3.4, 0.35, 0.85);

    // Top & bottom yokes
    const topYoke = new THREE.Mesh(yokeGeo, coreMaterial);
    topYoke.position.y = 1.15;
    topYoke.castShadow = true;
    const bottomYoke = new THREE.Mesh(yokeGeo, coreMaterial);
    bottomYoke.position.y = -1.15;
    bottomYoke.castShadow = true;
    coreGroup.add(topYoke, bottomYoke);

    // 3 Phase Limbs & Copper Coils
    [-1.1, 0, 1.1].forEach((xPos) => {
      const limb = new THREE.Mesh(limbGeo, coreMaterial);
      limb.position.set(xPos, 0, 0);
      coreGroup.add(limb);

      // Inner LV Coil
      const lvCoilGeo = new THREE.CylinderGeometry(0.55, 0.55, 2.1, 24);
      const lvCoil = new THREE.Mesh(lvCoilGeo, brassMaterial);
      lvCoil.position.set(xPos, 0, 0);
      coreGroup.add(lvCoil);

      // Outer HV Coil discs
      for (let y = -0.8; y <= 0.8; y += 0.28) {
        const discGeo = new THREE.TorusGeometry(0.72, 0.09, 12, 32);
        const disc = new THREE.Mesh(discGeo, copperMaterial);
        disc.rotation.x = Math.PI / 2;
        disc.position.set(xPos, y, 0);
        disc.castShadow = true;
        coreGroup.add(disc);
      }
    });

    scene.add(coreGroup);
    components.core = {
      group: coreGroup,
      origin: new THREE.Vector3(0, 0, 0),
      exploded: new THREE.Vector3(0, 0.2, 0), // Revealed in center
    };

    // --- Component C: Tank Top Cover & Turrets ---
    const coverGroup = new THREE.Group();
    const coverPlateGeo = new THREE.BoxGeometry(4.4, 0.15, 2.8);
    const coverPlate = new THREE.Mesh(coverPlateGeo, tankCoverMaterial);
    coverPlate.position.y = 1.75;
    coverPlate.castShadow = true;
    coverGroup.add(coverPlate);

    // Bolted flange around cover
    const flangeBorderGeo = new THREE.BoxGeometry(4.5, 0.08, 2.9);
    const flangeBorder = new THREE.Mesh(flangeBorderGeo, tankMaterial);
    flangeBorder.position.y = 1.7;
    coverGroup.add(flangeBorder);

    scene.add(coverGroup);
    components.cover = {
      group: coverGroup,
      origin: new THREE.Vector3(0, 0, 0),
      exploded: new THREE.Vector3(0, 2.2, 0), // Lifts up
    };

    // --- Component D: HV Bushings (High Voltage Porcelain Sheds - 3 Bushings) ---
    const hvBushingsGroup = new THREE.Group();
    [-1.2, 0, 1.2].forEach((xPos, idx) => {
      const bGroup = new THREE.Group();
      // Mounting turret
      const turretGeo = new THREE.CylinderGeometry(0.24, 0.28, 0.35, 16);
      const turret = new THREE.Mesh(turretGeo, tankCoverMaterial);
      turret.position.y = 1.95;
      bGroup.add(turret);

      // Porcelain stem
      const stemGeo = new THREE.CylinderGeometry(0.12, 0.16, 1.6, 16);
      const stem = new THREE.Mesh(stemGeo, hvPorcelainMaterial);
      stem.position.y = 2.8;
      stem.castShadow = true;
      bGroup.add(stem);

      // 6 Glazed Porcelain sheds per bushing
      for (let s = 2.15; s <= 3.4; s += 0.22) {
        const shedGeo = new THREE.ConeGeometry(0.32, 0.12, 20);
        const shed = new THREE.Mesh(shedGeo, hvPorcelainMaterial);
        shed.position.y = s;
        shed.castShadow = true;
        bGroup.add(shed);
      }

      // Top brass terminal & corona ring
      const terminalGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.3, 12);
      const terminal = new THREE.Mesh(terminalGeo, brassMaterial);
      terminal.position.y = 3.7;
      bGroup.add(terminal);

      const coronaGeo = new THREE.TorusGeometry(0.22, 0.03, 8, 24);
      const corona = new THREE.Mesh(coronaGeo, brassMaterial);
      corona.rotation.x = Math.PI / 2;
      corona.position.y = 3.65;
      bGroup.add(corona);

      bGroup.position.set(xPos, 0, 0.6); // Towards HV side
      hvBushingsGroup.add(bGroup);
    });

    scene.add(hvBushingsGroup);
    components.hvBushings = {
      group: hvBushingsGroup,
      origin: new THREE.Vector3(0, 0, 0),
      exploded: new THREE.Vector3(0, 4.2, 1.8), // Explodes high and forward
    };

    // --- Component E: LV Bushings (Low Voltage Cream Porcelain - 4 Bushings) ---
    const lvBushingsGroup = new THREE.Group();
    [-1.2, -0.4, 0.4, 1.2].forEach((xPos) => {
      const bGroup = new THREE.Group();
      // Stem
      const stemGeo = new THREE.CylinderGeometry(0.1, 0.14, 0.9, 16);
      const stem = new THREE.Mesh(stemGeo, lvPorcelainMaterial);
      stem.position.y = 2.3;
      stem.castShadow = true;
      bGroup.add(stem);

      // 3 Porcelain sheds
      for (let s = 2.0; s <= 2.6; s += 0.22) {
        const shedGeo = new THREE.ConeGeometry(0.24, 0.1, 16);
        const shed = new THREE.Mesh(shedGeo, lvPorcelainMaterial);
        shed.position.y = s;
        bGroup.add(shed);
      }

      // Flat brass connector palm
      const palmGeo = new THREE.BoxGeometry(0.12, 0.25, 0.08);
      const palm = new THREE.Mesh(palmGeo, brassMaterial);
      palm.position.y = 2.85;
      bGroup.add(palm);

      bGroup.position.set(xPos, 0, -0.6); // Towards LV side
      lvBushingsGroup.add(bGroup);
    });

    scene.add(lvBushingsGroup);
    components.lvBushings = {
      group: lvBushingsGroup,
      origin: new THREE.Vector3(0, 0, 0),
      exploded: new THREE.Vector3(0, 3.8, -1.8), // Explodes high and backwards
    };

    // --- Component F: Left Radiator Cooling Bank ---
    const radLeftGroup = new THREE.Group();
    // Header pipes top and bottom
    const headerGeo = new THREE.CylinderGeometry(0.14, 0.14, 2.2, 16);
    const topHeaderL = new THREE.Mesh(headerGeo, pipeMaterial);
    topHeaderL.rotation.x = Math.PI / 2;
    topHeaderL.position.set(-2.8, 1.1, 0);
    const btmHeaderL = new THREE.Mesh(headerGeo, pipeMaterial);
    btmHeaderL.rotation.x = Math.PI / 2;
    btmHeaderL.position.set(-2.8, -1.1, 0);
    radLeftGroup.add(topHeaderL, btmHeaderL);

    // Connecting flanges to tank
    for (const y of [1.1, -1.1]) {
      const flangePipeGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.8, 16);
      const fPipe = new THREE.Mesh(flangePipeGeo, pipeMaterial);
      fPipe.rotation.z = Math.PI / 2;
      fPipe.position.set(-2.4, y, 0);
      radLeftGroup.add(fPipe);
    }

    // Cooling Fin Plates (12 fins)
    for (let z = -0.9; z <= 0.9; z += 0.16) {
      const finGeo = new THREE.BoxGeometry(0.75, 2.2, 0.02);
      const fin = new THREE.Mesh(finGeo, radiatorMaterial);
      fin.position.set(-2.8, 0, z);
      fin.castShadow = true;
      radLeftGroup.add(fin);
    }

    // Cooling fan assembly under radiator
    const fanCowlGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.15, 20);
    const fanCowl = new THREE.Mesh(fanCowlGeo, tankCoverMaterial);
    fanCowl.position.set(-2.8, -1.4, 0);
    radLeftGroup.add(fanCowl);

    scene.add(radLeftGroup);
    components.radiatorLeft = {
      group: radLeftGroup,
      origin: new THREE.Vector3(0, 0, 0),
      exploded: new THREE.Vector3(-3.2, 0, 0), // Slides far to the left
    };

    // --- Component G: Right Radiator Cooling Bank ---
    const radRightGroup = new THREE.Group();
    const topHeaderR = new THREE.Mesh(headerGeo, pipeMaterial);
    topHeaderR.rotation.x = Math.PI / 2;
    topHeaderR.position.set(2.8, 1.1, 0);
    const btmHeaderR = new THREE.Mesh(headerGeo, pipeMaterial);
    btmHeaderR.rotation.x = Math.PI / 2;
    btmHeaderR.position.set(2.8, -1.1, 0);
    radRightGroup.add(topHeaderR, btmHeaderR);

    for (const y of [1.1, -1.1]) {
      const flangePipeGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.8, 16);
      const fPipe = new THREE.Mesh(flangePipeGeo, pipeMaterial);
      fPipe.rotation.z = Math.PI / 2;
      fPipe.position.set(2.4, y, 0);
      radRightGroup.add(fPipe);
    }

    for (let z = -0.9; z <= 0.9; z += 0.16) {
      const finGeo = new THREE.BoxGeometry(0.75, 2.2, 0.02);
      const fin = new THREE.Mesh(finGeo, radiatorMaterial);
      fin.position.set(2.8, 0, z);
      fin.castShadow = true;
      radRightGroup.add(fin);
    }

    const fanCowlR = new THREE.Mesh(fanCowlGeo, tankCoverMaterial);
    fanCowlR.position.set(2.8, -1.4, 0);
    radRightGroup.add(fanCowlR);

    scene.add(radRightGroup);
    components.radiatorRight = {
      group: radRightGroup,
      origin: new THREE.Vector3(0, 0, 0),
      exploded: new THREE.Vector3(3.2, 0, 0), // Slides far to the right
    };

    // --- Component H: Conservator Tank, Brackets & MOG ---
    const conservatorGroup = new THREE.Group();
    // Cylindrical expansion tank
    const consTankGeo = new THREE.CylinderGeometry(0.55, 0.55, 3.2, 24);
    const consTank = new THREE.Mesh(consTankGeo, conservatorMaterial);
    consTank.rotation.z = Math.PI / 2;
    consTank.position.set(0, 3.45, -0.95);
    consTank.castShadow = true;
    conservatorGroup.add(consTank);

    // Domed end caps
    const capGeo = new THREE.SphereGeometry(0.55, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2);
    const cap1 = new THREE.Mesh(capGeo, conservatorMaterial);
    cap1.rotation.z = -Math.PI / 2;
    cap1.position.set(1.6, 3.45, -0.95);
    const cap2 = new THREE.Mesh(capGeo, conservatorMaterial);
    cap2.rotation.z = Math.PI / 2;
    cap2.position.set(-1.6, 3.45, -0.95);
    conservatorGroup.add(cap1, cap2);

    // Support legs from tank cover
    for (const x of [-1.1, 1.1]) {
      const legGeo = new THREE.BoxGeometry(0.12, 1.6, 0.12);
      const leg = new THREE.Mesh(legGeo, tankCoverMaterial);
      leg.position.set(x, 2.6, -0.95);
      leg.castShadow = true;
      conservatorGroup.add(leg);
    }

    // Magnetic Oil Gauge (MOG) dial on the end cap
    const mogGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.08, 20);
    const mog = new THREE.Mesh(mogGeo, lvPorcelainMaterial);
    mog.rotation.z = Math.PI / 2;
    mog.position.set(1.72, 3.45, -0.95);
    conservatorGroup.add(mog);

    // Silica gel breather pipe and jar
    const breatherPipeGeo = new THREE.CylinderGeometry(0.04, 0.04, 1.8, 12);
    const breatherPipe = new THREE.Mesh(breatherPipeGeo, pipeMaterial);
    breatherPipe.position.set(1.5, 2.3, -1.05);
    const silicaJarGeo = new THREE.CylinderGeometry(0.14, 0.14, 0.45, 16);
    const silicaJar = new THREE.Mesh(silicaJarGeo, buchholzMaterial); // Blue silica crystals
    silicaJar.position.set(1.5, 1.25, -1.05);
    conservatorGroup.add(breatherPipe, silicaJar);

    scene.add(conservatorGroup);
    components.conservator = {
      group: conservatorGroup,
      origin: new THREE.Vector3(0, 0, 0),
      exploded: new THREE.Vector3(0, 2.5, -2.5), // Explodes high and backwards
    };

    // --- Component I: Buchholz Relay and Main Oil Pipe ---
    const buchholzGroup = new THREE.Group();
    // Inclined connecting pipe from top cover to conservator
    const pipePoints = [
      new THREE.Vector3(0.5, 1.8, -0.2),
      new THREE.Vector3(0.5, 2.4, -0.6),
      new THREE.Vector3(0.5, 3.2, -0.95)
    ];
    const pipeCurve = new THREE.CatmullRomCurve3(pipePoints);
    const pipeGeometry = new THREE.TubeGeometry(pipeCurve, 20, 0.08, 12, false);
    const mainOilPipe = new THREE.Mesh(pipeGeometry, pipeMaterial);
    buchholzGroup.add(mainOilPipe);

    // Buchholz relay housing in the middle of pipe
    const bRelayGeo = new THREE.BoxGeometry(0.3, 0.26, 0.42);
    const bRelay = new THREE.Mesh(bRelayGeo, buchholzMaterial);
    bRelay.position.set(0.5, 2.4, -0.6);
    bRelay.rotation.x = 0.35;
    buchholzGroup.add(bRelay);

    // Inspection glass on Buchholz relay
    const glassGeo = new THREE.BoxGeometry(0.32, 0.12, 0.18);
    const glassMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.1, transparent: true, opacity: 0.8 });
    const glass = new THREE.Mesh(glassGeo, glassMat);
    glass.position.set(0.5, 2.4, -0.6);
    glass.rotation.x = 0.35;
    buchholzGroup.add(glass);

    scene.add(buchholzGroup);
    components.buchholz = {
      group: buchholzGroup,
      origin: new THREE.Vector3(0, 0, 0),
      exploded: new THREE.Vector3(0, 3.2, -1.0),
    };

    // --- Component J: Pressure Relief Valve (PRV) with Deflector ---
    const prvGroup = new THREE.Group();
    const prvBaseGeo = new THREE.CylinderGeometry(0.25, 0.28, 0.2, 16);
    const prvBase = new THREE.Mesh(prvBaseGeo, tankCoverMaterial);
    prvBase.position.set(-1.2, 1.9, 0.2);
    const prvCapGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.18, 16);
    const prvCap = new THREE.Mesh(prvCapGeo, prvMaterial);
    prvCap.position.set(-1.2, 2.05, 0.2);
    const snoutGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.3, 12);
    const snout = new THREE.Mesh(snoutGeo, pipeMaterial);
    snout.rotation.z = Math.PI / 3;
    snout.position.set(-1.38, 2.08, 0.2);
    prvGroup.add(prvBase, prvCap, snout);

    scene.add(prvGroup);
    components.prv = {
      group: prvGroup,
      origin: new THREE.Vector3(0, 0, 0),
      exploded: new THREE.Vector3(-1.0, 3.6, 0.5),
    };

    // --- Component K: Marshalling Box / Telemetry Control Cabinet ---
    const cabinetGroup = new THREE.Group();
    const cabBodyGeo = new THREE.BoxGeometry(1.1, 1.5, 0.5);
    const cabBody = new THREE.Mesh(cabBodyGeo, cabinetMaterial);
    cabBody.position.set(0, -0.2, 1.55);
    cabBody.castShadow = true;
    // Glass window / status screen on cabinet
    const cabScreenGeo = new THREE.PlaneGeometry(0.6, 0.4);
    const cabScreenMat = new THREE.MeshBasicMaterial({ color: 0x0284c7 });
    const cabScreen = new THREE.Mesh(cabScreenGeo, cabScreenMat);
    cabScreen.position.set(0, 0.1, 1.81);
    cabinetGroup.add(cabBody, cabScreen);

    // Conduits from cabinet to tank
    const conduitGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.6, 8);
    const conduit = new THREE.Mesh(conduitGeo, pipeMaterial);
    conduit.position.set(0, 0.7, 1.55);
    cabinetGroup.add(conduit);

    scene.add(cabinetGroup);
    components.cabinet = {
      group: cabinetGroup,
      origin: new THREE.Vector3(0, 0, 0),
      exploded: new THREE.Vector3(0, -0.2, 2.8), // Slides forward
    };

    // --- Component L: On-Load Tap Changer (OLTC) Compartment ---
    const oltcGroup = new THREE.Group();
    const oltcBodyGeo = new THREE.BoxGeometry(0.8, 2.2, 0.9);
    const oltcBody = new THREE.Mesh(oltcBodyGeo, tankCoverMaterial);
    oltcBody.position.set(1.9, 0.3, 1.45);
    oltcBody.castShadow = true;
    oltcGroup.add(oltcBody);

    // Motor drive shaft
    const shaftGeo = new THREE.CylinderGeometry(0.05, 0.05, 1.4, 8);
    const shaft = new THREE.Mesh(shaftGeo, brassMaterial);
    shaft.position.set(1.9, -0.7, 1.45);
    oltcGroup.add(shaft);

    scene.add(oltcGroup);
    components.oltc = {
      group: oltcGroup,
      origin: new THREE.Vector3(0, 0, 0),
      exploded: new THREE.Vector3(2.5, 0.3, 2.2),
    };

    componentsRef.current = components;

    // ==========================================
    // 8. INTERACTIVE MOUSE / TOUCH ORBIT CONTROLS
    // ==========================================
    let isUserInteracting = false;
    let cameraDistance = 14;
    let cameraPhi = 0.55; // vertical angle
    let cameraTheta = 0.7; // horizontal angle

    const updateCameraPosition = () => {
      const x = cameraDistance * Math.cos(cameraPhi) * Math.sin(cameraTheta);
      const y = cameraDistance * Math.sin(cameraPhi);
      const z = cameraDistance * Math.cos(cameraPhi) * Math.cos(cameraTheta);
      camera.position.set(x, Math.max(y, 1.0), z);
      camera.lookAt(0, 0.6, 0);
    };

    const handleMouseDown = (e) => {
      isDraggingRef.current = true;
      isUserInteracting = true;
      previousMousePosition.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e) => {
      if (!isDraggingRef.current) return;
      const deltaX = e.clientX - previousMousePosition.current.x;
      const deltaY = e.clientY - previousMousePosition.current.y;

      cameraTheta -= deltaX * 0.007;
      cameraPhi = Math.max(0.1, Math.min(Math.PI / 2.2, cameraPhi + deltaY * 0.007));

      previousMousePosition.current = { x: e.clientX, y: e.clientY };
      updateCameraPosition();
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
      setTimeout(() => { isUserInteracting = false; }, 4000);
    };

    const handleWheel = (e) => {
      e.preventDefault();
      cameraDistance = Math.max(7, Math.min(22, cameraDistance + e.deltaY * 0.01));
      updateCameraPosition();
    };

    // Touch support for mobile devices
    let touchStartX = 0;
    let touchStartY = 0;
    const handleTouchStart = (e) => {
      if (e.touches.length === 1) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        isUserInteracting = true;
      }
    };

    const handleTouchMove = (e) => {
      if (e.touches.length === 1) {
        const deltaX = e.touches[0].clientX - touchStartX;
        const deltaY = e.touches[0].clientY - touchStartY;
        cameraTheta -= deltaX * 0.008;
        cameraPhi = Math.max(0.1, Math.min(Math.PI / 2.2, cameraPhi + deltaY * 0.008));
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        updateCameraPosition();
      }
    };

    const handleTouchEnd = () => {
      setTimeout(() => { isUserInteracting = false; }, 3000);
    };

    const domEl = renderer.domElement;
    domEl.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    domEl.addEventListener('wheel', handleWheel, { passive: false });
    domEl.addEventListener('touchstart', handleTouchStart, { passive: true });
    domEl.addEventListener('touchmove', handleTouchMove, { passive: true });
    domEl.addEventListener('touchend', handleTouchEnd);

    // ==========================================
    // 9. ANIMATION LOOP
    // ==========================================
    let lastTime = performance.now();

    const animate = (time) => {
      const delta = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      // Update assembly progress
      if (animState.current.direction !== 0) {
        animState.current.progress += delta * animState.current.speed * animState.current.direction;
        if (animState.current.progress >= 1.0) {
          animState.current.progress = 1.0;
          animState.current.direction = 0; // stop assembling, now complete!
          setIsPlaying(false);
          setAssemblyProgress(100);
          if (onAssembledChange && !animState.current.assembledNotified) {
            onAssembledChange(true);
            animState.current.assembledNotified = true;
          }
        } else if (animState.current.progress <= 0) {
          animState.current.progress = 0;
          animState.current.direction = 0;
          setIsPlaying(false);
          setAssemblyProgress(0);
        } else {
          setAssemblyProgress(Math.round(animState.current.progress * 100));
        }
      }

      // Smooth cubic easing for assembly: easeOutCubic
      const p = animState.current.progress;
      const ease = 1 - Math.pow(1 - p, 3);
      const explodeFactor = 1 - ease; // 1 = fully exploded, 0 = fully assembled

      // Interpolate each component position
      Object.keys(componentsRef.current).forEach((key) => {
        const item = componentsRef.current[key];
        item.group.position.lerpVectors(item.origin, item.exploded, explodeFactor);
      });

      // Cinematic camera movement when assembled or during assembly
      if (!isUserInteracting && cinematicMode) {
        cameraTheta += delta * 0.18; // Slow majestic rotation
        updateCameraPosition();
      }

      renderer.render(scene, camera);
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    // Resize listener
    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      domEl.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      domEl.removeEventListener('wheel', handleWheel);
      domEl.removeEventListener('touchstart', handleTouchStart);
      domEl.removeEventListener('touchmove', handleTouchMove);
      domEl.removeEventListener('touchend', handleTouchEnd);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (rendererRef.current && rendererRef.current.domElement) {
        container.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }
    };
  }, [cinematicMode]);

  // Replay animation handler
  const handleReplay = () => {
    animState.current.progress = 0;
    animState.current.direction = 1;
    animState.current.assembledNotified = false;
    setIsPlaying(true);
    setAssemblyProgress(0);
  };

  const handleTogglePlay = () => {
    if (isPlaying) {
      animState.current.direction = 0;
      setIsPlaying(false);
    } else {
      if (animState.current.progress >= 1.0) {
        animState.current.progress = 0;
      }
      animState.current.direction = 1;
      setIsPlaying(true);
    }
  };

  const handleSliderChange = (e) => {
    const val = parseFloat(e.target.value) / 100;
    animState.current.progress = val;
    animState.current.direction = 0;
    setIsPlaying(false);
    setAssemblyProgress(Math.round(val * 100));
  };

  return (
    <div className="relative w-full h-full min-h-[440px] flex flex-col justify-end overflow-hidden select-none bg-slate-950">
      {/* Three.js Canvas Container */}
      <div ref={mountRef} className="absolute inset-0 cursor-grab active:cursor-grabbing" />

      {/* Floating Industrial Watermark / Technical Badge */}
      <div className="absolute top-4 left-4 z-10 pointer-events-none flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
          <span className="text-[11px] font-mono uppercase tracking-wider font-semibold text-cyan-400 bg-cyan-950/70 border border-cyan-800/60 px-2 py-0.5 rounded">
            Interactive 3D Assembly Simulator
          </span>
        </div>
        <p className="text-xs text-slate-300 font-mono mt-0.5">
          50 MVA 132/33kV Power Transformer • CAD Assembly
        </p>
      </div>

      {/* 3D Component Labels Overlay */}
      <div className="absolute top-4 right-4 z-10 pointer-events-none hidden md:flex flex-col gap-1.5 text-right font-mono text-[11px] text-slate-400 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800 backdrop-blur-sm">
        <div className="flex items-center justify-end gap-2 text-cyan-400 font-semibold border-b border-slate-800 pb-1">
          <Layers className="w-3.5 h-3.5" />
          <span>Subsystems ({assemblyProgress}%)</span>
        </div>
        <div className="flex items-center justify-end gap-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-500"></span>
          <span>HV Porcelain Bushings (132kV)</span>
        </div>
        <div className="flex items-center justify-end gap-1.5">
          <span className="w-2 h-2 rounded-full bg-slate-300"></span>
          <span>LV Porcelain Bushings (33kV)</span>
        </div>
        <div className="flex items-center justify-end gap-1.5">
          <span className="w-2 h-2 rounded-full bg-blue-500"></span>
          <span>Conservator Tank & MOG Gauge</span>
        </div>
        <div className="flex items-center justify-end gap-1.5">
          <span className="w-2 h-2 rounded-full bg-sky-400"></span>
          <span>Buchholz Gas Relay & Oil Pipe</span>
        </div>
        <div className="flex items-center justify-end gap-1.5">
          <span className="w-2 h-2 rounded-full bg-red-500"></span>
          <span>Spring-Loaded PRV Valve</span>
        </div>
        <div className="flex items-center justify-end gap-1.5">
          <span className="w-2 h-2 rounded-full bg-slate-500"></span>
          <span>Radiator Cooling Banks (12-Fin)</span>
        </div>
        <div className="flex items-center justify-end gap-1.5">
          <span className="w-2 h-2 rounded-full bg-yellow-600"></span>
          <span>Magnetic Core & Copper Coils</span>
        </div>
      </div>

      {/* Bottom Floating Controls Bar */}
      <div className="relative z-10 mx-3 mb-3 p-3 bg-slate-900/85 backdrop-blur-md rounded-xl border border-slate-800/80 shadow-2xl flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Play / Pause & Replay */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleTogglePlay}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-medium transition active:scale-95 shadow-sm"
            title={isPlaying ? "Pause Animation" : "Play Assembly"}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isPlaying ? "Pause" : "Play"}</span>
          </button>

          <button
            onClick={handleReplay}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition active:scale-95"
            title="Replay Assembly Animation"
          >
            <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Replay</span>
          </button>

          <button
            onClick={() => setCinematicMode(prev => !prev)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border transition ${
              cinematicMode
                ? 'bg-blue-950/70 border-cyan-500/50 text-cyan-300'
                : 'bg-slate-800/70 border-slate-700 text-slate-400'
            }`}
            title="Toggle Cinematic Camera Orbit"
          >
            <Compass className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Orbit: {cinematicMode ? 'ON' : 'OFF'}</span>
          </button>
        </div>

        {/* Assembly Exploded Range Slider */}
        <div className="flex items-center gap-2.5 flex-1 min-w-[160px] max-w-xs">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Exploded</span>
          <input
            type="range"
            min="0"
            max="100"
            value={assemblyProgress}
            onChange={handleSliderChange}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
          <span className="text-[10px] font-mono text-cyan-400 font-bold min-w-[32px] text-right">
            {assemblyProgress}%
          </span>
        </div>

        {/* Interaction Hint */}
        <div className="hidden lg:flex items-center gap-1 text-[11px] text-slate-400">
          <Eye className="w-3.5 h-3.5 text-cyan-400" />
          <span>Click & drag to rotate • Scroll to zoom</span>
        </div>
      </div>
    </div>
  );
}

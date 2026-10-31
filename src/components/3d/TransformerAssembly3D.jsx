import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function TransformerAssembly3D({ isDark = true }) {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const componentsRef = useRef({});
  const animationFrameRef = useRef(null);
  const isDraggingRef = useRef(false);
  const previousMousePosition = useRef({ x: 0, y: 0 });

  // References to dynamic lights & materials for theme updates
  const themeElementsRef = useRef({
    gridHelper: null,
    shadowPlane: null,
    ambientLight: null,
    keyLight: null,
    fillLight: null,
    rimLight: null,
    materials: {}
  });

  // Animation cycle state
  // 0: Assembled pause, 1: Disassembling, 2: Exploded pause, 3: Assembling
  const animTimeline = useRef({
    state: 0, // start assembled
    stateTimer: 0,
    progress: 1.0, // 1.0 = assembled, 0.0 = exploded
    cameraTheta: 0.65,
    cameraPhi: 0.48,
    cameraDist: 14.2,
    isUserInteracting: false,
    userInteractTimeout: null
  });

  // Re-theme scene when isDark changes
  useEffect(() => {
    if (!sceneRef.current) return;
    const scene = sceneRef.current;
    const { gridHelper, shadowPlane, ambientLight, keyLight, fillLight, rimLight, materials } = themeElementsRef.current;

    if (isDark) {
      scene.background = new THREE.Color(0x0b1322);
      scene.fog = new THREE.FogExp2(0x0b1322, 0.022);

      if (ambientLight) ambientLight.color.setHex(0xc8d8ec);
      if (ambientLight) ambientLight.intensity = 1.3;

      if (keyLight) keyLight.color.setHex(0xffffff);
      if (keyLight) keyLight.intensity = 2.8;

      if (fillLight) fillLight.color.setHex(0x0284c7);
      if (fillLight) fillLight.intensity = 1.8;

      if (rimLight) rimLight.color.setHex(0x38bdf8);
      if (rimLight) rimLight.intensity = 2.2;

      if (gridHelper) {
        scene.remove(gridHelper);
        const newGrid = new THREE.GridHelper(32, 40, 0x1e3a8a, 0x172554);
        newGrid.position.y = -2.2;
        scene.add(newGrid);
        themeElementsRef.current.gridHelper = newGrid;
      }

      if (shadowPlane) {
        shadowPlane.material.opacity = 0.45;
      }

      // Materials update for Dark Theme
      if (materials.tank) {
        materials.tank.color.setHex(0x3b4a5d);
        materials.tank.metalness = 0.7;
        materials.tank.roughness = 0.3;
      }
      if (materials.tankCover) {
        materials.tankCover.color.setHex(0x232f3e);
      }
      if (materials.radiator) {
        materials.radiator.color.setHex(0x526071);
      }
    } else {
      // Light Theme
      scene.background = new THREE.Color(0xf1f5f9);
      scene.fog = new THREE.FogExp2(0xf1f5f9, 0.02);

      if (ambientLight) ambientLight.color.setHex(0xffffff);
      if (ambientLight) ambientLight.intensity = 1.5;

      if (keyLight) keyLight.color.setHex(0xfffaed);
      if (keyLight) keyLight.intensity = 2.2;

      if (fillLight) fillLight.color.setHex(0x64748b);
      if (fillLight) fillLight.intensity = 1.4;

      if (rimLight) rimLight.color.setHex(0x0284c7);
      if (rimLight) rimLight.intensity = 1.6;

      if (gridHelper) {
        scene.remove(gridHelper);
        const newGrid = new THREE.GridHelper(32, 40, 0x94a3b8, 0xcbd5e1);
        newGrid.position.y = -2.2;
        scene.add(newGrid);
        themeElementsRef.current.gridHelper = newGrid;
      }

      if (shadowPlane) {
        shadowPlane.material.opacity = 0.18;
      }

      // Materials update for Light Theme
      if (materials.tank) {
        materials.tank.color.setHex(0x2a3749);
        materials.tank.metalness = 0.6;
        materials.tank.roughness = 0.35;
      }
      if (materials.tankCover) {
        materials.tankCover.color.setHex(0x1a2332);
      }
      if (materials.radiator) {
        materials.radiator.color.setHex(0x424f60);
      }
    }
  }, [isDark]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const initialBg = isDark ? 0x0b1322 : 0xf1f5f9;
    scene.background = new THREE.Color(initialBg);
    scene.fog = new THREE.FogExp2(initialBg, 0.022);

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(11, 6.8, 13.5);
    camera.lookAt(0, 0.9, 0);
    cameraRef.current = camera;

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = isDark ? 1.25 : 1.15;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight(isDark ? 0xc8d8ec : 0xffffff, isDark ? 1.3 : 1.5);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(isDark ? 0xffffff : 0xfffaed, isDark ? 2.8 : 2.2);
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

    const fillLight = new THREE.DirectionalLight(isDark ? 0x0284c7 : 0x64748b, isDark ? 1.8 : 1.4);
    fillLight.position.set(-10, 8, -8);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(isDark ? 0x38bdf8 : 0x0284c7, isDark ? 2.2 : 1.6);
    rimLight.position.set(0, -5, -12);
    scene.add(rimLight);

    const pointLight = new THREE.PointLight(0x60a5fa, 1.2, 20);
    pointLight.position.set(0, 5, 0);
    scene.add(pointLight);

    // 5. Floor Grid and Shadow Plane
    const gridColor1 = isDark ? 0x1e3a8a : 0x94a3b8;
    const gridColor2 = isDark ? 0x172554 : 0xcbd5e1;
    const gridHelper = new THREE.GridHelper(32, 40, gridColor1, gridColor2);
    gridHelper.position.y = -2.2;
    scene.add(gridHelper);

    const shadowPlaneGeo = new THREE.PlaneGeometry(24, 24);
    const shadowPlaneMat = new THREE.ShadowMaterial({ opacity: isDark ? 0.45 : 0.18 });
    const shadowPlane = new THREE.Mesh(shadowPlaneGeo, shadowPlaneMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -2.19;
    shadowPlane.receiveShadow = true;
    scene.add(shadowPlane);

    // 6. Materials
    const tankMaterial = new THREE.MeshStandardMaterial({
      color: isDark ? 0x3b4a5d : 0x2a3749,
      metalness: isDark ? 0.7 : 0.6,
      roughness: isDark ? 0.3 : 0.35,
    });

    const tankCoverMaterial = new THREE.MeshStandardMaterial({
      color: isDark ? 0x232f3e : 0x1a2332,
      metalness: 0.75,
      roughness: 0.28,
    });

    const copperMaterial = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      metalness: 0.88,
      roughness: 0.22,
    });

    const coreMaterial = new THREE.MeshStandardMaterial({
      color: 0x1f2937,
      metalness: 0.82,
      roughness: 0.38,
    });

    const hvPorcelainMaterial = new THREE.MeshStandardMaterial({
      color: 0x881337,
      metalness: 0.15,
      roughness: 0.12,
    });

    const lvPorcelainMaterial = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      metalness: 0.15,
      roughness: 0.18,
    });

    const brassMaterial = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.9,
      roughness: 0.2,
    });

    const radiatorMaterial = new THREE.MeshStandardMaterial({
      color: isDark ? 0x526071 : 0x424f60,
      metalness: 0.75,
      roughness: 0.38,
    });

    const conservatorMaterial = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      metalness: 0.65,
      roughness: 0.3,
    });

    const pipeMaterial = new THREE.MeshStandardMaterial({
      color: 0x64748b,
      metalness: 0.7,
      roughness: 0.3,
    });

    const buchholzMaterial = new THREE.MeshStandardMaterial({
      color: 0x0369a1,
      metalness: 0.6,
      roughness: 0.28,
    });

    const prvMaterial = new THREE.MeshStandardMaterial({
      color: 0xdc2626,
      metalness: 0.55,
      roughness: 0.3,
    });

    const cabinetMaterial = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      metalness: 0.75,
      roughness: 0.25,
    });

    themeElementsRef.current = {
      gridHelper,
      shadowPlane,
      ambientLight,
      keyLight,
      fillLight,
      rimLight,
      materials: {
        tank: tankMaterial,
        tankCover: tankCoverMaterial,
        radiator: radiatorMaterial
      }
    };

    // ==========================================
    // 7. BUILD HIGH-PRECISION TRANSFORMER MODEL
    // ==========================================
    const components = {};

    // --- Component A: Main Transformer Tank & Skid ---
    const tankGroup = new THREE.Group();
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

    // Skid base rails with rollers
    const skidGeo = new THREE.BoxGeometry(4.8, 0.25, 0.35);
    const skid1 = new THREE.Mesh(skidGeo, tankCoverMaterial);
    skid1.position.set(0, -1.85, 0.9);
    skid1.castShadow = true;
    const skid2 = new THREE.Mesh(skidGeo, tankCoverMaterial);
    skid2.position.set(0, -1.85, -0.9);
    skid2.castShadow = true;
    tankGroup.add(skid1, skid2);

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
      exploded: new THREE.Vector3(0, -2.2, 0)
    };

    // --- Component B: Core & Coil Winding Assembly ---
    const coreGroup = new THREE.Group();
    const limbGeo = new THREE.CylinderGeometry(0.42, 0.42, 2.6, 24);
    const yokeGeo = new THREE.BoxGeometry(3.4, 0.35, 0.85);

    const topYoke = new THREE.Mesh(yokeGeo, coreMaterial);
    topYoke.position.y = 1.15;
    topYoke.castShadow = true;
    const bottomYoke = new THREE.Mesh(yokeGeo, coreMaterial);
    bottomYoke.position.y = -1.15;
    bottomYoke.castShadow = true;
    coreGroup.add(topYoke, bottomYoke);

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
      exploded: new THREE.Vector3(0, 0.3, 0)
    };

    // --- Component C: Tank Top Cover & Flange ---
    const coverGroup = new THREE.Group();
    const coverPlateGeo = new THREE.BoxGeometry(4.4, 0.15, 2.8);
    const coverPlate = new THREE.Mesh(coverPlateGeo, tankCoverMaterial);
    coverPlate.position.y = 1.75;
    coverPlate.castShadow = true;
    coverGroup.add(coverPlate);

    const flangeBorderGeo = new THREE.BoxGeometry(4.5, 0.08, 2.9);
    const flangeBorder = new THREE.Mesh(flangeBorderGeo, tankMaterial);
    flangeBorder.position.y = 1.7;
    coverGroup.add(flangeBorder);

    scene.add(coverGroup);
    components.cover = {
      group: coverGroup,
      origin: new THREE.Vector3(0, 0, 0),
      exploded: new THREE.Vector3(0, 2.6, 0)
    };

    // --- Component D: HV Bushings (High Voltage 132kV Porcelain Sheds) ---
    const hvBushingsGroup = new THREE.Group();
    [-1.2, 0, 1.2].forEach((xPos) => {
      const bGroup = new THREE.Group();
      const turretGeo = new THREE.CylinderGeometry(0.24, 0.28, 0.35, 16);
      const turret = new THREE.Mesh(turretGeo, tankCoverMaterial);
      turret.position.y = 1.95;
      bGroup.add(turret);

      const stemGeo = new THREE.CylinderGeometry(0.12, 0.16, 1.6, 16);
      const stem = new THREE.Mesh(stemGeo, hvPorcelainMaterial);
      stem.position.y = 2.8;
      stem.castShadow = true;
      bGroup.add(stem);

      for (let s = 2.15; s <= 3.4; s += 0.22) {
        const shedGeo = new THREE.ConeGeometry(0.32, 0.12, 20);
        const shed = new THREE.Mesh(shedGeo, hvPorcelainMaterial);
        shed.position.y = s;
        shed.castShadow = true;
        bGroup.add(shed);
      }

      const terminalGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.3, 12);
      const terminal = new THREE.Mesh(terminalGeo, brassMaterial);
      terminal.position.y = 3.7;
      bGroup.add(terminal);

      const coronaGeo = new THREE.TorusGeometry(0.22, 0.03, 8, 24);
      const corona = new THREE.Mesh(coronaGeo, brassMaterial);
      corona.rotation.x = Math.PI / 2;
      corona.position.y = 3.65;
      bGroup.add(corona);

      bGroup.position.set(xPos, 0, 0.6);
      hvBushingsGroup.add(bGroup);
    });

    scene.add(hvBushingsGroup);
    components.hvBushings = {
      group: hvBushingsGroup,
      origin: new THREE.Vector3(0, 0, 0),
      exploded: new THREE.Vector3(0, 4.6, 2.2)
    };

    // --- Component E: LV Bushings (Low Voltage 33kV Porcelain Sheds) ---
    const lvBushingsGroup = new THREE.Group();
    [-1.2, -0.4, 0.4, 1.2].forEach((xPos) => {
      const bGroup = new THREE.Group();
      const stemGeo = new THREE.CylinderGeometry(0.1, 0.14, 0.9, 16);
      const stem = new THREE.Mesh(stemGeo, lvPorcelainMaterial);
      stem.position.y = 2.3;
      stem.castShadow = true;
      bGroup.add(stem);

      for (let s = 2.0; s <= 2.6; s += 0.22) {
        const shedGeo = new THREE.ConeGeometry(0.24, 0.1, 16);
        const shed = new THREE.Mesh(shedGeo, lvPorcelainMaterial);
        shed.position.y = s;
        bGroup.add(shed);
      }

      const palmGeo = new THREE.BoxGeometry(0.12, 0.25, 0.08);
      const palm = new THREE.Mesh(palmGeo, brassMaterial);
      palm.position.y = 2.85;
      bGroup.add(palm);

      bGroup.position.set(xPos, 0, -0.6);
      lvBushingsGroup.add(bGroup);
    });

    scene.add(lvBushingsGroup);
    components.lvBushings = {
      group: lvBushingsGroup,
      origin: new THREE.Vector3(0, 0, 0),
      exploded: new THREE.Vector3(0, 4.2, -2.2)
    };

    // --- Component F: Left Radiator Cooling Bank ---
    const radLeftGroup = new THREE.Group();
    const headerGeo = new THREE.CylinderGeometry(0.14, 0.14, 2.2, 16);
    const topHeaderL = new THREE.Mesh(headerGeo, pipeMaterial);
    topHeaderL.rotation.x = Math.PI / 2;
    topHeaderL.position.set(-2.8, 1.1, 0);
    const btmHeaderL = new THREE.Mesh(headerGeo, pipeMaterial);
    btmHeaderL.rotation.x = Math.PI / 2;
    btmHeaderL.position.set(-2.8, -1.1, 0);
    radLeftGroup.add(topHeaderL, btmHeaderL);

    for (const y of [1.1, -1.1]) {
      const flangePipeGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.8, 16);
      const fPipe = new THREE.Mesh(flangePipeGeo, pipeMaterial);
      fPipe.rotation.z = Math.PI / 2;
      fPipe.position.set(-2.4, y, 0);
      radLeftGroup.add(fPipe);
    }

    for (let z = -0.9; z <= 0.9; z += 0.16) {
      const finGeo = new THREE.BoxGeometry(0.75, 2.2, 0.02);
      const fin = new THREE.Mesh(finGeo, radiatorMaterial);
      fin.position.set(-2.8, 0, z);
      fin.castShadow = true;
      radLeftGroup.add(fin);
    }

    const fanCowlGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.15, 20);
    const fanCowl = new THREE.Mesh(fanCowlGeo, tankCoverMaterial);
    fanCowl.position.set(-2.8, -1.4, 0);
    radLeftGroup.add(fanCowl);

    scene.add(radLeftGroup);
    components.radiatorLeft = {
      group: radLeftGroup,
      origin: new THREE.Vector3(0, 0, 0),
      exploded: new THREE.Vector3(-3.8, 0, 0)
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
      exploded: new THREE.Vector3(3.8, 0, 0)
    };

    // --- Component H: Conservator Tank & MOG ---
    const conservatorGroup = new THREE.Group();
    const consTankGeo = new THREE.CylinderGeometry(0.55, 0.55, 3.2, 24);
    const consTank = new THREE.Mesh(consTankGeo, conservatorMaterial);
    consTank.rotation.z = Math.PI / 2;
    consTank.position.set(0, 3.45, -0.95);
    consTank.castShadow = true;
    conservatorGroup.add(consTank);

    const capGeo = new THREE.SphereGeometry(0.55, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2);
    const cap1 = new THREE.Mesh(capGeo, conservatorMaterial);
    cap1.rotation.z = -Math.PI / 2;
    cap1.position.set(1.6, 3.45, -0.95);
    const cap2 = new THREE.Mesh(capGeo, conservatorMaterial);
    cap2.rotation.z = Math.PI / 2;
    cap2.position.set(-1.6, 3.45, -0.95);
    conservatorGroup.add(cap1, cap2);

    for (const x of [-1.1, 1.1]) {
      const legGeo = new THREE.BoxGeometry(0.12, 1.6, 0.12);
      const leg = new THREE.Mesh(legGeo, tankCoverMaterial);
      leg.position.set(x, 2.6, -0.95);
      leg.castShadow = true;
      conservatorGroup.add(leg);
    }

    const mogGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.08, 20);
    const mog = new THREE.Mesh(mogGeo, lvPorcelainMaterial);
    mog.rotation.z = Math.PI / 2;
    mog.position.set(1.72, 3.45, -0.95);
    conservatorGroup.add(mog);

    const breatherPipeGeo = new THREE.CylinderGeometry(0.04, 0.04, 1.8, 12);
    const breatherPipe = new THREE.Mesh(breatherPipeGeo, pipeMaterial);
    breatherPipe.position.set(1.5, 2.3, -1.05);
    const silicaJarGeo = new THREE.CylinderGeometry(0.14, 0.14, 0.45, 16);
    const silicaJar = new THREE.Mesh(silicaJarGeo, buchholzMaterial);
    silicaJar.position.set(1.5, 1.25, -1.05);
    conservatorGroup.add(breatherPipe, silicaJar);

    scene.add(conservatorGroup);
    components.conservator = {
      group: conservatorGroup,
      origin: new THREE.Vector3(0, 0, 0),
      exploded: new THREE.Vector3(0, 3.0, -3.0)
    };

    // --- Component I: Buchholz Relay and Main Oil Pipe ---
    const buchholzGroup = new THREE.Group();
    const pipePoints = [
      new THREE.Vector3(0.5, 1.8, -0.2),
      new THREE.Vector3(0.5, 2.4, -0.6),
      new THREE.Vector3(0.5, 3.2, -0.95)
    ];
    const pipeCurve = new THREE.CatmullRomCurve3(pipePoints);
    const pipeGeometry = new THREE.TubeGeometry(pipeCurve, 20, 0.08, 12, false);
    const mainOilPipe = new THREE.Mesh(pipeGeometry, pipeMaterial);
    buchholzGroup.add(mainOilPipe);

    const bRelayGeo = new THREE.BoxGeometry(0.3, 0.26, 0.42);
    const bRelay = new THREE.Mesh(bRelayGeo, buchholzMaterial);
    bRelay.position.set(0.5, 2.4, -0.6);
    bRelay.rotation.x = 0.35;
    buchholzGroup.add(bRelay);

    scene.add(buchholzGroup);
    components.buchholz = {
      group: buchholzGroup,
      origin: new THREE.Vector3(0, 0, 0),
      exploded: new THREE.Vector3(0, 3.6, -1.2)
    };

    // --- Component J: Pressure Relief Valve (PRV) ---
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
      exploded: new THREE.Vector3(-1.2, 4.0, 0.6)
    };

    // --- Component K: Marshalling Cabinet ---
    const cabinetGroup = new THREE.Group();
    const cabBodyGeo = new THREE.BoxGeometry(1.1, 1.5, 0.5);
    const cabBody = new THREE.Mesh(cabBodyGeo, cabinetMaterial);
    cabBody.position.set(0, -0.2, 1.55);
    cabBody.castShadow = true;
    cabinetGroup.add(cabBody);

    scene.add(cabinetGroup);
    components.cabinet = {
      group: cabinetGroup,
      origin: new THREE.Vector3(0, 0, 0),
      exploded: new THREE.Vector3(0, -0.2, 3.2)
    };

    // --- Component L: On-Load Tap Changer (OLTC) ---
    const oltcGroup = new THREE.Group();
    const oltcBodyGeo = new THREE.BoxGeometry(0.8, 2.2, 0.9);
    const oltcBody = new THREE.Mesh(oltcBodyGeo, tankCoverMaterial);
    oltcBody.position.set(1.9, 0.3, 1.45);
    oltcBody.castShadow = true;
    oltcGroup.add(oltcBody);

    const shaftGeo = new THREE.CylinderGeometry(0.05, 0.05, 1.4, 8);
    const shaft = new THREE.Mesh(shaftGeo, brassMaterial);
    shaft.position.set(1.9, -0.7, 1.45);
    oltcGroup.add(shaft);

    scene.add(oltcGroup);
    components.oltc = {
      group: oltcGroup,
      origin: new THREE.Vector3(0, 0, 0),
      exploded: new THREE.Vector3(2.8, 0.3, 2.5)
    };

    componentsRef.current = components;

    // ==========================================
    // 8. INTERACTIVE ORBIT (Mouse/Touch supported, idle auto-orbit)
    // ==========================================
    const updateCamPos = () => {
      const { cameraDist, cameraPhi, cameraTheta } = animTimeline.current;
      const x = cameraDist * Math.cos(cameraPhi) * Math.sin(cameraTheta);
      const y = cameraDist * Math.sin(cameraPhi);
      const z = cameraDist * Math.cos(cameraPhi) * Math.cos(cameraTheta);
      camera.position.set(x, Math.max(y, 1.2), z);
      camera.lookAt(0, 0.8, 0);
    };

    const handleMouseDown = (e) => {
      isDraggingRef.current = true;
      animTimeline.current.isUserInteracting = true;
      previousMousePosition.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e) => {
      if (!isDraggingRef.current) return;
      const deltaX = e.clientX - previousMousePosition.current.x;
      const deltaY = e.clientY - previousMousePosition.current.y;

      animTimeline.current.cameraTheta -= deltaX * 0.007;
      animTimeline.current.cameraPhi = Math.max(0.12, Math.min(Math.PI / 2.3, animTimeline.current.cameraPhi + deltaY * 0.007));

      previousMousePosition.current = { x: e.clientX, y: e.clientY };
      updateCamPos();
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
      clearTimeout(animTimeline.current.userInteractTimeout);
      animTimeline.current.userInteractTimeout = setTimeout(() => {
        animTimeline.current.isUserInteracting = false;
      }, 3500);
    };

    const handleWheel = (e) => {
      e.preventDefault();
      animTimeline.current.cameraDist = Math.max(8, Math.min(22, animTimeline.current.cameraDist + e.deltaY * 0.01));
      updateCamPos();
    };

    // Touch support for mobile devices
    let touchX = 0;
    let touchY = 0;
    const handleTouchStart = (e) => {
      if (e.touches.length === 1) {
        touchX = e.touches[0].clientX;
        touchY = e.touches[0].clientY;
        animTimeline.current.isUserInteracting = true;
      }
    };

    const handleTouchMove = (e) => {
      if (e.touches.length === 1) {
        const dx = e.touches[0].clientX - touchX;
        const dy = e.touches[0].clientY - touchY;
        animTimeline.current.cameraTheta -= dx * 0.008;
        animTimeline.current.cameraPhi = Math.max(0.12, Math.min(Math.PI / 2.3, animTimeline.current.cameraPhi + dy * 0.008));
        touchX = e.touches[0].clientX;
        touchY = e.touches[0].clientY;
        updateCamPos();
      }
    };

    const handleTouchEnd = () => {
      clearTimeout(animTimeline.current.userInteractTimeout);
      animTimeline.current.userInteractTimeout = setTimeout(() => {
        animTimeline.current.isUserInteracting = false;
      }, 3000);
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
    // 9. AUTOMATIC CONTINUOUS ASSEMBLY/DISASSEMBLY LOOP
    // ==========================================
    // Timeline parameters (in seconds):
    const ASSEMBLED_PAUSE = 2.4;  // Hold complete assembly
    const DISASSEMBLE_DUR = 3.2;  // Disassemble outwards
    const EXPLODED_PAUSE = 1.8;   // Hold exploded components in 3D
    const ASSEMBLE_DUR = 3.2;     // Assemble smoothly back

    // Smooth sinusoidal easeInOut function
    const easeInOut = (t) => 0.5 * (1 - Math.cos(Math.PI * t));

    let lastTime = performance.now();

    const animateLoop = (now) => {
      const delta = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      const tLine = animTimeline.current;
      tLine.stateTimer += delta;

      if (tLine.state === 0) {
        // STATE 0: ASSEMBLED PAUSE
        tLine.progress = 1.0;
        if (tLine.stateTimer >= ASSEMBLED_PAUSE) {
          tLine.state = 1; // transition to disassembling
          tLine.stateTimer = 0;
        }
      } else if (tLine.state === 1) {
        // STATE 1: DISASSEMBLING (1.0 -> 0.0)
        const t = Math.min(1.0, tLine.stateTimer / DISASSEMBLE_DUR);
        tLine.progress = 1.0 - easeInOut(t);
        if (t >= 1.0) {
          tLine.state = 2; // transition to exploded pause
          tLine.stateTimer = 0;
          tLine.progress = 0.0;
        }
      } else if (tLine.state === 2) {
        // STATE 2: EXPLODED PAUSE
        tLine.progress = 0.0;
        if (tLine.stateTimer >= EXPLODED_PAUSE) {
          tLine.state = 3; // transition to assembling
          tLine.stateTimer = 0;
        }
      } else if (tLine.state === 3) {
        // STATE 3: ASSEMBLING (0.0 -> 1.0)
        const t = Math.min(1.0, tLine.stateTimer / ASSEMBLE_DUR);
        tLine.progress = easeInOut(t);
        if (t >= 1.0) {
          tLine.state = 0; // back to assembled pause
          tLine.stateTimer = 0;
          tLine.progress = 1.0;
        }
      }

      // Explode factor: 0 = fully assembled, 1 = fully exploded
      const explodeFactor = 1.0 - tLine.progress;

      // Update positions of all 3D transformer subsystems
      Object.keys(componentsRef.current).forEach((key) => {
        const item = componentsRef.current[key];
        item.group.position.lerpVectors(item.origin, item.exploded, explodeFactor);
      });

      // Automatic smooth camera rotation (if user is not actively dragging)
      if (!tLine.isUserInteracting) {
        tLine.cameraTheta += delta * 0.14;
        updateCamPos();
      }

      renderer.render(scene, camera);
      animationFrameRef.current = requestAnimationFrame(animateLoop);
    };

    animationFrameRef.current = requestAnimationFrame(animateLoop);

    // Responsive window resize
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
  }, []);

  return (
    <div className="relative w-full h-full min-h-[460px] sm:min-h-[520px] overflow-hidden select-none">
      {/* 3D Canvas element - zero clutter, no buttons */}
      <div ref={mountRef} className="absolute inset-0 cursor-grab active:cursor-grabbing" />
    </div>
  );
}

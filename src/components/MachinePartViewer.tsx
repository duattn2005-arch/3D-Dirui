import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export type MachinePartKind = 'carousel' | 'reactionDisk' | 'pipetting';

interface MachinePartViewerProps {
  part: MachinePartKind;
  title: string;
  subtitle?: string;
  heightClassName?: string;
}

interface PartSceneRefs {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  controls: OrbitControls;
  spinGroups: THREE.Object3D[];
  armRoot?: THREE.Group;
  probeNeedle?: THREE.Mesh;
  mixerRoot?: THREE.Group;
  mixerPaddle?: THREE.Mesh;
  defaultCameraPos: THREE.Vector3;
  defaultTarget: THREE.Vector3;
  targetCameraPos: THREE.Vector3;
  targetLookAt: THREE.Vector3;
}

const PART_META: Record<MachinePartKind, { badge: string; cameraPos: [number, number, number]; target: [number, number, number] }> = {
  carousel: { badge: 'Mâm Hóa Chất & Mẫu 67 Vị Trí', cameraPos: [6.5, 6.5, 8.5], target: [0, 0.6, 0] },
  reactionDisk: { badge: 'Mâm Cóng Phản Ứng 120 Vị Trí', cameraPos: [5.5, 6, 7.5], target: [0, 0.6, 0] },
  pipetting: { badge: 'Kim Hút, Cánh Khuấy & Trạm Rửa', cameraPos: [9.5, 6.5, 9.5], target: [2.7, 2.0, 0] }
};

export const MachinePartViewer: React.FC<MachinePartViewerProps> = ({
  part,
  title,
  subtitle,
  heightClassName = 'h-[380px]'
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<PartSceneRefs | null>(null);
  const isAutoRotatingRef = useRef(true);
  const isAnimatingCameraRef = useRef(false);
  const [isAutoRotating, setIsAutoRotating] = useState(true);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 480;
    const height = container.clientHeight || 380;

    const scene = new THREE.Scene();
    scene.background = null;

    const meta = PART_META[part];
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 200);
    camera.position.set(...meta.cameraPos);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.replaceChildren(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.target.set(...meta.target);
    controls.minDistance = 2.5;
    controls.maxDistance = 30;
    controls.maxPolarAngle = Math.PI / 2 + 0.08;
    controls.enableZoom = true;
    controls.zoomSpeed = 1.0;
    controls.addEventListener('start', () => {
      isAnimatingCameraRef.current = false;
    });

    // --- LIGHTING RIG (matches ThreeMachineViewer's palette) ---
    scene.add(new THREE.AmbientLight(0xf1f5f9, 1.4));

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
    keyLight.position.set(8, 12, 9);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 60;
    keyLight.shadow.bias = -0.0005;
    scene.add(keyLight);

    const blueRim = new THREE.DirectionalLight(0x0284c7, 1.6);
    blueRim.position.set(-8, 7, -6);
    scene.add(blueRim);

    const frontFill = new THREE.DirectionalLight(0xe0f2fe, 0.9);
    frontFill.position.set(2, 4, 9);
    scene.add(frontFill);

    const accentLight = new THREE.PointLight(0x38bdf8, 2.2, 14);
    accentLight.position.set(0, 4, 2);
    scene.add(accentLight);

    // --- SHARED MATERIALS (identical hex/roughness/metalness to ThreeMachineViewer) ---
    const matCleanroomWhite = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.22, metalness: 0.05 });
    const matDarkMedicalBezel = new THREE.MeshStandardMaterial({ color: 0x27272a, roughness: 0.45, metalness: 0.3 });
    const matStainlessSteel = new THREE.MeshStandardMaterial({ color: 0xe4e4e7, roughness: 0.15, metalness: 0.92 });
    const matReagentYellow = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.28, metalness: 0.06 });
    const matReactionDiskDark = new THREE.MeshStandardMaterial({ color: 0x27272a, roughness: 0.4, metalness: 0.45 });
    const matCuvetteGlass = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.75,
      roughness: 0.08,
      transmission: 0.85
    });
    const fluidMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.2 });
    const deckMat = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.3, metalness: 0.1 });
    const matBrassAccent = new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.85, roughness: 0.25 });

    const spinGroups: THREE.Object3D[] = [];
    let armRoot: THREE.Group | undefined;
    let probeNeedle: THREE.Mesh | undefined;
    let mixerRoot: THREE.Group | undefined;
    let mixerPaddle: THREE.Mesh | undefined;

    if (part === 'carousel') {
      // Refrigerated storehouse drum housing the disk (Section 4.3, Fig 4-8/4-9)
      const storehouseMat = new THREE.MeshStandardMaterial({ color: 0xe4e4e7, roughness: 0.35, metalness: 0.15 });
      const storehouseDrum = new THREE.Mesh(new THREE.CylinderGeometry(5.6, 5.8, 1.4, 64), storehouseMat);
      storehouseDrum.position.y = -0.9;
      storehouseDrum.receiveShadow = true;
      scene.add(storehouseDrum);

      const storehouseRim = new THREE.Mesh(new THREE.CylinderGeometry(5.65, 5.65, 0.15, 64), matDarkMedicalBezel);
      storehouseRim.position.y = -0.22;
      scene.add(storehouseRim);

      // Barcode reader scanning window (Fig 4-9: reads reagent/sample bottle labels)
      const barcodeWindow = new THREE.Mesh(
        new THREE.BoxGeometry(0.7, 0.9, 0.15),
        new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.2, metalness: 0.4 })
      );
      barcodeWindow.position.set(5.55, -0.5, 0);
      scene.add(barcodeWindow);

      const barcodeScanLine = new THREE.Mesh(
        new THREE.BoxGeometry(0.55, 0.04, 0.05),
        new THREE.MeshStandardMaterial({ color: 0xef4444, emissive: 0xef4444, emissiveIntensity: 2 })
      );
      barcodeScanLine.position.set(5.62, -0.5, 0);
      scene.add(barcodeScanLine);

      // Air cooling fan grille venting the semiconductor refrigeration module
      const fanGrille = new THREE.Mesh(
        new THREE.CylinderGeometry(0.9, 0.9, 0.15, 24),
        new THREE.MeshStandardMaterial({ color: 0x27272a, roughness: 0.5 })
      );
      fanGrille.rotation.z = Math.PI / 2;
      fanGrille.position.set(0, -0.9, 5.5);
      scene.add(fanGrille);

      const reagentDiskGroup = new THREE.Group();
      scene.add(reagentDiskGroup);
      spinGroups.push(reagentDiskGroup);

      const yellowPlate = new THREE.Mesh(new THREE.CylinderGeometry(4.4, 4.5, 0.7, 64), matReagentYellow);
      yellowPlate.castShadow = true;
      reagentDiskGroup.add(yellowPlate);

      const yellowRim = new THREE.Mesh(new THREE.CylinderGeometry(4.6, 4.6, 0.3, 64), matReagentYellow);
      yellowRim.position.y = 0.45;
      reagentDiskGroup.add(yellowRim);

      const bottleMatBlue = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.3 });
      const bottleMatAmber = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.3 });
      const capMatWhite = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 });
      const capMatRedDetergent = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.2 });

      for (let b = 0; b < 45; b++) {
        const angle = (b / 45) * Math.PI * 2;
        const radius = 3.6;
        const isDetergentPos = b === 44;
        const bMat = isDetergentPos
          ? new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 })
          : b % 2 === 0
          ? bottleMatBlue
          : bottleMatAmber;
        const bottle = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.8, 0.44), bMat);
        bottle.position.set(Math.cos(angle) * radius, 0.65, Math.sin(angle) * radius);
        bottle.rotation.y = -angle;

        const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.2, 16), isDetergentPos ? capMatRedDetergent : capMatWhite);
        cap.position.y = 0.45;
        bottle.add(cap);
        reagentDiskGroup.add(bottle);
      }

      for (let s = 0; s < 21; s++) {
        const angle = (s / 21) * Math.PI * 2;
        const radius = 2.1;
        const sampleCup = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.14, 0.55, 16), matCleanroomWhite);
        sampleCup.position.set(Math.cos(angle) * radius, 0.55, Math.sin(angle) * radius);
        reagentDiskGroup.add(sampleCup);
      }

      const centerYellowHub = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.2, 0.85, 32), matReagentYellow);
      centerYellowHub.position.y = 0.5;
      reagentDiskGroup.add(centerYellowHub);

      const centerCapScrew = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.3, 20), matStainlessSteel);
      centerCapScrew.position.y = 0.95;
      reagentDiskGroup.add(centerCapScrew);
    }

    if (part === 'reactionDisk') {
      const deck = new THREE.Mesh(new THREE.CylinderGeometry(4.5, 4.5, 0.3, 64), deckMat);
      deck.position.y = -0.5;
      deck.receiveShadow = true;
      scene.add(deck);

      const cuvetteDiskGroup = new THREE.Group();
      scene.add(cuvetteDiskGroup);
      spinGroups.push(cuvetteDiskGroup);

      const reactionHousing = new THREE.Mesh(new THREE.CylinderGeometry(3.5, 3.6, 0.7, 64), matReactionDiskDark);
      reactionHousing.castShadow = true;
      cuvetteDiskGroup.add(reactionHousing);

      const cuvetteCenterSpindle = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.3, 0.8, 32), matDarkMedicalBezel);
      cuvetteCenterSpindle.position.y = 0.5;
      cuvetteDiskGroup.add(cuvetteCenterSpindle);

      const centerGrip = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.7, 0.4, 16), matDarkMedicalBezel);
      centerGrip.position.y = 0.95;
      cuvetteDiskGroup.add(centerGrip);

      const chromeRing = new THREE.Mesh(new THREE.TorusGeometry(3.2, 0.08, 8, 64), matStainlessSteel);
      chromeRing.rotation.x = Math.PI / 2;
      chromeRing.position.y = 0.36;
      cuvetteDiskGroup.add(chromeRing);

      for (let c = 0; c < 120; c++) {
        const angle = (c / 120) * Math.PI * 2;
        const radius = 2.92;
        const isSegmentDivider = c % 20 === 0;

        const cuv = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.6, 0.22), matCuvetteGlass);
        cuv.position.set(Math.cos(angle) * radius, 0.55, Math.sin(angle) * radius);
        cuv.rotation.y = -angle;

        if (c % 3 === 0) {
          const fluid = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.35, 0.16), fluidMat);
          fluid.position.y = -0.1;
          cuv.add(fluid);
        }
        cuvetteDiskGroup.add(cuv);

        if (isSegmentDivider) {
          const dividerMarker = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.65, 0.06), matStainlessSteel);
          dividerMarker.position.set(Math.cos(angle) * (radius + 0.18), 0.55, Math.sin(angle) * (radius + 0.18));
          cuvetteDiskGroup.add(dividerMarker);
        }
      }

      // Incubation bath ring circulating 37.0C +/-0.1C water around the cuvettes (Fig 4-13/4-14)
      const incubationBathMat = new THREE.MeshPhysicalMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.35,
        roughness: 0.15,
        transmission: 0.6
      });
      const incubationBathRing = new THREE.Mesh(new THREE.TorusGeometry(3.55, 0.32, 16, 64), incubationBathMat);
      incubationBathRing.rotation.x = Math.PI / 2;
      incubationBathRing.position.y = 0.1;
      scene.add(incubationBathRing);

      // Optical system module: grating spectrophotometer housing beside the bath (Fig 4-15)
      const opticalSystemBox = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.4, 2.0), matDarkMedicalBezel);
      opticalSystemBox.position.set(-4.6, 0.3, 0);
      scene.add(opticalSystemBox);

      const opticalWindowSlit = new THREE.Mesh(
        new THREE.BoxGeometry(0.15, 0.5, 1.2),
        new THREE.MeshStandardMaterial({ color: 0x0ea5e9, emissive: 0x0ea5e9, emissiveIntensity: 1.2 })
      );
      opticalWindowSlit.position.set(-3.85, 0.3, 0);
      scene.add(opticalWindowSlit);

      // Probe/stirring rinsing bath outlet stubs mounted on the incubation bath ring
      [
        [3.4, 1.1],
        [2.6, -2.4]
      ].forEach(([px, pz]) => {
        const port = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.5, 12), matStainlessSteel);
        port.position.set(px, 0.6, pz);
        scene.add(port);
      });
    }

    if (part === 'pipetting') {
      const deck = new THREE.Mesh(new THREE.BoxGeometry(9.5, 0.3, 7.5), deckMat);
      deck.position.set(2.7, -0.15, -1.2);
      deck.receiveShadow = true;
      scene.add(deck);

      // Robotic pipetting arm assembly (probe)
      armRoot = new THREE.Group();
      scene.add(armRoot);

      const armGuide1 = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 4.6, 20), matStainlessSteel);
      armGuide1.position.set(0, 2.3, 0);
      armRoot.add(armGuide1);

      const armGuide2 = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 4.4, 16), matStainlessSteel);
      armGuide2.position.set(0.6, 2.2, 0);
      armRoot.add(armGuide2);

      const armBoom = new THREE.Mesh(new THREE.BoxGeometry(4.6, 0.5, 0.7), matCleanroomWhite);
      armBoom.position.set(1.8, 3.8, 0);
      armBoom.castShadow = true;
      armRoot.add(armBoom);

      const probeChuck = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.5, 16), matDarkMedicalBezel);
      probeChuck.position.set(3.8, 3.8, 0);
      armRoot.add(probeChuck);

      probeNeedle = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.025, 2.8, 16), matStainlessSteel);
      probeNeedle.position.set(3.8, 2.2, 0);
      armRoot.add(probeNeedle);

      // Probe rotating step motor head + gear belt driving the arm (Fig 4-1/4-2)
      const probeMotorHead = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.5, 0.5), matDarkMedicalBezel);
      probeMotorHead.position.set(0.35, 4.35, 0);
      armRoot.add(probeMotorHead);

      const probeGearBeltRing = new THREE.Mesh(new THREE.TorusGeometry(0.32, 0.04, 8, 24), matStainlessSteel);
      probeGearBeltRing.position.set(0, 4.35, 0);
      armRoot.add(probeGearBeltRing);

      // Probe up-down counterweight riding the second guide rail
      const probeUpDownWeight = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.8, 12), matStainlessSteel);
      probeUpDownWeight.position.set(0.6, 3.0, 0);
      armRoot.add(probeUpDownWeight);

      // Probe rotating gear + mandrel at the base of the column
      const probeMandrelGear = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.15, 20), matBrassAccent);
      probeMandrelGear.position.set(0, 0.15, 0);
      armRoot.add(probeMandrelGear);

      // Wash well tower (relative offset matches ThreeMachineViewer: +2.4 on Z)
      const washWellGroup = new THREE.Group();
      washWellGroup.position.set(0, 0, 2.4);
      armRoot.add(washWellGroup);

      const washWellTower = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.75, 2.0, 24), matCleanroomWhite);
      washWellTower.position.y = 1.0;
      washWellGroup.add(washWellTower);

      const washWellInner = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.4, 20), matDarkMedicalBezel);
      washWellInner.position.y = 1.95;
      washWellGroup.add(washWellInner);

      // Teflon mixer paddle assembly (relative offset matches ThreeMachineViewer: +5.4 X, -2.4 Z)
      mixerRoot = new THREE.Group();
      mixerRoot.position.set(5.4, 0, -2.4);
      armRoot.add(mixerRoot);

      const mixerBase = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.48, 2.6, 20), matStainlessSteel);
      mixerBase.position.y = 1.3;
      mixerRoot.add(mixerBase);

      // Boxy motor housing stack: swing motor on top, up-down motor to the side (Fig 4-16/4-17)
      const mixerMotorHousing = new THREE.Mesh(new THREE.BoxGeometry(0.9, 1.5, 0.9), matDarkMedicalBezel);
      mixerMotorHousing.position.set(0, 2.9, 0);
      mixerRoot.add(mixerMotorHousing);

      const mixerSwingMotorTop = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.55, 0.7), matCleanroomWhite);
      mixerSwingMotorTop.position.set(0, 3.9, 0);
      mixerRoot.add(mixerSwingMotorTop);

      const mixerUpDownMotorSide = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.9, 16), matStainlessSteel);
      mixerUpDownMotorSide.rotation.z = Math.PI / 2;
      mixerUpDownMotorSide.position.set(0.65, 2.9, 0);
      mixerRoot.add(mixerUpDownMotorSide);

      const mixerBoom = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.35, 0.5), matCleanroomWhite);
      mixerBoom.position.set(0.8, 3.2, 0);
      mixerRoot.add(mixerBoom);

      mixerPaddle = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.03, 2.4, 16), matStainlessSteel);
      mixerPaddle.position.set(1.8, 1.8, 0);
      mixerRoot.add(mixerPaddle);

      // Colorimetric cup rinsing probe rack: multiple nozzles, up-down only (Fig 4-20)
      const rinsingRackGroup = new THREE.Group();
      rinsingRackGroup.position.set(1.6, 0, 2.1);
      armRoot.add(rinsingRackGroup);

      const rinsingRackSlider = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.6, 0.6), matStainlessSteel);
      rinsingRackSlider.position.set(0, 3.1, 0);
      rinsingRackGroup.add(rinsingRackSlider);

      const rinsingRackPlate = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.15, 0.5), matDarkMedicalBezel);
      rinsingRackPlate.position.set(0, 2.6, 0);
      rinsingRackGroup.add(rinsingRackPlate);

      for (let n = 0; n < 4; n++) {
        const nozzle = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.02, 1.4, 10), matStainlessSteel);
        nozzle.position.set(-0.45 + n * 0.3, 1.9, 0);
        rinsingRackGroup.add(nozzle);
      }
    }

    const defaultCameraPos = new THREE.Vector3(...meta.cameraPos);
    const defaultTarget = new THREE.Vector3(...meta.target);

    sceneRef.current = {
      scene,
      camera,
      renderer,
      controls,
      spinGroups,
      armRoot,
      probeNeedle,
      mixerRoot,
      mixerPaddle,
      defaultCameraPos,
      defaultTarget,
      targetCameraPos: defaultCameraPos.clone(),
      targetLookAt: defaultTarget.clone()
    };

    const resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        const { width: newWidth, height: newHeight } = entry.contentRect;
        if (newWidth > 0 && newHeight > 0) {
          camera.aspect = newWidth / newHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(newWidth, newHeight);
        }
      }
    });
    resizeObserver.observe(container);

    const clock = new THREE.Clock();
    let animId: number;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const ctx = sceneRef.current;
      if (!ctx) return;
      const time = clock.getElapsedTime();

      ctx.controls.autoRotate = isAutoRotatingRef.current;
      ctx.controls.autoRotateSpeed = 1.2;

      if (isAnimatingCameraRef.current) {
        ctx.camera.position.lerp(ctx.targetCameraPos, 0.08);
        ctx.controls.target.lerp(ctx.targetLookAt, 0.08);
        if (
          ctx.camera.position.distanceTo(ctx.targetCameraPos) < 0.05 &&
          ctx.controls.target.distanceTo(ctx.targetLookAt) < 0.05
        ) {
          isAnimatingCameraRef.current = false;
        }
      }
      ctx.controls.update();

      ctx.spinGroups.forEach(group => {
        group.rotation.y += part === 'carousel' ? 0.006 : 0.0035;
      });

      if (part === 'pipetting' && ctx.armRoot && ctx.probeNeedle && ctx.mixerRoot && ctx.mixerPaddle) {
        const cycleTime = (time * 0.8) % (Math.PI * 2);
        ctx.armRoot.rotation.y = Math.sin(cycleTime) * 0.35 - 0.1;
        const probeDip = Math.max(0, Math.sin(cycleTime * 2)) * 0.6;
        ctx.probeNeedle.position.y = 1.2 - probeDip;

        ctx.mixerRoot.rotation.y = Math.cos(cycleTime) * 0.3 + 0.05;
        ctx.mixerPaddle.rotation.y += 0.45;
        ctx.mixerPaddle.position.y = 1.0 - Math.max(0, Math.cos(cycleTime * 2)) * 0.5;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
      controls.dispose();
      renderer.dispose();
      sceneRef.current = null;
    };
  }, [part]);

  const handleToggleRotate = () => {
    isAutoRotatingRef.current = !isAutoRotatingRef.current;
    setIsAutoRotating(isAutoRotatingRef.current);
  };

  const handleResetView = () => {
    const ctx = sceneRef.current;
    if (!ctx) return;
    isAnimatingCameraRef.current = true;
    ctx.targetCameraPos.copy(ctx.defaultCameraPos);
    ctx.targetLookAt.copy(ctx.defaultTarget);
  };

  return (
    <div className="relative w-full rounded-2xl overflow-hidden shadow-xl bg-slate-950 border border-slate-800 flex flex-col">
      <div className="relative w-full overflow-hidden bg-slate-950">
        <div
          ref={containerRef}
          className={`w-full ${heightClassName} relative cursor-grab active:cursor-grabbing select-none`}
          title="Kéo chuột trái để xoay tự do • Cuộn chuột để phóng to/thu nhỏ"
        />

        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none z-20">
          <div className="pointer-events-auto flex items-center gap-2.5 bg-slate-950/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800/90 shadow-lg">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <div className="flex items-center gap-2">
              <span className="text-xs md:text-sm text-white font-bold tracking-tight font-mono-code">{title}</span>
              <span className="hidden sm:inline-block text-[10px] text-cyan-300 font-mono-code bg-cyan-950/80 border border-cyan-800/60 px-2 py-0.5 rounded-md">
                {PART_META[part].badge}
              </span>
            </div>
          </div>

          <div className="pointer-events-auto flex items-center gap-1 bg-slate-950/85 backdrop-blur-md p-1 rounded-xl border border-slate-800/90 shadow-lg">
            <button
              onClick={handleToggleRotate}
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                isAutoRotating ? 'bg-cyan-600 text-white' : 'text-slate-300 hover:bg-slate-800'
              }`}
              title={isAutoRotating ? 'Dừng tự động xoay' : 'Bật tự động xoay'}
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">{isAutoRotating ? 'pause' : 'play_arrow'}</span>
            </button>
            <button
              onClick={handleResetView}
              className="p-1.5 rounded-lg text-xs text-slate-300 hover:bg-slate-800 transition-colors"
              title="Đặt lại góc nhìn"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">center_focus_strong</span>
            </button>
          </div>
        </div>

        {subtitle && (
          <div className="absolute bottom-3 left-3 right-3 pointer-events-none z-20">
            <div className="pointer-events-auto inline-block bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-800/90 text-[11px] text-slate-300 font-mono-code max-w-full">
              {subtitle}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Kept in its own module so the dynamic import can tree-shake three.js.
import * as THREE from "three";

const PAIRS = 44;
const RADIUS = 2.1;
const RISE = 0.34;
const TWIST = 0.36;
const PALETTE = [0x3b82f6, 0x8b5cf6, 0x22d3ee, 0xf59e0b];
const MISTAKE = 0xf43f5e;
const FIXED = 0x10b981;

export function mountScene(host: HTMLElement) {
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  } catch {
    return () => {};
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  host.appendChild(renderer.domElement);
  renderer.domElement.style.width = "100%";
  renderer.domElement.style.height = "100%";

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x020617, 12, 26);
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
  camera.position.set(0, 0, 16);

  scene.add(new THREE.AmbientLight(0xffffff, 0.55));
  const key = new THREE.DirectionalLight(0xffffff, 1.1);
  key.position.set(4, 6, 8);
  scene.add(key);
  const rim = new THREE.PointLight(0x8b5cf6, 2.2, 30);
  rim.position.set(-6, -4, 4);
  scene.add(rim);

  const helix = new THREE.Group();
  helix.rotation.z = 0.42;
  scene.add(helix);

  const disposables: { dispose(): void }[] = [];
  const track = <T extends { dispose(): void }>(d: T) => {
    disposables.push(d);
    return d;
  };

  // Backbone nodes: two per base pair.
  const nodeGeo = track(new THREE.SphereGeometry(0.2, 20, 20));
  const nodeMat = track(
    new THREE.MeshStandardMaterial({ roughness: 0.25, metalness: 0.35 })
  );
  const nodes = new THREE.InstancedMesh(nodeGeo, nodeMat, PAIRS * 2);

  // Base-pair rungs, split in two halves so each side can carry its own colour.
  const rungGeo = track(new THREE.CylinderGeometry(0.06, 0.06, 1, 10));
  const rungMat = track(
    new THREE.MeshStandardMaterial({ roughness: 0.4, metalness: 0.2 })
  );
  const rungs = new THREE.InstancedMesh(rungGeo, rungMat, PAIRS * 2);

  const m = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const up = new THREE.Vector3(0, 1, 0);
  const color = new THREE.Color();
  const strandA: THREE.Vector3[] = [];
  const strandB: THREE.Vector3[] = [];
  const pairColors: number[] = [];
  const mistakeIdx = new Set([6, 15, 23, 31, 38]);

  for (let i = 0; i < PAIRS; i++) {
    const a = i * TWIST;
    const y = (i - PAIRS / 2) * RISE;
    const pa = new THREE.Vector3(Math.cos(a) * RADIUS, y, Math.sin(a) * RADIUS);
    const pb = new THREE.Vector3(-pa.x, y, -pa.z);
    strandA.push(pa);
    strandB.push(pb);
    pairColors.push(mistakeIdx.has(i) ? MISTAKE : PALETTE[i % PALETTE.length]);

    nodes.setMatrixAt(i * 2, m.makeTranslation(pa.x, pa.y, pa.z));
    nodes.setMatrixAt(i * 2 + 1, m.makeTranslation(pb.x, pb.y, pb.z));
    nodes.setColorAt(i * 2, color.set(0x93c5fd));
    nodes.setColorAt(i * 2 + 1, color.set(0xc4b5fd));

    const dir = pb.clone().sub(pa);
    const half = dir.length() / 2;
    q.setFromUnitVectors(up, dir.clone().normalize());
    const scale = new THREE.Vector3(1, half, 1);
    const midA = pa.clone().addScaledVector(dir, 0.25);
    const midB = pa.clone().addScaledVector(dir, 0.75);
    rungs.setMatrixAt(i * 2, m.clone().compose(midA, q, scale));
    rungs.setMatrixAt(i * 2 + 1, m.clone().compose(midB, q, scale));
  }
  helix.add(nodes, rungs);

  const tubeMat = track(
    new THREE.MeshStandardMaterial({
      color: 0x60a5fa,
      roughness: 0.3,
      metalness: 0.4,
      transparent: true,
      opacity: 0.55,
    })
  );
  for (const strand of [strandA, strandB]) {
    const curve = new THREE.CatmullRomCurve3(strand);
    const tube = new THREE.Mesh(
      track(new THREE.TubeGeometry(curve, PAIRS * 6, 0.07, 8, false)),
      tubeMat
    );
    helix.add(tube);
  }

  // Floating "knowledge" particles.
  const COUNT = 420;
  const positions = new Float32Array(COUNT * 3);
  for (let i = 0; i < COUNT; i++) {
    const r = 4 + Math.random() * 9;
    const t = Math.random() * Math.PI * 2;
    positions[i * 3] = Math.cos(t) * r;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 18;
    positions[i * 3 + 2] = Math.sin(t) * r - 4;
  }
  const dustGeo = track(new THREE.BufferGeometry());
  dustGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const dust = new THREE.Points(
    dustGeo,
    track(
      new THREE.PointsMaterial({
        color: 0x93c5fd,
        size: 0.05,
        transparent: true,
        opacity: 0.7,
      })
    )
  );
  scene.add(dust);

  // Mistake pairs fade from rose to emerald as a wave sweeps up the helix:
  // "your mistakes become your next preparation".
  const fixedColor = new THREE.Color(FIXED);
  const paintRungs = (time: number) => {
    const wave = ((time * 0.12) % 1.4) * PAIRS - 0.2 * PAIRS;
    for (let i = 0; i < PAIRS; i++) {
      if (mistakeIdx.has(i)) {
        const k = THREE.MathUtils.clamp((wave - i) / 4, 0, 1);
        color.set(MISTAKE).lerp(fixedColor, k);
      } else {
        color.set(pairColors[i]);
      }
      const glow = Math.max(0, 1 - Math.abs(wave - i) / 3);
      color.offsetHSL(0, 0, glow * 0.18);
      rungs.setColorAt(i * 2, color);
      rungs.setColorAt(i * 2 + 1, color);
    }
    if (rungs.instanceColor) rungs.instanceColor.needsUpdate = true;
  };

  const pointer = { x: 0, y: 0 };
  const onPointer = (e: PointerEvent) => {
    pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
    pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
  };
  window.addEventListener("pointermove", onPointer, { passive: true });

  const resize = () => {
    const { clientWidth: w, clientHeight: h } = host;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    // Push the helix to the right on wide screens so the copy stays readable.
    helix.position.x = w > 1024 ? 3.4 : 0;
    camera.updateProjectionMatrix();
  };
  const ro = new ResizeObserver(resize);
  ro.observe(host);
  resize();

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  const clock = new THREE.Clock();
  let frame = 0;
  let visible = true;

  const render = () => {
    const t = clock.getElapsedTime();
    helix.rotation.y = t * 0.32;
    helix.position.y = Math.sin(t * 0.6) * 0.25;
    camera.position.x += (pointer.x * 1.4 - camera.position.x) * 0.04;
    camera.position.y += (-pointer.y * 1.0 - camera.position.y) * 0.04;
    camera.lookAt(helix.position.x * 0.5, 0, 0);
    dust.rotation.y = t * 0.03;
    paintRungs(t);
    renderer.render(scene, camera);
  };

  const loop = () => {
    frame = requestAnimationFrame(loop);
    render();
  };
  const start = () => {
    if (!frame && visible && !document.hidden && !reduceMotion) loop();
  };
  const stop = () => {
    cancelAnimationFrame(frame);
    frame = 0;
  };

  const io = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) start();
    else stop();
  });
  io.observe(host);
  const onVisibility = () => (document.hidden ? stop() : start());
  document.addEventListener("visibilitychange", onVisibility);

  if (reduceMotion) {
    paintRungs(4);
    renderer.render(scene, camera);
  } else {
    start();
  }

  return () => {
    stop();
    io.disconnect();
    ro.disconnect();
    window.removeEventListener("pointermove", onPointer);
    document.removeEventListener("visibilitychange", onVisibility);
    nodes.dispose();
    rungs.dispose();
    disposables.forEach((d) => d.dispose());
    renderer.dispose();
    renderer.domElement.remove();
  };
}

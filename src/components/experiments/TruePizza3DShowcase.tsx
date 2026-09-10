"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

export type TruePizza3DShowcaseProps = {
  variant: "bufalina" | "tera";
  eyebrow: string;
  title: string;
  lead: string;
  body: string;
  closing: string;
  notes: Array<{ label: string; detail: string }>;
};

type Vec3 = [number, number, number];
type Mesh = {
  position: WebGLBuffer;
  normal: WebGLBuffer;
  count: number;
};

type Part = {
  mesh: "sphere" | "cylinder" | "torus";
  home: Vec3;
  exploded: Vec3;
  scale: Vec3;
  rotation: Vec3;
  color: Vec3;
  opacity?: number;
  phase?: number;
};

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const smoothstep = (edge0: number, edge1: number, value: number) => {
  const x = clamp((value - edge0) / Math.max(edge1 - edge0, 0.0001));
  return x * x * (3 - 2 * x);
};

function perspective(fov: number, aspect: number, near: number, far: number) {
  const f = 1 / Math.tan(fov / 2);
  const nf = 1 / (near - far);
  return new Float32Array([
    f / aspect, 0, 0, 0,
    0, f, 0, 0,
    0, 0, (far + near) * nf, -1,
    0, 0, 2 * far * near * nf, 0,
  ]);
}

function normalize3(v: Vec3): Vec3 {
  const length = Math.hypot(v[0], v[1], v[2]) || 1;
  return [v[0] / length, v[1] / length, v[2] / length];
}

function cross3(a: Vec3, b: Vec3): Vec3 {
  return [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0],
  ];
}

function subtract3(a: Vec3, b: Vec3): Vec3 {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}

function lookAt(eye: Vec3, center: Vec3, up: Vec3) {
  const z = normalize3(subtract3(eye, center));
  const x = normalize3(cross3(up, z));
  const y = cross3(z, x);
  return new Float32Array([
    x[0], y[0], z[0], 0,
    x[1], y[1], z[1], 0,
    x[2], y[2], z[2], 0,
    -(x[0] * eye[0] + x[1] * eye[1] + x[2] * eye[2]),
    -(y[0] * eye[0] + y[1] * eye[1] + y[2] * eye[2]),
    -(z[0] * eye[0] + z[1] * eye[1] + z[2] * eye[2]),
    1,
  ]);
}

function multiplyMat4(a: Float32Array, b: Float32Array) {
  const out = new Float32Array(16);
  for (let column = 0; column < 4; column += 1) {
    for (let row = 0; row < 4; row += 1) {
      out[column * 4 + row] =
        a[row] * b[column * 4] +
        a[4 + row] * b[column * 4 + 1] +
        a[8 + row] * b[column * 4 + 2] +
        a[12 + row] * b[column * 4 + 3];
    }
  }
  return out;
}

function pushTriangle(
  positions: number[],
  normals: number[],
  a: Vec3,
  b: Vec3,
  c: Vec3,
  na: Vec3,
  nb: Vec3,
  nc: Vec3,
) {
  positions.push(...a, ...b, ...c);
  normals.push(...na, ...nb, ...nc);
}

function cylinderGeometry(radius = 1, height = 1, segments = 64) {
  const positions: number[] = [];
  const normals: number[] = [];
  const half = height / 2;

  for (let i = 0; i < segments; i += 1) {
    const a = (i / segments) * Math.PI * 2;
    const b = ((i + 1) / segments) * Math.PI * 2;
    const x0 = Math.cos(a) * radius;
    const z0 = Math.sin(a) * radius;
    const x1 = Math.cos(b) * radius;
    const z1 = Math.sin(b) * radius;

    pushTriangle(positions, normals, [0, half, 0], [x0, half, z0], [x1, half, z1], [0, 1, 0], [0, 1, 0], [0, 1, 0]);
    pushTriangle(positions, normals, [0, -half, 0], [x1, -half, z1], [x0, -half, z0], [0, -1, 0], [0, -1, 0], [0, -1, 0]);

    const n0 = normalize3([x0, 0, z0]);
    const n1 = normalize3([x1, 0, z1]);
    pushTriangle(positions, normals, [x0, -half, z0], [x1, -half, z1], [x1, half, z1], n0, n1, n1);
    pushTriangle(positions, normals, [x0, -half, z0], [x1, half, z1], [x0, half, z0], n0, n1, n0);
  }

  return { positions, normals };
}

function sphereGeometry(latSegments = 18, lonSegments = 28) {
  const positions: number[] = [];
  const normals: number[] = [];

  const point = (lat: number, lon: number): Vec3 => {
    const theta = (lat / latSegments) * Math.PI;
    const phi = (lon / lonSegments) * Math.PI * 2;
    return [Math.sin(theta) * Math.cos(phi), Math.cos(theta), Math.sin(theta) * Math.sin(phi)];
  };

  for (let lat = 0; lat < latSegments; lat += 1) {
    for (let lon = 0; lon < lonSegments; lon += 1) {
      const p00 = point(lat, lon);
      const p01 = point(lat, lon + 1);
      const p10 = point(lat + 1, lon);
      const p11 = point(lat + 1, lon + 1);
      pushTriangle(positions, normals, p00, p10, p11, p00, p10, p11);
      pushTriangle(positions, normals, p00, p11, p01, p00, p11, p01);
    }
  }

  return { positions, normals };
}

function torusGeometry(major = 1, minor = 0.16, majorSegments = 72, minorSegments = 18) {
  const positions: number[] = [];
  const normals: number[] = [];

  const point = (uIndex: number, vIndex: number) => {
    const u = (uIndex / majorSegments) * Math.PI * 2;
    const v = (vIndex / minorSegments) * Math.PI * 2;
    const normal: Vec3 = [Math.cos(v) * Math.cos(u), Math.sin(v), Math.cos(v) * Math.sin(u)];
    const position: Vec3 = [
      (major + minor * Math.cos(v)) * Math.cos(u),
      minor * Math.sin(v),
      (major + minor * Math.cos(v)) * Math.sin(u),
    ];
    return { position, normal };
  };

  for (let u = 0; u < majorSegments; u += 1) {
    for (let v = 0; v < minorSegments; v += 1) {
      const a = point(u, v);
      const b = point(u + 1, v);
      const c = point(u + 1, v + 1);
      const d = point(u, v + 1);
      pushTriangle(positions, normals, a.position, b.position, c.position, a.normal, b.normal, c.normal);
      pushTriangle(positions, normals, a.position, c.position, d.position, a.normal, c.normal, d.normal);
    }
  }

  return { positions, normals };
}

function createMesh(gl: WebGLRenderingContext, geometry: { positions: number[]; normals: number[] }): Mesh {
  const position = gl.createBuffer();
  const normal = gl.createBuffer();
  if (!position || !normal) throw new Error("Unable to create WebGL buffers");

  gl.bindBuffer(gl.ARRAY_BUFFER, position);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(geometry.positions), gl.STATIC_DRAW);
  gl.bindBuffer(gl.ARRAY_BUFFER, normal);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(geometry.normals), gl.STATIC_DRAW);
  return { position, normal, count: geometry.positions.length / 3 };
}

function rotateAroundY(position: Vec3, angle: number): Vec3 {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  return [position[0] * c + position[2] * s, position[1], -position[0] * s + position[2] * c];
}

const BUFALINA_NOTES = [
  "Pomodorino siccagno",
  "Bufala DOP",
  "Pomodorino confit",
  "Olio EVO",
  "Basilico",
];

function buildParts(variant: "bufalina" | "tera"): Part[] {
  const tera = variant === "tera";
  const crust: Vec3 = tera ? [0.64, 0.47, 0.29] : [0.72, 0.39, 0.17];
  const dough: Vec3 = tera ? [0.82, 0.68, 0.47] : [0.78, 0.52, 0.28];
  const sauce: Vec3 = tera ? [0.62, 0.20, 0.12] : [0.72, 0.08, 0.035];
  const cheese: Vec3 = tera ? [0.91, 0.88, 0.72] : [0.94, 0.91, 0.78];
  const tomato: Vec3 = tera ? [0.73, 0.20, 0.10] : [0.82, 0.12, 0.055];
  const basil: Vec3 = tera ? [0.24, 0.34, 0.22] : [0.12, 0.30, 0.10];

  const parts: Part[] = [
    { mesh: "cylinder", home: [0, -0.23, 0], exploded: [0, -2.8, 0.5], scale: [2.42, 0.34, 2.42], rotation: [0, 0, 0], color: dough },
    { mesh: "torus", home: [0, 0.02, 0], exploded: [0, -1.9, 0.2], scale: [2.28, 0.64, 2.28], rotation: [0, 0, 0], color: crust },
    { mesh: "cylinder", home: [0, 0.13, 0], exploded: [0, -0.78, -0.1], scale: [2.08, 0.10, 2.08], rotation: [0, 0, 0], color: sauce },
  ];

  const cheesePositions: Vec3[] = [
    [-0.95, 0.35, -0.48], [0.28, 0.38, -0.92], [0.98, 0.36, -0.28],
    [-0.45, 0.39, 0.18], [0.58, 0.40, 0.34], [-0.92, 0.36, 0.72],
    [0.12, 0.38, 0.94], [1.12, 0.34, 0.64],
  ];
  cheesePositions.forEach((home, index) => {
    const angle = (index / cheesePositions.length) * Math.PI * 2;
    parts.push({
      mesh: "sphere",
      home,
      exploded: [home[0] * 1.35, 1.8 + (index % 3) * 0.28, home[2] * 1.35 + Math.sin(angle) * 0.4],
      scale: [0.40 + (index % 2) * 0.08, 0.14 + (index % 3) * 0.018, 0.34 + ((index + 1) % 2) * 0.07],
      rotation: [0, angle * 0.35, 0],
      color: cheese,
      phase: index * 0.7,
    });
  });

  const tomatoPositions: Vec3[] = [
    [-1.28, 0.48, -0.05], [-0.15, 0.49, -1.24], [1.08, 0.48, -0.93],
    [1.28, 0.49, 0.14], [0.62, 0.50, 1.15], [-0.62, 0.49, 1.14],
  ];
  tomatoPositions.forEach((home, index) => {
    parts.push({
      mesh: "sphere",
      home,
      exploded: [home[0] * 1.55, 2.72 + (index % 2) * 0.34, home[2] * 1.55],
      scale: [0.27, 0.14, 0.22],
      rotation: [0.15, index * 0.8, 0.1],
      color: tomato,
      phase: 2 + index * 0.8,
    });
  });

  const basilPositions: Vec3[] = [
    [-0.40, 0.62, -0.72], [0.62, 0.62, -0.42], [0.25, 0.62, 0.66], [-0.82, 0.62, 0.42],
  ];
  basilPositions.forEach((home, index) => {
    parts.push({
      mesh: "sphere",
      home,
      exploded: [home[0] * 1.8, 3.65 + index * 0.18, home[2] * 1.8],
      scale: [0.35, 0.045, 0.13],
      rotation: [0.05, index * 1.35, index % 2 ? 0.25 : -0.25],
      color: basil,
      phase: 4 + index,
    });
  });

  for (let index = 0; index < 10; index += 1) {
    const angle = (index / 10) * Math.PI * 2 + 0.35;
    const radius = 0.55 + (index % 4) * 0.36;
    const home: Vec3 = [Math.cos(angle) * radius, 0.57, Math.sin(angle) * radius];
    parts.push({
      mesh: "sphere",
      home,
      exploded: [Math.cos(angle) * (2.3 + (index % 2) * 0.3), 4.35 + (index % 3) * 0.22, Math.sin(angle) * (2.3 + (index % 2) * 0.3)],
      scale: [0.055, 0.035, 0.055],
      rotation: [0, 0, 0],
      color: tera ? [0.72, 0.63, 0.42] : [0.92, 0.62, 0.16],
      opacity: 0.86,
      phase: 6 + index * 0.4,
    });
  }

  return parts;
}

function PizzaWebGL({ variant, progress, reducedMotion }: { variant: "bufalina" | "tera"; progress: number; reducedMotion: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const progressRef = useRef(progress);
  const pointerRef = useRef({ x: 0, y: 0 });
  const targetPointerRef = useRef({ x: 0, y: 0 });
  const [failed, setFailed] = useState(false);
  const parts = useMemo(() => buildParts(variant), [variant]);

  useEffect(() => {
    progressRef.current = progress;
  }, [progress]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let raf = 0;
    let disposed = false;
    let resizeObserver: ResizeObserver | null = null;

    try {
      const gl = canvas.getContext("webgl", {
        alpha: true,
        antialias: true,
        depth: true,
        powerPreference: "high-performance",
      });
      if (!gl) throw new Error("WebGL unavailable");

      const vertexSource = `
        attribute vec3 a_position;
        attribute vec3 a_normal;
        uniform mat4 u_viewProjection;
        uniform vec3 u_translation;
        uniform vec3 u_rotation;
        uniform vec3 u_scale;
        varying vec3 v_normal;
        varying vec3 v_world;

        mat3 rotateX(float a) {
          float c = cos(a); float s = sin(a);
          return mat3(1.0,0.0,0.0, 0.0,c,s, 0.0,-s,c);
        }
        mat3 rotateY(float a) {
          float c = cos(a); float s = sin(a);
          return mat3(c,0.0,-s, 0.0,1.0,0.0, s,0.0,c);
        }
        mat3 rotateZ(float a) {
          float c = cos(a); float s = sin(a);
          return mat3(c,s,0.0, -s,c,0.0, 0.0,0.0,1.0);
        }

        void main() {
          mat3 rotation = rotateZ(u_rotation.z) * rotateY(u_rotation.y) * rotateX(u_rotation.x);
          vec3 scaled = a_position * u_scale;
          vec3 world = rotation * scaled + u_translation;
          vec3 safeScale = max(abs(u_scale), vec3(0.0001));
          v_normal = normalize(rotation * (a_normal / safeScale));
          v_world = world;
          gl_Position = u_viewProjection * vec4(world, 1.0);
        }
      `;

      const fragmentSource = `
        precision mediump float;
        varying vec3 v_normal;
        varying vec3 v_world;
        uniform vec3 u_color;
        uniform vec3 u_camera;
        uniform vec3 u_keyColor;
        uniform vec3 u_fillColor;
        uniform vec3 u_pointPosition;
        uniform float u_opacity;
        uniform float u_shininess;

        void main() {
          vec3 n = normalize(v_normal);
          vec3 keyDir = normalize(vec3(-0.55, 0.85, 0.42));
          vec3 fillDir = normalize(vec3(0.72, 0.35, -0.60));
          vec3 viewDir = normalize(u_camera - v_world);
          vec3 halfDir = normalize(keyDir + viewDir);
          float key = max(dot(n, keyDir), 0.0);
          float fill = max(dot(n, fillDir), 0.0);
          float specular = pow(max(dot(n, halfDir), 0.0), mix(10.0, 72.0, u_shininess));
          float rim = pow(1.0 - max(dot(n, viewDir), 0.0), 2.2);
          vec3 pointVector = u_pointPosition - v_world;
          float pointDistance = max(length(pointVector), 0.001);
          float point = max(dot(n, normalize(pointVector)), 0.0) / (1.0 + 0.08 * pointDistance * pointDistance);

          vec3 light = vec3(0.18) + u_keyColor * key * 0.78 + u_fillColor * fill * 0.32;
          vec3 color = u_color * light;
          color += u_keyColor * point * 1.15;
          color += mix(vec3(1.0), u_keyColor, 0.4) * specular * 0.28;
          color += u_fillColor * rim * 0.16;
          color = pow(max(color, 0.0), vec3(0.92));
          gl_FragColor = vec4(color, u_opacity);
        }
      `;

      const compile = (type: number, source: string) => {
        const shader = gl.createShader(type);
        if (!shader) throw new Error("Shader creation failed");
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
          const message = gl.getShaderInfoLog(shader) || "Shader compilation failed";
          gl.deleteShader(shader);
          throw new Error(message);
        }
        return shader;
      };

      const vertex = compile(gl.VERTEX_SHADER, vertexSource);
      const fragment = compile(gl.FRAGMENT_SHADER, fragmentSource);
      const program = gl.createProgram();
      if (!program) throw new Error("Program creation failed");
      gl.attachShader(program, vertex);
      gl.attachShader(program, fragment);
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program) || "Program link failed");
      gl.useProgram(program);

      const aPosition = gl.getAttribLocation(program, "a_position");
      const aNormal = gl.getAttribLocation(program, "a_normal");
      const uniforms = {
        viewProjection: gl.getUniformLocation(program, "u_viewProjection"),
        translation: gl.getUniformLocation(program, "u_translation"),
        rotation: gl.getUniformLocation(program, "u_rotation"),
        scale: gl.getUniformLocation(program, "u_scale"),
        color: gl.getUniformLocation(program, "u_color"),
        camera: gl.getUniformLocation(program, "u_camera"),
        keyColor: gl.getUniformLocation(program, "u_keyColor"),
        fillColor: gl.getUniformLocation(program, "u_fillColor"),
        pointPosition: gl.getUniformLocation(program, "u_pointPosition"),
        opacity: gl.getUniformLocation(program, "u_opacity"),
        shininess: gl.getUniformLocation(program, "u_shininess"),
      };

      if (aPosition < 0 || aNormal < 0 || Object.values(uniforms).some((value) => value === null)) {
        throw new Error("Required WebGL attribute/uniform unavailable");
      }

      const meshes: Record<Part["mesh"], Mesh> = {
        sphere: createMesh(gl, sphereGeometry()),
        cylinder: createMesh(gl, cylinderGeometry()),
        torus: createMesh(gl, torusGeometry()),
      };

      gl.enable(gl.DEPTH_TEST);
      gl.enable(gl.CULL_FACE);
      gl.cullFace(gl.BACK);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

      const onPointerMove = (event: PointerEvent) => {
        const rect = canvas.getBoundingClientRect();
        targetPointerRef.current.x = clamp(((event.clientX - rect.left) / Math.max(rect.width, 1)) * 2 - 1, -1, 1);
        targetPointerRef.current.y = clamp(((event.clientY - rect.top) / Math.max(rect.height, 1)) * 2 - 1, -1, 1);
      };
      const onPointerLeave = () => {
        targetPointerRef.current.x = 0;
        targetPointerRef.current.y = 0;
      };
      canvas.addEventListener("pointermove", onPointerMove, { passive: true });
      canvas.addEventListener("pointerleave", onPointerLeave);

      const resize = () => {
        const rect = canvas.getBoundingClientRect();
        const dpr = Math.min(window.devicePixelRatio || 1, 1.65);
        const width = Math.max(1, Math.round(rect.width * dpr));
        const height = Math.max(1, Math.round(rect.height * dpr));
        if (canvas.width !== width || canvas.height !== height) {
          canvas.width = width;
          canvas.height = height;
          gl.viewport(0, 0, width, height);
        }
      };
      resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(canvas);
      resize();

      const drawMesh = (
        mesh: Mesh,
        translation: Vec3,
        rotation: Vec3,
        scale: Vec3,
        color: Vec3,
        opacity: number,
        shininess: number,
      ) => {
        gl.bindBuffer(gl.ARRAY_BUFFER, mesh.position);
        gl.enableVertexAttribArray(aPosition);
        gl.vertexAttribPointer(aPosition, 3, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, mesh.normal);
        gl.enableVertexAttribArray(aNormal);
        gl.vertexAttribPointer(aNormal, 3, gl.FLOAT, false, 0, 0);
        gl.uniform3fv(uniforms.translation, translation);
        gl.uniform3fv(uniforms.rotation, rotation);
        gl.uniform3fv(uniforms.scale, scale);
        gl.uniform3fv(uniforms.color, color);
        gl.uniform1f(uniforms.opacity, opacity);
        gl.uniform1f(uniforms.shininess, shininess);
        gl.drawArrays(gl.TRIANGLES, 0, mesh.count);
      };

      const startedAt = performance.now();
      const render = (now: number) => {
        if (disposed || gl.isContextLost()) return;
        resize();
        const time = (now - startedAt) / 1000;
        const p = reducedMotion ? 0.72 : progressRef.current;
        const assemble = reducedMotion ? 1 : smoothstep(0.08, 0.58, p);
        const heroTurn = reducedMotion ? 0.08 : smoothstep(0.58, 0.95, p) * 0.34;
        const rise = reducedMotion ? 0 : smoothstep(0.64, 1, p) * 0.18;

        pointerRef.current.x = lerp(pointerRef.current.x, targetPointerRef.current.x, 0.055);
        pointerRef.current.y = lerp(pointerRef.current.y, targetPointerRef.current.y, 0.055);

        const orbitX = reducedMotion ? 0 : pointerRef.current.x * 0.34;
        const orbitY = reducedMotion ? 0 : pointerRef.current.y * 0.22;
        const distance = 8.9 - smoothstep(0.52, 0.95, p) * 0.72;
        const camera: Vec3 = [Math.sin(orbitX) * distance, 4.75 - orbitY * 2.3, Math.cos(orbitX) * distance];
        const center: Vec3 = [0, 0.44 + rise, 0];
        const projection = perspective(Math.PI / 4.25, canvas.width / Math.max(canvas.height, 1), 0.1, 40);
        const view = lookAt(camera, center, [0, 1, 0]);
        const viewProjection = multiplyMat4(projection, view);

        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.useProgram(program);
        gl.uniformMatrix4fv(uniforms.viewProjection, false, viewProjection);
        gl.uniform3fv(uniforms.camera, camera);

        if (variant === "tera") {
          gl.uniform3fv(uniforms.keyColor, [1.0, 0.90, 0.72]);
          gl.uniform3fv(uniforms.fillColor, [0.45, 0.57, 0.43]);
          gl.uniform3fv(uniforms.pointPosition, [-3.0, 5.4, 4.5]);
        } else {
          gl.uniform3fv(uniforms.keyColor, [1.0, 0.55, 0.20]);
          gl.uniform3fv(uniforms.fillColor, [0.40, 0.20, 0.08]);
          gl.uniform3fv(uniforms.pointPosition, [-3.4, 4.8, 4.0]);
        }

        const plateColor: Vec3 = variant === "tera" ? [0.62, 0.61, 0.55] : [0.07, 0.055, 0.043];
        drawMesh(meshes.cylinder, [0, -0.64, 0], [0, heroTurn * 0.2, 0], [3.0, 0.12, 3.0], plateColor, variant === "tera" ? 0.42 : 0.72, 0.18);

        parts.forEach((part, index) => {
          const localProgress = reducedMotion ? 1 : smoothstep(0.10 + Math.min(index, 18) * 0.005, 0.63 + Math.min(index, 18) * 0.004, p);
          const t = Math.min(assemble, localProgress);
          const floatAmount = t < 0.98 && !reducedMotion ? Math.sin(time * 0.7 + (part.phase || 0)) * 0.045 * (1 - t) : 0;
          let position: Vec3 = [
            lerp(part.exploded[0], part.home[0], t),
            lerp(part.exploded[1], part.home[1], t) + floatAmount + rise,
            lerp(part.exploded[2], part.home[2], t),
          ];
          position = rotateAroundY(position, heroTurn);
          const rotation: Vec3 = [
            part.rotation[0],
            part.rotation[1] + heroTurn,
            part.rotation[2] + (!reducedMotion && t < 0.9 ? Math.sin(time * 0.35 + index) * 0.015 : 0),
          ];
          drawMesh(meshes[part.mesh], position, rotation, part.scale, part.color, part.opacity ?? 1, part.mesh === "sphere" ? 0.68 : 0.30);
        });

        raf = requestAnimationFrame(render);
      };
      raf = requestAnimationFrame(render);

      return () => {
        disposed = true;
        cancelAnimationFrame(raf);
        resizeObserver?.disconnect();
        canvas.removeEventListener("pointermove", onPointerMove);
        canvas.removeEventListener("pointerleave", onPointerLeave);
        Object.values(meshes).forEach((mesh) => {
          gl.deleteBuffer(mesh.position);
          gl.deleteBuffer(mesh.normal);
        });
        gl.deleteProgram(program);
        gl.deleteShader(vertex);
        gl.deleteShader(fragment);
      };
    } catch (error) {
      console.error("TIMILIA true 3D scene disabled:", error);
      setFailed(true);
      return () => {
        disposed = true;
        cancelAnimationFrame(raf);
        resizeObserver?.disconnect();
      };
    }
  }, [parts, reducedMotion, variant]);

  if (failed) {
    return (
      <div className="flex h-full w-full items-center justify-center rounded-[2rem] border border-white/10 bg-black/20 px-8 text-center text-xs uppercase tracking-[0.22em] text-white/45">
        Il browser non ha inizializzato WebGL · contenuto testuale disponibile
      </div>
    );
  }

  return <canvas ref={canvasRef} className="h-full w-full touch-none" aria-label={`Scena 3D interattiva ${variant === "tera" ? "TERA" : "A Bufalina"}`} />;
}

export default function TruePizza3DShowcase({
  variant,
  eyebrow,
  title,
  lead,
  body,
  closing,
  notes,
}: TruePizza3DShowcaseProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);
  const reduceMotion = useReducedMotion();
  const tera = variant === "tera";

  useEffect(() => {
    if (reduceMotion) {
      setProgress(0.75);
      return;
    }
    let raf = 0;
    const update = () => {
      const section = sectionRef.current;
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const travel = Math.max(rect.height - window.innerHeight, 1);
      setProgress(clamp(-rect.top / travel));
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [reduceMotion]);

  const assembled = smoothstep(0.08, 0.58, progress);

  return (
    <section
      ref={sectionRef}
      className={`relative h-[190svh] ${tera ? "bg-[#e9e4d9] text-[#252a24]" : "bg-[#050403] text-white"}`}
    >
      <div className="sticky top-0 flex min-h-[100svh] items-center overflow-hidden">
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-0 ${
            tera
              ? "bg-[radial-gradient(circle_at_72%_42%,rgba(83,105,80,0.18),transparent_28%),radial-gradient(circle_at_15%_20%,rgba(188,159,112,0.22),transparent_34%),linear-gradient(135deg,#f3eee4,#ded8ca)]"
              : "bg-[radial-gradient(circle_at_72%_42%,rgba(190,91,25,0.22),transparent_27%),radial-gradient(circle_at_8%_16%,rgba(116,62,27,0.16),transparent_31%),linear-gradient(135deg,#050403,#100a06)]"
          }`}
        />
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-0 opacity-[0.12] [background-image:radial-gradient(currentColor_0.55px,transparent_0.75px)] [background-size:17px_17px] ${tera ? "text-[#465745]" : "text-[#e9b267]"}`}
        />

        <div className="relative z-10 mx-auto grid min-h-[100svh] w-full max-w-[1600px] grid-rows-[auto_1fr] px-6 pb-10 pt-24 md:px-10 lg:grid-cols-[0.78fr_1.22fr] lg:grid-rows-1 lg:items-center lg:gap-8 lg:px-14 xl:px-20">
          <div className="relative z-20 max-w-[36rem] pt-4 lg:pt-0">
            <div className="flex items-center gap-3">
              <span className={`h-px w-10 ${tera ? "bg-[#5a6957]/70" : "bg-[#d3a15c]/80"}`} />
              <span className={`text-[10px] font-semibold uppercase tracking-[0.34em] md:text-xs ${tera ? "text-[#5a6957]" : "text-[#d3a15c]"}`}>
                {eyebrow}
              </span>
            </div>

            <motion.h2
              initial={{ opacity: 0, y: reduceMotion ? 0 : 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.55 }}
              transition={{ duration: reduceMotion ? 0 : 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="mt-6 text-[clamp(3.6rem,7vw,8.4rem)] font-light leading-[0.82] tracking-[-0.055em]"
            >
              {title}
            </motion.h2>

            <p className={`mt-7 text-xl font-light leading-[1.45] md:text-2xl ${tera ? "text-[#252a24]/78" : "text-white/78"}`}>
              {lead}
            </p>
            <p className={`mt-5 max-w-xl text-sm font-light leading-[1.85] md:text-base ${tera ? "text-[#252a24]/56" : "text-white/48"}`}>
              {body}
            </p>

            <div className="mt-8 hidden gap-x-6 gap-y-4 sm:grid sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              {notes.map((note, index) => (
                <div key={note.label} className={`border-t pt-3 ${tera ? "border-[#5a6957]/18" : "border-white/10"}`}>
                  <div className="flex items-baseline gap-3">
                    <span className={`text-[9px] font-medium tracking-[0.20em] ${tera ? "text-[#5a6957]" : "text-[#d3a15c]"}`}>
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="text-[10px] font-medium uppercase tracking-[0.13em]">{note.label}</span>
                  </div>
                  <p className={`mt-1 pl-8 text-xs font-light leading-relaxed ${tera ? "text-[#252a24]/46" : "text-white/38"}`}>{note.detail}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative -mx-6 min-h-[52svh] sm:min-h-[58svh] md:-mx-10 lg:-mx-0 lg:min-h-[82svh]">
            <div className="absolute inset-0">
              <PizzaWebGL variant={variant} progress={progress} reducedMotion={Boolean(reduceMotion)} />
            </div>

            <div className="pointer-events-none absolute inset-0 hidden lg:block">
              {notes.slice(0, 5).map((note, index) => {
                const right = index % 2 === 0;
                const top = [17, 33, 49, 65, 79][index] ?? 50;
                return (
                  <motion.div
                    key={note.label}
                    animate={{ opacity: assembled > 0.58 ? 0.72 : 0, x: assembled > 0.58 ? 0 : right ? 14 : -14 }}
                    transition={{ duration: 0.45, delay: index * 0.035 }}
                    className={`absolute ${right ? "right-[2%]" : "left-[2%]"}`}
                    style={{ top: `${top}%` }}
                  >
                    <div className={`flex items-center gap-3 ${right ? "flex-row" : "flex-row-reverse"}`}>
                      <span className={`h-px w-14 ${tera ? "bg-[#5a6957]/45" : "bg-[#d3a15c]/45"}`} />
                      <span className={`max-w-[9rem] text-[9px] font-medium uppercase tracking-[0.18em] ${tera ? "text-[#252a24]/62" : "text-white/62"}`}>
                        {note.label}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 items-center gap-4">
          <span className={`text-[9px] font-medium uppercase tracking-[0.24em] ${tera ? "text-[#252a24]/45" : "text-white/40"}`}>
            {progress < 0.55 ? "Scorri · la materia si compone" : "Muovi il mouse · cambia prospettiva"}
          </span>
          <div className={`h-px w-20 overflow-hidden ${tera ? "bg-[#5a6957]/16" : "bg-white/10"}`}>
            <div className={`h-full origin-left ${tera ? "bg-[#5a6957]" : "bg-[#d3a15c]"}`} style={{ transform: `scaleX(${progress})` }} />
          </div>
        </div>

        <motion.div
          aria-hidden="true"
          animate={{ opacity: assembled > 0.9 ? 0.5 : 0 }}
          className={`pointer-events-none absolute bottom-[7%] left-[7%] hidden max-w-sm font-serif text-xl italic leading-relaxed lg:block xl:text-2xl ${tera ? "text-[#465745]" : "text-[#d3a15c]"}`}
        >
          {closing}
        </motion.div>
      </div>
    </section>
  );
}

export { BUFALINA_NOTES };

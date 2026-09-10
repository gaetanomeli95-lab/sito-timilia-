"use client";

import Image from "next/image";
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

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const smoothstep = (edge0: number, edge1: number, value: number) => {
  const t = clamp((value - edge0) / Math.max(edge1 - edge0, 0.00001));
  return t * t * (3 - 2 * t);
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

function buildGrid(segments = 72) {
  const positions: number[] = [];
  const uvs: number[] = [];
  const push = (x: number, y: number, u: number, v: number) => {
    positions.push(x, y);
    uvs.push(u, v);
  };

  for (let y = 0; y < segments; y += 1) {
    for (let x = 0; x < segments; x += 1) {
      const u0 = x / segments;
      const u1 = (x + 1) / segments;
      const v0 = y / segments;
      const v1 = (y + 1) / segments;
      const x0 = u0 * 2 - 1;
      const x1 = u1 * 2 - 1;
      const y0 = v0 * 2 - 1;
      const y1 = v1 * 2 - 1;

      push(x0, y0, u0, v0);
      push(x1, y0, u1, v0);
      push(x1, y1, u1, v1);
      push(x0, y0, u0, v0);
      push(x1, y1, u1, v1);
      push(x0, y1, u0, v1);
    }
  }

  return { positions: new Float32Array(positions), uvs: new Float32Array(uvs) };
}

function compileShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) throw new Error("Shader non disponibile");
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const info = gl.getShaderInfoLog(shader) || "Errore shader";
    gl.deleteShader(shader);
    throw new Error(info);
  }
  return shader;
}

const VERTEX_SHADER = `
precision highp float;
attribute vec2 a_position;
attribute vec2 a_uv;
uniform mat4 u_viewProjection;
uniform vec3 u_rotation;
uniform vec3 u_offset;
uniform float u_imageAspect;
uniform float u_relief;
uniform float u_layerRelief;
uniform float u_scale;
varying vec2 v_uv;
varying float v_relief;

vec3 rotateX(vec3 p, float a) {
  float c = cos(a); float s = sin(a);
  return vec3(p.x, p.y * c - p.z * s, p.y * s + p.z * c);
}
vec3 rotateY(vec3 p, float a) {
  float c = cos(a); float s = sin(a);
  return vec3(p.x * c + p.z * s, p.y, -p.x * s + p.z * c);
}
vec3 rotateZ(vec3 p, float a) {
  float c = cos(a); float s = sin(a);
  return vec3(p.x * c - p.y * s, p.x * s + p.y * c, p.z);
}

void main() {
  v_uv = a_uv;
  vec2 q = a_uv - 0.5;
  q.x *= u_imageAspect;
  float r = length(q) / 0.50;
  float rim = smoothstep(0.72, 0.86, r) * (1.0 - smoothstep(0.98, 1.05, r));
  float center = 1.0 - smoothstep(0.08, 0.92, r);
  float organic = sin(a_uv.x * 31.0) * sin(a_uv.y * 27.0) * 0.018;
  float height = rim * 0.30 + center * 0.045 + organic;
  v_relief = height;

  vec3 p = vec3(
    a_position.x * u_imageAspect * 1.58,
    a_position.y * 1.58,
    height * u_relief + u_layerRelief
  );
  p.xy *= u_scale;
  p = rotateX(p, u_rotation.x);
  p = rotateY(p, u_rotation.y);
  p = rotateZ(p, u_rotation.z);
  p += u_offset;
  gl_Position = u_viewProjection * vec4(p, 1.0);
}
`;

const FRAGMENT_SHADER = `
precision highp float;
uniform sampler2D u_texture;
uniform float u_imageAspect;
uniform vec2 u_center;
uniform float u_radius;
uniform float u_layer;
uniform float u_explode;
uniform float u_opacity;
uniform float u_tera;
varying vec2 v_uv;
varying float v_relief;

float sat(vec3 c) {
  return max(c.r, max(c.g, c.b)) - min(c.r, min(c.g, c.b));
}

void main() {
  vec4 tex = texture2D(u_texture, v_uv);
  vec3 c = tex.rgb;
  vec2 q = v_uv - u_center;
  q.x *= u_imageAspect;
  float r = length(q) / u_radius;
  float disc = 1.0 - smoothstep(0.985, 1.035, r);
  float inner = 1.0 - smoothstep(0.72, 0.94, r);
  float ring = smoothstep(0.70, 0.83, r) * (1.0 - smoothstep(0.97, 1.03, r));

  float luminance = dot(c, vec3(0.299, 0.587, 0.114));
  float chroma = sat(c);
  float red = smoothstep(0.035, 0.19, c.r - max(c.g * 0.94, c.b)) * inner;
  float green = smoothstep(0.025, 0.15, c.g - max(c.r * 0.92, c.b * 0.92)) * inner;
  float cream = smoothstep(0.50, 0.78, luminance) * (1.0 - smoothstep(0.20, 0.48, chroma)) * inner;
  float crust = ring * smoothstep(0.16, 0.62, luminance + c.r * 0.22);

  if (u_tera > 0.5) {
    red *= 0.82;
    green *= 0.88;
    cream = max(cream, smoothstep(0.43, 0.70, luminance) * (1.0 - smoothstep(0.24, 0.54, chroma)) * inner * 0.72);
  }

  float chosen = max(max(crust, cream), max(red, green));
  float alpha = 0.0;

  if (u_layer < 0.5) {
    alpha = tex.a * disc * (1.0 - chosen * u_explode * 0.94);
  } else if (u_layer < 1.5) {
    alpha = tex.a * disc * crust * smoothstep(0.02, 0.16, u_explode);
  } else if (u_layer < 2.5) {
    alpha = tex.a * disc * cream * smoothstep(0.05, 0.22, u_explode);
  } else if (u_layer < 3.5) {
    alpha = tex.a * disc * red * smoothstep(0.08, 0.28, u_explode);
  } else {
    alpha = tex.a * disc * green * smoothstep(0.12, 0.34, u_explode);
  }

  if (alpha < 0.015) discard;

  float dimensional = 0.94 + clamp(v_relief * 0.9, 0.0, 0.09);
  vec3 finalColor = c * dimensional;
  if (u_tera > 0.5) finalColor = mix(finalColor, finalColor * vec3(0.98, 1.01, 0.96), 0.16);
  gl_FragColor = vec4(finalColor, alpha * u_opacity);
}
`;

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
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const progressRef = useRef(0);
  const pointerRef = useRef({ x: 0, y: 0 });
  const [webglReady, setWebglReady] = useState(false);
  const [webglFailed, setWebglFailed] = useState(false);
  const reducedMotion = useReducedMotion();
  const isTera = variant === "tera";
  const image = isTera ? "/images/tera-creazioni/creazione-14.png" : "/images/menu-story/bufalina.png";
  const imageAlt = isTera ? "Creazione TERA senza glutine di Timilia" : "A Bufalina di Timilia";
  const palette = useMemo(
    () => isTera
      ? { bg: "#e8e5dc", text: "#20251f", accent: "#65705f", line: "rgba(71,83,69,.20)" }
      : { bg: "#050403", text: "#fff8ec", accent: "#d8a15c", line: "rgba(216,161,92,.20)" },
    [isTera],
  );

  useEffect(() => {
    const update = () => {
      const section = sectionRef.current;
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const travel = Math.max(section.offsetHeight - window.innerHeight, 1);
      progressRef.current = clamp(-rect.top / travel);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || reducedMotion) return;

    let disposed = false;
    let frame = 0;
    let visible = true;

    try {
      const gl = canvas.getContext("webgl", {
        alpha: true,
        antialias: true,
        premultipliedAlpha: true,
      });
      if (!gl) {
        setWebglFailed(true);
        return;
      }

      const vertexShader = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
      const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
      const program = gl.createProgram();
      if (!program) throw new Error("Programma WebGL non disponibile");
      gl.attachShader(program, vertexShader);
      gl.attachShader(program, fragmentShader);
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        throw new Error(gl.getProgramInfoLog(program) || "Link WebGL fallito");
      }
      gl.useProgram(program);

      const grid = buildGrid(68);
      const positionBuffer = gl.createBuffer();
      const uvBuffer = gl.createBuffer();
      if (!positionBuffer || !uvBuffer) throw new Error("Buffer WebGL non disponibile");

      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, grid.positions, gl.STATIC_DRAW);
      const positionLocation = gl.getAttribLocation(program, "a_position");
      gl.enableVertexAttribArray(positionLocation);
      gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

      gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, grid.uvs, gl.STATIC_DRAW);
      const uvLocation = gl.getAttribLocation(program, "a_uv");
      gl.enableVertexAttribArray(uvLocation);
      gl.vertexAttribPointer(uvLocation, 2, gl.FLOAT, false, 0, 0);

      const getUniform = (name: string) => {
        const location = gl.getUniformLocation(program, name);
        if (!location) throw new Error(`Uniform ${name} non disponibile`);
        return location;
      };

      const uniforms = {
        viewProjection: getUniform("u_viewProjection"),
        rotation: getUniform("u_rotation"),
        offset: getUniform("u_offset"),
        imageAspect: getUniform("u_imageAspect"),
        relief: getUniform("u_relief"),
        layerRelief: getUniform("u_layerRelief"),
        scale: getUniform("u_scale"),
        texture: getUniform("u_texture"),
        center: getUniform("u_center"),
        radius: getUniform("u_radius"),
        layer: getUniform("u_layer"),
        explode: getUniform("u_explode"),
        opacity: getUniform("u_opacity"),
        tera: getUniform("u_tera"),
      };

      const texture = gl.createTexture();
      if (!texture) throw new Error("Texture WebGL non disponibile");
      const source = new window.Image();
      source.decoding = "async";
      source.src = image;

      source.onload = () => {
        if (disposed) return;
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
        setWebglReady(true);

        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);

        const resize = () => {
          const rect = canvas.getBoundingClientRect();
          const dpr = Math.min(window.devicePixelRatio || 1, 1.65);
          const width = Math.max(1, Math.round(rect.width * dpr));
          const height = Math.max(1, Math.round(rect.height * dpr));
          if (canvas.width !== width || canvas.height !== height) {
            canvas.width = width;
            canvas.height = height;
          }
          gl.viewport(0, 0, width, height);
        };

        const render = () => {
          if (disposed) return;
          if (!visible) {
            frame = requestAnimationFrame(render);
            return;
          }

          resize();
          const p = reducedMotion ? 0 : progressRef.current;
          const tilt = smoothstep(0.05, 0.46, p);
          const explode = smoothstep(0.18, 0.80, p);
          const px = pointerRef.current.x;
          const py = pointerRef.current.y;
          const canvasAspect = canvas.width / Math.max(canvas.height, 1);
          const imageAspect = source.naturalWidth / Math.max(source.naturalHeight, 1);

          const projection = perspective((36 * Math.PI) / 180, canvasAspect, 0.1, 30);
          const eye: Vec3 = [px * 0.42, -py * 0.26 + 0.06, 7.0 - tilt * 0.36];
          const view = lookAt(eye, [0, 0.02, 0], [0, 1, 0]);
          const viewProjection = multiplyMat4(projection, view);

          gl.clearColor(0, 0, 0, 0);
          gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
          gl.useProgram(program);
          gl.activeTexture(gl.TEXTURE0);
          gl.bindTexture(gl.TEXTURE_2D, texture);
          gl.uniform1i(uniforms.texture, 0);
          gl.uniformMatrix4fv(uniforms.viewProjection, false, viewProjection);
          gl.uniform1f(uniforms.imageAspect, imageAspect);
          gl.uniform2f(uniforms.center, isTera ? 0.50 : 0.50, isTera ? 0.52 : 0.50);
          gl.uniform1f(uniforms.radius, isTera ? 0.485 : 0.49);
          gl.uniform1f(uniforms.explode, explode);
          gl.uniform1f(uniforms.tera, isTera ? 1 : 0);
          gl.uniform1f(uniforms.relief, 0.18 + tilt * 0.95);
          gl.uniform3f(
            uniforms.rotation,
            -0.03 - tilt * 0.48 - py * 0.035,
            px * 0.09 + (isTera ? -0.02 : 0.03) * tilt,
            px * 0.018,
          );

          const layers = [
            { id: 0, offset: [0, 0, 0] as Vec3, relief: 0, scale: 1, opacity: 1 },
            { id: 1, offset: [0, -0.12 * explode, 0.28 * explode] as Vec3, relief: 0.04 * explode, scale: 1.005, opacity: 1 },
            { id: 2, offset: [-0.10 * explode, 0.16 * explode, 0.82 * explode] as Vec3, relief: 0.08 * explode, scale: 1.008, opacity: 1 },
            { id: 3, offset: [0.12 * explode, 0.38 * explode, 1.38 * explode] as Vec3, relief: 0.12 * explode, scale: 1.012, opacity: 1 },
            { id: 4, offset: [-0.05 * explode, 0.66 * explode, 1.94 * explode] as Vec3, relief: 0.16 * explode, scale: 1.018, opacity: 1 },
          ];

          layers.forEach((layer) => {
            gl.uniform1f(uniforms.layer, layer.id);
            gl.uniform3f(uniforms.offset, layer.offset[0], layer.offset[1], layer.offset[2]);
            gl.uniform1f(uniforms.layerRelief, layer.relief);
            gl.uniform1f(uniforms.scale, layer.scale);
            gl.uniform1f(uniforms.opacity, layer.opacity);
            gl.drawArrays(gl.TRIANGLES, 0, grid.positions.length / 2);
          });

          frame = requestAnimationFrame(render);
        };

        render();
      };

      source.onerror = () => setWebglFailed(true);

      const observer = new IntersectionObserver(
        ([entry]) => {
          visible = entry?.isIntersecting ?? true;
        },
        { rootMargin: "300px 0px" },
      );
      observer.observe(canvas);

      return () => {
        disposed = true;
        observer.disconnect();
        cancelAnimationFrame(frame);
        gl.deleteTexture(texture);
        gl.deleteBuffer(positionBuffer);
        gl.deleteBuffer(uvBuffer);
        gl.deleteProgram(program);
        gl.deleteShader(vertexShader);
        gl.deleteShader(fragmentShader);
      };
    } catch {
      setWebglFailed(true);
    }
  }, [image, isTera, reducedMotion]);

  return (
    <section
      ref={sectionRef}
      className="relative h-[220svh]"
      style={{ backgroundColor: palette.bg, color: palette.text }}
      onPointerMove={(event) => {
        if (reducedMotion) return;
        const rect = event.currentTarget.getBoundingClientRect();
        pointerRef.current = {
          x: clamp(((event.clientX - rect.left) / Math.max(rect.width, 1)) * 2 - 1, -1, 1),
          y: clamp(((event.clientY - rect.top) / Math.max(window.innerHeight, 1)) * 2 - 1, -1, 1),
        };
      }}
      onPointerLeave={() => {
        pointerRef.current = { x: 0, y: 0 };
      }}
    >
      <div className="sticky top-0 min-h-[100svh] overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <Image src={image} alt="" fill sizes="100vw" className={`object-cover scale-110 blur-3xl ${isTera ? "opacity-[0.08]" : "opacity-[0.10]"}`} />
          <div className={`absolute inset-0 ${isTera ? "bg-[radial-gradient(circle_at_72%_48%,rgba(112,126,105,0.16),transparent_34%)]" : "bg-[radial-gradient(circle_at_72%_48%,rgba(214,145,65,0.18),transparent_34%)]"}`} />
          <div className={`absolute inset-0 ${isTera ? "bg-gradient-to-r from-[#e8e5dc] via-[#e8e5dc]/84 to-[#e8e5dc]/16" : "bg-gradient-to-r from-[#050403] via-[#050403]/82 to-transparent"}`} />
        </div>

        <div className="relative z-10 mx-auto grid min-h-[100svh] max-w-[1500px] items-center gap-10 px-6 py-24 md:px-10 lg:grid-cols-[0.78fr_1.22fr] lg:px-14 xl:px-20">
          <div className="relative z-30 max-w-xl">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              className="flex items-center gap-3"
            >
              <span className="h-px w-10" style={{ backgroundColor: palette.accent }} />
              <span className="text-[10px] font-medium uppercase tracking-[0.35em] md:text-xs" style={{ color: palette.accent }}>
                {eyebrow}
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.45 }}
              transition={{ delay: 0.08 }}
              className="mt-7 text-[clamp(3.2rem,7vw,7.8rem)] font-light leading-[0.86] tracking-[-0.055em]"
            >
              {title}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.16 }}
              className="mt-7 max-w-md font-serif text-xl italic leading-relaxed md:text-2xl"
              style={{ color: palette.accent }}
            >
              {lead}
            </motion.p>

            <p className={`mt-6 max-w-lg text-sm font-light leading-[1.9] md:text-base ${isTera ? "text-[#20251f]/62" : "text-white/56"}`}>
              {body}
            </p>

            <div className="mt-9 grid grid-cols-2 gap-x-6 gap-y-5">
              {notes.slice(0, 5).map((note, index) => (
                <motion.div
                  key={note.label}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.6 }}
                  transition={{ delay: 0.18 + index * 0.06 }}
                  className="border-t pt-3"
                  style={{ borderColor: palette.line }}
                >
                  <span className="text-[9px] uppercase tracking-[0.22em]" style={{ color: palette.accent }}>
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <p className="mt-1 text-xs font-medium uppercase tracking-[0.08em]">{note.label}</p>
                </motion.div>
              ))}
            </div>

            <p className={`mt-9 max-w-md text-sm font-light italic leading-relaxed ${isTera ? "text-[#20251f]/54" : "text-white/46"}`}>
              {closing}
            </p>
          </div>

          <div className="relative min-h-[52svh] lg:min-h-[88svh]">
            <div className={`absolute left-1/2 top-[66%] h-[12%] w-[58%] -translate-x-1/2 rounded-[50%] blur-3xl ${isTera ? "bg-[#4c5a48]/15" : "bg-black/65"}`} />

            <Image
              src={image}
              alt={imageAlt}
              fill
              priority={false}
              sizes="(max-width: 1024px) 100vw, 62vw"
              className={`object-contain transition-opacity duration-700 ${webglReady && !reducedMotion ? "opacity-0" : "opacity-100"}`}
            />

            {!webglFailed && !reducedMotion && (
              <canvas
                ref={canvasRef}
                className={`absolute inset-0 h-full w-full transition-opacity duration-700 ${webglReady ? "opacity-100" : "opacity-0"}`}
                aria-label={`${title}: fotografia reale trasformata in rilievo tridimensionale interattivo`}
              />
            )}

            <div className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 text-center lg:bottom-10">
              <span className={`text-[9px] uppercase tracking-[0.32em] ${isTera ? "text-[#20251f]/38" : "text-white/35"}`}>
                scorri · muovi il mouse
              </span>
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute right-5 top-1/2 hidden -translate-y-1/2 flex-col gap-8 xl:flex">
          {notes.slice(0, 4).map((note, index) => (
            <motion.div
              key={`side-${note.label}`}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.35 + index * 0.1 }}
              className="flex items-center gap-3"
            >
              <span className="h-px w-12" style={{ backgroundColor: palette.line }} />
              <span className={`max-w-[10rem] text-[9px] uppercase tracking-[0.18em] ${isTera ? "text-[#20251f]/52" : "text-white/48"}`}>
                {note.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

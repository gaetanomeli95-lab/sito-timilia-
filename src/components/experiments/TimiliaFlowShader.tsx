"use client";

import { useEffect, useRef } from "react";

/**
 * Lightweight WebGL field inspired by the warm shadow / flow language explored
 * in GetLayers. It is intentionally custom code: no copied premium layer code,
 * no Three.js dependency, and it pauses when outside the viewport.
 */
export default function TimiliaFlowShader({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", {
      alpha: true,
      antialias: false,
      depth: false,
      powerPreference: "low-power",
    });
    if (!gl) return;

    const vertexSource = `
      attribute vec2 a_position;
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    const fragmentSource = `
      precision mediump float;
      uniform vec2 u_resolution;
      uniform vec2 u_mouse;
      uniform float u_time;

      float softCircle(vec2 p, vec2 center, float radius, float feather) {
        float d = distance(p, center);
        return 1.0 - smoothstep(radius, radius + feather, d);
      }

      void main() {
        vec2 uv = gl_FragCoord.xy / u_resolution.xy;
        vec2 p = uv - 0.5;
        p.x *= u_resolution.x / max(u_resolution.y, 1.0);

        float t = u_time * 0.14;
        float waveA = sin((p.x * 3.2) + (p.y * 4.8) + t * 3.0);
        float waveB = sin((p.x * -5.0) + (p.y * 2.2) - t * 2.2);
        float waveC = sin(length(p + vec2(0.35, -0.18)) * 9.0 - t * 2.0);
        float field = (waveA + waveB + waveC) / 3.0;
        field = smoothstep(-0.7, 0.85, field);

        vec2 mouse = u_mouse / u_resolution.xy;
        mouse.y = 1.0 - mouse.y;
        vec2 mouseP = mouse - 0.5;
        mouseP.x *= u_resolution.x / max(u_resolution.y, 1.0);

        float glow = softCircle(p, mouseP, 0.02, 0.55);
        float oven = softCircle(p, vec2(0.46, 0.02), 0.03, 0.75);
        float edge = 1.0 - smoothstep(0.18, 0.86, length(p));

        vec3 black = vec3(0.012, 0.011, 0.009);
        vec3 umber = vec3(0.19, 0.105, 0.045);
        vec3 amber = vec3(0.72, 0.405, 0.145);
        vec3 flour = vec3(0.93, 0.79, 0.57);

        vec3 color = mix(black, umber, field * 0.52);
        color = mix(color, amber, oven * (0.08 + field * 0.15));
        color = mix(color, flour, glow * 0.11);
        color *= 0.42 + edge * 0.58;

        float alpha = clamp(0.30 + field * 0.28 + oven * 0.16 + glow * 0.12, 0.0, 0.80);
        gl_FragColor = vec4(color, alpha);
      }
    `;

    const compile = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vertex = compile(gl.VERTEX_SHADER, vertexSource);
    const fragment = compile(gl.FRAGMENT_SHADER, fragmentSource);
    if (!vertex || !fragment) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);

    const positionLocation = gl.getAttribLocation(program, "a_position");
    const resolutionLocation = gl.getUniformLocation(program, "u_resolution");
    const mouseLocation = gl.getUniformLocation(program, "u_mouse");
    const timeLocation = gl.getUniformLocation(program, "u_time");

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW,
    );
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    let width = 1;
    let height = 1;
    let raf = 0;
    let visible = true;
    let mouseX = 0.72;
    let mouseY = 0.46;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const startedAt = performance.now();

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      width = Math.max(1, Math.round(rect.width * dpr));
      height = Math.max(1, Math.round(rect.height * dpr));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);
      }
    };

    const onPointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = (event.clientX - rect.left) / Math.max(rect.width, 1);
      mouseY = (event.clientY - rect.top) / Math.max(rect.height, 1);
    };

    const draw = (now: number) => {
      resize();
      gl.uniform2f(resolutionLocation, width, height);
      gl.uniform2f(mouseLocation, mouseX * width, mouseY * height);
      gl.uniform1f(timeLocation, reduceMotion ? 0 : (now - startedAt) / 1000);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      if (visible && !reduceMotion) raf = requestAnimationFrame(draw);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        const wasVisible = visible;
        visible = entry.isIntersecting;
        if (visible && !wasVisible && !reduceMotion) raf = requestAnimationFrame(draw);
      },
      { threshold: 0.02 },
    );

    observer.observe(canvas);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("resize", resize, { passive: true });
    resize();
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("resize", resize);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vertex);
      gl.deleteShader(fragment);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    />
  );
}

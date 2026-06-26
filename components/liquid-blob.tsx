"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";

/**
 * LiquidBlobBackground — real-time WebGL fluid simulation (Navier-Stokes style).
 *
 * Pipeline per frame (all on the GPU, ping-pong framebuffers):
 *   1. advect velocity      (semi-Lagrangian)
 *   2. inject cursor splats  (dye + velocity, scaled by cursor speed)
 *   3. compute curl + apply vorticity confinement (keeps swirls alive)
 *   4. compute divergence
 *   5. Jacobi pressure solve (a few iterations)
 *   6. subtract pressure gradient (make velocity divergence-free)
 *   7. advect dye + dissipate
 *   8. display dye to screen
 *
 * Cursor movement injects dye + velocity in real time: faster movement = larger,
 * brighter, more saturated trails; slow movement = gentle blending. Dye and
 * velocity dissipate over time so the screen never permanently fills.
 *
 * LIGHT mode: vibrant multi-color dye. DARK mode: the effect is disabled (the
 * canvas stays transparent) so dark mode remains strictly dark/neutral.
 *
 * Adapted from the standard GPU fluid technique (Stam / Crane / PavelDoGreat).
 * Self-contained: no external library, no CDN.
 */

// ---- shaders -------------------------------------------------------------

const BASE_VERT = `#version 300 es
precision highp float;
in vec2 position;
out vec2 vUv;
out vec2 vL;
out vec2 vR;
out vec2 vT;
out vec2 vB;
uniform vec2 texelSize;
void main() {
  vUv = position * 0.5 + 0.5;
  vL = vUv - vec2(texelSize.x, 0.0);
  vR = vUv + vec2(texelSize.x, 0.0);
  vT = vUv + vec2(0.0, texelSize.y);
  vB = vUv - vec2(0.0, texelSize.y);
  gl_Position = vec4(position, 0.0, 1.0);
}`;

const ADVECTION_FRAG = `#version 300 es
precision highp float;
precision highp sampler2D;
in vec2 vUv;
uniform sampler2D uVelocity;
uniform sampler2D uSource;
uniform vec2 texelSize;
uniform float dt;
uniform float dissipation;
out vec4 fragColor;
void main() {
  vec2 coord = vUv - dt * texture(uVelocity, vUv).xy * texelSize;
  vec4 result = texture(uSource, coord);
  float decay = 1.0 + dissipation * dt;
  fragColor = result / decay;
}`;

const DIVERGENCE_FRAG = `#version 300 es
precision highp float;
precision highp sampler2D;
in vec2 vUv;
in vec2 vL;
in vec2 vR;
in vec2 vT;
in vec2 vB;
uniform sampler2D uVelocity;
out vec4 fragColor;
void main() {
  float L = texture(uVelocity, vL).x;
  float R = texture(uVelocity, vR).x;
  float T = texture(uVelocity, vT).y;
  float B = texture(uVelocity, vB).y;
  vec2 C = texture(uVelocity, vUv).xy;
  if (vL.x < 0.0) { L = -C.x; }
  if (vR.x > 1.0) { R = -C.x; }
  if (vT.y > 1.0) { T = -C.y; }
  if (vB.y < 0.0) { B = -C.y; }
  float div = 0.5 * (R - L + T - B);
  fragColor = vec4(div, 0.0, 0.0, 1.0);
}`;

const CURL_FRAG = `#version 300 es
precision highp float;
precision highp sampler2D;
in vec2 vUv;
in vec2 vL;
in vec2 vR;
in vec2 vT;
in vec2 vB;
uniform sampler2D uVelocity;
out vec4 fragColor;
void main() {
  float L = texture(uVelocity, vL).y;
  float R = texture(uVelocity, vR).y;
  float T = texture(uVelocity, vT).x;
  float B = texture(uVelocity, vB).x;
  float curl = R - L - T + B;
  fragColor = vec4(0.5 * curl, 0.0, 0.0, 1.0);
}`;

const VORTICITY_FRAG = `#version 300 es
precision highp float;
precision highp sampler2D;
in vec2 vUv;
in vec2 vL;
in vec2 vR;
in vec2 vT;
in vec2 vB;
uniform sampler2D uVelocity;
uniform sampler2D uCurl;
uniform float curl;
uniform float dt;
out vec4 fragColor;
void main() {
  float L = texture(uCurl, vL).x;
  float R = texture(uCurl, vR).x;
  float T = texture(uCurl, vT).x;
  float B = texture(uCurl, vB).x;
  float C = texture(uCurl, vUv).x;
  vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
  force /= length(force) + 0.0001;
  force *= curl * C;
  force.y *= -1.0;
  vec2 vel = texture(uVelocity, vUv).xy;
  vel += force * dt;
  vel = clamp(vel, -1000.0, 1000.0);
  fragColor = vec4(vel, 0.0, 1.0);
}`;

const PRESSURE_FRAG = `#version 300 es
precision highp float;
precision highp sampler2D;
in vec2 vUv;
in vec2 vL;
in vec2 vR;
in vec2 vT;
in vec2 vB;
uniform sampler2D uPressure;
uniform sampler2D uDivergence;
out vec4 fragColor;
void main() {
  float L = texture(uPressure, vL).x;
  float R = texture(uPressure, vR).x;
  float T = texture(uPressure, vT).x;
  float B = texture(uPressure, vB).x;
  float divergence = texture(uDivergence, vUv).x;
  float pressure = (L + R + B + T - divergence) * 0.25;
  fragColor = vec4(pressure, 0.0, 0.0, 1.0);
}`;

const GRADIENT_SUBTRACT_FRAG = `#version 300 es
precision highp float;
precision highp sampler2D;
in vec2 vUv;
in vec2 vL;
in vec2 vR;
in vec2 vT;
in vec2 vB;
uniform sampler2D uPressure;
uniform sampler2D uVelocity;
out vec4 fragColor;
void main() {
  float L = texture(uPressure, vL).x;
  float R = texture(uPressure, vR).x;
  float T = texture(uPressure, vT).x;
  float B = texture(uPressure, vB).x;
  vec2 velocity = texture(uVelocity, vUv).xy;
  velocity.xy -= vec2(R - L, T - B);
  fragColor = vec4(velocity, 0.0, 1.0);
}`;

const SPLAT_FRAG = `#version 300 es
precision highp float;
precision highp sampler2D;
in vec2 vUv;
uniform sampler2D uTarget;
uniform float aspectRatio;
uniform vec3 color;
uniform vec2 point;
uniform float radius;
out vec4 fragColor;
void main() {
  vec2 p = vUv - point.xy;
  p.x *= aspectRatio;
  vec3 splat = exp(-dot(p, p) / radius) * color;
  vec3 base = texture(uTarget, vUv).xyz;
  fragColor = vec4(base + splat, 1.0);
}`;

const DISPLAY_FRAG = `#version 300 es
precision highp float;
precision highp sampler2D;
in vec2 vUv;
uniform sampler2D uTexture;
out vec4 fragColor;
void main() {
  vec3 c = texture(uTexture, vUv).rgb;
  // Premultiplied-ish alpha from dye luminance so the page background shows
  // through where there is no dye.
  float a = clamp(max(c.r, max(c.g, c.b)) * 1.2, 0.0, 1.0);
  fragColor = vec4(c, a);
}`;

// ---- helpers -------------------------------------------------------------

type GL = WebGL2RenderingContext;

function compileShader(gl: GL, type: number, src: string): WebGLShader | null {
  const sh = gl.createShader(type);
  if (!sh) return null;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    console.error("[liquid-fluid] shader compile failed:", gl.getShaderInfoLog(sh));
    return null;
  }
  return sh;
}

function createProgram(gl: GL, vsSrc: string, fsSrc: string): WebGLProgram | null {
  const vs = compileShader(gl, gl.VERTEX_SHADER, vsSrc);
  const fs = compileShader(gl, gl.FRAGMENT_SHADER, fsSrc);
  if (!vs || !fs) return null;
  const program = gl.createProgram()!;
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  gl.deleteShader(vs);
  gl.deleteShader(fs);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error("[liquid-fluid] link failed:", gl.getProgramInfoLog(program));
    return null;
  }
  return program;
}

type FBO = { texture: WebGLTexture; fbo: WebGLFramebuffer; width: number; height: number; texelX: number; texelY: number };
type DoubleFBO = { read: FBO; write: FBO; width: number; height: number; texelX: number; texelY: number; swap: () => void };

function createFBO(gl: GL, w: number, h: number, internal: number, format: number, type: number, filter: number): FBO {
  const texture = gl.createTexture()!;
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texImage2D(gl.TEXTURE_2D, 0, internal, w, h, 0, format, type, null);

  const fbo = gl.createFramebuffer()!;
  gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
  gl.viewport(0, 0, w, h);
  gl.clear(gl.COLOR_BUFFER_BIT);

  return { texture, fbo, width: w, height: h, texelX: 1 / w, texelY: 1 / h };
}

function createDoubleFBO(gl: GL, w: number, h: number, internal: number, format: number, type: number, filter: number): DoubleFBO {
  let r = createFBO(gl, w, h, internal, format, type, filter);
  let wr = createFBO(gl, w, h, internal, format, type, filter);
  return {
    width: w, height: h, texelX: 1 / w, texelY: 1 / h,
    get read() { return r; },
    get write() { return wr; },
    swap() { const t = r; r = wr; wr = t; },
  };
}

// Vibrant light-mode palette (HSV-ish hues kept lively but not neon).
function vibrantColor(seed: number): [number, number, number] {
  // cycle through a multi-hue range; magnitude kept modest, sim brightens fast splats
  const h = (seed * 0.13) % 1;
  // simple HSV->RGB with s=0.85, v=1
  const s = 0.85, v = 1;
  const i = Math.floor(h * 6);
  const f = h * 6 - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);
  let r = 0, g = 0, b = 0;
  switch (i % 6) {
    case 0: r = v; g = t; b = p; break;
    case 1: r = q; g = v; b = p; break;
    case 2: r = p; g = v; b = t; break;
    case 3: r = p; g = q; b = v; break;
    case 4: r = t; g = p; b = v; break;
    case 5: r = v; g = p; b = q; break;
  }
  return [r * 0.18, g * 0.18, b * 0.18];
}

export function LiquidBlobBackground({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [fallback, setFallback] = useState(false);

  useEffect(() => {
    // Dark mode: no fluid effect at all (keeps dark strictly dark/neutral).
    if (isDark) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setFallback(true);
      return;
    }

    const gl = canvas.getContext("webgl2", { alpha: true, premultipliedAlpha: false, antialias: false, depth: false, stencil: false });
    if (!gl) { setFallback(true); return; }

    const ext = gl.getExtension("EXT_color_buffer_float");
    const linearFloat = gl.getExtension("OES_texture_float_linear");
    if (!ext) { setFallback(true); return; }

    // float vs half-float fallback
    const texType = gl.HALF_FLOAT;
    const rgba = gl.RGBA16F, rg = gl.RG16F, r16 = gl.R16F;
    const filter = linearFloat ? gl.LINEAR : gl.NEAREST;

    // Programs
    const programs = {
      advection: createProgram(gl, BASE_VERT, ADVECTION_FRAG),
      divergence: createProgram(gl, BASE_VERT, DIVERGENCE_FRAG),
      curl: createProgram(gl, BASE_VERT, CURL_FRAG),
      vorticity: createProgram(gl, BASE_VERT, VORTICITY_FRAG),
      pressure: createProgram(gl, BASE_VERT, PRESSURE_FRAG),
      gradient: createProgram(gl, BASE_VERT, GRADIENT_SUBTRACT_FRAG),
      splat: createProgram(gl, BASE_VERT, SPLAT_FRAG),
      display: createProgram(gl, BASE_VERT, DISPLAY_FRAG),
    };
    if (Object.values(programs).some((p) => !p)) { setFallback(true); return; }

    // Fullscreen triangle/quad
    const quad = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 3, 3, -1]), gl.STATIC_DRAW);

    const bindQuad = (program: WebGLProgram) => {
      const loc = gl.getAttribLocation(program, "position");
      gl.bindBuffer(gl.ARRAY_BUFFER, quad);
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    };

    const uloc = (p: WebGLProgram, name: string) => gl.getUniformLocation(p, name);

    // Simulation resolution (low = cheap + smooth) and dye resolution (higher).
    const SIM = 128;
    const DYE = 512;

    let simW = SIM, simH = SIM, dyeW = DYE, dyeH = DYE;

    let velocity: DoubleFBO, dye: DoubleFBO;
    let divergence: FBO, curlFbo: FBO, pressure: DoubleFBO;

    const initFramebuffers = () => {
      const r = canvas.getBoundingClientRect();
      const ar = r.width / Math.max(1, r.height);
      simW = Math.round(SIM * (ar >= 1 ? ar : 1));
      simH = Math.round(SIM * (ar >= 1 ? 1 : 1 / ar));
      dyeW = Math.round(DYE * (ar >= 1 ? ar : 1));
      dyeH = Math.round(DYE * (ar >= 1 ? 1 : 1 / ar));
      velocity = createDoubleFBO(gl, simW, simH, rg, gl.RG, texType, filter);
      dye = createDoubleFBO(gl, dyeW, dyeH, rgba, gl.RGBA, texType, filter);
      divergence = createFBO(gl, simW, simH, r16, gl.RED, texType, gl.NEAREST);
      curlFbo = createFBO(gl, simW, simH, r16, gl.RED, texType, gl.NEAREST);
      pressure = createDoubleFBO(gl, simW, simH, r16, gl.RED, texType, gl.NEAREST);
    };
    initFramebuffers();

    const blit = (target: FBO | null) => {
      if (target) {
        gl.viewport(0, 0, target.width, target.height);
        gl.bindFramebuffer(gl.FRAMEBUFFER, target.fbo);
      } else {
        gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      }
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const resizeCanvas = () => {
      const r = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.max(1, Math.round(r.width * dpr));
      const h = Math.max(1, Math.round(r.height * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        initFramebuffers();
      }
    };
    const ro = new ResizeObserver(resizeCanvas);
    ro.observe(canvas);

    // Pointer tracking (normalized 0..1, GL origin bottom-left).
    const pointer = { x: 0.5, y: 0.5, dx: 0, dy: 0, moved: false, down: false };
    let colorSeed = Math.random() * 100;

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width;
      const ny = 1 - (e.clientY - r.top) / r.height;
      pointer.dx = (nx - pointer.x) * 5.0;
      pointer.dy = (ny - pointer.y) * 5.0;
      pointer.x = nx;
      pointer.y = ny;
      pointer.moved = true;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    // Splat: inject velocity + dye at the pointer, scaled by speed.
    const splat = (x: number, y: number, dx: number, dy: number, color: [number, number, number]) => {
      const aspect = canvas.width / canvas.height;
      // velocity
      const pv = programs.splat!;
      gl.useProgram(pv);
      bindQuad(pv);
      gl.uniform1i(uloc(pv, "uTarget"), 0);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, velocity.read.texture);
      gl.uniform1f(uloc(pv, "aspectRatio"), aspect);
      gl.uniform2f(uloc(pv, "point"), x, y);
      gl.uniform3f(uloc(pv, "color"), dx, dy, 0);
      gl.uniform1f(uloc(pv, "radius"), 0.00022);
      blit(velocity.write);
      velocity.swap();
      // dye
      gl.bindTexture(gl.TEXTURE_2D, dye.read.texture);
      gl.uniform3f(uloc(pv, "color"), color[0], color[1], color[2]);
      blit(dye.write);
      dye.swap();
    };

    let raf = 0;
    let lastT = performance.now();

    const step = (now: number) => {
      const dt = Math.min((now - lastT) / 1000, 0.0166);
      lastT = now;

      // Inject from pointer movement.
      if (pointer.moved) {
        pointer.moved = false;
        const speed = Math.hypot(pointer.dx, pointer.dy);
        // Faster movement => brighter, bigger trail.
        const boost = Math.min(1 + speed * 1.2, 7);
        colorSeed += 0.5 + speed * 2;
        const base = vibrantColor(colorSeed);
        const color: [number, number, number] = [base[0] * boost, base[1] * boost, base[2] * boost];
        splat(pointer.x, pointer.y, pointer.dx * 800, pointer.dy * 800, color);
      }

      // --- curl ---
      let p = programs.curl!;
      gl.useProgram(p);
      bindQuad(p);
      gl.uniform2f(uloc(p, "texelSize"), velocity.texelX, velocity.texelY);
      gl.uniform1i(uloc(p, "uVelocity"), 0);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, velocity.read.texture);
      blit(curlFbo);

      // --- vorticity ---
      p = programs.vorticity!;
      gl.useProgram(p);
      bindQuad(p);
      gl.uniform2f(uloc(p, "texelSize"), velocity.texelX, velocity.texelY);
      gl.uniform1i(uloc(p, "uVelocity"), 0);
      gl.uniform1i(uloc(p, "uCurl"), 1);
      gl.uniform1f(uloc(p, "curl"), 28);
      gl.uniform1f(uloc(p, "dt"), dt);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, velocity.read.texture);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, curlFbo.texture);
      blit(velocity.write);
      velocity.swap();

      // --- divergence ---
      p = programs.divergence!;
      gl.useProgram(p);
      bindQuad(p);
      gl.uniform2f(uloc(p, "texelSize"), velocity.texelX, velocity.texelY);
      gl.uniform1i(uloc(p, "uVelocity"), 0);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, velocity.read.texture);
      blit(divergence);

      // --- pressure solve (Jacobi) ---
      p = programs.pressure!;
      gl.useProgram(p);
      bindQuad(p);
      gl.uniform2f(uloc(p, "texelSize"), velocity.texelX, velocity.texelY);
      gl.uniform1i(uloc(p, "uDivergence"), 0);
      gl.uniform1i(uloc(p, "uPressure"), 1);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, divergence.texture);
      for (let i = 0; i < 18; i++) {
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, pressure.read.texture);
        blit(pressure.write);
        pressure.swap();
      }

      // --- gradient subtract ---
      p = programs.gradient!;
      gl.useProgram(p);
      bindQuad(p);
      gl.uniform2f(uloc(p, "texelSize"), velocity.texelX, velocity.texelY);
      gl.uniform1i(uloc(p, "uPressure"), 0);
      gl.uniform1i(uloc(p, "uVelocity"), 1);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, pressure.read.texture);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, velocity.read.texture);
      blit(velocity.write);
      velocity.swap();

      // --- advect velocity ---
      p = programs.advection!;
      gl.useProgram(p);
      bindQuad(p);
      gl.uniform2f(uloc(p, "texelSize"), velocity.texelX, velocity.texelY);
      gl.uniform1i(uloc(p, "uVelocity"), 0);
      gl.uniform1i(uloc(p, "uSource"), 0);
      gl.uniform1f(uloc(p, "dt"), dt);
      gl.uniform1f(uloc(p, "dissipation"), 0.2);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, velocity.read.texture);
      blit(velocity.write);
      velocity.swap();

      // --- advect dye (dissipates over time so screen never fills) ---
      gl.uniform2f(uloc(p, "texelSize"), velocity.texelX, velocity.texelY);
      gl.uniform1i(uloc(p, "uVelocity"), 0);
      gl.uniform1i(uloc(p, "uSource"), 1);
      gl.uniform1f(uloc(p, "dissipation"), 1.1);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, velocity.read.texture);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, dye.read.texture);
      blit(dye.write);
      dye.swap();

      // --- display ---
      p = programs.display!;
      gl.useProgram(p);
      bindQuad(p);
      gl.uniform1i(uloc(p, "uTexture"), 0);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, dye.read.texture);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      blit(null);
      gl.disable(gl.BLEND);

      raf = requestAnimationFrame(step);
    };

    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(raf);
        raf = 0;
      } else if (!raf) {
        lastT = performance.now();
        raf = requestAnimationFrame(step);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    raf = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("visibilitychange", onVisibility);
      ro.disconnect();
      Object.values(programs).forEach((pr) => pr && gl.deleteProgram(pr));
    };
    // Re-init when theme flips (dark disables the sim entirely).
  }, [isDark]);

  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden [mask-image:radial-gradient(85%_75%_at_50%_40%,#000,transparent)]",
        className
      )}
    >
      {isDark ? (
        // Dark mode: strictly neutral, no colorful trails. A faint dark texture only.
        <div className="absolute inset-0 grid-dots opacity-30 [mask-image:radial-gradient(70%_60%_at_50%_40%,#000,transparent)]" />
      ) : fallback ? (
        <>
          <div className="absolute inset-0 liquid-fallback" />
          <div className="absolute inset-0 grid-dots opacity-40 [mask-image:radial-gradient(70%_60%_at_50%_40%,#000,transparent)]" />
        </>
      ) : (
        <>
          <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
          <div className="absolute inset-0 grid-dots opacity-30 [mask-image:radial-gradient(70%_60%_at_50%_40%,#000,transparent)]" />
        </>
      )}
    </div>
  );
}

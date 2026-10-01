'use client';

import { useEffect, useRef } from 'react';

// ─── Constants ────────────────────────────────────────────────────────────────

const RENDER_SCALE = 0.6;   // render below CSS resolution; upscaling softens it into a glow
const FRAME_MS     = 1000 / 30;
const ACCENT       = [0.0, 1.0, 65 / 255]; // matches --accent-color (#00ff41)

const VERTEX_SHADER = `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`;

// Animated Julia set z = z^2 + c, with c drifting around the classic -0.8 + 0.156i spiral set.
const FRAGMENT_SHADER = `
precision highp float;

uniform vec2  uRes;
uniform float uTime;
uniform vec2  uMouse;
uniform vec3  uAccent;

const int MAX_ITER = 96;

void main() {
    float scale = 2.2;
    vec2  z     = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y * scale;
    vec2  dz    = vec2(1.0, 0.0);              // derivative, for the distance estimate
    float pixel = scale / uRes.y;

    float a = uTime * 0.15;
    vec2  c = vec2(-0.8, 0.156) + 0.035 * vec2(cos(a), sin(a * 0.7)) + uMouse * 0.02;

    float m = 0.0;
    bool escaped = false;
    for (int i = 0; i < MAX_ITER; i++) {
        dz = 2.0 * vec2(z.x * dz.x - z.y * dz.y, z.x * dz.y + z.y * dz.x);
        z  = vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y) + c;
        m  = dot(z, z);
        if (m > 1e4) { escaped = true; break; }
    }

    // Interior of the set stays dark.
    if (!escaped) {
        gl_FragColor = vec4(0.0);
        return;
    }

    // Distance to the set boundary: a thin bright filament plus a soft halo.
    float d    = 0.5 * sqrt(m / dot(dz, dz)) * log(m);
    float line = exp(-d / (pixel * 2.0));
    float halo = 0.18 * exp(-d / (pixel * 30.0));
    float glow = clamp(line + halo, 0.0, 1.0);

    gl_FragColor = vec4(uAccent * glow, glow);
}
`;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function compile(gl: WebGLRenderingContext, type: number, source: string) {
    const shader = gl.createShader(type);
    if (!shader) return null;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader);
        return null;
    }
    return shader;
}

// ─── Component ────────────────────────────────────────────────────────────────

/** Dim, slowly evolving Julia fractal rendered with WebGL. Fills its positioned parent. */
export default function FractalBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const gl = canvas.getContext('webgl', { antialias: false, alpha: true });
        if (!gl) return; // no WebGL: the page simply has no background

        const vs = compile(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
        const fs = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
        if (!vs || !fs) return;

        const program = gl.createProgram();
        if (!program) return;
        gl.attachShader(program, vs);
        gl.attachShader(program, fs);
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
        gl.useProgram(program);

        // Full-screen triangle.
        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
        const aPos = gl.getAttribLocation(program, 'aPos');
        gl.enableVertexAttribArray(aPos);
        gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

        const uRes    = gl.getUniformLocation(program, 'uRes');
        const uTime   = gl.getUniformLocation(program, 'uTime');
        const uMouse  = gl.getUniformLocation(program, 'uMouse');
        const uAccent = gl.getUniformLocation(program, 'uAccent');
        gl.uniform3f(uAccent, ACCENT[0], ACCENT[1], ACCENT[2]);

        const resize = () => {
            const w = Math.max(1, Math.floor(canvas.clientWidth  * RENDER_SCALE));
            const h = Math.max(1, Math.floor(canvas.clientHeight * RENDER_SCALE));
            if (canvas.width !== w || canvas.height !== h) {
                canvas.width  = w;
                canvas.height = h;
                gl.viewport(0, 0, w, h);
            }
            gl.uniform2f(uRes, w, h);
        };

        // Mouse offset in -1..1, eased towards its target every frame.
        const mouse  = { x: 0, y: 0 };
        const target = { x: 0, y: 0 };
        const onMouseMove = (e: MouseEvent) => {
            target.x = (e.clientX / window.innerWidth)  * 2 - 1;
            target.y = (e.clientY / window.innerHeight) * 2 - 1;
        };

        const start = performance.now();
        const draw = (now: number) => {
            mouse.x += (target.x - mouse.x) * 0.05;
            mouse.y += (target.y - mouse.y) * 0.05;
            gl.uniform1f(uTime, (now - start) / 1000);
            gl.uniform2f(uMouse, mouse.x, -mouse.y);
            gl.drawArrays(gl.TRIANGLES, 0, 3);
        };

        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const observer = new ResizeObserver(() => { resize(); if (reduceMotion) draw(start); });
        observer.observe(canvas);
        resize();

        if (reduceMotion) {
            draw(start);
            return () => observer.disconnect();
        }

        // Animate only while the canvas is on screen.
        let raf = 0;
        let last = 0;
        let visible = true;
        const loop = (now: number) => {
            raf = requestAnimationFrame(loop);
            if (!visible || now - last < FRAME_MS) return;
            last = now;
            draw(now);
        };
        const io = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; });
        io.observe(canvas);

        window.addEventListener('mousemove', onMouseMove, { passive: true });
        raf = requestAnimationFrame(loop);

        return () => {
            cancelAnimationFrame(raf);
            io.disconnect();
            observer.disconnect();
            window.removeEventListener('mousemove', onMouseMove);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            aria-hidden="true"
            style={{
                position:      'absolute',
                inset:         0,
                width:         '100%',
                height:        '100%',
                opacity:       0.28,
                pointerEvents: 'none',
                // Fade out towards the edges so it blends into the page.
                maskImage:       'radial-gradient(ellipse 70% 75% at 50% 50%, #000 35%, transparent 100%)',
                WebkitMaskImage: 'radial-gradient(ellipse 70% 75% at 50% 50%, #000 35%, transparent 100%)',
            }}
        />
    );
}

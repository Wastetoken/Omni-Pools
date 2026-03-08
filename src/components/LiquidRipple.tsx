"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";

// ── Wave simulation shader (Pass A) ──
const SIM_V = `
  attribute vec2 a_pos;
  varying vec2 v_uv;
  void main() { v_uv = a_pos * 0.5 + 0.5; gl_Position = vec4(a_pos, 0.0, 1.0); }
`;
const SIM_F = `
  precision highp float;
  varying vec2 v_uv;
  uniform sampler2D u_state;
  uniform vec2  u_texel;
  uniform vec2  u_mouse;
  uniform float u_impulse;
  uniform float u_time;

  #define DAMPING 0.987
  #define C2      0.24

  void main() {
    float hC = texture2D(u_state, v_uv).r;
    float hP = texture2D(u_state, v_uv).g;
    float hL = texture2D(u_state, v_uv + vec2(-u_texel.x, 0.0)).r;
    float hR = texture2D(u_state, v_uv + vec2( u_texel.x, 0.0)).r;
    float hD = texture2D(u_state, v_uv + vec2(0.0, -u_texel.y)).r;
    float hU = texture2D(u_state, v_uv + vec2(0.0,  u_texel.y)).r;
    float lap = hL + hR + hD + hU - 4.0 * hC;
    float hN = (2.0 * hC - hP + C2 * lap) * DAMPING;
    if (u_impulse > 0.5) {
      float d = length(v_uv - u_mouse);
      hN += 0.65 * exp(-d * d / (2.0 * 0.045 * 0.045));
    }
    hN = clamp(hN, -1.0, 1.0);
    gl_FragColor = vec4(hN, hC, 0.0, 1.0);
  }
`;

// ── Render shader (Pass B) for BG ripple - specular/caustic only ──
const RND_V = `
  attribute vec2 a_pos;
  varying vec2 v_uv;
  void main() { v_uv = a_pos * 0.5 + 0.5; gl_Position = vec4(a_pos, 0.0, 1.0); }
`;
const RND_F_BG = `
  precision highp float;
  varying vec2 v_uv;
  uniform sampler2D u_wave;
  uniform sampler2D u_bg;
  uniform vec2  u_texel;
  uniform float u_time;

  float H(vec2 uv) { return texture2D(u_wave, uv).r; }

  void main() {
    float hL = H(v_uv - vec2(u_texel.x, 0.0));
    float hR = H(v_uv + vec2(u_texel.x, 0.0));
    float hD = H(v_uv - vec2(0.0, u_texel.y));
    float hU = H(v_uv + vec2(0.0, u_texel.y));
    
    // Normal calculation
    vec3  N  = normalize(vec3(hL - hR, hD - hU, 0.1));

    // Refraction / Distortion
    vec2 distortion = N.xy * 0.05;
    vec3 bg = texture2D(u_bg, v_uv + distortion).rgb;

    // Caustics & Specular
    float h    = H(v_uv);
    float lap     = hL + hR + hD + hU - 4.0 * h;
    float caustic = pow(clamp(-lap * 12.0, 0.0, 1.0), 2.0);

    vec3  L    = normalize(vec3(0.3, 0.5, 1.0));
    vec3  H_   = normalize(L + vec3(0.0, 0.0, 1.0));
    float spec = pow(max(dot(N, H_), 0.0), 64.0);

    vec3 waterColor = vec3(0.4, 0.9, 1.0);
    vec3 finalColor = bg + waterColor * (spec * 0.5 + caustic * 0.2);

    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

export const LiquidRipple = ({ imageUrl, videoUrl }: { imageUrl?: string; videoUrl?: string }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", { alpha: false }) || (canvas.getContext as any)("experimental-webgl", { alpha: false });
    if (!gl) return;

    const extFloat = gl.getExtension("OES_texture_float");
    if (!extFloat) return;
    const extFloatLinear = gl.getExtension("OES_texture_float_linear");

    function compile(type: number, src: string) {
      const s = gl!.createShader(type)!;
      gl!.shaderSource(s, src);
      gl!.compileShader(s);
      if (!gl!.getShaderParameter(s, gl!.COMPILE_STATUS)) {
        console.error(gl!.getShaderInfoLog(s));
        gl!.deleteShader(s);
        return null;
      }
      return s;
    }

    function link(vSrc: string, fSrc: string) {
      const vs = compile(gl!.VERTEX_SHADER, vSrc);
      const fs = compile(gl!.FRAGMENT_SHADER, fSrc);
      if (!vs || !fs) return null;
      const p = gl!.createProgram()!;
      gl!.attachShader(p, vs);
      gl!.attachShader(p, fs);
      gl!.linkProgram(p);
      if (!gl!.getProgramParameter(p, gl!.LINK_STATUS)) return null;
      return p;
    }

    function makeTex(w: number, h: number) {
      const t = gl!.createTexture()!;
      gl!.bindTexture(gl!.TEXTURE_2D, t);
      const filter = extFloatLinear ? gl!.LINEAR : gl!.NEAREST;
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MIN_FILTER, filter);
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MAG_FILTER, filter);
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_S, gl!.CLAMP_TO_EDGE);
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_T, gl!.CLAMP_TO_EDGE);
      gl!.texImage2D(gl!.TEXTURE_2D, 0, gl!.RGBA, w, h, 0, gl!.RGBA, gl!.FLOAT, null);
      return t;
    }

    function makeFBO(tex: WebGLTexture) {
      const fbo = gl!.createFramebuffer()!;
      gl!.bindFramebuffer(gl!.FRAMEBUFFER, fbo);
      gl!.framebufferTexture2D(gl!.FRAMEBUFFER, gl!.COLOR_ATTACHMENT0, gl!.TEXTURE_2D, tex, 0);
      if (gl!.checkFramebufferStatus(gl!.FRAMEBUFFER) !== gl!.FRAMEBUFFER_COMPLETE) return null;
      gl!.bindFramebuffer(gl!.FRAMEBUFFER, null);
      return fbo;
    }

    const SW = 128, SH = 128;
    const quad = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);

    const simProg = link(SIM_V, SIM_F);
    const rndProg = link(RND_V, RND_F_BG);
    if (!simProg || !rndProg) return;

    const S = {
      aPos: gl.getAttribLocation(simProg, "a_pos"),
      state: gl.getUniformLocation(simProg, "u_state"),
      texel: gl.getUniformLocation(simProg, "u_texel"),
      mouse: gl.getUniformLocation(simProg, "u_mouse"),
      imp: gl.getUniformLocation(simProg, "u_impulse"),
      time: gl.getUniformLocation(simProg, "u_time"),
    };

    const R = {
      aPos: gl.getAttribLocation(rndProg, "a_pos"),
      wave: gl.getUniformLocation(rndProg, "u_wave"),
      bg: gl.getUniformLocation(rndProg, "u_bg"),
      texel: gl.getUniformLocation(rndProg, "u_texel"),
      time: gl.getUniformLocation(rndProg, "u_time"),
    };

    let texA = makeTex(SW, SH), texB = makeTex(SW, SH);
    let fboA = makeFBO(texA)!, fboB = makeFBO(texB)!;
    if (!fboA || !fboB) return;

    // Load background texture
    const bgTex = gl.createTexture();
    let bgReady = false;

    let video: HTMLVideoElement | null = null;
    let playPromise: Promise<void> | null = null;
    if (videoUrl) {
      video = document.createElement("video");
      video.src = videoUrl;
      video.crossOrigin = "anonymous";
      video.loop = true;
      video.muted = true;
      video.playsInline = true;
      video.autoplay = true;
      playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(e => {
          if (e.name !== "AbortError") {
            console.error("Video play failed", e);
          }
        });
      }

      video.oncanplay = () => {
        gl.bindTexture(gl.TEXTURE_2D, bgTex);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        bgReady = true;
      };
    } else {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = imageUrl || "";
      img.onload = () => {
        gl.bindTexture(gl.TEXTURE_2D, bgTex);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        bgReady = true;
      };
    }

    const TX = 1.0 / SW, TY = 1.0 / SH;
    let mX = -1, mY = -1, moved = false, held = false;
    let requestRef: number;

    function setPos(clientX: number, clientY: number) {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      // Calculate position relative to the canvas
      const nx = (clientX - rect.left) / rect.width;
      const ny = 1.0 - (clientY - rect.top) / rect.height;
      
      if (nx >= 0 && nx <= 1 && ny >= 0 && ny <= 1) {
        if (Math.abs(nx - mX) > 0.001 || Math.abs(ny - mY) > 0.001) moved = true;
        mX = nx; mY = ny;
      }
    }

    const onMove = (e: MouseEvent) => {
      setPos(e.clientX, e.clientY);
    };
    const onDown = (e: MouseEvent) => {
      held = true;
      setPos(e.clientX, e.clientY);
    };
    const onUp = () => (held = false);
    const onTouchStart = (e: TouchEvent) => {
      held = true;
      setPos(e.touches[0].clientX, e.touches[0].clientY);
    };
    const onTouchMove = (e: TouchEvent) => setPos(e.touches[0].clientX, e.touches[0].clientY);
    const onTouchEnd = () => {
      held = false;
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });

    const resize = () => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      canvas.width = rect.width;
      canvas.height = rect.height;
    };
    window.addEventListener("resize", resize);
    resize();

    const t0 = performance.now();
    
    const render = (time: number) => {
      if (!gl || !canvas) return;

      if (!bgReady && video && video.readyState >= 2) {
        bgReady = true;
      }
      
      if (bgReady) {
        const t = (time - t0) / 1000.0;

        if (video && video.readyState >= video.HAVE_CURRENT_DATA) {
          gl.bindTexture(gl.TEXTURE_2D, bgTex);
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, video);
        }

        // Pass A - simulate
        gl.viewport(0, 0, SW, SH);
        gl.bindFramebuffer(gl.FRAMEBUFFER, fboB);
        gl.useProgram(simProg);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texA);
        gl.uniform1i(S.state, 0);
        gl.uniform2f(S.texel, TX, TY);
        gl.uniform2f(S.mouse, mX, mY);
        gl.uniform1f(S.time, t);
        // Trigger impulse on move OR hold
        gl.uniform1f(S.imp, (moved || held) && mX >= 0 ? 1.0 : 0.0);
        moved = false;

        gl.bindBuffer(gl.ARRAY_BUFFER, quad);
        gl.enableVertexAttribArray(S.aPos);
        gl.vertexAttribPointer(S.aPos, 2, gl.FLOAT, false, 0, 0);
        gl.drawArrays(gl.TRIANGLES, 0, 6);

        // Swap
        let tmpTex = texA; texA = texB; texB = tmpTex;
        let tmpFbo = fboA; fboA = fboB; fboB = tmpFbo;

        // Pass B - render
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.useProgram(rndProg);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texA);
        gl.uniform1i(R.wave, 0);
        
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, bgTex);
        gl.uniform1i(R.bg, 1);

        gl.uniform2f(R.texel, TX, TY);
        gl.uniform1f(R.time, t);

        gl.bindBuffer(gl.ARRAY_BUFFER, quad);
        gl.enableVertexAttribArray(R.aPos);
        gl.vertexAttribPointer(R.aPos, 2, gl.FLOAT, false, 0, 0);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
      }

      requestRef = requestAnimationFrame(render);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!requestRef) {
            requestRef = requestAnimationFrame(render);
          }
        } else {
          if (requestRef) {
            cancelAnimationFrame(requestRef);
            requestRef = 0;
          }
        }
      },
      { threshold: 0.01 }
    );
    observer.observe(canvas);

    return () => {
      observer.disconnect();
      if (requestRef) cancelAnimationFrame(requestRef);
      if (video) {
        if (playPromise !== null) {
          playPromise.then(() => {
            video?.pause();
          }).catch(() => {});
        } else {
          video.pause();
        }
        video.src = "";
        video.load();
      }
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-0"
      style={{ display: "block", width: "100%", height: "100%", objectFit: "cover" }}
    />
  );
};

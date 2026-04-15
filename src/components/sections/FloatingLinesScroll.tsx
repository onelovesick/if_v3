import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import {
  Clock,
  Mesh,
  OrthographicCamera,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  Vector2,
  Vector3,
  WebGLRenderer
} from 'three';

import './FloatingLinesScroll.css';

/* ═══════════════════════════════════════════════════════════════
   FloatingLinesScroll
   
   Based on React Bits FloatingLines (reactbits.dev).
   
   Modifications from original:
   1. Removed dark background_color() — canvas is transparent
   2. Renderer uses alpha:true for white page compositing
   3. Added uConverge uniform — interpolates wave positions
      from diverged (two crossing groups) to merged (center band)
   4. Added uColorMix uniform — transitions line color from
      initial gradient to brand blue (#47B5FF)
   5. Added uFade uniform — overall fade for exit transitions
   6. Exposes uniforms ref via forwardRef for GSAP ScrollTrigger
   
   Everything else (wave function, rotation, line rendering,
   bloom, parallax, interaction) is the original React Bits code.
   ═══════════════════════════════════════════════════════════════ */

const vertexShader = `
precision highp float;
void main() {
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
precision highp float;

uniform float iTime;
uniform vec3  iResolution;
uniform float animationSpeed;

uniform bool enableTop;
uniform bool enableMiddle;
uniform bool enableBottom;

uniform int topLineCount;
uniform int middleLineCount;
uniform int bottomLineCount;

uniform float topLineDistance;
uniform float middleLineDistance;
uniform float bottomLineDistance;

// Original positions (diverged state)
uniform vec3 topWavePosition;
uniform vec3 middleWavePosition;
uniform vec3 bottomWavePosition;

// Converged target positions
uniform vec3 topConvergedPos;
uniform vec3 middleConvergedPos;
uniform vec3 bottomConvergedPos;

uniform vec2 iMouse;
uniform bool interactive;
uniform float bendRadius;
uniform float bendStrength;
uniform float bendInfluence;

uniform bool parallax;
uniform float parallaxStrength;
uniform vec2 parallaxOffset;

uniform vec3 lineGradient[8];
uniform int lineGradientCount;

// ═══ SCROLL UNIFORMS ═══
uniform float uConverge;  // 0 = diverged, 1 = merged
uniform float uColorMix;  // 0 = gradient colors, 1 = brand blue
uniform float uFade;      // 0 = visible, 1 = faded out

const vec3 BRAND_BLUE = vec3(0.278, 0.710, 1.0);

mat2 rotate(float r) {
  return mat2(cos(r), sin(r), -sin(r), cos(r));
}

vec3 getLineColor(float t, vec3 baseColor) {
  vec3 gradientColor;
  
  if (lineGradientCount <= 0) {
    gradientColor = baseColor;
  } else if (lineGradientCount == 1) {
    gradientColor = lineGradient[0] * 0.5;
  } else {
    float clampedT = clamp(t, 0.0, 0.9999);
    float scaled = clampedT * float(lineGradientCount - 1);
    int idx = int(floor(scaled));
    float f = fract(scaled);
    int idx2 = min(idx + 1, lineGradientCount - 1);
    gradientColor = mix(lineGradient[idx], lineGradient[idx2], f) * 0.5;
  }
  
  // ═══ Color transition: gradient → brand blue ═══
  vec3 blueTarget = BRAND_BLUE * 0.55;
  return mix(gradientColor, blueTarget, uColorMix);
}

float wave(vec2 uv, float offset, vec2 screenUv, vec2 mouseUv, bool shouldBend) {
  float time = iTime * animationSpeed;
  float x_offset   = offset;
  float x_movement = time * 0.1;
  float amp         = sin(offset + time * 0.2) * 0.3;
  float y           = sin(uv.x + x_offset + x_movement) * amp;

  if (shouldBend) {
    vec2 d = screenUv - mouseUv;
    float influence = exp(-dot(d, d) * bendRadius);
    float bendOffset = (mouseUv.y - screenUv.y) * influence * bendStrength * bendInfluence;
    y += bendOffset;
  }

  float m = uv.y - y;
  return 0.0175 / max(abs(m) + 0.01, 1e-3) + 0.01;
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
  vec2 baseUv = (2.0 * fragCoord - iResolution.xy) / iResolution.y;
  baseUv.y *= -1.0;
  
  if (parallax) {
    baseUv += parallaxOffset;
  }

  vec3 col = vec3(0.0);

  // ═══ NO background_color() — transparent canvas ═══
  vec3 b = vec3(0.0);

  vec2 mouseUv = vec2(0.0);
  if (interactive) {
    mouseUv = (2.0 * iMouse - iResolution.xy) / iResolution.y;
    mouseUv.y *= -1.0;
  }

  // ═══ Smoothstep convergence ═══
  float c = uConverge * uConverge * (3.0 - 2.0 * uConverge);

  // ═══ Interpolated wave positions ═══
  vec3 curTopPos = mix(topWavePosition, topConvergedPos, c);
  vec3 curMidPos = mix(middleWavePosition, middleConvergedPos, c);
  vec3 curBotPos = mix(bottomWavePosition, bottomConvergedPos, c);

  // Line distance tightens when converged
  float distScale = mix(1.0, 0.55, c);
  
  if (enableBottom) {
    for (int i = 0; i < bottomLineCount; ++i) {
      float fi = float(i);
      float t = fi / max(float(bottomLineCount - 1), 1.0);
      vec3 lineCol = getLineColor(t, b);
      
      float angle = curBotPos.z * log(length(baseUv) + 1.0);
      vec2 ruv = baseUv * rotate(angle);
      col += lineCol * wave(
        ruv + vec2(bottomLineDistance * distScale * fi + curBotPos.x, curBotPos.y),
        1.5 + 0.2 * fi,
        baseUv, mouseUv, interactive
      ) * 0.2;
    }
  }

  if (enableMiddle) {
    for (int i = 0; i < middleLineCount; ++i) {
      float fi = float(i);
      float t = fi / max(float(middleLineCount - 1), 1.0);
      vec3 lineCol = getLineColor(t, b);
      
      float angle = curMidPos.z * log(length(baseUv) + 1.0);
      vec2 ruv = baseUv * rotate(angle);
      col += lineCol * wave(
        ruv + vec2(middleLineDistance * distScale * fi + curMidPos.x, curMidPos.y),
        2.0 + 0.15 * fi,
        baseUv, mouseUv, interactive
      );
    }
  }

  if (enableTop) {
    for (int i = 0; i < topLineCount; ++i) {
      float fi = float(i);
      float t = fi / max(float(topLineCount - 1), 1.0);
      vec3 lineCol = getLineColor(t, b);
      
      float angle = curTopPos.z * log(length(baseUv) + 1.0);
      vec2 ruv = baseUv * rotate(angle);
      ruv.x *= -1.0;
      col += lineCol * wave(
        ruv + vec2(topLineDistance * distScale * fi + curTopPos.x, curTopPos.y),
        1.0 + 0.2 * fi,
        baseUv, mouseUv, interactive
      ) * 0.1;
    }
  }

  // ═══ Alpha output for transparent compositing on white ═══
  float intensity = max(col.r, max(col.g, col.b));
  float alpha = smoothstep(0.005, 0.12, intensity);
  alpha *= (1.0 - uFade);

  fragColor = vec4(col, alpha);
}

void main() {
  vec4 color = vec4(0.0);
  mainImage(color, gl_FragCoord.xy);
  gl_FragColor = color;
}
`;

const MAX_GRADIENT_STOPS = 8;

function hexToVec3(hex: string) {
  let value = hex.trim();
  if (value.startsWith('#')) value = value.slice(1);
  let r = 255, g = 255, b = 255;
  if (value.length === 3) {
    r = parseInt(value[0] + value[0], 16);
    g = parseInt(value[1] + value[1], 16);
    b = parseInt(value[2] + value[2], 16);
  } else if (value.length === 6) {
    r = parseInt(value.slice(0, 2), 16);
    g = parseInt(value.slice(2, 4), 16);
    b = parseInt(value.slice(4, 6), 16);
  }
  return new Vector3(r / 255, g / 255, b / 255);
}

type WavePos = { x: number; y: number; rotate?: number };
type WaveType = 'top' | 'middle' | 'bottom';

interface FloatingLinesScrollProps {
  linesGradient?: string[];
  enabledWaves?: WaveType[];
  lineCount?: number | number[];
  lineDistance?: number | number[];
  topWavePosition?: WavePos;
  middleWavePosition?: WavePos;
  bottomWavePosition?: WavePos;
  topConvergedPos?: WavePos;
  middleConvergedPos?: WavePos;
  bottomConvergedPos?: WavePos;
  animationSpeed?: number;
  interactive?: boolean;
  bendRadius?: number;
  bendStrength?: number;
  mouseDamping?: number;
  parallax?: boolean;
  parallaxStrength?: number;
}

export interface FloatingLinesScrollHandle {
  getUniforms: () => Record<string, { value: unknown }> | null;
}

const FloatingLinesScroll = forwardRef<FloatingLinesScrollHandle, FloatingLinesScrollProps>(function FloatingLinesScroll({
  linesGradient,
  enabledWaves = ['top', 'bottom'],
  lineCount = [8, 8],
  lineDistance = [6, 6],
  topWavePosition = { x: 8.0, y: 0.5, rotate: -0.5 },
  middleWavePosition = { x: 5.0, y: 0.0, rotate: 0.15 },
  bottomWavePosition = { x: 2.0, y: -0.65, rotate: 0.45 },
  // Converged positions — where waves merge on scroll
  topConvergedPos = { x: 5.0, y: 0.0, rotate: -0.06 },
  middleConvergedPos = { x: 5.0, y: 0.0, rotate: 0.0 },
  bottomConvergedPos = { x: 5.0, y: 0.0, rotate: 0.06 },
  animationSpeed = 0.8,
  interactive = false,
  bendRadius = 6.0,
  bendStrength = -1.5,
  mouseDamping = 0.05,
  parallax = false,
  parallaxStrength = 0.15,
}, ref) {
  const containerRef = useRef<HTMLDivElement>(null);
  const targetMouseRef = useRef(new Vector2(-1000, -1000));
  const currentMouseRef = useRef(new Vector2(-1000, -1000));
  const targetInfluenceRef = useRef(0);
  const currentInfluenceRef = useRef(0);
  const targetParallaxRef = useRef(new Vector2(0, 0));
  const currentParallaxRef = useRef(new Vector2(0, 0));
  const uniformsRef = useRef<Record<string, { value: unknown }> | null>(null);

  // Expose uniforms to parent for GSAP control
  useImperativeHandle(ref, () => ({
    getUniforms: () => uniformsRef.current,
  }));

  const getLineCount = (waveType: WaveType) => {
    if (typeof lineCount === 'number') return lineCount;
    if (!enabledWaves.includes(waveType)) return 0;
    const index = enabledWaves.indexOf(waveType);
    return lineCount[index] ?? 6;
  };

  const getLineDistance = (waveType: WaveType) => {
    if (typeof lineDistance === 'number') return lineDistance;
    if (!enabledWaves.includes(waveType)) return 0.1;
    const index = enabledWaves.indexOf(waveType);
    return lineDistance[index] ?? 0.1;
  };

  const topLineCount = enabledWaves.includes('top') ? getLineCount('top') : 0;
  const middleLineCount = enabledWaves.includes('middle') ? getLineCount('middle') : 0;
  const bottomLineCount = enabledWaves.includes('bottom') ? getLineCount('bottom') : 0;

  const topLineDist = enabledWaves.includes('top') ? getLineDistance('top') * 0.01 : 0.01;
  const middleLineDist = enabledWaves.includes('middle') ? getLineDistance('middle') * 0.01 : 0.01;
  const bottomLineDist = enabledWaves.includes('bottom') ? getLineDistance('bottom') * 0.01 : 0.01;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let active = true;
    const scene = new Scene();
    const camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
    camera.position.z = 1;

    // ═══ alpha: true for transparent compositing on white ═══
    const renderer = new WebGLRenderer({ antialias: true, alpha: true });
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    container.appendChild(renderer.domElement);

    const uniforms = {
      iTime: { value: 0 },
      iResolution: { value: new Vector3(1, 1, 1) },
      animationSpeed: { value: animationSpeed },

      enableTop: { value: enabledWaves.includes('top') },
      enableMiddle: { value: enabledWaves.includes('middle') },
      enableBottom: { value: enabledWaves.includes('bottom') },

      topLineCount: { value: topLineCount },
      middleLineCount: { value: middleLineCount },
      bottomLineCount: { value: bottomLineCount },

      topLineDistance: { value: topLineDist },
      middleLineDistance: { value: middleLineDist },
      bottomLineDistance: { value: bottomLineDist },

      topWavePosition: {
        value: new Vector3(topWavePosition.x, topWavePosition.y, topWavePosition.rotate ?? 0)
      },
      middleWavePosition: {
        value: new Vector3(middleWavePosition.x, middleWavePosition.y, middleWavePosition.rotate ?? 0)
      },
      bottomWavePosition: {
        value: new Vector3(bottomWavePosition.x, bottomWavePosition.y, bottomWavePosition.rotate ?? 0)
      },

      topConvergedPos: {
        value: new Vector3(topConvergedPos.x, topConvergedPos.y, topConvergedPos.rotate ?? 0)
      },
      middleConvergedPos: {
        value: new Vector3(middleConvergedPos.x, middleConvergedPos.y, middleConvergedPos.rotate ?? 0)
      },
      bottomConvergedPos: {
        value: new Vector3(bottomConvergedPos.x, bottomConvergedPos.y, bottomConvergedPos.rotate ?? 0)
      },

      iMouse: { value: new Vector2(-1000, -1000) },
      interactive: { value: interactive },
      bendRadius: { value: bendRadius },
      bendStrength: { value: bendStrength },
      bendInfluence: { value: 0 },

      parallax: { value: parallax },
      parallaxStrength: { value: parallaxStrength },
      parallaxOffset: { value: new Vector2(0, 0) },

      lineGradient: {
        value: Array.from({ length: MAX_GRADIENT_STOPS }, () => new Vector3(1, 1, 1))
      },
      lineGradientCount: { value: 0 },

      // ═══ Scroll uniforms ═══
      uConverge: { value: 0.0 },
      uColorMix: { value: 0.0 },
      uFade: { value: 0.0 },
    };

    // Set gradient colors
    if (linesGradient && linesGradient.length > 0) {
      const stops = linesGradient.slice(0, MAX_GRADIENT_STOPS);
      uniforms.lineGradientCount.value = stops.length;
      stops.forEach((hex, i) => {
        const color = hexToVec3(hex);
        uniforms.lineGradient.value[i].set(color.x, color.y, color.z);
      });
    }

    // Expose uniforms for GSAP
    uniformsRef.current = uniforms;

    const material = new ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
      depthTest: false,
    });

    const geometry = new PlaneGeometry(2, 2);
    const mesh = new Mesh(geometry, material);
    scene.add(mesh);

    const clock = new Clock();

    const setSize = () => {
      if (!active) return;
      const width = container.clientWidth || 1;
      const height = container.clientHeight || 1;
      renderer.setSize(width, height, false);
      const cw = renderer.domElement.width;
      const ch = renderer.domElement.height;
      uniforms.iResolution.value.set(cw, ch, 1);
    };
    setSize();

    const ro = typeof ResizeObserver !== 'undefined'
      ? new ResizeObserver(() => { if (active) setSize(); })
      : null;
    if (ro) ro.observe(container);

    // Mouse handlers (only if interactive)
    const handlePointerMove = (event: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const dpr = renderer.getPixelRatio();
      targetMouseRef.current.set(x * dpr, (rect.height - y) * dpr);
      targetInfluenceRef.current = 1.0;

      if (parallax) {
        const cx = rect.width / 2, cy = rect.height / 2;
        targetParallaxRef.current.set(
          (x - cx) / rect.width * parallaxStrength,
          -(y - cy) / rect.height * parallaxStrength
        );
      }
    };

    const handlePointerLeave = () => {
      targetInfluenceRef.current = 0.0;
    };

    if (interactive) {
      renderer.domElement.addEventListener('pointermove', handlePointerMove);
      renderer.domElement.addEventListener('pointerleave', handlePointerLeave);
    }

    let raf = 0;
    const renderLoop = () => {
      if (!active) return;
      uniforms.iTime.value = clock.getElapsedTime();

      if (interactive) {
        currentMouseRef.current.lerp(targetMouseRef.current, mouseDamping);
        uniforms.iMouse.value.copy(currentMouseRef.current);
        currentInfluenceRef.current += (targetInfluenceRef.current - currentInfluenceRef.current) * mouseDamping;
        uniforms.bendInfluence.value = currentInfluenceRef.current;
      }

      if (parallax) {
        currentParallaxRef.current.lerp(targetParallaxRef.current, mouseDamping);
        uniforms.parallaxOffset.value.copy(currentParallaxRef.current);
      }

      renderer.render(scene, camera);
      raf = requestAnimationFrame(renderLoop);
    };
    renderLoop();

    return () => {
      active = false;
      cancelAnimationFrame(raf);
      if (ro) ro.disconnect();
      if (interactive) {
        renderer.domElement.removeEventListener('pointermove', handlePointerMove);
        renderer.domElement.removeEventListener('pointerleave', handlePointerLeave);
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      if (renderer.domElement.parentElement) {
        renderer.domElement.parentElement.removeChild(renderer.domElement);
      }
      uniformsRef.current = null;
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="floating-lines-scroll-container"
    />
  );
});

export default FloatingLinesScroll;

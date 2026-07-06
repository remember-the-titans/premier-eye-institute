"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Camera, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { buildGlassesModel, FRAME_COLORS } from "./glasses-model";

type Status = "idle" | "requesting" | "active" | "denied" | "error";

export function VirtualTryOn() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);

  const [status, setStatus] = useState<Status>("idle");
  const [faceFound, setFaceFound] = useState(false);
  const [color, setColor] = useState<string>(FRAME_COLORS[0].value);
  const [scale, setScale] = useState(1);
  const [yOffset, setYOffset] = useState(0);

  // Live-tunable calibration, read by the render loop via refs so it never
  // has to restart the camera/tracking pipeline on change.
  const colorRef = useRef(color);
  const scaleRef = useRef(scale);
  const yOffsetRef = useRef(yOffset);
  useEffect(() => {
    colorRef.current = color;
  }, [color]);
  useEffect(() => {
    scaleRef.current = scale;
  }, [scale]);
  useEffect(() => {
    yOffsetRef.current = yOffset;
  }, [yOffset]);

  const glassesRigRef = useRef<THREE.Group | null>(null);
  const glassesMeshRef = useRef<THREE.Group | null>(null);

  useEffect(() => {
    if (status !== "active") return;
    let cancelled = false;
    let renderer: THREE.WebGLRenderer | null = null;
    let faceLandmarker: import("@mediapipe/tasks-vision").FaceLandmarker | null =
      null;

    async function start() {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas) return;

      const { FaceLandmarker, FilesetResolver } = await import(
        "@mediapipe/tasks-vision"
      );
      if (cancelled) return;

      const filesetResolver = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.35/wasm",
      );
      if (cancelled) return;

      faceLandmarker = await FaceLandmarker.createFromOptions(
        filesetResolver,
        {
          baseOptions: {
            modelAssetPath:
              "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
            delegate: "GPU",
          },
          runningMode: "VIDEO",
          numFaces: 1,
          outputFacialTransformationMatrixes: true,
          outputFaceBlendshapes: false,
        },
      );
      if (cancelled) {
        faceLandmarker?.close();
        return;
      }

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(
        63,
        video.videoWidth / video.videoHeight || 16 / 9,
        0.1,
        2000,
      );
      camera.position.set(0, 0, 0);
      scene.add(camera);

      scene.add(new THREE.AmbientLight(0xffffff, 1.1));
      const key = new THREE.DirectionalLight(0xffffff, 1.4);
      key.position.set(0.5, 1, 1);
      scene.add(key);

      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      const faceAnchor = new THREE.Group();
      faceAnchor.matrixAutoUpdate = false;
      scene.add(faceAnchor);

      const glassesRig = new THREE.Group();
      faceAnchor.add(glassesRig);
      glassesRigRef.current = glassesRig;

      const mesh = buildGlassesModel(colorRef.current);
      glassesRig.add(mesh);
      glassesMeshRef.current = mesh;
      glassesRig.visible = false;

      function resize() {
        if (!video || !canvas || !renderer) return;
        const width = video.clientWidth || video.videoWidth;
        const height = video.clientHeight || video.videoHeight;
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      }
      resize();
      window.addEventListener("resize", resize);

      let lastVideoTime = -1;

      function renderLoop() {
        if (cancelled) return;
        rafRef.current = requestAnimationFrame(renderLoop);
        if (!video || !faceLandmarker || video.readyState < 2) return;

        if (video.currentTime !== lastVideoTime) {
          lastVideoTime = video.currentTime;
          const result = faceLandmarker.detectForVideo(video, performance.now());
          const matrixData =
            result.facialTransformationMatrixes?.[0]?.data;

          if (matrixData) {
            faceAnchor.matrix.fromArray(matrixData as unknown as number[]);
            faceAnchor.matrixWorldNeedsUpdate = true;
            glassesRig.visible = true;
            setFaceFound(true);
          } else {
            glassesRig.visible = false;
            setFaceFound(false);
          }
        }

        // Recolor mesh if the swatch changed since it was built.
        if (
          glassesMeshRef.current &&
          glassesMeshRef.current.userData.color !== colorRef.current
        ) {
          const rig = glassesRigRef.current!;
          rig.remove(glassesMeshRef.current);
          const rebuilt = buildGlassesModel(colorRef.current);
          rebuilt.userData.color = colorRef.current;
          rig.add(rebuilt);
          glassesMeshRef.current = rebuilt;
        }

        glassesRig.scale.setScalar(scaleRef.current);
        glassesRig.position.set(0, yOffsetRef.current, 0);

        renderer?.render(scene, camera);
      }

      renderLoop();

      return () => {
        window.removeEventListener("resize", resize);
      };
    }

    const cleanupPromise = start();

    return () => {
      cancelled = true;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      cleanupPromise.then((fn) => fn?.());
      faceLandmarker?.close();
      renderer?.dispose();
    };
  }, [status]);

  async function startCamera() {
    setStatus("requesting");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: 960, height: 720 },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setStatus("active");
    } catch (err) {
      console.error(err);
      setStatus(
        err instanceof DOMException && err.name === "NotAllowedError"
          ? "denied"
          : "error",
      );
    }
  }

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  return (
    <div className="mx-auto max-w-[720px] px-5 sm:px-8">
      <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-ink shadow-warm-lg">
        <div className="absolute inset-0 [transform:scaleX(-1)]">
          <video
            ref={videoRef}
            className="h-full w-full object-cover"
            muted
            playsInline
          />
          <canvas
            ref={canvasRef}
            className="pointer-events-none absolute inset-0 h-full w-full"
          />
        </div>

        {status !== "active" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-6 text-center">
            {status === "idle" && (
              <>
                <Camera className="size-9 text-white/70" strokeWidth={1.4} />
                <p className="max-w-xs text-[15px] leading-relaxed text-white/85">
                  Try on a frame using your webcam. Nothing is recorded or
                  uploaded — the camera feed stays in your browser.
                </p>
                <Button variant="pill" size="pill" onClick={startCamera}>
                  Turn on camera
                </Button>
              </>
            )}
            {status === "requesting" && (
              <p className="text-[15px] text-white/85">
                Waiting for camera permission…
              </p>
            )}
            {status === "denied" && (
              <>
                <p className="max-w-xs text-[15px] leading-relaxed text-white/85">
                  Camera access was blocked. Allow camera permission for this
                  site in your browser settings, then try again.
                </p>
                <Button variant="pill-outline" size="pill" onClick={startCamera}>
                  <RefreshCw className="size-4" /> Try again
                </Button>
              </>
            )}
            {status === "error" && (
              <>
                <p className="max-w-xs text-[15px] leading-relaxed text-white/85">
                  Couldn&apos;t start the camera. It may be in use by another
                  app, or your browser may not support this feature.
                </p>
                <Button variant="pill-outline" size="pill" onClick={startCamera}>
                  <RefreshCw className="size-4" /> Try again
                </Button>
              </>
            )}
          </div>
        )}

        {status === "active" && !faceFound && (
          <div className="pointer-events-none absolute inset-x-0 bottom-4 flex justify-center">
            <span className="rounded-full bg-black/50 px-4 py-1.5 text-[13px] text-white/90 backdrop-blur">
              Center your face in the frame
            </span>
          </div>
        )}
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        {FRAME_COLORS.map((swatch) => (
          <button
            key={swatch.value}
            type="button"
            aria-label={swatch.name}
            onClick={() => setColor(swatch.value)}
            className="size-9 rounded-full border-2 transition-transform hover:scale-105"
            style={{
              backgroundColor: swatch.value,
              borderColor:
                color === swatch.value ? "var(--accent)" : "transparent",
            }}
          />
        ))}
      </div>

      {status === "active" && (
        <div className="mx-auto mt-8 grid max-w-sm gap-4 rounded-lg border border-black/5 bg-surface-alt p-5">
          <p className="text-[12px] font-medium uppercase tracking-wide text-soft">
            Fit calibration (placeholder model)
          </p>
          <label className="grid gap-1.5 text-[13px] text-body-text">
            Size
            <input
              type="range"
              min={0.6}
              max={1.6}
              step={0.01}
              value={scale}
              onChange={(e) => setScale(Number(e.target.value))}
            />
          </label>
          <label className="grid gap-1.5 text-[13px] text-body-text">
            Vertical position
            <input
              type="range"
              min={-15}
              max={15}
              step={0.5}
              value={yOffset}
              onChange={(e) => setYOffset(Number(e.target.value))}
            />
          </label>
        </div>
      )}
    </div>
  );
}

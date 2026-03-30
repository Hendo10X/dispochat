"use client";

import { useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import type { AnimationType } from "@/hooks/use-message-animation";

const rnd = (min: number, max: number) => Math.random() * (max - min) + min;

/* ─── 😂 Laugh rain ──────────────────────────────────────────── */
function LolRain({ onDone }: { onDone: () => void }) {
  const particles = useMemo(
    () =>
      Array.from({ length: 22 }, (_, i) => ({
        id: i,
        x: rnd(2, 98),
        delay: rnd(0, 1),
        size: rnd(24, 40),
      })),
    []
  );

  useEffect(() => {
    const t = setTimeout(onDone, 3200);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className="pointer-events-none fixed inset-0 z-[99] overflow-hidden">
      {particles.map((p) => (
        <motion.span
          key={p.id}
          className="absolute select-none leading-none"
          style={{ left: `${p.x}%`, top: 0, fontSize: p.size }}
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: "108vh", opacity: [0, 1, 1, 0] }}
          transition={{
            duration: rnd(1.8, 2.6),
            delay: p.delay,
            ease: "linear",
          }}
        >
          😂
        </motion.span>
      ))}
    </div>
  );
}

/* ─── 🎉 Confetti burst ───────────────────────────────────────── */
const CONFETTI_COLORS = [
  "#FF6B6B", "#FFD93D", "#4ECDC4", "#AAD3FF",
  "#FF6900", "#C77DFF", "#00C950", "#FF9F43",
];

function Celebrate({ onDone }: { onDone: () => void }) {
  const pieces = useMemo(
    () =>
      Array.from({ length: 60 }, (_, i) => ({
        id: i,
        color: CONFETTI_COLORS[Math.floor(rnd(0, CONFETTI_COLORS.length))],
        w: rnd(6, 13),
        h: rnd(10, 20),
        round: Math.random() > 0.45,
        tx: rnd(-60, 60),
        ty: rnd(5, 95),
        delay: rnd(0, 0.3),
        rotate: rnd(-480, 480),
      })),
    []
  );

  useEffect(() => {
    const t = setTimeout(onDone, 2800);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className="pointer-events-none fixed inset-0 z-[99] overflow-hidden">
      {pieces.map((p) => (
        <motion.div
          key={p.id}
          className="absolute"
          style={{
            left: "50%",
            top: "42%",
            width: p.w,
            height: p.h,
            borderRadius: p.round ? "50%" : 2,
            backgroundColor: p.color,
          }}
          initial={{ x: 0, y: 0, opacity: 1, scale: 0, rotate: 0 }}
          animate={{
            x: `${p.tx}vw`,
            y: `${p.ty}vh`,
            opacity: [1, 1, 0],
            scale: [0, 1, 0.7],
            rotate: p.rotate,
          }}
          transition={{
            duration: rnd(1.6, 2.2),
            delay: p.delay,
            ease: [0.16, 1, 0.3, 1],
          }}
        />
      ))}
    </div>
  );
}

/* ─── ❤️ Floating hearts ─────────────────────────────────────── */
const HEART_EMOJIS = ["❤️", "💕", "💖", "🩷", "💗"];

function FloatingHearts({ onDone }: { onDone: () => void }) {
  const particles = useMemo(
    () =>
      Array.from({ length: 16 }, (_, i) => ({
        id: i,
        x: rnd(10, 90),
        delay: rnd(0, 0.9),
        size: rnd(22, 40),
        drift: rnd(-40, 40),
        emoji: HEART_EMOJIS[Math.floor(rnd(0, HEART_EMOJIS.length))],
      })),
    []
  );

  useEffect(() => {
    const t = setTimeout(onDone, 3200);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className="pointer-events-none fixed inset-0 z-[99] overflow-hidden">
      {particles.map((p) => (
        <motion.span
          key={p.id}
          className="absolute select-none leading-none"
          style={{ left: `${p.x}%`, bottom: 0, fontSize: p.size }}
          initial={{ y: 0, x: 0, opacity: 0, scale: 0 }}
          animate={{
            y: "-112vh",
            x: p.drift,
            opacity: [0, 1, 1, 0],
            scale: [0, 1.2, 1],
          }}
          transition={{
            duration: rnd(2, 3),
            delay: p.delay,
            ease: "easeOut",
          }}
        >
          {p.emoji}
        </motion.span>
      ))}
    </div>
  );
}

/* ─── 💀 Skull rain — surprise ───────────────────────────────── */
function SkullRain({ onDone }: { onDone: () => void }) {
  const particles = useMemo(
    () =>
      Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: rnd(0, 100),
        delay: rnd(0, 0.7),
        size: rnd(24, 44),
      })),
    []
  );

  useEffect(() => {
    const t = setTimeout(onDone, 3600);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className="pointer-events-none fixed inset-0 z-[99] overflow-hidden">
      {/* White flash */}
      <motion.div
        className="absolute inset-0 bg-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.55, 0] }}
        transition={{ duration: 0.4 }}
      />
      {/* Screen shake wrapper */}
      <motion.div
        className="absolute inset-0"
        animate={{ x: [0, -12, 12, -8, 8, -4, 4, -2, 2, 0] }}
        transition={{ duration: 0.55, delay: 0.05 }}
      >
        {particles.map((p) => (
          <motion.span
            key={p.id}
            className="absolute select-none leading-none"
            style={{ left: `${p.x}%`, top: 0, fontSize: p.size }}
            initial={{ y: -60, opacity: 0, rotate: 0 }}
            animate={{ y: "108vh", opacity: [0, 1, 1, 0], rotate: 360 }}
            transition={{
              duration: rnd(2, 3),
              delay: p.delay,
              ease: "linear",
            }}
          >
            💀
          </motion.span>
        ))}
      </motion.div>
    </div>
  );
}

/* ─── Public overlay ─────────────────────────────────────────── */
interface ChatAnimationOverlayProps {
  type: AnimationType;
  onComplete: () => void;
}

export function ChatAnimationOverlay({
  type,
  onComplete,
}: ChatAnimationOverlayProps) {
  if (!type) return null;
  if (type === "lol") return <LolRain onDone={onComplete} />;
  if (type === "celebrate") return <Celebrate onDone={onComplete} />;
  if (type === "love") return <FloatingHearts onDone={onComplete} />;
  return <SkullRain onDone={onComplete} />;
}

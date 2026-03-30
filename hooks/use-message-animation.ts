import { useEffect, useRef, useState } from "react";

export type AnimationType = "lol" | "celebrate" | "love" | "dead" | null;

const TRIGGERS: Array<{ type: AnimationType; pattern: RegExp }> = [
  { type: "lol",       pattern: /lol|lmao|haha|😂|🤣/i },
  { type: "celebrate", pattern: /🎉|🎊|congrats|congratulations|yay/i },
  { type: "love",      pattern: /❤️|🩷|💕|💖|love you|ily/i },
  { type: "dead",      pattern: /💀|ded|\bim dead\b|i'm dead/i },
];

export function useMessageAnimation(
  messages: Array<{ content: string }> | undefined
) {
  const [state, setState] = useState<{ type: AnimationType; key: number }>({
    type: null,
    key: 0,
  });
  const initializedRef = useRef(false);
  const prevLengthRef = useRef(0);

  useEffect(() => {
    if (!messages) return;
    const len = messages.length;

    // Skip initial load — just record the baseline count
    if (!initializedRef.current) {
      initializedRef.current = true;
      prevLengthRef.current = len;
      return;
    }

    if (len <= prevLengthRef.current) return;
    prevLengthRef.current = len;

    const latest = messages[len - 1];
    for (const { type, pattern } of TRIGGERS) {
      if (pattern.test(latest.content)) {
        setState((prev) => ({ type, key: prev.key + 1 }));
        return;
      }
    }
  }, [messages]);

  return {
    animationType: state.type,
    animationKey: state.key,
    clearAnimation: () => setState((prev) => ({ type: null, key: prev.key })),
  };
}

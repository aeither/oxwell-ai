'use client';

import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

export interface TextScrambleProps {
  children: string;
  className?: string;
  duration?: number;
  characterSet?: string;
  scrambleSpeed?: number;
}

export function TextScramble({
  children,
  className,
  duration = 2,
  characterSet = "!<>-_\\/[]{}—=+*^?#",
  scrambleSpeed = 50,
}: TextScrambleProps) {
  const [displayText, setDisplayText] = useState(children);
  const [isScrambling, setIsScrambling] = useState(false);
  const frameRef = useRef(0);
  const startTimeRef = useRef(0);

  useEffect(() => {
    let currentText = displayText;
    const finalText = children;
    const chars = characterSet.split("");

    const update = () => {
      const now = Date.now();
      const progress = Math.min(1, (now - startTimeRef.current) / (duration * 1000));

      if (progress === 1) {
        setDisplayText(finalText);
        setIsScrambling(false);
        return;
      }

      let newText = "";
      for (let i = 0; i < finalText.length; i++) {
        if (i < progress * finalText.length) {
          newText += finalText[i];
        } else if (finalText[i] === " ") {
          newText += " ";
        } else {
          newText += chars[Math.floor(Math.random() * chars.length)];
        }
      }

      setDisplayText(newText);
      frameRef.current = requestAnimationFrame(update);
    };

    if (isScrambling) {
      frameRef.current = requestAnimationFrame(update);
    }

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [children, characterSet, duration, isScrambling, displayText]);

  useEffect(() => {
    setIsScrambling(true);
    startTimeRef.current = Date.now();
  }, [children]);

  return <span className={cn(className)}>{displayText}</span>;
}

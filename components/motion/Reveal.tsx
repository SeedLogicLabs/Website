"use client";

import { LazyMotion, MotionConfig, domAnimation, m } from "motion/react";
import type { ReactNode } from "react";

/**
 * Fade-and-rise a block into view once, when it scrolls into the viewport.
 * Pass server-rendered content as `children`. Only use below the fold; the
 * hero uses CSS-only animation so LCP is not gated on hydration.
 *
 * Robustness: the server HTML carries the hidden initial style, so two
 * fallbacks in globals.css / layout.tsx force `[data-reveal]` visible when
 * the user prefers reduced motion or JavaScript is unavailable. Props are
 * identical on server and client, so there is no hydration mismatch.
 */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        <m.div
          data-reveal
          className={className}
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
        >
          {children}
        </m.div>
      </MotionConfig>
    </LazyMotion>
  );
}

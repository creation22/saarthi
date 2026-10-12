import { useRef } from 'react';
import { useInView } from 'framer-motion';

/** The page's one easing curve for things arriving: quick start, long settle. */
export const EASE = [0.22, 1, 0.36, 1];

/**
 * True from the first time the element is on screen. Demos and drawings put it
 * on their root as .is-live and let the stylesheet run the sequence.
 */
export function useLive(amount = 0.35) {
  const ref = useRef(null);
  const live = useInView(ref, { once: true, amount });
  return [ref, live];
}

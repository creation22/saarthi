/**
 * LegalSahayak — Premium SVG Icon Library
 * All icons use currentColor and accept size/className props.
 * Animated variants use Framer Motion path-draw or spring effects.
 */
import { motion } from 'framer-motion';

/* ─── Draw-in animation preset ──────────────────────────────────── */
const drawIn = {
  hidden:  { pathLength: 0, opacity: 0 },
  visible: (delay = 0) => ({
    pathLength: 1, opacity: 1,
    transition: { pathLength: { delay, type: 'spring', duration: 1.2, bounce: 0 }, opacity: { delay, duration: 0.01 } },
  }),
};

/* ─── Scales of Justice (brand icon, animated draw-in) ─────────── */
export function ScalesIcon({ size = 24, color = 'currentColor', animated = false, className = '', ...p }) {
  const M = animated ? motion.path : 'path';
  const props = (d, delay = 0) => animated
    ? { d, stroke: color, fill: 'none', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round',
        initial: 'hidden', animate: 'visible', custom: delay, variants: drawIn }
    : { d, stroke: color, fill: 'none', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round' };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden {...p}>
      <M {...props('M12 3v18', 0)} />
      <M {...props('M8 21h8', 0.05)} />
      <M {...props('M3 7h4', 0.1)} /><M {...props('M17 7h4', 0.15)} />
      <M {...props('M3 7l2 5c0 1.1 1.8 2 4 2s4-.9 4-2l2-5', 0.2)} />
      <M {...props('M17 7l2 5c0 1.1 1.8 2 4 2s4-.9 4-2l2-5', 0.3)} />
    </svg>
  );
}

/* ─── Book / Citation ───────────────────────────────────────────── */
export function BookOpenIcon({ size = 14, color = 'currentColor', className = '', ...p }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden {...p}>
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

/* ─── Speaker icons ─────────────────────────────────────────────── */
export function SpeakerIcon({ size = 14, color = 'currentColor', className = '', ...p }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden {...p}>
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" stroke={color} strokeWidth="1.6" strokeLinecap="round"/>
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" stroke={color} strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  );
}
export function SpeakerLoadingIcon({ size = 14, color = 'currentColor', className = '', ...p }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden {...p}>
      <motion.circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.6" strokeLinecap="round"
        strokeDasharray="14 42" animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        style={{ transformOrigin: '50% 50%' }}
      />
      <path d="M12 8v4l2.5 2.5" stroke={color} strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  );
}
export function SpeakerPlayingIcon({ size = 14, color = 'currentColor', className = '', ...p }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden {...p}>
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      <motion.path d="M15.54 8.46a5 5 0 0 1 0 7.07" stroke={color} strokeWidth="1.6" strokeLinecap="round"
        animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.2, repeat: Infinity }}
      />
      <motion.path d="M19.07 4.93a10 10 0 0 1 0 14.14" stroke={color} strokeWidth="1.6" strokeLinecap="round"
        animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.2, repeat: Infinity }}
      />
    </svg>
  );
}

/* ─── Thumb Up / Down ───────────────────────────────────────────── */
export function ThumbUpIcon({ size = 13, color = 'currentColor', className = '', ...p }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden {...p}>
      <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
export function ThumbDownIcon({ size = 13, color = 'currentColor', className = '', ...p }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden {...p}>
      <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3H10z" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M17 2h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

/* ─── Mic / Stop ────────────────────────────────────────────────── */
export function MicIcon({ size = 16, color = 'currentColor', className = '', ...p }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden {...p}>
      <rect x="9" y="2" width="6" height="11" rx="3" stroke={color} strokeWidth="1.6"/>
      <path d="M5 10a7 7 0 0 0 14 0" stroke={color} strokeWidth="1.6" strokeLinecap="round"/>
      <path d="M12 21v-4" stroke={color} strokeWidth="1.6" strokeLinecap="round"/>
      <path d="M9 21h6" stroke={color} strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  );
}
export function StopIcon({ size = 16, color = 'currentColor', className = '', ...p }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden {...p}>
      <rect x="4" y="4" width="16" height="16" rx="2" stroke={color} strokeWidth="1.6" fill={color} fillOpacity="0.15"/>
    </svg>
  );
}

/* ─── Send arrow ────────────────────────────────────────────────── */
export function SendIcon({ size = 15, color = 'currentColor', className = '', ...p }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden {...p}>
      <path d="M22 2L11 13" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M22 2L15 22l-4-9-9-4 20-7z" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

/* ─── Spinner ───────────────────────────────────────────────────── */
export function SpinnerIcon({ size = 14, color = 'currentColor', className = '', ...p }) {
  return (
    <motion.svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}
      animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }} aria-hidden {...p}>
      <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="2" strokeOpacity="0.2"/>
      <path d="M12 3a9 9 0 0 1 9 9" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    </motion.svg>
  );
}

/* ─── Navigation / Topic icons ──────────────────────────────────── */
export function HouseIcon({ size = 14, color = 'currentColor', className = '', ...p }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden {...p}>
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9 21V12h6v9" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
export function ShoppingBagIcon({ size = 14, color = 'currentColor', className = '', ...p }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden {...p}>
      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="3" y1="6" x2="21" y2="6" stroke={color} strokeWidth="1.6" strokeLinecap="round"/>
      <path d="M16 10a4 4 0 0 1-8 0" stroke={color} strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  );
}
export function GavelIcon({ size = 14, color = 'currentColor', className = '', ...p }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden {...p}>
      <path d="M14.5 2.5l7 7-3 3-7-7 3-3z" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M2.5 21.5l9-9" stroke={color} strokeWidth="1.6" strokeLinecap="round"/>
      <path d="M8.5 8.5l-3 3 7 7 3-3" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M3 21h5" stroke={color} strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  );
}
export function ClipboardIcon({ size = 14, color = 'currentColor', className = '', ...p }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden {...p}>
      <rect x="8" y="2" width="8" height="4" rx="1" stroke={color} strokeWidth="1.6"/>
      <path d="M8 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2h-2" stroke={color} strokeWidth="1.6" strokeLinecap="round"/>
      <path d="M9 12h6M9 16h4" stroke={color} strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  );
}
export function ScrollIcon({ size = 14, color = 'currentColor', className = '', ...p }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden {...p}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M14 2v6h6" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9 13h6M9 17h4" stroke={color} strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  );
}
export function SearchIcon({ size = 14, color = 'currentColor', className = '', ...p }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden {...p}>
      <circle cx="11" cy="11" r="8" stroke={color} strokeWidth="1.6"/>
      <path d="m21 21-4.35-4.35" stroke={color} strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  );
}
export function FolderIcon({ size = 14, color = 'currentColor', className = '', ...p }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden {...p}>
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2v11z" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
export function DocumentIcon({ size = 14, color = 'currentColor', className = '', ...p }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden {...p}>
      <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9l-7-7z" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M13 2v7h7" stroke={color} strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  );
}

/* ─── Location pin ──────────────────────────────────────────────── */
export function LocationPinIcon({ size = 11, color = 'currentColor', className = '', ...p }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden {...p}>
      <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="12" cy="10" r="3" stroke={color} strokeWidth="1.8"/>
    </svg>
  );
}

/* ─── Chevrons ──────────────────────────────────────────────────── */
export function ChevronDownIcon({ size = 10, color = 'currentColor', className = '', ...p }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden {...p}>
      <polyline points="6 9 12 15 18 9" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
export function ChevronUpIcon({ size = 10, color = 'currentColor', className = '', ...p }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden {...p}>
      <polyline points="18 15 12 9 6 15" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

/* ─── Arrow right ───────────────────────────────────────────────── */
export function ArrowRightIcon({ size = 10, color = 'currentColor', className = '', ...p }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden {...p}>
      <path d="M5 12h14" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <path d="m12 5 7 7-7 7" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

/* ─── External link ─────────────────────────────────────────────── */
export function ExternalLinkIcon({ size = 10, color = 'currentColor', className = '', ...p }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden {...p}>
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      <polyline points="15 3 21 3 21 9" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="10" y1="14" x2="21" y2="3" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  );
}

/* ─── Plus / New chat ───────────────────────────────────────────── */
export function PlusIcon({ size = 13, color = 'currentColor', className = '', ...p }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden {...p}>
      <path d="M12 5v14M5 12h14" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

/* ─── Case tracker (scales variant) ─────────────────────────────── */
export function CaseIcon({ size = 14, color = 'currentColor', className = '', ...p }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden {...p}>
      <rect x="2" y="7" width="20" height="14" rx="2" stroke={color} strokeWidth="1.6"/>
      <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" stroke={color} strokeWidth="1.6" strokeLinecap="round"/>
      <line x1="12" y1="12" x2="12" y2="16" stroke={color} strokeWidth="1.6" strokeLinecap="round"/>
      <line x1="10" y1="14" x2="14" y2="14" stroke={color} strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  );
}

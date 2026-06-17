import React, { useRef } from 'react';
import { useScroll, useTransform, motion } from 'framer-motion';

export function ContainerScroll({ titleComponent, children }) {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const scaleDimensions = () => (isMobile ? [0.7, 0.9] : [1.05, 1]);
  const rotate    = useTransform(scrollYProgress, [0, 1], [20, 0]);
  const scale     = useTransform(scrollYProgress, [0, 1], scaleDimensions());
  const translate = useTransform(scrollYProgress, [0, 1], [0, -100]);

  return (
    <div
      ref={containerRef}
      className="relative flex items-start justify-center"
      style={{ height: isMobile ? '60rem' : '80rem', padding: isMobile ? '0.5rem' : '5rem' }}
    >
      <div className="relative w-full" style={{ perspective: '1000px', paddingTop: isMobile ? '2.5rem' : '10rem', paddingBottom: isMobile ? '2.5rem' : '10rem' }}>
        <Header translate={translate} titleComponent={titleComponent} />
        <Card rotate={rotate} translate={translate} scale={scale}>
          {children}
        </Card>
      </div>
    </div>
  );
}

function Header({ translate, titleComponent }) {
  return (
    <motion.div
      style={{ translateY: translate }}
      className="mx-auto max-w-5xl text-center"
    >
      {titleComponent}
    </motion.div>
  );
}

function Card({ rotate, scale, children }) {
  return (
    <motion.div
      className="mx-auto w-full"
      style={{
        rotateX: rotate,
        scale,
        maxWidth: '72rem',
        marginTop: '-3rem',
        border: '4px solid #3a3028',
        padding: '0.5rem',
        background: '#1a1410',
        borderRadius: '1.875rem',
        boxShadow:
          '0 0 #0000004d, 0 9px 20px #0000004a, 0 37px 37px #00000042, 0 84px 50px #00000026, 0 149px 60px #0000000a, 0 233px 65px #00000003',
      }}
    >
      <div style={{ height: '100%', width: '100%', overflow: 'hidden', borderRadius: '1.5rem', background: '#0f0b08' }}>
        {children}
      </div>
    </motion.div>
  );
}

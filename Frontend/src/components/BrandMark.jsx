/** Consistent product name: MySaarthi */
export function BrandMark({ saffron = 'var(--color-saffron)', className, style }) {
  return (
    <span className={className} style={style}>
      My<span style={{ color: saffron }}>Saarthi</span>
    </span>
  );
}

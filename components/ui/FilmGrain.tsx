/** Fixed, full-screen animated film grain. Pure CSS, ignores pointer events. */
export function FilmGrain() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[60] overflow-hidden opacity-[0.07] mix-blend-overlay">
      <div className="grain absolute -inset-[10%]" />
    </div>
  );
}

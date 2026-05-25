export default function AnimatedBackground({ hideTopGlow = false }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="absolute inset-0 game-gradient-bg" />
      <div className="bg-blob bg-blob-1 absolute -left-20 top-24 size-64 rounded-full bg-emerald-300/35 blur-2xl" />
      <div className="bg-blob bg-blob-2 absolute -right-16 bottom-32 size-72 rounded-full bg-sky-300/40 blur-2xl" />
      {!hideTopGlow && (
        <div className="bg-blob bg-blob-3 absolute left-1/3 top-8 size-48 rounded-full bg-amber-200/45 blur-xl" />
      )}
    </div>
  );
}

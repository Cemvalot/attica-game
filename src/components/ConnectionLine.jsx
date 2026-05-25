import { useMemo } from 'react';

const STROKES = {
  idle: { color: '#0284c7', glow: 'rgba(14, 165, 233, 0.65)' },
  correct: { color: '#16a34a', glow: 'rgba(34, 197, 94, 0.85)' },
  wrong: { color: '#e11d48', glow: 'rgba(244, 63, 94, 0.65)' },
};

const OUTLINE_WIDTH = 14;
const LINE_WIDTH = 8;

export default function ConnectionLine({ x1, y1, x2, y2, status = 'idle' }) {
  const path = useMemo(() => {
    const midY = (y1 + y2) / 2;
    return `M ${x1} ${y1} C ${x1} ${midY}, ${x2} ${midY}, ${x2} ${y2}`;
  }, [x1, y1, x2, y2]);

  const { color, glow } = STROKES[status] ?? STROKES.idle;
  const isWrong = status === 'wrong';

  return (
    <g className="connection-line-group">
      <path
        d={path}
        fill="none"
        stroke="#ffffff"
        strokeWidth={OUTLINE_WIDTH}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={0.95}
      />
      <path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth={LINE_WIDTH}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={isWrong ? '14 10' : undefined}
        style={{ filter: `drop-shadow(0 0 6px ${glow})` }}
      />
    </g>
  );
}

export function ConnectionOverlay({ lines, width, height }) {
  if (!width || !height) return null;

  return (
    <svg
      className="pointer-events-none absolute inset-0 z-[8] h-full w-full overflow-visible"
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {lines.map((line) => (
        <ConnectionLine key={line.id} {...line} />
      ))}
    </svg>
  );
}

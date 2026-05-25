import { useCallback, useEffect, useState } from 'react';

/** Map screen pixels (after CSS transform scale) → layout coords inside container */
function getLayoutScale(container) {
  const rect = container.getBoundingClientRect();
  if (!rect.width || !container.offsetWidth) return 1;
  return container.offsetWidth / rect.width;
}

function pointInContainer(container, el, anchor) {
  const scale = getLayoutScale(container);
  const cRect = container.getBoundingClientRect();
  const eRect = el.getBoundingClientRect();
  const cx = (eRect.left + eRect.width / 2 - cRect.left) * scale;
  if (anchor === 'bottom') {
    return { x: cx, y: (eRect.bottom - cRect.top) * scale };
  }
  return { x: cx, y: (eRect.top - cRect.top) * scale };
}

export function useConnectionLines(containerRef, connections, sdgRefs, actionRefs) {
  const [lines, setLines] = useState([]);
  const [size, setSize] = useState({ width: 0, height: 0 });

  const measure = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    setSize({ width: container.offsetWidth, height: container.offsetHeight });

    const next = connections
      .map((conn) => {
        const sdgEl = sdgRefs.current[conn.sdgId];
        const actEl = actionRefs.current[conn.actionId];
        if (!sdgEl || !actEl) return null;

        const start = pointInContainer(container, sdgEl, 'bottom');
        const end = pointInContainer(container, actEl, 'top');
        return {
          id: `${conn.sdgId}-${conn.actionId}`,
          x1: start.x,
          y1: start.y,
          x2: end.x,
          y2: end.y,
          status: conn.status || 'idle',
        };
      })
      .filter(Boolean);

    setLines(next);
  }, [connections, containerRef, sdgRefs, actionRefs]);

  useEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    const container = containerRef.current;
    if (container) {
      ro.observe(container);
      Object.values(sdgRefs.current).forEach((el) => el && ro.observe(el));
      Object.values(actionRefs.current).forEach((el) => el && ro.observe(el));
    }
    window.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [measure, containerRef, connections, sdgRefs, actionRefs]);

  return { lines, size, remeasure: measure };
}

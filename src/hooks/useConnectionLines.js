import { useCallback, useEffect, useState } from 'react';

/** Position relative to container using layout offsets (works with CSS zoom). */
function pointInContainer(container, el, anchor) {
  if (!container || !el || !container.contains(el)) return null;

  let top = 0;
  let left = 0;
  let node = el;

  while (node && node !== container) {
    top += node.offsetTop;
    left += node.offsetLeft;
    node = node.offsetParent;
  }

  if (node !== container) {
    const cRect = container.getBoundingClientRect();
    const eRect = el.getBoundingClientRect();
    if (!cRect.width || !cRect.height) return null;
    const scaleX = container.offsetWidth / cRect.width;
    const scaleY = container.offsetHeight / cRect.height;
    const x = (eRect.left + eRect.width / 2 - cRect.left) * scaleX;
    const y =
      anchor === 'bottom'
        ? (eRect.bottom - cRect.top) * scaleY
        : (eRect.top - cRect.top) * scaleY;
    return { x, y };
  }

  const x = left + el.offsetWidth / 2;
  const y = anchor === 'bottom' ? top + el.offsetHeight : top;
  return { x, y };
}

export function useConnectionLines(containerRef, connections, sdgRefs, actionRefs) {
  const [lines, setLines] = useState([]);
  const [size, setSize] = useState({ width: 0, height: 0 });

  const measure = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.offsetWidth;
    const height = container.offsetHeight;
    if (!width || !height) return;

    setSize({ width, height });

    const next = connections
      .map((conn) => {
        const sdgEl = sdgRefs.current[conn.sdgId];
        const actEl = actionRefs.current[conn.actionId];
        if (!sdgEl || !actEl) return null;

        const start = pointInContainer(container, sdgEl, 'bottom');
        const end = pointInContainer(container, actEl, 'top');
        if (!start || !end) return null;

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

    const ro = new ResizeObserver(() => measure());
    const container = containerRef.current;

    if (container) {
      ro.observe(container);
    }

    const observeRefs = () => {
      Object.values(sdgRefs.current).forEach((el) => el && ro.observe(el));
      Object.values(actionRefs.current).forEach((el) => el && ro.observe(el));
    };

    observeRefs();
    const t = requestAnimationFrame(observeRefs);

    window.addEventListener('resize', measure);
    return () => {
      cancelAnimationFrame(t);
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [measure, containerRef, connections]);

  return { lines, size, remeasure: measure };
}

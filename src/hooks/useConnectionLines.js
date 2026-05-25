import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

/** Position relative to board using layout offsets (works with CSS zoom). */
function pointInBoard(board, el, anchor) {
  if (!board || !el) return null;

  let top = 0;
  let left = 0;
  let node = el;

  while (node && node !== board) {
    top += node.offsetTop;
    left += node.offsetLeft;
    node = node.offsetParent;
  }

  if (node === board) {
    const x = left + el.offsetWidth / 2;
    const y = anchor === 'bottom' ? top + el.offsetHeight : top;
    return { x, y };
  }

  const bRect = board.getBoundingClientRect();
  const eRect = el.getBoundingClientRect();
  const bw = board.clientWidth;
  const bh = board.clientHeight;

  if (!bRect.width || !bRect.height || bw < 1 || bh < 1) return null;

  const sx = bw / bRect.width;
  const sy = bh / bRect.height;

  return {
    x: (eRect.left + eRect.width / 2 - bRect.left) * sx,
    y:
      anchor === 'bottom'
        ? (eRect.bottom - bRect.top) * sy
        : (eRect.top - bRect.top) * sy,
  };
}

export function useConnectionLines(boardRef, connections) {
  const [lines, setLines] = useState([]);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const measureRaf = useRef(null);

  const measureNow = useCallback(() => {
    const board = boardRef.current;
    if (!board) return;

    const width = board.offsetWidth || board.clientWidth;
    const height = board.offsetHeight || board.clientHeight;
    if (width < 1 || height < 1) return;

    setSize({ width, height });

    const next = connections
      .map((conn) => {
        const topEl = board.querySelector(`[data-connect-top="${conn.sdgId}"]`);
        const bottomEl = board.querySelector(`[data-connect-bottom="${conn.actionId}"]`);
        if (!topEl || !bottomEl) return null;

        const start = pointInBoard(board, topEl, 'bottom');
        const end = pointInBoard(board, bottomEl, 'top');
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
  }, [connections, boardRef]);

  const scheduleMeasure = useCallback(() => {
    if (measureRaf.current != null) {
      cancelAnimationFrame(measureRaf.current);
    }
    measureRaf.current = requestAnimationFrame(() => {
      measureRaf.current = null;
      measureNow();
    });
  }, [measureNow]);

  useLayoutEffect(() => {
    measureNow();
  }, [measureNow]);

  useEffect(() => {
    measureNow();

    const board = boardRef.current;
    if (!board) return undefined;

    const ro = new ResizeObserver(() => scheduleMeasure());
    ro.observe(board);

    const observeCards = () => {
      board.querySelectorAll('[data-connect-top], [data-connect-bottom]').forEach((el) => {
        ro.observe(el);
      });
    };
    observeCards();
    const id = requestAnimationFrame(observeCards);

    window.addEventListener('resize', scheduleMeasure);
    return () => {
      cancelAnimationFrame(id);
      if (measureRaf.current != null) {
        cancelAnimationFrame(measureRaf.current);
        measureRaf.current = null;
      }
      ro.disconnect();
      window.removeEventListener('resize', scheduleMeasure);
    };
  }, [measureNow, scheduleMeasure, boardRef, connections.length]);

  return { lines, size, measureNow, scheduleMeasure };
}

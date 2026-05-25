import { useCallback, useEffect, useMemo, useState } from 'react';
import { KIOSK_HEIGHT, KIOSK_WIDTH } from '../constants/kiosk';

const MAX_SCALE = 2.75;

const ZOOM_SUPPORTED =
  typeof CSS !== 'undefined' && CSS.supports?.('zoom', '1') === true;

function computeScale() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  return Math.min(w / KIOSK_WIDTH, h / KIOSK_HEIGHT, MAX_SCALE);
}

/**
 * 768×1024 design canvas fitted to viewport (tablet / TV).
 * Uses `zoom` when available for sharper text than transform: scale().
 */
export default function KioskViewport({ children }) {
  const [scale, setScale] = useState(computeScale);

  const updateScale = useCallback(() => {
    setScale(computeScale());
  }, []);

  useEffect(() => {
    updateScale();
    window.addEventListener('resize', updateScale);
    window.visualViewport?.addEventListener('resize', updateScale);
    return () => {
      window.removeEventListener('resize', updateScale);
      window.visualViewport?.removeEventListener('resize', updateScale);
    };
  }, [updateScale]);

  const shellW = Math.round(KIOSK_WIDTH * scale);
  const shellH = Math.round(KIOSK_HEIGHT * scale);

  const innerStyle = useMemo(() => {
    const base = {
      width: KIOSK_WIDTH,
      height: KIOSK_HEIGHT,
    };
    if (ZOOM_SUPPORTED) {
      return { ...base, zoom: scale };
    }
    return {
      ...base,
      transform: `scale(${scale})`,
      transformOrigin: 'top left',
    };
  }, [scale]);

  return (
    <div className="kiosk-root">
      <div className="kiosk-shell" style={{ width: shellW, height: shellH }}>
        <div className="kiosk-inner" style={innerStyle}>
          {children}
        </div>
      </div>
    </div>
  );
}

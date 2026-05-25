import { useEffect, useCallback, useRef } from 'react';

const EVENTS = ['mousedown', 'touchstart', 'keydown', 'click', 'pointerdown'];

export function useInactivity(onInactive, timeoutMs = 60000) {
  const timerRef = useRef(null);
  const onInactiveRef = useRef(onInactive);

  useEffect(() => {
    onInactiveRef.current = onInactive;
  }, [onInactive]);

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => onInactiveRef.current?.(), timeoutMs);
  }, [timeoutMs]);

  useEffect(() => {
    resetTimer();
    const handler = () => resetTimer();
    EVENTS.forEach((e) => window.addEventListener(e, handler, { passive: true }));
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      EVENTS.forEach((e) => window.removeEventListener(e, handler));
    };
  }, [resetTimer]);
}

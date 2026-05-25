import { useEffect, useCallback, useRef } from 'react';

const EVENTS = ['mousedown', 'touchstart', 'keydown', 'click', 'pointerdown'];

/**
 * Two-phase kiosk inactivity: idleMs → onWarning, then graceMs → onInactive.
 * Any user activity clears both timers and calls onActivity.
 */
export function useInactivity({
  onWarning,
  onInactive,
  onActivity,
  idleMs = 60000,
  graceMs = 15000,
}) {
  const idleTimerRef = useRef(null);
  const graceTimerRef = useRef(null);
  const onWarningRef = useRef(onWarning);
  const onInactiveRef = useRef(onInactive);
  const onActivityRef = useRef(onActivity);

  useEffect(() => {
    onWarningRef.current = onWarning;
    onInactiveRef.current = onInactive;
    onActivityRef.current = onActivity;
  }, [onWarning, onInactive, onActivity]);

  const clearTimers = useCallback(() => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    if (graceTimerRef.current) clearTimeout(graceTimerRef.current);
    idleTimerRef.current = null;
    graceTimerRef.current = null;
  }, []);

  const startGraceTimer = useCallback(() => {
    if (graceTimerRef.current) clearTimeout(graceTimerRef.current);
    graceTimerRef.current = setTimeout(() => {
      graceTimerRef.current = null;
      onInactiveRef.current?.();
    }, graceMs);
  }, [graceMs]);

  const startIdleTimer = useCallback(() => {
    clearTimers();
    idleTimerRef.current = setTimeout(() => {
      idleTimerRef.current = null;
      onWarningRef.current?.();
      startGraceTimer();
    }, idleMs);
  }, [idleMs, clearTimers, startGraceTimer]);

  const registerActivity = useCallback(() => {
    onActivityRef.current?.();
    startIdleTimer();
  }, [startIdleTimer]);

  useEffect(() => {
    startIdleTimer();
    const handler = () => registerActivity();
    EVENTS.forEach((e) => window.addEventListener(e, handler, { passive: true }));
    return () => {
      clearTimers();
      EVENTS.forEach((e) => window.removeEventListener(e, handler));
    };
  }, [startIdleTimer, registerActivity, clearTimers]);

  return { registerActivity, dismissWarning: registerActivity };
}

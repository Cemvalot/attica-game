import { useCallback, useRef, useState } from 'react';

export function useGameExit(onExit) {
  const [gameEnded, setGameEnded] = useState(false);
  const exitedRef = useRef(false);

  const endCurrentGame = useCallback(
    (result) => {
      if (exitedRef.current) return;
      exitedRef.current = true;
      setGameEnded(true);
      onExit(result);
    },
    [onExit]
  );

  return { endCurrentGame, gameEnded };
}

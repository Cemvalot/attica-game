import { Home } from 'lucide-react';
import { Button } from './ui/button';

export default function GameHeader({ title, onHome, right }) {
  return (
    <header className="flex shrink-0 items-center gap-2">
      <Button variant="icon" size="icon" onClick={onHome} aria-label="Αρχική">
        <Home className="size-5" />
      </Button>
      <h2 className="flex-1 text-center font-display text-lg font-extrabold leading-tight text-emerald-900 md:text-xl">
        {title}
      </h2>
      {right ? <div className="flex items-center gap-2">{right}</div> : <div className="size-10 shrink-0" />}
    </header>
  );
}

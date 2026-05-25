import { INSTRUCTIONS } from '../data/games';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';

export default function InstructionsModal({ open, onClose }) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-h-[85svh]">
        <DialogHeader>
          <DialogTitle>Οδηγίες παιχνιδιού</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pr-2">
          {INSTRUCTIONS.map((section, i) => (
            <div
              key={section.title}
              className="rounded-2xl border-2 border-emerald-100 bg-white/80 p-4 shadow-md"
            >
              <h3 className="font-display text-lg font-bold text-sky-700">{section.title}</h3>
              <ul className="mt-2 space-y-1.5 text-left text-base font-semibold text-emerald-800/90">
                {section.lines.map((line) => (
                  <li key={line} className="flex gap-2">
                    <span className="text-emerald-500">★</span>
                    {line}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <Button size="lg" className="w-full" onClick={onClose}>
          Κατάλαβα!
        </Button>
      </DialogContent>
    </Dialog>
  );
}

interface DodoMascotProps {
  className?: string;
  size?: number;
  mood?: 'checklist' | 'sleeping' | 'idea' | 'running' | 'standing';
}

const MASCOT_IMAGES: Record<string, string> = {
  checklist: '/assets/mascot/hero_dodo.png',
  sleeping: '/assets/mascot/sleeping_dodo.png',
  idea: '/assets/mascot/idea_dodo.png',
  running: '/assets/mascot/running_dodo.png',
  standing: '/assets/mascot/standing_dodo.png',
};

export const DodoMascot = ({
  className = '',
  size = 120,
  mood = 'checklist',
}: DodoMascotProps) => {
  const imageSrc = MASCOT_IMAGES[mood] || MASCOT_IMAGES.checklist;

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none pointer-events-none transition-transform duration-300 ease-out hover:scale-105 ${className}`}
      style={{ width: size, height: 'auto' }}
    >
      <img
        src={imageSrc}
        alt={`DO-do mascot (${mood})`}
        className="w-full h-auto object-contain drop-shadow-[0_8px_16px_rgba(15,56,36,0.18)]"
        draggable={false}
      />
    </div>
  );
};

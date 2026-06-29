interface StageNavProps {
  currentIndex: number;
  total: number;
  stageTitle: string;
  onOpenDirectory: () => void;
}

export default function StageNav({
  currentIndex,
  total,
  stageTitle,
  onOpenDirectory,
}: StageNavProps) {

  return (
    <nav className="stage-nav" role="navigation" aria-label="Navigation">
      <div className="stage-nav-inner">
        <button
          className="nav-btn-center"
          onClick={onOpenDirectory}
          aria-label="Open Directory"
        >
          <span className="nav-phase-label">
            {String(currentIndex + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </span>
          <span className="nav-stage-title">{stageTitle}</span>
        </button>
      </div>
    </nav>
  );
}

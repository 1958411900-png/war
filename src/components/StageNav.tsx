interface StageNavProps {
  currentIndex: number;
  total: number;
  stageTitle: string;
  onPrev: () => void;
  onNext: () => void;
  onOpenDirectory: () => void;
}

export default function StageNav({
  currentIndex,
  total,
  stageTitle,
  onPrev,
  onNext,
  onOpenDirectory,
}: StageNavProps) {
  const isLast = currentIndex >= total - 1;

  return (
    <nav className="stage-nav" role="navigation" aria-label="Navigation">
      <div className="stage-nav-inner">
        <button
          className="nav-btn nav-btn-prev"
          onClick={onPrev}
          disabled={currentIndex <= 0}
          aria-label="Previous Stage"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
          <span className="nav-btn-label">PREV</span>
        </button>

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

        <button
          className="nav-btn nav-btn-next"
          onClick={onNext}
          disabled={currentIndex < 0 || isLast}
          aria-label={isLast ? 'Go to Current Situation' : 'Next Stage'}
        >
          <span className="nav-btn-label">{isLast ? 'SITUATION' : 'NEXT'}</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </button>
      </div>
    </nav>
  );
}

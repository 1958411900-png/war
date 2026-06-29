interface FixedHeaderProps {
  currentStage: number;
  totalStages: number;
  stageTitle: string;
  onOpenDirectory: () => void;
}

export default function FixedHeader({
  currentStage,
  totalStages,
  stageTitle,
  onOpenDirectory,
}: FixedHeaderProps) {
  const progress = ((currentStage + 1) / totalStages) * 100;

  return (
    <header className="fixed-header" role="banner">
      <div className="fixed-header-inner">
        <div className="stage-dots" role="navigation" aria-label="Stage Navigation">
          {Array.from({ length: totalStages }).map((_, i) => (
            <button
              key={i}
              className={`stage-dot ${i === currentStage ? 'active' : ''}`}
              onClick={() => {
                const el = document.getElementById(`stage-${i + 1}`);
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              aria-label={`到进第${i + 1}阶段`}
              aria-current={i === currentStage ? 'true' : undefined}
            />
          ))}
        </div>
        <span className="fixed-header-phase" aria-label={`Stage ${currentStage + 1}`}>
          PHASE {String(currentStage + 1).padStart(2, '0')}
        </span>
      </div>
      <div
        className="progress-bar"
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Reading Progress"
      >
        <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
      </div>
    </header>
  );
}

import { useRef, useEffect } from 'react';
import type { TimelineStage } from '../data/timelineData';
import KeywordTags from './KeywordTags';
import ImageGallery from './ImageGallery';
import TimelineList from './TimelineList';
import SituationSection from './SituationSection';

interface StagePanelProps {
  stage: TimelineStage;
  index: number;
  isActive: boolean;
  slideDirection: 'left' | 'right' | null;
  onOpenDetail: () => void;
  onOpenImage: (src: string, alt: string, caption?: string, source?: string) => void;
  isLast: boolean;
  onGoToNext: () => void;
}

export default function StagePanel({
  stage,
  index,
  isActive,
  slideDirection,
  onOpenDetail,
  onOpenImage,
  isLast,
  onGoToNext,
}: StagePanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isActive && panelRef.current) {
      panelRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [isActive]);

  let panelClass = 'stage-panel';
  if (isActive) {
    panelClass += ' active';
  } else if (slideDirection === 'left') {
    panelClass += ' exit-left';
  } else if (slideDirection === 'right') {
    panelClass += ' exit-right';
  }

  const handleBtnClick = () => {
    onGoToNext();
  };

  return (
    <article
      ref={panelRef}
      className={panelClass}
      aria-label={`Stage ${index + 1}: ${stage.title}`}
      id={`stage-${stage.id}`}
    >
      <header className="stage-header">
        <p className="stage-header-phase">
          PHASE {String(index + 1).padStart(2, '0')} / 06
        </p>
        <h2 className="stage-header-title">{stage.title}</h2>
        <p className="stage-header-date">{stage.dateRange}</p>
      </header>

      <p className="stage-summary">{stage.summary}</p>

      <KeywordTags keywords={stage.keywords} />

      <ImageGallery images={stage.images} onOpenImage={onOpenImage} />

      <div className="stage-divider" role="separator">
        <span className="stage-divider-line" />
        <span className="stage-divider-text">TIMELINE</span>
        <span className="stage-divider-line" />
      </div>

      <TimelineList events={stage.events} onOpenImage={onOpenImage} />

      {isLast && <SituationSection />}

      {!isLast && (
        <div className="detail-btn-wrapper">
          <button
            className="detail-btn"
            onClick={handleBtnClick}
            aria-label="View Current Situation"
          >
            <span>查看总体局势</span>
            <span className="detail-btn-icon">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </span>
          </button>
        </div>
      )}
    </article>
  );
}

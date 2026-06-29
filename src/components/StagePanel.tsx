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
  onOpenDetail: () => void;
  onOpenImage: (src: string, alt: string, caption?: string, source?: string) => void;
  isLast: boolean;
  onGoToNext: () => void;
  onGoToSituation: () => void;
}

export default function StagePanel({
  stage,
  index,
  isActive,
  onOpenDetail,
  onOpenImage,
  isLast,
  onGoToNext,
  onGoToSituation,
}: StagePanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  // When this panel becomes active, scroll it into view
  useEffect(() => {
    if (isActive && panelRef.current) {
      panelRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [isActive]);

  return (
    <article
      ref={panelRef}
      className={`stage-panel${isActive ? ' active' : ''}`}
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

      {/* 非最后一阶段：显示 NEXT 按钮 */}
      {!isLast && (
        <div className="detail-btn-wrapper">
          <button
            className="detail-btn"
            onClick={onGoToNext}
            aria-label="进入下一阶段"
          >
            <span>下一阶段</span>
            <span className="detail-btn-icon" aria-hidden="true">
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

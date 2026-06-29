import { useRef } from 'react';
import type { TimelineStage } from '../data/timelineData';
import KeywordTags from './KeywordTags';
import ImageGallery from './ImageGallery';
import TimelineList from './TimelineList';
import SituationSection from './SituationSection';

interface StagePanelProps {
  stage: TimelineStage;
  index: number;
  isActive: boolean;
  isLast: boolean;
  onOpenDetail: () => void;
  onOpenImage: (src: string, alt: string, caption?: string, source?: string) => void;
}

export default function StagePanel({
  stage,
  index,
  isActive,
  isLast,
  onOpenDetail,
  onOpenImage,
}: StagePanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  return (
    <article
      ref={panelRef}
      className={`stage-panel${isActive ? ' active' : ''}`}
      aria-label={`Stage ${index + 1}: ${stage.title}`}
      id={`stage-${stage.id}`}
      data-stage-index={index}
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
    </article>
  );
}

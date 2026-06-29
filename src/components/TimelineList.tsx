import { useState } from 'react';
import type { TimelineEvent } from '../data/timelineData';

interface TimelineEventItemProps {
  event: TimelineEvent;
  index: number;
  onOpenImage?: (src: string, alt: string, caption?: string, source?: string) => void;
}

function TimelineEventItem({ event, index, onOpenImage }: TimelineEventItemProps) {
  const [imgIdx, setImgIdx] = useState(0);
  const imgs = event.image;
  const hasImages = !!imgs && imgs.length > 0;
  const currentImg = hasImages ? imgs[imgIdx] : null;

  return (
    <div className="timeline-event" role="listitem">
      <div className="timeline-line" aria-hidden="true">
        <div className="timeline-dot" />
        <div className="timeline-vertical-line" />
      </div>
      <div className="timeline-content">
        <p className="timeline-date">{event.date}</p>
        <h4 className="timeline-event-title">{event.title}</h4>
        <p className="timeline-event-desc">{event.description}</p>

        {hasImages && currentImg && (
          <div className="timeline-event-carousel" aria-label={`${event.title}图片`}>
            <div className="timeline-event-img-wrap">
              <img
                src={currentImg.src}
                alt={currentImg.alt}
                className="timeline-event-img"
                loading="lazy"
                onClick={() => onOpenImage?.(currentImg.src, currentImg.alt, currentImg.caption, currentImg.source)}
              />
              <div className="timeline-event-img-expand" aria-hidden="true">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
                </svg>
              </div>
            </div>

            {imgs.length > 1 && (
              <>
                <button
                  className="carousel-btn carousel-btn--prev"
                  onClick={() => setImgIdx((prev) => (prev - 1 + imgs.length) % imgs.length)}
                  aria-label="上一张"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M15 18l-6-6 6-6"/>
                  </svg>
                </button>
                <button
                  className="carousel-btn carousel-btn--next"
                  onClick={() => setImgIdx((prev) => (prev + 1) % imgs.length)}
                  aria-label="上一张"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M9 18l6-6-6-6"/>
                  </svg>
                </button>
                <div className="carousel-dots">
                  {imgs.map((_, i) => (
                    <span
                      key={i}
                      className={`carousel-dot ${i === imgIdx ? 'active' : ''}`}
                      onClick={() => setImgIdx(i)}
                      aria-label={`?${i + 1}?`}
                    />
                  ))}
                </div>
              </>
            )}

            {currentImg.caption && (
              <p className="timeline-event-img-caption">{currentImg.caption}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

interface TimelineListProps {
  events: TimelineEvent[];
  onOpenImage?: (src: string, alt: string, caption?: string, source?: string) => void;
}

export default function TimelineList({ events, onOpenImage }: TimelineListProps) {
  if (events.length === 0) return null;

  return (
    <div className="timeline-list" role="list" aria-label="时间线">
      {events.map((event, index) => (
        <TimelineEventItem
          key={index}
          event={event}
          index={index}
          onOpenImage={onOpenImage}
        />
      ))}
    </div>
  );
}

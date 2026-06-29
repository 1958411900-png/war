import { useEffect, useRef, useCallback } from 'react';
import type { TimelineStage } from '../data/timelineData';

interface DetailDrawerProps {
  isOpen: boolean;
  stage: TimelineStage | null;
  onClose: () => void;
}

export default function DetailDrawer({ isOpen, stage, onClose }: DetailDrawerProps) {
  const backdropRef = useRef<HTMLDivElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const startY = useRef<number>(0);
  const currentY = useRef<number>(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.classList.add('scroll-locked');
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.classList.remove('scroll-locked');
    };
  }, [isOpen, onClose]);

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === backdropRef.current) {
        onClose();
      }
    },
    [onClose]
  );

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    startY.current = e.touches[0].clientY;
    currentY.current = e.touches[0].clientY;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    currentY.current = e.touches[0].clientY;
    const delta = currentY.current - startY.current;
    if (delta > 0 && drawerRef.current) {
      drawerRef.current.style.transform = `translateY(${delta}px)`;
    }
  }, []);

  const handleTouchEnd = useCallback(() => {
    const delta = currentY.current - startY.current;
    if (delta > 100 && drawerRef.current) {
      drawerRef.current.style.transform = '';
      onClose();
    } else if (drawerRef.current) {
      drawerRef.current.style.transform = '';
    }
  }, [onClose]);

  const parseDetail = (detail: string) => {
    const dateRegex = /^(\d{1,2}月\d{1,2}[日]?(?:[\uff08][^\uff09]+[\uff09])?[\uff1a:])/;
    const dateMatch = detail.match(dateRegex);
    const dateText = dateMatch ? dateMatch[1].replace(/[\uff1a:]$/, '') : null;
    const contentText = dateMatch
      ? detail.slice(dateMatch[0].length).trim()
      : detail;

    const sourceRegex = /\u3010\u4fe1\u6e90[\uff1a:][^\u3011]+\u3011/;
    const sourceMatch = contentText.match(sourceRegex);
    const rawSource = sourceMatch ? sourceMatch[0] : null;
    const source = rawSource
      ? rawSource.substring(5, rawSource.length - 1).trim()
      : null;
    const cleanContent = rawSource
      ? contentText.replace(rawSource, '').trim()
      : contentText;

    return { dateText, cleanContent, source };
  };

  const drawerLabel = stage ? stage.title + ' Detail Timeline' : 'Detail Timeline';
  const closeLabel = 'Close Detail Timeline';
  const sourceLabel = 'Source: ';

  return (
    <>
      <div
        ref={backdropRef}
        className={`detail-backdrop ${isOpen ? 'open' : ''}`}
        onClick={handleBackdropClick}
        aria-hidden="true"
      />
      <div
        ref={drawerRef}
        className={`detail-drawer ${isOpen ? 'open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label={drawerLabel}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="detail-handle" aria-hidden="true" />
        {stage && (
          <>
            <header className="detail-header">
              <div className="detail-header-top">
                <h2 className="detail-title">{stage.title}</h2>
                <button
                  className="detail-close"
                  onClick={onClose}
                  aria-label={closeLabel}
                >
                  X
                </button>
              </div>
              <p className="detail-date">{stage.dateRange}</p>
            </header>
            <div className="detail-body">
              {stage.details.map((detail, index) => {
                const { dateText, cleanContent, source } = parseDetail(detail);
                return (
                  <div key={index} className="detail-item">
                    {dateText && (
                      <p className="detail-item-date">{dateText}</p>
                    )}
                    <p className="detail-item-text">{cleanContent}</p>
                    {source && (
                      <p className="detail-item-source">{sourceLabel}{source}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </>
  );
}

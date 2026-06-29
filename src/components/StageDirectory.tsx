import { useEffect, useRef } from 'react';
import type { TimelineStage } from '../data/timelineData';

interface StageDirectoryProps {
  isOpen: boolean;
  stages: TimelineStage[];
  currentIndex: number;
  onClose: () => void;
  onGoTo: (index: number) => void;
}

export default function StageDirectory({
  isOpen,
  stages,
  currentIndex,
  onClose,
  onGoTo,
}: StageDirectoryProps) {
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen && listRef.current) {
      const activeEl = listRef.current.querySelector('.directory-item.active');
      activeEl?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }, [isOpen, currentIndex]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <>
      <div
        className={`directory-backdrop ${isOpen ? 'open' : ''}`}
        onClick={handleBackdropClick}
        aria-hidden="true"
      />
      <nav
        className={`directory-drawer ${isOpen ? 'open' : ''}`}
        role="navigation"
        aria-label="阶段目录"
        aria-hidden={!isOpen}
      >
        <header className="directory-header">
          <h2 className="directory-title">目录</h2>
          <button
            className="directory-close"
            onClick={onClose}
            aria-label="关闭目录"
          >
            X
          </button>
        </header>
        <div ref={listRef} className="directory-list">
          <button
            className={`directory-item ${currentIndex === -1 ? 'active' : ''}`}
            onClick={() => onGoTo(-1)}
            aria-current={currentIndex === -1 ? 'true' : undefined}
          >
            <span className="directory-item-number">00</span>
            <span className="directory-item-title">封面</span>
            <span className="directory-item-date">开场</span>
          </button>
          {stages.map((stage, index) => (
            <button
              key={stage.id}
              className={`directory-item ${currentIndex === index ? 'active' : ''}`}
              onClick={() => onGoTo(index)}
              aria-current={currentIndex === index ? 'true' : undefined}
            >
              <span className="directory-item-number">{stage.number}</span>
              <span className="directory-item-title">{stage.title}</span>
              <span className="directory-item-date">{stage.dateRange.split('-')[0]}</span>
            </button>
          ))}
        </div>
      </nav>
    </>
  );
}

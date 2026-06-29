import { useState, useRef, useEffect, useCallback } from 'react';

interface CoverSectionProps {
  onEnter: () => void;
}

interface Leader {
  id: string;
  name: string;
  country: string;
  imgSrc: string;
}

const LEADERS: Leader[] = [
  {
    id: 'usa',
    name: 'DONALD TRUMP',
    country: '美国',
    imgSrc: '/images/leader-usa-new.png',
  },
  {
    id: 'iran',
    name: 'MASOUD PEZESHKIAN',
    country: '伊朗',
    imgSrc: '/images/leader-iran-new.png',
  },
  {
    id: 'israel',
    name: 'BENJAMIN NETANYAHU',
    country: '以色列',
    imgSrc: '/images/leader-israel-new.png',
  },
];

const SWIPE_THRESHOLD = 40;
const TRANSITION_MS = 600;

export default function CoverSection({ onEnter }: CoverSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [sliding, setSliding] = useState<'left' | 'right' | null>(null);
  const touchRef = useRef<{ startX: number; startY: number } | null>(null);
  const autoTimerRef = useRef<ReturnType<typeof setTimeout>>();

  const goTo = useCallback(
    (next: number, direction: 'left' | 'right') => {
      if (sliding !== null) return;
      const normalized = ((next % LEADERS.length) + LEADERS.length) % LEADERS.length;
      if (normalized === activeIndex) return;
      setSliding(direction);
      setTimeout(() => {
        setActiveIndex(normalized);
        setSliding(null);
      }, TRANSITION_MS);
    },
    [activeIndex, sliding]
  );

  const scheduleAuto = useCallback(() => {
    autoTimerRef.current && clearTimeout(autoTimerRef.current);
    autoTimerRef.current = setTimeout(() => {
      goTo(activeIndex + 1, 'left');
    }, 5000);
  }, [activeIndex, goTo]);

  useEffect(() => {
    scheduleAuto();
    return () => { autoTimerRef.current && clearTimeout(autoTimerRef.current); };
  }, [activeIndex]);

  const handleTouchStart = (e: React.TouchEvent) => {
    autoTimerRef.current && clearTimeout(autoTimerRef.current);
    touchRef.current = { startX: e.touches[0].clientX, startY: e.touches[0].clientY };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchRef.current) return;
    const dx = e.touches[0].clientX - touchRef.current.startX;
    const dy = e.touches[0].clientY - touchRef.current.startY;
    if (Math.abs(dx) > Math.abs(dy) + 10) e.preventDefault();
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchRef.current) return;
    const dx = e.changedTouches[0].clientX - touchRef.current.startX;
    if (Math.abs(dx) > SWIPE_THRESHOLD) {
      dx < 0 ? goTo(activeIndex + 1, 'left') : goTo(activeIndex - 1, 'right');
    }
    touchRef.current = null;
    scheduleAuto();
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    autoTimerRef.current && clearTimeout(autoTimerRef.current);
    touchRef.current = { startX: e.clientX, startY: e.clientY };
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!touchRef.current) return;
    const dx = e.clientX - touchRef.current.startX;
    if (Math.abs(dx) > SWIPE_THRESHOLD) {
      dx < 0 ? goTo(activeIndex + 1, 'left') : goTo(activeIndex - 1, 'right');
    }
    touchRef.current = null;
    scheduleAuto();
  };

  const handleDotClick = (i: number) => {
    if (i === activeIndex || sliding) return;
    autoTimerRef.current && clearTimeout(autoTimerRef.current);
    const direction = i > activeIndex ? 'left' : 'right';
    const steps = Math.min(
      Math.abs(i - activeIndex),
      LEADERS.length - Math.abs(i - activeIndex)
    );
    const next = direction === 'left'
      ? (activeIndex + steps) % LEADERS.length
      : ((activeIndex - steps) + LEADERS.length) % LEADERS.length;
    goTo(next, direction);
    scheduleAuto();
  };

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => { if (e.key === 'Enter' || e.key === ' ') onEnter(); },
    [onEnter]
  );

  // Frame layout: 5 frames = far-prev | prev | center | next | far-next
  // prev = activeIndex-1, next = activeIndex+1, farPrev = activeIndex-2, farNext = activeIndex+2
  const farPrevIdx = ((activeIndex - 2) + LEADERS.length) % LEADERS.length;
  const prevIdx = ((activeIndex - 1) + LEADERS.length) % LEADERS.length;
  const nextIdx = (activeIndex + 1) % LEADERS.length;
  const farNextIdx = (activeIndex + 2) % LEADERS.length;

  const carouselClass = sliding
    ? `cover-carousel cover-slide-${sliding}`
    : 'cover-carousel';

  return (
    <section
      className="cover-section"
      aria-label="封面"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      {/* 1/6 + 2/3 + 1/6 sliding carousel */}
      <div className={carouselClass}>

        {/* Background frame: always fills full width, no transition, prevents gaps */}
        <div className="cover-frame cover-frame-bg">
          <img
            src={LEADERS[activeIndex].imgSrc}
            alt=""
            className="cover-leader-img"
          />
        </div>

        {/* Far prev: off-screen left, only used in slide-right */}
        <div className="cover-frame cover-frame-far-prev">
          <img
            src={LEADERS[farPrevIdx].imgSrc}
            alt=""
            className="cover-leader-img"
          />
        </div>

        {/* Prev mini: left edge */}
        <div
          className="cover-frame cover-frame-prev"
          onClick={() => goTo(prevIdx, 'right')}
        >
          <img
            src={LEADERS[prevIdx].imgSrc}
            alt={LEADERS[prevIdx].country}
            className="cover-leader-img"
          />
        </div>

        {/* Center main: center */}
        <div className="cover-frame cover-frame-center">
          <img
            src={LEADERS[activeIndex].imgSrc}
            alt={LEADERS[activeIndex].name}
            className="cover-leader-img"
          />
        </div>

        {/* Next mini: right edge */}
        <div
          className="cover-frame cover-frame-next"
          onClick={() => goTo(nextIdx, 'left')}
        >
          <img
            src={LEADERS[nextIdx].imgSrc}
            alt={LEADERS[nextIdx].country}
            className="cover-leader-img"
          />
        </div>

        {/* Far next: off-screen right, only used in slide-left */}
        <div className="cover-frame cover-frame-far-next">
          <img
            src={LEADERS[farNextIdx].imgSrc}
            alt=""
            className="cover-leader-img"
          />
        </div>

        <div className="cover-overlay" />
        <div className="cover-bottom-glow" />
      </div>

      {/* Content - bottom left */}
      <div className="cover-content">
        <p className="cover-pretitle">US-ISRAEL-IRAN CONFLICT</p>
        <h1 className="cover-main-title">美以伊战争</h1>
        <p className="cover-subtitle-line">发展脉络</p>
        <p className="cover-subtitle-en">
          A Timeline of the U.S.-Israel-Iran War
        </p>

        <div className="cover-divider" />

        <p className="cover-period">2026.02.28 - 2026.06.27</p>
        <p className="cover-desc">
          从多国联合空袭伊朗到全面停火协议，全面梳理这场21世纪最具影响力的地区战争。
        </p>

        <div className="cover-cta">
          <button
            className="enter-btn"
            onClick={onEnter}
            onKeyDown={handleKeyDown}
            aria-label="进入报道"
          >
            <span>进入报道</span>
            <span className="enter-btn-arrow" aria-hidden="true">→</span>
          </button>
        </div>
      </div>

      {/* Dot indicators - bottom right */}
      <div className="cover-dots">
        {LEADERS.map((l, i) => (
          <button
            key={l.id}
            className={`cover-dot${i === activeIndex ? ' active' : ''}`}
            onClick={() => handleDotClick(i)}
            aria-label={`切换至${l.country}领导人`}
          />
        ))}
      </div>

      {/* Scroll hint - bottom left */}
      <div className="scroll-indicator" aria-hidden="true">
        <span className="scroll-indicator-text">下滑</span>
        <span className="scroll-indicator-line" />
      </div>
    </section>
  );
}

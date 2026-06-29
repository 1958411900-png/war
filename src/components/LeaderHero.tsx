import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, type Variants, type Easing } from 'framer-motion';
import './LeaderHero.css';

/* ─────────────────────────────────────────────────────────────
   数据
───────────────────────────────────────────────────────────── */
export interface LeaderItem {
  id: string;
  country: string;
  name: string;
  nameEn: string;
  role: string;
  image: string;
  objectPosition: string;
  alt: string;
}

export const LEADERS: LeaderItem[] = [
  {
    id: 'leader-us',
    country: '美国',
    name: 'DONALD TRUMP',
    nameEn: 'Donald Trump',
    role: '美国总统',
    image: '/images/leader-trump.jpg',
    objectPosition: '50% 18%',
    alt: '美国总统唐纳德·特朗普',
  },
  {
    id: 'leader-iran',
    country: '伊朗',
    name: 'MASOUD PEZESHKIAN',
    nameEn: 'Masoud Pezeshkian',
    role: '伊朗总统',
    image: '/images/leader-pezeshkian.jpg',
    objectPosition: '50% 18%',
    alt: '伊朗总统马苏德·佩泽希齐安',
  },
  {
    id: 'leader-israel',
    country: '以色列',
    name: 'BENJAMIN NETANYAHU',
    nameEn: 'Benjamin Netanyahu',
    role: '以色列总理',
    image: '/images/leader-netanyahu.jpg',
    objectPosition: '50% 15%',
    alt: '以色列总理本雅明·内塔尼亚胡',
  },
];

/* ─────────────────────────────────────────────────────────────
   常量
───────────────────────────────────────────────────────────── */
const AUTOPLAY_DELAY = 4800;
const RESUME_DELAY   = 6000;
const SWIPE_THRESHOLD = 45;

const norm = (i: number) => ((i % LEADERS.length) + LEADERS.length) % LEADERS.length;

const preloadImages = () =>
  LEADERS.forEach((l) => { const img = new Image(); img.src = l.image; });

/* ─────────────────────────────────────────────────────────────
   动画变体
───────────────────────────────────────────────────────────── */
const EASE: Easing = [0.22, 1, 0.36, 1];

const textVariants: Variants = {
  enter: (dir: number) => ({ x: dir * 10, opacity: 0 }),
  center: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.35, ease: EASE },
  },
  exit: (dir: number) => ({
    x: -dir * 10,
    opacity: 0,
    transition: { duration: 0.30, ease: EASE },
  }),
};

/* ─────────────────────────────────────────────────────────────
   单个槽位
───────────────────────────────────────────────────────────── */
interface SlotImageProps {
  leader: LeaderItem;
  slotWidth: string;
  isCenter: boolean;
  enterFrom: number;
}

function SlotImage({ leader, slotWidth, isCenter, enterFrom }: SlotImageProps) {
  return (
    <motion.div
      className={['lh-slot', !isCenter ? 'lh-slot--blur' : ''].join(' ')}
      style={{ width: slotWidth }}
      initial={{ width: slotWidth }}
      animate={{ width: slotWidth }}
      transition={{ duration: 0.85, ease: EASE }}
    >
      <AnimatePresence initial={false} mode="popLayout">
        <motion.div
          key={leader.id}
          className="lh-img-wrap"
          initial={{ opacity: 0, x: enterFrom * 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -enterFrom * 20 }}
          transition={{ duration: 0.65, ease: EASE }}
        >
          <motion.img
            src={leader.image}
            alt={leader.alt}
            className="lh-img"
            style={{ objectPosition: leader.objectPosition }}
            draggable={false}
            animate={{ scale: isCenter ? 1 : 1.07 }}
            transition={{ duration: 0.90, ease: EASE }}
          />
          <motion.div
            className="lh-overlay"
            animate={{ opacity: isCenter ? 0.10 : 0.50 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
          {!isCenter && (
            <div className="lh-side-label" aria-hidden="true">
              {leader.country}
            </div>
          )}
          {isCenter && (
            <div className="lh-center-bar" aria-hidden="true" />
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────
   主组件
───────────────────────────────────────────────────────────── */
interface LeaderHeroProps { onEnter: () => void; }

export default function LeaderHero({ onEnter }: LeaderHeroProps) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [textDir, setTextDir]   = useState(1);

  const touchRef    = useRef<{ startX: number; startY: number } | null>(null);
  const autoTimer   = useRef<ReturnType<typeof setTimeout>>();
  const resumeTimer = useRef<ReturnType<typeof setTimeout>>();

  const active = LEADERS[activeIdx];
  const prev   = LEADERS[norm(activeIdx - 1)];
  const next   = LEADERS[norm(activeIdx + 1)];

  const goTo = useCallback(
    (targetIdx: number, direction: 'left' | 'right') => {
      const target = norm(targetIdx);
      if (target === activeIdx) {
        clearTimeout(autoTimer.current);
        clearTimeout(resumeTimer.current);
        resumeTimer.current = setTimeout(scheduleAuto, RESUME_DELAY);
        return;
      }
      setTextDir(direction === 'left' ? 1 : -1);
      clearTimeout(autoTimer.current);
      clearTimeout(resumeTimer.current);
      resumeTimer.current = setTimeout(() => {
        setActiveIdx(target);
        resumeTimer.current = setTimeout(scheduleAuto, RESUME_DELAY);
      }, 680);
    },
    [activeIdx]
  );

  const scheduleAuto = useCallback(() => {
    clearTimeout(autoTimer.current);
    autoTimer.current = setTimeout(() => {
      setTextDir(1);
      resumeTimer.current = setTimeout(() => {
        setActiveIdx((i) => norm(i + 1));
      }, 680);
    }, AUTOPLAY_DELAY);
  }, []);

  useEffect(() => {
    preloadImages();
    scheduleAuto();
    return () => { clearTimeout(autoTimer.current); clearTimeout(resumeTimer.current); };
  }, []);

  useEffect(() => {
    const onVis = () => {
      if (document.hidden) {
        clearTimeout(autoTimer.current);
        clearTimeout(resumeTimer.current);
      } else {
        clearTimeout(autoTimer.current);
        scheduleAuto();
      }
    };
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, [scheduleAuto]);

  const onMouseEnter = () => { clearTimeout(autoTimer.current); clearTimeout(resumeTimer.current); };
  const onMouseLeave = () => { clearTimeout(autoTimer.current); scheduleAuto(); };

  const onTrackClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const relX = (e.clientX - rect.left) / rect.width;
      if (relX < 0.35) {
        goTo(norm(activeIdx - 1), 'right');
      } else if (relX > 0.65) {
        goTo(norm(activeIdx + 1), 'left');
      }
    },
    [activeIdx, goTo]
  );

  const onTouchStart = (e: React.TouchEvent) => {
    clearTimeout(autoTimer.current);
    clearTimeout(resumeTimer.current);
    touchRef.current = { startX: e.touches[0].clientX, startY: e.touches[0].clientY };
  };
  const onTouchMove = (e: React.TouchEvent) => {
    if (!touchRef.current) return;
    const dx = e.touches[0].clientX - touchRef.current.startX;
    const dy = e.touches[0].clientY - touchRef.current.startY;
    if (Math.abs(dx) > Math.abs(dy) + 12) e.preventDefault();
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touchRef.current) return;
    const dx = e.changedTouches[0].clientX - touchRef.current.startX;
    const dy = Math.abs(e.changedTouches[0].clientY - touchRef.current.startY);
    touchRef.current = null;
    if (Math.abs(dx) > SWIPE_THRESHOLD && dy < 90) {
      dx < 0
        ? goTo(norm(activeIdx + 1), 'left')
        : goTo(norm(activeIdx - 1), 'right');
    } else {
      resumeTimer.current = setTimeout(scheduleAuto, RESUME_DELAY);
    }
  };

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowLeft')  { e.preventDefault(); goTo(norm(activeIdx - 1), 'right'); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); goTo(norm(activeIdx + 1), 'left'); }
      else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onEnter(); }
    },
    [activeIdx, goTo, onEnter]
  );

  const onEnterKeyDown = useCallback(
    (e: React.KeyboardEvent) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onEnter(); } },
    [onEnter]
  );

  return (
    <section
      className="leader-hero"
      aria-label="封面人物展示"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onKeyDown={onKeyDown}
      tabIndex={0}
    >
      {/* 照片轨道 */}
      <div
        className="lh-track"
        onClick={onTrackClick}
        role="button"
        tabIndex={-1}
        aria-label="点击左侧或右侧区域切换人物"
      >
        <SlotImage leader={prev}   slotWidth="16.67%" isCenter={false} enterFrom={-1} />
        <SlotImage leader={active} slotWidth="66.66%" isCenter={true}  enterFrom={0} />
        <SlotImage leader={next}   slotWidth="16.67%" isCenter={false} enterFrom={1} />
        <div className="lh-divider lh-divider--1" aria-hidden="true" />
        <div className="lh-divider lh-divider--2" aria-hidden="true" />
      </div>

      {/* 底部渐变（覆盖人物文字区以下） */}
      <div className="lh-bottom-fade" aria-hidden="true" />

      {/* ── 人物介绍：居中显示在照片上 ── */}
      <div className="lh-info" aria-live="polite">
        <AnimatePresence mode="wait" custom={textDir}>
          <motion.div
            key={active.id + '-text'}
            className="lh-text-block"
            custom={textDir}
            variants={textVariants}
            initial="enter"
            animate="center"
            exit="exit"
          >
            <p className="lh-role">{active.country}&nbsp;&nbsp;{active.role}</p>
            <h3 className="lh-name">{active.name}</h3>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── 标题与进度（底部，计数器合并在标题行）── */}
      <div className="lh-header" aria-label="报道标题">
        <div className="lh-header-top">
          <div className="lh-header-left">
            <p className="lh-pretitle">US-ISRAEL-IRAN CONFLICT</p>
            <h1 className="lh-title">美以伊战争</h1>
            <p className="lh-subtitle">发展脉络</p>
            <p className="lh-subtitle-en">A Timeline of the U.S.-Israel-Iran War</p>
            <div className="lh-title-divider" />
            <p className="lh-period">2026.02.28 — 2026.06.27</p>
            <p className="lh-desc">
              从多国联合空袭伊朗到全面停火协议，全面梳理这场21世纪最具影响力的地区战争。
            </p>
          </div>
          {/* 进度条：01/03 竖排显示 */}
          <div className="lh-progress" aria-label={`第 ${activeIdx + 1} 位，共 ${LEADERS.length} 位`}>
            <AnimatePresence mode="wait">
              <motion.span
                key={active.id}
                className="lh-progress-current"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.3, ease: EASE }}
              >
                {String(activeIdx + 1).padStart(2, '0')}
              </motion.span>
            </AnimatePresence>
            <div className="lh-progress-sep" />
            <span className="lh-progress-total">
              {String(LEADERS.length).padStart(2, '0')}
            </span>
          </div>
        </div>

        <button
          className="lh-enter-btn"
          onClick={onEnter}
          onKeyDown={onEnterKeyDown}
          aria-label="进入报道"
        >
          <span>进入报道</span>
          <span className="lh-enter-arrow" aria-hidden="true">→</span>
        </button>
      </div>

      {/* 下滑提示 */}
      <div className="lh-scroll-hint" aria-hidden="true">
        <span className="lh-scroll-text">下滑</span>
        <span className="lh-scroll-line" />
      </div>
    </section>
  );
}

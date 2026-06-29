import { useState, useRef, useCallback, useEffect } from 'react';
import { timelineStages } from './data/timelineData';
import LeaderHero from './components/LeaderHero';
import FixedHeader from './components/FixedHeader';
import StagePanel from './components/StagePanel';
import StageDirectory from './components/StageDirectory';
import StageNav from './components/StageNav';
import SourceFooter from './components/SourceFooter';
import ImagePreview from './components/ImagePreview';
import DetailDrawer from './components/DetailDrawer';

const CONTENT_STAGES = timelineStages.filter((s) => s.id !== 'cover' && s.id !== 'prewar');
const TOTAL_STAGES = CONTENT_STAGES.length;

// ─── helpers ───────────────────────────────────────────────────────────────
function getStageId(index: number) {
  return `stage-${CONTENT_STAGES[index]?.id ?? ''}`;
}

// ─── App ───────────────────────────────────────────────────────────────────
export default function App() {
  // appPhase: 'cover' | 'timeline'
  const [appPhase, setAppPhase] = useState<'cover' | 'timeline'>('cover');
  const [currentStageIndex, setCurrentStageIndex] = useState(0);

  // Overlays
  const [showDirectory, setShowDirectory] = useState(false);
  const [showDetailDrawer, setShowDetailDrawer] = useState(false);
  const [detailStageIndex, setDetailStageIndex] = useState<number | null>(null);
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [previewImage, setPreviewImage] = useState<{
    src: string; alt: string; caption?: string; source?: string;
  } | null>(null);

  // Refs
  const contentRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const touchStartTime = useRef(0);
  const inTimeline = appPhase === 'timeline';

  // ─── scroll helpers ──────────────────────────────────────────────────────
  const scrollToStage = useCallback((index: number) => {
    const el = document.getElementById(getStageId(index));
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      contentRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  const scrollToSituation = useCallback(() => {
    const el = document.getElementById('situation-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      // Situation section lives inside last panel — scroll to last panel bottom
      const lastEl = document.getElementById(getStageId(TOTAL_STAGES - 1));
      if (lastEl) {
        lastEl.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }
    }
  }, []);

  // ─── navigation ──────────────────────────────────────────────────────────
  const enterTimeline = useCallback(() => {
    setAppPhase('timeline');
    setCurrentStageIndex(0);
    setTimeout(() => scrollToStage(0), 80);
  }, [scrollToStage]);

  const goToPrevStage = useCallback(() => {
    setCurrentStageIndex((prev) => {
      const next = Math.max(0, prev - 1);
      setTimeout(() => scrollToStage(next), 60);
      return next;
    });
  }, [scrollToStage]);

  const goToNextStage = useCallback(() => {
    setCurrentStageIndex((prev) => {
      const next = Math.min(TOTAL_STAGES - 1, prev + 1);
      setTimeout(() => scrollToStage(next), 60);
      return next;
    });
  }, [scrollToStage]);

  const goToStage = useCallback((index: number) => {
    const clamped = Math.max(0, Math.min(TOTAL_STAGES - 1, index));
    setCurrentStageIndex(clamped);
    setShowDirectory(false);
    setTimeout(() => scrollToStage(clamped), 60);
  }, [scrollToStage]);

  // ─── touch / swipe ───────────────────────────────────────────────────────
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    touchStartTime.current = Date.now();
  }, []);

  const handleTouchMove = useCallback((_e: React.TouchEvent) => {
    // only record start; end decides
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    const dt = Date.now() - touchStartTime.current;

    if (Math.abs(dy) > Math.abs(dx)) {
      // 封面下滑进入时间线
      if (dy > 50 && dt < 500 && !inTimeline) {
        enterTimeline();
        return;
      }
      // 内容区上下滚动暂不拦截
      return;
    }

    // 水平滑动
    if (Math.abs(dx) > 50 && dt < 500) {
      if (dx < 0) {
        goToNextStage();
      } else {
        goToPrevStage();
      }
    }
  }, [inTimeline, enterTimeline, goToNextStage, goToPrevStage]);

  // ─── detail / image overlays ─────────────────────────────────────────────
  const handleOpenDetail = useCallback((stageIndex: number) => {
    setDetailStageIndex(stageIndex);
    setShowDetailDrawer(true);
    document.body.classList.add('scroll-locked');
  }, []);

  const handleCloseDetail = useCallback(() => {
    setShowDetailDrawer(false);
    document.body.classList.remove('scroll-locked');
    setTimeout(() => setDetailStageIndex(null), 300);
  }, []);

  const handleOpenImage = useCallback(
    (src: string, alt: string, caption?: string, source?: string) => {
      setPreviewImage({ src, alt, caption, source });
      setShowImagePreview(true);
      document.body.classList.add('scroll-locked');
    }, []);

  const handleCloseImage = useCallback(() => {
    setShowImagePreview(false);
    document.body.classList.remove('scroll-locked');
    setTimeout(() => setPreviewImage(null), 300);
  }, []);

  // ─── keyboard navigation ─────────────────────────────────────────────────
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (showDetailDrawer || showImagePreview || !inTimeline) return;
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        goToPrevStage();
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        goToNextStage();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [showDetailDrawer, showImagePreview, inTimeline, goToPrevStage, goToNextStage]);

  const currentStage = CONTENT_STAGES[currentStageIndex];
  const stageTitle = currentStage?.title ?? '';

  return (
    <div className="h5-app">
      <div className="h5-inner">

        {/* ── 封面 ── */}
        {appPhase === 'cover' && (
          <LeaderHero onEnter={enterTimeline} />
        )}

        {/* ── 时间线内容 ── */}
        {appPhase === 'timeline' && (
          <>
            <FixedHeader
              currentStage={currentStageIndex}
              totalStages={TOTAL_STAGES}
              stageTitle={stageTitle}
              onOpenDirectory={() => setShowDirectory(true)}
            />

            <div
              ref={contentRef}
              className="h5-content"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {CONTENT_STAGES.map((stage, index) => (
                <StagePanel
                  key={stage.id}
                  stage={stage}
                  index={index}
                  isActive={currentStageIndex === index}
                  onOpenDetail={() => handleOpenDetail(index)}
                  onOpenImage={handleOpenImage}
                  isLast={index === TOTAL_STAGES - 1}
                  onGoToNext={goToNextStage}
                  onGoToSituation={scrollToSituation}
                />
              ))}
            </div>

            <SourceFooter
              onBackToCover={() => setAppPhase('cover')}
              onRestart={enterTimeline}
            />

            <StageNav
              currentIndex={currentStageIndex}
              total={TOTAL_STAGES}
              stageTitle={stageTitle}
              onPrev={goToPrevStage}
              onNext={goToNextStage}
              onOpenDirectory={() => setShowDirectory(true)}
            />

            <StageDirectory
              isOpen={showDirectory}
              stages={CONTENT_STAGES}
              currentIndex={currentStageIndex}
              onClose={() => setShowDirectory(false)}
              onGoTo={goToStage}
            />

            <DetailDrawer
              isOpen={showDetailDrawer}
              stage={detailStageIndex !== null ? CONTENT_STAGES[detailStageIndex] : null}
              onClose={handleCloseDetail}
            />

            <ImagePreview
              isOpen={showImagePreview}
              image={previewImage}
              onClose={handleCloseImage}
            />
          </>
        )}
      </div>
    </div>
  );
}

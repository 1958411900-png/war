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

// ─── App ───────────────────────────────────────────────────────────────────
export default function App() {
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

  // Refs for imperative access (no closure risk)
  const contentRef = useRef<HTMLDivElement>(null);
  const currentIndexRef = useRef(0);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);

  // ─── scroll ───────────────────────────────────────────────────────────────
  // scrollIntoView scrolls the *window*, not the h5-content container.
  // Use container.scrollTo with offsetTop to scroll the correct element.
  const scrollToStage = useCallback((index: number) => {
    const stageId = `stage-${CONTENT_STAGES[index]?.id ?? ''}`;
    const targetEl = document.getElementById(stageId);
    const container = contentRef.current;
    if (!container) return;
    if (targetEl) {
      container.scrollTo({ top: targetEl.offsetTop, behavior: 'smooth' });
    } else {
      container.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  const goToSituation = useCallback(() => {
    const container = contentRef.current;
    const el = document.getElementById('situation-section');
    if (el && container) {
      container.scrollTo({ top: el.offsetTop, behavior: 'smooth' });
    }
  }, []);

  // ─── navigation ───────────────────────────────────────────────────────────
  const enterTimeline = useCallback(() => {
    setAppPhase('timeline');
    setCurrentStageIndex(0);
    currentIndexRef.current = 0;
    requestAnimationFrame(() => scrollToStage(0));
  }, [scrollToStage]);

  const goToPrevStage = useCallback(() => {
    const next = Math.max(0, currentIndexRef.current - 1);
    currentIndexRef.current = next;
    setCurrentStageIndex(next);
    scrollToStage(next);
  }, [scrollToStage]);

  const goToNextStage = useCallback(() => {
    const next = Math.min(TOTAL_STAGES - 1, currentIndexRef.current + 1);
    currentIndexRef.current = next;
    setCurrentStageIndex(next);
    scrollToStage(next);
  }, [scrollToStage]);

  const goToStage = useCallback((index: number) => {
    const clamped = Math.max(0, Math.min(TOTAL_STAGES - 1, index));
    currentIndexRef.current = clamped;
    setCurrentStageIndex(clamped);
    setShowDirectory(false);
    scrollToStage(clamped);
  }, [scrollToStage]);

  // ─── touch ────────────────────────────────────────────────────────────────
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;

    if (appPhase === 'cover' && dy > 50 && Math.abs(dy) > Math.abs(dx)) {
      enterTimeline();
      return;
    }

    if (Math.abs(dx) > 50) {
      if (dx < 0) {
        goToNextStage();
      } else {
        goToPrevStage();
      }
    }
  }, [appPhase, enterTimeline, goToNextStage, goToPrevStage]);

  // ─── overlays ──────────────────────────────────────────────────────────────
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

  // ─── keyboard ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (showDetailDrawer || showImagePreview || appPhase !== 'timeline') return;
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
  }, [showDetailDrawer, showImagePreview, appPhase, goToPrevStage, goToNextStage]);

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
                  onGoToSituation={goToSituation}
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

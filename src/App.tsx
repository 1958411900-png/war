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

export default function App() {
  const [currentStageIndex, setCurrentStageIndex] = useState(-1); // -1 = cover
  const [showCover, setShowCover] = useState(true);
  const [showDirectory, setShowDirectory] = useState(false);
  const [showDetailDrawer, setShowDetailDrawer] = useState(false);
  const [detailStageIndex, setDetailStageIndex] = useState<number | null>(null);
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [previewImage, setPreviewImage] = useState<{ src: string; alt: string; caption?: string; source?: string } | null>(null);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right' | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const currentIdxRef = useRef(-1); // always mirrors currentStageIndex, safe for setTimeout closures
  const touchStartX = useRef<number>(0);
  const touchStartY = useRef<number>(0);
  const touchStartTime = useRef<number>(0);
  const isScrolling = useRef<boolean>(false);

  // Sync ref whenever state changes
  useEffect(() => {
    currentIdxRef.current = currentStageIndex;
  }, [currentStageIndex]);

  const scrollToStage = useCallback((targetIndex: number, direction: 'left' | 'right') => {
    const id = `stage-${CONTENT_STAGES[targetIndex]?.id}`;
    const el = id ? document.getElementById(id) : null;
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      contentRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setSlideDirection(null);
  }, []);

  const handleEnterTimeline = useCallback(() => {
    setShowCover(false);
    setCurrentStageIndex(0);
    setSlideDirection(null);
    currentIdxRef.current = 0;
    setTimeout(() => {
      contentRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  }, []);

  const handlePrevStage = useCallback(() => {
    const idx = currentIdxRef.current;
    if (idx > 0) {
      const target = idx - 1;
      setSlideDirection('right');
      setCurrentStageIndex(target);
      currentIdxRef.current = target;
      setTimeout(() => scrollToStage(target, 'right'), 60);
    } else if (idx === 0) {
      setShowCover(true);
      setCurrentStageIndex(-1);
      currentIdxRef.current = -1;
      contentRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [scrollToStage]);

  const handleNextStage = useCallback(() => {
    const idx = currentIdxRef.current;
    if (idx < CONTENT_STAGES.length - 1) {
      const target = idx + 1;
      setSlideDirection('left');
      setCurrentStageIndex(target);
      currentIdxRef.current = target;
      setTimeout(() => scrollToStage(target, 'left'), 60);
    }
  }, [scrollToStage]);

  const handleGoToStage = useCallback((index: number) => {
    const direction: 'left' | 'right' = index > currentIdxRef.current ? 'left' : 'right';
    setSlideDirection(direction);
    setCurrentStageIndex(index);
    setShowDirectory(false);
    currentIdxRef.current = index;
    setTimeout(() => scrollToStage(index, direction), 60);
  }, [scrollToStage]);

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

  const handleOpenImage = useCallback((src: string, alt: string, caption?: string, source?: string) => {
    setPreviewImage({ src, alt, caption, source });
    setShowImagePreview(true);
    document.body.classList.add('scroll-locked');
  }, []);

  const handleCloseImage = useCallback(() => {
    setShowImagePreview(false);
    document.body.classList.remove('scroll-locked');
    setTimeout(() => setPreviewImage(null), 300);
  }, []);

  // Touch handling for swipe
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    touchStartTime.current = Date.now();
    isScrolling.current = false;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    const dx = e.touches[0].clientX - touchStartX.current;
    const dy = e.touches[0].clientY - touchStartY.current;
    if (Math.abs(dy) > Math.abs(dx)) {
      isScrolling.current = true;
    }
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (isScrolling.current) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dt = Date.now() - touchStartTime.current;
    if (Math.abs(dx) > 50 && dt < 500) {
      if (dx < 0) {
        handleNextStage();
      } else {
        handlePrevStage();
      }
    }
  }, [handleNextStage, handlePrevStage]);

  const handleBackToCover = useCallback(() => {
    setShowCover(true);
    setCurrentStageIndex(-1);
    currentIdxRef.current = -1;
    contentRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showDetailDrawer || showImagePreview) return;
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        handlePrevStage();
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        handleNextStage();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showDetailDrawer, showImagePreview, handlePrevStage, handleNextStage]);

  const currentStage = CONTENT_STAGES[currentStageIndex];
  const stageTitle = currentStage?.title ?? '';

  return (
    <div className="h5-app">
      <div className="h5-inner">
        {showCover ? (
          <LeaderHero onEnter={handleEnterTimeline} />
        ) : (
          <>
            <FixedHeader
              currentStage={currentStageIndex}
              totalStages={CONTENT_STAGES.length}
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
                  slideDirection={currentStageIndex === index ? slideDirection : null}
                  onOpenDetail={() => handleOpenDetail(index)}
                  onOpenImage={handleOpenImage}
                  isLast={index === CONTENT_STAGES.length - 1}
                  onGoToNext={handleNextStage}
                />
              ))}
            </div>
            <SourceFooter
              onBackToCover={handleBackToCover}
              onRestart={() => {
                handleBackToCover();
                setTimeout(handleEnterTimeline, 100);
              }}
            />
            <StageNav
              currentIndex={currentStageIndex}
              total={CONTENT_STAGES.length}
              stageTitle={stageTitle}
              onPrev={handlePrevStage}
              onNext={handleNextStage}
              onOpenDirectory={() => setShowDirectory(true)}
            />
            <StageDirectory
              isOpen={showDirectory}
              stages={CONTENT_STAGES}
              currentIndex={currentStageIndex}
              onClose={() => setShowDirectory(false)}
              onGoTo={handleGoToStage}
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

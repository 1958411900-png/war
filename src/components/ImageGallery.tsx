import { useState, useEffect, useRef, useCallback } from 'react';
import type { TimelineImage } from '../data/timelineData';

interface ImageGalleryProps {
  images: TimelineImage[];
  onOpenImage: (src: string, alt: string, caption?: string, source?: string) => void;
}

export default function ImageGallery({ images, onOpenImage }: ImageGalleryProps) {
  const [imgIdx, setImgIdx] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const imgIdxRef = useRef(imgIdx);
  imgIdxRef.current = imgIdx;

  if (images.length === 0) return null;

  const current = images[imgIdx];

  const prev = useCallback(() => {
    setImgIdx((i) => (i - 1 + images.length) % images.length);
  }, [images.length]);

  const next = useCallback(() => {
    setImgIdx((i) => (i + 1) % images.length);
  }, [images.length]);

  const goTo = useCallback((i: number) => {
    setImgIdx((i % images.length + images.length) % images.length);
  }, [images.length]);

  // 自动轮播
  useEffect(() => {
    if (images.length <= 1) return;
    timerRef.current = setInterval(() => {
      setImgIdx((i) => (i + 1) % images.length);
    }, 4000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [images.length]);

  // 用户交互时暂停并重启轮播
  const handleUserInteract = useCallback((action: () => void) => {
    if (timerRef.current) clearInterval(timerRef.current);
    action();
    // 重启轮播
    if (images.length > 1) {
      timerRef.current = setInterval(() => {
        setImgIdx((i) => (i + 1) % images.length);
      }, 4000);
    }
  }, [images.length]);

  return (
    <div className="image-gallery" role="region" aria-label="图片集">
      {/* 主图 */}
      <div
        className="gallery-carousel-main"
        onClick={() => onOpenImage(current.src, current.alt, current.caption, current.source)}
      >
        <img
          key={current.src}
          src={current.src}
          alt={current.alt}
          className="gallery-carousel-img"
          loading="lazy"
        />
        {/* 展开图标 */}
        <div className="gallery-carousel-expand" aria-hidden="true">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
          </svg>
        </div>

        {/* 切换按钮 */}
        {images.length > 1 && (
          <>
            <button
              className="gallery-carousel-btn gallery-carousel-btn--prev"
              onClick={(e) => { e.stopPropagation(); handleUserInteract(prev); }}
              aria-label="上一张"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M15 18l-6-6 6-6"/>
              </svg>
            </button>
            <button
              className="gallery-carousel-btn gallery-carousel-btn--next"
              onClick={(e) => { e.stopPropagation(); handleUserInteract(next); }}
              aria-label="下一张"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </button>
          </>
        )}
      </div>

      {/* 图片说明 */}
      {current.caption && (
        <div className="gallery-img-caption">{current.caption}</div>
      )}

      {/* 指示点 */}
      {images.length > 1 && (
        <div className="gallery-carousel-dots">
          {images.map((_, i) => (
            <button
              key={i}
              className={`gallery-dot ${i === imgIdx ? 'active' : ''}`}
              onClick={() => handleUserInteract(() => goTo(i))}
              aria-label={`第${i + 1}张`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

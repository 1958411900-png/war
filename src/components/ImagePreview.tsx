import { useEffect, useRef, useCallback } from 'react';

interface ImagePreviewProps {
  isOpen: boolean;
  image: { src: string; alt: string; caption?: string; source?: string } | null;
  onClose: () => void;
}

export default function ImagePreview({ isOpen, image, onClose }: ImagePreviewProps) {
  const backdropRef = useRef<HTMLDivElement>(null);
  const startY = useRef<number>(0);
  const currentY = useRef<number>(0);
  const contentRef = useRef<HTMLDivElement>(null);

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
    if (delta > 0 && contentRef.current) {
      contentRef.current.style.transform = `translateY(${delta * 0.5}px)`;
      contentRef.current.style.opacity = `${1 - delta / 300}`;
    }
  }, []);

  const handleTouchEnd = useCallback(() => {
    const delta = currentY.current - startY.current;
    if (delta > 80) {
      onClose();
    } else if (contentRef.current) {
      contentRef.current.style.transform = '';
      contentRef.current.style.opacity = '';
    }
  }, [onClose]);

  return (
    <div
      ref={backdropRef}
      className={`image-preview-backdrop ${isOpen ? 'open' : ''}`}
      onClick={handleBackdropClick}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      role="dialog"
      aria-modal="true"
      aria-label="图片预览"
    >
      <button
        className="image-preview-close"
        onClick={onClose}
        aria-label="关闭预览"
      >
        X
      </button>
      {image && (
        <div ref={contentRef} className="image-preview-content">
          <img
            src={image.src}
            alt={image.alt}
            className="image-preview-img"
          />
          <div className="image-preview-caption">
            {image.caption && (
              <p className="image-preview-caption-text">{image.caption}</p>
            )}
            {image.source && (
              <p className="image-preview-caption-source">{image.source}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

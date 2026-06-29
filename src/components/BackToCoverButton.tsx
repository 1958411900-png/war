interface BackToCoverButtonProps {
  onBackToCover: () => void;
  isVisible: boolean;
}

export default function BackToCoverButton({ onBackToCover, isVisible }: BackToCoverButtonProps) {
  if (!isVisible) return null;

  return (
    <button
      className="back-to-cover-btn"
      onClick={onBackToCover}
      aria-label="返回封面"
    >
      <span>返回封面</span>
    </button>
  );
}

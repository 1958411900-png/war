interface NextStageButtonProps {
  onGoToNext: () => void;
  isLast: boolean;
}

export default function NextStageButton({ onGoToNext, isLast }: NextStageButtonProps) {
  if (isLast) return null;

  return (
    <button
      className="lh-enter-btn lh-enter-btn--fixed"
      onClick={onGoToNext}
      aria-label="进入下一阶段"
    >
      <span>下一阶段</span>
      <span className="lh-enter-arrow" aria-hidden="true">→</span>
    </button>
  );
}

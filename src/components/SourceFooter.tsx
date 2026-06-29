import { sourceFooter } from '../data/timelineData';

interface SourceFooterProps {
  onBackToCover: () => void;
  onRestart: () => void;
}

export default function SourceFooter({ onBackToCover, onRestart }: SourceFooterProps) {
  return (
    <footer className="source-footer" role="contentinfo">
      <p className="footer-epigraph">
        战争并未因一纸停火协定而真正结束。
        <br />
        当军事行动暂时退场，核问题、海峡通行、地区代理力量与制裁安排，
        仍在决定下一阶段的局势。
      </p>

      <p className="footer-meta">{sourceFooter.lastUpdated}</p>
      <p className="footer-note">{sourceFooter.note}</p>

      <div className="footer-btns">
        <button
          className="footer-btn"
          onClick={onBackToCover}
          aria-label="返回开头"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 19V5M5 12l7-7 7 7"/>
          </svg>
          <span>返回开头</span>
        </button>
        <button
          className="footer-btn"
          onClick={onRestart}
          aria-label="重新浏览时间线"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M1 4v6h6M23 20v-6h-6"/>
            <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"/>
          </svg>
          <span>重新浏览</span>
        </button>
      </div>
    </footer>
  );
}

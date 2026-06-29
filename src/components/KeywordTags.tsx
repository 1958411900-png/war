interface KeywordTagsProps {
  keywords: string[];
}

export default function KeywordTags({ keywords }: KeywordTagsProps) {
  return (
    <div className="keyword-tags" role="list" aria-label="关键词">
      {keywords.map((kw) => (
        <span key={kw} className="keyword-tag" role="listitem">
          {kw}
        </span>
      ))}
    </div>
  );
}

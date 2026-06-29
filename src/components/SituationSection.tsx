import { situationCards } from '../data/timelineData';

export default function SituationSection() {
  return (
    <section className="situation-section" id="situation-section" aria-label="总体局势">
      <header className="situation-header">
        <h2 className="situation-title">脆弱停火之下</h2>
        <p className="situation-date">截至 2026 年 6 月 27 日</p>
      </header>

      <div className="situation-cards" role="list">
        {situationCards.map((card) => (
          <article key={card.id} className="situation-card" role="listitem">
            <div className="situation-card-header">
              <span className="situation-card-icon" aria-hidden="true">
                {card.icon}
              </span>
              <h3 className="situation-card-title">{card.title}</h3>
            </div>
            <p className="situation-card-content">{card.content}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

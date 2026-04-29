const ChartCard = ({ title, subtitle, children, className = '' }) => (
  <section className={`glass rounded-2xl p-4 md:p-5 flex flex-col overflow-hidden ${className}`}>
    <header className="mb-3 shrink-0 flex items-start justify-between gap-2">
      <div>
        <h2 className="font-heading text-lg text-ink md:text-xl">{title}</h2>
        <p className="text-xs text-mute md:text-sm">{subtitle}</p>
      </div>
    </header>
    <div className="flex-1 min-h-0 overflow-auto no-scrollbar">
      {children}
    </div>
  </section>
);

export default ChartCard;

export default function SectionHead({
  index,
  label,
  title,
  lede,
}: {
  index: string;
  label: string;
  title: string;
  lede?: string;
}) {
  return (
    <header className="sec-head">
      <p className="kicker">
        <span>{index}</span>
        {label}
      </p>
      <h2>{title}</h2>
      {lede ? <p className="sec-lede">{lede}</p> : null}
    </header>
  );
}

type SectionIntroProps = {
  index: string;
  eyebrow: string;
  title: string;
  description: string;
};

export default function SectionIntro({ title, description }: SectionIntroProps) {
  return (
    <div className="mx-auto max-w-4xl space-y-3 border-b border-slate-200 pb-5 text-center">
      <div className="space-y-3">
        <h2 className="font-display text-[1.75rem] font-semibold leading-[1.18] text-slate-900 sm:text-[2.15rem]">
          {title}
        </h2>
        <p className="mx-auto max-w-3xl text-[1rem] leading-8 text-slate-600">
          {description}
        </p>
      </div>
    </div>
  );
}

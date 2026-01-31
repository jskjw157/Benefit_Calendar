type SectionHeaderProps = {
  title: string;
  description?: string;
  action?: React.ReactNode;
};

export default function SectionHeader({
  title,
  description,
  action
}: SectionHeaderProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h3 className="section-title">{title}</h3>
        {description ? <p className="section-subtitle">{description}</p> : null}
      </div>
      {action ? <div>{action}</div> : null}
    </div>
  );
}

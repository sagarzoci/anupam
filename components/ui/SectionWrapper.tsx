interface SectionWrapperProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export function SectionWrapper({ children, className = "", id }: SectionWrapperProps) {
  return (
    <section id={id} className={`py-16 md:py-20 ${className}`}>
      <div className="container-custom">{children}</div>
    </section>
  );
}

interface SectionHeaderProps {
  badge?: string;
  title: string;
  subtitle?: string;
  centered?: boolean;
}

export function SectionHeader({ badge, title, subtitle, centered = true }: SectionHeaderProps) {
  return (
    <div className={`mb-12 ${centered ? "text-center" : ""}`}>
      {badge && (
        <span className="inline-block px-4 py-1.5 bg-blue-50 text-blue-700 text-xs font-semibold tracking-widest uppercase rounded-full mb-4">
          {badge}
        </span>
      )}
      <h2 className={`section-title ${centered ? "" : "text-left"} mb-2`}>{title}</h2>
      {subtitle && (
        <p className={`section-subtitle ${centered ? "" : "mx-0 text-left"}`}>{subtitle}</p>
      )}
    </div>
  );
}

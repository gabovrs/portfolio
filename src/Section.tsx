interface SectionProps {
  id: string;
  title?: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}

function Section({ id, title, children, icon }: SectionProps) {
  return (
    <section>
      {title && (
        <h2 id={id} className="text-2xl font-bold flex items-center gap-2">
          {icon}
          {title}
        </h2>
      )}
      <div className="mt-4">
        {children}
      </div>
    </section>
  )
}

export default Section
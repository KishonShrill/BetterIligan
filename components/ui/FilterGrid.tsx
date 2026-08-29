import FilterGridSidebar from "./FilterGridSidebar";

export default function FilterGrid({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`container mx-auto px-4 py-6 md:px-6 md:py-12 ${className}`}
    >
      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
        {children}
      </div>
    </div>
  );
}

FilterGrid.Sidebar = FilterGridSidebar;

interface ContentProps {
  title: string;
  itemCount: number;
  columns?: 1 | 2 | 3 | 4;
  hasSidebar?: boolean;
  children: React.ReactNode;
}

FilterGrid.Content = function FilterGridContent({
  title,
  itemCount,
  columns = 3,
  hasSidebar = true,
  children,
}: ContentProps) {
  const gridColsClass = {
    1: "lg:grid-cols-1",
    2: "lg:grid-cols-2",
    3: "lg:grid-cols-3",
    4: "lg:grid-cols-4",
  }[columns];

  const containerSpanClass = hasSidebar ? "lg:col-span-9" : "lg:col-span-12";

  return (
    <div className={containerSpanClass}>
      {/* Header: Title and Count Badge */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900">{title}</h2>
        <span className="rounded-full bg-slate-200 px-2.5 py-1 text-xs font-bold text-slate-500">
          {itemCount} Listed
        </span>
      </div>

      {/* The Grid */}
      <div className={`grid grid-cols-1 sm:grid-cols-2 ${gridColsClass} gap-5`}>
        {children}
      </div>
    </div>
  );
};

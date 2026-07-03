//app/components/shared/ManagementPageHeader.tsx  

interface ManagementPageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

export default function ManagementPageHeader({
  title,
  description,
  actions,
}: ManagementPageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        {description && (
          <p className="text-gray-500 mt-1">{description}</p>
        )}
      </div>

      {actions && (
        <div className="flex items-center gap-2">
          {actions}
        </div>
      )}
    </div>
  );
}
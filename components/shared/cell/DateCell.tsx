interface DateCellProps {
  date?: string | Date;
}

export const DateCell = ({ date }: DateCellProps) => {
  if (!date) return <span className="text-gray-500">N/A</span>;

  const dateObj = typeof date === "string" ? new Date(date) : date;
  
  return (
    <div className="text-sm">
      <div>{dateObj.toLocaleDateString("en-US", { month: "short", day: "numeric" })}</div>
      <div className="text-xs text-gray-500">
        {dateObj.toLocaleDateString("en-US", { year: "numeric" })}
      </div>
    </div>
  );
};
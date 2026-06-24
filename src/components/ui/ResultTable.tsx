import { TableData } from "@/content/siteContent";
import { cn } from "@/lib/utils";

type ResultTableProps = {
  data: TableData;
  compact?: boolean;
};

export default function ResultTable({ data, compact = false }: ResultTableProps) {
  return (
    <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-panel">
      <div className="border-b border-slate-200 px-6 py-5">
        <p className="text-sm leading-7 text-slate-600">{data.caption}</p>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-[11px] uppercase tracking-[0.24em] text-slate-500">
              <th className="sticky left-0 bg-slate-50 px-6 py-4 font-medium">Method</th>
              {data.columns.map((column) => (
                <th key={column} className="px-6 py-4 font-medium">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.rows.map((row) => {
              if (row.type === "group") {
                return (
                  <tr key={row.label} className="border-b border-slate-200 bg-slate-50/70">
                    <td
                      colSpan={data.columns.length + 1}
                      className="px-6 py-3 text-center text-xs italic tracking-[0.12em] text-slate-500"
                    >
                      {row.label}
                    </td>
                  </tr>
                );
              }

              return (
                <tr
                  key={row.label}
                  className={cn(
                    "border-b border-slate-100 last:border-b-0",
                    row.highlight ? "bg-brand-cyan/10" : "bg-white",
                  )}
                >
                  <th
                    className={cn(
                      "sticky left-0 whitespace-nowrap px-6 py-4",
                      row.highlight ? "bg-[#e8f7f5] text-slate-900" : "bg-white text-slate-700",
                      row.labelEmphasis === "bold" ? "font-semibold" : "font-medium",
                    )}
                  >
                    {row.label}
                  </th>
                  {row.values.map((value, index) => {
                    const cell = typeof value === "string" ? { value } : value;
                    return (
                      <td
                        key={`${row.label}-${index}`}
                        className={cn(
                          "whitespace-nowrap px-6 py-4 text-slate-600",
                          compact && "text-xs",
                          row.highlight && "font-semibold text-slate-900",
                          cell.emphasis === "bold" && "font-semibold text-slate-900",
                          cell.emphasis === "red" && "font-semibold text-red-600",
                          cell.emphasis === "blue" && "font-semibold text-blue-600",
                        )}
                      >
                        {cell.value}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {data.notes?.length ? (
        <div className="border-t border-slate-200 px-6 py-4">
          <div className="space-y-2 text-xs leading-6 text-slate-500">
            {data.notes.map((note) => (
              <p key={note}>{note}</p>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

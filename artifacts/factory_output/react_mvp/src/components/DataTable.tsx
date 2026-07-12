import type { RecordRow } from "../types";

type Props = {
  title: string;
  records: RecordRow[];
};

export default function DataTable({ title, records }: Props) {
  if (!records.length) {
    return (
      <section className="card card-wide">
        <h2>{title}</h2>
        <p className="empty-state">No records available.</p>
      </section>
    );
  }

  const columns = Object.keys(records[0]).slice(0, 8);

  return (
    <section className="card card-wide">
      <h2>{title}</h2>
      <p className="page-meta">{records.length} records</p>
      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column}>{column}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {records.map((row, index) => (
              <tr key={index}>
                {columns.map((column) => (
                  <td key={column}>{String(row[column] ?? "")}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

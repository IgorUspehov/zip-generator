import businessContent from "../data/businessContent.json";
import DataTable from "../components/DataTable";
import type { BusinessContent, RecordRow } from "../types";

const content = businessContent as BusinessContent;

export default function ClientsPage() {
  const records = (content.datasets?.clients || []) as RecordRow[];
  return <DataTable title="Clients" records={records} />;
}

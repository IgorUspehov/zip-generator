import businessContent from "../data/businessContent.json";
import DataTable from "../components/DataTable";
import type { BusinessContent, RecordRow } from "../types";

const content = businessContent as BusinessContent;

export default function StylistsPage() {
  const records = (content.datasets?.stylists || []) as RecordRow[];
  return <DataTable title="Stylists" records={records} />;
}

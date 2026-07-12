import businessContent from "../data/businessContent.json";
import DataTable from "../components/DataTable";
import type { BusinessContent, RecordRow } from "../types";

const content = businessContent as BusinessContent;

export default function ServicesPage() {
  const records = (content.datasets?.services || []) as RecordRow[];
  return <DataTable title="Services" records={records} />;
}

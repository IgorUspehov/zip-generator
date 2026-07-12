import businessContent from "../data/businessContent.json";
import DataTable from "../components/DataTable";
import type { BusinessContent, RecordRow } from "../types";

const content = businessContent as BusinessContent;

export default function BookingsPage() {
  const records = (content.datasets?.bookings || []) as RecordRow[];
  return <DataTable title="Bookings" records={records} />;
}

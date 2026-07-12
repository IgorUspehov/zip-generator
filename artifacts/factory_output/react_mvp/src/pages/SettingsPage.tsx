import businessContent from "../data/businessContent.json";
import type { BusinessContent } from "../types";

const content = businessContent as BusinessContent;

export default function SettingsPage() {
  return (
    <section className="card card-wide">
      <h2>Settings</h2>
      <dl>
        <dt>Business type</dt>
        <dd>{content.business_type}</dd>
        <dt>llm_used</dt>
        <dd>false</dd>
        <dt>source</dt>
        <dd>business_content.json</dd>
        <dt>module</dt>
        <dd>{content.module}</dd>
        <dt>status</dt>
        <dd>{content.status}</dd>
      </dl>
    </section>
  );
}

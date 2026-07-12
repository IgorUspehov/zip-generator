import businessContent from "../data/businessContent.json";
import type { BusinessContent } from "../types";

const content = businessContent as BusinessContent;

export default function DashboardPage() {
  const summary = content.dashboard?.summary || {};
  const widgets = content.dashboard?.widgets || [];

  return (
    <div>
      <header className="app-header">
        <p className="eyebrow">Business Dashboard</p>
        <h1>{content.business_type}</h1>
        <p className="subtitle">Status: {content.status} · llm_used=false</p>
      </header>

      <section className="card card-wide">
        <h2>Dataset Summary</h2>
        <div className="metric-grid">
          {Object.entries(summary).map(([key, value]) => (
            <div className="metric-card" key={key}>
              <span>{key}</span>
              <strong>{value}</strong>
            </div>
          ))}
        </div>
      </section>

      <section className="card card-wide">
        <h2>Dashboard Widgets</h2>
        <div className="metric-grid">
          {widgets.map((widget) => (
            <div className="metric-card" key={widget}>
              <span>{widget}</span>
              <strong>{content.dashboard?.metrics?.[widget] ?? 0}</strong>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

import { useEffect, useState } from "react";
import businessContent from "./data/businessContent.json";
import type { BusinessContent } from "./types";
import DashboardPage from "./pages/DashboardPage";
import SettingsPage from "./pages/SettingsPage";
import ClientsPage from "./pages/ClientsPage";
import ServicesPage from "./pages/ServicesPage";
import StylistsPage from "./pages/StylistsPage";
import BookingsPage from "./pages/BookingsPage";

const content = businessContent as BusinessContent;

const PAGE_COMPONENTS: Record<string, () => JSX.Element> = {
    dashboard: DashboardPage,
    settings: SettingsPage,
    clients: ClientsPage,
    services: ServicesPage,
    stylists: StylistsPage,
    bookings: BookingsPage,
};

function formatLabel(pageKey: string) {
  return pageKey
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export default function App() {
  const pageKeys = Object.keys(content.pages || {});
  const [activePage, setActivePage] = useState(pageKeys.includes("dashboard") ? "dashboard" : pageKeys[0]);
  const [businessName, setBusinessName] = useState(content.business_type);
  const [businessType, setBusinessType] = useState(content.business_type);
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const ActiveComponent = PAGE_COMPONENTS[activePage] || DashboardPage;

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash) {
      try {
        const config = JSON.parse(
          decodeURIComponent(escape(atob(hash)))
        );
        if (config.businessName) setBusinessName(config.businessName);
        if (config.businessType) setBusinessType(config.businessType);
        if (config.phone) setPhone(config.phone);
        if (config.email) setEmail(config.email);
        if (config.city) setCity(config.city);
      } catch (e) {}
    }
  }, []);

  return (
    <div className="mvp-layout">
      <aside className="mvp-sidebar">
        <h2>{businessName || formatLabel(businessType)}</h2>
        {(phone || email || city) && (
          <p className="mvp-sidebar-meta">
            {city && <span>{city}</span>}
            {phone && <span>{phone}</span>}
            {email && <span>{email}</span>}
          </p>
        )}
        <nav className="mvp-nav">
          {pageKeys.map((pageKey) => (
            <button
              key={pageKey}
              type="button"
              className={activePage === pageKey ? "active" : ""}
              onClick={() => setActivePage(pageKey)}
            >
              {formatLabel(pageKey)}
            </button>
          ))}
        </nav>
      </aside>
      <main className="mvp-main">
        <ActiveComponent />
      </main>
    </div>
  );
}

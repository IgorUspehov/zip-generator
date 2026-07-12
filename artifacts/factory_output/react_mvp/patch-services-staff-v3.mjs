// Патч v3 для react_mvp/src/App.jsx — добавляет рабочие формы добавления
// в разделах "Услуги" и "Врачи/Мастера" (по той же схеме, что и Клиенты).
//
// БЕЗОПАСНО: если якорь не совпадёт — скрипт остановится на этом шаге
// и не запишет файл.
//
// Запуск: node patch-services-staff-v3.mjs src/App.jsx

import fs from "fs";

const filePath = process.argv[2];
if (!filePath) {
  console.error("Укажи путь: node patch-services-staff-v3.mjs <путь к App.jsx>");
  process.exit(1);
}

let src = fs.readFileSync(filePath, "utf8");

function mustReplace(label, anchor, replacement) {
  if (!src.includes(anchor)) {
    console.error(`ОШИБКА на шаге "${label}": якорь не найден. Файл НЕ изменён.`);
    process.exit(1);
  }
  src = src.replace(anchor, replacement);
  console.log(`[ok] ${label}`);
}

// 1) хук для услуг — сразу после const services = ...
mustReplace(
  "хук useCrmRecords для услуг",
  `  const services = demoSource.services || [];`,
  `  const services = demoSource.services || [];
  const { records: crmServiceRecords, addRecord: addCrmService } = useCrmRecords(bootClientId, "services");
  const [crmShowAddService, setCrmShowAddService] = useState(false);
  const [crmServiceForm, setCrmServiceForm] = useState({ name: "", price: "", duration: "" });
  const displayServices = crmServiceRecords.length > 0 ? crmServiceRecords : services;
  async function handleAddCrmService() {
    if (!crmServiceForm.name.trim()) return;
    await addCrmService({ name: crmServiceForm.name.trim(), price: crmServiceForm.price.trim(), duration: crmServiceForm.duration.trim() });
    setCrmServiceForm({ name: "", price: "", duration: "" });
    setCrmShowAddService(false);
  }`
);

// 2) хук для врачей/персонала — сразу после const staff = ...
mustReplace(
  "хук useCrmRecords для персонала",
  `  const staff = demoSource.staff || [];`,
  `  const staff = demoSource.staff || [];
  const { records: crmStaffRecords, addRecord: addCrmStaff } = useCrmRecords(bootClientId, "staff");
  const [crmShowAddStaff, setCrmShowAddStaff] = useState(false);
  const [crmStaffForm, setCrmStaffForm] = useState({ name: "", role: "", status: "" });
  const displayStaff = crmStaffRecords.length > 0 ? crmStaffRecords : staff;
  async function handleAddCrmStaff() {
    if (!crmStaffForm.name.trim()) return;
    await addCrmStaff({ name: crmStaffForm.name.trim(), role: crmStaffForm.role.trim(), status: crmStaffForm.status.trim() || "available" });
    setCrmStaffForm({ name: "", role: "", status: "" });
    setCrmShowAddStaff(false);
  }`
);

// 3) раздел "Услуги" — кнопка + форма + живые данные
mustReplace(
  "форма добавления услуги",
  `        {serviceTabs.has(activeTab) && (
          <section className="panel domain-section">
            <h3>{getPageLabel(activeTab, language, effectiveBusinessType)}</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem" }}>
              {serviceRows.map((item) => (`,
  `        {serviceTabs.has(activeTab) && (
          <section className="panel domain-section">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", flexWrap: "wrap", gap: "0.75rem" }}>
              <h3 style={{ margin: 0 }}>{getPageLabel(activeTab, language, effectiveBusinessType)}</h3>
              <button type="button" onClick={() => setCrmShowAddService(true)} style={{ background: "var(--color-accent, #1d4ed8)", color: "#ffffff", border: "none", borderRadius: "10px", padding: "0.55rem 1rem", fontWeight: 700, fontSize: "0.88rem", cursor: "pointer", boxShadow: "0 4px 12px rgba(15, 23, 42, 0.12)" }}>
                {t.addService ?? "Add Service"}
              </button>
            </div>
            {crmShowAddService && (
              <div style={{ marginBottom: "1rem", padding: "1rem", border: "1px solid #e2e8f0", borderRadius: "12px", background: "#f8fafc" }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "0.5rem", marginBottom: "0.75rem" }}>
                  <input placeholder={t.name} value={crmServiceForm.name} onChange={(e) => setCrmServiceForm((f) => ({ ...f, name: e.target.value }))} style={{ border: "1px solid #cbd5e1", borderRadius: "8px", padding: "0.5rem 0.75rem", fontSize: "0.88rem" }} />
                  <input placeholder="€80" value={crmServiceForm.price} onChange={(e) => setCrmServiceForm((f) => ({ ...f, price: e.target.value }))} style={{ border: "1px solid #cbd5e1", borderRadius: "8px", padding: "0.5rem 0.75rem", fontSize: "0.88rem" }} />
                  <input placeholder="30 min" value={crmServiceForm.duration} onChange={(e) => setCrmServiceForm((f) => ({ ...f, duration: e.target.value }))} style={{ border: "1px solid #cbd5e1", borderRadius: "8px", padding: "0.5rem 0.75rem", fontSize: "0.88rem" }} />
                </div>
                <button type="button" onClick={handleAddCrmService} style={{ background: "var(--color-accent, #1d4ed8)", color: "#fff", border: "none", borderRadius: "8px", padding: "0.5rem 1rem", fontWeight: 600, cursor: "pointer", marginRight: "0.5rem" }}>
                  {t.save ?? "Save"}
                </button>
                <button type="button" onClick={() => setCrmShowAddService(false)} style={{ background: "transparent", color: "#64748b", border: "none", borderRadius: "8px", padding: "0.5rem 1rem", cursor: "pointer" }}>
                  {t.cancel ?? "Cancel"}
                </button>
              </div>
            )}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem" }}>
              {displayServices.map((item) => (`
);

// 4) раздел "Врачи/Мастера" — кнопка + форма + живые данные
mustReplace(
  "форма добавления сотрудника",
  `        {staffTabs.has(activeTab) && (pages ? pages.includes(activeTab) || staffTabs.has(activeTab) : flags.staff) && (
          <section className="panel domain-section">
            <h3>{getPageLabel(activeTab, language, effectiveBusinessType)}</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem" }}>
              {staff.map((person) => (`,
  `        {staffTabs.has(activeTab) && (pages ? pages.includes(activeTab) || staffTabs.has(activeTab) : flags.staff) && (
          <section className="panel domain-section">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", flexWrap: "wrap", gap: "0.75rem" }}>
              <h3 style={{ margin: 0 }}>{getPageLabel(activeTab, language, effectiveBusinessType)}</h3>
              <button type="button" onClick={() => setCrmShowAddStaff(true)} style={{ background: "var(--color-accent, #1d4ed8)", color: "#ffffff", border: "none", borderRadius: "10px", padding: "0.55rem 1rem", fontWeight: 700, fontSize: "0.88rem", cursor: "pointer", boxShadow: "0 4px 12px rgba(15, 23, 42, 0.12)" }}>
                {t.addStaff ?? "Add Staff"}
              </button>
            </div>
            {crmShowAddStaff && (
              <div style={{ marginBottom: "1rem", padding: "1rem", border: "1px solid #e2e8f0", borderRadius: "12px", background: "#f8fafc" }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "0.5rem", marginBottom: "0.75rem" }}>
                  <input placeholder={t.name} value={crmStaffForm.name} onChange={(e) => setCrmStaffForm((f) => ({ ...f, name: e.target.value }))} style={{ border: "1px solid #cbd5e1", borderRadius: "8px", padding: "0.5rem 0.75rem", fontSize: "0.88rem" }} />
                  <input placeholder={t.role} value={crmStaffForm.role} onChange={(e) => setCrmStaffForm((f) => ({ ...f, role: e.target.value }))} style={{ border: "1px solid #cbd5e1", borderRadius: "8px", padding: "0.5rem 0.75rem", fontSize: "0.88rem" }} />
                  <input placeholder={t.available ?? "available"} value={crmStaffForm.status} onChange={(e) => setCrmStaffForm((f) => ({ ...f, status: e.target.value }))} style={{ border: "1px solid #cbd5e1", borderRadius: "8px", padding: "0.5rem 0.75rem", fontSize: "0.88rem" }} />
                </div>
                <button type="button" onClick={handleAddCrmStaff} style={{ background: "var(--color-accent, #1d4ed8)", color: "#fff", border: "none", borderRadius: "8px", padding: "0.5rem 1rem", fontWeight: 600, cursor: "pointer", marginRight: "0.5rem" }}>
                  {t.save ?? "Save"}
                </button>
                <button type="button" onClick={() => setCrmShowAddStaff(false)} style={{ background: "transparent", color: "#64748b", border: "none", borderRadius: "8px", padding: "0.5rem 1rem", cursor: "pointer" }}>
                  {t.cancel ?? "Cancel"}
                </button>
              </div>
            )}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem" }}>
              {displayStaff.map((person) => (`
);

fs.writeFileSync(filePath, src, "utf8");
console.log("\nГотово! Услуги и Врачи теперь тоже умеют сохранять. Дальше: npm run build для проверки.");

// Патч v2 для react_mvp/src/App.jsx — точный, построен по реальному
// коду файла (не по догадкам). Добавляет рабочую форму добавления
// клиента в разделе "Клиенты/Пациенты/Участники" с сохранением в Firestore.
//
// БЕЗОПАСНО: если якорь не совпадёт 1-в-1 — скрипт остановится на этом
// шаге и НЕ запишет файл, ничего не сломает.
//
// Запуск: node patch-clients-crud-v2.mjs src/App.jsx

import fs from "fs";

const filePath = process.argv[2];
if (!filePath) {
  console.error("Укажи путь: node patch-clients-crud-v2.mjs <путь к App.jsx>");
  process.exit(1);
}

let src = fs.readFileSync(filePath, "utf8");

function mustReplace(label, anchor, replacement) {
  if (!src.includes(anchor)) {
    console.error(`ОШИБКА на шаге "${label}": якорь не найден. Файл НЕ изменён.`);
    console.error("Похоже, файл успел измениться. Нужен свежий sed-вывод вокруг этого места.");
    process.exit(1);
  }
  src = src.replace(anchor, replacement);
  console.log(`[ok] ${label}`);
}

// 1) импорт хука — сразу после импорта image-library.js
mustReplace(
  "импорт useCrmRecords",
  `import { getGalleryImagePaths, getHeroImagePath } from "./lib/image-library.js";`,
  `import { getGalleryImagePaths, getHeroImagePath } from "./lib/image-library.js";\nimport { useCrmRecords } from "./lib/useCrmRecords.js";`
);

// 2) хук + состояние формы — сразу после const clients = ...
mustReplace(
  "хук useCrmRecords + состояние формы",
  `  const clients = demoSource.clients || [];`,
  `  const clients = demoSource.clients || [];
  const { records: crmClientRecords, addRecord: addCrmClient } = useCrmRecords(bootClientId, "clients");
  const [crmShowAddClient, setCrmShowAddClient] = useState(false);
  const [crmClientForm, setCrmClientForm] = useState({ name: "", note: "", phone: "" });
  const displayClients = crmClientRecords.length > 0 ? crmClientRecords : clients;
  async function handleAddCrmClient() {
    if (!crmClientForm.name.trim()) return;
    await addCrmClient({ name: crmClientForm.name.trim(), note: crmClientForm.note.trim(), phone: crmClientForm.phone.trim(), visits: 0 });
    setCrmClientForm({ name: "", note: "", phone: "" });
    setCrmShowAddClient(false);
  }`
);

// 3) кнопка "Добавить клиента" — добавляем onClick + форму добавления
const buttonBlockAnchor = `            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", flexWrap: "wrap", gap: "0.75rem" }}>
              <h3 style={{ margin: 0 }}>{getPageLabel(activeTab, language, effectiveBusinessType)}</h3>
              <button
                type="button"
                style={{
                  background: "var(--color-accent, #1d4ed8)",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "10px",
                  padding: "0.55rem 1rem",
                  fontWeight: 700,
                  fontSize: "0.88rem",
                  cursor: "pointer",
                  boxShadow: "0 4px 12px rgba(15, 23, 42, 0.12)",
                }}
              >
                {t.addClient}
              </button>
            </div>`;

const buttonBlockReplacement = `            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", flexWrap: "wrap", gap: "0.75rem" }}>
              <h3 style={{ margin: 0 }}>{getPageLabel(activeTab, language, effectiveBusinessType)}</h3>
              <button
                type="button"
                onClick={() => setCrmShowAddClient(true)}
                style={{
                  background: "var(--color-accent, #1d4ed8)",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "10px",
                  padding: "0.55rem 1rem",
                  fontWeight: 700,
                  fontSize: "0.88rem",
                  cursor: "pointer",
                  boxShadow: "0 4px 12px rgba(15, 23, 42, 0.12)",
                }}
              >
                {t.addClient}
              </button>
            </div>
            {crmShowAddClient && (
              <div style={{ marginBottom: "1rem", padding: "1rem", border: "1px solid #e2e8f0", borderRadius: "12px", background: "#f8fafc" }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "0.5rem", marginBottom: "0.75rem" }}>
                  <input
                    placeholder={t.name}
                    value={crmClientForm.name}
                    onChange={(e) => setCrmClientForm((f) => ({ ...f, name: e.target.value }))}
                    style={{ border: "1px solid #cbd5e1", borderRadius: "8px", padding: "0.5rem 0.75rem", fontSize: "0.88rem" }}
                  />
                  <input
                    placeholder={t.phone ?? "Phone"}
                    value={crmClientForm.phone}
                    onChange={(e) => setCrmClientForm((f) => ({ ...f, phone: e.target.value }))}
                    style={{ border: "1px solid #cbd5e1", borderRadius: "8px", padding: "0.5rem 0.75rem", fontSize: "0.88rem" }}
                  />
                  <input
                    placeholder={t.note}
                    value={crmClientForm.note}
                    onChange={(e) => setCrmClientForm((f) => ({ ...f, note: e.target.value }))}
                    style={{ border: "1px solid #cbd5e1", borderRadius: "8px", padding: "0.5rem 0.75rem", fontSize: "0.88rem" }}
                  />
                </div>
                <button type="button" onClick={handleAddCrmClient} style={{ background: "var(--color-accent, #1d4ed8)", color: "#fff", border: "none", borderRadius: "8px", padding: "0.5rem 1rem", fontWeight: 600, cursor: "pointer", marginRight: "0.5rem" }}>
                  {t.save ?? "Save"}
                </button>
                <button type="button" onClick={() => setCrmShowAddClient(false)} style={{ background: "transparent", color: "#64748b", border: "none", borderRadius: "8px", padding: "0.5rem 1rem", cursor: "pointer" }}>
                  {t.cancel ?? "Cancel"}
                </button>
              </div>
            )}`;

mustReplace("кнопка + форма добавления клиента", buttonBlockAnchor, buttonBlockReplacement);

// 4) таблица показывает displayClients вместо статичных clients
mustReplace(
  "таблица читает живые данные",
  `{clients.map((item) => (`,
  `{displayClients.map((item) => (`
);

fs.writeFileSync(filePath, src, "utf8");
console.log("\nГотово! Все 4 шага применены. Дальше: npm run build для проверки.");

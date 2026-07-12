// Патч для react_mvp/src/App.jsx — добавляет реальное сохранение
// в разделе "Клиенты/Пациенты/Участники" (везде, где сейчас рендерится
// кнопка "Добавить клиента" без действия).
//
// БЕЗОПАСНО: если точный якорный фрагмент кода не найден — скрипт
// ничего не меняет и выводит ошибку, вместо того чтобы гадать и
// портить файл.
//
// Запуск: node patch-clients-crud.mjs /путь/к/react_mvp/src/App.jsx

import fs from "fs";

const filePath = process.argv[2];
if (!filePath) {
  console.error("Укажи путь к App.jsx: node patch-clients-crud.mjs <путь>");
  process.exit(1);
}

let src = fs.readFileSync(filePath, "utf8");
const original = src;

// --- Якорь 1: импорт хука (добавляем в самое начало файла, безопасно
// независимо от остальных импортов) ---
const importLine = `import { useCrmRecords } from "./lib/useCrmRecords.js";\n`;
if (!src.includes('useCrmRecords.js')) {
  src = importLine + src;
  console.log("[1/3] Импорт useCrmRecords добавлен.");
} else {
  console.log("[1/3] Импорт уже есть, пропускаю.");
}

// --- Якорь 2: кнопка "Добавить клиента" — добавляем onClick ---
const buttonAnchor =
  `p.jsx("button",{type:"button",style:{background:"var(--color-accent, #1d4ed8)",color:"#ffffff",border:"none",borderRadius:"10px",padding:"0.55rem 1rem",fontWeight:700,fontSize:"0.88rem",cursor:"pointer",boxShadow:"0 4px 12px rgba(15, 23, 42, 0.12)"},children:ue.addClient}`;

if (!src.includes(buttonAnchor)) {
  console.error("[2/3] ОШИБКА: якорь кнопки 'Добавить клиента' не найден.");
  console.error("Файл НЕ изменён. Пришли актуальный фрагмент вокруг 'ue.addClient' — поправим якорь.");
  process.exit(1);
}

const buttonReplacement =
  `p.jsx("button",{type:"button",onClick:()=>setCrmShowAdd(true),style:{background:"var(--color-accent, #1d4ed8)",color:"#ffffff",border:"none",borderRadius:"10px",padding:"0.55rem 1rem",fontWeight:700,fontSize:"0.88rem",cursor:"pointer",boxShadow:"0 4px 12px rgba(15, 23, 42, 0.12)"},children:ue.addClient}`;

src = src.replace(buttonAnchor, buttonReplacement);
console.log("[2/3] onClick на кнопку 'Добавить клиента' добавлен.");

// --- Якорь 3: добавляем форму + состояние перед началом функции компонента ---
// Ищем строку объявления функции tg() (имя из исходника) и вставляем
// хук + состояние сразу после открывающей скобки.
const funcAnchor = `function tg(){`;
if (!src.includes(funcAnchor)) {
  console.error("[3/3] ОШИБКА: не найдено начало функции компонента 'function tg(){'.");
  console.error("Импорт и onClick уже применены, но форма добавления не вставлена.");
  console.error("Файл частично изменён — пришли актуальный код вокруг начала главной функции, доделаем форму отдельным патчем.");
  fs.writeFileSync(filePath, src, "utf8");
  process.exit(1);
}

const hookAndStateInjection = `${funcAnchor}
  const __crmClientId = (typeof window!=="undefined" ? (new URLSearchParams(window.location.search)).get("clientId") : null);
  const [crmShowAdd, setCrmShowAdd] = useState(false);
  const [crmForm, setCrmForm] = useState({ name: "", phone: "", note: "" });
  const __crm = useCrmRecords(__crmClientId, "clients");
  async function __crmSaveClient() {
    if (!crmForm.name.trim()) return;
    await __crm.addRecord({ name: crmForm.name.trim(), phone: crmForm.phone.trim(), note: crmForm.note.trim(), visits: 0 });
    setCrmForm({ name: "", phone: "", note: "" });
    setCrmShowAdd(false);
  }
`;

src = src.replace(funcAnchor, hookAndStateInjection);
console.log("[3/3] useCrmRecords + форма-состояние вставлены в начало компонента.");

fs.writeFileSync(filePath, src, "utf8");
console.log("\nГотово. Резервная копия не создавалась — если что-то пойдёт не так, у тебя есть git, чтобы откатить (git diff / git checkout -- <файл>).");

// Патч v4 — заменяет хардкод-английские заглушки ("Add Staff", "Save",
// "Cancel" и т.д.) на нормальный трёхъязычный текст по уже существующему
// в файле паттерну (language === "de" ? ... : language === "en" ? ... : ...).
//
// Один патч чинит это сразу для ВСЕХ ниш — это не нишевая настройка,
// это общий код react_mvp.
//
// БЕЗОПАСНО: если якорь не найден — файл не меняется.
//
// Запуск: node patch-i18n-fix-v4.mjs src/App.jsx

import fs from "fs";

const filePath = process.argv[2];
if (!filePath) {
  console.error("Укажи путь: node patch-i18n-fix-v4.mjs <путь к App.jsx>");
  process.exit(1);
}

let src = fs.readFileSync(filePath, "utf8");
let totalReplacements = 0;

function mustReplaceAll(label, anchor, replacement) {
  const count = src.split(anchor).length - 1;
  if (count === 0) {
    console.error(`ОШИБКА на шаге "${label}": якорь не найден. Файл НЕ изменён.`);
    process.exit(1);
  }
  src = src.split(anchor).join(replacement);
  totalReplacements += count;
  console.log(`[ok] ${label} — заменено мест: ${count}`);
}

mustReplaceAll(
  "Save → трёхъязычный",
  `{t.save ?? "Save"}`,
  `{language === "de" ? "Speichern" : language === "en" ? "Save" : "Сохранить"}`
);

mustReplaceAll(
  "Cancel → трёхъязычный",
  `{t.cancel ?? "Cancel"}`,
  `{language === "de" ? "Abbrechen" : language === "en" ? "Cancel" : "Отмена"}`
);

mustReplaceAll(
  "Phone placeholder → трёхъязычный",
  `t.phone ?? "Phone"`,
  `language === "de" ? "Telefon" : language === "en" ? "Phone" : "Телефон"`
);

mustReplaceAll(
  "Add Service → трёхъязычный",
  `{t.addService ?? "Add Service"}`,
  `{language === "de" ? "Leistung hinzufügen" : language === "en" ? "Add Service" : "Добавить услугу"}`
);

mustReplaceAll(
  "Add Staff → трёхъязычный",
  `{t.addStaff ?? "Add Staff"}`,
  `{language === "de" ? "Mitarbeiter hinzufügen" : language === "en" ? "Add Staff" : "Добавить сотрудника"}`
);

mustReplaceAll(
  "available placeholder → трёхъязычный",
  `t.available ?? "available"`,
  `language === "de" ? "Verfügbar" : language === "en" ? "Available" : "Доступен"`
);

fs.writeFileSync(filePath, src, "utf8");
console.log(`\nГотово! Всего заменено: ${totalReplacements}. Дальше: npm run build.`);

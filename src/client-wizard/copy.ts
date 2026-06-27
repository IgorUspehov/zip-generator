export type UiLang = "en" | "de" | "ru";

export type Sector = { id: string; icon: string; label: string };

export type CopyBundle = {
  s1_label: string;
  s1_h: string;
  s1_sub: string;
  no1: string;
  no2: string;
  no3: string;
  lbl_name: string;
  ph_name: string;
  lbl_biz: string;
  ph_biz: string;
  lbl_email: string;
  s2_label: string;
  s2_placeholder: string;
  s2_h: string;
  s2_sub: string;
  s3_label: string;
  s3_h: string;
  s3_sub: string;
  btn_next: string;
  btn_back: string;
  btn_generate: string;
  btn_yes: string;
  btn_no: string;
  btn_restart: string;
  s4_h: string;
  build_steps: string[];
  s5_live: string;
  s5_q: string;
  s6_badge: string;
  s6_h: string;
  s6_dl: string;
  dl_domain: string;
  sectors: Sector[];
  langs: string[];
};

const T: Record<UiLang, CopyBundle> = {
  en: {
    s1_label: "Step 1 of 3",
    s1_h: "Fill out the questionnaire.",
    s1_sub: "Free demo",
    no1: "Without code",
    no2: "Without a programmer",
    no3: "Without AI",
    lbl_name: "Your name",
    ph_name: "Anna Müller",
    lbl_biz: "Business name",
    ph_biz: "Munich Dental Clinic",
    lbl_email: "Email",
    s2_label: "Step 2 of 3",
    s2_placeholder: "— Select sector —",
    s2_h: "Business sector",
    s2_sub: "Select the sector that best describes your business.",
    s3_label: "Step 3 of 3",
    s3_h: "Platform language?",
    s3_sub: "The language your clients will use on the platform.",
    btn_next: "Continue",
    btn_back: "Back",
    btn_generate: "Generate MVP",
    btn_yes: "Yes, looks great",
    btn_no: "Regenerate",
    btn_restart: "Start over",
    s4_h: "Building your platform…",
    build_steps: [
      "Analysing your business",
      "Selecting platform modules",
      "Building interface",
      "Connecting services",
      "Preparing deployment",
      "Packaging assets",
    ],
    s5_live: "Live Preview",
    s5_q: "Do you like the result?",
    s6_badge: "Platform Ready",
    s6_h: "Your MVP is ready",
    s6_dl: "Download your result",
    dl_domain: "Domain",
    sectors: [
      { id: "health", icon: "🏥", label: "Healthcare / Clinic" },
      { id: "dental", icon: "🦷", label: "Dental / Dentistry" },
      { id: "beauty", icon: "💇", label: "Beauty / Salon" },
      { id: "massage", icon: "💆", label: "Massage / SPA" },
      { id: "tech", icon: "💻", label: "Technology / Platform" },
      { id: "shop", icon: "🛍️", label: "Retail / E-Commerce" },
      { id: "logistics", icon: "🚚", label: "Logistics / Delivery" },
      { id: "food", icon: "🍽️", label: "Restaurant / Café" },
      { id: "education", icon: "🎓", label: "Education / Courses" },
      { id: "fitness", icon: "💪", label: "Fitness / Wellness" },
      { id: "car_service", icon: "🚗", label: "Car Service / Auto" },
      { id: "realestate", icon: "🏠", label: "Real Estate" },
      { id: "hotel", icon: "🏨", label: "Hotel / Hospitality" },
    ],
    langs: ["English", "Deutsch", "Русский"],
  },
  de: {
    s1_label: "Schritt 1 von 3",
    s1_h: "Füllen Sie den Fragebogen aus.",
    s1_sub: "Kostenloses Demo",
    no1: "Ohne Code",
    no2: "Ohne Entwickler",
    no3: "Ohne KI",
    lbl_name: "Ihr Name",
    ph_name: "Anna Müller",
    lbl_biz: "Unternehmensname",
    ph_biz: "Münchner Zahnklinik",
    lbl_email: "E-Mail",
    s2_label: "Schritt 2 von 3",
    s2_placeholder: "— Branche auswählen —",
    s2_h: "Branche",
    s2_sub: "Wählen Sie die Branche, die Ihr Unternehmen am besten beschreibt.",
    s3_label: "Schritt 3 von 3",
    s3_h: "Plattformsprache?",
    s3_sub: "Die Sprache, die Ihre Kunden auf der Plattform verwenden.",
    btn_next: "Weiter",
    btn_back: "Zurück",
    btn_generate: "MVP generieren",
    btn_yes: "Ja, sieht gut aus",
    btn_no: "Neu generieren",
    btn_restart: "Von vorne",
    s4_h: "Ihre Plattform wird gebaut…",
    build_steps: [
      "Analyse Ihres Unternehmens",
      "Auswahl der Plattformmodule",
      "Oberfläche wird gebaut",
      "Dienste werden verbunden",
      "Deployment wird vorbereitet",
      "Assets werden verpackt",
    ],
    s5_live: "Live-Vorschau",
    s5_q: "Gefällt Ihnen das Ergebnis?",
    s6_badge: "Plattform bereit",
    s6_h: "Ihr MVP ist fertig",
    s6_dl: "Ergebnis herunterladen",
    dl_domain: "Domain",
    sectors: [
      { id: "health", icon: "🏥", label: "Gesundheit / Klinik" },
      { id: "dental", icon: "🦷", label: "Zahnmedizin / Zahnarzt" },
      { id: "beauty", icon: "💇", label: "Schönheit / Salon" },
      { id: "massage", icon: "💆", label: "Massage / SPA" },
      { id: "tech", icon: "💻", label: "Technologie / Plattform" },
      { id: "shop", icon: "🛍️", label: "Handel / E-Commerce" },
      { id: "logistics", icon: "🚚", label: "Logistik / Lieferung" },
      { id: "food", icon: "🍽️", label: "Restaurant / Café" },
      { id: "education", icon: "🎓", label: "Bildung / Kurse" },
      { id: "fitness", icon: "💪", label: "Fitness / Wellness" },
      { id: "car_service", icon: "🚗", label: "Autowerkstatt / KFZ" },
      { id: "realestate", icon: "🏠", label: "Immobilien" },
      { id: "hotel", icon: "🏨", label: "Hotel / Unterkunft" },
    ],
    langs: ["English", "Deutsch", "Русский"],
  },
  ru: {
    s1_label: "Шаг 1 из 3",
    s1_h: "Заполните опросник.",
    s1_sub: "Бесплатное демо",
    no1: "Без кода",
    no2: "Без программиста",
    no3: "Без ИИ",
    lbl_name: "Ваше имя",
    ph_name: "Анна Мюллер",
    lbl_biz: "Название бизнеса",
    ph_biz: "Стоматология Мюнхен",
    lbl_email: "Email",
    s2_label: "Шаг 2 из 3",
    s2_placeholder: "— Выберите сферу —",
    s2_h: "Сфера бизнеса",
    s2_sub: "Выберите сферу, которая лучше всего описывает ваш бизнес.",
    s3_label: "Шаг 3 из 3",
    s3_h: "Язык платформы?",
    s3_sub: "Язык, который ваши клиенты будут использовать на платформе.",
    btn_next: "Продолжить",
    btn_back: "Назад",
    btn_generate: "Создать MVP",
    btn_yes: "Да, отлично",
    btn_no: "Пересобрать",
    btn_restart: "Начать заново",
    s4_h: "Строим вашу платформу…",
    build_steps: [
      "Анализ бизнеса",
      "Выбор модулей платформы",
      "Сборка интерфейса",
      "Подключение сервисов",
      "Подготовка деплоя",
      "Упаковка активов",
    ],
    s5_live: "Live Preview",
    s5_q: "Нравится результат?",
    s6_badge: "Платформа готова",
    s6_h: "Ваш MVP готов",
    s6_dl: "Скачать результат",
    dl_domain: "Домен",
    sectors: [
      { id: "health", icon: "🏥", label: "Клиника / Врач" },
      { id: "dental", icon: "🦷", label: "Стоматология" },
      { id: "beauty", icon: "💇", label: "Салон красоты" },
      { id: "massage", icon: "💆", label: "Массаж / СПА" },
      { id: "tech", icon: "💻", label: "Технологии / Платформа" },
      { id: "shop", icon: "🛍️", label: "Розница / E-Commerce" },
      { id: "logistics", icon: "🚚", label: "Логистика / Доставка" },
      { id: "food", icon: "🍽️", label: "Ресторан / Кафе" },
      { id: "education", icon: "🎓", label: "Образование / Курсы" },
      { id: "fitness", icon: "💪", label: "Фитнес" },
      { id: "car_service", icon: "🚗", label: "Автосервис" },
      { id: "realestate", icon: "🏠", label: "Недвижимость" },
      { id: "hotel", icon: "🏨", label: "Отель / Гостиница" },
    ],
    langs: ["English", "Deutsch", "Русский"],
  },
};

export function getCopy(lang: UiLang): CopyBundle {
  return T[lang] ?? T.en;
}

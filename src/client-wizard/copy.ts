export type UiLang = "en" | "de" | "ru";

export type Sector = { id: string; icon: string; label: string };

export type CopyBundle = {
  s1_label: string;
  s1_intro: string;
  lbl_name: string;
  ph_name: string;
  lbl_biz: string;
  ph_biz: string;
  lbl_email: string;
  s2_label: string;
  s2_placeholder: string;
  s2_h: string;
  s2_sub: string;
  agb_accept: string;
  agb_terms: string;
  agb_and: string;
  agb_privacy: string;
  btn_next: string;
  btn_back: string;
  btn_generate: string;
  btn_review: string;
  btn_yes: string;
  btn_no: string;
  btn_restart: string;
  s4_h: string;
  s4_generating: string;
  s4_ready: string;
  s4_publishing: string;
  s4_copy_link: string;
  s4_open: string;
  build_steps: string[];
  s5_live: string;
  s5_q: string;
  s6_pay_h: string;
  s6_pay_button: string;
  s6_promo_button: string;
  s6_promo_placeholder: string;
  s6_promo_invalid: string;
  s6_promo_unlock: string;
  s4_build_done: string;
  s6_badge: string;
  s6_h: string;
  s6_dl: string;
  dl_domain: string;
  s_processing_title: string;
  s_processing_sub: string;
  s_processing_timeout_title: string;
  s_processing_timeout_sub: string;
  s_processing_contact: string;
  s_payment_error_title: string;
  s_payment_error_sub: string;
  sectors: Sector[];
};

const T: Record<UiLang, CopyBundle> = {
  en: {
    s1_label: "Step 1 of 2",
    s1_intro: "Fill out the questionnaire about yourself",
    lbl_name: "Your name",
    ph_name: "Anna Müller",
    lbl_biz: "Business name",
    ph_biz: "Munich Dental Clinic",
    lbl_email: "Email",
    s2_label: "Step 2 of 2",
    s2_placeholder: "— Select sector —",
    s2_h: "Business sector",
    s2_sub: "Select the sector that best describes your business.",
    agb_accept: "I accept the",
    agb_terms: "Terms",
    agb_and: "and",
    agb_privacy: "Privacy Policy",
    btn_next: "Continue →",
    btn_back: "← Back",
    btn_generate: "Generate Website+CRM →",
    btn_review: "Review preview & approve →",
    btn_yes: "Yes, looks great",
    btn_no: "Regenerate",
    btn_restart: "Start over",
    s4_h: "Assembling your Website+CRM…",
    s4_generating: "Generating your Website+CRM...",
    s4_ready: "Your Website+CRM is ready",
    s4_publishing: "⏳ Website+CRM is publishing... {n} sec left",
    s4_copy_link: "Copy link",
    s4_open: "Open Website+CRM",
    build_steps: [
      "Analysing your business",
      "Selecting Website+CRM modules",
      "Building interface",
      "Connecting services",
      "Preparing deployment",
      "Packaging assets",
    ],
    s5_live: "Live Preview",
    s5_q: "Do you like the result?",
    s6_pay_h: "Unlock your Website+CRM",
    s6_pay_button: "Pay €99 — once, forever, no subscription",
    s6_promo_button: "Promo code",
    s6_promo_placeholder: "Promo code (optional)",
    s6_promo_invalid: "Invalid promo code",
    s6_promo_unlock: "Get for free →",
    s4_build_done: "Your site is ready — review the preview",
    s6_badge: "Platform Ready",
    s6_h: "Your MVP is ready",
    s6_dl: "Download your result",
    dl_domain: "Domain",
    s_processing_title: "Payment received — preparing your site",
    s_processing_sub: "Your payment was successful. We are publishing your Website+CRM. This usually takes under a minute.",
    s_processing_timeout_title: "Still preparing your site",
    s_processing_timeout_sub: "This is taking longer than usual. Please contact us and we will help you right away.",
    s_processing_contact: "Contact support",
    s_payment_error_title: "Something went wrong with payment",
    s_payment_error_sub: "We could not confirm your payment. Please contact us and we will sort it out.",
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
  },
  de: {
    s1_label: "Schritt 1 von 2",
    s1_intro: "Fülle den Fragebogen über dich aus",
    lbl_name: "Ihr Name",
    ph_name: "Anna Müller",
    lbl_biz: "Unternehmensname",
    ph_biz: "Münchner Zahnklinik",
    lbl_email: "E-Mail",
    s2_label: "Schritt 2 von 2",
    s2_placeholder: "— Branche auswählen —",
    s2_h: "Branche",
    s2_sub: "Wählen Sie die Branche, die Ihr Unternehmen am besten beschreibt.",
    agb_accept: "Ich akzeptiere die",
    agb_terms: "AGB",
    agb_and: "und die",
    agb_privacy: "Datenschutzerklärung",
    btn_next: "Weiter →",
    btn_back: "← Zurück",
    btn_generate: "Website+CRM erstellen →",
    btn_review: "Vorschau ansehen und freigeben →",
    btn_yes: "Ja, sieht gut aus",
    btn_no: "Neu generieren",
    btn_restart: "Von vorne",
    s4_h: "Wir erstellen Ihr Website+CRM…",
    s4_generating: "Wir erstellen Ihr Website+CRM...",
    s4_ready: "Ihr Website+CRM ist bereit",
    s4_publishing: "⏳ Website+CRM wird veröffentlicht... noch {n} Sek",
    s4_copy_link: "Link kopieren",
    s4_open: "Website+CRM öffnen",
    build_steps: [
      "Analyse Ihres Unternehmens",
      "Auswahl der Website+CRM-Module",
      "Oberfläche wird gebaut",
      "Dienste werden verbunden",
      "Deployment wird vorbereitet",
      "Assets werden verpackt",
    ],
    s5_live: "Live-Vorschau",
    s5_q: "Gefällt dir das Ergebnis?",
    s6_pay_h: "Website+CRM freischalten",
    s6_pay_button: "€99 zahlen — einmalig, für immer, kein Abo",
    s6_promo_button: "Promo-Code",
    s6_promo_placeholder: "Promo-Code (optional)",
    s6_promo_invalid: "Ungültiger Promo-Code",
    s6_promo_unlock: "Kostenlos erhalten →",
    s4_build_done: "Deine Seite ist fertig — sieh dir die Vorschau an",
    s6_badge: "Plattform bereit",
    s6_h: "Ihr MVP ist fertig",
    s6_dl: "Ergebnis herunterladen",
    dl_domain: "Domain",
    s_processing_title: "Zahlung erhalten — wir bereiten Ihre Seite vor",
    s_processing_sub: "Ihre Zahlung war erfolgreich. Wir veröffentlichen Ihr Website+CRM. Das dauert meist unter einer Minute.",
    s_processing_timeout_title: "Ihre Seite wird noch vorbereitet",
    s_processing_timeout_sub: "Das dauert länger als üblich. Schreiben Sie uns — wir helfen sofort.",
    s_processing_contact: "Support kontaktieren",
    s_payment_error_title: "Bei der Zahlung ist etwas schiefgelaufen",
    s_payment_error_sub: "Wir konnten Ihre Zahlung nicht bestätigen. Schreiben Sie uns — wir klären das.",
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
  },
  ru: {
    s1_label: "Шаг 1 из 2",
    s1_intro: "Заполни опросник о себе",
    lbl_name: "Ваше имя",
    ph_name: "Анна Мюллер",
    lbl_biz: "Название бизнеса",
    ph_biz: "Стоматология Мюнхен",
    lbl_email: "Email",
    s2_label: "Шаг 2 из 2",
    s2_placeholder: "— Выберите сферу —",
    s2_h: "Сфера бизнеса",
    s2_sub: "Выберите сферу, которая лучше всего описывает ваш бизнес.",
    agb_accept: "Я принимаю",
    agb_terms: "условия",
    agb_and: "и",
    agb_privacy: "политику конфиденциальности",
    btn_next: "Продолжить →",
    btn_back: "← Назад",
    btn_generate: "Создать Website+CRM →",
    btn_review: "Смотреть превью и одобрить →",
    btn_yes: "Да, отлично",
    btn_no: "Пересобрать",
    btn_restart: "Начать заново",
    s4_h: "Собираем ваш сайт с CRM…",
    s4_generating: "Генерируем ваш Website+CRM...",
    s4_ready: "Ваш Website+CRM готов",
    s4_publishing: "⏳ Website+CRM публикуется... осталось {n} сек",
    s4_copy_link: "Копировать ссылку",
    s4_open: "Открыть Website+CRM",
    build_steps: [
      "Анализ бизнеса",
      "Выбор модулей Website+CRM",
      "Сборка интерфейса",
      "Подключение сервисов",
      "Подготовка деплоя",
      "Упаковка активов",
    ],
    s5_live: "Live Preview",
    s5_q: "Нравится результат?",
    s6_pay_h: "Откройте доступ к Website+CRM",
    s6_pay_button: "Оплатить €99 — разово, навсегда, без подписки",
    s6_promo_button: "Промокод",
    s6_promo_placeholder: "Промо-код (необязательно)",
    s6_promo_invalid: "Неверный промо-код",
    s6_promo_unlock: "Получить бесплатно →",
    s4_build_done: "Сайт готов — смотрите превью",
    s6_badge: "Платформа готова",
    s6_h: "Ваш MVP готов",
    s6_dl: "Скачать результат",
    dl_domain: "Домен",
    s_processing_title: "Оплата прошла — готовим ваш сайт",
    s_processing_sub: "Оплата успешна. Мы публикуем ваш Website+CRM. Обычно это занимает меньше минуты.",
    s_processing_timeout_title: "Сайт всё ещё готовится",
    s_processing_timeout_sub: "Это занимает дольше обычного. Напишите нам — мы поможем сразу.",
    s_processing_contact: "Написать в поддержку",
    s_payment_error_title: "Что-то пошло не так с оплатой",
    s_payment_error_sub: "Не удалось подтвердить оплату. Напишите нам — мы разберёмся.",
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
  },
};

export function getCopy(lang: UiLang): CopyBundle {
  return T[lang] ?? T.en;
}

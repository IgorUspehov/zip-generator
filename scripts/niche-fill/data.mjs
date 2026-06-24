export const scenarios = {
  accounting: {
    metrics: {
      ru: ["Клиентов сегодня", "Консультаций", "В обработке", "Бухгалтеров на смене"],
      de: ["Kunden heute", "Beratungen", "In Bearbeitung", "Buchhalter im Dienst"],
      en: ["Clients Today", "Consultations", "In Progress", "Accountants on Shift"],
    },
    metric_values: ["18", "23", "6", "4"],
    today_items: [
      { name: { ru: "Клаус Фишер", de: "Klaus Fischer", en: "Klaus Fischer" }, service: { ru: "Налоговая декларация", de: "Steuererklärung", en: "Tax Return" }, time: "09:00" },
      { name: { ru: "Петра Вагнер", de: "Petra Wagner", en: "Petra Wagner" }, service: { ru: "Консультация по НДС", de: "Mehrwertsteuer-Beratung", en: "VAT Consultation" }, time: "10:30" },
      { name: { ru: "Томас Беккер", de: "Thomas Becker", en: "Thomas Becker" }, service: { ru: "Расчёт зарплаты", de: "Lohnabrechnung", en: "Payroll Calculation" }, time: "12:00" },
      { name: { ru: "Анна Рихтер", de: "Anna Richter", en: "Anna Richter" }, service: { ru: "Годовой отчёт", de: "Jahresabschluss", en: "Annual Report" }, time: "14:30" },
    ],
    popular_services: {
      ru: ["Налоговая декларация", "Бухгалтерское сопровождение", "Расчёт зарплаты", "Годовой отчёт"],
      de: ["Steuererklärung", "Buchhaltungsservice", "Lohnabrechnung", "Jahresabschluss"],
      en: ["Tax Return", "Bookkeeping Service", "Payroll Calculation", "Annual Report"],
    },
    records: {
      patients: [
        { id: "1", name: { ru: "Клаус Фишер", de: "Klaus Fischer", en: "Klaus Fischer" }, phone: "+49 160 444 0001", note: { ru: "Постоянный клиент", de: "Stammkunde", en: "Regular client" }, visits: 6 },
        { id: "2", name: { ru: "Петра Вагнер", de: "Petra Wagner", en: "Petra Wagner" }, phone: "+49 160 444 0002", note: { ru: "Малый бизнес", de: "Kleinunternehmen", en: "Small business" }, visits: 3 },
        { id: "3", name: { ru: "Томас Беккер", de: "Thomas Becker", en: "Thomas Becker" }, phone: "+49 160 444 0003", note: { ru: "Новый клиент", de: "Neuer Kunde", en: "New client" }, visits: 1 },
      ],
      doctors: [
        { id: "1", name: { ru: "Хельга Шуберт", de: "Helga Schubert", en: "Helga Schubert" }, role: { ru: "Налоговый консультант", de: "Steuerberaterin", en: "Tax Advisor" }, status: { ru: "Доступен", de: "Verfügbar", en: "Available" } },
        { id: "2", name: { ru: "Маркус Ленц", de: "Markus Lenz", en: "Markus Lenz" }, role: { ru: "Главный бухгалтер", de: "Hauptbuchhalter", en: "Chief Accountant" }, status: { ru: "На приёме", de: "Im Gespräch", en: "In Meeting" } },
        { id: "3", name: { ru: "Сабина Кёлер", de: "Sabine Köhler", en: "Sabine Köhler" }, role: { ru: "Бухгалтер по зарплате", de: "Lohnbuchhalterin", en: "Payroll Accountant" }, status: { ru: "Доступен", de: "Verfügbar", en: "Available" } },
      ],
      appointments: [
        { id: "1", client: { ru: "Клаус Фишер", de: "Klaus Fischer", en: "Klaus Fischer" }, service: { ru: "Налоговая декларация", de: "Steuererklärung", en: "Tax Return" }, time: "2026-06-18 09:00", status: { ru: "Подтверждён", de: "Bestätigt", en: "Confirmed" } },
        { id: "2", client: { ru: "Петра Вагнер", de: "Petra Wagner", en: "Petra Wagner" }, service: { ru: "Консультация по НДС", de: "Mehrwertsteuer-Beratung", en: "VAT Consultation" }, time: "2026-06-18 10:30", status: { ru: "Ожидает", de: "Ausstehend", en: "Pending" } },
        { id: "3", client: { ru: "Томас Беккер", de: "Thomas Becker", en: "Thomas Becker" }, service: { ru: "Расчёт зарплаты", de: "Lohnabrechnung", en: "Payroll Calculation" }, time: "2026-06-18 12:00", status: { ru: "Подтверждён", de: "Bestätigt", en: "Confirmed" } },
      ],
      services: [
        { id: "1", name: { ru: "Налоговая декларация", de: "Steuererklärung", en: "Tax Return" }, duration: "60 min", price: "€120" },
        { id: "2", name: { ru: "Консультация по НДС", de: "Mehrwertsteuer-Beratung", en: "VAT Consultation" }, duration: "30 min", price: "€70" },
        { id: "3", name: { ru: "Расчёт зарплаты", de: "Lohnabrechnung", en: "Payroll Calculation" }, duration: "45 min", price: "€90" },
      ],
      payments: [
        { id: "1", client: { ru: "Клаус Фишер", de: "Klaus Fischer", en: "Klaus Fischer" }, amount: "€120", status: { ru: "Оплачено", de: "Bezahlt", en: "Paid" } },
        { id: "2", client: { ru: "Петра Вагнер", de: "Petra Wagner", en: "Petra Wagner" }, amount: "€70", status: { ru: "Оплачено", de: "Bezahlt", en: "Paid" } },
        { id: "3", client: { ru: "Томас Беккер", de: "Thomas Becker", en: "Thomas Becker" }, amount: "€90", status: { ru: "Ожидает", de: "Ausstehend", en: "Pending" } },
      ],
    },
  },

  construction: {
    metrics: {
      ru: ["Объектов в работе", "Заявок сегодня", "На осмотре", "Бригад на смене"],
      de: ["Projekte in Arbeit", "Anfragen heute", "Vor-Ort-Besichtigung", "Teams im Einsatz"],
      en: ["Projects in Progress", "Requests Today", "Under Inspection", "Crews on Shift"],
    },
    metric_values: ["12", "9", "3", "5"],
    today_items: [
      { name: { ru: "Михаэль Кёниг", de: "Michael König", en: "Michael König" }, service: { ru: "Замер помещения", de: "Aufmaß vor Ort", en: "On-site Measurement" }, time: "08:00" },
      { name: { ru: "Сабина Хофманн", de: "Sabine Hofmann", en: "Sabine Hofmann" }, service: { ru: "Консультация по ремонту", de: "Renovierungsberatung", en: "Renovation Consultation" }, time: "09:30" },
      { name: { ru: "Дитер Вольф", de: "Dieter Wolf", en: "Dieter Wolf" }, service: { ru: "Приёмка работ", de: "Bauabnahme", en: "Work Acceptance" }, time: "11:00" },
      { name: { ru: "Карин Зайдель", de: "Karin Seidel", en: "Karin Seidel" }, service: { ru: "Кровельные работы", de: "Dacharbeiten", en: "Roofing Works" }, time: "13:30" },
    ],
    popular_services: {
      ru: ["Ремонт под ключ", "Кровельные работы", "Фундаментные работы", "Отделка помещений"],
      de: ["Komplettrenovierung", "Dacharbeiten", "Fundamentarbeiten", "Innenausbau"],
      en: ["Full Renovation", "Roofing Works", "Foundation Works", "Interior Finishing"],
    },
    records: {
      patients: [
        { id: "1", name: { ru: "Михаэль Кёниг", de: "Michael König", en: "Michael König" }, phone: "+49 160 555 0001", note: { ru: "Частный дом", de: "Einfamilienhaus", en: "Private house" }, visits: 2 },
        { id: "2", name: { ru: "Сабина Хофманн", de: "Sabine Hofmann", en: "Sabine Hofmann" }, phone: "+49 160 555 0002", note: { ru: "Квартира", de: "Wohnung", en: "Apartment" }, visits: 1 },
        { id: "3", name: { ru: "Дитер Вольф", de: "Dieter Wolf", en: "Dieter Wolf" }, phone: "+49 160 555 0003", note: { ru: "Коммерческий объект", de: "Gewerbeobjekt", en: "Commercial property" }, visits: 3 },
      ],
      doctors: [
        { id: "1", name: { ru: "Йенс Браун", de: "Jens Braun", en: "Jens Braun" }, role: { ru: "Прораб", de: "Bauleiter", en: "Site Manager" }, status: { ru: "На объекте", de: "Vor Ort", en: "On Site" } },
        { id: "2", name: { ru: "Хайке Ланге", de: "Heike Lange", en: "Heike Lange" }, role: { ru: "Сметчик", de: "Kalkulatorin", en: "Estimator" }, status: { ru: "Доступен", de: "Verfügbar", en: "Available" } },
        { id: "3", name: { ru: "Олаф Кремер", de: "Olaf Kremer", en: "Olaf Kremer" }, role: { ru: "Мастер-кровельщик", de: "Dachdeckermeister", en: "Roofing Master" }, status: { ru: "На объекте", de: "Vor Ort", en: "On Site" } },
      ],
      appointments: [
        { id: "1", client: { ru: "Михаэль Кёниг", de: "Michael König", en: "Michael König" }, service: { ru: "Замер помещения", de: "Aufmaß vor Ort", en: "On-site Measurement" }, time: "2026-06-18 08:00", status: { ru: "Подтверждён", de: "Bestätigt", en: "Confirmed" } },
        { id: "2", client: { ru: "Сабина Хофманн", de: "Sabine Hofmann", en: "Sabine Hofmann" }, service: { ru: "Консультация по ремонту", de: "Renovierungsberatung", en: "Renovation Consultation" }, time: "2026-06-18 09:30", status: { ru: "Ожидает", de: "Ausstehend", en: "Pending" } },
        { id: "3", client: { ru: "Дитер Вольф", de: "Dieter Wolf", en: "Dieter Wolf" }, service: { ru: "Приёмка работ", de: "Bauabnahme", en: "Work Acceptance" }, time: "2026-06-18 11:00", status: { ru: "Подтверждён", de: "Bestätigt", en: "Confirmed" } },
      ],
      services: [
        { id: "1", name: { ru: "Замер помещения", de: "Aufmaß vor Ort", en: "On-site Measurement" }, duration: "30 min", price: "€0" },
        { id: "2", name: { ru: "Косметический ремонт", de: "Renovierung", en: "Cosmetic Renovation" }, duration: "5 days", price: "€2500" },
        { id: "3", name: { ru: "Кровельные работы", de: "Dacharbeiten", en: "Roofing Works" }, duration: "3 days", price: "€4200" },
      ],
      payments: [
        { id: "1", client: { ru: "Дитер Вольф", de: "Dieter Wolf", en: "Dieter Wolf" }, amount: "€4200", status: { ru: "Оплачено", de: "Bezahlt", en: "Paid" } },
        { id: "2", client: { ru: "Сабина Хофманн", de: "Sabine Hofmann", en: "Sabine Hofmann" }, amount: "€2500", status: { ru: "Ожидает", de: "Ausstehend", en: "Pending" } },
        { id: "3", client: { ru: "Михаэль Кёниг", de: "Michael König", en: "Michael König" }, amount: "€0", status: { ru: "Оплачено", de: "Bezahlt", en: "Paid" } },
      ],
    },
  },

  law_firm: {
    metrics: {
      ru: ["Клиентов сегодня", "Консультаций", "Дел в работе", "Юристов на смене"],
      de: ["Mandanten heute", "Beratungen", "Laufende Fälle", "Anwälte im Dienst"],
      en: ["Clients Today", "Consultations", "Active Cases", "Lawyers on Shift"],
    },
    metric_values: ["15", "11", "27", "6"],
    today_items: [
      { name: { ru: "Андреас Кёниг", de: "Andreas König", en: "Andreas König" }, service: { ru: "Консультация по договору", de: "Vertragsberatung", en: "Contract Consultation" }, time: "09:00" },
      { name: { ru: "Биргит Хан", de: "Birgit Hahn", en: "Birgit Hahn" }, service: { ru: "Регистрация компании", de: "Firmengründung", en: "Company Registration" }, time: "10:30" },
      { name: { ru: "Стефан Кребс", de: "Stefan Krebs", en: "Stefan Krebs" }, service: { ru: "Представительство в суде", de: "Gerichtsvertretung", en: "Court Representation" }, time: "13:00" },
      { name: { ru: "Моника Зоммер", de: "Monika Sommer", en: "Monika Sommer" }, service: { ru: "Трудовой спор", de: "Arbeitsrechtsstreit", en: "Labor Dispute" }, time: "15:00" },
    ],
    popular_services: {
      ru: ["Консультация юриста", "Составление договора", "Представительство в суде", "Регистрация компании"],
      de: ["Anwaltsberatung", "Vertragserstellung", "Gerichtsvertretung", "Firmengründung"],
      en: ["Legal Consultation", "Contract Drafting", "Court Representation", "Company Registration"],
    },
    records: {
      patients: [
        { id: "1", name: { ru: "Андреас Кёниг", de: "Andreas König", en: "Andreas König" }, phone: "+49 160 666 0001", note: { ru: "Корпоративный клиент", de: "Firmenkunde", en: "Corporate client" }, visits: 5 },
        { id: "2", name: { ru: "Биргит Хан", de: "Birgit Hahn", en: "Birgit Hahn" }, phone: "+49 160 666 0002", note: { ru: "Частное лицо", de: "Privatperson", en: "Private individual" }, visits: 2 },
        { id: "3", name: { ru: "Стефан Кребс", de: "Stefan Krebs", en: "Stefan Krebs" }, phone: "+49 160 666 0003", note: { ru: "Новый клиент", de: "Neuer Mandant", en: "New client" }, visits: 1 },
      ],
      doctors: [
        { id: "1", name: { ru: "Грета Фукс", de: "Greta Fuchs", en: "Greta Fuchs" }, role: { ru: "Корпоративное право", de: "Gesellschaftsrecht", en: "Corporate Law" }, status: { ru: "Доступен", de: "Verfügbar", en: "Available" } },
        { id: "2", name: { ru: "Феликс Бергманн", de: "Felix Bergmann", en: "Felix Bergmann" }, role: { ru: "Трудовое право", de: "Arbeitsrecht", en: "Labor Law" }, status: { ru: "В суде", de: "Vor Gericht", en: "In Court" } },
        { id: "3", name: { ru: "Юлия Шварц", de: "Julia Schwarz", en: "Julia Schwarz" }, role: { ru: "Семейное право", de: "Familienrecht", en: "Family Law" }, status: { ru: "Доступен", de: "Verfügbar", en: "Available" } },
      ],
      appointments: [
        { id: "1", client: { ru: "Андреас Кёниг", de: "Andreas König", en: "Andreas König" }, service: { ru: "Консультация по договору", de: "Vertragsberatung", en: "Contract Consultation" }, time: "2026-06-18 09:00", status: { ru: "Подтверждён", de: "Bestätigt", en: "Confirmed" } },
        { id: "2", client: { ru: "Биргит Хан", de: "Birgit Hahn", en: "Birgit Hahn" }, service: { ru: "Регистрация компании", de: "Firmengründung", en: "Company Registration" }, time: "2026-06-18 10:30", status: { ru: "Ожидает", de: "Ausstehend", en: "Pending" } },
        { id: "3", client: { ru: "Стефан Кребс", de: "Stefan Krebs", en: "Stefan Krebs" }, service: { ru: "Представительство в суде", de: "Gerichtsvertretung", en: "Court Representation" }, time: "2026-06-18 13:00", status: { ru: "Подтверждён", de: "Bestätigt", en: "Confirmed" } },
      ],
      services: [
        { id: "1", name: { ru: "Консультация юриста", de: "Anwaltsberatung", en: "Legal Consultation" }, duration: "45 min", price: "€90" },
        { id: "2", name: { ru: "Составление договора", de: "Vertragserstellung", en: "Contract Drafting" }, duration: "2 days", price: "€350" },
        { id: "3", name: { ru: "Регистрация компании", de: "Firmengründung", en: "Company Registration" }, duration: "5 days", price: "€590" },
      ],
      payments: [
        { id: "1", client: { ru: "Андреас Кёниг", de: "Andreas König", en: "Andreas König" }, amount: "€90", status: { ru: "Оплачено", de: "Bezahlt", en: "Paid" } },
        { id: "2", client: { ru: "Биргит Хан", de: "Birgit Hahn", en: "Birgit Hahn" }, amount: "€590", status: { ru: "Ожидает", de: "Ausstehend", en: "Pending" } },
        { id: "3", client: { ru: "Стефан Кребс", de: "Stefan Krebs", en: "Stefan Krebs" }, amount: "€350", status: { ru: "Оплачено", de: "Bezahlt", en: "Paid" } },
      ],
    },
  },

  cleaning_service: {
    metrics: {
      ru: ["Заказов сегодня", "Выполнено", "В работе", "Клинеров на смене"],
      de: ["Aufträge heute", "Erledigt", "In Arbeit", "Reinigungskräfte im Dienst"],
      en: ["Orders Today", "Completed", "In Progress", "Cleaners on Shift"],
    },
    metric_values: ["21", "14", "5", "8"],
    today_items: [
      { name: { ru: "Нина Вернер", de: "Nina Werner", en: "Nina Werner" }, service: { ru: "Уборка квартиры", de: "Wohnungsreinigung", en: "Apartment Cleaning" }, time: "08:00" },
      { name: { ru: "Юрген Шольц", de: "Jürgen Scholz", en: "Jürgen Scholz" }, service: { ru: "Уборка офиса", de: "Büroreinigung", en: "Office Cleaning" }, time: "09:30" },
      { name: { ru: "Катрин Майер", de: "Katrin Meyer", en: "Katrin Meyer" }, service: { ru: "Генеральная уборка", de: "Grundreinigung", en: "Deep Cleaning" }, time: "11:00" },
      { name: { ru: "Бернд Кун", de: "Bernd Kuhn", en: "Bernd Kuhn" }, service: { ru: "Мытьё окон", de: "Fensterreinigung", en: "Window Cleaning" }, time: "13:30" },
    ],
    popular_services: {
      ru: ["Уборка квартиры", "Генеральная уборка", "Уборка офиса", "Мытьё окон"],
      de: ["Wohnungsreinigung", "Grundreinigung", "Büroreinigung", "Fensterreinigung"],
      en: ["Apartment Cleaning", "Deep Cleaning", "Office Cleaning", "Window Cleaning"],
    },
    records: {
      patients: [
        { id: "1", name: { ru: "Нина Вернер", de: "Nina Werner", en: "Nina Werner" }, phone: "+49 160 777 0001", note: { ru: "Регулярная уборка", de: "Regelmäßige Reinigung", en: "Regular cleaning" }, visits: 8 },
        { id: "2", name: { ru: "Юрген Шольц", de: "Jürgen Scholz", en: "Jürgen Scholz" }, phone: "+49 160 777 0002", note: { ru: "Офис, 200м²", de: "Büro, 200m²", en: "Office, 200m²" }, visits: 4 },
        { id: "3", name: { ru: "Катрин Майер", de: "Katrin Meyer", en: "Katrin Meyer" }, phone: "+49 160 777 0003", note: { ru: "Новый клиент", de: "Neuer Kunde", en: "New client" }, visits: 1 },
      ],
      doctors: [
        { id: "1", name: { ru: "Лена Фогель", de: "Lena Vogel", en: "Lena Vogel" }, role: { ru: "Старший клинер", de: "Leitende Reinigungskraft", en: "Senior Cleaner" }, status: { ru: "На объекте", de: "Vor Ort", en: "On Site" } },
        { id: "2", name: { ru: "Томас Ример", de: "Thomas Riemer", en: "Thomas Riemer" }, role: { ru: "Клинер", de: "Reinigungskraft", en: "Cleaner" }, status: { ru: "Доступен", de: "Verfügbar", en: "Available" } },
        { id: "3", name: { ru: "Сильке Гербер", de: "Silke Gerber", en: "Silke Gerber" }, role: { ru: "Бригадир", de: "Teamleiterin", en: "Team Lead" }, status: { ru: "На объекте", de: "Vor Ort", en: "On Site" } },
      ],
      appointments: [
        { id: "1", client: { ru: "Нина Вернер", de: "Nina Werner", en: "Nina Werner" }, service: { ru: "Уборка квартиры", de: "Wohnungsreinigung", en: "Apartment Cleaning" }, time: "2026-06-18 08:00", status: { ru: "Подтверждён", de: "Bestätigt", en: "Confirmed" } },
        { id: "2", client: { ru: "Юрген Шольц", de: "Jürgen Scholz", en: "Jürgen Scholz" }, service: { ru: "Уборка офиса", de: "Büroreinigung", en: "Office Cleaning" }, time: "2026-06-18 09:30", status: { ru: "Ожидает", de: "Ausstehend", en: "Pending" } },
        { id: "3", client: { ru: "Катрин Майер", de: "Katrin Meyer", en: "Katrin Meyer" }, service: { ru: "Генеральная уборка", de: "Grundreinigung", en: "Deep Cleaning" }, time: "2026-06-18 11:00", status: { ru: "Подтверждён", de: "Bestätigt", en: "Confirmed" } },
      ],
      services: [
        { id: "1", name: { ru: "Уборка квартиры", de: "Wohnungsreinigung", en: "Apartment Cleaning" }, duration: "2 hours", price: "€60" },
        { id: "2", name: { ru: "Генеральная уборка", de: "Grundreinigung", en: "Deep Cleaning" }, duration: "4 hours", price: "€120" },
        { id: "3", name: { ru: "Уборка офиса", de: "Büroreinigung", en: "Office Cleaning" }, duration: "3 hours", price: "€90" },
      ],
      payments: [
        { id: "1", client: { ru: "Нина Вернер", de: "Nina Werner", en: "Nina Werner" }, amount: "€60", status: { ru: "Оплачено", de: "Bezahlt", en: "Paid" } },
        { id: "2", client: { ru: "Юрген Шольц", de: "Jürgen Scholz", en: "Jürgen Scholz" }, amount: "€90", status: { ru: "Ожидает", de: "Ausstehend", en: "Pending" } },
        { id: "3", client: { ru: "Катрин Майер", de: "Katrin Meyer", en: "Katrin Meyer" }, amount: "€120", status: { ru: "Оплачено", de: "Bezahlt", en: "Paid" } },
      ],
    },
  },
};

const genericTabs = (clientsLabel, mastersLabel, appointmentsLabel) => ({
  dashboard: { ru: "Дашборд", de: "Dashboard", en: "Dashboard" },
  patients: clientsLabel,
  doctors: mastersLabel,
  appointments: appointmentsLabel,
  services: { ru: "Услуги", de: "Leistungen", en: "Services" },
  payments: { ru: "Платежи", de: "Zahlungen", en: "Payments" },
  settings: { ru: "Настройки", de: "Einstellungen", en: "Settings" },
  clients: clientsLabel,
  masters: mastersLabel,
  staff: { ru: "Персонал", de: "Personal", en: "Staff" },
  notifications: { ru: "Уведомления", de: "Benachrichtigungen", en: "Notifications" },
});

export const labels = {
  accounting: {
    panel_title: { ru: "Панель бухгалтерии", de: "Buchhaltungs-Panel", en: "Accounting Panel" },
    tabs: genericTabs(
      { ru: "Клиенты", de: "Kunden", en: "Clients" },
      { ru: "Бухгалтеры", de: "Buchhalter", en: "Accountants" },
      { ru: "Встречи", de: "Termine", en: "Appointments" },
    ),
    panel_tagline: { ru: "Налоги, отчётность и расчёт зарплаты в одном месте", de: "Steuern, Buchhaltung und Lohnabrechnung an einem Ort", en: "Taxes, accounting, and payroll in one place" },
  },
  construction: {
    panel_title: { ru: "Панель стройкомпании", de: "Bauunternehmen-Panel", en: "Construction Panel" },
    tabs: genericTabs(
      { ru: "Заказчики", de: "Auftraggeber", en: "Clients" },
      { ru: "Прорабы", de: "Bauleiter", en: "Foremen" },
      { ru: "Заявки", de: "Anfragen", en: "Requests" },
    ),
    panel_tagline: { ru: "Объекты, бригады и сроки под контролем", de: "Projekte, Teams und Termine im Blick", en: "Projects, crews, and deadlines under control" },
  },
  law_firm: {
    panel_title: { ru: "Панель юрфирмы", de: "Kanzlei-Panel", en: "Law Firm Panel" },
    tabs: genericTabs(
      { ru: "Клиенты", de: "Mandanten", en: "Clients" },
      { ru: "Юристы", de: "Anwälte", en: "Lawyers" },
      { ru: "Встречи", de: "Termine", en: "Appointments" },
    ),
    panel_tagline: { ru: "Дела, клиенты и сроки — под контролем", de: "Fälle, Mandanten und Fristen im Blick", en: "Cases, clients, and deadlines under control" },
  },
  cleaning_service: {
    panel_title: { ru: "Панель клининга", de: "Reinigungsdienst-Panel", en: "Cleaning Service Panel" },
    tabs: genericTabs(
      { ru: "Клиенты", de: "Kunden", en: "Clients" },
      { ru: "Клинеры", de: "Reinigungskräfte", en: "Cleaners" },
      { ru: "Заказы", de: "Aufträge", en: "Orders" },
    ),
    panel_tagline: { ru: "Заказы, бригады и расписание в одном месте", de: "Aufträge, Teams und Zeitplan an einem Ort", en: "Orders, crews, and schedule in one place" },
  },
};

export const promotions = {
  accounting: [
    { ru: "Бесплатная консультация при первом обращении", de: "Kostenlose Erstberatung", en: "Free first consultation" },
    { ru: "Налоговая декларация — от €99", de: "Steuererklärung — ab €99", en: "Tax return — from €99" },
    { ru: "Регистрация ООО под ключ — €299", de: "GmbH-Gründung Komplettpaket — €299", en: "Full company registration — €299" },
    { ru: "Расчёт зарплаты для малого бизнеса — скидка 15%", de: "Lohnabrechnung für Kleinunternehmen −15%", en: "Payroll for small business −15%" },
    { ru: "Годовой отчёт без доплат при заключении договора до конца месяца", de: "Jahresabschluss ohne Aufpreis bei Vertragsabschluss bis Monatsende", en: "Annual report at no extra cost if signed before month-end" },
  ],
  construction: [
    { ru: "Бесплатный замер и смета", de: "Kostenloses Aufmaß und Kostenvoranschlag", en: "Free measurement and estimate" },
    { ru: "Ремонт под ключ — от €2500", de: "Komplettrenovierung — ab €2500", en: "Full renovation — from €2500" },
    { ru: "Кровельные работы со скидкой 10% до конца месяца", de: "Dacharbeiten −10% bis Monatsende", en: "Roofing works −10% until month-end" },
    { ru: "Гарантия на все работы — 5 лет", de: "5 Jahre Garantie auf alle Arbeiten", en: "5-year warranty on all work" },
    { ru: "Рассрочка без переплат на ремонт", de: "Ratenzahlung ohne Aufpreis für Renovierungen", en: "Interest-free installments for renovations" },
  ],
  law_firm: [
    { ru: "Первая консультация бесплатно", de: "Erstberatung kostenlos", en: "First consultation free" },
    { ru: "Регистрация компании под ключ — €590", de: "Firmengründung Komplettpaket — €590", en: "Full company registration — €590" },
    { ru: "Составление договора — от €150", de: "Vertragserstellung — ab €150", en: "Contract drafting — from €150" },
    { ru: "Скидка 15% при заключении абонентского обслуживания", de: "−15% bei Abschluss eines Servicevertrags", en: "−15% with a service subscription agreement" },
    { ru: "Бесплатная вторая консультация по трудовым спорам", de: "Kostenlose Zweitberatung bei Arbeitsrechtsstreitigkeiten", en: "Free second consultation for labor disputes" },
  ],
  cleaning_service: [
    { ru: "Первая уборка со скидкой 20%", de: "Erste Reinigung −20%", en: "First cleaning −20%" },
    { ru: "Генеральная уборка квартиры — от €120", de: "Grundreinigung der Wohnung — ab €120", en: "Apartment deep cleaning — from €120" },
    { ru: "Уборка офиса по абонементу со скидкой", de: "Büroreinigung im Abo mit Rabatt", en: "Office cleaning subscription with discount" },
    { ru: "Мытьё окон в подарок при заказе генеральной уборки", de: "Fensterreinigung gratis bei Grundreinigung", en: "Free window cleaning with deep cleaning order" },
    { ru: "Эко-средства без доплаты", de: "Ökologische Reinigungsmittel ohne Aufpreis", en: "Eco-friendly products at no extra cost" },
  ],
};

export const patterns = {
  accounting: {
    id: "accounting", name: "Accounting CRM", version: "1.0.0",
    project_type: "accounting_platform", project_name: "ACCOUNTING",
    description: "Accounting firm with clients, accountants, appointments, services, and payments.",
    pages: ["dashboard", "patients", "doctors", "appointments", "services", "payments"],
    entities: ["patients", "doctors", "appointments", "services", "payments"],
  },
  construction: {
    id: "construction", name: "Construction CRM", version: "1.0.0",
    project_type: "construction_platform", project_name: "CONSTRUCTION",
    description: "Construction and renovation company with clients, foremen, requests, services, and payments.",
    pages: ["dashboard", "patients", "doctors", "appointments", "services", "payments"],
    entities: ["patients", "doctors", "appointments", "services", "payments"],
  },
  law_firm: {
    id: "law_firm", name: "Law Firm CRM", version: "1.0.0",
    project_type: "law_firm_platform", project_name: "LAW_FIRM",
    description: "Law firm with clients, lawyers, appointments, services, and payments.",
    pages: ["dashboard", "patients", "doctors", "appointments", "services", "payments"],
    entities: ["patients", "doctors", "appointments", "services", "payments"],
  },
  cleaning_service: {
    id: "cleaning_service", name: "Cleaning Service CRM", version: "1.0.0",
    project_type: "cleaning_service_platform", project_name: "CLEANING_SERVICE",
    description: "Cleaning service company with clients, cleaners, orders, services, and payments.",
    pages: ["dashboard", "patients", "doctors", "appointments", "services", "payments"],
    entities: ["patients", "doctors", "appointments", "services", "payments"],
  },
};

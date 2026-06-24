#!/usr/bin/env node
import { readFileSync, writeFileSync, copyFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const target = join(root, "src/lib/niche-scenarios.json");
const artifact = join(root, "artifacts/factory_output/react_mvp/src/data/niche-scenarios.json");

const L = (ru, de, en) => ({ ru, de, en });

const STATUS = {
  available: L("Доступен", "Verfügbar", "Available"),
  busy: L("Занят", "Besetzt", "Busy"),
  confirmed: L("Подтверждён", "Bestätigt", "Confirmed"),
  pending: L("Ожидает", "Ausstehend", "Pending"),
  cancelled: L("Отменён", "Storniert", "Cancelled"),
  paid: L("Оплачено", "Bezahlt", "Paid"),
  free: L("Свободен", "Frei", "Free"),
  reserved: L("Забронирован", "Reserviert", "Reserved"),
  occupied: L("Занят", "Besetzt", "Occupied"),
  onShift: L("На смене", "Im Dienst", "On shift"),
  inSession: L("На сеансе", "In Sitzung", "In session"),
  inSurgery: L("На приёме", "Im Eingriff", "In surgery"),
  inClass: L("На занятии", "Im Unterricht", "In class"),
  inProgress: L("В работе", "In Bearbeitung", "In progress"),
  inService: L("В сервисе", "In Wartung", "In service"),
  waiting: L("Ожидает", "Wartend", "Waiting"),
  ready: L("Готов", "Bereit", "Ready"),
  done: L("Выполнено", "Erledigt", "Done"),
  active: L("Активен", "Aktiv", "Active"),
  planned: L("Запланирован", "Geplant", "Planned"),
  onRoute: L("На маршруте", "Unterwegs", "On route"),
  onBreak: L("На перерыве", "Pause", "On break"),
  delivered: L("Доставлено", "Geliefert", "Delivered"),
  inTransit: L("В пути", "Unterwegs", "In transit"),
  maintenance: L("На обслуживании", "Wartung", "Maintenance"),
  shipped: L("Отправлено", "Versendet", "Shipped"),
  processing: L("Обработка", "In Bearbeitung", "Processing"),
  inStock: L("В наличии", "Auf Lager", "In stock"),
  lowStock: L("Мало на складе", "Wenig auf Lager", "Low stock"),
  review: L("На проверке", "In Prüfung", "Review"),
  planning: L("Планирование", "Planung", "Planning"),
  beta: L("Бета", "Beta", "Beta"),
};

const I18N_RECORDS = {
  beauty_salon: {
    clients: [
      { id: "1", name: L("Анна Петрова", "Anna Petrova", "Anna Petrova"), phone: "+49 160 111 0001", note: L("Постоянный клиент", "Stammkundin", "Regular client"), visits: 5 },
      { id: "2", name: L("София Вебер", "Sofia Weber", "Sofia Weber"), phone: "+49 160 111 0002", note: L("Окрашивание волос", "Haare färben", "Hair coloring"), visits: 3 },
      { id: "3", name: L("Мария Мюллер", "Maria Müller", "Maria Müller"), phone: "+49 160 111 0003", note: L("Маникюр", "Maniküre", "Manicure"), visits: 2 },
    ],
    masters: [
      { id: "1", name: L("Елена Стайлс", "Elena Styles", "Elena Styles"), role: L("Стилист", "Stylistin", "Hair Stylist"), status: STATUS.available },
      { id: "2", name: L("Юлия Колор", "Julia Color", "Julia Color"), role: L("Колорист", "Coloristin", "Colorist"), status: STATUS.busy },
      { id: "3", name: L("Нина Кэр", "Nina Care", "Nina Care"), role: L("Мастер ногтей", "Nageldesignerin", "Nail Artist"), status: STATUS.available },
    ],
    services: [
      { id: "1", name: L("Стрижка", "Haarschnitt", "Haircut"), duration: "45 min", price: "€45" },
      { id: "2", name: L("Окрашивание волос", "Haare färben", "Hair Coloring"), duration: "90 min", price: "€89" },
      { id: "3", name: L("Маникюр", "Maniküre", "Manicure"), duration: "60 min", price: "€35" },
    ],
    appointments: [
      { id: "1", client: L("Анна Петрова", "Anna Petrova", "Anna Petrova"), service: L("Окрашивание волос", "Haare färben", "Hair Coloring"), time: "2026-06-18 09:00", status: STATUS.confirmed },
      { id: "2", client: L("София Вебер", "Sofia Weber", "Sofia Weber"), service: L("Маникюр", "Maniküre", "Manicure"), time: "2026-06-18 11:00", status: STATUS.pending },
      { id: "3", client: L("Мария Мюллер", "Maria Müller", "Maria Müller"), service: L("Стрижка", "Haarschnitt", "Haircut"), time: "2026-06-18 14:00", status: STATUS.confirmed },
    ],
    payments: [
      { id: "1", client: L("Анна Петрова", "Anna Petrova", "Anna Petrova"), amount: "€89", status: STATUS.paid },
      { id: "2", client: L("София Вебер", "Sofia Weber", "Sofia Weber"), amount: "€35", status: STATUS.paid },
      { id: "3", client: L("Мария Мюллер", "Maria Müller", "Maria Müller"), amount: "€45", status: STATUS.pending },
    ],
  },
  restaurant: {
    reservations: [
      { id: "1", guest: L("Семья Вебер", "Familie Weber", "Weber Family"), table: L("Стол 5", "Tisch 5", "Table 5"), time: "19:00", status: STATUS.confirmed },
      { id: "2", guest: L("Г-н Мюллер", "Herr Müller", "Mr Miller"), table: L("Стол 3", "Tisch 3", "Table 3"), time: "20:00", status: STATUS.pending },
      { id: "3", guest: L("Анна Шмидт", "Anna Schmidt", "Anna Schmidt"), table: L("Стол 8", "Tisch 8", "Table 8"), time: "18:30", status: STATUS.confirmed },
    ],
    tables: [
      { id: "1", name: L("Стол 1", "Tisch 1", "Table 1"), seats: 2, status: STATUS.free },
      { id: "2", name: L("Стол 5", "Tisch 5", "Table 5"), seats: 4, status: STATUS.reserved },
      { id: "3", name: L("Стол 8", "Tisch 8", "Table 8"), seats: 6, status: STATUS.occupied },
    ],
    menu: [
      { id: "1", name: L("Бизнес-ланч", "Business Lunch", "Business Lunch"), price: "€9.90", category: L("Обед", "Mittagessen", "Lunch") },
      { id: "2", name: L("Паста карбонара", "Pasta Carbonara", "Pasta Carbonara"), price: "€14.50", category: L("Основное", "Hauptgericht", "Main") },
      { id: "3", name: L("Тирамису", "Tiramisu", "Tiramisu"), price: "€6.50", category: L("Десерт", "Dessert", "Dessert") },
    ],
    staff: [
      { id: "1", name: L("Марко Росси", "Marco Rossi", "Marco Rossi"), role: L("Шеф-повар", "Küchenchef", "Chef"), status: STATUS.available },
      { id: "2", name: L("Лиза Браун", "Lisa Braun", "Lisa Braun"), role: L("Официант", "Kellnerin", "Waiter"), status: STATUS.onShift },
      { id: "3", name: L("Том Келлер", "Tom Keller", "Tom Keller"), role: L("Хостес", "Gastgeber", "Host"), status: STATUS.available },
    ],
  },
  fitness_club: {
    members: [
      { id: "1", name: L("Макс Фишер", "Max Fischer", "Max Fischer"), phone: "+49 160 222 0001", note: L("Годовой абонемент", "Jahresabo", "Annual plan"), visits: 42 },
      { id: "2", name: L("Лаура Кляйн", "Laura Klein", "Laura Klein"), phone: "+49 160 222 0002", note: L("Йога", "Yoga", "Yoga member"), visits: 18 },
      { id: "3", name: L("Йонас Харт", "Jonas Hart", "Jonas Hart"), phone: "+49 160 222 0003", note: L("Новый участник", "Neues Mitglied", "New member"), visits: 4 },
    ],
    trainers: [
      { id: "1", name: L("Алекс Пауэр", "Alex Power", "Alex Power"), role: L("Персональный тренер", "Personal Trainer", "Personal Trainer"), status: STATUS.available },
      { id: "2", name: L("Сара Фит", "Sara Fit", "Sara Fit"), role: L("Тренер по йоге", "Yoga-Coach", "Yoga Coach"), status: STATUS.inSession },
      { id: "3", name: L("Майк Стронг", "Mike Strong", "Mike Strong"), role: L("Тренер CrossFit", "CrossFit-Trainer", "CrossFit"), status: STATUS.available },
    ],
    classes: [
      { id: "1", name: L("Утренняя йога", "Morgenyoga", "Morning Yoga"), duration: "60 min", price: "€15" },
      { id: "2", name: L("HIIT тренировка", "HIIT-Training", "HIIT Training"), duration: "45 min", price: "€18" },
      { id: "3", name: L("Велотренировка", "Spinning", "Spinning"), duration: "50 min", price: "€16" },
    ],
    subscriptions: [
      { id: "1", name: L("Базовый месячный", "Monats-Basic", "Monthly Basic"), price: "€39", duration: L("1 месяц", "1 Monat", "1 month") },
      { id: "2", name: L("Годовой Pro", "Jahres-Pro", "Annual Pro"), price: "€399", duration: L("12 месяцев", "12 Monate", "12 months") },
      { id: "3", name: L("Дневной пропуск", "Tageskarte", "Day Pass"), price: "€12", duration: L("1 день", "1 Tag", "1 day") },
    ],
  },
  dental_clinic: {
    patients: [
      { id: "1", name: L("Анна Вебер", "Anna Weber", "Anna Weber"), phone: "+49 160 333 0001", note: L("План лечения", "Behandlungsplan", "Treatment plan"), visits: 4 },
      { id: "2", name: L("Томас Кох", "Thomas Koch", "Thomas Koch"), phone: "+49 160 333 0002", note: L("Регулярная чистка", "Regelmäßige Reinigung", "Regular cleaning"), visits: 2 },
      { id: "3", name: L("Лиза Браун", "Lisa Braun", "Lisa Braun"), phone: "+49 160 333 0003", note: L("Новый пациент", "Neuer Patient", "New patient"), visits: 1 },
    ],
    doctors: [
      { id: "1", name: L("Д-р Елена Хартманн", "Dr. Elena Hartmann", "Dr. Elena Hartmann"), role: L("Стоматолог", "Zahnarzt", "Dentist"), status: STATUS.available },
      { id: "2", name: L("Д-р Маркус Бергер", "Dr. Markus Berger", "Dr. Markus Berger"), role: L("Ортодонт", "Kieferorthopäde", "Orthodontist"), status: STATUS.inSurgery },
      { id: "3", name: L("Д-р София Кляйн", "Dr. Sofia Klein", "Dr. Sofia Klein"), role: L("Гигиенист", "Hygienikerin", "Hygienist"), status: STATUS.available },
    ],
    appointments: [
      { id: "1", client: L("Анна Вебер", "Anna Weber", "Anna Weber"), service: L("Осмотр зубов", "Zahnkontrolle", "Dental Check-up"), time: "2026-06-18 10:00", status: STATUS.confirmed },
      { id: "2", client: L("Томас Кох", "Thomas Koch", "Thomas Koch"), service: L("Чистка зубов", "Zahnreinigung", "Teeth Cleaning"), time: "2026-06-18 12:00", status: STATUS.pending },
      { id: "3", client: L("Лиза Браун", "Lisa Braun", "Lisa Braun"), service: L("Консультация", "Beratung", "Consultation"), time: "2026-06-18 15:00", status: STATUS.confirmed },
    ],
    services: [
      { id: "1", name: L("Осмотр зубов", "Zahnkontrolle", "Dental Check-up"), duration: "30 min", price: "€80" },
      { id: "2", name: L("Чистка зубов", "Zahnreinigung", "Teeth Cleaning"), duration: "45 min", price: "€95" },
      { id: "3", name: L("Лечение корневого канала", "Wurzelkanalbehandlung", "Root Canal"), duration: "90 min", price: "€320" },
    ],
    payments: [
      { id: "1", client: L("Анна Вебер", "Anna Weber", "Anna Weber"), amount: "€80", status: STATUS.paid },
      { id: "2", client: L("Томас Кох", "Thomas Koch", "Thomas Koch"), amount: "€95", status: STATUS.paid },
      { id: "3", client: L("Лиза Браун", "Lisa Braun", "Lisa Braun"), amount: "€60", status: STATUS.pending },
    ],
  },
  health_clinic: {
    patients: [
      { id: "1", name: L("Ганс Вебер", "Hans Weber", "Hans Weber"), phone: "+49 160 333 0001", note: L("План лечения", "Behandlungsplan", "Treatment plan"), visits: 4 },
      { id: "2", name: L("Ева Кох", "Eva Koch", "Eva Koch"), phone: "+49 160 333 0002", note: L("Регулярный осмотр", "Regelmäßige Kontrolle", "Regular check-up"), visits: 2 },
      { id: "3", name: L("Лиза Браун", "Lisa Braun", "Lisa Braun"), phone: "+49 160 333 0003", note: L("Новый пациент", "Neuer Patient", "New patient"), visits: 1 },
    ],
    doctors: [
      { id: "1", name: L("Д-р Елена Хартманн", "Dr. Elena Hartmann", "Dr. Elena Hartmann"), role: L("Терапевт", "Allgemeinmediziner", "General Practitioner"), status: STATUS.available },
      { id: "2", name: L("Д-р Маркус Бергер", "Dr. Markus Berger", "Dr. Markus Berger"), role: L("Кардиолог", "Kardiologe", "Cardiologist"), status: STATUS.inSurgery },
      { id: "3", name: L("Д-р София Кляйн", "Dr. Sofia Klein", "Dr. Sofia Klein"), role: L("Медсестра", "Pflegekraft", "Nurse"), status: STATUS.available },
    ],
    appointments: [
      { id: "1", client: L("Ганс Вебер", "Hans Weber", "Hans Weber"), service: L("Общий осмотр", "Allgemeinuntersuchung", "General Examination"), time: "2026-06-18 10:00", status: STATUS.confirmed },
      { id: "2", client: L("Ева Кох", "Eva Koch", "Eva Koch"), service: L("УЗИ", "Ultraschall", "Ultrasound"), time: "2026-06-18 12:00", status: STATUS.pending },
      { id: "3", client: L("Лиза Браун", "Lisa Braun", "Lisa Braun"), service: L("Анализы крови", "Bluttests", "Blood Tests"), time: "2026-06-18 15:00", status: STATUS.confirmed },
    ],
    services: [
      { id: "1", name: L("Общий осмотр", "Allgemeinuntersuchung", "General Examination"), duration: "30 min", price: "€80" },
      { id: "2", name: L("УЗИ", "Ultraschall", "Ultrasound"), duration: "45 min", price: "€95" },
      { id: "3", name: L("Кардиограмма", "EKG", "ECG"), duration: "20 min", price: "€60" },
    ],
    payments: [
      { id: "1", client: L("Ганс Вебер", "Hans Weber", "Hans Weber"), amount: "€80", status: STATUS.paid },
      { id: "2", client: L("Ева Кох", "Eva Koch", "Eva Koch"), amount: "€95", status: STATUS.paid },
      { id: "3", client: L("Лиза Браун", "Lisa Braun", "Lisa Braun"), amount: "€60", status: STATUS.pending },
    ],
  },
  massage_salon: {
    clients: [
      { id: "1", name: L("Елена Рихтер", "Elena Richter", "Elena Richter"), phone: "+49 160 444 0001", note: L("Боль в спине", "Rückenschmerzen", "Back pain"), visits: 6 },
      { id: "2", name: L("Пауль Нойман", "Paul Neumann", "Paul Neumann"), phone: "+49 160 444 0002", note: L("Спортивный массаж", "Sportmassage", "Sports massage"), visits: 3 },
      { id: "3", name: L("Клара Фогель", "Clara Vogel", "Clara Vogel"), phone: "+49 160 444 0003", note: L("Релакс сеанс", "Entspannung", "Relax session"), visits: 2 },
    ],
    therapists: [
      { id: "1", name: L("Мия Велнесс", "Mia Wellness", "Mia Wellness"), role: L("Массажист", "Masseurin", "Massage Therapist"), status: STATUS.available },
      { id: "2", name: L("Олег Релакс", "Oleg Relax", "Oleg Relax"), role: L("SPA-терапевт", "SPA-Therapeut", "SPA Therapist"), status: STATUS.busy },
      { id: "3", name: L("Нина Кэр", "Nina Care", "Nina Care"), role: L("Терапевт", "Therapeutin", "Therapist"), status: STATUS.available },
    ],
    services: [
      { id: "1", name: L("Классический массаж", "Klassische Massage", "Classic Massage"), duration: "60 min", price: "€65" },
      { id: "2", name: L("Антистресс массаж", "Anti-Stress-Massage", "Anti-Stress Massage"), duration: "75 min", price: "€79" },
      { id: "3", name: L("Спортивный массаж", "Sportmassage", "Sport Massage"), duration: "50 min", price: "€70" },
    ],
    appointments: [
      { id: "1", client: L("Елена Рихтер", "Elena Richter", "Elena Richter"), service: L("Классический массаж", "Klassische Massage", "Classic Massage"), time: "2026-06-18 10:00", status: STATUS.confirmed },
      { id: "2", client: L("Пауль Нойман", "Paul Neumann", "Paul Neumann"), service: L("Спортивный массаж", "Sportmassage", "Sport Massage"), time: "2026-06-18 13:00", status: STATUS.confirmed },
      { id: "3", client: L("Клара Фогель", "Clara Vogel", "Clara Vogel"), service: L("Антистресс массаж", "Anti-Stress-Massage", "Anti-Stress Massage"), time: "2026-06-18 16:00", status: STATUS.pending },
    ],
  },
  car_service: {
    clients: [
      { id: "1", name: L("Стефан Фогель", "Stefan Vogel", "Stefan Vogel"), phone: "+49 160 555 0001", note: L("Владелец BMW", "BMW-Besitzer", "BMW owner"), visits: 3 },
      { id: "2", name: L("Хельга Вайс", "Helga Weiss", "Helga Weiss"), phone: "+49 160 555 0002", note: L("Обслуживание VW", "VW-Service", "VW service"), visits: 5 },
      { id: "3", name: L("Марк Отто", "Mark Otto", "Mark Otto"), phone: "+49 160 555 0003", note: L("Шиномонтаж", "Reifenwechsel", "Tire change"), visits: 1 },
    ],
    work_orders: [
      { id: "1", client: L("Стефан Фогель", "Stefan Vogel", "Stefan Vogel"), service: L("Замена масла", "Ölwechsel", "Oil Change"), time: "2026-06-18 09:00", status: STATUS.confirmed },
      { id: "2", client: L("Хельга Вайс", "Helga Weiss", "Helga Weiss"), service: L("Замена шин", "Reifenwechsel", "Tire Change"), time: "2026-06-18 11:00", status: STATUS.pending },
      { id: "3", client: L("Марк Отто", "Mark Otto", "Mark Otto"), service: L("Замена тормозов", "Bremsenwechsel", "Brake Replacement"), time: "2026-06-18 14:00", status: STATUS.confirmed },
    ],
    vehicles: [
      { id: "1", model: "BMW 320d", plate: "M-AB 1234", status: STATUS.inService },
      { id: "2", model: "VW Golf", plate: "M-CD 5678", status: STATUS.waiting },
      { id: "3", model: "Audi A4", plate: "M-EF 9012", status: STATUS.ready },
    ],
    mechanics: [
      { id: "1", name: L("Клаус Верк", "Klaus Werk", "Klaus Werk"), role: L("Старший механик", "Chefmechaniker", "Lead Mechanic"), status: STATUS.available },
      { id: "2", name: L("Петер Мотор", "Peter Motor", "Peter Motor"), role: L("Техник", "Techniker", "Technician"), status: STATUS.busy },
      { id: "3", name: L("Ян Авто", "Jan Auto", "Jan Auto"), role: L("Диагност", "Diagnostiker", "Diagnostic"), status: STATUS.available },
    ],
  },
  hotel_booking: {
    guests: [
      { id: "1", name: L("Михаил Браун", "Michael Brown", "Michael Brown"), phone: "+49 160 666 0001", note: L("2 ночи", "2 Nächte", "2 nights"), visits: 2 },
      { id: "2", name: L("Сара Джонсон", "Sarah Johnson", "Sarah Johnson"), phone: "+49 160 666 0002", note: L("Командировка", "Geschäftsreise", "Business trip"), visits: 1 },
      { id: "3", name: L("Дэвид Ли", "David Lee", "David Lee"), phone: "+49 160 666 0003", note: L("Семейный отдых", "Familienaufenthalt", "Family stay"), visits: 4 },
    ],
    rooms: [
      { id: "1", name: L("Номер 101", "Zimmer 101", "Room 101"), type: L("Стандарт", "Standard", "Standard"), status: STATUS.occupied },
      { id: "2", name: L("Номер 205", "Zimmer 205", "Room 205"), type: L("Делюкс", "Deluxe", "Deluxe"), status: STATUS.free },
      { id: "3", name: L("Люкс 301", "Suite 301", "Suite 301"), type: L("Люкс", "Suite", "Suite"), status: STATUS.reserved },
    ],
    reservations: [
      { id: "1", guest: L("Михаил Браун", "Michael Brown", "Michael Brown"), service: L("Номер 205", "Zimmer 205", "Room 205"), time: "2026-06-18", status: STATUS.confirmed },
      { id: "2", guest: L("Сара Джонсон", "Sarah Johnson", "Sarah Johnson"), service: L("Номер 101", "Zimmer 101", "Room 101"), time: "2026-06-19", status: STATUS.confirmed },
      { id: "3", guest: L("Дэвид Ли", "David Lee", "David Lee"), service: L("Люкс 301", "Suite 301", "Suite 301"), time: "2026-06-20", status: STATUS.pending },
    ],
    housekeeping: [
      { id: "1", name: L("Этаж 1", "Etage 1", "Floor 1"), task: L("Уборка", "Reinigung", "Cleaning"), status: STATUS.done },
      { id: "2", name: L("Этаж 2", "Etage 2", "Floor 2"), task: L("Смена белья", "Bettwäsche wechseln", "Linen change"), status: STATUS.inProgress },
      { id: "3", name: L("Люкс 301", "Suite 301", "Suite 301"), task: L("Подготовка к заезду", "Anreisevorbereitung", "Pre-arrival"), status: STATUS.pending },
    ],
  },
  education: {
    students: [
      { id: "1", name: L("Эмма Уилсон", "Emma Wilson", "Emma Wilson"), phone: "+49 160 777 0001", note: L("Немецкий B2", "Deutsch B2", "B2 German"), visits: 12 },
      { id: "2", name: L("Джеймс Миллер", "James Miller", "James Miller"), phone: "+49 160 777 0002", note: L("Английский A2", "Englisch A2", "A2 English"), visits: 8 },
      { id: "3", name: L("Оливия Дэвис", "Olivia Davis", "Olivia Davis"), phone: "+49 160 777 0003", note: L("Курс математики", "Mathematikkurs", "Math course"), visits: 5 },
    ],
    teachers: [
      { id: "1", name: L("Проф. Анна Ланг", "Prof. Anna Lang", "Prof. Anna Lang"), role: L("Преподаватель немецкого", "Deutschlehrerin", "German Teacher"), status: STATUS.available },
      { id: "2", name: L("Джон Тич", "John Teach", "John Teach"), role: L("Преподаватель английского", "Englischlehrer", "English Teacher"), status: STATUS.inClass },
      { id: "3", name: L("Мария Курс", "Maria Kurs", "Maria Kurs"), role: L("Преподаватель математики", "Mathematiklehrerin", "Math Teacher"), status: STATUS.available },
    ],
    courses: [
      { id: "1", name: L("Немецкий B2", "Deutsch B2", "German B2"), duration: L("8 недель", "8 Wochen", "8 weeks"), price: "€299" },
      { id: "2", name: L("Английский A2", "Englisch A2", "English A2"), duration: L("6 недель", "6 Wochen", "6 weeks"), price: "€249" },
      { id: "3", name: L("Основы математики", "Mathe-Grundlagen", "Math Basics"), duration: L("4 недели", "4 Wochen", "4 weeks"), price: "€199" },
    ],
    appointments: [
      { id: "1", client: L("Эмма Уилсон", "Emma Wilson", "Emma Wilson"), service: L("Немецкий B2", "Deutsch B2", "German B2"), time: "2026-06-18 10:00", status: STATUS.confirmed },
      { id: "2", client: L("Джеймс Миллер", "James Miller", "James Miller"), service: L("Английский A2", "Englisch A2", "English A2"), time: "2026-06-18 14:00", status: STATUS.confirmed },
      { id: "3", client: L("Оливия Дэвис", "Olivia Davis", "Olivia Davis"), service: L("Основы математики", "Mathe-Grundlagen", "Math Basics"), time: "2026-06-18 16:00", status: STATUS.pending },
    ],
  },
  logistics: {
    routes: [
      { id: "1", name: L("Центр Мюнхена", "München Zentrum", "Munich Center"), stops: 12, status: STATUS.active },
      { id: "2", name: L("Северный район", "Nordbezirk", "North District"), stops: 8, status: STATUS.active },
      { id: "3", name: L("Аэропорт экспресс", "Flughafen-Express", "Airport Express"), stops: 5, status: STATUS.planned },
    ],
    drivers: [
      { id: "1", name: L("Игорь Драйв", "Igor Drive", "Igor Drive"), role: L("Водитель", "Fahrer", "Driver"), status: STATUS.onRoute },
      { id: "2", name: L("Алекс Карго", "Alex Cargo", "Alex Cargo"), role: L("Водитель", "Fahrer", "Driver"), status: STATUS.available },
      { id: "3", name: L("Макс Флит", "Max Fleet", "Max Fleet"), role: L("Водитель", "Fahrer", "Driver"), status: STATUS.onBreak },
    ],
    deliveries: [
      { id: "1", client: L("Магазин A", "Shop A", "Shop A"), service: L("Экспресс", "Express", "Express"), time: "2026-06-18 09:00", status: STATUS.delivered },
      { id: "2", client: L("Офис B", "Office B", "Office B"), service: L("Стандарт", "Standard", "Standard"), time: "2026-06-18 12:00", status: STATUS.inTransit },
      { id: "3", client: L("Клиент C", "Client C", "Client C"), service: L("В тот же день", "Same Day", "Same day"), time: "2026-06-18 15:00", status: STATUS.pending },
    ],
    vehicles: [
      { id: "1", model: "Mercedes Sprinter", plate: "M-LG 100", status: STATUS.onRoute },
      { id: "2", model: "Ford Transit", plate: "M-LG 200", status: STATUS.available },
      { id: "3", model: "VW Crafter", plate: "M-LG 300", status: STATUS.maintenance },
    ],
  },
  ecommerce: {
    products: [
      { id: "1", name: L("Беспроводные наушники", "Kabellose Kopfhörer", "Wireless Headphones"), price: "€79", duration: STATUS.inStock },
      { id: "2", name: L("Умные часы", "Smartwatch", "Smart Watch"), price: "€149", duration: STATUS.inStock },
      { id: "3", name: L("Чехол для телефона", "Handyhülle", "Phone Case"), price: "€19", duration: STATUS.lowStock },
    ],
    orders: [
      { id: "1", client: L("Джон Смит", "John Smith", "John Smith"), service: L("Заказ #1001", "Bestellung #1001", "Order #1001"), time: "2026-06-18", status: STATUS.shipped },
      { id: "2", client: L("Анна Вайт", "Anna White", "Anna White"), service: L("Заказ #1002", "Bestellung #1002", "Order #1002"), time: "2026-06-18", status: STATUS.processing },
      { id: "3", client: L("Михаил Браун", "Michael Brown", "Michael Brown"), service: L("Заказ #1003", "Bestellung #1003", "Order #1003"), time: "2026-06-17", status: STATUS.delivered },
    ],
    clients: [
      { id: "1", name: L("Джон Смит", "John Smith", "John Smith"), phone: "+49 160 888 0001", note: L("VIP", "VIP", "VIP"), visits: 7 },
      { id: "2", name: L("Анна Вайт", "Anna White", "Anna White"), phone: "+49 160 888 0002", note: L("Постоянный покупатель", "Stammkäuferin", "Repeat buyer"), visits: 4 },
      { id: "3", name: L("Михаил Браун", "Michael Brown", "Michael Brown"), phone: "+49 160 888 0003", note: L("Новый клиент", "Neukunde", "New customer"), visits: 1 },
    ],
    payments: [
      { id: "1", client: L("Джон Смит", "John Smith", "John Smith"), amount: "€79", status: STATUS.paid },
      { id: "2", client: L("Анна Вайт", "Anna White", "Anna White"), amount: "€149", status: STATUS.paid },
      { id: "3", client: L("Михаил Браун", "Michael Brown", "Michael Brown"), amount: "€19", status: STATUS.pending },
    ],
  },
  technology: {
    products: [
      { id: "1", name: L("SaaS платформа", "SaaS-Plattform", "SaaS Platform"), price: "€499/mo", duration: STATUS.active },
      { id: "2", name: L("Мобильное приложение", "Mobile App", "Mobile App"), price: "€999", duration: STATUS.active },
      { id: "3", name: L("Доступ к API", "API-Zugang", "API Access"), price: "€199/mo", duration: STATUS.beta },
    ],
    clients: [
      { id: "1", name: L("Стартап Альфа", "Startup Alpha", "Startup Alpha"), phone: "+49 160 999 0001", note: L("MVP проект", "MVP-Projekt", "MVP project"), visits: 3 },
      { id: "2", name: L("Ритейл Бета", "Retail Beta", "Retail Beta"), phone: "+49 160 999 0002", note: L("Внедрение CRM", "CRM-Rollout", "CRM rollout"), visits: 2 },
      { id: "3", name: L("Клиника Гамма", "Clinic Gamma", "Clinic Gamma"), phone: "+49 160 999 0003", note: L("Интеграция", "Integration", "Integration"), visits: 1 },
    ],
    projects: [
      { id: "1", name: L("MVP Factory", "MVP Factory", "MVP Factory"), status: STATUS.inProgress, deadline: "2026-07-01" },
      { id: "2", name: L("Клиентский портал", "Kundenportal", "Client Portal"), status: STATUS.planning, deadline: "2026-08-15" },
      { id: "3", name: L("Мобильная CRM", "Mobile CRM", "Mobile CRM"), status: STATUS.review, deadline: "2026-06-30" },
    ],
    developers: [
      { id: "1", name: L("Алекс Код", "Alex Code", "Alex Code"), role: L("Full-stack", "Full-stack", "Full-stack"), status: STATUS.available },
      { id: "2", name: L("Сара Дев", "Sara Dev", "Sara Dev"), role: L("Frontend", "Frontend", "Frontend"), status: STATUS.busy },
      { id: "3", name: L("Иван Бэкенд", "Ivan Backend", "Ivan Backend"), role: L("Backend", "Backend", "Backend"), status: STATUS.available },
    ],
  },
};

const data = JSON.parse(readFileSync(target, "utf8"));

for (const [niche, records] of Object.entries(I18N_RECORDS)) {
  if (!data[niche]) {
    console.warn(`Missing niche: ${niche}`);
    continue;
  }
  data[niche].records = records;
}

writeFileSync(target, `${JSON.stringify(data, null, 2)}\n`);
copyFileSync(target, artifact);
console.log(`Updated records for ${Object.keys(I18N_RECORDS).length} niches`);

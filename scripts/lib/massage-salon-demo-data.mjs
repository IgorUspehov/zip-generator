export const SALON_NAME = "Serenity Touch Massage Studio";

export const CLIENTS = [
  { id: "1", name: "Anna Petrova", phone: "+49 170 482 9103", email: "anna.petrova@email.de", lastVisit: "2026-06-05" },
  { id: "2", name: "Michael Schneider", phone: "+49 151 223 8841", email: "m.schneider@web.de", lastVisit: "2026-06-07" },
  { id: "3", name: "Elena Kozlova", phone: "+49 176 901 4422", email: "elena.k@mail.ru", lastVisit: "2026-06-03" },
  { id: "4", name: "Thomas Weber", phone: "+49 160 778 3301", email: "t.weber@company.com", lastVisit: "2026-06-01" },
  { id: "5", name: "Sofia Müller", phone: "+49 171 556 2098", email: "sofia.mueller@gmail.com", lastVisit: "2026-06-06" },
  { id: "6", name: "Dmitry Volkov", phone: "+49 152 889 1140", email: "d.volkov@email.com", lastVisit: "2026-05-28" },
  { id: "7", name: "Julia Hartmann", phone: "+49 157 334 7720", email: "julia.h@outlook.de", lastVisit: "2026-06-04" },
  { id: "8", name: "Oliver Braun", phone: "+49 163 445 9012", email: "oliver.braun@firma.de", lastVisit: "2026-05-30" },
  { id: "9", name: "Natalia Richter", phone: "+49 175 602 3388", email: "natalia.r@email.de", lastVisit: "2026-06-02" },
  { id: "10", name: "Lucas Fischer", phone: "+49 178 991 2045", email: "lucas.fischer@web.de", lastVisit: "2026-05-25" },
  { id: "11", name: "Maria Lehmann", phone: "+49 159 880 6617", email: "maria.lehmann@gmail.com", lastVisit: "2026-06-08" },
];

export const SERVICES = [
  { id: "1", name: "Back Massage", duration: "60 min", price: "€75" },
  { id: "2", name: "Relax Massage", duration: "60 min", price: "€70" },
  { id: "3", name: "Sport Massage", duration: "75 min", price: "€95" },
  { id: "4", name: "Lymphatic Massage", duration: "50 min", price: "€85" },
  { id: "5", name: "Anti-Stress Massage", duration: "90 min", price: "€110" },
];

export const THERAPISTS = [
  { id: "1", name: "Irina Sokolova", specialty: "Deep tissue & sport", experience: "9 years", phone: "+49 170 112 4455", status: "active" },
  { id: "2", name: "Marco Bellini", specialty: "Relax & anti-stress", experience: "7 years", phone: "+49 151 998 2201", status: "active" },
  { id: "3", name: "Yuki Tanaka", specialty: "Lymphatic & wellness", experience: "11 years", phone: "+49 176 554 8890", status: "active" },
  { id: "4", name: "Helena Brandt", specialty: "Back & posture care", experience: "5 years", phone: "+49 160 331 7702", status: "on leave" },
];

export const APPOINTMENTS = [
  { id: "1", client: "Anna Petrova", therapist: "Irina Sokolova", service: "Back Massage", date: "2026-06-08 09:00", status: "confirmed" },
  { id: "2", client: "Michael Schneider", therapist: "Marco Bellini", service: "Anti-Stress Massage", date: "2026-06-08 10:30", status: "confirmed" },
  { id: "3", client: "Sofia Müller", therapist: "Yuki Tanaka", service: "Lymphatic Massage", date: "2026-06-08 11:00", status: "in progress" },
  { id: "4", client: "Elena Kozlova", therapist: "Irina Sokolova", service: "Sport Massage", date: "2026-06-08 13:00", status: "confirmed" },
  { id: "5", client: "Julia Hartmann", therapist: "Helena Brandt", service: "Relax Massage", date: "2026-06-08 14:30", status: "confirmed" },
  { id: "6", client: "Thomas Weber", therapist: "Marco Bellini", service: "Back Massage", date: "2026-06-08 16:00", status: "pending" },
  { id: "7", client: "Natalia Richter", therapist: "Yuki Tanaka", service: "Relax Massage", date: "2026-06-09 09:30", status: "confirmed" },
  { id: "8", client: "Dmitry Volkov", therapist: "Irina Sokolova", service: "Sport Massage", date: "2026-06-09 11:00", status: "confirmed" },
  { id: "9", client: "Oliver Braun", therapist: "Helena Brandt", service: "Back Massage", date: "2026-06-09 15:00", status: "cancelled" },
  { id: "10", client: "Lucas Fischer", therapist: "Marco Bellini", service: "Anti-Stress Massage", date: "2026-06-10 10:00", status: "confirmed" },
  { id: "11", client: "Maria Lehmann", therapist: "Yuki Tanaka", service: "Lymphatic Massage", date: "2026-06-10 12:30", status: "confirmed" },
  { id: "12", client: "Anna Petrova", therapist: "Helena Brandt", service: "Relax Massage", date: "2026-06-11 09:00", status: "confirmed" },
  { id: "13", client: "Michael Schneider", therapist: "Irina Sokolova", service: "Sport Massage", date: "2026-06-11 14:00", status: "pending" },
  { id: "14", client: "Sofia Müller", therapist: "Marco Bellini", service: "Back Massage", date: "2026-06-12 11:30", status: "confirmed" },
  { id: "15", client: "Julia Hartmann", therapist: "Yuki Tanaka", service: "Anti-Stress Massage", date: "2026-06-12 17:00", status: "completed" },
  { id: "16", client: "Elena Kozlova", therapist: "Irina Sokolova", service: "Lymphatic Massage", date: "2026-06-13 10:00", status: "confirmed" },
];

export const DASHBOARD_STATS = {
  clients: CLIENTS.length,
  appointmentsToday: APPOINTMENTS.filter((a) => a.date.startsWith("2026-06-08")).length,
  monthlyRevenue: "€14,280",
  activeTherapists: THERAPISTS.filter((t) => t.status === "active").length,
};

export const SCHEDULE_WEEK = [
  { day: "Mon", date: "Jun 2", slots: ["Relax — Julia H.", "Sport — Dmitry V."] },
  { day: "Tue", date: "Jun 3", slots: ["Lymphatic — Elena K.", "Back — Thomas W."] },
  { day: "Wed", date: "Jun 4", slots: ["Anti-Stress — Michael S.", "Relax — Julia H."] },
  { day: "Thu", date: "Jun 5", slots: ["Back — Anna P.", "Sport — Natalia R."] },
  { day: "Fri", date: "Jun 6", slots: ["Relax — Sofia M.", "Lymphatic — Maria L."] },
  { day: "Sat", date: "Jun 7", slots: ["Sport — Michael S.", "Back — Oliver B."] },
  { day: "Sun", date: "Jun 8", slots: ["Back — Anna P.", "Anti-Stress — Michael S.", "Lymphatic — Sofia M.", "Sport — Elena K.", "Relax — Julia H.", "Back — Thomas W."] },
];

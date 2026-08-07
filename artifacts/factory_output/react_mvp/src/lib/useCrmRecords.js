import { useCallback, useEffect, useMemo, useState } from "react";

function normalizeDefaults(defaultRecords = []) {
  return defaultRecords.map((item, index) => ({
    ...item,
    id: item.id || `seed-${index}`,
  }));
}

function isUserRecord(record) {
  return String(record?.id || "").startsWith("rec-");
}

function isSeedRecord(record) {
  return String(record?.id || "").startsWith("seed-");
}

/** Stable key for catalog-ish rows (string or {en,de,ru}). */
function recordNameKey(name) {
  if (name == null) return "";
  if (typeof name === "string") return name.trim().toLowerCase();
  if (typeof name === "object") {
    const en = String(name.en ?? "").trim().toLowerCase();
    const de = String(name.de ?? "").trim().toLowerCase();
    const ru = String(name.ru ?? "").trim().toLowerCase();
    return en || de || ru;
  }
  return "";
}

/**
 * Unpaid demos may keep scenario seeds plus user `rec-*` rows.
 * Hydrated catalog copies must replace matching seeds — never concat
 * the same product twice (that used to sync 6 names into /site forms).
 */
function mergeSeedAndUser(seeded = [], userAdded = []) {
  if (!userAdded.length) return seeded;
  if (!seeded.length) return userAdded;
  const byKey = new Map();
  for (const seed of seeded) {
    const key = recordNameKey(seed?.name) || String(seed?.id || "");
    if (key) byKey.set(key, seed);
  }
  for (const user of userAdded) {
    const key = recordNameKey(user?.name) || String(user?.id || "");
    if (key) byKey.set(key, user); // user / hydrated wins
  }
  return [...byKey.values()];
}

function readStorage(key) {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) {
      return null;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function writeStorage(key, records) {
  localStorage.setItem(key, JSON.stringify(records));
}

/**
 * Demo CRM rows are seeded from localized scenario defaults only when allowSeed=true
 * (unpaid demo). Paid CRM keeps only user `rec-*` rows — never scenario seeds.
 * When hold=true (payment status still loading), keep empty and do not touch storage.
 */
export function useCrmRecords(clientId, section, defaultRecords = [], options = {}) {
  const allowSeed = options.allowSeed === true;
  const hold = options.hold === true;
  const storageKey = clientId && section ? `mvp_crm:${clientId}:${section}` : null;
  const defaultsKey = useMemo(() => JSON.stringify(defaultRecords), [defaultRecords]);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (hold) {
      setRecords([]);
      setLoading(true);
      return;
    }

    const parsedDefaults = allowSeed ? JSON.parse(defaultsKey) : [];
    const seeded = allowSeed ? normalizeDefaults(parsedDefaults) : [];

    if (!storageKey) {
      setRecords(seeded);
      setLoading(false);
      return;
    }

    const stored = readStorage(storageKey);
    if (stored !== null) {
      const userAdded = stored.filter(isUserRecord);
      const next = allowSeed ? mergeSeedAndUser(seeded, userAdded) : userAdded;
      setRecords(next);
      writeStorage(storageKey, next);
      setLoading(false);
      return;
    }

    setRecords(seeded);
    if (seeded.length > 0) {
      writeStorage(storageKey, seeded);
    } else if (!allowSeed) {
      writeStorage(storageKey, []);
    }
    setLoading(false);
  }, [storageKey, defaultsKey, allowSeed, hold]);

  const persist = useCallback(
    (next) => {
      setRecords(next);
      if (storageKey) {
        writeStorage(storageKey, next);
      }
    },
    [storageKey],
  );

  const addRecord = useCallback(
    (data) => {
      const payload = {
        ...data,
        id: `rec-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        createdAt: Date.now(),
      };
      setRecords((prev) => {
        const next = [payload, ...prev];
        if (storageKey) {
          writeStorage(storageKey, next);
        }
        return next;
      });
      return payload;
    },
    [storageKey],
  );

  const updateRecord = useCallback(
    (id, data) => {
      setRecords((prev) => {
        const next = prev.map((record) => (record.id === id ? { ...record, ...data } : record));
        if (storageKey) {
          writeStorage(storageKey, next);
        }
        return next;
      });
    },
    [storageKey],
  );

  const deleteRecord = useCallback(
    (id) => {
      setRecords((prev) => {
        const next = prev.filter((record) => record.id !== id);
        if (storageKey) {
          writeStorage(storageKey, next);
        }
        return next;
      });
    },
    [storageKey],
  );

  const mergeRemoteRecords = useCallback(
    (remoteRecords = []) => {
      if (!Array.isArray(remoteRecords) || remoteRecords.length === 0) return 0;
      const baseline = storageKey ? readStorage(storageKey) || [] : [];
      const existingIds = new Set(baseline.map((item) => String(item?.id || "")));
      const incoming = remoteRecords.filter(
        (item) => item && isUserRecord(item) && !existingIds.has(String(item.id)),
      );
      if (incoming.length === 0) return 0;
      const next = [...incoming, ...baseline];
      if (storageKey) writeStorage(storageKey, next);
      setRecords(next);
      return incoming.length;
    },
    [storageKey],
  );

  return {
    records,
    loading,
    addRecord,
    updateRecord,
    deleteRecord,
    reload: () => {},
    persist,
    mergeRemoteRecords,
    isSeedRecord,
  };
}

/** Merge remote `rec-*` rows (e.g. site leads from API) without touching seeds. */
export function mergeRemoteIntoStorage(clientId, section, remoteRecords = []) {
  if (!clientId || !section || !Array.isArray(remoteRecords) || remoteRecords.length === 0) {
    return [];
  }
  const storageKey = `mvp_crm:${clientId}:${section}`;
  const stored = readStorage(storageKey) || [];
  const existingIds = new Set(stored.map((item) => String(item?.id || "")));
  const incoming = remoteRecords.filter(
    (item) => item && isUserRecord(item) && !existingIds.has(String(item.id)),
  );
  if (incoming.length === 0) return [];
  const next = [...incoming, ...stored];
  writeStorage(storageKey, next);
  return incoming;
}

/** Remove seed-* rows from all known CRM sections for a client (paid transition). */
export function purgeSeedRecords(clientId, sections = []) {
  if (!clientId) return;
  for (const section of sections) {
    const key = `mvp_crm:${clientId}:${section}`;
    const stored = readStorage(key);
    if (!stored) continue;
    const userOnly = stored.filter(isUserRecord);
    writeStorage(key, userOnly);
  }
}

export const CRM_STORAGE_SECTIONS = [
  "clients",
  "appointments",
  "services",
  "staff",
  "payments",
  "assets",
  "orders",
];

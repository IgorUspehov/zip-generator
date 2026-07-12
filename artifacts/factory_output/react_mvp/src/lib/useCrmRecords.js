import { useCallback, useEffect, useMemo, useState } from "react";

function normalizeDefaults(defaultRecords = []) {
  return defaultRecords.map((item, index) => ({
    ...item,
    id: item.id || `seed-${index}`,
  }));
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

export function useCrmRecords(clientId, section, defaultRecords = []) {
  const storageKey = clientId && section ? `mvp_crm:${clientId}:${section}` : null;
  const defaultsKey = useMemo(() => JSON.stringify(defaultRecords), [defaultRecords]);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const parsedDefaults = JSON.parse(defaultsKey);

    if (!storageKey) {
      setRecords(normalizeDefaults(parsedDefaults));
      setLoading(false);
      return;
    }

    const stored = readStorage(storageKey);
    if (stored !== null) {
      setRecords(stored);
      setLoading(false);
      return;
    }

    const seeded = normalizeDefaults(parsedDefaults);
    setRecords(seeded);
    if (seeded.length > 0) {
      writeStorage(storageKey, seeded);
    }
    setLoading(false);
  }, [storageKey, defaultsKey]);

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

  return { records, loading, addRecord, updateRecord, deleteRecord, reload: () => {} };
}

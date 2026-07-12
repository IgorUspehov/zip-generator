// Универсальный CRUD-хук на Firestore. Работает для ЛЮБОЙ ниши и ЛЮБОГО
// раздела (clients/patients/appointments/services/staff/doctors и т.д.) —
// не нужно писать отдельный код под каждую нишу.
//
// Данные хранятся по пути: mvp_clients/{clientId}/{section}/{recordId}
// где clientId — это тот же clientId, что уже используется в URL
// (?clientId=...), section — название раздела (например "clients").

import { useState, useEffect, useCallback } from "react";
import {
  db,
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  orderBy,
} from "./firebaseClient.js";

export function useCrmRecords(clientId, section) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!clientId || !section) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const q = query(
        collection(db, "mvp_clients", clientId, section),
        orderBy("createdAt", "desc")
      );
      const snap = await getDocs(q);
      setRecords(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch (e) {
      console.error("[useCrmRecords] failed to load", section, e);
      setRecords([]);
    }
    setLoading(false);
  }, [clientId, section]);

  useEffect(() => {
    load();
  }, [load]);

  async function addRecord(data) {
    if (!clientId) return null;
    const payload = { ...data, createdAt: Date.now() };
    const ref = await addDoc(collection(db, "mvp_clients", clientId, section), payload);
    const newRecord = { id: ref.id, ...payload };
    setRecords((prev) => [newRecord, ...prev]);
    return newRecord;
  }

  async function updateRecord(id, data) {
    if (!clientId) return;
    await updateDoc(doc(db, "mvp_clients", clientId, section, id), data);
    setRecords((prev) => prev.map((r) => (r.id === id ? { ...r, ...data } : r)));
  }

  async function deleteRecord(id) {
    if (!clientId) return;
    await deleteDoc(doc(db, "mvp_clients", clientId, section, id));
    setRecords((prev) => prev.filter((r) => r.id !== id));
  }

  return { records, loading, addRecord, updateRecord, deleteRecord, reload: load };
}

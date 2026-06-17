import api from "./api";

const normalizeId = (id) => {
  if (!id) return "";
  if (typeof id === "string") return id;
  if (id.$oid) return id.$oid;
  if (id.oid) return id.oid;
  if (id.toString && id.toString !== Object.prototype.toString) return id.toString();
  return "";
};

export const normalizeJournal = (entry) => ({
  ...entry,
  id: normalizeId(entry.id),
  favorite: Boolean(entry.favorite),
  mood: entry.mood || "",
  tags: Array.isArray(entry.tags) ? entry.tags : [],
});

export const getJournals = async () => {
  const response = await api.get("/journal");
  return Array.isArray(response.data) ? response.data.map(normalizeJournal) : [];
};

export const getJournalById = async (id) => {
  const response = await api.get(`/journal/id/${id}`);
  return normalizeJournal(response.data);
};

export const createJournal = async (payload) => {
  const response = await api.post("/journal", payload);
  return response.data ? normalizeJournal(response.data) : response.data;
};

export const updateJournal = async (id, payload) => {
  const response = await api.put(`/journal/id/${id}`, payload);
  return normalizeJournal(response.data);
};

export const updateFavorite = async (id, favorite) => {
  const response = await api.patch(`/journal/id/${id}/favorite`, { favorite });
  return normalizeJournal(response.data);
};

export const deleteJournal = async (id) => {
  await api.delete(`/journal/id/${id}`);
};

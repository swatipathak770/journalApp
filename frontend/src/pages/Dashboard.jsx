import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import JournalCard from "../components/JournalCard";
import ConfirmModal from "../components/ConfirmModal";
import { deleteJournal, getJournals, updateFavorite } from "../services/journalService";

function Dashboard() {
  const [entries, setEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    const loadJournals = async () => {
      try {
        const journals = await getJournals();
        setEntries(journals);
      } catch (caughtError) {
        if (caughtError.response?.status === 404) {
          setEntries([]);
          return;
        }

        if (caughtError.response?.status === 401 || caughtError.response?.status === 403) {
          setError("Your session expired. Please login again.");
          return;
        }

        setError(caughtError.response?.data?.message || "Could not load your journals. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    loadJournals();
  }, []);

  const filteredEntries = useMemo(() => {
    const query = search.trim().toLowerCase();

    return [...entries]
      .filter((entry) => {
        const text = `${entry.title || ""} ${entry.content || ""}`.toLowerCase();
        return text.includes(query);
      })
      .sort((a, b) => {
        if (sortBy === "favorites") return Number(b.favorite) - Number(a.favorite);
        if (sortBy === "oldest") return new Date(a.date || 0) - new Date(b.date || 0);
        return new Date(b.date || 0) - new Date(a.date || 0);
      });
  }, [entries, search, sortBy]);

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      await deleteJournal(deleteTarget.id);
      setEntries((current) => current.filter((entry) => entry.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch {
      setError("Could not delete this journal. Please refresh and try again.");
    }
  };

  const handleToggleFavorite = async (entry) => {
    const nextEntry = { ...entry, favorite: !entry.favorite };
    setEntries((current) => current.map((item) => (item.id === entry.id ? nextEntry : item)));

    try {
      const savedEntry = await updateFavorite(entry.id, nextEntry.favorite);
      setEntries((current) => current.map((item) => (item.id === entry.id ? savedEntry : item)));
    } catch {
      setEntries((current) => current.map((item) => (item.id === entry.id ? entry : item)));
      setError("Could not update favorite status. Please refresh and try again.");
    }
  };

  return (
    <MainLayout>
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
              Your private space
            </p>
            <h1 className="mt-3 text-4xl font-black text-slate-950 dark:text-white sm:text-6xl">Dashboard</h1>
          </div>

          <Link
            to="/journals/new"
            className="w-fit rounded-xl bg-indigo-700 px-6 py-3 font-bold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 hover:bg-indigo-800"
          >
            Create Journal
          </Link>
        </div>

        <div className="mb-6 grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:grid-cols-[1fr_180px]">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search journals..."
            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 outline-none focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-indigo-500 dark:focus:ring-indigo-950"
          />
          <select
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 outline-none focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-indigo-500 dark:focus:ring-indigo-950"
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="favorites">Favorites</option>
          </select>
        </div>

        {error ? (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </div>
        ) : null}

        {isLoading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
            Loading journals...
          </div>
        ) : filteredEntries.length ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            <AnimatePresence>
              {filteredEntries.map((entry) => (
                <JournalCard
                  key={entry.id || entry.title}
                  entry={entry}
                  onDelete={() => setDeleteTarget(entry)}
                  onToggleFavorite={handleToggleFavorite}
                />
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-slate-950 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-white">
            <h2 className="text-2xl font-black">No journals found</h2>
            <p className="mt-3 max-w-2xl text-slate-600 dark:text-slate-300">
              Create a new entry or adjust your search to see matching journals.
            </p>
          </div>
        )}
      </motion.div>

      {deleteTarget ? (
        <ConfirmModal
          title="Delete journal?"
          message={`This will permanently delete "${deleteTarget.title}".`}
          confirmLabel="Delete"
          onCancel={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
        />
      ) : null}
    </MainLayout>
  );
}

export default Dashboard;
